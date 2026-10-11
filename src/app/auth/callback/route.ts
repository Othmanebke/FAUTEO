import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/auth/session";

/**
 * Retour des liens Supabase Auth (confirmation d'e-mail, mot de passe
 * oublié, connexion Google / Apple) : échange du code contre une session.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"), "/onboarding");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }

  const description = searchParams.get("error_description");
  const loginUrl = new URL("/login", origin);
  loginUrl.searchParams.set("erreur", description ? "lien" : "code");
  return NextResponse.redirect(loginUrl);
}
