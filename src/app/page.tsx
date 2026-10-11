import Link from "next/link";
import {
  Armchair,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  FileSignature,
  Lock,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Store,
  Wallet,
} from "lucide-react";
import { getPublicFees } from "@/lib/platform";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { buttonClasses } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/ui/PriceTag";
import { TRADE_LABELS } from "@/lib/labels";
import { formatCents } from "@/lib/utils";

const PRO_STEPS = [
  { icon: Search, title: "Trouvez", text: "Filtrez par métier, quartier, dates et budget. Vue liste ou carte." },
  { icon: CalendarCheck, title: "Réservez", text: "À l'heure, à la journée, à la semaine ou au mois, en quatre écrans." },
  { icon: Armchair, title: "Travaillez", text: "Votre contrat est signé, le poste vous attend. Recevez vos clients." },
];

const HOST_STEPS = [
  { icon: Store, title: "Décrivez", text: "Votre lieu, vos postes, l'équipement inclus et votre règlement intérieur." },
  { icon: CalendarCheck, title: "Fixez vos règles", text: "Tarifs, caution, calendrier, annulation, demande ou réservation instantanée." },
  { icon: Wallet, title: "Encaissez", text: "Le paiement est garanti et versé 24 h après le début de chaque location." },
];

const TRUST = [
  { icon: BadgeCheck, title: "Profils vérifiés", text: "Identité, SIRET et assurance contrôlés pour chaque hôte et chaque pro. Formation hygiène exigée pour le tatouage." },
  { icon: Lock, title: "Paiement sécurisé", text: "Aucune donnée bancaire chez Fauteo : tout passe par Stripe, avec 3-D Secure." },
  { icon: ShieldCheck, title: "Caution par empreinte", text: "Bloquée sur la carte, jamais débitée sans incident constaté, libérée sous 48 h." },
  { icon: FileSignature, title: "Contrat à chaque réservation", text: "Mise à disposition d'emplacement entre indépendants, signée en ligne." },
  { icon: Star, title: "Avis croisés", text: "Hôtes et pros se notent après chaque location. Les avis sont publiés ensemble." },
];

/** Exemple d'annonce : illustre l'affichage des prix et de la caution. */
function SampleListing() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-raised">
        <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-surface-soft via-primary-subtle/60 to-canvas-alt">
          <Armchair className="h-20 w-20 text-primary/70" strokeWidth={1.25} aria-hidden />
          <Badge variant="neutral" className="absolute left-4 top-4 bg-surface/90 backdrop-blur">
            Exemple d&apos;annonce
          </Badge>
        </div>
        <div className="space-y-4 p-5">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-ink">Poste barber, lumière naturelle</h3>
              <span className="flex items-center gap-1 text-sm font-semibold text-ink">
                <Star className="h-4 w-4 fill-primary text-primary" aria-hidden /> 4,9
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPin className="h-4 w-4" aria-hidden /> Paris 11e · Atelier Bastille
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">
              <BadgeCheck aria-hidden /> Hôte vérifié
            </Badge>
            <Badge variant="neutral">Fauteuil hydraulique</Badge>
            <Badge variant="neutral">Bac</Badge>
          </div>
          <div className="border-t border-line pt-4">
            <PriceTag priceCents={6000} unit="day" depositCents={20000} />
          </div>
        </div>
      </div>
      <div className="absolute -right-6 top-[38%] hidden items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-raised sm:flex">
        <CheckCircle2 className="h-5 w-5 text-success" aria-hidden />
        <div className="text-sm">
          <p className="font-semibold text-ink">Réservation confirmée</p>
          <p className="text-ink-muted">Contrat signé · mardi 9 h – 19 h</p>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  const { proFeeBps: proBps, hostFeeBps: hostBps } = await getPublicFees();
  const examplePrice = 6000;
  const proFee = Math.round((examplePrice * proBps) / 10000);
  const hostFee = Math.round((examplePrice * hostBps) / 10000);
  const pct = (bps: number) => `${(bps / 100).toLocaleString("fr-FR")} %`;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="overflow-hidden">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8 lg:pb-28 lg:pt-20">
            <div className="space-y-8">
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink-muted">
                <span className="h-2 w-2 rounded-full bg-primary" aria-hidden />
                Location de postes beauté et bien-être
              </p>
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Le bon poste,
                <br />
                dans un lieu qui vous ressemble.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
                Fauteo relie les salons, barbershops, instituts, ongleries et shops de tatouage aux indépendants qui cherchent un poste équipé, sans engagement long.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/signup" className={buttonClasses({ size: "lg" })}>
                  Je cherche un poste
                </Link>
                <Link href="/signup" className={buttonClasses({ size: "lg", variant: "secondary" })}>
                  Je propose des postes
                </Link>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Métiers">
                {Object.values(TRADE_LABELS).map((label) => (
                  <li key={label} className="rounded-full bg-canvas-alt px-3 py-1.5 text-sm font-medium text-ink">
                    {label}
                  </li>
                ))}
              </ul>
            </div>
            <SampleListing />
          </div>
        </section>

        {/* Comment ça marche */}
        <section id="fonctionnement" className="scroll-mt-20 border-y border-line bg-surface">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Comment ça marche</h2>
              <p className="text-lg text-ink-muted">Un même compte pour louer un poste et pour proposer les vôtres.</p>
            </div>
            <div className="mt-12 grid gap-12 lg:grid-cols-2">
              {[
                { title: "Vous êtes indépendant", steps: PRO_STEPS },
                { title: "Vous avez un lieu", steps: HOST_STEPS, id: "hotes" },
              ].map((column) => (
                <div key={column.title} id={column.id} className="scroll-mt-24 space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-primary-ink">{column.title}</h3>
                  <ol className="space-y-6">
                    {column.steps.map(({ icon: Icon, title, text }, index) => (
                      <li key={title} className="flex gap-4">
                        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-canvas text-ink">
                          <Icon className="h-5 w-5" aria-hidden />
                          <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-on-primary">
                            {index + 1}
                          </span>
                        </span>
                        <div className="space-y-1">
                          <p className="font-semibold text-ink">{title}</p>
                          <p className="text-[15px] leading-relaxed text-ink-muted">{text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tarifs transparents */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Des frais affichés, rien de caché</h2>
              <p className="text-lg leading-relaxed text-ink-muted">
                L&apos;inscription est gratuite. Fauteo se rémunère uniquement sur les réservations : {pct(proBps)} de frais de service pour le pro, {pct(hostBps)} de commission pour l&apos;hôte.
              </p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-card sm:p-8">
              <p className="text-sm font-semibold text-ink-muted">Exemple : une journée à {formatCents(examplePrice)}</p>
              <dl className="mt-5 divide-y divide-line text-[15px]">
                <div className="flex justify-between py-3">
                  <dt className="text-ink-muted">Le pro paie</dt>
                  <dd className="font-semibold tabular-nums text-ink">
                    {formatCents(examplePrice + proFee)}
                    <span className="ml-2 font-normal text-ink-muted">dont {formatCents(proFee)} de frais</span>
                  </dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-ink-muted">L&apos;hôte reçoit</dt>
                  <dd className="font-semibold tabular-nums text-ink">
                    {formatCents(examplePrice - hostFee)}
                    <span className="ml-2 font-normal text-ink-muted">après {formatCents(hostFee)} de commission</span>
                  </dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-ink-muted">Caution</dt>
                  <dd className="text-right text-ink">Fixée par l&apos;hôte, bloquée sans débit</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* Confiance */}
        <section id="confiance" className="scroll-mt-20 bg-canvas-alt">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl space-y-3">
              <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Un cadre de confiance</h2>
              <p className="text-lg text-ink-muted">Chaque location est vérifiée, payée et encadrée par un contrat.</p>
            </div>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TRUST.map(({ icon: Icon, title, text }) => (
                <li key={title} className="rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-card">
                  <Icon className="h-6 w-6 text-primary" aria-hidden />
                  <h3 className="mt-4 font-semibold text-ink">{title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-muted">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Appel à l'action */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-6 rounded-[2rem] bg-surface-soft px-6 py-12 sm:px-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-ink">Prêt à trouver votre place ?</h2>
              <p className="text-lg text-ink-muted">Créez votre compte en deux minutes. Vous choisirez ensuite vos rôles.</p>
            </div>
            <Link href="/signup" className={buttonClasses({ size: "lg" })}>
              Créer mon compte
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
