import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { supabaseServiceRoleKey, supabaseUrl } from "./env";

/**
 * Client Supabase « service_role » : contourne les RLS.
 * Réservé aux traitements serveur de confiance (webhooks Stripe, tâches
 * planifiées, génération de PDF). Ne jamais l'utiliser pour une action
 * initiée par un utilisateur sans avoir vérifié ses droits au préalable.
 */
export function createAdminClient() {
  return createClient<Database>(supabaseUrl(), supabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
