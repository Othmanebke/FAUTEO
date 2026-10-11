import Link from "next/link";
import { cacheLife } from "next/cache";
import { Lock, ShieldCheck } from "lucide-react";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Professionnels",
    links: [
      { href: "/#fonctionnement", label: "Trouver un poste" },
      { href: "/#confiance", label: "Vérification des profils" },
      { href: "/signup", label: "Créer un compte pro" },
    ],
  },
  {
    title: "Hôtes",
    links: [
      { href: "/#hotes", label: "Proposer un poste" },
      { href: "/#confiance", label: "Paiements et caution" },
      { href: "/signup", label: "Créer un compte hôte" },
    ],
  },
  {
    title: "Fauteo",
    links: [
      { href: "/legal/cgu", label: "Conditions générales" },
      { href: "/legal/confidentialite", label: "Confidentialité et RGPD" },
      { href: "/legal/mentions", label: "Mentions légales" },
    ],
  },
];

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-canvas-alt">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs space-y-4">
            <Logo withTagline />
            <p className="text-sm leading-relaxed text-ink-muted">
              Des postes équipés dans des lieux de confiance, pour les indépendants de la beauté et du bien-être.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-bold text-ink">{column.title}</h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-ink-muted transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> Fauteo. Tous droits réservés.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <Lock className="h-4 w-4" aria-hidden /> Paiements sécurisés par Stripe
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" aria-hidden /> Données hébergées dans l&apos;UE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
