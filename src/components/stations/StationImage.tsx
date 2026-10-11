"use client";

import { useEffect, useRef, useState } from "react";
import { Armchair, Brush, Hand, PenTool, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StationType } from "@/types";

const ICONS: Record<StationType, React.ElementType> = {
  fauteuil_coiffure: Armchair,
  poste_barber: Scissors,
  cabine_soins: Brush,
  table_onglerie: Hand,
  box_tatouage: PenTool,
};

/**
 * Photo d'annonce avec repli : si l'image est absente ou ne se charge pas,
 * un visuel sobre aux couleurs de la marque reprend le type de poste.
 */
export function StationImage({
  src,
  alt,
  type,
  className,
  priority = false,
}: {
  src: string | null;
  alt: string;
  type: StationType;
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Une image rendue côté serveur peut échouer avant que React ne s'y attache
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  const Icon = ICONS[type];

  return (
    <div className={cn("relative overflow-hidden bg-surface-soft", className)}>
      {src && !failed ? (
        // Images servies par Supabase Storage (domaine variable selon l'environnement)
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div role="img" aria-label={alt} className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-soft via-primary-subtle/50 to-canvas-alt">
          <Icon className="h-14 w-14 text-primary/60" strokeWidth={1.25} aria-hidden />
        </div>
      )}
    </div>
  );
}
