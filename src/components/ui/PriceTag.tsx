import { ShieldCheck } from "lucide-react";
import { PRICE_UNIT_LABELS } from "@/lib/labels";
import { cn, formatCents } from "@/lib/utils";
import type { PriceUnit } from "@/types";

export interface PriceTagProps {
  priceCents: number;
  unit: PriceUnit;
  depositCents?: number;
  size?: "sm" | "lg";
  className?: string;
}

/**
 * Affichage d'un prix et de sa caution : un montant, une unité, une ligne
 * de caution. Rien d'autre.
 */
export function PriceTag({ priceCents, unit, depositCents = 0, size = "sm", className }: PriceTagProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="flex items-baseline gap-1 text-ink">
        <span className={cn("font-bold tabular-nums tracking-tight", size === "lg" ? "text-3xl" : "text-lg")}>
          {formatCents(priceCents)}
        </span>
        <span className="text-sm text-ink-muted">/ {PRICE_UNIT_LABELS[unit].short}</span>
      </p>
      {depositCents > 0 && (
        <p className="flex items-center gap-1.5 text-sm text-ink-muted">
          <ShieldCheck className="h-4 w-4 text-success" aria-hidden />
          Caution {formatCents(depositCents)} · non débitée
        </p>
      )}
    </div>
  );
}
