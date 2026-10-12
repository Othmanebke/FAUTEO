-- =====================================================================
-- Fauteo — 1300 : postes enregistrés (signets)
-- CDC F-24 (favoris) avancé : le design affiche un signet sur chaque
-- annonce. Les alertes restent pour la V2.
-- =====================================================================

create table public.favorites (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  station_id uuid not null references public.stations (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, station_id)
);

create index favorites_station_idx on public.favorites (station_id);

revoke all on public.favorites from anon;
revoke update on public.favorites from authenticated;

alter table public.favorites enable row level security;

create policy "favorites: lecture par le propriétaire" on public.favorites
  for select to authenticated using (profile_id = (select auth.uid()));
create policy "favorites: ajout par le propriétaire" on public.favorites
  for insert to authenticated with check (profile_id = (select auth.uid()));
create policy "favorites: retrait par le propriétaire" on public.favorites
  for delete to authenticated using (profile_id = (select auth.uid()));
