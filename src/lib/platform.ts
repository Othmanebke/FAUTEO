import "server-only";

import { cacheLife } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";

/** Taux de frais publics (transparence, CDC §11), mis en cache une heure. */
export async function getPublicFees() {
  "use cache";
  cacheLife("hours");
  const { data } = await createPublicClient().from("platform_settings").select("pro_fee_bps, host_fee_bps").single();
  return { proFeeBps: data?.pro_fee_bps ?? 800, hostFeeBps: data?.host_fee_bps ?? 500 };
}
