import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Client anonyme, sans cookies : lecture de données publiques (paramètres,
 * annonces publiées). Utilisable dans une fonction « use cache » puisqu'il
 * ne dépend pas de la requête.
 */
export function createPublicClient() {
  return createClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
