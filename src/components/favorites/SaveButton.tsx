"use client";

import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "./FavoritesProvider";

type Variant = "photo" | "card" | "pill";

/**
 * Signet « Enregistrer » :
 * - photo : rond translucide sur photo sombre (StationFeatureCard) ;
 * - card  : rond blanc en haut à droite d'une carte (StationCard) ;
 * - pill  : bouton bordé avec libellé (fiche d'un poste).
 */
export function SaveButton({ stationId, variant, className }: { stationId: string; variant: Variant; className?: string }) {
  const { isSaved, toggle } = useFavorites();
  const saved = isSaved(stationId);

  function onClick(e: React.MouseEvent) {
    // Le signet vit souvent dans un lien de carte : on ne suit pas le lien
    e.preventDefault();
    e.stopPropagation();
    void toggle(stationId);
  }

  const label = saved ? "Retirer des postes enregistrés" : "Enregistrer ce poste";

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        className={cn(
          "inline-flex h-[42px] items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-line-strong hover:bg-canvas-alt",
          className
        )}
      >
        <Bookmark className={cn("h-4 w-4", saved && "fill-primary text-primary")} aria-hidden />
        {saved ? "Enregistré" : "Enregistrer"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full transition-[background-color,transform] active:scale-95",
        variant === "photo" && "h-[42px] w-[42px] bg-white/16 backdrop-blur-sm hover:bg-white/25",
        variant === "card" && "h-10 w-10 bg-surface/95 shadow-card backdrop-blur hover:bg-surface",
        className
      )}
    >
      <Bookmark
        className={cn(
          "h-5 w-5",
          saved ? "fill-primary text-primary" : variant === "photo" ? "text-white" : "text-ink"
        )}
        aria-hidden
      />
    </button>
  );
}
