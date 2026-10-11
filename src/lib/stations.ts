import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { Constants } from "@/types/database.types";
import { createPublicClient } from "@/lib/supabase/public";
import { supabaseUrl } from "@/lib/supabase/env";
import type { PriceUnit, StationSearchResult } from "@/types";

/** URL publique d'une photo du bucket « listing-photos ». */
export function listingPhotoUrl(path: string | null | undefined): string | null {
  return path ? `${supabaseUrl()}/storage/v1/object/public/listing-photos/${path}` : null;
}

// ---------------------------------------------------------------------
// Recherche (F-20 à F-23) : l'URL porte l'état des filtres
// ---------------------------------------------------------------------
const one = (v: unknown) => (Array.isArray(v) ? v[0] : v);
const emptyToUndefined = (v: unknown) => (v === "" || v === null ? undefined : v);

export const searchParamsSchema = z.object({
  metier: z.preprocess(emptyToUndefined, z.enum(Constants.public.Enums.trade).optional()),
  lieu: z.preprocess(emptyToUndefined, z.string().max(120).optional()),
  lat: z.preprocess(emptyToUndefined, z.coerce.number().min(-90).max(90).optional()),
  lng: z.preprocess(emptyToUndefined, z.coerce.number().min(-180).max(180).optional()),
  rayon: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(100).default(10)),
  duree: z.preprocess(emptyToUndefined, z.enum(Constants.public.Enums.price_unit).optional()),
  date: z.preprocess(emptyToUndefined, z.iso.date().optional()),
  heure: z.preprocess(emptyToUndefined, z.string().regex(/^\d{2}:\d{2}$/).default("09:00")),
  nb: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(52).default(1)),
  budget: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(10000).optional()),
  note: z.preprocess(emptyToUndefined, z.coerce.number().min(1).max(5).optional()),
  verifie: z.preprocess(emptyToUndefined, z.literal("1").optional()),
  equipements: z.array(z.string().regex(/^[a-z0-9_]+$/)).max(10).default([]),
  tri: z.preprocess(emptyToUndefined, z.enum(["distance", "prix", "note"]).default("distance")),
});

export type SearchFilters = z.infer<typeof searchParamsSchema>;

export function parseSearchParams(raw: Record<string, string | string[] | undefined>): SearchFilters {
  const flat = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, k === "equipements" ? undefined : one(v)]));
  const equipements = ([] as string[]).concat(raw.equipements ?? []).flatMap((e) => e.split(",")).filter(Boolean);
  const parsed = searchParamsSchema.safeParse({ ...flat, equipements });
  return parsed.success ? parsed.data : searchParamsSchema.parse({});
}

/** Début du créneau (heure de Paris) à partir de la date et de l'heure choisies. */
function startOf(filters: SearchFilters): string | null {
  if (!filters.date || !filters.duree) return null;
  const time = filters.duree === "hour" || filters.duree === "half_day" ? filters.heure : "00:00";
  // Décalage horaire de Paris à cette date (heure d'été ou d'hiver), ex. « GMT+02:00 »
  const zone = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", timeZoneName: "longOffset" })
    .formatToParts(new Date(`${filters.date}T12:00:00Z`))
    .find((p) => p.type === "timeZoneName")?.value;
  const offset = zone?.replace("GMT", "") || "+00:00";
  return `${filters.date}T${time}:00${offset}`;
}

export async function searchStations(filters: SearchFilters): Promise<StationSearchResult[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("search_stations", {
    p_lat: filters.lat,
    p_lng: filters.lng,
    p_radius_m: filters.rayon * 1000,
    p_trade: filters.metier,
    p_unit: filters.duree,
    p_start: startOf(filters) ?? undefined,
    p_quantity: filters.nb,
    p_max_price_cents: filters.budget ? filters.budget * 100 : undefined,
    p_amenities: filters.equipements.length ? filters.equipements : undefined,
    p_min_rating: filters.note,
    p_verified_only: filters.verifie === "1",
    p_sort: filters.tri === "prix" ? "price" : filters.tri === "note" ? "rating" : "distance",
    p_limit: 60,
  });
  if (error) {
    // Requête annulée (navigation interrompue) : le rendu est abandonné, rien à signaler
    if (error.message.includes("AbortError")) return [];
    throw new Error(`Recherche indisponible : ${error.message}`);
  }
  return data ?? [];
}

// ---------------------------------------------------------------------
// Fiche d'un poste (données publiques, en cache quelques minutes)
// ---------------------------------------------------------------------
export async function getStation(id: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag(`station-${id}`);

  if (!z.uuid().safeParse(id).success) return null;
  const supabase = createPublicClient();

  const { data: station } = await supabase
    .from("stations")
    .select("*, venue:venues(*), photos:station_photos(storage_path, position), rules:availability_rules(weekday, start_time, end_time, valid_from, valid_until)")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();
  if (!station || !station.venue) return null;

  const [{ data: host }, { data: verified }, { data: reviews }, { data: amenities }] = await Promise.all([
    supabase.from("profiles").select("first_name, created_at").eq("id", station.host_id).single(),
    supabase.rpc("is_verified", { uid: station.host_id, role: "host" }),
    supabase
      .from("reviews")
      .select("id, rating, comment, published_at, author:profiles!reviews_author_id_fkey(first_name)")
      .eq("station_id", id)
      .eq("author_role", "pro")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(10),
    supabase.from("amenities").select("code, label"),
  ]);

  const amenityLabel = new Map((amenities ?? []).map((a) => [a.code, a.label]));
  const photos = [...station.photos].sort((a, b) => a.position - b.position).map((p) => listingPhotoUrl(p.storage_path)!);

  const prices = (
    [
      ["hour", station.price_hour_cents],
      ["half_day", station.price_half_day_cents],
      ["day", station.price_day_cents],
      ["week", station.price_week_cents],
      ["month", station.price_month_cents],
    ] as [PriceUnit, number | null][]
  ).filter((entry): entry is [PriceUnit, number] => entry[1] !== null);

  return {
    station,
    venue: station.venue,
    photos,
    prices,
    rules: station.rules,
    host: { firstName: host?.first_name ?? "", memberSince: host?.created_at ?? null, verified: Boolean(verified) },
    reviews: reviews ?? [],
    stationAmenities: station.amenities.map((code) => amenityLabel.get(code) ?? code),
    venueAmenities: station.venue.amenities.map((code) => amenityLabel.get(code) ?? code),
  };
}

export type StationDetail = NonNullable<Awaited<ReturnType<typeof getStation>>>;

/** Équipements filtrables (F-21), en cache. */
export async function getAmenityCatalog() {
  "use cache";
  cacheLife("days");
  const { data } = await createPublicClient().from("amenities").select("code, label, scope").order("label");
  return data ?? [];
}
