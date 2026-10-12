"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface FavoritesValue {
  isSaved: (stationId: string) => boolean;
  toggle: (stationId: string) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesValue | null>(null);

/**
 * Postes enregistrés de l'utilisateur connecté (table favorites, RLS).
 * Chargés une seule fois côté client ; un visiteur est renvoyé vers la connexion.
 */
export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    async function load(uid: string | null) {
      if (!uid) {
        if (!cancelled) setSaved(new Set());
        return;
      }
      const { data } = await supabase.from("favorites").select("station_id");
      if (!cancelled) setSaved(new Set((data ?? []).map((f) => f.station_id)));
    }

    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      setUserId(data.user?.id ?? null);
      void load(data.user?.id ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
      void load(session?.user.id ?? null);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const toggle = useCallback(
    async (stationId: string) => {
      if (!userId) {
        // URL lue au clic (et non au rendu) : compatible avec le prérendu
        router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      const supabase = createClient();
      const wasSaved = saved.has(stationId);
      // Mise à jour optimiste, annulée en cas d'échec
      setSaved((prev) => {
        const next = new Set(prev);
        if (wasSaved) next.delete(stationId);
        else next.add(stationId);
        return next;
      });
      const { error } = wasSaved
        ? await supabase.from("favorites").delete().eq("station_id", stationId).eq("profile_id", userId)
        : await supabase.from("favorites").insert({ profile_id: userId, station_id: stationId });
      if (error) {
        setSaved((prev) => {
          const next = new Set(prev);
          if (wasSaved) next.add(stationId);
          else next.delete(stationId);
          return next;
        });
      }
    },
    [router, saved, userId]
  );

  const value = useMemo<FavoritesValue>(() => ({ isSaved: (id) => saved.has(id), toggle }), [saved, toggle]);
  return <FavoritesContext value={value}>{children}</FavoritesContext>;
}

export function useFavorites(): FavoritesValue {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites doit être utilisé dans FavoritesProvider");
  return value;
}
