import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "./Logo";

/** Badge « Lieu vérifié Fauteo » : pilule blanche, symbole 20 px. `short` : « Lieu vérifié » (cartes). */
export function VerifiedPlaceBadge({ short = false, className }: { short?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-3 text-[13px] font-bold leading-none text-ink",
        className
      )}
    >
      <LogoMark size={20} />
      {short ? "Lieu vérifié" : "Lieu vérifié Fauteo"}
    </span>
  );
}

/** Badge « Documents validés » : pilule vert doux. */
export function DocumentsValidatedBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full bg-success-subtle px-3.5 py-2 text-[13px] font-bold leading-none text-success", className)}>
      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden /> Documents validés
    </span>
  );
}
