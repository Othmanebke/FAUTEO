"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { SaveButton } from "@/components/favorites/SaveButton";
import type { StationType } from "@/types";
import { ShareButton } from "./ShareButton";
import { StationImage } from "./StationImage";

/**
 * Galerie d'un poste.
 * - Mobile : photo plein écran, boutons ronds (retour, partager, enregistrer) et compteur.
 * - Tablette et desktop : grille 2/3 + 1/3 sur deux rangées.
 * Toutes les photos s'ouvrent dans une fenêtre dédiée.
 */
export function StationGallery({ photos, title, type, stationId }: { photos: string[]; title: string; type: StationType; stationId: string }) {
  const [open, setOpen] = useState(false);
  const count = Math.max(photos.length, 1);

  return (
    <>
      {/* Mobile */}
      <div className="relative -mx-4 -mt-8 h-[300px] md:hidden">
        <button type="button" onClick={() => setOpen(true)} className="block h-full w-full" aria-label={`Voir les photos de ${title}`}>
          <StationImage src={photos[0] ?? null} alt={title} type={type} priority className="h-full w-full" />
        </button>
        <Link
          href="/recherche"
          aria-label="Retour aux résultats"
          className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-surface/95 text-ink shadow-card backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden />
        </Link>
        <div className="absolute right-4 top-4 flex gap-2">
          <ShareButton title={title} variant="round" />
          <SaveButton stationId={stationId} variant="card" className="h-11 w-11" />
        </div>
        <span className="absolute bottom-12 right-4 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-bold text-white">1 / {count}</span>
      </div>

      {/* Tablette et desktop */}
      <div className="hidden gap-3 overflow-hidden rounded-[28px] md:grid md:grid-cols-[2fr_1fr] md:grid-rows-[240px_240px]">
        <StationImage src={photos[0] ?? null} alt={title} type={type} priority className="row-span-2 h-full" />
        <StationImage src={photos[1] ?? null} alt={`${title}, vue 2`} type={type} className="h-full" />
        <div className="relative h-full">
          <StationImage src={photos[2] ?? null} alt={`${title}, vue 3`} type={type} className="h-full" />
          {photos.length > 3 && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="absolute bottom-3.5 right-3.5 rounded-full bg-surface px-3.5 py-2 text-[13px] font-bold text-ink shadow-[0_4px_20px_rgb(37_42_49/10%)] hover:bg-canvas-alt"
            >
              Voir les {photos.length} photos
            </button>
          )}
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`Photos · ${title}`} className="max-w-4xl">
        <div className="grid max-h-[70vh] gap-3 overflow-y-auto sm:grid-cols-2">
          {(photos.length ? photos : [null]).map((src, i) => (
            <StationImage key={src ?? i} src={src} alt={`${title}, photo ${i + 1}`} type={type} className="aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      </Modal>
    </>
  );
}
