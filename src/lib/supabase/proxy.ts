import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { supabaseAnonKey, supabaseUrl } from "./env";

/** Espaces qui exigent une session. Les droits fins sont vérifiés côté serveur et en base (RLS). */
const PROTECTED_PREFIXES = ["/host", "/pro", "/admin", "/account", "/onboarding", "/bookings", "/messages"];

/**
 * Rafraîchit la session Supabase à chaque requête et redirige vers la
 * connexion les visiteurs non authentifiés sur les espaces protégés.
 * Vérification « optimiste » : la sécurité réelle reste dans les RLS.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Ne rien intercaler entre la création du client et cet appel :
  // c'est lui qui rafraîchit le jeton expiré.
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);

  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

  if (isProtected && !isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
