-- =====================================================================
-- Fauteo — 0800 : recherche de postes
-- CDC : F-20 à F-23 ; §8 (recherche < 1,5 s pour 10 000 annonces) ;
-- §7 (transparence du classement : tri explicite, par défaut la distance).
-- =====================================================================

create function public.search_stations(
  p_lat             double precision default null,
  p_lng             double precision default null,
  p_radius_m        integer default 15000,
  p_trade           public.trade default null,
  p_unit            public.price_unit default null,
  p_start           timestamptz default null,
  p_quantity        integer default 1,
  p_max_price_cents integer default null,
  p_amenities       text[] default null,
  p_min_rating      numeric default null,
  p_verified_only   boolean default false,
  p_sort            text default 'distance', -- distance | price | rating
  p_limit           integer default 20,
  p_offset          integer default 0
)
returns table (
  station_id          uuid,
  title               text,
  type                public.station_type,
  trades              public.trade[],
  booking_mode        public.booking_mode,
  venue_id            uuid,
  venue_name          text,
  city                text,
  latitude            double precision,
  longitude           double precision,
  distance_m          double precision,
  price_unit          public.price_unit,
  price_cents         integer,
  deposit_cents       integer,
  rating_avg          numeric,
  rating_count        integer,
  host_verified       boolean,
  cover_photo_path    text,
  total_count         bigint
)
language sql
stable
set search_path = public, extensions
as $$
  with origin as (
    select case when p_lat is not null and p_lng is not null
                then st_setsrid(st_makepoint(p_lng, p_lat), 4326)::geography end as point
  ),
  candidates as (
    select
      s.id, s.title, s.type, s.trades, s.booking_mode, s.deposit_cents, s.rating_avg, s.rating_count,
      v.id as venue_id, v.name as venue_name, v.city, v.latitude, v.longitude, s.host_id,
      case when o.point is not null then st_distance(v.location, o.point) end as distance_m,
      coalesce(p_unit, case
        when s.price_hour_cents     is not null then 'hour'
        when s.price_half_day_cents is not null then 'half_day'
        when s.price_day_cents      is not null then 'day'
        when s.price_week_cents     is not null then 'week'
        else 'month' end::public.price_unit) as price_unit,
      s.price_hour_cents, s.price_half_day_cents, s.price_day_cents, s.price_week_cents, s.price_month_cents
    from public.stations s
    join public.venues v on v.id = s.venue_id
    cross join origin o
    where s.status = 'published'
      and (o.point is null or st_dwithin(v.location, o.point, p_radius_m))
      and (p_trade is null or p_trade = any (s.trades))
      and (p_amenities is null or s.amenities @> p_amenities)
      and (p_min_rating is null or s.rating_avg >= p_min_rating)
  ),
  priced as (
    select c.*,
      case c.price_unit
        when 'hour'     then c.price_hour_cents
        when 'half_day' then c.price_half_day_cents
        when 'day'      then c.price_day_cents
        when 'week'     then c.price_week_cents
        when 'month'    then c.price_month_cents
      end as price_cents,
      public.is_verified(c.host_id, 'host') as host_verified
    from candidates c
  ),
  filtered as (
    select p.* from priced p
    where p.price_cents is not null
      and (p_max_price_cents is null or p.price_cents <= p_max_price_cents)
      and (not p_verified_only or p.host_verified)
      and (p_start is null or p_unit is null
           or public.station_unavailability(p.id, p_unit, public.booking_period(p_unit, p_start, greatest(p_quantity, 1))) is null)
  )
  select
    f.id, f.title, f.type, f.trades, f.booking_mode, f.venue_id, f.venue_name, f.city, f.latitude, f.longitude,
    f.distance_m, f.price_unit, f.price_cents, f.deposit_cents, f.rating_avg, f.rating_count, f.host_verified,
    (select ph.storage_path from public.station_photos ph where ph.station_id = f.id
      order by ph.position, ph.created_at limit 1),
    count(*) over ()
  from filtered f
  order by
    case when p_sort = 'price'  then f.price_cents end asc nulls last,
    case when p_sort = 'rating' then f.rating_avg  end desc nulls last,
    f.distance_m asc nulls last,
    f.rating_avg desc nulls last,
    f.id
  limit least(greatest(p_limit, 1), 100)
  offset greatest(p_offset, 0);
$$;
