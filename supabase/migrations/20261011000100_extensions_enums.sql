-- =====================================================================
-- Fauteo — 0100 : extensions et types énumérés
-- Référence : Cahier des charges v1.0 (CDC), sections 5, 6 et 10.
-- =====================================================================

create extension if not exists postgis    with schema extensions; -- géolocalisation (F-20, F-23)
create extension if not exists btree_gist with schema extensions; -- contrainte anti double réservation

-- Métiers couverts par le MVP (CDC §2)
create type public.trade as enum (
  'coiffure',
  'barbier',
  'esthetique',
  'onglerie',
  'tatouage'
);

-- Types de postes (F-10)
create type public.station_type as enum (
  'fauteuil_coiffure',
  'poste_barber',
  'cabine_soins',
  'table_onglerie',
  'box_tatouage'
);

-- Rôle actif dans l'interface (F-02 : un compte peut cumuler les deux)
create type public.app_role as enum ('pro', 'host');

-- Documents justificatifs (F-05, CDC §7)
create type public.document_type as enum (
  'identity',            -- pièce d'identité
  'siret',               -- avis de situation INSEE / extrait Kbis
  'rc_pro',              -- attestation RC professionnelle (pro)
  'hygiene_training',    -- formation hygiène et salubrité (tatouage)
  'ars_declaration',     -- déclaration préalable ARS (tatouage)
  'premises_insurance'   -- assurance du local (hôte)
);

create type public.document_status as enum ('pending', 'approved', 'rejected');

-- Régime de TVA de l'hôte : nécessaire pour la facture de location émise pour son compte
create type public.vat_regime as enum ('franchise', 'assujetti');

-- Mode de réservation choisi par l'hôte, par poste (F-30)
create type public.booking_mode as enum ('request', 'instant');

-- Règles d'annulation prédéfinies (F-13, CDC §6)
create type public.cancellation_policy as enum ('flexible', 'moderate', 'strict');

create type public.station_status as enum ('draft', 'published', 'paused', 'suspended');

-- Unité de location (F-11)
create type public.price_unit as enum ('hour', 'half_day', 'day', 'week', 'month');

create type public.booking_status as enum (
  'awaiting_payment', -- créneau retenu le temps du paiement
  'requested',        -- paiement autorisé, en attente de l'hôte (24 h, F-31)
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'declined',         -- refusée par l'hôte
  'expired'           -- paiement non finalisé ou hôte sans réponse
);

create type public.actor as enum ('pro', 'host', 'admin', 'system');

create type public.payment_kind   as enum ('charge', 'refund');
create type public.payment_status as enum ('pending', 'requires_capture', 'succeeded', 'cancelled', 'failed');
create type public.payout_status  as enum ('scheduled', 'held', 'processing', 'paid', 'cancelled', 'failed');

-- Caution (F-33) : empreinte la veille du début pour les locations courtes,
-- carte enregistrée et débit seulement sur incident pour les locations longues
-- (une empreinte expire au bout d'environ 7 jours).
create type public.deposit_strategy as enum ('hold', 'saved_card');
create type public.deposit_status   as enum ('scheduled', 'held', 'released', 'captured', 'failed', 'cancelled');

create type public.invoice_kind as enum (
  'rental',          -- location, émise par Fauteo au nom et pour le compte de l'hôte (mandat de facturation)
  'pro_service_fee', -- frais de service Fauteo facturés au pro
  'host_commission'  -- commission Fauteo facturée à l'hôte
);

create type public.review_role   as enum ('pro', 'host');
create type public.report_target as enum ('profile', 'station', 'venue', 'message', 'review');
create type public.report_reason as enum ('fraud', 'inappropriate', 'hygiene', 'no_show', 'damage', 'harassment', 'other');
create type public.report_status as enum ('open', 'upheld', 'dismissed');

create type public.dispute_status as enum ('open', 'resolved_refund', 'resolved_release', 'resolved_partial', 'rejected');
