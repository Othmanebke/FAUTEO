"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { BadgeCheck, ChevronDown, Search, SlidersHorizontal, Star, Wallet } from "lucide-react";
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
  "h-[52px] w-full rounded-full border border-line bg-surface px-[18px] text-[15px] text-ink transition-[border-color,box-shadow] hover:border-line-strong focus:border-primary focus:outline-none focus:ring-4 focus:ring-[var(--ring)]";

const selectField = cn(field, "appearance-none pr-10");

const QUANTITY_LABEL: Record<PriceUnit, string> = {
  hour: "heure(s)",
  half_day: "demi-journée",
  day: "jour(s)",
  week: "semaine(s)",
  month: "mois",
};

/** URL de recherche reprenant les filtres actuels, avec des valeurs modifiées. */
function searchHref(values: SearchFormValues, overrides: Record<string, string | null>) {
  const q = new URLSearchParams();
  if (values.metier) q.set("metier", values.metier);
  if (values.place) {
    q.set("lieu", values.place.label);
    q.set("lat", values.place.lat.toFixed(5));
    q.set("lng", values.place.lng.toFixed(5));
  }
  if (values.duree) q.set("duree", values.duree);
  if (values.date) q.set("date", values.date);
  if (values.duree === "hour" || values.duree === "half_day") q.set("heure", values.heure);
  if (values.nb > 1) q.set("nb", String(values.nb));
  if (values.budget) q.set("budget", String(values.budget));
  if (values.note) q.set("note", String(values.note));
  if (values.verifie) q.set("verifie", "1");
  if (values.rayon !== 10) q.set("rayon", String(values.rayon));
  for (const e of values.equipements) q.append("equipements", e);
  if (values.tri !== "distance") q.set("tri", values.tri);
  for (const [k, v] of Object.entries(overrides)) {
    if (v === null) q.delete(k);
    else q.set(k, v);
  }
  return `/recherche${q.size ? `?${q}` : ""}`;
}

function Chevron() {
  return <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />;
}

/**
 * Formulaire de recherche (GET /recherche) : l'URL porte tous les filtres,
 * la page est partageable et le bouton retour du navigateur fonctionne.
 */
export function SearchForm({ values, amenities }: { values: SearchFormValues; amenities: { code: string; label: string }[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [unit, setUnit] = useState<PriceUnit | "">(values.duree ?? "");
  const activeFilters = (values.budget ? 1 : 0) + (values.note ? 1 : 0) + (values.verifie ? 1 : 0) + values.equipements.length + (values.rayon !== 10 ? 1 : 0);
  const [showFilters, setShowFilters] = useState(false);
  // Mobile : résumé compact, formulaire complet à la demande
  const [expanded, setExpanded] = useState(false);

  const summaryTitle = [values.metier ? TRADE_LABELS[values.metier] : "Tous les métiers", values.place?.label ?? "Partout"].join(" · ");
  const summaryDetails = [
    values.date ? new Date(values.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "Toutes dates",
    values.duree ? values.nb + " " + QUANTITY_LABEL[values.duree] : null,
    values.rayon + " km",
  ]
    .filter(Boolean)
    .join(" · ");

  // Filtres rapides : bascules en un clic (liens vers l'URL modifiée)
  const quick = [
    { label: "Hôte vérifié", icon: BadgeCheck, on: values.verifie, href: searchHref(values, { verifie: values.verifie ? null : "1" }) },
    { label: "Note 4,5 et plus", icon: Star, on: values.note === 4.5, href: searchHref(values, { note: values.note === 4.5 ? null : "4.5" }) },
    { label: "Moins de 60 €", icon: Wallet, on: values.budget === 60, href: searchHref(values, { budget: values.budget === 60 ? null : "60" }) },
  ];

  return (
    <form ref={formRef} action="/recherche" method="get" className="space-y-3.5" role="search" aria-label="Rechercher un poste">
      {/* Mobile : résumé de la recherche en pilule */}
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-expanded={expanded}
          className="flex w-full items-center gap-3 rounded-full border border-line bg-surface py-2 pl-5 pr-2 text-left shadow-card md:hidden"
        >
          <Search className="h-5 w-5 shrink-0 text-ink" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-bold text-ink">{summaryTitle}</span>
            <span className="block truncate text-[13px] text-ink-muted">{summaryDetails}</span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
            <SlidersHorizontal className="h-[18px] w-[18px]" aria-hidden />
          </span>
          <span className="sr-only">Modifier la recherche</span>
        </button>
      )}
      <div
        className={cn(
          "grid grid-cols-2 gap-2 rounded-[28px] border border-line bg-surface p-2.5 shadow-card md:grid-cols-[1fr_1fr_auto] md:gap-2.5 md:p-3 lg:grid-cols-[1fr_1.4fr_1fr_1fr_auto]",
          !expanded && "hidden md:grid"
        )}
      >
        <div className="relative">
          <label className="sr-only" htmlFor="metier">
            Métier
          </label>
          <select id="metier" name="metier" defaultValue={values.metier ?? ""} className={selectField}>
            <option value="">Tous les métiers</option>
            {(Object.entries(TRADE_LABELS) as [Trade, string][]).map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <PlaceInput defaultPlace={values.place} className="col-span-2 row-start-1 md:row-start-auto lg:col-span-1" inputClassName="h-[52px]" />

        <div className="relative">
          <label className="sr-only" htmlFor="duree">
            Durée de location
          </label>
          <select id="duree" name="duree" value={unit} onChange={(e) => setUnit(e.target.value as PriceUnit | "")} className={selectField}>
            <option value="">Toutes durées</option>
            {(Object.entries(PRICE_UNIT_LABELS) as [PriceUnit, { long: string }][]).map(([v, l]) => (
              <option key={v} value={v}>
                {l.long}
              </option>
            ))}
          </select>
          <Chevron />
        </div>

        <div>
          <label className="sr-only" htmlFor="date">
            Date de début
          </label>
          <input id="date" name="date" type="date" defaultValue={values.date} className={field} aria-describedby="date-aide" />
        </div>

        <Button type="submit" size="lg" className="h-[52px] px-6">
          <Search className="h-4 w-4" aria-hidden />
          <span>Rechercher</span>
        </Button>
      </div>
      <p id="date-aide" className="sr-only">
        Avec une durée et une date, seuls les postes disponibles sont affichés.
      </p>

      {/* Mobile : rangée défilante ; desktop : retour à la ligne */}
      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&>*]:shrink-0">
        {unit && (
          <div className={cn("h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm", expanded ? "flex" : "hidden md:flex")}>
            {(unit === "hour" || unit === "half_day") && (
              <>
                <label htmlFor="heure" className="text-ink-muted">
                  À
                </label>
                <input id="heure" name="heure" type="time" step={1800} defaultValue={values.heure} className="bg-transparent font-semibold text-ink focus:outline-none" />
              </>
            )}
            {unit !== "half_day" && (
              <>
                <label htmlFor="nb" className="text-ink-muted">
                  Pour
                </label>
                <input id="nb" name="nb" type="number" min={1} max={52} defaultValue={values.nb} className="w-10 bg-transparent font-semibold text-ink focus:outline-none" />
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
            "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
            activeFilters || showFilters ? "border-primary bg-primary-subtle text-primary-ink" : "border-line bg-surface text-ink hover:border-line-strong"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filtres{activeFilters ? ` · ${activeFilters}` : ""}
        </button>

        <span className="mx-1 hidden h-6 w-px bg-line sm:block" aria-hidden />

        {quick.map(({ label, icon: Icon, on, href }) => (
          <Link
            key={label}
            href={href}
            aria-pressed={on}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
              on ? "border-primary bg-primary-subtle text-primary-ink" : "border-line bg-surface text-ink hover:border-line-strong"
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {label}
          </Link>
        ))}

        <div className="ml-auto flex items-center gap-2 text-sm">
          <label htmlFor="tri" className="text-ink-muted">
            Trier par
          </label>
          <div className="relative">
            <select
              id="tri"
              name="tri"
              defaultValue={values.tri}
              onChange={() => formRef.current?.requestSubmit()}
              className="h-10 appearance-none rounded-full border border-line bg-surface pl-4 pr-9 font-semibold text-ink focus:border-primary focus:outline-none"
            >
              <option value="distance">Distance</option>
              <option value="prix">Prix</option>
              <option value="note">Note</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
          </div>
        </div>
      </div>

      <fieldset id="filtres-avances" hidden={!showFilters} className="space-y-6 rounded-[24px] border border-line bg-surface p-6 shadow-card">
        <legend className="sr-only">Filtres avancés</legend>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-2 text-sm font-semibold text-ink">
            Budget maximum (€)
            <input name="budget" type="number" min={1} defaultValue={values.budget} placeholder="Sans limite" className={cn(field, "font-normal")} />
          </label>
          <label className="space-y-2 text-sm font-semibold text-ink">
            Rayon
            <span className="relative block">
              <select name="rayon" defaultValue={String(values.rayon)} className={cn(selectField, "font-normal")}>
                {[2, 5, 10, 20, 50].map((km) => (
                  <option key={km} value={km}>
                    {km} km
                  </option>
                ))}
              </select>
              <Chevron />
            </span>
          </label>
          <label className="space-y-2 text-sm font-semibold text-ink">
            Note minimale
            <span className="relative block">
              <select name="note" defaultValue={values.note ? String(values.note) : ""} className={cn(selectField, "font-normal")}>
                <option value="">Toutes</option>
                <option value="4">4 et plus</option>
                <option value="4.5">4,5 et plus</option>
              </select>
              <Chevron />
            </span>
          </label>
          <label className="flex h-[52px] items-center gap-3 self-end rounded-full border border-line px-[18px] text-sm font-semibold text-ink">
            <input type="checkbox" name="verifie" value="1" defaultChecked={values.verifie} className="h-5 w-5 accent-[var(--primary)]" />
            Hôte vérifié uniquement
          </label>
        </div>

        <div className="space-y-2.5">
          <p className="text-sm font-semibold text-ink">Équipements</p>
          <div className="flex flex-wrap gap-2">
            {amenities.map((a) => (
              <label key={a.code} className="cursor-pointer">
                <input type="checkbox" name="equipements" value={a.code} defaultChecked={values.equipements.includes(a.code)} className="peer sr-only" />
                <span className="inline-flex h-10 items-center rounded-full border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-line-strong peer-checked:border-primary peer-checked:bg-primary-subtle peer-checked:text-primary-ink peer-focus-visible:outline-2 peer-focus-visible:outline-primary-ink">
                  {a.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-line pt-5">
          <Link href="/recherche" className="flex h-11 items-center rounded-full px-5 text-sm font-semibold text-ink-muted hover:bg-canvas-alt hover:text-ink">
            Tout effacer
          </Link>
          <Button type="submit">Appliquer</Button>
        </div>
      </fieldset>
    </form>
  );
}
