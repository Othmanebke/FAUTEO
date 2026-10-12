import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Armchair, ArrowLeft, BadgeCheck, Brush, CalendarClock, Clock, Hand, MapPin, PenTool, Ruler, Scissors, Zap } from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { QuoteWidget } from "@/components/stations/QuoteWidget";
import { LocationMapLazy } from "@/components/stations/LocationMapLazy";
import { StationGallery } from "@/components/stations/StationGallery";
import { ShareButton } from "@/components/stations/ShareButton";
import { SaveButton } from "@/components/favorites/SaveButton";
import { formatRating } from "@/components/stations/StationCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { CANCELLATION_LABELS, PRICE_UNIT_LABELS, STATION_TYPE_LABELS, TRADE_LABELS, WEEKDAY_LABELS } from "@/lib/labels";
import { getPublicFees } from "@/lib/platform";
import { getStation, type StationDetail } from "@/lib/stations";
import { Constants } from "@/types/database.types";
import { formatCents } from "@/lib/utils";
import type { PriceUnit, StationType } from "@/types";

type Params = Promise<{ id: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const TYPE_ICONS: Record<StationType, React.ElementType> = {
  fauteuil_coiffure: Armchair,
  poste_barber: Scissors,
  cabine_soins: Brush,
  table_onglerie: Hand,
  box_tatouage: PenTool,
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const detail = await getStation((await params).id);
  if (!detail) return { title: "Poste introuvable" };
  return {
    title: `${detail.station.title} · ${detail.venue.city}`,
    description: `${STATION_TYPE_LABELS[detail.station.type]} à louer chez ${detail.venue.name}, ${detail.venue.city}.`,
  };
}

const hhmm = (t: string) => t.slice(0, 5).replace(":", " h ").replace(" h 00", " h").replace(/^0/, "");

function openingHours(rules: StationDetail["rules"]) {
  return Array.from({ length: 7 }, (_, i) => i + 1).map((day) => ({
    day,
    slots: rules
      .filter((r) => r.weekday === day)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
      .map((r) => `${hhmm(r.start_time)} – ${hhmm(r.end_time)}`),
  }));
}

function Section({ title, gap = "gap-3.5", children }: { title: React.ReactNode; gap?: string; children: React.ReactNode }) {
  return (
    <section className={`flex flex-col ${gap} border-t border-line pt-8`}>
      <h2 className="text-[22px] font-bold text-ink">{title}</h2>
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
  const rating = station.rating_count > 0 ? formatRating(station.rating_avg) : null;
  const TypeIcon = TYPE_ICONS[station.type];
  const amenities = [...detail.stationAmenities, ...detail.venueAmenities];

  return (
    <article>
      <Link href="/recherche" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Retour aux résultats
      </Link>

      <header className="mb-6 mt-5 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-[32px] font-bold tracking-[-0.02em] text-ink sm:text-[40px]">{station.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-[18px] gap-y-2.5 text-[15px]">
            {rating ? (
              <span className="font-semibold text-ink">
                <span className="text-primary">★</span> {rating} <span className="font-normal text-ink-muted">· {station.rating_count} avis</span>
              </span>
            ) : (
              <span className="font-semibold text-ink-muted">Nouveau</span>
            )}
            <span className="flex items-center gap-1.5 text-ink-muted">
              <MapPin className="h-4 w-4" aria-hidden /> {venue.name} · {venue.postal_code} {venue.city}
            </span>
            {host.verified && (
              <span className="flex items-center gap-1 rounded-full bg-success-subtle px-2.5 py-[5px] text-xs font-bold text-success">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Hôte vérifié
              </span>
            )}
            {station.booking_mode === "instant" && (
              <span className="flex items-center gap-1 rounded-full bg-primary-subtle px-2.5 py-[5px] text-xs font-bold text-primary-ink">
                <Zap className="h-3.5 w-3.5" aria-hidden /> Réservation instantanée
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <ShareButton title={station.title} />
          <SaveButton stationId={station.id} variant="pill" />
        </div>
      </header>

      <StationGallery photos={photos} title={station.title} type={station.type} />

      <div className="mt-11 grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: TypeIcon, label: STATION_TYPE_LABELS[station.type] },
              { icon: Ruler, label: station.surface_m2 ? `${Number(station.surface_m2).toLocaleString("fr-FR")} m²` : "Surface non précisée" },
              { icon: CalendarClock, label: `Annulation ${policy.title.toLowerCase()}` },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-surface p-[18px]">
                <Icon className="h-[22px] w-[22px] text-primary-ink" aria-hidden />
                <span className="text-[15px] font-semibold text-ink">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {station.trades.map((t) => (
              <span key={t} className="rounded-full bg-canvas-alt px-3.5 py-[7px] text-sm font-medium text-ink">
                {TRADE_LABELS[t]}
              </span>
            ))}
          </div>

          {(station.description || venue.description) && (
            <Section title="Le poste et le lieu">
              {station.description && <p className="text-base leading-[1.7] text-ink">{station.description}</p>}
              {venue.description && <p className="text-base leading-[1.7] text-ink-muted">{venue.description}</p>}
            </Section>
          )}

          {amenities.length > 0 && (
            <Section title="Équipements inclus" gap="gap-4">
              <ul className="grid grid-cols-1 gap-x-8 gap-y-3.5 sm:grid-cols-2">
                {amenities.map((label) => (
                  <li key={label} className="flex items-center gap-3 text-[15px] text-ink">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {label}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Tarifs">
            <dl className="overflow-hidden rounded-[20px] border border-line bg-surface">
              {prices.map(([unit, cents]) => (
                <div key={unit} className="flex justify-between border-b border-line px-5 py-[15px] text-[15px] last:border-b-0">
                  <dt className="text-ink-muted">{PRICE_UNIT_LABELS[unit].long}</dt>
                  <dd className="font-semibold tabular-nums text-ink">{formatCents(cents)}</dd>
                </div>
              ))}
              {station.weekend_surcharge_bps > 0 && (
                <div className="flex justify-between border-t border-line bg-canvas px-5 py-[15px] text-sm">
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
            <dl className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {openingHours(detail.rules).map(({ day, slots }) => (
                <div key={day} className="flex justify-between gap-4 text-[15px]">
                  <dt className="text-ink-muted">{WEEKDAY_LABELS[day]}</dt>
                  <dd className={slots.length ? "font-medium text-ink" : "font-medium text-ink-muted"}>{slots.length ? slots.join(", ") : "Fermé"}</dd>
                </div>
              ))}
            </dl>
          </Section>

          {venue.house_rules && (
            <Section title="Règlement intérieur" gap="gap-2.5">
              <p className="whitespace-pre-line text-base leading-[1.7] text-ink">{venue.house_rules}</p>
              <p className="text-sm text-ink-muted">Son acceptation est demandée au moment de réserver.</p>
            </Section>
          )}

          <Section title="Annulation" gap="gap-2.5">
            <p className="text-base leading-[1.7] text-ink">
              <b>{policy.title}.</b> {policy.summary} Les frais de service ne sont pas remboursés en cas d&apos;annulation par le professionnel. Si l&apos;hôte annule,
              vous êtes intégralement remboursé.
            </p>
          </Section>

          <Section title="Localisation">
            <div className="overflow-hidden rounded-[24px] border border-line">
              <LocationMapLazy lat={venue.latitude} lng={venue.longitude} label={venue.name} />
            </div>
            <p className="text-[15px] text-ink">
              {venue.address_line}, {venue.postal_code} {venue.city}
            </p>
          </Section>

          <Section title={`Votre hôte${host.firstName ? ` : ${host.firstName}` : ""}`} gap="gap-4">
            <div className="flex items-center gap-4 rounded-[24px] border border-line bg-surface p-5">
              <span className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-primary-subtle text-[22px] font-bold text-primary-ink">
                {(host.firstName || venue.name).charAt(0).toUpperCase()}
              </span>
              <div className="flex flex-col gap-1 text-[15px]">
                <b className="text-ink">{venue.name}</b>
                <span className="flex items-center gap-1.5 text-ink-muted">
                  {host.verified ? (
                    <>
                      <BadgeCheck className="h-4 w-4 text-success" aria-hidden /> Identité, SIRET et assurance vérifiés
                    </>
                  ) : (
                    "Vérification en cours"
                  )}
                </span>
                {host.memberSince && (
                  <span className="flex items-center gap-1.5 text-ink-muted">
                    <Clock className="h-4 w-4" aria-hidden /> Sur Fauteo depuis {new Date(host.memberSince).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                  </span>
                )}
              </div>
            </div>
          </Section>

          <Section
            gap="gap-4"
            title={
              rating ? (
                <>
                  <span className="text-primary">★</span> {rating} · {station.rating_count} avis
                </>
              ) : (
                "Avis"
              )
            }
          >
            {reviews.length === 0 ? (
              <p className="text-[15px] text-ink-muted">
                {rating ? "Les commentaires détaillés s'afficheront ici." : "Pas encore d'avis : soyez le premier à réserver ce poste."}
              </p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2">
                {reviews.map((r) => (
                  <li key={r.id} className="flex flex-col gap-2 rounded-[20px] border border-line bg-surface p-5">
                    <p className="text-sm font-semibold text-ink">
                      <span className="text-primary">★</span> {r.rating}/5 · {r.author?.first_name}
                    </p>
                    {r.comment && <p className="text-[15px] leading-[1.6] text-ink">{r.comment}</p>}
                  </li>
                ))}
              </ul>
            )}
          </Section>
        </div>

        <aside className="lg:sticky lg:top-[100px]" aria-label="Réserver">
          <QuoteWidget
            stationId={station.id}
            prices={prices}
            depositCents={station.deposit_cents}
            bookingMode={station.booking_mode}
            proFeeBps={fees.proFeeBps}
            initial={{ unit: initialUnit, date: one(query.date), time: one(query.heure), quantity: Number(one(query.nb)) || 1 }}
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
      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-[88px] pt-8 sm:px-8">
        <Suspense
          fallback={
            <div className="space-y-6">
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-[492px] rounded-[28px]" />
              <Skeleton className="h-64" />
            </div>
          }
        >
          <StationContent params={params} searchParams={searchParams} />
        </Suspense>
      </main>
      <Footer compact />
    </>
  );
}
