import React from "react";
import { cn } from "@/lib/utils";

interface BrandEmblemProps {
  size?: number;
  className?: string;
  subtle?: boolean;
}

/**
 * Emblème visuel inspiré de la pureté géométrique et haut de gamme (esprit Mercedes / étoile à trois branches stylisée).
 * Il évoque l'excellence, les trois piliers de Fauteo : Beauté, Hygiène & Sécurité.
 */
export function BrandEmblem({ size = 32, className, subtle = false }: BrandEmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "transition-transform duration-300",
        subtle ? "opacity-10 dark:opacity-15 pointer-events-none" : "opacity-100",
        className
      )}
    >
      {/* Outer refined ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="none"
        className="text-[#11141a] dark:text-[#f3f4f6]"
      />
      
      {/* Inner thin precision ring */}
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeOpacity="0.4"
        className="text-[#b58e6d]"
      />

      {/* Central 3-pointed precision star (high-end geometric harmony) */}
      <path
        d="M50 8 L53 47 L87 69 L51 53 L50 92 L49 53 L13 69 L47 47 Z"
        fill="currentColor"
        className="text-[#11141a] dark:text-[#f3f4f6]"
      />

      {/* Warm Champagne Accent Center */}
      <circle cx="50" cy="50" r="3" fill="#b58e6d" />
    </svg>
  );
}

export function BrandLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <BrandEmblem size={28} />
      <div className="flex flex-col">
        <span className="text-lg font-extrabold tracking-widest uppercase text-gray-950 dark:text-white font-sans">
          FAUTEO
        </span>
        <span className="text-[9px] tracking-[0.25em] text-[#b58e6d] uppercase font-medium -mt-1">
          Ateliers de Beauté
        </span>
      </div>
    </div>
  );
}
