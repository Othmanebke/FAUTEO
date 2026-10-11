"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandEmblem";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = "/pro";
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#07080a] relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block mb-6">
          <BrandLogo />
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
          Connexion à votre espace
        </h2>
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          Accédez à vos réservations, plannings et postes de travail
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white dark:bg-[#11141b] py-8 px-6 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Adresse email professionnelle"
              type="email"
              required
              placeholder="marie.durand@atelier.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Mot de passe"
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-0" />
                <span>Rester connecté</span>
              </label>
              <a href="#" className="font-semibold text-[#b58e6d] hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <Button type="submit" variant="primary" className="w-full gap-2" isLoading={loading}>
              <span>Se connecter</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Pas encore inscrit ?{" "}
              <Link href="/select-role" className="font-semibold text-gray-950 dark:text-white hover:underline">
                Créer un compte professionnel ou hôte
              </Link>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-400 dark:text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Chiffrement TLS 256 bits • Données protégées RGPD</span>
          </div>
        </div>
      </div>
    </div>
  );
}
