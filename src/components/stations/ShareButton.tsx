"use client";

import { useState } from "react";
import { Check, Share } from "lucide-react";

/** Partage natif (mobile) ou copie du lien dans le presse-papiers. */
export function ShareButton({ title }: { title: string }) {
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

  return (
    <button
      type="button"
      onClick={share}
      className="inline-flex h-[42px] items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-line-strong hover:bg-canvas-alt"
    >
      {copied ? <Check className="h-4 w-4 text-success" aria-hidden /> : <Share className="h-4 w-4" aria-hidden />}
      <span aria-live="polite">{copied ? "Lien copié" : "Partager"}</span>
    </button>
  );
}
