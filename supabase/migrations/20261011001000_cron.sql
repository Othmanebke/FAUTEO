-- =====================================================================
-- Fauteo — 1000 : tâches planifiées internes à la base
-- Les tâches qui appellent Stripe (versements, caution, remboursements)
-- sont exécutées par le serveur applicatif, pas ici.
-- =====================================================================

create extension if not exists pg_cron with schema pg_catalog;

-- Expiration des paiements et des demandes, passage en cours / terminé
select cron.schedule('fauteo-advance-bookings', '* * * * *', $$select public.advance_booking_statuses()$$);

-- Publication des avis au-delà de 14 jours (F-52)
select cron.schedule('fauteo-publish-reviews', '15 * * * *', $$select public.publish_due_reviews()$$);
