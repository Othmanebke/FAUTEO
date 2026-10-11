import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { SearchForm } from "@/components/search/SearchForm";
import { SearchResults, type SearchResultItem } from "@/components/search/SearchResults";
import { Skeleton } from "@/components/ui/Skeleton";
import { TRADE_LABELS } from "@/lib/labels";
import { getAmenityCatalog, listingPhotoUrl, parseSearchParams, searchStations, type SearchFilters } from "@/lib/stations";

export const metadata: Metadata = {
  title: "Trouver un poste",
  description: "Fauteuils, cabines, tables et box à louer à l'heure, à la journée, à la semaine ou au mois, près de chez vous.",
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function summaryOf(count: number, filters: SearchFilters) {
  const parts = [`${count} poste${count > 1 ? "s" : ""}`];
  if (filters.metier) parts.push(TRADE_LABELS[filters.metier].toLowerCase());
  if (filters.lieu) parts.push(`autour de ${filters.lieu}`);
  if (filters.duree && filters.date) {
    parts.push(
      `disponible${count > 1 ? "s" : ""} le ${new Date(`${filters.date}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`
    );
  }
  return parts.join(" · ");
}

/** Résultats : dépendent de l'URL, rendus à la requête derrière un Suspense. */
async function Results({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseSearchParams(await searchParams);
  const stations = await searchStations(filters);

  // Lien vers la fiche en conservant durée, date et quantité pour le devis
  const keep = new URLSearchParams();
  if (filters.duree) keep.set("duree", filters.duree);
  if (filters.date) keep.set("date", filters.date);
  if (filters.duree === "hour" || filters.duree === "half_day") keep.set("heure", filters.heure);
  if (filters.nb > 1) keep.set("nb", String(filters.nb));
  const query = keep.size ? `?${keep}` : "";

  const items: SearchResultItem[] = stations.map((station) => ({
    station,
    photoUrl: listingPhotoUrl(station.cover_photo_path),
    href: `/postes/${station.station_id}${query}`,
  }));

  return <SearchResults items={items} summary={summaryOf(stations.length, filters)} />;
}

async function Form({ searchParams }: { searchParams: SearchParams }) {
  const filters = parseSearchParams(await searchParams);
  const amenities = (await getAmenityCatalog()).filter((a) => a.scope === "station");
  return (
    <SearchForm
      key={JSON.stringify(filters)}
      amenities={amenities}
      values={{
        metier: filters.metier,
        place: filters.lat !== undefined && filters.lng !== undefined ? { label: filters.lieu ?? "Lieu choisi", lat: filters.lat, lng: filters.lng } : null,
        duree: filters.duree,
        date: filters.date,
        heure: filters.heure,
        nb: filters.nb,
        budget: filters.budget,
        note: filters.note,
        verifie: filters.verifie === "1",
        equipements: filters.equipements,
        tri: filters.tri,
        rayon: filters.rayon,
      }}
    />
  );
}

export default function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-8 sm:px-6 lg:px-8">
        <h1 className="mb-5 text-3xl font-bold tracking-tight text-ink">Trouver un poste</h1>
        <Suspense fallback={<Skeleton className="h-28 rounded-[1.75rem]" />}>
          <Form searchParams={searchParams} />
        </Suspense>
        <Suspense
          fallback={
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-80" />
              ))}
            </div>
          }
        >
          <Results searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

