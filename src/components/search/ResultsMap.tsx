"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { TILE_ATTRIBUTION, TILE_MAX_ZOOM, TILE_URL } from "@/components/maps/tiles";
import { formatCents } from "@/lib/utils";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  priceCents: number;
  href: string;
  title: string;
}

/** Symbole Fauteo en SVG brut (coral sur fond encre, inverse sur fond corail). */
function markSvg(active: boolean) {
  const arch = active ? "#FFFFFF" : "#FF6B55";
  const stroke = active ? "#FF6B55" : "#FFFFFF";
  return `<svg viewBox="0 0 48 56" width="17" height="20" aria-hidden="true" style="flex-shrink:0"><path d="M4 51V24a20 20 0 0 1 40 0v27a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z" fill="${arch}"/><g fill="none" stroke="${stroke}" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 44V23.5a5 5 0 0 1 5-5h9"/><path d="M17 33h14v11"/></g></svg>`;
}

/**
 * Marqueur de carte (charte, section 07) : pilule encre, symbole + prix,
 * pointe en losange. Sélectionné : fond corail, texte encre (contraste AA).
 */
function priceIcon(price: number, active: boolean) {
  const bg = active ? "#FF6B55" : "#252A31";
  const fg = active ? "#252A31" : "#FFFFFF";
  return L.divIcon({
    className: "",
    iconSize: undefined,
    html: `<span style="display:inline-flex;flex-direction:column;align-items:center;transform:translate(-50%,-100%)"><span style="display:inline-flex;align-items:center;gap:6px;white-space:nowrap;border-radius:9999px;padding:6px 12px 6px 6px;background:${bg};color:${fg};font:700 13px var(--font-manrope),sans-serif;box-shadow:0 6px 14px rgb(37 42 49/22%)">${markSvg(active)}${formatCents(price)}</span><span style="width:10px;height:10px;background:${bg};transform:rotate(45deg);margin-top:-6px"></span></span>`,
  });
}

/**
 * Cadre la carte sur les résultats, et recadre quand le conteneur change
 * de taille (carte affichée après coup sur mobile, redimensionnement).
 */
function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    const fit = () => {
      map.invalidateSize();
      const { x, y } = map.getSize();
      if (x > 0 && y > 0) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map, points]);
  return null;
}

export default function ResultsMap({
  points,
  activeId,
  onHover,
  onSelect,
}: {
  points: MapPoint[];
  activeId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (point: MapPoint) => void;
}) {
  const center = useMemo<[number, number]>(() => (points[0] ? [points[0].lat, points[0].lng] : [48.8566, 2.3522]), [points]);

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full rounded-[28px] border border-line">
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} className="fauteo-tiles" />
      <FitBounds points={points} />
      {points.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={priceIcon(p.priceCents, p.id === activeId)}
          zIndexOffset={p.id === activeId ? 1000 : 0}
          title={p.title}
          keyboard
          eventHandlers={{
            mouseover: () => onHover(p.id),
            mouseout: () => onHover(null),
            click: () => onSelect(p),
          }}
        />
      ))}
    </MapContainer>
  );
}
