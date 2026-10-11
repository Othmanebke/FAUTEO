-- =====================================================================
-- Fauteo — 0500 : réservations, tarification, paiements, versements, caution
-- CDC : F-11, F-30 à F-35, F-41, §6 (commission, versement, annulation, caution)
--
-- Principe : toute la logique métier vit ici pour être partagée par le
-- web et la future appli mobile. Les appels Stripe sont faits côté
-- serveur, qui lit ces tables et y reporte les résultats (service_role).
--
-- Règles de prix retenues (non précisées par le CDC, à valider) :
--   * hour     : prix horaire × nombre d'heures, majoration week-end si le
--                créneau commence un samedi ou un dimanche ;
--   * half_day : un bloc de N heures (platform_settings.half_day_hours) ;
--   * day      : jours calendaires consécutifs, majoration sur chaque
--                samedi/dimanche inclus ;
--   * week     : blocs de 7 jours, sans majoration ;
--   * month    : mois calendaires glissants, sans majoration.
-- Frais : pro = sous-total × pro_fee_bps ; hôte = sous-total × host_fee_bps.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Réservations
-- ---------------------------------------------------------------------
create sequence public.booking_reference_seq;

create table public.bookings (
  id                      uuid primary key default gen_random_uuid(),
  reference               text not null unique default (
                            'FAU-' || to_char(now() at time zone 'Europe/Paris', 'YY') || '-'
                            || lpad(nextval('public.booking_reference_seq')::text, 6, '0')),
  station_id              uuid not null references public.stations (id) on delete restrict,
  venue_id                uuid not null references public.venues (id) on delete restrict,
  host_id                 uuid not null references public.profiles (id) on delete restrict,
  pro_id                  uuid not null references public.profiles (id) on delete restrict,
  unit                    public.price_unit not null,
  quantity                integer not null check (quantity between 1 and 365),
  period                  tstzrange not null check (not isempty(period) and lower_inc(period) and not upper_inc(period)),
  status                  public.booking_status not null default 'awaiting_payment',
  -- Conditions figées au moment de la réservation
  booking_mode            public.booking_mode not null,
  cancellation_policy     public.cancellation_policy not null,
  pro_fee_bps             integer not null,
  host_fee_bps            integer not null,
  base_cents              integer not null check (base_cents >= 0),
  surcharge_cents         integer not null check (surcharge_cents >= 0),
  subtotal_cents          integer not null check (subtotal_cents >= 0),  -- prix de la location
  pro_fee_cents           integer not null check (pro_fee_cents >= 0),
  host_fee_cents          integer not null check (host_fee_cents >= 0),
  total_cents             integer not null check (total_cents >= 0),     -- débité au pro
  host_payout_cents       integer not null check (host_payout_cents >= 0),
  deposit_cents           integer not null default 0 check (deposit_cents >= 0),
  deposit_strategy        public.deposit_strategy,
  currency                text not null default 'eur',
  pro_message             text check (char_length(pro_message) <= 1000),
  house_rules_accepted_at timestamptz not null, -- F-41
  -- Cycle de vie
  hold_expires_at         timestamptz,
  request_expires_at      timestamptz,
  confirmed_at            timestamptz,
  declined_at             timestamptz,
  completed_at            timestamptz,
  cancelled_at            timestamptz,
  cancelled_by            public.actor,
  cancellation_reason     text,
  refund_cents            integer not null default 0 check (refund_cents >= 0),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  constraint bookings_distinct_parties check (host_id <> pro_id),
  -- Impossible de réserver deux fois le même poste sur des créneaux qui se chevauchent
  constraint bookings_no_overlap exclude using gist (station_id with =, period with &&)
    where (status in ('awaiting_payment', 'requested', 'confirmed', 'in_progress'))
);

create index bookings_pro_idx     on public.bookings (pro_id, created_at desc);
create index bookings_host_idx    on public.bookings (host_id, created_at desc);
create index bookings_station_idx on public.bookings using gist (station_id, period);
create index bookings_status_idx  on public.bookings (status)
  where status in ('awaiting_payment', 'requested', 'confirmed', 'in_progress');

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Paiements (miroir des objets Stripe), versements, caution
-- ---------------------------------------------------------------------
create table public.payments (
  id                       uuid primary key default gen_random_uuid(),
  booking_id               uuid not null references public.bookings (id) on delete restrict,
  kind                     public.payment_kind not null,
  amount_cents             integer not null check (amount_cents > 0),
  status                   public.payment_status not null default 'pending',
  stripe_payment_intent_id text,
  stripe_charge_id         text,
  stripe_refund_id         text unique,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create unique index payments_charge_intent_uidx on public.payments (stripe_payment_intent_id) where kind = 'charge';
create index payments_booking_idx on public.payments (booking_id);

create trigger payments_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

-- Versements à l'hôte (transferts Stripe Connect)
-- Location ≤ 1 jour : un versement 24 h après le début.
-- Semaine / mois    : un versement par tranche de 7 jours, chacun 24 h
--                     après le début de la tranche (limite l'exposition du pro).
create table public.payouts (
  id                 uuid primary key default gen_random_uuid(),
  booking_id         uuid not null references public.bookings (id) on delete restrict,
  host_id            uuid not null references public.profiles (id) on delete restrict,
  installment        smallint not null default 1,
  amount_cents       integer not null check (amount_cents > 0),
  scheduled_for      timestamptz not null,
  status             public.payout_status not null default 'scheduled',
  stripe_transfer_id text unique,
  paid_at            timestamptz,
  failure_reason     text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index payouts_due_idx on public.payouts (scheduled_for) where status = 'scheduled';
create index payouts_booking_idx on public.payouts (booking_id);
create index payouts_host_idx on public.payouts (host_id, scheduled_for desc);

create trigger payouts_updated_at
  before update on public.payouts
  for each row execute function public.set_updated_at();

create table public.deposits (
  id                       uuid primary key default gen_random_uuid(),
  booking_id               uuid not null unique references public.bookings (id) on delete restrict,
  amount_cents             integer not null check (amount_cents > 0),
  strategy                 public.deposit_strategy not null,
  status                   public.deposit_status not null default 'scheduled',
  hold_at                  timestamptz,           -- stratégie « hold » : pose de l'empreinte
  release_at               timestamptz not null,  -- fin + 48 h sans signalement
  captured_cents           integer not null default 0 check (captured_cents >= 0),
  stripe_payment_intent_id text unique,
  stripe_payment_method_id text,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

create index deposits_hold_due_idx on public.deposits (hold_at) where status = 'scheduled';
create index deposits_release_due_idx on public.deposits (release_at) where status in ('held', 'scheduled');

create trigger deposits_updated_at
  before update on public.deposits
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Calcul du créneau et du prix
-- ---------------------------------------------------------------------
create type public.booking_quote as (
  period            tstzrange,
  unit              public.price_unit,
  quantity          integer,
  base_cents        integer,
  surcharge_cents   integer,
  subtotal_cents    integer,
  pro_fee_cents     integer,
  host_fee_cents    integer,
  total_cents       integer,
  host_payout_cents integer,
  deposit_cents     integer,
  deposit_strategy  public.deposit_strategy
);

-- Arrondi au centime le plus proche d'un montant × taux en points de base
create function public.apply_bps(amount integer, bps integer)
returns integer
language sql
immutable
set search_path = ''
as $$
  select ((amount::bigint * bps + 5000) / 10000)::integer;
$$;

create function public.local_midnight(d date)
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select d::timestamp at time zone 'Europe/Paris';
$$;

create function public.booking_period(p_unit public.price_unit, p_start timestamptz, p_quantity integer)
returns tstzrange
language plpgsql
stable
set search_path = ''
as $$
declare
  half_day integer;
  d date := (p_start at time zone 'Europe/Paris')::date;
begin
  if p_quantity is null or p_quantity < 1 then
    raise exception 'Quantité invalide.' using errcode = 'check_violation';
  end if;

  case p_unit
    when 'hour' then
      return tstzrange(p_start, p_start + make_interval(hours => p_quantity), '[)');
    when 'half_day' then
      if p_quantity <> 1 then
        raise exception 'Une demi-journée se réserve à l''unité.' using errcode = 'check_violation';
      end if;
      select s.half_day_hours into half_day from public.platform_settings s;
      return tstzrange(p_start, p_start + make_interval(hours => half_day), '[)');
    when 'day' then
      return tstzrange(public.local_midnight(d), public.local_midnight(d + p_quantity), '[)');
    when 'week' then
      return tstzrange(public.local_midnight(d), public.local_midnight(d + 7 * p_quantity), '[)');
    when 'month' then
      return tstzrange(public.local_midnight(d), public.local_midnight((d + make_interval(months => p_quantity))::date), '[)');
  end case;
  raise exception 'Unité inconnue : %', p_unit;
end;
$$;

create function public.quote_booking(p_station uuid, p_unit public.price_unit, p_start timestamptz, p_quantity integer)
returns public.booking_quote
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  st       public.stations;
  cfg      public.platform_settings;
  q        public.booking_quote;
  unit_price integer;
  weekend_units integer := 0;
  d date;
begin
  select * into st from public.stations where id = p_station
    and (status = 'published' or host_id = auth.uid() or auth.role() = 'service_role');
  if st.id is null then
    raise exception 'Poste introuvable ou non publié.' using errcode = 'no_data_found';
  end if;
  select * into cfg from public.platform_settings;

  unit_price := case p_unit
    when 'hour'     then st.price_hour_cents
    when 'half_day' then st.price_half_day_cents
    when 'day'      then st.price_day_cents
    when 'week'     then st.price_week_cents
    when 'month'    then st.price_month_cents
  end;
  if unit_price is null then
    raise exception 'Ce poste ne se loue pas à cette durée.' using errcode = 'check_violation', hint = 'UNIT_NOT_OFFERED';
  end if;

  q.unit     := p_unit;
  q.quantity := p_quantity;
  q.period   := public.booking_period(p_unit, p_start, p_quantity);
  q.base_cents := unit_price * p_quantity;

  if p_unit in ('hour', 'half_day') then
    if extract(isodow from lower(q.period) at time zone 'Europe/Paris') in (6, 7) then
      weekend_units := 1;
      q.surcharge_cents := public.apply_bps(q.base_cents, st.weekend_surcharge_bps);
    end if;
  elsif p_unit = 'day' then
    d := (lower(q.period) at time zone 'Europe/Paris')::date;
    select count(*) into weekend_units
    from generate_series(d::timestamp, (d + p_quantity - 1)::timestamp, interval '1 day') as g(day)
    where extract(isodow from g.day) in (6, 7);
    q.surcharge_cents := weekend_units * public.apply_bps(unit_price, st.weekend_surcharge_bps);
  end if;
  q.surcharge_cents := coalesce(q.surcharge_cents, 0);

  q.subtotal_cents    := q.base_cents + q.surcharge_cents;
  q.pro_fee_cents     := public.apply_bps(q.subtotal_cents, cfg.pro_fee_bps);
  q.host_fee_cents    := public.apply_bps(q.subtotal_cents, cfg.host_fee_bps);
  q.total_cents       := q.subtotal_cents + q.pro_fee_cents;
  q.host_payout_cents := q.subtotal_cents - q.host_fee_cents;
  q.deposit_cents     := st.deposit_cents;
  q.deposit_strategy  := case
    when st.deposit_cents = 0 then null
    when upper(q.period) - lower(q.period) <= make_interval(days => cfg.deposit_hold_max_days) then 'hold'
    else 'saved_card'
  end::public.deposit_strategy;

  return q;
end;
$$;

-- ---------------------------------------------------------------------
-- Disponibilité
-- Renvoie null si le créneau est libre, sinon un code de refus.
-- ---------------------------------------------------------------------
create function public.station_unavailability(p_station uuid, p_unit public.price_unit, p_period tstzrange,
                                              p_ignore_booking uuid default null)
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  local_start timestamp := lower(p_period) at time zone 'Europe/Paris';
  local_end   timestamp := upper(p_period) at time zone 'Europe/Paris';
  d date;
begin
  if lower(p_period) <= now() then
    return 'IN_THE_PAST';
  end if;

  if exists (select 1 from public.availability_blocks b
             where b.station_id = p_station and b.period && p_period) then
    return 'BLOCKED';
  end if;

  if exists (select 1 from public.bookings b
             where b.station_id = p_station and b.period && p_period
               and b.status in ('awaiting_payment', 'requested', 'confirmed', 'in_progress')
               and b.id is distinct from p_ignore_booking) then
    return 'ALREADY_BOOKED';
  end if;

  if p_unit in ('hour', 'half_day') then
    -- Le créneau doit tenir dans une plage d'ouverture d'une même journée
    if local_end::date <> local_start::date then
      return 'OUTSIDE_OPENING_HOURS';
    end if;
    if not exists (
      select 1 from public.availability_rules r
      where r.station_id = p_station
        and r.weekday = extract(isodow from local_start)
        and local_start::date between r.valid_from and coalesce(r.valid_until, 'infinity'::date)
        and local_start::time >= r.start_time
        and local_end::time   <= r.end_time
    ) then
      return 'OUTSIDE_OPENING_HOURS';
    end if;
  elsif p_unit = 'day' then
    -- Chaque jour réservé doit être un jour d'ouverture
    for d in select g::date from generate_series(local_start::date::timestamp, (local_end::date - 1)::timestamp, interval '1 day') g loop
      if not exists (
        select 1 from public.availability_rules r
        where r.station_id = p_station
          and r.weekday = extract(isodow from d)
          and d between r.valid_from and coalesce(r.valid_until, 'infinity'::date)
      ) then
        return 'CLOSED_DAY';
      end if;
    end loop;
  end if;

  return null;
end;
$$;

-- Un blocage manuel ne peut pas recouvrir une réservation active
create function public.block_must_not_overlap_bookings()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if exists (select 1 from public.bookings b
             where b.station_id = new.station_id and b.period && new.period
               and b.status in ('awaiting_payment', 'requested', 'confirmed', 'in_progress')) then
    raise exception 'Une réservation existe déjà sur cette période.' using errcode = 'P0001', hint = 'ALREADY_BOOKED';
  end if;
  return new;
end;
$$;

create trigger availability_blocks_no_overlap
  before insert or update on public.availability_blocks
  for each row execute function public.block_must_not_overlap_bookings();

-- ---------------------------------------------------------------------
-- Création d'une réservation par un pro
-- ---------------------------------------------------------------------
create function public.create_booking(
  p_station            uuid,
  p_unit               public.price_unit,
  p_start              timestamptz,
  p_quantity           integer,
  p_accept_house_rules boolean,
  p_message            text default null
)
returns public.bookings
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid  uuid := auth.uid();
  st   public.stations;
  cfg  public.platform_settings;
  q    public.booking_quote;
  refusal text;
  b    public.bookings;
begin
  if uid is null then
    raise exception 'Connexion requise.' using errcode = 'insufficient_privilege';
  end if;
  if public.is_suspended(uid) then
    raise exception 'Compte suspendu.' using errcode = 'insufficient_privilege', hint = 'ACCOUNT_SUSPENDED';
  end if;
  -- CDC §6 : aucune réservation sans SIRET valide et RC pro à jour
  if not public.is_verified(uid, 'pro') then
    raise exception 'Vos documents doivent être validés avant de réserver.' using errcode = 'P0001', hint = 'KYC_REQUIRED';
  end if;
  if not coalesce(p_accept_house_rules, false) then
    raise exception 'L''acceptation du règlement intérieur est obligatoire.' using errcode = 'P0001', hint = 'HOUSE_RULES_REQUIRED';
  end if;

  select * into st from public.stations where id = p_station and status = 'published';
  if st.id is null then
    raise exception 'Poste introuvable ou non publié.' using errcode = 'no_data_found';
  end if;
  if st.host_id = uid then
    raise exception 'Vous ne pouvez pas réserver votre propre poste.' using errcode = 'P0001';
  end if;

  select * into cfg from public.platform_settings;
  q := public.quote_booking(p_station, p_unit, p_start, p_quantity);

  refusal := public.station_unavailability(p_station, p_unit, q.period);
  if refusal is not null then
    raise exception 'Créneau indisponible.' using errcode = 'P0001', hint = refusal;
  end if;

  insert into public.bookings (
    station_id, venue_id, host_id, pro_id, unit, quantity, period, status,
    booking_mode, cancellation_policy, pro_fee_bps, host_fee_bps,
    base_cents, surcharge_cents, subtotal_cents, pro_fee_cents, host_fee_cents, total_cents, host_payout_cents,
    deposit_cents, deposit_strategy, pro_message, house_rules_accepted_at, hold_expires_at
  ) values (
    st.id, st.venue_id, st.host_id, uid, p_unit, p_quantity, q.period, 'awaiting_payment',
    st.booking_mode, st.cancellation_policy, cfg.pro_fee_bps, cfg.host_fee_bps,
    q.base_cents, q.surcharge_cents, q.subtotal_cents, q.pro_fee_cents, q.host_fee_cents, q.total_cents, q.host_payout_cents,
    q.deposit_cents, q.deposit_strategy, nullif(trim(p_message), ''), now(),
    now() + make_interval(mins => cfg.payment_hold_minutes)
  )
  returning * into b;

  return b;
exception
  when exclusion_violation then
    raise exception 'Créneau indisponible.' using errcode = 'P0001', hint = 'ALREADY_BOOKED';
end;
$$;

-- ---------------------------------------------------------------------
-- Planification des versements et de la caution à la confirmation
-- ---------------------------------------------------------------------
create function public.schedule_booking_money(b public.bookings)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  cfg   public.platform_settings;
  n     integer;
  share integer;
begin
  select * into cfg from public.platform_settings;

  if b.host_payout_cents > 0 then
    if b.unit in ('week', 'month') then
      n := ceil(extract(epoch from upper(b.period) - lower(b.period)) / 604800.0)::integer;
    else
      n := 1;
    end if;
    share := b.host_payout_cents / n;
    for k in 0 .. n - 1 loop
      insert into public.payouts (booking_id, host_id, installment, amount_cents, scheduled_for)
      values (
        b.id, b.host_id, k + 1,
        case when k = n - 1 then b.host_payout_cents - share * (n - 1) else share end,
        lower(b.period) + make_interval(days => 7 * k, hours => cfg.payout_delay_hours)
      );
    end loop;
  end if;

  if b.deposit_cents > 0 then
    insert into public.deposits (booking_id, amount_cents, strategy, hold_at, release_at)
    values (
      b.id, b.deposit_cents, b.deposit_strategy,
      case when b.deposit_strategy = 'hold' then greatest(now(), lower(b.period) - interval '24 hours') end,
      upper(b.period) + make_interval(hours => cfg.deposit_release_hours)
    );
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- Paiement autorisé (appelé par le webhook Stripe, service_role)
-- Réservation instantanée : confirmée. Sur demande : en attente de
-- l'hôte, 24 h maximum et jamais au-delà du début du créneau.
-- ---------------------------------------------------------------------
create function public.booking_payment_authorized(p_booking uuid)
returns public.bookings
language plpgsql
security definer
set search_path = ''
as $$
declare
  cfg public.platform_settings;
  b   public.bookings;
begin
  select * into cfg from public.platform_settings;

  update public.bookings
     set status             = case when booking_mode = 'instant' then 'confirmed' else 'requested' end::public.booking_status,
         confirmed_at       = case when booking_mode = 'instant' then now() end,
         request_expires_at = case when booking_mode = 'request'
                                   then least(now() + make_interval(hours => cfg.request_expiry_hours), lower(period)) end,
         hold_expires_at    = null
   where id = p_booking and status = 'awaiting_payment'
  returning * into b;

  if b.id is null then
    raise exception 'Réservation introuvable ou déjà traitée.' using errcode = 'P0001';
  end if;

  if b.status = 'confirmed' then
    perform public.schedule_booking_money(b);
  end if;
  return b;
end;
$$;

-- ---------------------------------------------------------------------
-- Réponse de l'hôte à une demande (F-31)
-- Le serveur capture ou annule ensuite le PaymentIntent Stripe.
-- ---------------------------------------------------------------------
create function public.respond_to_booking(p_booking uuid, p_accept boolean, p_reason text default null)
returns public.bookings
language plpgsql
security definer
set search_path = ''
as $$
declare
  b public.bookings;
begin
  update public.bookings
     set status              = case when p_accept then 'confirmed' else 'declined' end::public.booking_status,
         confirmed_at        = case when p_accept then now() end,
         declined_at         = case when p_accept then null else now() end,
         cancellation_reason = case when p_accept then null else p_reason end,
         refund_cents        = case when p_accept then 0 else total_cents end
   where id = p_booking
     and host_id = auth.uid()
     and status = 'requested'
     and request_expires_at > now()
  returning * into b;

  if b.id is null then
    raise exception 'Demande introuvable, expirée ou déjà traitée.' using errcode = 'P0001';
  end if;

  if p_accept then
    perform public.schedule_booking_money(b);
  end if;
  return b;
end;
$$;

-- ---------------------------------------------------------------------
-- Annulation (F-35, CDC §6)
-- Hôte, admin ou système : remboursement intégral (frais compris).
-- Pro : remboursement d'une part du prix de la location selon la règle ;
--       les frais de service du pro ne sont pas remboursés.
--   flexible : 100 % jusqu'à 24 h avant le début
--   moderate : 100 % jusqu'à 5 jours avant, 50 % jusqu'à 48 h avant
--   strict   : 50 % jusqu'à 7 jours avant
-- ---------------------------------------------------------------------
create function public.cancellation_refund_cents(
  p_policy public.cancellation_policy,
  p_by public.actor,
  p_start timestamptz,
  p_at timestamptz,
  p_subtotal integer,
  p_total integer
)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case
    when p_by <> 'pro' then p_total
    else public.apply_bps(p_subtotal, case p_policy
      when 'flexible' then case when p_at <= p_start - interval '24 hours' then 10000 else 0 end
      when 'moderate' then case when p_at <= p_start - interval '5 days'   then 10000
                                when p_at <= p_start - interval '48 hours' then 5000 else 0 end
      when 'strict'   then case when p_at <= p_start - interval '7 days'   then 5000 else 0 end
    end)
  end;
$$;

-- Aperçu du remboursement avant confirmation de l'annulation
create function public.preview_cancellation(p_booking uuid)
returns integer
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  b public.bookings;
  by_actor public.actor;
begin
  select * into b from public.bookings where id = p_booking;
  if b.id is null or auth.uid() not in (b.pro_id, b.host_id) then
    raise exception 'Réservation introuvable.' using errcode = 'no_data_found';
  end if;
  by_actor := case when auth.uid() = b.host_id then 'host' else 'pro' end::public.actor;

  return case b.status
    when 'awaiting_payment' then 0
    when 'requested'        then b.total_cents
    else public.cancellation_refund_cents(b.cancellation_policy, by_actor, lower(b.period), now(),
                                          b.subtotal_cents, b.total_cents)
  end;
end;
$$;

create function public.cancel_booking(p_booking uuid, p_reason text default null)
returns public.bookings
language plpgsql
security definer
set search_path = ''
as $$
declare
  cfg      public.platform_settings;
  b        public.bookings;
  by_actor public.actor;
  refund   integer;
  retained integer;
  host_net integer;
begin
  select * into b from public.bookings where id = p_booking for update;
  if b.id is null then
    raise exception 'Réservation introuvable.' using errcode = 'no_data_found';
  end if;

  by_actor := case
    when auth.uid() = b.pro_id  then 'pro'
    when auth.uid() = b.host_id then 'host'
    when public.is_admin()      then 'admin'
    when auth.role() = 'service_role' then 'system'
  end::public.actor;
  if by_actor is null then
    raise exception 'Réservation introuvable.' using errcode = 'no_data_found';
  end if;

  if b.status not in ('awaiting_payment', 'requested', 'confirmed')
     or (b.status = 'confirmed' and lower(b.period) <= now() and by_actor in ('pro', 'host')) then
    raise exception 'Cette réservation ne peut plus être annulée. Ouvrez un litige si nécessaire.'
      using errcode = 'P0001', hint = 'NOT_CANCELLABLE';
  end if;

  refund := case b.status
    when 'awaiting_payment' then 0
    when 'requested'        then b.total_cents
    else public.cancellation_refund_cents(b.cancellation_policy, by_actor, lower(b.period), now(),
                                          b.subtotal_cents, b.total_cents)
  end;

  update public.bookings
     set status = 'cancelled', cancelled_at = now(), cancelled_by = by_actor,
         cancellation_reason = p_reason, refund_cents = refund
   where id = b.id
  returning * into b;

  -- Les versements et la caution prévus sont annulés
  update public.payouts  set status = 'cancelled' where booking_id = b.id and status in ('scheduled', 'held');
  update public.deposits set status = 'cancelled' where booking_id = b.id and status = 'scheduled';

  -- Annulation tardive par le pro : l'hôte perçoit la part non remboursée, nette de commission
  if by_actor = 'pro' and b.confirmed_at is not null then
    select * into cfg from public.platform_settings;
    retained := b.subtotal_cents - least(refund, b.subtotal_cents);
    host_net := retained - public.apply_bps(retained, b.host_fee_bps);
    if host_net > 0 then
      insert into public.payouts (booking_id, host_id, installment, amount_cents, scheduled_for)
      values (b.id, b.host_id, 1, host_net, now() + make_interval(hours => cfg.payout_delay_hours));
    end if;
  end if;

  -- Annulation par l'hôte : compteur pour pénalité / baisse de visibilité (CDC §6)
  if by_actor = 'host' and b.confirmed_at is not null then
    update public.host_profiles set cancellation_count = cancellation_count + 1 where profile_id = b.host_id;
  end if;

  insert into public.audit_log (actor_id, action, entity, entity_id, data)
  values (auth.uid(), 'booking.cancel', 'bookings', b.id,
          jsonb_build_object('by', by_actor, 'refund_cents', refund, 'reason', p_reason));

  return b;
end;
$$;

-- ---------------------------------------------------------------------
-- Transitions temporelles (exécutées chaque minute par pg_cron)
-- ---------------------------------------------------------------------
create function public.advance_booking_statuses()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Paiement non finalisé : le créneau est libéré
  update public.bookings set status = 'expired', cancelled_by = 'system', cancelled_at = now()
   where status = 'awaiting_payment' and hold_expires_at <= now();

  -- Hôte sans réponse sous 24 h : expiration et remboursement intégral (F-31)
  update public.bookings set status = 'expired', cancelled_by = 'system', cancelled_at = now(),
         refund_cents = total_cents
   where status = 'requested' and request_expires_at <= now();

  update public.bookings set status = 'in_progress'
   where status = 'confirmed' and lower(period) <= now();

  update public.bookings set status = 'completed', completed_at = now()
   where status = 'in_progress' and upper(period) <= now();
end;
$$;

-- ---------------------------------------------------------------------
-- Privilèges et RLS : écriture uniquement via les fonctions ci-dessus
-- ---------------------------------------------------------------------
revoke insert, update, delete on public.bookings, public.payments, public.payouts, public.deposits
  from anon, authenticated;

alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.payouts  enable row level security;
alter table public.deposits enable row level security;

create policy "bookings: lecture par les parties" on public.bookings
  for select to authenticated
  using (pro_id = (select auth.uid()) or host_id = (select auth.uid()) or public.is_admin());

create policy "payments: lecture par les parties" on public.payments
  for select to authenticated
  using (exists (select 1 from public.bookings b where b.id = booking_id
                 and (b.pro_id = (select auth.uid()) or b.host_id = (select auth.uid())))
         or public.is_admin());

create policy "payouts: lecture par l'hôte" on public.payouts
  for select to authenticated using (host_id = (select auth.uid()) or public.is_admin());

create policy "deposits: lecture par les parties" on public.deposits
  for select to authenticated
  using (exists (select 1 from public.bookings b where b.id = booking_id
                 and (b.pro_id = (select auth.uid()) or b.host_id = (select auth.uid())))
         or public.is_admin());

-- Fonctions réservées au serveur (webhooks, tâches planifiées)
revoke execute on function public.booking_payment_authorized(uuid)        from public, anon, authenticated;
revoke execute on function public.schedule_booking_money(public.bookings) from public, anon, authenticated;
revoke execute on function public.advance_booking_statuses()              from public, anon, authenticated;

-- Fonctions réservées aux utilisateurs connectés
revoke execute on function public.create_booking(uuid, public.price_unit, timestamptz, integer, boolean, text) from public, anon;
revoke execute on function public.respond_to_booking(uuid, boolean, text) from public, anon;
revoke execute on function public.cancel_booking(uuid, text)              from public, anon;
revoke execute on function public.preview_cancellation(uuid)              from public, anon;
grant  execute on function public.create_booking(uuid, public.price_unit, timestamptz, integer, boolean, text) to authenticated;
grant  execute on function public.respond_to_booking(uuid, boolean, text) to authenticated;
grant  execute on function public.cancel_booking(uuid, text)              to authenticated;
grant  execute on function public.preview_cancellation(uuid)              to authenticated;
