import "server-only";

import { cacheLife } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { listingPhotoUrl } from "@/lib/stations";
import type { FeatureStation } from "@/components/stations/StationFeatureCard";
import type { Trade } from "@/types";

export interface HomeStation extends FeatureStation {
  trades: Trade[];
}

export interface HomeData {
  featured: HomeStation[];
  tradeCounts: Partial<Record<Trade, number>>;
  /** Note moyenne pondérée des postes notés, et nombre total d'avis. */
  rating: { average: number; reviews: number } | null;
  members: number;
}

/**
 * Données de l'accueil, toutes réelles et publiques, mises en cache
 * quelques minutes (aucune lecture de session : la page reste statique).
 */
export async function getHomeData(): Promise<HomeData> {
  "use cache";
  cacheLife("minutes");

  const supabase = createPublicClient();
  const [{ data: results }, { data: published }, { count: members }] = await Promise.all([
    supabase.rpc("search_stations", { p_sort: "rating", p_limit: 24, p_radius_m: 15000 }),
    supabase.from("stations").select("trades, rating_avg, rating_count").eq("status", "published"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);

  const featured: HomeStation[] = (results ?? []).map((r) => ({
    id: r.station_id,
    title: r.title,
    type: r.type,
    venueName: r.venue_name,
    city: r.city,
    priceCents: r.price_cents,
    priceUnit: r.price_unit,
    ratingAvg: r.rating_avg,
    ratingCount: r.rating_count,
    verified: r.host_verified,
    photoUrl: listingPhotoUrl(r.cover_photo_path),
    trades: r.trades,
  }));

  const tradeCounts: Partial<Record<Trade, number>> = {};
  let weighted = 0;
  let reviews = 0;
  for (const s of published ?? []) {
    for (const t of s.trades) tradeCounts[t] = (tradeCounts[t] ?? 0) + 1;
    if (s.rating_avg !== null && s.rating_count > 0) {
      weighted += Number(s.rating_avg) * s.rating_count;
      reviews += s.rating_count;
    }
  }

  return {
    featured,
    tradeCounts,
    rating: reviews > 0 ? { average: weighted / reviews, reviews } : null,
    members: members ?? 0,
  };
}
