import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, BadgeCheck, FileSignature, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { AuthTabs } from "@/components/auth/AuthTabs";
import { Skeleton } from "@/components/ui/Skeleton";

const PROMISES = [
  { icon: BadgeCheck, title: "Profils vérifiés", text: "SIRET, assurance et identité contrôlés." },
  { icon: ShieldCheck, title: "Paiement protégé", text: "Fonds conservés par Stripe jusqu'au début." },
  { icon: FileSignature, title: "Contrat automatique", text: "Signé à chaque réservation." },
];

/**
 * Gabarit des écrans d'authentification : panneau d'ambiance à gauche
 * (desktop), formulaire à droite. Sans photo fournie, le panneau utilise
 * un fond dégradé aux couleurs de la marque.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="relative m-4 hidden min-h-[calc(100dvh-32px)] flex-col justify-between overflow-hidden rounded-[36px] bg-surface-soft p-10 lg:flex">
        {/* Ambiance (à remplacer par une photo de salon) */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_10%,#ffb39f_0%,#ff8a72_30%,#c2412f_62%,#252a31_100%)]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(37_42_49/30%)_0%,rgb(37_42_49/10%)_35%,rgb(37_42_49/85%)_100%)]" />

        <Link href="/" aria-label="Fauteo, accueil" className="relative self-start rounded-full bg-white/92 py-2 pl-2.5 pr-4">
          <Logo size="xs" withTagline />
        </Link>

        <div className="relative flex flex-col gap-6">
          <h2 className="text-[48px] font-bold leading-[1.08] tracking-[-0.03em] text-white">
            Le bon poste,
            <br />
            au bon endroit.
          </h2>
          <ul className="grid grid-cols-3 gap-2.5">
            {PROMISES.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex flex-col gap-2.5 rounded-[20px] border border-white/18 bg-white/14 p-4 text-white backdrop-blur-[14px]">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                  <Icon className="h-[18px] w-[18px] text-primary-ink" aria-hidden />
                </span>
                <span className="text-[15px] font-bold">{title}</span>
                <span className="text-[13px] leading-[1.5] text-white/88">{text}</span>
              </li>
            ))}
          </ul>
          <p className="text-sm text-white/85">Coiffure · Barbier · Esthétique · Onglerie · Tatouage</p>
        </div>
      </aside>

      <main className="flex flex-col px-4 py-6 sm:px-8 lg:px-16 lg:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Retour à l&apos;accueil</span>
            <span className="sm:hidden">
              <Logo size="xs" />
            </span>
          </Link>
          <Suspense fallback={<div className="h-11 w-64 rounded-full bg-canvas-alt" />}>
            <AuthTabs />
          </Suspense>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-[440px]">
            <Suspense fallback={<Skeleton className="h-96" />}>{children}</Suspense>
          </div>
        </div>

        <p className="flex flex-wrap justify-center gap-5 text-[13px] text-ink-muted">
          <span>Paiements sécurisés par Stripe</span>
          <span>Données hébergées dans l&apos;UE</span>
        </p>
      </main>
    </div>
  );
}
