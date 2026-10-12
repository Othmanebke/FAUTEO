import { cn } from "@/lib/utils";

/**
 * Identité Fauteo — symbole « arche + fauteuil » (référence : Identité visuelle v1.0).
 *
 * L'arche évoque le lieu ; à l'intérieur, un fauteuil vu de profil dessine le F.
 * Tracés exacts, viewBox 0 0 48 56 : ne pas les modifier.
 *
 * Règles d'usage :
 * - Zone de protection : la largeur de l'arche tout autour du logo.
 * - Tailles minimales : logo complet 96 px de large, symbole seul 16 px.
 * - Fonds autorisés : #FFF9F5, #FFFFFF, #F7F4EF (coral ou ink) ; #252A31 (coral,
 *   texte #FFF9F5) ; #FF6B55 (inverse, texte blanc).
 * - Interdits : déformer, incliner, ajouter une ombre ou un dégradé, poser le
 *   corail sur une photo chargée, recolorer hors palette, écrire le mot-symbole
 *   en capitales.
 */

export type LogoVariant = "coral" | "inverse" | "ink";

const COLORS: Record<LogoVariant, { arch: string; stroke: string }> = {
  coral: { arch: "#FF6B55", stroke: "#FFFFFF" }, // fonds clairs et fond encre
  inverse: { arch: "#FFFFFF", stroke: "#FF6B55" }, // fond corail
  ink: { arch: "#252A31", stroke: "#F7F4EF" }, // monochrome
};

/** Symbole seul. `size` = hauteur en pixels. */
export function LogoMark({ size = 28, variant = "coral", className }: { size?: number; variant?: LogoVariant; className?: string }) {
  const { arch, stroke } = COLORS[variant];
  return (
    <svg viewBox="0 0 48 56" width={(size * 48) / 56} height={size} aria-hidden className={cn("shrink-0", className)}>
      <path d="M4 51V24a20 20 0 0 1 40 0v27a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" fill={arch} />
      <g fill="none" stroke={stroke} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 44V23.5a5 5 0 0 1 5-5h9" />
        <path d="M17 33h14v11" />
      </g>
    </svg>
  );
}

/**
 * Logo complet : symbole + mot-symbole « fauteo » (minuscules, Manrope 700).
 * - horizontal : écart = 0,36 × hauteur du symbole ; texte ≈ 0,9 × hauteur.
 * - stacked    : symbole au-dessus, écart 12 px, centré.
 * La couleur du mot-symbole suit currentColor (encre par défaut).
 */
export function Logo({
  size = 28,
  variant = "coral",
  layout = "horizontal",
  withTagline = false,
  textSize,
  className,
}: {
  size?: number;
  variant?: LogoVariant;
  layout?: "horizontal" | "stacked";
  withTagline?: boolean;
  /** Taille du mot-symbole en px (par défaut 0,9 × size). */
  textSize?: number;
  className?: string;
}) {
  const fontSize = textSize ?? Math.round(size * 0.9);
  const stacked = layout === "stacked";

  return (
    <span
      className={cn("inline-flex text-ink", stacked ? "flex-col items-center" : "items-center", className)}
      style={{ gap: stacked ? 12 : Math.round(size * 0.36) }}
    >
      <LogoMark size={size} variant={variant} />
      <span className={cn("flex flex-col", stacked ? "items-center" : "items-start")}>
        <span
          className="font-bold leading-none"
          style={{ fontSize, letterSpacing: fontSize > 40 ? "-0.05em" : "-0.04em", color: "currentColor" }}
        >
          fauteo
        </span>
        {withTagline && (
          <span className="mt-1.5 text-[9px] font-semibold uppercase leading-none tracking-[0.28em] text-ink-muted">Le bon poste · le bon lieu</span>
        )}
      </span>
    </span>
  );
}
