import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

/**
 * Instance Stripe pour les appels API côté serveur (Route Handlers, Webhooks)
 */
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-02-24.acacia" as any,
  typescript: true,
});

/**
 * Calcul des montants pour Stripe Connect :
 * - Montant total débité au pro (prix du poste + frais de service marketplace)
 * - Empreinte bancaire pour la caution (SetupIntent ou PaymentIntent non capturé)
 * - Commission marketplace retenue
 * - Transfert vers le compte Stripe Connect de l'hôte
 */
export interface StripeMarketplaceParams {
  listingPrice: number; // en euros
  depositAmount: number; // caution en euros
  hostStripeAccountId: string;
}

export function formatStripeAmounts(listingPriceEur: number, depositAmountEur: number) {
  const listingAmountCents = Math.round(listingPriceEur * 100);
  const serviceFeeRate = 0.05; // 5% de frais de service
  const hostCommissionRate = 0.08; // 8% de commission sur l'hôte

  const feeCents = Math.round(listingAmountCents * serviceFeeRate);
  const hostFeeCents = Math.round(listingAmountCents * hostCommissionRate);
  const totalChargeCents = listingAmountCents + feeCents;
  const depositHoldCents = Math.round(depositAmountEur * 100);

  return {
    totalChargeCents,
    applicationFeeCents: feeCents + hostFeeCents,
    depositHoldCents,
  };
}
