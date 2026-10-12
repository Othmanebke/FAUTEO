import Link from "next/link";
import { cacheLife } from "next/cache";
import { Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Professionnels",
    links: [
      { href: "/recherche", label: "Trouver un poste" },
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

/**
 * Pied de page. `rounded` : bord supérieur arrondi qui chevauche la
 * section précédente (empilement des sections de l'accueil).
 */
export function Footer({ rounded = false }: { rounded?: boolean }) {
  return (
    <footer
      className={cn(
        "mt-auto bg-canvas-alt",
        rounded ? "relative z-[7] -mt-8 rounded-t-[32px] shadow-[0_-10px_30px_rgb(37_42_49/5%)]" : "border-t border-line"
      )}
    >
      <div className="mx-auto max-w-[1280px] px-4 pb-8 pt-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-[300px]">
            <Logo withTagline />
            <p className="mt-4 text-sm leading-[1.6] text-ink-muted">
              Des postes équipés dans des lieux de confiance, pour les indépendants de la beauté et du bien-être.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="text-sm font-bold text-ink">{column.title}</h2>
              <ul className="mt-4 flex flex-col gap-3 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-ink-muted transition-colors hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-sm text-ink-muted">
          <p>
            © <CurrentYear /> Fauteo. Tous droits réservés.
          </p>
          <div className="flex flex-wrap gap-5">
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4" aria-hidden /> Paiements sécurisés par Stripe
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" aria-hidden /> Données hébergées dans l&apos;UE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
