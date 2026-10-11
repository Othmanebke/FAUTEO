"use client";

import React, { useState } from "react";
import { MapPin, Navigation, Sparkles, CheckCircle2 } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface MapListingPoint {
  id: string;
  title: string;
  pricePerDay: number;
  depositAmount: number;
  city: string;
  category: string;
  xPercent: number; // Position X sur la maquette vectorielle
  yPercent: number; // Position Y sur la maquette vectorielle
  isVerified: boolean;
}

const mockLocations: MapListingPoint[] = [
  {
    id: "lst-1",
    title: "Fauteuil Barber & Coiffure - Marais",
    pricePerDay: 55,
    depositAmount: 200,
    city: "Paris 3e",
    category: "Coiffure",
    xPercent: 48,
    yPercent: 42,
    isVerified: true,
  },
  {
    id: "lst-2",
    title: "Poste Onglerie & Nail Art Privatif",
    pricePerDay: 40,
    depositAmount: 150,
    city: "Paris 11e",
    category: "Onglerie",
    xPercent: 58,
    yPercent: 48,
    isVerified: true,
  },
  {
    id: "lst-3",
    title: "Cabine Tatouage Stérile & Équipée",
    pricePerDay: 75,
    depositAmount: 350,
    city: "Paris 10e",
    category: "Tatouage",
    xPercent: 52,
    yPercent: 32,
    isVerified: true,
  },
  {
    id: "lst-4",
    title: "Espace Soin & Esthétique Haute Gamme",
    pricePerDay: 65,
    depositAmount: 250,
    city: "Paris 1er",
    category: "Esthétique",
    xPercent: 42,
    yPercent: 50,
    isVerified: true,
  },
];

export function InteractiveMap({
  selectedId,
  onSelectListing,
}: {
  selectedId?: string;
  onSelectListing?: (id: string) => void;
}) {
  const [activePin, setActivePin] = useState<string | null>(selectedId || "lst-1");

  const handleSelect = (id: string) => {
    setActivePin(id);
    if (onSelectListing) onSelectListing(id);
  };

  const currentActive = mockLocations.find((loc) => loc.id === activePin) || mockLocations[0];

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-[#f8f9fa] dark:bg-[#0c0e12] shadow-inner select-none">
      {/* Background stylized vector grid & map routes */}
      <div className="absolute inset-0 opacity-40 dark:opacity-20 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-gray-300 dark:text-gray-700" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Stylized river & city lines */}
          <path
            d="M 0,260 Q 200,210 400,280 T 800,240 T 1200,270"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            className="text-blue-100 dark:text-slate-800"
          />
        </svg>
      </div>

      {/* Map Header indicator */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur border border-gray-200 text-xs font-medium text-gray-800 dark:bg-[#12151c]/90 dark:border-gray-800 dark:text-gray-200">
        <Navigation className="h-3.5 w-3.5 text-[#b58e6d]" />
        <span>Région Parisienne & Métropoles</span>
        <span className="text-gray-400">•</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{mockLocations.length} postes disponibles</span>
      </div>

      {/* Map Pins */}
      {mockLocations.map((item) => {
        const isSelected = item.id === activePin;
        return (
          <div
            key={item.id}
            style={{ left: `${item.xPercent}%`, top: `${item.yPercent}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
            onClick={() => handleSelect(item.id)}
          >
            <div
              className={cn(
                "relative flex items-center justify-center transition-all duration-300 rounded-full shadow-md font-bold text-xs px-2.5 py-1.5 border",
                isSelected
                  ? "bg-gray-950 text-white border-white scale-110 shadow-xl dark:bg-white dark:text-black dark:border-gray-950"
                  : "bg-white text-gray-900 border-gray-200 hover:border-gray-400 dark:bg-[#181b22] dark:text-white dark:border-gray-700"
              )}
            >
              <span>{formatCurrency(item.pricePerDay)}</span>
              <span className="text-[10px] font-normal opacity-80">/j</span>
            </div>

            {/* Ripple pulse on selected item */}
            {isSelected && (
              <span className="absolute -inset-1 rounded-full bg-[#b58e6d]/30 animate-ping pointer-events-none" />
            )}
          </div>
        );
      })}

      {/* Floating detail preview for currently selected pin */}
      {currentActive && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-30 rounded-xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-[#12151c]/95 transition-all animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#b58e6d]">
              {currentActive.category}
            </span>
            {currentActive.isVerified && (
              <Badge variant="verified" size="sm">
                <CheckCircle2 className="h-3 w-3" />
                Vérifié
              </Badge>
            )}
          </div>
          <h5 className="mt-1 text-sm font-bold text-gray-950 dark:text-white line-clamp-1">
            {currentActive.title}
          </h5>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {currentActive.city} • Réservation en 4 étapes
          </p>

          <div className="mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-extrabold text-sm text-gray-950 dark:text-white">
                {formatCurrency(currentActive.pricePerDay)}
              </span>
              <span className="text-gray-500"> / jour</span>
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              Caution : <span className="font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(currentActive.depositAmount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
