import "server-only";

import Stripe from "stripe";

/**
 * Client Stripe côté serveur (Route Handlers, webhooks).
 * La version d'API est celle épinglée par le SDK installé.
 * Les montants (prix, frais, commission, caution) sont calculés en base
 * par quote_booking() : ne jamais les recalculer ici.
 */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Variable d'environnement manquante : STRIPE_SECRET_KEY. Voir .env.example.");
  return new Stripe(key, { typescript: true });
}
