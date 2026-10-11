"use client";

import { Search } from "lucide-react";
import { TRADE_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import type { Trade } from "@/types";
import { PlaceInput } from "./PlaceInput";

/** Barre de recherche de l'accueil : métier + lieu → /recherche. */
export function HeroSearch() {
  return (
    <form action="/recherche" method="get" role="search" aria-label="Rechercher un poste" className="grid gap-2 rounded-[1.75rem] border border-line bg-surface p-2 shadow-raised sm:grid-cols-[0.9fr_1.4fr_auto]">
      <label htmlFor="hero-metier" className="sr-only">
        Métier
      </label>
      <select
        id="hero-metier"
        name="metier"
        defaultValue=""
        className="h-12 w-full appearance-none rounded-full border border-transparent bg-canvas px-4 text-[15px] text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
      >
        <option value="">Tous les métiers</option>
        {(Object.entries(TRADE_LABELS) as [Trade, string][]).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <PlaceInput inputClassName="border-transparent bg-canvas" />
      <Button type="submit" size="lg" className="h-12">
        <Search className="h-4 w-4" aria-hidden /> Rechercher
      </Button>
    </form>
  );
}
