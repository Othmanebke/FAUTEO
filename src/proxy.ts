import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Toutes les routes sauf les fichiers statiques, les images et le webhook Stripe
    "/((?!_next/static|_next/image|favicon.ico|api/webhooks|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
