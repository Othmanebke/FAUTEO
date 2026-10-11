import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

/**
 * Webhook Stripe Connect. La signature est toujours vérifiée : aucun
 * événement non signé n'est accepté, même en développement (utiliser
 * `stripe listen --forward-to localhost:3000/api/webhooks/stripe`).
 * Le traitement des événements (paiement autorisé, compte Connect prêt,
 * transferts) sera branché avec le tunnel de paiement.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await req.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  switch (event.type) {
    default:
      // Événements pris en charge à l'étape « paiement »
      break;
  }

  return NextResponse.json({ received: true });
}
