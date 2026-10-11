"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { supabaseAnonKey, supabaseUrl } from "./env";

/**
 * Client Supabase pour les composants client.
 * Soumis aux règles RLS de l'utilisateur connecté.
 */
export function createClient() {
  return createBrowserClient<Database>(supabaseUrl(), supabaseAnonKey());
}
