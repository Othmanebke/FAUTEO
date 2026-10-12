"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import type { StationType } from "@/types";
import { StationImage } from "./StationImage";

/** Galerie 2/3 + 1/3 sur deux rangées ; toutes les photos dans une fenêtre dédiée. */
export function StationGallery({ photos, title, type }: { photos: string[]; title: string; type: StationType }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="grid gap-3 overflow-hidden rounded-[28px] sm:grid-cols-[2fr_1fr] sm:grid-rows-[240px_240px]">
        <StationImage src={photos[0] ?? null} alt={title} type={type} priority className="aspect-[4/3] sm:row-span-2 sm:aspect-auto sm:h-full" />
        <StationImage src={photos[1] ?? null} alt={`${title}, vue 2`} type={type} className="hidden h-full sm:block" />
        <div className="relative hidden h-full sm:block">
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
          {photos.map((src, i) => (
            <StationImage key={src} src={src} alt={`${title}, photo ${i + 1}`} type={type} className="aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      </Modal>
    </>
  );
}
