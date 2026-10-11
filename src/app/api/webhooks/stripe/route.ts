import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

/**
 * Webhook handler for Stripe Connect marketplace events:
 * - payment_intent.succeeded (Location payée, calcul de commission)
 * - payment_intent.amount_capturable_updated (Empreinte de caution autorisée)
 * - account.updated (Vérification du compte bancaire de l'hôte)
 */
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Mode simulation pour développement
      event = JSON.parse(body);
    }
  } catch (err: any) {
    console.error(`⚠️ Erreur webhook Stripe : ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Traitement des événements
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      console.log(`Paiement réussi pour réservation : ${paymentIntent.id}`);
      // Mettre à jour le statut dans Supabase Database (bookings)
      break;
    }
    case "payment_intent.amount_capturable_updated": {
      const paymentIntent = event.data.object;
      console.log(`Caution retenue avec succès (empreinte bancaire) : ${paymentIntent.id}`);
      break;
    }
    case "account.updated": {
      const account = event.data.object;
      console.log(`Compte Stripe Connect hôte mis à jour : ${account.id}`);
      break;
    }
    default:
      console.log(`Événement non traité : ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
