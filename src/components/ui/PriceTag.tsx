import React from "react";
import { ShieldCheck, Info } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

export interface PriceTagProps {
  pricePerDay: number;
  depositAmount: number;
  pricePerHalfDay?: number | null;
  period?: "jour" | "demi-journée" | "mois";
  showDepositBadge?: boolean;
  compact?: boolean;
  className?: string;
}

export function PriceTag({
  pricePerDay,
  depositAmount,
  pricePerHalfDay,
  period = "jour",
  showDepositBadge = true,
  compact = false,
  className,
}: PriceTagProps) {
  const activePrice = period === "demi-journée" && pricePerHalfDay ? pricePerHalfDay : pricePerDay;

  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white tabular-nums">
          {formatCurrency(activePrice)}
        </span>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          / {period}
        </span>
      </div>

      {showDepositBadge && (
        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
          <span className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700 dark:bg-[#1a1f29] dark:text-gray-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Caution : {formatCurrency(depositAmount)}
          </span>
          {!compact && (
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              (Empreinte bancaire, non débitée)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
