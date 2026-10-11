import { Suspense } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/Skeleton";
import { BadgeCheck, FileSignature, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const PROMISES = [
  { icon: BadgeCheck, title: "Profils vérifiés", text: "SIRET, assurance et identité contrôlés pour chaque hôte et chaque pro." },
  { icon: ShieldCheck, title: "Paiement protégé", text: "Fonds conservés par Stripe jusqu'au lendemain du début de la location." },
  { icon: FileSignature, title: "Contrat automatique", text: "Un contrat de mise à disposition signé à chaque réservation." },
];

/** Gabarit des écrans d'authentification : panneau de marque à gauche (desktop), formulaire à droite. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="relative hidden overflow-hidden bg-surface-soft p-12 lg:flex lg:flex-col">
        <Link href="/" aria-label="Fauteo, accueil" className="w-fit">
          <Logo withTagline />
        </Link>

        <div className="my-auto max-w-md space-y-10">
          <h2 className="text-4xl font-bold leading-tight tracking-tight text-ink">
            Le bon poste,
            <br />
            au bon endroit.
          </h2>
          <ul className="space-y-6">
            {PROMISES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-surface text-primary shadow-card">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-semibold text-ink">{title}</span>
                  <span className="mt-0.5 block text-sm leading-relaxed text-ink-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-ink-muted">Coiffure · Barbier · Esthétique · Onglerie · Tatouage</p>
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-subtle/70 blur-3xl" />
      </aside>

      <main className="flex flex-col px-4 py-8 sm:px-8 lg:px-16">
        <Link href="/" aria-label="Fauteo, accueil" className="w-fit lg:hidden">
          <Logo />
        </Link>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <Suspense fallback={<Skeleton className="h-96" />}>{children}</Suspense>
        </div>
      </main>
    </div>
  );
}
