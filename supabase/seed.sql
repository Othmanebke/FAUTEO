-- =====================================================================
-- Fauteo — données de démonstration (environnement local uniquement)
-- Rejouées à chaque `npm run db:reset`. Jamais appliquées en production.
-- Hôtes fictifs, déjà vérifiés et prêts à encaisser, avec postes publiés.
-- =====================================================================

do $$
declare
  h record;
  v record;
  s record;
  station_id uuid;
begin
  -- Hôtes de démonstration
  for h in
    select * from (values
      ('10000000-0000-0000-0000-000000000001'::uuid, 'Inès',   'Benali',   'Paris', 'Atelier Bastille SAS',   '73282932000074'),
      ('10000000-0000-0000-0000-000000000002'::uuid, 'Julien', 'Moreau',   'Paris', 'Maison Oberkampf',       '73282932000074'),
      ('10000000-0000-0000-0000-000000000003'::uuid, 'Sofia',  'Ricci',    'Paris', 'Encre & Lumière SARL',   '73282932000074'),
      ('10000000-0000-0000-0000-000000000004'::uuid, 'Claire', 'Dubois',   'Paris', 'Institut Claire Dubois', '73282932000074'),
      ('10000000-0000-0000-0000-000000000005'::uuid, 'Karim',  'Haddad',   'Lyon',  'Barber Croix-Rousse',    '73282932000074')
    ) as t(id, first_name, last_name, city, legal_name, siret)
  loop
    insert into auth.users (id, instance_id, aud, role, email, email_confirmed_at, raw_user_meta_data, created_at, updated_at)
    values (h.id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
            lower(h.first_name) || '.' || lower(h.last_name) || '@demo.fauteo.fr', now(),
            jsonb_build_object('first_name', h.first_name, 'last_name', h.last_name), now(), now());

    update public.profiles set city = h.city where id = h.id;

    insert into public.host_profiles (profile_id, legal_name, siret, vat_regime, billing_address, billing_postal_code,
                                      billing_city, birth_date, tax_id, stripe_ready)
    values (h.id, h.legal_name, h.siret, 'franchise', '1 rue de la Démo', '75011', h.city, '1985-06-15', '1234567890123', true);

    insert into public.documents (owner_id, type, storage_path, status, expires_at, reviewed_at)
    select h.id, t, h.id || '/' || t || '.pdf', 'approved', current_date + 365, now()
    from unnest(array['identity', 'siret', 'premises_insurance']::public.document_type[]) t;
  end loop;

  -- Lieux
  for v in
    select * from (values
      ('20000000-0000-0000-0000-000000000001'::uuid, '10000000-0000-0000-0000-000000000001'::uuid, 'Atelier Bastille', '10 rue de Lappe', '75011', 'Paris', 48.8534, 2.3725,
       'Barbershop de quartier aux murs de brique, quatre fauteuils face à la verrière. Clientèle fidèle, ambiance calme en semaine.',
       '{wifi,air_conditioning,storage_locker,waiting_area}'::text[]),
      ('20000000-0000-0000-0000-000000000002'::uuid, '10000000-0000-0000-0000-000000000002'::uuid, 'Maison Oberkampf', '95 rue Oberkampf', '75011', 'Paris', 48.8649, 2.3770,
       'Salon de coiffure lumineux, bacs ergonomiques et espace couleur. Idéal pour coloristes et coiffeurs studio.',
       '{wifi,accessible_pmr,waiting_area,kitchen}'::text[]),
      ('20000000-0000-0000-0000-000000000003'::uuid, '10000000-0000-0000-0000-000000000003'::uuid, 'Studio Pigalle Ink', '12 rue Frochot', '75009', 'Paris', 48.8822, 2.3376,
       'Shop de tatouage déclaré à l''ARS, box fermés, stérilisation sur place. Guests bienvenus à la journée ou à la semaine.',
       '{wifi,air_conditioning,storage_locker}'::text[]),
      ('20000000-0000-0000-0000-000000000004'::uuid, '10000000-0000-0000-0000-000000000003'::uuid, 'Encre Canal', '60 quai de Jemmapes', '75010', 'Paris', 48.8710, 2.3650,
       'Petit studio au bord du canal Saint-Martin, deux box avec point d''eau.',
       '{wifi,storage_locker}'::text[]),
      ('20000000-0000-0000-0000-000000000005'::uuid, '10000000-0000-0000-0000-000000000004'::uuid, 'Institut du Marais', '40 rue de Bretagne', '75003', 'Paris', 48.8630, 2.3615,
       'Institut de beauté au calme, cabines fermées avec table chauffante. Onglerie au rez-de-chaussée.',
       '{wifi,air_conditioning,waiting_area,accessible_pmr}'::text[]),
      ('20000000-0000-0000-0000-000000000006'::uuid, '10000000-0000-0000-0000-000000000004'::uuid, 'Nail Club Batignolles', '20 rue des Dames', '75017', 'Paris', 48.8847, 2.3200,
       'Onglerie boutique, tables équipées d''aspiration et lampes LED.',
       '{wifi,air_conditioning}'::text[]),
      ('20000000-0000-0000-0000-000000000007'::uuid, '10000000-0000-0000-0000-000000000002'::uuid, 'Salon Saint-Germain', '15 rue de Buci', '75006', 'Paris', 48.8536, 2.3354,
       'Salon haut de gamme rive gauche, clientèle internationale, fauteuils en cuir.',
       '{wifi,air_conditioning,waiting_area,kitchen}'::text[]),
      ('20000000-0000-0000-0000-000000000008'::uuid, '10000000-0000-0000-0000-000000000005'::uuid, 'Barber Croix-Rousse', '6 place de la Croix-Rousse', '69004', 'Lyon', 45.7745, 4.8320,
       'Barbershop sur la place, trois postes, matériel complet fourni.',
       '{wifi,storage_locker,waiting_area}'::text[])
    ) as t(id, host_id, name, address_line, postal_code, city, lat, lng, description, amenities)
  loop
    insert into public.venues (id, host_id, name, address_line, postal_code, city, latitude, longitude, description, amenities, house_rules)
    values (v.id, v.host_id, v.name, v.address_line, v.postal_code, v.city, v.lat, v.lng, v.description, v.amenities,
            'Arrivée 15 minutes avant le premier client. Poste nettoyé et désinfecté après chaque prestation. ' ||
            'Produits personnels autorisés, consommables du salon facturés au réel. Pas de musique personnelle sans casque.');
  end loop;

  -- Postes
  for s in
    select * from (values
      ('20000000-0000-0000-0000-000000000001'::uuid, 'Poste barber face à la verrière', 'poste_barber'::public.station_type, 1400, 3000, 5000, 220, 650, 1000, 20000, 'instant'::public.booking_mode, 'flexible'::public.cancellation_policy, '{hydraulic_chair,mirror,towel_steamer}'::text[], 4.9, 38),
      ('20000000-0000-0000-0000-000000000001'::uuid, 'Fauteuil barber vintage', 'poste_barber', null, null, 4500, 200, null, 1000, 15000, 'request', 'moderate', '{hydraulic_chair,mirror}'::text[], 4.7, 12),
      ('20000000-0000-0000-0000-000000000002'::uuid, 'Fauteuil coiffure avec bac dédié', 'fauteuil_coiffure', 1500, 3500, 6000, 260, 850, 1500, 25000, 'request', 'moderate', '{hydraulic_chair,mirror,wash_basin,hood_dryer}'::text[], 4.8, 54),
      ('20000000-0000-0000-0000-000000000002'::uuid, 'Poste coloriste lumière naturelle', 'fauteuil_coiffure', null, 3800, 6500, 280, null, 0, 25000, 'request', 'strict', '{mirror,wash_basin}'::text[], 4.6, 9),
      ('20000000-0000-0000-0000-000000000003'::uuid, 'Box tatouage fermé n°1', 'box_tatouage', null, 5000, 9000, 400, 1200, 0, 40000, 'request', 'moderate', '{tattoo_chair,autoclave,dasri_bin,sink_in_room,private_room}'::text[], 5.0, 21),
      ('20000000-0000-0000-0000-000000000003'::uuid, 'Box tatouage guest', 'box_tatouage', null, null, 8000, 380, null, 0, 35000, 'instant', 'moderate', '{tattoo_chair,autoclave,dasri_bin,private_room}'::text[], 4.8, 17),
      ('20000000-0000-0000-0000-000000000004'::uuid, 'Box canal avec point d''eau', 'box_tatouage', null, 4500, 8000, 350, 1000, 0, 30000, 'request', 'flexible', '{tattoo_chair,sink_in_room,dasri_bin,private_room}'::text[], null, 0),
      ('20000000-0000-0000-0000-000000000005'::uuid, 'Cabine de soins avec table chauffante', 'cabine_soins', 1800, 4500, 8000, 350, 1100, 0, 30000, 'request', 'moderate', '{treatment_table,magnifying_lamp,sink_in_room,private_room}'::text[], 4.9, 27),
      ('20000000-0000-0000-0000-000000000005'::uuid, 'Table d''onglerie vitrine', 'table_onglerie', 1000, 2400, 4000, 180, 550, 0, 10000, 'instant', 'flexible', '{nail_table,uv_led_lamp,dust_extractor}'::text[], 4.7, 31),
      ('20000000-0000-0000-0000-000000000006'::uuid, 'Table manucure aspirée', 'table_onglerie', 900, 2200, 3800, 170, 500, 0, 10000, 'instant', 'flexible', '{nail_table,uv_led_lamp,dust_extractor,magnifying_lamp}'::text[], 4.8, 44),
      ('20000000-0000-0000-0000-000000000007'::uuid, 'Fauteuil cuir rive gauche', 'fauteuil_coiffure', 2000, 4500, 7500, 340, 1200, 2000, 30000, 'request', 'strict', '{hydraulic_chair,mirror,wash_basin}'::text[], 4.9, 63),
      ('20000000-0000-0000-0000-000000000008'::uuid, 'Poste barber sur la place', 'poste_barber', 1200, 2600, 4500, 200, 600, 1000, 15000, 'instant', 'flexible', '{hydraulic_chair,mirror,towel_steamer}'::text[], 4.8, 19)
    ) as t(venue_id, title, type, hour, half_day, day, week_eur, month_eur, weekend_bps, deposit, mode, policy, amenities, rating, rating_count)
  loop
    insert into public.stations (venue_id, title, type, price_hour_cents, price_half_day_cents, price_day_cents,
                                 price_week_cents, price_month_cents, weekend_surcharge_bps, deposit_cents,
                                 booking_mode, cancellation_policy, amenities, surface_m2,
                                 description)
    values (s.venue_id, s.title, s.type, s.hour, s.half_day, s.day,
            s.week_eur * 100, s.month_eur * 100, s.weekend_bps, s.deposit,
            s.mode, s.policy, s.amenities, 6 + (random() * 6)::int,
            'Poste entièrement équipé, éclairage soigné et rangement dédié. Le matériel listé est inclus dans le prix.')
    returning id into station_id;

    insert into public.station_photos (station_id, storage_path) values (station_id, 'seed/' || station_id || '.jpg');

    insert into public.availability_rules (station_id, weekday, start_time, end_time)
    select station_id, d, '09:00', case when d = 6 then '18:00'::time else '20:00'::time end
    from generate_series(1, 6) d;

    update public.stations set status = 'published',
           rating_avg = s.rating, rating_count = s.rating_count
     where id = station_id;
  end loop;
end;
$$;
