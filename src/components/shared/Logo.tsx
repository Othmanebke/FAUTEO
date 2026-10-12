import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Symbole Fauteo : repère de lieu corail portant un « F ».
 * Version vectorielle redessinée d'après docs/brand/fauteo-logo-reference.png ;
 * à remplacer par le fichier source du designer dès qu'il est disponible.
 */
export function LogoMark({ className, title }: { className?: string; title?: string }) {
  // Identifiant unique : un dégradé déclaré dans un logo masqué (display:none) serait introuvable
  const gradientId = `fauteo-pin-${useId().replace(/:/g, "")}`;
  return (
    <svg
      viewBox="0 0 48 56"
      className={cn("h-8 w-auto shrink-0", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={gradientId} x1="8" y1="4" x2="40" y2="50" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FF8A72" />
          <stop offset="1" stopColor="#FF6B55" />
        </linearGradient>
      </defs>
      <path
        d="M24 2C12.4 2 3 11.3 3 22.8c0 8 5.1 14.4 10.4 20L21.9 51.7a2.9 2.9 0 0 0 4.2 0l8.5-8.9C39.9 37.2 45 30.8 45 22.8 45 11.3 35.6 2 24 2Z"
        fill={`url(#${gradientId})`}
      />
      <g fill="none" stroke="#fff" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 35V18.8c0-2.4 1.9-4.3 4.3-4.3h8.7" />
        <path d="M17.5 25h10.2a3.1 3.1 0 0 1 0 6.2h-3.4l4.4 4.3" />
      </g>
    </svg>
  );
}

const SIZES = {
  xs: { mark: "h-7", word: "text-[17px]", tagline: "mt-[3px] text-[8px]" },
  sm: { mark: "h-7", word: "text-[18px]", tagline: "mt-1 text-[9px]" },
  md: { mark: "h-8", word: "text-[19px]", tagline: "mt-1 text-[9px]" },
} as const;

export function Logo({
  className,
  withTagline = false,
  size = "md",
}: {
  className?: string;
  withTagline?: boolean;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={s.mark} />
      <span className="flex flex-col leading-none">
        <span className={cn(s.word, "font-extrabold tracking-[0.08em] text-ink")}>FAUTEO</span>
        {withTagline && <span className={cn(s.tagline, "font-semibold tracking-[0.28em] text-ink-muted")}>LA CONNEXION &amp; LE LIEU</span>}
      </span>
    </span>
  );
}
