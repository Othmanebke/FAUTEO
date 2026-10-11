"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandEmblem";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Scissors, Store, Sparkles, Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<"pro" | "host" | "both">("pro");

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#07080a] relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <Link href="/" className="inline-block mb-6">
          <BrandLogo />
        </Link>
        <Badge variant="luxury" className="mb-3">
          Inscription Fauteo
        </Badge>
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
          Comment souhaitez-vous utiliser Fauteo ?
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
          Nos comptes sont unifiés : vous pouvez réserver des postes pour votre activité nomade tout en mettant vos propres fauteuils en sous-location.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Pro */}
          <div
            onClick={() => setSelectedRole("pro")}
            className={cn(
              "cursor-pointer rounded-2xl border p-6 transition-all relative flex flex-col justify-between",
              selectedRole === "pro"
                ? "border-gray-950 bg-white shadow-md dark:border-white dark:bg-[#121620]"
                : "border-gray-200 bg-white/70 hover:border-gray-300 dark:border-gray-800 dark:bg-[#101319]"
            )}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-gray-100 p-3 text-gray-900 dark:bg-gray-800 dark:text-white">
                  <Scissors className="h-6 w-6" />
                </div>
                {selectedRole === "pro" && (
                  <span className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center dark:bg-white dark:text-black">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-950 dark:text-white">
                Je suis un Professionnel (Pro)
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Coiffeur, barbier, tatoueur, masseur ou esthéticienne. Je souhaite louer un fauteuil à la demi-journée, journée ou au mois.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Réservation directe en 4 étapes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Caution bloquée sans débit immédiat
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Contrat d&apos;hébergement automatisé
                </li>
              </ul>
            </div>
          </div>

          {/* Card Hôte */}
          <div
            onClick={() => setSelectedRole("host")}
            className={cn(
              "cursor-pointer rounded-2xl border p-6 transition-all relative flex flex-col justify-between",
              selectedRole === "host"
                ? "border-gray-950 bg-white shadow-md dark:border-white dark:bg-[#121620]"
                : "border-gray-200 bg-white/70 hover:border-gray-300 dark:border-gray-800 dark:bg-[#101319]"
            )}
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="rounded-xl bg-[#b58e6d]/15 p-3 text-[#b58e6d]">
                  <Store className="h-6 w-6" />
                </div>
                {selectedRole === "host" && (
                  <span className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center dark:bg-white dark:text-black">
                    <Check className="h-4 w-4" />
                  </span>
                )}
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-950 dark:text-white">
                Je suis un Gérant de Salon (Hôte)
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                J&apos;ai des fauteuils ou cabines inoccupés. Je souhaite rentabiliser mes charges fixes et accueillir des professionnels vérifiés.
              </p>

              <ul className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Vérification KYC bloquante des candidats
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Reversement garanti via Stripe Connect
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  Gestion autonome du calendrier
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Dual Role pill */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-[#11141b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-[#b58e6d]" />
            <div>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                Vous avez un salon et vous vous déplacez aussi ?
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Vous pourrez basculer entre mode Hôte et mode Pro à tout moment depuis votre barre d&apos;en-tête.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedRole("both")}
            className={cn(selectedRole === "both" && "bg-gray-100 dark:bg-gray-800 font-bold")}
          >
            Activer les deux
          </Button>
        </div>

        <div className="mt-8 flex justify-center">
          <Link href={selectedRole === "host" ? "/host" : "/pro"} className="w-full sm:w-auto">
            <Button size="lg" variant="primary" className="w-full sm:w-80 gap-2">
              <span>Continuer avec ce profil</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
