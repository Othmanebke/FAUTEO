import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { SaveButton } from "@/components/favorites/SaveButton";
import { PRICE_UNIT_LABELS } from "@/lib/labels";
import { cn, formatCents } from "@/lib/utils";
import type { PriceUnit, StationType } from "@/types";
import { formatRating } from "./StationCard";
import { StationImage } from "./StationImage";

export interface FeatureStation {
  id: string;
  title: string;
  type: StationType;
  venueName: string;
  city: string;
  priceCents: number;
  priceUnit: PriceUnit;
  ratingAvg: number | string | null;
  ratingCount: number;
  verified: boolean;
  photoUrl: string | null;
}

/** Grande carte photo plein cadre (accueil) : note, badge, titre, prix sur dégradé sombre. */
export function StationFeatureCard({ station, className }: { station: FeatureStation; className?: string }) {
  const rating = station.ratingCount > 0 ? formatRating(station.ratingAvg) : null;

  return (
    <Link
      href={`/postes/${station.id}`}
      className={cn(
        "group relative block h-[420px] overflow-hidden rounded-[32px] bg-surface-soft shadow-[0_12px_32px_rgb(37_42_49/8%)] transition-transform duration-300 hover:-translate-y-1",
        className
      )}
    >
      <StationImage src={station.photoUrl} alt={station.title} type={station.type} className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(37_42_49/0%)_40%,rgb(37_42_49/88%)_100%)]" />

      {rating ? (
        <span className="pointer-events-none absolute right-[18px] top-[18px] rounded-full bg-primary px-2.5 py-1.5 text-[13px] font-bold text-on-primary">
          ★ {rating}
        </span>
      ) : (
        <span className="pointer-events-none absolute right-[18px] top-[18px] rounded-full bg-white/94 px-2.5 py-1.5 text-[13px] font-bold text-ink">Nouveau</span>
      )}
      {station.verified && (
        <span className="pointer-events-none absolute left-[18px] top-[18px] flex items-center gap-[5px] rounded-full bg-white/94 px-2.5 py-1.5 text-xs font-bold text-success">
          <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Vérifié
        </span>
      )}

      <div className="absolute inset-x-[22px] bottom-[22px] text-white">
        <p className="text-pretty text-[21px] font-bold leading-[1.2]">{station.title}</p>
        <p className="mt-1.5 text-[13px] opacity-85">
          {station.venueName} · {station.city}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <p>
            <span className="text-[22px] font-bold text-primary-soft-ink">{formatCents(station.priceCents)}</span>
            <span className="text-[13px] opacity-85"> / {PRICE_UNIT_LABELS[station.priceUnit].short}</span>
          </p>
          <SaveButton stationId={station.id} variant="photo" />
        </div>
      </div>
    </Link>
  );
}
