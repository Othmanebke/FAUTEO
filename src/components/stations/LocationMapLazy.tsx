"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

/** Chargement côté client uniquement (Leaflet dépend de window). */
export const LocationMapLazy = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full rounded-[var(--radius-card)]" />,
});
