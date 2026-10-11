import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Client Supabase pour les Server Components, Server Functions et Route Handlers.
 * Agit au nom de l'utilisateur connecté (session lue dans les cookies), donc
 * soumis aux règles RLS. À créer à chaque requête, jamais en global.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Appelé depuis un Server Component : écriture impossible, la
          // session est rafraîchie par proxy.ts.
        }
      },
    },
  });
}
