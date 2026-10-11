-- Tests des règles métier critiques (pgTAP) : `npx supabase test db`
begin;
create extension if not exists pgtap with schema extensions;

create schema tests;
grant usage on schema tests to anon, authenticated;

select plan(24);

-- ---------------------------------------------------------------------
-- Jeu de données
-- ---------------------------------------------------------------------
insert into auth.users (id, email, raw_user_meta_data) values
  ('00000000-0000-0000-0000-0000000000a1', 'hote@test.fr',   '{"first_name":"Hélène","last_name":"Hôte"}'),
  ('00000000-0000-0000-0000-0000000000b1', 'pro@test.fr',    '{"first_name":"Paul","last_name":"Pro"}'),
  ('00000000-0000-0000-0000-0000000000b2', 'pro2@test.fr',   '{"first_name":"Pia","last_name":"Pro"}'),
  ('00000000-0000-0000-0000-0000000000b3', 'tattoo@test.fr', '{"first_name":"Tom","last_name":"Tatoueur"}');

create function tests.login(uid uuid, aal text default 'aal1') returns void language sql as $$
  select set_config('request.jwt.claims',
                    json_build_object('sub', uid, 'role', 'authenticated', 'aal', aal)::text, true);
  set local role authenticated;
$$;

create function tests.approve_all(uid uuid, types public.document_type[]) returns void language sql as $$
  insert into public.documents (owner_id, type, storage_path, status, expires_at)
  select uid, t, uid || '/' || t || '.pdf', 'approved', current_date + 365 from unnest(types) t;
$$;

-- Lundi dans deux semaines (toujours dans le futur)
create function tests.next_monday() returns date language sql as $$
  select date_trunc('week', now() at time zone 'Europe/Paris')::date + 14;
$$;

-- ---------------------------------------------------------------------
-- Profils et rôles
-- ---------------------------------------------------------------------
select is((select first_name from public.profiles where id = '00000000-0000-0000-0000-0000000000a1'),
          'Hélène', 'Le profil est créé à l''inscription');

select tests.login('00000000-0000-0000-0000-0000000000a1');
insert into public.host_profiles (profile_id, legal_name, siret)
values ('00000000-0000-0000-0000-0000000000a1', 'Salon Hélène', '12345678901234');

select ok((select is_host from public.profiles where id = '00000000-0000-0000-0000-0000000000a1'),
          'Créer un profil hôte active le rôle hôte');

select throws_ok(
  $$update public.profiles set is_admin = true where id = '00000000-0000-0000-0000-0000000000a1'$$,
  '42501', null, 'Un utilisateur ne peut pas se déclarer administrateur');

insert into public.venues (host_id, name, address_line, postal_code, city, latitude, longitude, house_rules)
values ('00000000-0000-0000-0000-0000000000a1', 'Salon Hélène', '10 rue de Lappe', '75011', 'Paris',
        48.8534, 2.3725, 'Matériel nettoyé après chaque client.');

insert into public.stations (venue_id, title, type, price_day_cents, price_hour_cents, deposit_cents, weekend_surcharge_bps)
select id, 'Fauteuil barber', 'poste_barber', 6000, 1500, 20000, 2000 from public.venues;

select is((select trades from public.stations), array['barbier', 'coiffure']::public.trade[],
          'Les métiers par défaut découlent du type de poste');

insert into public.availability_rules (station_id, weekday, start_time, end_time)
select s.id, d, '09:00', '19:00' from public.stations s, generate_series(1, 5) d;
insert into public.station_photos (station_id, storage_path)
select id, '00000000-0000-0000-0000-0000000000a1/poste.jpg' from public.stations;

-- ---------------------------------------------------------------------
-- KYC bloquant à la publication
-- ---------------------------------------------------------------------
select throws_ok($$update public.stations set status = 'published'$$,
  'P0001', 'Documents de l''hôte non validés : publication impossible.',
  'Publication refusée sans documents validés');

reset role;
select tests.approve_all('00000000-0000-0000-0000-0000000000a1', '{identity,siret,premises_insurance}');

select tests.login('00000000-0000-0000-0000-0000000000a1');
select throws_ok($$update public.stations set status = 'published'$$,
  'P0001', 'Compte de paiement Stripe non finalisé : publication impossible.',
  'Publication refusée sans compte Stripe prêt');

reset role;
update public.host_profiles set stripe_ready = true;

select tests.login('00000000-0000-0000-0000-0000000000a1');
select lives_ok($$update public.stations set status = 'published'$$, 'Publication possible une fois tout validé');

select throws_ok($$update public.stations set status = 'suspended'$$,
  '42501', 'Statut réservé à la modération.', 'Seule la modération suspend un poste');

-- ---------------------------------------------------------------------
-- Tarification (exemple du CDC §11 : 60 € → 4,80 € pro, 3 € hôte)
-- ---------------------------------------------------------------------
reset role;
set local role anon;
select results_eq(
  format($$select subtotal_cents, pro_fee_cents, host_fee_cents, total_cents, host_payout_cents
           from public.quote_booking((select id from public.stations), 'day', %L::timestamptz, 1)$$,
         tests.next_monday()),
  $$values (6000, 480, 300, 6480, 5700)$$,
  'Journée à 60 € : frais pro 4,80 €, commission hôte 3 €');

select is(
  (public.quote_booking((select id from public.stations), 'day', (tests.next_monday() + 5)::timestamptz, 2)).surcharge_cents,
  2400, 'Majoration week-end de 20 % appliquée au samedi et au dimanche');

select is(
  (public.quote_booking((select id from public.stations), 'day', tests.next_monday()::timestamptz, 3)).deposit_strategy,
  'hold'::public.deposit_strategy, 'Location courte : caution par empreinte');

select is((select count(*)::integer from public.search_stations(48.8566, 2.3522, 5000)), 1,
          'Un visiteur trouve le poste publié à moins de 5 km');

reset role;

-- ---------------------------------------------------------------------
-- Réservation : KYC du pro, disponibilité, double réservation
-- ---------------------------------------------------------------------
select tests.login('00000000-0000-0000-0000-0000000000b1');
insert into public.pro_profiles (profile_id, trades) values ('00000000-0000-0000-0000-0000000000b1', '{barbier}');

select throws_ok(
  format($$select public.create_booking((select id from public.stations), 'day', %L::timestamptz, 1, true)$$,
         tests.next_monday()),
  'P0001', 'Vos documents doivent être validés avant de réserver.', 'Réservation refusée sans SIRET ni RC pro');

reset role;
select tests.approve_all('00000000-0000-0000-0000-0000000000b1', '{identity,siret,rc_pro}');
select tests.login('00000000-0000-0000-0000-0000000000b1');

select throws_ok(
  format($$select public.create_booking((select id from public.stations), 'day', %L::timestamptz, 1, false)$$,
         tests.next_monday()),
  'P0001', 'L''acceptation du règlement intérieur est obligatoire.', 'Règlement intérieur obligatoire');

select throws_ok(
  format($$select public.create_booking((select id from public.stations), 'day', %L::timestamptz, 1, true)$$,
         tests.next_monday() + 5),
  'P0001', 'Créneau indisponible.', 'Impossible de réserver un jour de fermeture');

select lives_ok(
  format($$select public.create_booking((select id from public.stations), 'day', %L::timestamptz, 1, true)$$,
         tests.next_monday()),
  'Un pro vérifié réserve une journée');

reset role;
select tests.approve_all('00000000-0000-0000-0000-0000000000b2', '{identity,siret,rc_pro}');
insert into public.pro_profiles (profile_id, trades) values ('00000000-0000-0000-0000-0000000000b2', '{coiffure}');
select tests.login('00000000-0000-0000-0000-0000000000b2');

select throws_ok(
  format($$select public.create_booking((select id from public.stations), 'hour', %L::timestamptz, 2, true)$$,
         (tests.next_monday()::timestamp + time '10:00') at time zone 'Europe/Paris'),
  'P0001', 'Créneau indisponible.', 'Pas de double réservation sur un créneau qui chevauche');

-- ---------------------------------------------------------------------
-- Cycle de vie : paiement autorisé, acceptation, versements
-- ---------------------------------------------------------------------
reset role;
select public.booking_payment_authorized((select id from public.bookings));
select is((select status from public.bookings), 'requested'::public.booking_status,
          'Mode sur demande : en attente de l''hôte après paiement');

select tests.login('00000000-0000-0000-0000-0000000000a1');
select lives_ok($$select public.respond_to_booking((select id from public.bookings), true)$$,
                'L''hôte accepte la demande');
reset role;

select results_eq($$select count(*)::integer, sum(amount_cents)::integer from public.payouts$$,
                  $$values (1, 5700)$$, 'Un versement de 57 € est planifié pour l''hôte');
select is((select status from public.deposits), 'scheduled'::public.deposit_status, 'La caution est planifiée');

-- ---------------------------------------------------------------------
-- Annulation (CDC §6)
-- ---------------------------------------------------------------------
select is(public.cancellation_refund_cents('moderate', 'pro', now() + interval '3 days', now(), 6000, 6480),
          3000, 'Modérée, pro à 3 jours : 50 % du prix, frais non remboursés');
select is(public.cancellation_refund_cents('strict', 'host', now() + interval '1 day', now(), 6000, 6480),
          6480, 'Annulation par l''hôte : remboursement intégral, frais compris');

-- ---------------------------------------------------------------------
-- Tatouage : documents d'hygiène exigés
-- ---------------------------------------------------------------------
insert into public.pro_profiles (profile_id, trades) values ('00000000-0000-0000-0000-0000000000b3', '{tatouage}');
select tests.approve_all('00000000-0000-0000-0000-0000000000b3', '{identity,siret,rc_pro}');
select ok(not public.is_verified('00000000-0000-0000-0000-0000000000b3', 'pro'),
          'Tatoueur non vérifié sans formation hygiène ni déclaration ARS');

select * from finish();
rollback;
