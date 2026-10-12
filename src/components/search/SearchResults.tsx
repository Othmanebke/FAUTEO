"use client";

import { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { List, Map as MapIcon, SearchX } from "lucide-react";
import { StationCard } from "@/components/stations/StationCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import type { StationSearchResult } from "@/types";
import type { MapPoint } from "./ResultsMap";

// Leaflet a besoin du navigateur : chargé uniquement côté client
const ResultsMap = dynamic(() => import("./ResultsMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-[28px]" />,
});

export interface SearchResultItem {
  station: StationSearchResult;
  photoUrl: string | null;
  href: string;
}

/** Liste + carte synchronisées ; sur mobile, bascule liste / carte. */
export function SearchResults({ items, summary }: { items: SearchResultItem[]; summary: string }) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const mapSection = useRef<HTMLElement>(null);

  function toggleView() {
    const next = mobileView === "list" ? "map" : "list";
    setMobileView(next);
    // La carte remplace la liste : on la ramène dans l'écran
    if (next === "map") requestAnimationFrame(() => mapSection.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  const points = useMemo<MapPoint[]>(
    () =>
      items.map(({ station, href }) => ({
        id: station.station_id,
        lat: station.latitude,
        lng: station.longitude,
        priceCents: station.price_cents,
        href,
        title: station.title,
      })),
    [items]
  );

  if (items.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="Aucun poste ne correspond"
        text="Élargissez le rayon, retirez un filtre ou changez de dates."
        className="mt-6"
      />
    );
  }

  return (
    <div className="relative mt-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-8">
      <section aria-label="Résultats" className={cn(mobileView === "map" && "hidden lg:block")}>
        <p className="mb-4 text-sm font-semibold text-ink-muted" aria-live="polite">
          {summary}
        </p>
        <ul className="grid gap-5 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item.station.station_id}
              onMouseEnter={() => setActiveId(item.station.station_id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(item.station.station_id)}
            >
              <StationCard station={item.station} photoUrl={item.photoUrl} href={item.href} highlighted={activeId === item.station.station_id} />
            </li>
          ))}
        </ul>
      </section>

      <section
        ref={mapSection}
        aria-label="Carte des résultats"
        className={cn(
          "lg:sticky lg:top-[100px] lg:block lg:h-[calc(100dvh-132px)]",
          mobileView === "map" ? "block h-[calc(100dvh-6rem)] scroll-mt-20" : "hidden"
        )}
      >
        <ResultsMap points={points} activeId={activeId} onHover={setActiveId} onSelect={(p) => router.push(p.href)} />
      </section>

      {/* Bascule liste / carte (mobile) */}
      <button
        type="button"
        onClick={toggleView}
        className="fixed bottom-6 left-1/2 z-[1100] inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-canvas shadow-raised lg:hidden"
      >
        {mobileView === "list" ? (
          <>
            <MapIcon className="h-4 w-4" aria-hidden /> Carte
          </>
        ) : (
          <>
            <List className="h-4 w-4" aria-hidden /> Liste
          </>
        )}
      </button>
    </div>
  );
}
