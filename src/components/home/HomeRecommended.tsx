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
          <h2 className="text-[26px] font-bold tracking-[-0.02em] text-ink sm:text-[36px]">Recommandés pour vous</h2>
          <p className="mt-2 text-[17px] text-ink-muted">Des postes bien notés, prêts à vous accueillir.</p>
        </div>
        <div className="-mx-4 flex w-[calc(100%+2rem)] gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:w-auto sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&>*]:shrink-0" role="group" aria-label="Filtrer par métier">
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
        <div className="-mx-4 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] md:gap-6 md:overflow-visible md:px-0 md:pb-0">
          {shown.map((s) => (
            <StationFeatureCard key={s.id} station={s} className="h-[370px] w-[272px] shrink-0 snap-start md:h-[420px] md:w-auto" />
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
