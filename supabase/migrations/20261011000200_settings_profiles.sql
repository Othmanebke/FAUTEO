-- =====================================================================
-- Fauteo — 0200 : paramètres plateforme, profils et rôles
-- CDC : F-01 à F-04, F-06, §6 (commission), §10 (Utilisateur, ProfilPro)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Utilitaire : updated_at automatique
-- ---------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Paramètres plateforme (ligne unique)
-- Modifiables par l'admin sans redéploiement. Montants en centimes,
-- taux en points de base (800 = 8 %).
-- ---------------------------------------------------------------------
create table public.platform_settings (
  id                          boolean primary key default true check (id),
  pro_fee_bps                 integer  not null default 800  check (pro_fee_bps  between 0 and 5000),
  host_fee_bps                integer  not null default 500  check (host_fee_bps between 0 and 5000),
  max_deposit_cents           integer  not null default 50000 check (max_deposit_cents >= 0),
  payment_hold_minutes        integer  not null default 15,  -- durée de rétention d'un créneau pendant le paiement
  request_expiry_hours        integer  not null default 24,  -- F-31
  payout_delay_hours          integer  not null default 24,  -- CDC §6 : versement 24 h après le début
  deposit_release_hours       integer  not null default 48,  -- CDC §6 : caution libérée sous 48 h
  deposit_hold_max_days       integer  not null default 4,   -- au-delà : stratégie « carte enregistrée »
  half_day_hours              integer  not null default 4,
  review_window_days          integer  not null default 14,  -- F-52
  suspension_report_threshold integer  not null default 3,   -- CDC §6
  updated_at                  timestamptz not null default now()
);

insert into public.platform_settings default values;

create trigger platform_settings_updated_at
  before update on public.platform_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Profils (informations publiques uniquement)
-- E-mail et téléphone restent dans auth.users : ils ne sont jamais
-- exposés par cette table, lisible par tous.
-- ---------------------------------------------------------------------
create table public.profiles (
  id                uuid primary key references auth.users (id) on delete cascade,
  first_name        text not null default '' check (char_length(first_name) <= 80),
  last_name         text not null default '' check (char_length(last_name)  <= 80),
  avatar_path       text,
  bio               text check (char_length(bio) <= 1500),
  city              text check (char_length(city) <= 120),
  is_pro            boolean not null default false, -- dérivé de pro_profiles
  is_host           boolean not null default false, -- dérivé de host_profiles
  active_role       public.app_role,
  is_admin          boolean not null default false,
  suspended_at      timestamptz,
  suspension_reason text,
  stripe_customer_id text unique,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Création automatique du profil à l'inscription
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Helpers d'autorisation
-- L'admin doit être authentifié en double facteur (aal2) : exigence
-- « authentification renforcée pour l'administration » (CDC §8).
-- ---------------------------------------------------------------------
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2'
     and exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin);
$$;

create function public.is_suspended(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles p where p.id = uid and p.suspended_at is not null);
$$;

-- ---------------------------------------------------------------------
-- Profil pro (F-03)
-- ---------------------------------------------------------------------
create table public.pro_profiles (
  profile_id       uuid primary key references public.profiles (id) on delete cascade,
  trades           public.trade[] not null check (cardinality(trades) between 1 and 5),
  specialties      text[] not null default '{}' check (cardinality(specialties) <= 20),
  experience_years smallint check (experience_years between 0 and 70),
  siret            text check (siret ~ '^[0-9]{14}$'),
  company_name     text,
  instagram_url    text,
  rating_avg       numeric(3, 2),
  rating_count     integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index pro_profiles_trades_idx on public.pro_profiles using gin (trades);

create trigger pro_profiles_updated_at
  before update on public.pro_profiles
  for each row execute function public.set_updated_at();

-- Portfolio : 12 images maximum (F-03)
create table public.portfolio_images (
  id           uuid primary key default gen_random_uuid(),
  pro_id       uuid not null references public.pro_profiles (profile_id) on delete cascade,
  storage_path text not null,
  position     smallint not null default 0,
  created_at   timestamptz not null default now()
);

create index portfolio_images_pro_idx on public.portfolio_images (pro_id, position);

create function public.enforce_portfolio_limit()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select count(*) from public.portfolio_images where pro_id = new.pro_id) >= 12 then
    raise exception 'Le portfolio est limité à 12 images.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger portfolio_images_limit
  before insert on public.portfolio_images
  for each row execute function public.enforce_portfolio_limit();

-- ---------------------------------------------------------------------
-- Profil hôte : informations légales, fiscales et Stripe Connect.
-- Privé (propriétaire et admin) : contient les données de déclaration
-- des revenus à l'administration fiscale (DAC7, CDC §7).
-- ---------------------------------------------------------------------
create table public.host_profiles (
  profile_id           uuid primary key references public.profiles (id) on delete cascade,
  legal_name           text not null check (char_length(legal_name) between 1 and 200),
  siret                text not null check (siret ~ '^[0-9]{14}$'),
  vat_regime           public.vat_regime not null default 'franchise',
  vat_number           text,
  billing_address      text,
  billing_postal_code  text,
  billing_city         text,
  birth_date           date,
  tax_id               text,
  stripe_account_id    text unique,
  stripe_ready         boolean not null default false, -- comptes Connect prêts à recevoir des virements
  cancellation_count   integer not null default 0,     -- annulations à l'initiative de l'hôte (CDC §6)
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint host_vat_number_required check (vat_regime = 'franchise' or vat_number is not null)
);

create trigger host_profiles_updated_at
  before update on public.host_profiles
  for each row execute function public.set_updated_at();

-- Les drapeaux is_pro / is_host suivent l'existence des profils métier
create function public.sync_role_flags()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := coalesce(new.profile_id, old.profile_id);
begin
  if tg_table_name = 'pro_profiles' then
    update public.profiles set is_pro = (tg_op <> 'DELETE'),
      active_role = case when tg_op = 'DELETE' then case when is_host then 'host'::public.app_role end
                         else coalesce(active_role, 'pro') end
    where id = uid;
  else
    update public.profiles set is_host = (tg_op <> 'DELETE'),
      active_role = case when tg_op = 'DELETE' then case when is_pro then 'pro'::public.app_role end
                         else coalesce(active_role, 'host') end
    where id = uid;
  end if;
  return null;
end;
$$;

create trigger pro_profiles_role_flag
  after insert or delete on public.pro_profiles
  for each row execute function public.sync_role_flags();

create trigger host_profiles_role_flag
  after insert or delete on public.host_profiles
  for each row execute function public.sync_role_flags();

-- Le rôle actif doit correspondre à un rôle réellement détenu
create function public.check_active_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.active_role = 'pro' and not new.is_pro) or (new.active_role = 'host' and not new.is_host) then
    raise exception 'Rôle actif non détenu par ce compte.' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger profiles_active_role_check
  before update of active_role on public.profiles
  for each row execute function public.check_active_role();

-- ---------------------------------------------------------------------
-- Privilèges par colonne : un utilisateur ne peut jamais modifier
-- is_admin, la suspension, les drapeaux de rôle ou les champs Stripe.
-- ---------------------------------------------------------------------
revoke insert, update, delete on public.platform_settings from anon, authenticated;

revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (first_name, last_name, avatar_path, bio, city, active_role) on public.profiles to authenticated;

revoke insert, update, delete on public.pro_profiles from anon, authenticated;
grant insert (profile_id, trades, specialties, experience_years, siret, company_name, instagram_url),
      update (trades, specialties, experience_years, siret, company_name, instagram_url),
      delete
  on public.pro_profiles to authenticated;

revoke all on public.host_profiles from anon;
revoke insert, update, delete on public.host_profiles from authenticated;
grant insert (profile_id, legal_name, siret, vat_regime, vat_number, billing_address, billing_postal_code,
              billing_city, birth_date, tax_id),
      update (legal_name, siret, vat_regime, vat_number, billing_address, billing_postal_code,
              billing_city, birth_date, tax_id)
  on public.host_profiles to authenticated;

revoke update on public.portfolio_images from anon, authenticated;

-- ---------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------
alter table public.platform_settings enable row level security;
alter table public.profiles          enable row level security;
alter table public.pro_profiles      enable row level security;
alter table public.host_profiles     enable row level security;
alter table public.portfolio_images  enable row level security;

-- Transparence des frais : tout le monde peut lire les paramètres
create policy "settings: lecture publique" on public.platform_settings
  for select using (true);
create policy "settings: admin" on public.platform_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "profiles: lecture publique" on public.profiles
  for select using (true);
create policy "profiles: mise à jour par le propriétaire" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "pro_profiles: lecture publique" on public.pro_profiles
  for select using (true);
create policy "pro_profiles: création par le propriétaire" on public.pro_profiles
  for insert to authenticated with check (profile_id = (select auth.uid()));
create policy "pro_profiles: mise à jour par le propriétaire" on public.pro_profiles
  for update to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));
create policy "pro_profiles: suppression par le propriétaire" on public.pro_profiles
  for delete to authenticated using (profile_id = (select auth.uid()));

create policy "host_profiles: lecture propriétaire ou admin" on public.host_profiles
  for select to authenticated using (profile_id = (select auth.uid()) or public.is_admin());
create policy "host_profiles: création par le propriétaire" on public.host_profiles
  for insert to authenticated with check (profile_id = (select auth.uid()));
create policy "host_profiles: mise à jour par le propriétaire" on public.host_profiles
  for update to authenticated using (profile_id = (select auth.uid())) with check (profile_id = (select auth.uid()));

create policy "portfolio: lecture publique" on public.portfolio_images
  for select using (true);
create policy "portfolio: ajout par le propriétaire" on public.portfolio_images
  for insert to authenticated with check (pro_id = (select auth.uid()));
create policy "portfolio: suppression par le propriétaire" on public.portfolio_images
  for delete to authenticated using (pro_id = (select auth.uid()));
