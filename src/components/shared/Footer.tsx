import React from "react";
import Link from "next/link";
import { BrandLogo } from "./BrandEmblem";
import { ShieldCheck, Lock, FileCheck2, Scale } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-[#07080a] text-gray-400 py-16 dark:border-gray-800 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:gap-16">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo />
            <p className="text-xs text-gray-400 leading-relaxed">
              La place de marché premium de location de postes clés en main pour coiffeurs, barbiers, tatoueurs et praticiens du bien-être.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-emerald-500" />
                TLS 1.3 Sécurisé
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#b58e6d]" />
                Stripe Connect
              </span>
            </div>
          </div>

          {/* Col 2: Pour les Professionnels */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Professionnels Nomades
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/pro" className="hover:text-white transition-colors">
                  Trouver un fauteuil disponible
                </Link>
              </li>
              <li>
                <Link href="/select-role" className="hover:text-white transition-colors">
                  Processus de vérification KYC
                </Link>
              </li>
              <li>
                <Link href="/pro" className="hover:text-white transition-colors">
                  Tarifs clairs & caution non débitée
                </Link>
              </li>
              <li>
                <Link href="/pro" className="hover:text-white transition-colors">
                  Contrat de sous-location instantané
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Pour les Hôtes & Salons */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Hôtes & Salons Partenaires
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/host" className="hover:text-white transition-colors">
                  Rentabiliser mes postes vacants
                </Link>
              </li>
              <li>
                <Link href="/host" className="hover:text-white transition-colors">
                  Simulateur de revenus
                </Link>
              </li>
              <li>
                <Link href="/host" className="hover:text-white transition-colors">
                  Sécurité des dépôts et cautions
                </Link>
              </li>
              <li>
                <Link href="/host" className="hover:text-white transition-colors">
                  Compte Stripe Connect
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Conformité, Sécurité & RGPD */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-[#b58e6d]" />
              Conformité & RGPD
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Vos données personnelles et documents d&apos;identité sont cryptés. Aucune coordonnée bancaire brute n&apos;est stockée sur nos serveurs.
            </p>
            <div className="flex flex-col space-y-1 text-xs text-gray-400">
              <span className="hover:text-white cursor-pointer transition-colors">
                Politique de confidentialité & RGPD
              </span>
              <span className="hover:text-white cursor-pointer transition-colors">
                Conditions Générales d&apos;Utilisation (CGU)
              </span>
              <span className="hover:text-white cursor-pointer transition-colors">
                Gestion des cookies & export des données
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-900 pt-8 sm:flex-row text-xs text-gray-500">
          <p>© 2026 FAUTEO. Tous droits réservés.</p>
          <p className="mt-4 sm:mt-0">
            Conception haut de gamme pour l&apos;indépendance des créateurs de beauté.
          </p>
        </div>
      </div>
    </footer>
  );
}
