"use client";

import { useRef, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PRICE_UNIT_LABELS, TRADE_LABELS } from "@/lib/labels";
import { cn } from "@/lib/utils";
import type { PriceUnit, Trade } from "@/types";
import { PlaceInput, type Place } from "./PlaceInput";

export interface SearchFormValues {
  metier?: Trade;
  place: Place | null;
  duree?: PriceUnit;
  date?: string;
  heure: string;
  nb: number;
  budget?: number;
  note?: number;
  verifie: boolean;
  equipements: string[];
  tri: "distance" | "prix" | "note";
  rayon: number;
}

const field =
  "h-12 w-full rounded-full border border-line bg-surface px-4 text-[15px] text-ink focus:border-primary focus:outline-none focus:ring-4 focus:ring-[var(--ring)]";

const QUANTITY_LABEL: Record<PriceUnit, string> = {
  hour: "heure(s)",
  half_day: "demi-journée",
  day: "jour(s)",
  week: "semaine(s)",
  month: "mois",
};

/**
 * Formulaire de recherche (GET /recherche) : l'URL porte tous les filtres,
 * la page est partageable et le bouton retour du navigateur fonctionne.
 */
export function SearchForm({
  values,
  amenities,
}: {
  values: SearchFormValues;
  amenities: { code: string; label: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [unit, setUnit] = useState<PriceUnit | "">(values.duree ?? "");
  const activeFilters =
    (values.budget ? 1 : 0) + (values.note ? 1 : 0) + (values.verifie ? 1 : 0) + values.equipements.length + (values.rayon !== 10 ? 1 : 0);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <form ref={formRef} action="/recherche" method="get" className="space-y-3" role="search" aria-label="Rechercher un poste">
      <div className="grid grid-cols-2 gap-2 rounded-[1.75rem] border border-line bg-surface p-2.5 shadow-card md:grid-cols-[1fr_1.4fr_1fr_1fr_auto] md:gap-3 md:p-3">
        <label className="sr-only" htmlFor="metier">Métier</label>
        <select id="metier" name="metier" defaultValue={values.metier ?? ""} className={cn(field, "appearance-none")}>
          <option value="">Tous les métiers</option>
          {(Object.entries(TRADE_LABELS) as [Trade, string][]).map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>

        <PlaceInput defaultPlace={values.place} className="col-span-2 row-start-1 md:col-span-1 md:row-start-auto" />

        <label className="sr-only" htmlFor="duree">Durée de location</label>
        <select id="duree" name="duree" value={unit} onChange={(e) => setUnit(e.target.value as PriceUnit | "")} className={cn(field, "appearance-none")}>
          <option value="">Toutes durées</option>
          {(Object.entries(PRICE_UNIT_LABELS) as [PriceUnit, { long: string }][]).map(([v, l]) => (
            <option key={v} value={v}>
              {l.long}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="date">Date de début</label>
        <input id="date" name="date" type="date" defaultValue={values.date} className={field} aria-describedby="date-aide" />

        <Button type="submit" size="lg" className="h-12 px-4">
          <Search className="h-4 w-4" aria-hidden />
          <span className="md:sr-only lg:not-sr-only">Rechercher</span>
        </Button>
      </div>
      <p id="date-aide" className="sr-only">
        Avec une durée et une date, seuls les postes disponibles sont affichés.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {unit && (
          <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm">
            {(unit === "hour" || unit === "half_day") && (
              <>
                <label htmlFor="heure" className="text-ink-muted">À</label>
                <input id="heure" name="heure" type="time" step={1800} defaultValue={values.heure} className="bg-transparent font-semibold text-ink focus:outline-none" />
              </>
            )}
            {unit !== "half_day" && (
              <>
                <label htmlFor="nb" className="text-ink-muted">Pour</label>
                <input id="nb" name="nb" type="number" min={1} max={52} defaultValue={values.nb} className="w-12 bg-transparent font-semibold text-ink focus:outline-none" />
                <span className="text-ink-muted">{QUANTITY_LABEL[unit]}</span>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          aria-expanded={showFilters}
          aria-controls="filtres-avances"
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
            activeFilters ? "border-primary bg-primary-subtle text-primary-ink" : "border-line bg-surface text-ink hover:border-line-strong"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filtres{activeFilters ? ` · ${activeFilters}` : ""}
        </button>

        <div className="ml-auto flex items-center gap-2 text-sm">
          <label htmlFor="tri" className="text-ink-muted">Trier par</label>
          <select
            id="tri"
            name="tri"
            defaultValue={values.tri}
            onChange={() => formRef.current?.requestSubmit()}
            className="rounded-full border border-line bg-surface px-3 py-2 font-semibold text-ink focus:border-primary focus:outline-none"
          >
            <option value="distance">Distance</option>
            <option value="prix">Prix</option>
            <option value="note">Note</option>
          </select>
        </div>
      </div>

      <fieldset id="filtres-avances" hidden={!showFilters} className="space-y-5 rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-card">
        <legend className="sr-only">Filtres avancés</legend>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1.5 text-sm font-semibold text-ink">
            Budget maximum (€)
            <input name="budget" type="number" min={1} defaultValue={values.budget} placeholder="Sans limite" className={cn(field, "font-normal")} />
          </label>
          <label className="space-y-1.5 text-sm font-semibold text-ink">
            Rayon
            <select name="rayon" defaultValue={String(values.rayon)} className={cn(field, "appearance-none font-normal")}>
              {[2, 5, 10, 20, 50].map((km) => (
                <option key={km} value={km}>
                  {km} km
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5 text-sm font-semibold text-ink">
            Note minimale
            <select name="note" defaultValue={values.note ? String(values.note) : ""} className={cn(field, "appearance-none font-normal")}>
              <option value="">Toutes</option>
              <option value="4">4 et plus</option>
              <option value="4.5">4,5 et plus</option>
            </select>
          </label>
          <label className="flex items-center gap-3 self-end rounded-full border border-line px-4 py-3 text-sm font-semibold text-ink">
            <input type="checkbox" name="verifie" value="1" defaultChecked={values.verifie} className="h-5 w-5 accent-[var(--primary)]" />
            Hôte vérifié uniquement
          </label>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-ink">Équipements</p>
          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <label key={a.code} className="cursor-pointer">
                <input type="checkbox" name="equipements" value={a.code} defaultChecked={values.equipements.includes(a.code)} className="peer sr-only" />
                <span className="inline-flex rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:border-line-strong peer-checked:border-primary peer-checked:bg-primary-subtle peer-checked:text-primary-ink peer-focus-visible:outline-2 peer-focus-visible:outline-primary-ink">
                  {a.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <a href="/recherche" className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink-muted hover:bg-canvas-alt hover:text-ink">
            Tout effacer
          </a>
          <Button type="submit">Appliquer</Button>
        </div>
      </fieldset>
    </form>
  );
}
