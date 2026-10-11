"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LocateFixed, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Place {
  label: string;
  lat: number;
  lng: number;
}

interface Suggestion extends Place {
  id: string;
  context: string;
}

/**
 * Géocodeur officiel de l'IGN (Géoplateforme), gratuit et sans clé :
 * communes, arrondissements et adresses en France.
 */
async function geocode(query: string, signal: AbortSignal): Promise<Suggestion[]> {
  const url = new URL("https://data.geopf.fr/geocodage/search");
  url.searchParams.set("q", query);
  url.searchParams.set("index", "address");
  url.searchParams.set("limit", "6");
  url.searchParams.set("autocomplete", "1");
  const response = await fetch(url, { signal });
  if (!response.ok) return [];
  const data = (await response.json()) as {
    features: { geometry: { coordinates: [number, number] }; properties: { id: string; label: string; context?: string; type: string } }[];
  };
  return data.features.map((f) => ({
    id: f.properties.id,
    label: f.properties.label,
    context: f.properties.context ?? "",
    lng: f.geometry.coordinates[0],
    lat: f.geometry.coordinates[1],
  }));
}

/**
 * Champ « Où ? » avec suggestions et bouton « Autour de moi » (F-23).
 * Le lieu choisi est transmis au formulaire par des champs cachés lat / lng.
 */
export function PlaceInput({
  defaultPlace,
  className,
  inputClassName,
  label = "Où ?",
}: {
  defaultPlace?: Place | null;
  className?: string;
  inputClassName?: string;
  label?: string;
}) {
  const listId = useId();
  const [text, setText] = useState(defaultPlace?.label ?? "");
  const [place, setPlace] = useState<Place | null>(defaultPlace ?? null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (place && place.label === text) return;
    const query = text.trim();
    if (query.length < 3) return;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      geocode(query, controller.signal)
        .then((results) => {
          setSuggestions(results);
          setActive(-1);
          setOpen(results.length > 0);
        })
        .catch(() => undefined);
    }, 220);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [text, place]);

  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  function choose(s: Place) {
    setPlace(s);
    setText(s.label);
    setOpen(false);
  }

  function locate() {
    setGeoError(null);
    if (!navigator.geolocation) return setGeoError("Géolocalisation indisponible sur cet appareil.");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        choose({ label: "Autour de moi", lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        setGeoError("Autorisez la localisation pour chercher autour de vous.");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300_000 }
    );
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapper} className={cn("relative", className)}>
      <label htmlFor={`${listId}-input`} className="sr-only">
        {label}
      </label>
      <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
      <input
        id={`${listId}-input`}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        autoComplete="off"
        placeholder="Ville, quartier, adresse"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setPlace(null);
        }}
        onFocus={() => suggestions.length > 0 && !place && setOpen(true)}
        onKeyDown={onKeyDown}
        className={cn(
          "h-12 w-full rounded-full border border-line bg-surface pl-11 pr-12 text-[15px] text-ink placeholder:text-ink-muted/70 focus:border-primary focus:outline-none focus:ring-4 focus:ring-[var(--ring)]",
          inputClassName
        )}
      />
      <button
        type="button"
        onClick={locate}
        disabled={locating}
        aria-label="Autour de moi"
        title="Autour de moi"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-ink-muted hover:bg-canvas-alt hover:text-primary-ink disabled:animate-pulse"
      >
        <LocateFixed className="h-4 w-4" />
      </button>

      <input type="hidden" name="lieu" value={place?.label ?? ""} />
      <input type="hidden" name="lat" value={place ? place.lat.toFixed(5) : ""} />
      <input type="hidden" name="lng" value={place ? place.lng.toFixed(5) : ""} />

      {open && (
        <ul id={listId} role="listbox" className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-raised">
          {suggestions.map((s, index) => (
            <li
              key={s.id}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              onPointerDown={(e) => {
                e.preventDefault();
                choose(s);
              }}
              className={cn("cursor-pointer rounded-xl px-3 py-2.5", index === active ? "bg-canvas-alt" : "hover:bg-canvas-alt")}
            >
              <span className="block text-sm font-semibold text-ink">{s.label}</span>
              {s.context && <span className="block text-xs text-ink-muted">{s.context}</span>}
            </li>
          ))}
        </ul>
      )}
      {geoError && <p className="mt-1.5 pl-4 text-sm text-danger" role="alert">{geoError}</p>}
    </div>
  );
}
