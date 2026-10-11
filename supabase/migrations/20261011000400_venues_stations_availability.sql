-- =====================================================================
-- Fauteo — 0400 : lieux, postes, photos, équipements, disponibilités
-- CDC : F-04, F-10 à F-14, §10 (Lieu, Poste, Disponibilité)
-- Fuseau de référence : Europe/Paris (zone pilote en France).
-- =====================================================================

-- ---------------------------------------------------------------------
-- Catalogue des équipements (libellés affichés, filtres F-21)
-- ---------------------------------------------------------------------
create table public.amenities (
  code   text primary key check (code ~ '^[a-z0-9_]+$'),
  label  text not null,
  scope  text not null check (scope in ('venue', 'station')),
  trades public.trade[] not null default '{}' -- vide = tous métiers
);

insert into public.amenities (code, label, scope, trades) values
  ('wifi',               'Wi-Fi',                          'venue',   '{}'),
  ('accessible_pmr',     'Accès PMR',                      'venue',   '{}'),
  ('waiting_area',       'Espace d''attente clients',      'venue',   '{}'),
  ('parking',            'Parking à proximité',            'venue',   '{}'),
  ('air_conditioning',   'Climatisation',                  'venue',   '{}'),
  ('storage_locker',     'Casier de rangement',            'venue',   '{}'),
  ('kitchen',            'Coin cuisine',                   'venue',   '{}'),
  ('hydraulic_chair',    'Fauteuil hydraulique',           'station', '{coiffure,barbier}'),
  ('mirror',             'Miroir',                         'station', '{coiffure,barbier,esthetique}'),
  ('wash_basin',         'Bac à shampoing',                'station', '{coiffure,barbier}'),
  ('hood_dryer',         'Casque séchoir',                 'station', '{coiffure}'),
  ('towel_steamer',      'Chauffe-serviettes',             'station', '{barbier,esthetique}'),
  ('treatment_table',    'Table de soin',                  'station', '{esthetique}'),
  ('magnifying_lamp',    'Lampe loupe',                    'station', '{esthetique,onglerie}'),
  ('nail_table',         'Table de manucure',              'station', '{onglerie}'),
  ('uv_led_lamp',        'Lampe UV/LED',                   'station', '{onglerie}'),
  ('dust_extractor',     'Aspirateur de poussière',        'station', '{onglerie}'),
  ('tattoo_chair',       'Fauteuil de tatouage',           'station', '{tatouage}'),
  ('autoclave',          'Autoclave / stérilisation',      'station', '{tatouage,esthetique}'),
  ('dasri_bin',          'Collecteur DASRI',               'station', '{tatouage}'),
  ('sink_in_room',       'Point d''eau dans la cabine',    'station', '{tatouage,esthetique}'),
  ('private_room',       'Espace fermé',                   'station', '{}');

alter table public.amenities enable row level security;
revoke insert, update, delete on public.amenities from anon, authenticated;
create policy "amenities: lecture publique" on public.amenities for select using (true);

-- ---------------------------------------------------------------------
-- Lieux (établissements de l'hôte)
-- ---------------------------------------------------------------------
create table public.venues (
  id           uuid primary key default gen_random_uuid(),
  host_id      uuid not null references public.host_profiles (profile_id) on delete cascade,
  name         text not null check (char_length(name) between 2 and 120),
  description  text check (char_length(description) <= 3000),
  address_line text not null,
  postal_code  text not null check (postal_code ~ '^[0-9]{5}$'),
  city         text not null,
  latitude     double precision not null check (latitude  between -90  and 90),
  longitude    double precision not null check (longitude between -180 and 180),
  location     extensions.geography(Point, 4326)
               generated always as (extensions.st_setsrid(extensions.st_makepoint(longitude, latitude), 4326)::extensions.geography) stored,
  house_rules  text check (char_length(house_rules) <= 5000), -- règlement intérieur (F-41)
  amenities    text[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index venues_location_idx on public.venues using gist (location);
create index venues_host_idx on public.venues (host_id);

create trigger venues_updated_at
  before update on public.venues
  for each row execute function public.set_updated_at();

create table public.venue_photos (
  id           uuid primary key default gen_random_uuid(),
  venue_id     uuid not null references public.venues (id) on delete cascade,
  storage_path text not null,
  position     smallint not null default 0,
  created_at   timestamptz not null default now()
);

create index venue_photos_venue_idx on public.venue_photos (venue_id, position);

-- ---------------------------------------------------------------------
-- Postes (l'annonce réservable)
-- ---------------------------------------------------------------------
create table public.stations (
  id                    uuid primary key default gen_random_uuid(),
  venue_id              uuid not null references public.venues (id) on delete cascade,
  host_id               uuid not null references public.host_profiles (profile_id) on delete cascade, -- dénormalisé (RLS, recherche)
  title                 text not null check (char_length(title) between 3 and 120),
  type                  public.station_type not null,
  trades                public.trade[] not null default '{}',
  description           text check (char_length(description) <= 3000),
  surface_m2            numeric(6, 1) check (surface_m2 > 0),
  amenities             text[] not null default '{}',
  booking_mode          public.booking_mode not null default 'request',
  cancellation_policy   public.cancellation_policy not null default 'moderate',
  deposit_cents         integer not null default 0 check (deposit_cents >= 0),
  price_hour_cents      integer check (price_hour_cents     > 0),
  price_half_day_cents  integer check (price_half_day_cents > 0),
  price_day_cents       integer check (price_day_cents      > 0),
  price_week_cents      integer check (price_week_cents     > 0),
  price_month_cents     integer check (price_month_cents    > 0),
  weekend_surcharge_bps integer not null default 0 check (weekend_surcharge_bps between 0 and 10000),
  status                public.station_status not null default 'draft',
  rating_avg            numeric(3, 2),
  rating_count          integer not null default 0,
  published_at          timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint stations_has_price check (coalesce(price_hour_cents, price_half_day_cents, price_day_cents,
                                                price_week_cents, price_month_cents) is not null)
);

create index stations_venue_idx     on public.stations (venue_id);
create index stations_host_idx      on public.stations (host_id);
create index stations_published_idx on public.stations (status) where status = 'published';
create index stations_trades_idx    on public.stations using gin (trades);
create index stations_amenities_idx on public.stations using gin (amenities);

create trigger stations_updated_at
  before update on public.stations
  for each row execute function public.set_updated_at();

create table public.station_photos (
  id           uuid primary key default gen_random_uuid(),
  station_id   uuid not null references public.stations (id) on delete cascade,
  storage_path text not null,
  position     smallint not null default 0,
  created_at   timestamptz not null default now()
);

create index station_photos_station_idx on public.station_photos (station_id, position);

-- ---------------------------------------------------------------------
-- Disponibilités (F-12)
-- Règles récurrentes en heure locale + blocages ponctuels.
-- ---------------------------------------------------------------------
create table public.availability_rules (
  id          uuid primary key default gen_random_uuid(),
  station_id  uuid not null references public.stations (id) on delete cascade,
  weekday     smallint not null check (weekday between 1 and 7), -- ISO : 1 = lundi
  start_time  time not null,
  end_time    time not null,
  valid_from  date not null default current_date,
  valid_until date,
  created_at  timestamptz not null default now(),
  check (end_time > start_time),
  check (valid_until is null or valid_until >= valid_from)
);

create index availability_rules_station_idx on public.availability_rules (station_id, weekday);

create table public.availability_blocks (
  id         uuid primary key default gen_random_uuid(),
  station_id uuid not null references public.stations (id) on delete cascade,
  period     tstzrange not null check (not isempty(period) and lower_inc(period) and not upper_inc(period)),
  reason     text,
  created_at timestamptz not null default now()
);

create index availability_blocks_period_idx on public.availability_blocks using gist (station_id, period);

-- ---------------------------------------------------------------------
-- Règles d'intégrité des postes
-- ---------------------------------------------------------------------
create function public.default_trades_for(t public.station_type)
returns public.trade[]
language sql
immutable
set search_path = ''
as $$
  select case t
    when 'fauteuil_coiffure' then array['coiffure', 'barbier']::public.trade[]
    when 'poste_barber'      then array['barbier', 'coiffure']::public.trade[]
    when 'cabine_soins'      then array['esthetique']::public.trade[]
    when 'table_onglerie'    then array['onglerie']::public.trade[]
    when 'box_tatouage'      then array['tatouage']::public.trade[]
  end;
$$;

create function public.station_integrity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  privileged boolean := auth.role() = 'service_role' or public.is_admin();
  max_deposit integer;
begin
  -- L'hôte du poste est toujours celui du lieu
  select v.host_id into new.host_id from public.venues v where v.id = new.venue_id;

  if cardinality(new.trades) = 0 then
    new.trades := public.default_trades_for(new.type);
  end if;

  select s.max_deposit_cents into max_deposit from public.platform_settings s;
  if new.deposit_cents > max_deposit then
    raise exception 'La caution ne peut pas dépasser % €.', max_deposit / 100 using errcode = 'check_violation';
  end if;

  -- Seul l'admin suspend ou lève une suspension (B-03)
  if not privileged and (new.status = 'suspended' or (tg_op = 'UPDATE' and old.status = 'suspended')) then
    raise exception 'Statut réservé à la modération.' using errcode = 'insufficient_privilege';
  end if;

  -- Mise en ligne : contrôle bloquant (F-05, CDC §6)
  if new.status = 'published' and (tg_op = 'INSERT' or old.status <> 'published') then
    if public.is_suspended(new.host_id) then
      raise exception 'Compte suspendu : publication impossible.' using errcode = 'P0001';
    end if;
    if not public.is_verified(new.host_id, 'host') then
      raise exception 'Documents de l''hôte non validés : publication impossible.' using errcode = 'P0001',
        hint = 'KYC_REQUIRED';
    end if;
    if not exists (select 1 from public.host_profiles h where h.profile_id = new.host_id and h.stripe_ready) then
      raise exception 'Compte de paiement Stripe non finalisé : publication impossible.' using errcode = 'P0001',
        hint = 'STRIPE_REQUIRED';
    end if;
    if tg_op = 'INSERT'
       or not exists (select 1 from public.availability_rules r where r.station_id = new.id) then
      raise exception 'Ajoutez au moins un créneau de disponibilité avant de publier.' using errcode = 'P0001',
        hint = 'AVAILABILITY_REQUIRED';
    end if;
    if not exists (select 1 from public.station_photos p where p.station_id = new.id) then
      raise exception 'Ajoutez au moins une photo du poste avant de publier.' using errcode = 'P0001',
        hint = 'PHOTO_REQUIRED';
    end if;
    new.published_at := coalesce(new.published_at, now());
  end if;

  return new;
end;
$$;

create trigger stations_integrity
  before insert or update on public.stations
  for each row execute function public.station_integrity();

-- ---------------------------------------------------------------------
-- Privilèges et RLS
-- ---------------------------------------------------------------------
revoke insert, update, delete on public.venues, public.venue_photos, public.stations, public.station_photos,
  public.availability_rules, public.availability_blocks from anon;

revoke insert, update on public.stations from authenticated;
grant insert (venue_id, title, type, trades, description, surface_m2, amenities, booking_mode, cancellation_policy,
              deposit_cents, price_hour_cents, price_half_day_cents, price_day_cents, price_week_cents,
              price_month_cents, weekend_surcharge_bps, status)
  on public.stations to authenticated;
grant update (venue_id,title, type, trades, description, surface_m2, amenities, booking_mode, cancellation_policy,
              deposit_cents, price_hour_cents, price_half_day_cents, price_day_cents, price_week_cents,
              price_month_cents, weekend_surcharge_bps, status)
  on public.stations to authenticated;

revoke update on public.venues from authenticated;
grant update (name, description, address_line, postal_code, city, latitude, longitude, house_rules, amenities)
  on public.venues to authenticated;

alter table public.venues              enable row level security;
alter table public.venue_photos        enable row level security;
alter table public.stations            enable row level security;
alter table public.station_photos      enable row level security;
alter table public.availability_rules  enable row level security;
alter table public.availability_blocks enable row level security;

-- Postes : publics une fois publiés, sinon visibles du seul hôte
create policy "stations: lecture" on public.stations
  for select using (status = 'published' or host_id = (select auth.uid()) or public.is_admin());
create policy "stations: création par l'hôte" on public.stations
  for insert to authenticated with check (host_id = (select auth.uid()));
create policy "stations: modification par l'hôte" on public.stations
  for update to authenticated using (host_id = (select auth.uid()) or public.is_admin())
  with check (host_id = (select auth.uid()) or public.is_admin());
create policy "stations: suppression par l'hôte" on public.stations
  for delete to authenticated using (host_id = (select auth.uid()));

create policy "venues: lecture" on public.venues
  for select using (
    host_id = (select auth.uid())
    or public.is_admin()
    or exists (select 1 from public.stations s where s.venue_id = venues.id and s.status = 'published')
  );
create policy "venues: gestion par l'hôte" on public.venues
  for all to authenticated using (host_id = (select auth.uid())) with check (host_id = (select auth.uid()));

create policy "venue_photos: lecture" on public.venue_photos
  for select using (exists (select 1 from public.venues v where v.id = venue_id));
create policy "venue_photos: gestion par l'hôte" on public.venue_photos
  for all to authenticated
  using (exists (select 1 from public.venues v where v.id = venue_id and v.host_id = (select auth.uid())))
  with check (exists (select 1 from public.venues v where v.id = venue_id and v.host_id = (select auth.uid())));

create policy "station_photos: lecture" on public.station_photos
  for select using (exists (select 1 from public.stations s where s.id = station_id));
create policy "station_photos: gestion par l'hôte" on public.station_photos
  for all to authenticated
  using (exists (select 1 from public.stations s where s.id = station_id and s.host_id = (select auth.uid())))
  with check (exists (select 1 from public.stations s where s.id = station_id and s.host_id = (select auth.uid())));

create policy "availability_rules: lecture" on public.availability_rules
  for select using (exists (select 1 from public.stations s where s.id = station_id));
create policy "availability_rules: gestion par l'hôte" on public.availability_rules
  for all to authenticated
  using (exists (select 1 from public.stations s where s.id = station_id and s.host_id = (select auth.uid())))
  with check (exists (select 1 from public.stations s where s.id = station_id and s.host_id = (select auth.uid())));

create policy "availability_blocks: lecture" on public.availability_blocks
  for select using (exists (select 1 from public.stations s where s.id = station_id));
create policy "availability_blocks: gestion par l'hôte" on public.availability_blocks
  for all to authenticated
  using (exists (select 1 from public.stations s where s.id = station_id and s.host_id = (select auth.uid())))
  with check (exists (select 1 from public.stations s where s.id = station_id and s.host_id = (select auth.uid())));
