import Link from "next/link";
import { BadgeCheck, MapPin, Star, Zap } from "lucide-react";
import { PriceTag } from "@/components/ui/PriceTag";
import { STATION_TYPE_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { StationSearchResult } from "@/types";
import { StationImage } from "./StationImage";

export function formatDistance(meters: number | null) {
  if (meters === null) return null;
  return meters < 1000 ? `${Math.round(meters / 10) * 10} m` : `${(meters / 1000).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} km`;
}

/** Carte d'annonce : photo, informations clés, prix et caution. */
export function StationCard({
  station,
  photoUrl,
  highlighted = false,
  href,
}: {
  station: StationSearchResult;
  photoUrl: string | null;
  highlighted?: boolean;
  href: string;
}) {
  const distance = formatDistance(station.distance_m);

  return (
    <Link
      href={href}
      className={cn(
        "group block overflow-hidden rounded-[var(--radius-card)] border bg-surface shadow-card transition-[box-shadow,border-color,transform] duration-200",
        "hover:-translate-y-0.5 hover:shadow-raised focus-visible:-translate-y-0.5",
        highlighted ? "border-primary" : "border-line hover:border-line-strong"
      )}
    >
      <div className="relative">
        <StationImage src={photoUrl} alt={station.title} type={station.type} className="aspect-[4/3]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {station.host_verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface/95 px-2.5 py-1 text-xs font-semibold text-success shadow-card backdrop-blur">
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Vérifié
            </span>
          )}
          {station.booking_mode === "instant" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface/95 px-2.5 py-1 text-xs font-semibold text-ink shadow-card backdrop-blur">
              <Zap className="h-3.5 w-3.5 text-primary" aria-hidden /> Instantanée
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-1 font-bold text-ink">{station.title}</h3>
            {station.rating_avg !== null && station.rating_count > 0 ? (
              <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink">
                <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
                {Number(station.rating_avg).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                <span className="font-normal text-ink-muted">({station.rating_count})</span>
              </span>
            ) : (
              <span className="shrink-0 text-xs font-semibold text-ink-muted">Nouveau</span>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden />
            <span className="line-clamp-1">
              {station.venue_name} · {station.city}
              {distance && ` · ${distance}`}
            </span>
          </p>
          <p className="text-sm text-ink-muted">{STATION_TYPE_LABELS[station.type]}</p>
        </div>
        <div className="border-t border-line pt-3">
          <PriceTag priceCents={station.price_cents} unit={station.price_unit} depositCents={station.deposit_cents} />
        </div>
      </div>
    </Link>
  );
}
