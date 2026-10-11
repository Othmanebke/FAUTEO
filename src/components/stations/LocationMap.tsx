"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { TILE_ATTRIBUTION, TILE_MAX_ZOOM, TILE_URL } from "@/components/maps/tiles";

const pin = L.divIcon({
  className: "",
  html: '<span style="display:block;width:22px;height:22px;transform:translate(-50%,-50%);border-radius:9999px;background:#FF6B55;border:4px solid #fff;box-shadow:0 4px 14px rgb(37 42 49/25%)"></span>',
});

/** Carte de localisation d'un lieu (fiche d'un poste). */
export default function LocationMap({ lat, lng, label }: { lat: number; lng: number; label: string }) {
  return (
    <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} className="h-72 w-full rounded-[var(--radius-card)]">
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={TILE_MAX_ZOOM} className="fauteo-tiles" />
      <Marker position={[lat, lng]} icon={pin} title={label} />
    </MapContainer>
  );
}
