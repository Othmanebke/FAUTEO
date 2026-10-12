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

/** Repère « prix » façon pastille, mis en avant quand l'annonce est survolée. */
function priceIcon(price: number, active: boolean) {
  return L.divIcon({
    className: "",
    iconSize: undefined,
    html: `<span style="display:inline-block;transform:translate(-50%,-50%);white-space:nowrap;border-radius:9999px;padding:6px 10px;font:600 13px var(--font-manrope),sans-serif;box-shadow:0 4px 14px rgb(37 42 49/18%);border:1px solid ${active ? "#252A31" : "#E8E2DA"};background:${active ? "#252A31" : "#fff"};color:${active ? "#FFF9F5" : "#252A31"}">${formatCents(price)}</span>`,
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
