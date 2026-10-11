import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BadgeCheck, CalendarClock, Clock, FileText, MapPin, Ruler, Star, Zap } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { StationImage } from "@/components/stations/StationImage";
import { QuoteWidget } from "@/components/stations/QuoteWidget";
import { LocationMapLazy } from "@/components/stations/LocationMapLazy";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { CANCELLATION_LABELS, PRICE_UNIT_LABELS, STATION_TYPE_LABELS, TRADE_LABELS, WEEKDAY_LABELS } from "@/lib/labels";
import { getPublicFees } from "@/lib/platform";
import { getStation, type StationDetail } from "@/lib/stations";
import { Constants } from "@/types/database.types";
import { formatCents } from "@/lib/utils";
import type { PriceUnit } from "@/types";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const detail = await getStation((await params).id);
  if (!detail) return { title: "Poste introuvable" };
  return {
    title: `${detail.station.title} · ${detail.venue.city}`,
    description: `${STATION_TYPE_LABELS[detail.station.type]} à louer chez ${detail.venue.name}, ${detail.venue.city}.`,
  };
}

const hhmm = (t: string) => t.slice(0, 5).replace(":", " h ").replace(" h 00", " h");

function openingHours(rules: StationDetail["rules"]) {
  return Array.from({ length: 7 }, (_, i) => i + 1).map((day) => ({
    day,
    slots: rules
      .filter((r) => r.weekday === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
      .map((r) => `${hhmm(r.start_time)} – ${hhmm(r.end_time)}`),
  }));
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t border-line pt-8">
      <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
      {children}
    </section>
  );
}

async function StationContent({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const [{ id }, query, fees] = await Promise.all([params, searchParams, getPublicFees()]);
  const detail = await getStation(id);
  if (!detail) notFound();

  const { station, venue, photos, prices, host, reviews } = detail;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const unitParam = one(query.duree);
  const initialUnit = Constants.public.Enums.price_unit.includes(unitParam as PriceUnit) ? (unitParam as PriceUnit) : undefined;
  const policy = CANCELLATION_LABELS[station.cancellation_policy];
  const hasRating = station.rating_avg !== null && station.rating_count > 0;

  return (
    <article>
      <Link href="/recherche" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Retour aux résultats
      </Link>

      <header className="mb-6 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">{station.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[15px] text-ink">
          {hasRating ? (
            <span className="flex items-center gap-1 font-semibold">
              <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
              {Number(station.rating_avg).toLocaleString("fr-FR", { minimumFractionDigits: 1 })}
              <span className="font-normal text-ink-muted">· {station.rating_count} avis</span>
            </span>
          ) : (
            <Badge variant="neutral">Nouveau</Badge>
          )}
          <span className="flex items-center gap-1.5 text-ink-muted">
            <MapPin className="h-4 w-4" aria-hidden /> {venue.name} · {venue.postal_code} {venue.city}
          </span>
          {host.verified && (
            <Badge variant="success">
              <BadgeCheck aria-hidden /> Hôte vérifié
            </Badge>
          )}
          {station.booking_mode === "instant" && (
            <Badge variant="brand">
              <Zap aria-hidden /> Réservation instantanée
            </Badge>
          )}
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <StationImage src={photos[0] ?? null} alt={station.title} type={station.type} priority className="aspect-[4/3] rounded-[var(--radius-card)] sm:aspect-[16/10]" />
        <div className="hidden gap-3 sm:grid">
          <StationImage src={photos[1] ?? null} alt={`${station.title}, vue 2`} type={station.type} className="rounded-[var(--radius-card)]" />
          <StationImage src={photos[2] ?? null} alt={`${station.title}, vue 3`} type={station.type} className="rounded-[var(--radius-card)]" />
        </div>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="space-y-8">
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ink">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-ink-muted" aria-hidden /> {STATION_TYPE_LABELS[station.type]}
            </span>
            {station.surface_m2 && (
              <span className="flex items-center gap-2">
                <Ruler className="h-5 w-5 text-ink-muted" aria-hidden /> {Number(station.surface_m2).toLocaleString("fr-FR")} m²
              </span>
            )}
            <span className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-ink-muted" aria-hidden /> Annulation {policy.title.toLowerCase()}
            </span>
          </div>
          <p className="flex flex-wrap gap-2">
            {station.trades.map((t) => (
              <span key={t} className="rounded-full bg-canvas-alt px-3 py-1.5 text-sm font-medium text-ink">
                {TRADE_LABELS[t]}
              </span>
            ))}
          </p>

          {(station.description || venue.description) && (
            <Section title="Le poste et le lieu">
              {station.description && <p className="leading-relaxed text-ink">{station.description}</p>}
              {venue.description && <p className="leading-relaxed text-ink-muted">{venue.description}</p>}
            </Section>
          )}

          <Section title="Équipements inclus">
            <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {[...detail.stationAmenities, ...detail.venueAmenities].map((label) => (
                <li key={label} className="flex items-center gap-3 text-[15px] text-ink">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Tarifs">
            <dl className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
              {prices.map(([unit, cents]) => (
                <div key={unit} className="flex items-center justify-between border-b border-line px-5 py-3.5 last:border-b-0">
                  <dt className="text-ink-muted">{PRICE_UNIT_LABELS[unit].long}</dt>
                  <dd className="font-semibold tabular-nums text-ink">{formatCents(cents)}</dd>
                </div>
              ))}
              {station.weekend_surcharge_bps > 0 && (
                <div className="flex items-center justify-between bg-canvas px-5 py-3.5 text-sm">
                  <dt className="text-ink-muted">Majoration samedi et dimanche</dt>
                  <dd className="font-semibold text-ink">+{(station.weekend_surcharge_bps / 100).toLocaleString("fr-FR")} %</dd>
                </div>
              )}
            </dl>
            <p className="text-sm text-ink-muted">
              Prix de la location, hors frais de service de {(fees.proFeeBps / 100).toLocaleString("fr-FR")} %. Caution :{" "}
              {station.deposit_cents > 0 ? `${formatCents(station.deposit_cents)}, par empreinte bancaire.` : "aucune."}
            </p>
          </Section>

          <Section title="Horaires d'ouverture">
            <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
              {openingHours(detail.rules).map(({ day, slots }) => (
                <div key={day} className="flex justify-between gap-4 text-[15px]">
                  <dt className="text-ink-muted">{WEEKDAY_LABELS[day]}</dt>
                  <dd className={slots.length ? "font-medium text-ink" : "text-ink-muted"}>{slots.length ? slots.join(", ") : "Fermé"}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {venue.house_rules && (
            <Section title="Règlement intérieur">
              <p className="whitespace-pre-line leading-relaxed text-ink">{venue.house_rules}</p>
              <p className="text-sm text-ink-muted">Son acceptation est demandée au moment de réserver.</p>
            </Section>
          )}

          <Section title="Annulation">
            <p className="leading-relaxed text-ink">
              <strong className="font-semibold">{policy.title}.</strong> {policy.summary} Les frais de service ne sont pas remboursés en cas d&apos;annulation par le
              professionnel. Si l&apos;hôte annule, vous êtes intégralement remboursé.
            </p>
          </Section>

          <Section title="Localisation">
            <LocationMapLazy lat={venue.latitude} lng={venue.longitude} label={venue.name} />
            <p className="text-[15px] text-ink">
              {venue.address_line}, {venue.postal_code} {venue.city}
            </p>
          </Section>

          <Section title={`Votre hôte${host.firstName ? ` : ${host.firstName}` : ""}`}>
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-subtle text-xl font-bold text-primary-ink">
                {(host.firstName || venue.name).charAt(0).toUpperCase()}
              </span>
              <div className="space-y-1 text-[15px]">
                <p className="font-semibold text-ink">{venue.name}</p>
                <p className="flex items-center gap-1.5 text-ink-muted">
                  {host.verified ? (
                    <>
                      <BadgeCheck className="h-4 w-4 text-success" aria-hidden /> Identité, SIRET et assurance vérifiés
                    </>
                  ) : (
                    "Vérification en cours"
                  )}
                </p>
                {host.memberSince && (
                  <p className="flex items-center gap-1.5 text-ink-muted">
                    <Clock className="h-4 w-4" aria-hidden /> Sur Fauteo depuis{" "}
                    {new Date(host.memberSince).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                  </p>
                )}
              </div>
            </div>
          </Section>

          <Section title="Avis">
            {reviews.length === 0 ? (
              <p className="text-ink-muted">
                {hasRating
                  ? `Note moyenne de ${Number(station.rating_avg).toLocaleString("fr-FR")} sur ${station.rating_count} avis. Les commentaires détaillés s'afficheront ici.`
                  : "Pas encore d'avis : soyez le premier à réserver ce poste."}
              </p>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2">
                {reviews.map((r) => (
                  <li key={r.id} className="space-y-2 rounded-[var(--radius-card)] border border-line bg-surface p-5">
                    <p className="flex items-center gap-1 text-sm font-semibold text-ink">
                      <Star className="h-4 w-4 fill-primary text-primary" aria-hidden /> {r.rating}/5 · {r.author?.first_name}
                    </p>
                    {r.comment && <p className="text-[15px] leading-relaxed text-ink">{r.comment}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Réserver">
          <QuoteWidget
            stationId={station.id}
            prices={prices}
            depositCents={station.deposit_cents}
            bookingMode={station.booking_mode}
            proFeeBps={fees.proFeeBps}
            initial={{
              unit: initialUnit,
              date: one(query.date),
              time: one(query.heure),
              quantity: Number(one(query.nb)) || 1,
            }}
          />
        </aside>
      </div>
    </article>
  );
}

export default function StationPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="space-y-6">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="aspect-[16/7]" />
              <Skeleton className="h-64" />
            </div>
          }
        >
          <StationContent params={params} searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
