import Link from "next/link";
import {
  Armchair,
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  ChevronLeft,
  FileSignature,
  Lock,
  Plus,
  Scissors,
  Search,
  ShieldCheck,
  Star,
  Store,
  Wallet,
} from "lucide-react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { StationImage } from "@/components/stations/StationImage";
import { HomeRecommended } from "@/components/home/HomeRecommended";
import { getPublicFees } from "@/lib/platform";
import { getHomeData, type HomeStation } from "@/lib/home";
import { PRICE_UNIT_LABELS, TRADE_LABELS } from "@/lib/labels";
import { formatCents } from "@/lib/utils";
import type { StationType, Trade } from "@/types";

const HOW = [
  {
    title: "Vous êtes indépendant",
    anchor: "pros",
    steps: [
      { icon: Search, title: "Trouvez", text: "Filtrez par métier, quartier, dates et budget. Vue liste ou carte." },
      { icon: CalendarCheck, title: "Réservez", text: "À l'heure, à la journée, à la semaine ou au mois, en quatre écrans." },
      { icon: Armchair, title: "Travaillez", text: "Votre contrat est signé, le poste vous attend. Recevez vos clients." },
    ],
  },
  {
    title: "Vous avez un lieu",
    anchor: "hotes",
    steps: [
      { icon: Store, title: "Décrivez", text: "Votre lieu, vos postes, l'équipement inclus et votre règlement intérieur." },
      { icon: CalendarCheck, title: "Fixez vos règles", text: "Tarifs, caution, calendrier, annulation, demande ou réservation instantanée." },
      { icon: Wallet, title: "Encaissez", text: "Le paiement est garanti et versé 24 h après le début de chaque location." },
    ],
  },
];

const TRUST = [
  { icon: BadgeCheck, title: "Profils vérifiés", text: "Identité, SIRET et assurance contrôlés pour chaque hôte et chaque pro. Formation hygiène exigée pour le tatouage." },
  { icon: Lock, title: "Paiement sécurisé", text: "Aucune donnée bancaire chez Fauteo : tout passe par Stripe, avec 3-D Secure." },
  { icon: ShieldCheck, title: "Caution par empreinte", text: "Bloquée sur la carte, jamais débitée sans incident constaté, libérée sous 48 h." },
  { icon: FileSignature, title: "Contrat à chaque réservation", text: "Mise à disposition d'emplacement entre indépendants, signée en ligne." },
  { icon: Star, title: "Avis croisés", text: "Hôtes et pros se notent après chaque location. Les avis sont publiés ensemble." },
];

const TRADE_TYPE: Record<Trade, StationType> = {
  coiffure: "fauteuil_coiffure",
  barbier: "poste_barber",
  esthetique: "cabine_soins",
  onglerie: "table_onglerie",
  tatouage: "box_tatouage",
};

/** Section empilée : arrondi haut qui chevauche la précédente, z-index croissant. */
const stacked = "relative -mt-8 rounded-t-[32px] shadow-[0_-10px_30px_rgb(37_42_49/5%)]";

const glassPill =
  "flex items-center gap-2 whitespace-nowrap rounded-full bg-ink/78 px-3.5 py-[9px] text-sm font-semibold text-canvas shadow-[0_10px_24px_rgb(37_42_49/18%)] backdrop-blur-[10px]";
const glassCard =
  "w-60 rounded-[24px] bg-white/88 p-[22px] text-left shadow-[0_20px_40px_rgb(37_42_49/8%)] backdrop-blur-[14px]";

/** Écran de téléphone : aperçu de l'espace « Mes réservations », alimenté par de vrais postes. */
function PhoneMockup({ stations }: { stations: HomeStation[] }) {
  const [main, ...rows] = stations;
  const rowIcons = [Scissors, Armchair];

  return (
    <div
      aria-hidden
      className="absolute left-1/2 top-0 h-[560px] w-[330px] -translate-x-1/2 rounded-[56px] bg-[#1e2227] p-[11px] shadow-[0_40px_80px_rgb(37_42_49/25%),inset_0_0_0_2px_#3a4048] [mask-image:linear-gradient(180deg,#000_58%,transparent_92%)]"
    >
      <div className="relative h-full overflow-hidden rounded-[46px] bg-canvas px-[18px] pt-3.5 text-left">
        <span className="mx-auto block h-[30px] w-[104px] rounded-full bg-[#1e2227]" />
        <div className="mt-3.5 flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface">
            <ChevronLeft className="h-[18px] w-[18px] text-ink" />
          </span>
          <span className="text-base font-bold text-ink">Mes réservations</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface">
            <Plus className="h-[18px] w-[18px] text-ink" />
          </span>
        </div>
        {main && (
          <div className="relative mt-[18px] h-[186px] overflow-hidden rounded-[24px] bg-surface-soft shadow-[0_12px_24px_rgb(37_42_49/12%)]">
            <StationImage src={main.photoUrl} alt="" type={main.type} className="absolute inset-0 h-full w-full" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(37_42_49/0%)_30%,rgb(37_42_49/85%)_100%)]" />
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/94 px-[9px] py-[5px] text-[11px] font-bold text-success">
              <BadgeCheck className="h-3 w-3" /> Confirmée
            </span>
            <div className="absolute inset-x-4 bottom-3.5 text-white">
              <p className="line-clamp-1 text-base font-bold">{main.title}</p>
              <p className="mt-1 text-xs opacity-85">
                {main.venueName} · {main.city}
              </p>
            </div>
          </div>
        )}
        <div className="mt-2">
          {rows.slice(0, 2).map((s, i) => {
            const Icon = rowIcons[i] ?? Armchair;
            return (
              <div key={s.id} className="flex items-center gap-3 border-b border-line py-3 last:border-b-0">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas-alt">
                  <Icon className="h-[18px] w-[18px] text-ink" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="truncate text-sm font-bold text-ink">{s.venueName}</span>
                  <span className="truncate text-xs text-ink-muted">
                    {s.title} · {PRICE_UNIT_LABELS[s.priceUnit].short}
                  </span>
                </span>
                <span className="text-sm font-bold text-primary-ink">{formatCents(s.priceCents)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const [{ proFeeBps, hostFeeBps }, home] = await Promise.all([getPublicFees(), getHomeData()]);
  const examplePrice = 6000;
  const proFee = Math.round((examplePrice * proFeeBps) / 10000);
  const hostFee = Math.round((examplePrice * hostFeeBps) / 10000);
  const pct = (bps: number) => `${(bps / 100).toLocaleString("fr-FR")} %`;
  const rating = home.rating;

  return (
    <>
      <Navbar variant="floating" />
      <main className="flex-1">
        {/* Hero */}
        <section className="hero-gradient relative overflow-hidden">
          <span aria-hidden className="pointer-events-none absolute -left-[140px] top-[520px] h-80 w-[520px] rounded-full bg-white opacity-85 blur-[40px]" />
          <span aria-hidden className="pointer-events-none absolute -right-[160px] top-[440px] h-[360px] w-[560px] rounded-full bg-white opacity-90 blur-[44px]" />
          <span aria-hidden className="pointer-events-none absolute -top-[180px] left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[#ffc6b8] opacity-45 blur-[80px]" />

          <div className="relative mx-auto flex max-w-[1216px] flex-col items-center px-4 pt-[132px] text-center sm:px-8 lg:pt-[176px]">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary-ink sm:text-[13px]">Location de postes · beauté &amp; bien-être</span>
            <h1 className="mt-6 max-w-[900px] text-balance text-[44px] font-bold leading-[1.02] tracking-[-0.045em] text-ink sm:text-[60px] lg:text-[76px]">
              Le bon{" "}
              <span className="relative inline-block whitespace-nowrap">
                poste
                <svg viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden className="pointer-events-none absolute -left-[14%] -top-[18%] h-[136%] w-[128%] overflow-visible">
                  <path
                    d="M152 10 C 70 6, 12 30, 10 62 C 8 96, 82 114, 160 110 C 238 106, 292 84, 290 54 C 288 22, 220 6, 132 14"
                    fill="none"
                    stroke="#ff6b55"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              , dans un lieu qui vous <span className="highlighter">ressemble</span>.
            </h1>
            <p className="mt-[22px] max-w-[560px] text-pretty text-[17px] leading-[1.55] text-ink-muted sm:text-[19px]">
              Salons, barbershops, instituts, ongleries et shops de tatouage ouvrent leurs postes équipés aux indépendants, sans engagement long.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2.5">
              <Link
                href="/recherche"
                className="flex h-[54px] items-center gap-2 rounded-full bg-primary px-[26px] text-base font-semibold text-on-primary shadow-[0_10px_24px_rgb(255_107_85/30%)] transition-colors hover:bg-primary-hover"
              >
                <Search className="h-4 w-4" aria-hidden /> Trouver un poste
              </Link>
              <Link
                href="/#hotes"
                className="flex h-[54px] items-center rounded-full bg-surface px-[26px] text-base font-semibold text-ink shadow-card transition-colors hover:bg-canvas-alt"
              >
                Proposer mes postes
              </Link>
            </div>

            {/* Visuel : téléphone + cartes flottantes (illustration) */}
            <div className="relative mt-16 h-[560px] w-full max-w-[1060px]">
              <PhoneMockup stations={home.featured.slice(0, 3)} />
              <div aria-hidden className="absolute left-[150px] top-24 hidden lg:block">
                <span className={glassPill}>
                  <ShieldCheck className="h-4 w-4" /> Caution non débitée
                </span>
              </div>
              <div aria-hidden className={`${glassCard} absolute left-10 top-[220px] hidden lg:block`}>
                <p className="text-sm text-ink-muted">Exemple : l&apos;hôte reçoit</p>
                <p className="mt-2.5 text-[32px] font-bold tabular-nums tracking-[-0.02em] text-ink">{formatCents(examplePrice - hostFee)}</p>
                <p className="mt-2.5 flex items-center gap-2 text-sm text-ink-muted">
                  <span className="rounded-full bg-success-subtle px-[7px] py-[3px] text-xs font-bold text-success">-{pct(hostFeeBps)}</span>
                  sur une journée à {formatCents(examplePrice)}
                </p>
              </div>
              {rating && (
                <div className={`${glassCard} absolute right-10 top-16 hidden lg:block`}>
                  <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-primary-subtle">
                    <Star className="h-[18px] w-[18px] text-primary-ink" aria-hidden />
                  </span>
                  <p className="mt-4 flex items-center gap-2 text-[26px] font-bold tracking-[-0.02em] text-ink">
                    {rating.average.toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    <span className="rounded-full bg-primary-subtle px-[7px] py-[3px] text-xs font-bold text-primary-ink">{rating.reviews} avis</span>
                  </p>
                  <p className="mt-1.5 text-sm text-ink-muted">Note moyenne des postes</p>
                </div>
              )}
              <div aria-hidden className="absolute right-[140px] top-[300px] hidden lg:block">
                <span className={glassPill}>
                  <FileSignature className="h-4 w-4" /> Contrat signé en ligne
                </span>
              </div>
            </div>

            {/* Preuve sociale : uniquement des chiffres réels */}
            <div className="relative mb-24 mt-6 flex items-center gap-3.5">
              <div className="flex" aria-hidden>
                {[
                  ["bg-primary-subtle text-primary-ink", "C"],
                  ["bg-surface-soft text-ink", "B"],
                  ["bg-success-subtle text-success", "T"],
                ].map(([cls, letter], i) => (
                  <span key={letter} className={`flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-canvas text-sm font-bold ${cls} ${i ? "-ml-2.5" : ""}`}>
                    {letter}
                  </span>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm tracking-[2px] text-primary" aria-hidden>
                  ★★★★★
                </p>
                <p className="mt-0.5 text-sm font-semibold text-ink-muted">
                  {home.members >= 50 ? `Déjà ${home.members.toLocaleString("fr-FR")} pros et hôtes inscrits` : "Coiffure, barbier, esthétique, onglerie, tatouage"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Explorer par métier */}
        <section className="relative z-[1] bg-canvas">
          <div className="mx-auto max-w-[1280px] px-4 pb-[104px] pt-[72px] sm:px-8">
            <h2 className="text-[28px] font-bold tracking-[-0.02em] text-ink">Explorer par métier</h2>
            <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]">
              {(Object.entries(TRADE_LABELS) as [Trade, string][]).map(([trade, label]) => {
                const count = home.tradeCounts[trade] ?? 0;
                return (
                  <Link key={trade} href={`/recherche?metier=${trade}`} className="group flex flex-col gap-3 text-ink">
                    <StationImage src={null} alt={label} type={TRADE_TYPE[trade]} className="aspect-square rounded-[28px] transition-transform duration-300 group-hover:-translate-y-1" />
                    <span className="flex items-center justify-between px-1">
                      <span className="text-[17px] font-bold">{label}</span>
                      {count > 0 && (
                        <span className="text-sm text-ink-muted">
                          {count} poste{count > 1 ? "s" : ""}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recommandés */}
        <section className={`${stacked} z-[2] bg-surface`}>
          <div className="mx-auto max-w-[1280px] px-4 pb-[120px] pt-20 sm:px-8">
            <HomeRecommended stations={home.featured.slice(0, 16)} />
            <div className="mt-8 flex justify-center">
              <Link
                href="/recherche"
                className="flex h-12 items-center gap-2 rounded-full border border-line bg-surface px-6 text-[15px] font-semibold text-ink transition-colors hover:border-line-strong hover:bg-canvas-alt"
              >
                Voir tous les postes <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* Comment ça marche */}
        <section id="fonctionnement" className={`${stacked} z-[3] scroll-mt-20 bg-canvas`}>
          <div className="mx-auto max-w-[1280px] px-4 pb-[120px] pt-[88px] sm:px-8">
            <div className="max-w-[640px]">
              <h2 className="text-[32px] font-bold tracking-[-0.02em] text-ink sm:text-[40px]">Comment ça marche</h2>
              <p className="mt-3 text-lg text-ink-muted">Un même compte pour louer un poste et pour proposer les vôtres.</p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {HOW.map((col) => (
                <div key={col.anchor} id={col.anchor} className="flex scroll-mt-24 flex-col gap-7 rounded-[32px] border border-line bg-surface p-7 sm:p-9">
                  <span className="self-start rounded-full bg-primary-subtle px-3 py-1.5 text-[13px] font-bold uppercase tracking-[0.04em] text-primary-ink">{col.title}</span>
                  {col.steps.map(({ icon: Icon, title, text }, i) => (
                    <div key={title} className="flex gap-[18px]">
                      <span className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[18px] bg-surface shadow-card">
                        <Icon className="h-[22px] w-[22px] text-ink" aria-hidden />
                        <span className="absolute -right-1.5 -top-1.5 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-primary text-[11px] font-bold text-on-primary">
                          {i + 1}
                        </span>
                      </span>
                      <div>
                        <p className="text-[17px] font-bold text-ink">{title}</p>
                        <p className="mt-1 text-[15px] leading-[1.6] text-ink-muted">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Frais */}
        <section className={`${stacked} z-[4] bg-surface`}>
          <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 pb-32 pt-24 sm:px-8 lg:grid-cols-2">
            <div>
              <h2 className="text-pretty text-[32px] font-bold tracking-[-0.02em] text-ink sm:text-[40px]">Des frais affichés, rien de caché</h2>
              <p className="mt-4 text-lg leading-[1.6] text-ink-muted">
                L&apos;inscription est gratuite. Fauteo se rémunère uniquement sur les réservations : {pct(proFeeBps)} de frais de service pour le pro,{" "}
                {pct(hostFeeBps)} de commission pour l&apos;hôte.
              </p>
            </div>
            <div className="rounded-[28px] border border-line bg-surface p-8 shadow-card">
              <p className="text-sm font-semibold text-ink-muted">Exemple : une journée à {formatCents(examplePrice)}</p>
              <dl className="mt-5 flex flex-col text-[15px]">
                <div className="flex justify-between gap-4 border-b border-line py-4">
                  <dt className="text-ink-muted">Le pro paie</dt>
                  <dd className="text-right">
                    <b className="tabular-nums">{formatCents(examplePrice + proFee)}</b>
                    <span className="ml-2 text-ink-muted">dont {formatCents(proFee)} de frais</span>
                  </dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-line py-4">
                  <dt className="text-ink-muted">L&apos;hôte reçoit</dt>
                  <dd className="text-right">
                    <b className="tabular-nums">{formatCents(examplePrice - hostFee)}</b>
                    <span className="ml-2 text-ink-muted">après {formatCents(hostFee)} de commission</span>
                  </dd>
                </div>
                <div className="flex justify-between gap-4 pt-4">
                  <dt className="text-ink-muted">Caution</dt>
                  <dd className="flex items-center gap-1.5 text-right">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-success" aria-hidden /> Fixée par l&apos;hôte, bloquée sans débit
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Confiance */}
        <section id="confiance" className={`${stacked} z-[5] scroll-mt-20 bg-canvas-alt`}>
          <div className="mx-auto max-w-[1280px] px-4 pb-[120px] pt-[88px] sm:px-8">
            <h2 className="text-[32px] font-bold tracking-[-0.02em] text-ink sm:text-[40px]">Un cadre de confiance</h2>
            <p className="mt-3 text-lg text-ink-muted">Chaque location est vérifiée, payée et encadrée par un contrat.</p>
            <ul className="mt-11 grid gap-5 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <li key={title} className="rounded-[24px] border border-line bg-surface p-[26px] shadow-card">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle">
                    <Icon className="h-[22px] w-[22px] text-primary-ink" aria-hidden />
                  </span>
                  <p className="mt-[18px] text-[17px] font-bold text-ink">{title}</p>
                  <p className="mt-1.5 text-[15px] leading-[1.6] text-ink-muted">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Appel à l'action */}
        <section className={`${stacked} z-[6] bg-canvas`}>
          <div className="mx-auto max-w-[1280px] px-4 pb-[120px] pt-[88px] sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-6 rounded-[36px] bg-surface-soft px-7 py-10 sm:px-14 sm:py-[52px]">
              <div className="max-w-[620px]">
                <h2 className="text-[30px] font-bold tracking-[-0.02em] text-ink sm:text-[36px]">Prêt à trouver votre place ?</h2>
                <p className="mt-2 text-lg text-ink-muted">Créez votre compte en deux minutes. Vous choisirez ensuite vos rôles.</p>
              </div>
              <Link href="/signup" className="flex h-14 shrink-0 items-center rounded-full bg-primary px-[30px] text-base font-semibold text-on-primary transition-colors hover:bg-primary-hover">
                Créer mon compte
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer rounded />
    </>
  );
}
