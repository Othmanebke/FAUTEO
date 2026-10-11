-- =====================================================================
-- Fauteo — 0600 : contrats de mise à disposition et factures
-- CDC : F-34, F-40, §7 (Contrat, Fiscalité)
--
-- Les PDF sont générés côté serveur puis déposés dans les buckets privés
-- « contracts » et « invoices ». La base garantit l'unicité et la
-- continuité des numéros de facture (obligation légale).
--
-- Hypothèses fiscales (à valider par l'expert-comptable) :
--   * les prix affichés aux pros sont TTC ;
--   * la facture de location est émise par Fauteo au nom et pour le
--     compte de l'hôte (mandat de facturation prévu aux CGU), avec une
--     numérotation propre à chaque hôte ; TVA à 20 % si l'hôte est
--     assujetti, sinon mention « TVA non applicable, art. 293 B du CGI » ;
--   * les frais et commissions Fauteo sont soumis à la TVA à 20 %.
-- =====================================================================

create table public.contracts (
  id               uuid primary key default gen_random_uuid(),
  booking_id       uuid not null unique references public.bookings (id) on delete restrict,
  template_version text not null,
  pdf_path         text,
  sha256           text check (sha256 ~ '^[0-9a-f]{64}$'),
  -- Signature électronique simple : horodatage, IP (relevée côté serveur) et empreinte du PDF
  pro_signed_at    timestamptz,
  pro_signed_ip    inet,
  host_signed_at   timestamptz,
  host_signed_ip   inet,
  created_at       timestamptz not null default now()
);

create table public.invoice_sequences (
  series      text not null,
  year        integer not null,
  last_number integer not null default 0,
  primary key (series, year)
);

create table public.invoices (
  id                   uuid primary key default gen_random_uuid(),
  booking_id           uuid not null references public.bookings (id) on delete restrict,
  kind                 public.invoice_kind not null,
  number               text not null unique,
  credit_for           uuid references public.invoices (id) on delete restrict, -- avoir lié à une facture
  issuer_profile_id    uuid references public.profiles (id) on delete restrict, -- null = Fauteo
  recipient_profile_id uuid not null references public.profiles (id) on delete restrict,
  amount_ht_cents      integer not null,
  vat_rate_bps         integer not null check (vat_rate_bps between 0 and 10000),
  vat_cents            integer not null,
  amount_ttc_cents     integer not null,
  vat_mention          text,
  pdf_path             text,
  issued_at            timestamptz not null default now(),
  constraint invoices_amounts check (amount_ht_cents + vat_cents = amount_ttc_cents),
  constraint invoices_credit_sign check ((credit_for is null) = (amount_ttc_cents >= 0))
);

create index invoices_booking_idx   on public.invoices (booking_id);
create index invoices_recipient_idx on public.invoices (recipient_profile_id, issued_at desc);
create index invoices_issuer_idx    on public.invoices (issuer_profile_id, issued_at desc);

-- Numéro suivant d'une série, sans trou (verrou sur la ligne de séquence)
create function public.next_invoice_number(p_series text)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  y integer := extract(year from now() at time zone 'Europe/Paris');
  n integer;
begin
  insert into public.invoice_sequences (series, year, last_number)
  values (p_series, y, 1)
  on conflict (series, year) do update set last_number = public.invoice_sequences.last_number + 1
  returning last_number into n;

  return p_series || '-' || y || '-' || lpad(n::text, 6, '0');
end;
$$;

-- Ventilation HT / TVA d'un montant TTC
create function public.split_vat(ttc integer, rate_bps integer, out ht integer, out vat integer)
language sql
immutable
set search_path = ''
as $$
  select round(ttc * 10000.0 / (10000 + rate_bps))::integer,
         ttc - round(ttc * 10000.0 / (10000 + rate_bps))::integer;
$$;

-- Émission des trois factures d'une réservation confirmée et payée
create function public.issue_booking_invoices(p_booking uuid)
returns setof public.invoices
language plpgsql
security definer
set search_path = ''
as $$
declare
  b    public.bookings;
  h    public.host_profiles;
  rate integer;
  s    record;
begin
  select * into b from public.bookings where id = p_booking and status in ('confirmed', 'in_progress', 'completed');
  if b.id is null then
    raise exception 'Réservation introuvable ou non confirmée.' using errcode = 'P0001';
  end if;
  if exists (select 1 from public.invoices i where i.booking_id = b.id and i.credit_for is null) then
    return query select * from public.invoices i where i.booking_id = b.id and i.credit_for is null;
    return;
  end if;

  select * into h from public.host_profiles where profile_id = b.host_id;

  -- 1. Location : de l'hôte au pro, émise par mandat
  rate := case when h.vat_regime = 'assujetti' then 2000 else 0 end;
  select * into s from public.split_vat(b.subtotal_cents, rate);
  insert into public.invoices (booking_id, kind, number, issuer_profile_id, recipient_profile_id,
                               amount_ht_cents, vat_rate_bps, vat_cents, amount_ttc_cents, vat_mention)
  values (b.id, 'rental', public.next_invoice_number('L' || upper(left(replace(b.host_id::text, '-', ''), 8))),
          b.host_id, b.pro_id, s.ht, rate, s.vat, b.subtotal_cents,
          case when rate = 0 then 'TVA non applicable, art. 293 B du CGI' end);

  -- 2. Frais de service : de Fauteo au pro
  select * into s from public.split_vat(b.pro_fee_cents, 2000);
  insert into public.invoices (booking_id, kind, number, recipient_profile_id,
                               amount_ht_cents, vat_rate_bps, vat_cents, amount_ttc_cents)
  values (b.id, 'pro_service_fee', public.next_invoice_number('FAU'), b.pro_id, s.ht, 2000, s.vat, b.pro_fee_cents);

  -- 3. Commission : de Fauteo à l'hôte
  select * into s from public.split_vat(b.host_fee_cents, 2000);
  insert into public.invoices (booking_id, kind, number, recipient_profile_id,
                               amount_ht_cents, vat_rate_bps, vat_cents, amount_ttc_cents)
  values (b.id, 'host_commission', public.next_invoice_number('FAU'), b.host_id, s.ht, 2000, s.vat, b.host_fee_cents);

  return query select * from public.invoices i where i.booking_id = b.id and i.credit_for is null;
end;
$$;

revoke insert, update, delete on public.contracts, public.invoices, public.invoice_sequences from anon, authenticated;
revoke select on public.invoice_sequences from anon, authenticated;
revoke execute on function public.next_invoice_number(text)    from public, anon, authenticated;
revoke execute on function public.issue_booking_invoices(uuid) from public, anon, authenticated;

alter table public.contracts         enable row level security;
alter table public.invoices          enable row level security;
alter table public.invoice_sequences enable row level security;

create policy "contracts: lecture par les parties" on public.contracts
  for select to authenticated
  using (exists (select 1 from public.bookings b where b.id = booking_id
                 and (b.pro_id = (select auth.uid()) or b.host_id = (select auth.uid())))
         or public.is_admin());

create policy "invoices: lecture émetteur, destinataire ou admin" on public.invoices
  for select to authenticated
  using (recipient_profile_id = (select auth.uid()) or issuer_profile_id = (select auth.uid()) or public.is_admin());
