"use client";

import { useState } from "react";
import { Check, Share } from "lucide-react";
import { cn } from "@/lib/utils";

/** Partage natif (mobile) ou copie du lien. `round` : bouton rond sur photo (galerie mobile). */
export function ShareButton({ title, variant = "pill" }: { title: string; variant?: "pill" | "round" }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href.split("?")[0];
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const icon = copied ? <Check className="h-4 w-4 text-success" aria-hidden /> : <Share className="h-4 w-4" aria-hidden />;

  if (variant === "round") {
    return (
      <button
        type="button"
        onClick={share}
        aria-label={copied ? "Lien copié" : "Partager"}
        className={cn("flex h-11 w-11 items-center justify-center rounded-full bg-surface/95 text-ink shadow-card backdrop-blur")}
      >
        {icon}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex h-[42px] items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-line-strong hover:bg-canvas-alt"
    >
      {icon}
      <span aria-live="polite">{copied ? "Lien copié" : "Partager"}</span>
    </button>
  );
}
