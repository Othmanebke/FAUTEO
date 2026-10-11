"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, UserCheck, Shield, Sparkles, Menu, X, ArrowRightLeft } from "lucide-react";
import { BrandLogo } from "./BrandEmblem";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Navbar() {
  const [currentRole, setCurrentRole] = useState<"pro" | "host">("pro");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleRole = () => {
    setCurrentRole((prev) => (prev === "pro" ? "host" : "pro"));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800/80 dark:bg-[#090a0d]/85 transition-colors">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <BrandLogo />
        </Link>

        {/* Central navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link
            href="/pro"
            className="hover:text-gray-950 dark:hover:text-white transition-colors"
          >
            Explorer les postes
          </Link>
          <Link
            href="/host"
            className="hover:text-gray-950 dark:hover:text-white transition-colors flex items-center gap-1.5"
          >
            Mettre mon salon en location
            <Badge variant="luxury" size="sm">Hôte</Badge>
          </Link>
          <Link
            href="/#garanties"
            className="hover:text-gray-950 dark:hover:text-white transition-colors flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
          >
            <Shield className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            Caution & KYC
          </Link>
        </nav>

        {/* Right side: Role toggle & Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Dual Role Switcher */}
          <button
            onClick={toggleRole}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:bg-[#12151c] dark:text-gray-300 dark:hover:bg-[#1a1f29] transition-all"
            title="Basculer instantanément entre votre mode Professionnel et Hôte"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-[#b58e6d]" />
            <span>Mode :</span>
            <span className="font-bold text-gray-950 dark:text-white uppercase tracking-wider">
              {currentRole === "pro" ? "Professionnel" : "Hôte"}
            </span>
          </button>

          <Link href="/login">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
          </Link>

          <Link href="/select-role">
            <Button variant="primary" size="sm" className="gap-1.5">
              <span>S&apos;inscrire</span>
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleRole}
            className="rounded-full border border-gray-200 p-2 text-xs text-gray-700 dark:border-gray-800 dark:text-gray-300"
            aria-label="Basculer le rôle"
          >
            <ArrowRightLeft className="h-4 w-4 text-[#b58e6d]" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-100 bg-white px-4 py-6 dark:border-gray-800 dark:bg-[#090a0d] md:hidden space-y-4">
          <div className="flex flex-col space-y-3 text-sm font-medium">
            <Link
              href="/pro"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-gray-800 dark:text-gray-200"
            >
              Explorer les postes de travail
            </Link>
            <Link
              href="/host"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-gray-800 dark:text-gray-200"
            >
              Publier un poste (Espace Hôte)
            </Link>
            <Link
              href="/#garanties"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-gray-800 dark:text-gray-200"
            >
              Garanties, Cautions & Sécurité KYC
            </Link>
          </div>
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="w-full">
                Connexion
              </Button>
            </Link>
            <Link href="/select-role" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full">
                Créer un compte
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
