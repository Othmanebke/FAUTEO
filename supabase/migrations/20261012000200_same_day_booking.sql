-- =====================================================================
-- Fauteo — 1200 : réservation possible le jour même (jour, semaine, mois)
-- Une location à la journée commence à minuit : l'ancienne règle la
-- considérait comme passée dès le matin, empêchant de réserver aujourd'hui.
-- =====================================================================

create or replace function public.station_unavailability(p_station uuid, p_unit public.price_unit, p_period tstzrange,
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
  -- Heure, demi-journée : le créneau doit commencer dans le futur.
  -- Jour, semaine, mois : la période démarre à minuit ; réserver la journée
  -- en cours reste possible tant que la date n'est pas passée.
  if p_unit in ('hour', 'half_day') and lower(p_period) <= now() then
    return 'IN_THE_PAST';
  end if;
  if p_unit in ('day', 'week', 'month') and local_start::date < (now() at time zone 'Europe/Paris')::date then
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
