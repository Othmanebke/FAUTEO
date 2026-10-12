"use client";

import { useState } from "react";
import { StationFeatureCard } from "@/components/stations/StationFeatureCard";
import { TRADE_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { HomeStation } from "@/lib/home";
import type { Trade } from "@/types";

/** « Recommandés pour vous » : filtres métier en pills + 4 grandes cartes photo. */
export function HomeRecommended({ stations }: { stations: HomeStation[] }) {
  const [trade, setTrade] = useState<Trade | "all">("all");
  const shown = (trade === "all" ? stations : stations.filter((s) => s.trades.includes(trade))).slice(0, 4);
  const chips: [Trade | "all", string][] = [["all", "Tous"], ...(Object.entries(TRADE_LABELS) as [Trade, string][])];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 className="text-[30px] font-bold tracking-[-0.02em] text-ink sm:text-[36px]">Recommandés pour vous</h2>
          <p className="mt-2 text-[17px] text-ink-muted">Des postes bien notés, prêts à vous accueillir.</p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par métier">
          {chips.map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={key === trade}
              onClick={() => setTrade(key)}
              className={cn(
                "h-10 rounded-full border-[1.5px] px-[18px] text-sm font-semibold text-ink transition-colors",
                key === trade ? "border-primary bg-primary" : "border-line bg-surface hover:border-line-strong"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {shown.length > 0 ? (
        <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          {shown.map((s) => (
            <StationFeatureCard key={s.id} station={s} />
          ))}
        </div>
      ) : (
        <p className="mt-7 rounded-[24px] border border-dashed border-line-strong px-6 py-12 text-center text-ink-muted">
          Pas encore de poste {trade !== "all" && TRADE_LABELS[trade].toLowerCase()} en ligne. Revenez bientôt.
        </p>
      )}
    </>
  );
}
