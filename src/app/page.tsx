"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { BrandEmblem } from "@/components/shared/BrandEmblem";
import { HeroSearch } from "@/components/shared/HeroSearch";
import { InteractiveMap } from "@/components/maps/InteractiveMap";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/ui/PriceTag";
import { Modal } from "@/components/ui/Modal";
import { BeautyCategory } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
  Scissors,
  Store,
  MapPin,
  FileCheck2,
  Scale,
  Award,
  Zap,
} from "lucide-react";

interface ListingItem {
  id: string;
  title: string;
  salonName: string;
  city: string;
  category: BeautyCategory;
  categoryLabel: string;
  pricePerDay: number;
  pricePerHalfDay?: number;
  depositAmount: number;
  rating: number;
  reviewsCount: number;
  image: string;
  isVerified: boolean;
  amenities: string[];
}

const mockListings: ListingItem[] = [
  {
    id: "l-1",
    title: "Fauteuil Barber Cuir & Miroir Atelier",
    salonName: "Maison Barber Bastille",
    city: "Paris 11e • Métro Saint-Ambroise",
    category: "barbier",
    categoryLabel: "Barbier / Homme",
    pricePerDay: 50,
    pricePerHalfDay: 30,
    depositAmount: 200,
    rating: 4.96,
    reviewsCount: 34,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
    isVerified: true,
    amenities: ["Bac à shampoing", "Stérilisateur UV", "Lumière du jour", "Café d'accueil"],
  },
  {
    id: "l-2",
    title: "Poste Coiffure Haute Gamme & Bac Ergonomique",
    salonName: "Atelier Saint-Honoré",
    city: "Paris 1er • Place Vendôme",
    category: "coiffure",
    categoryLabel: "Coiffure & Coloration",
    pricePerDay: 65,
    pricePerHalfDay: 40,
    depositAmount: 250,
    rating: 4.98,
    reviewsCount: 42,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
    isVerified: true,
    amenities: ["Climatisation", "Serviettes incluses", "Laboratoire technique", "Vestiaire"],
  },
  {
    id: "l-3",
    title: "Cabine Tatouage Stérile & DASRI Dédié",
    salonName: "Atelier Encre Noire",
    city: "Paris 10e • Canal Saint-Martin",
    category: "tatouage",
    categoryLabel: "Tatouage & Body Art",
    pricePerDay: 80,
    pricePerHalfDay: 50,
    depositAmount: 350,
    rating: 5.0,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80",
    isVerified: true,
    amenities: ["Conformité ARS 100%", "Élimination DASRI", "Autoclave", "Table réglable"],
  },
  {
    id: "l-4",
    title: "Espace Onglerie avec Table Aspirante Pro",
    salonName: "Studio L'Écrin Ongles",
    city: "Paris 4e • Le Marais",
    category: "onglerie",
    categoryLabel: "Onglerie & Nail Art",
    pricePerDay: 45,
    pricePerHalfDay: 28,
    depositAmount: 180,
    rating: 4.92,
    reviewsCount: 27,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80",
    isVerified: true,
    amenities: ["Aspirateur intégré", "Lampes UV/LED", "Fauteuil ergonomique", "Wifi fibre"],
  },
  {
    id: "l-5",
    title: "Cabine Privative Massage & Soins Holistiques",
    salonName: "Le Sanctuaire Wellness",
    city: "Paris 8e • Champs-Élysées",
    category: "massage",
    categoryLabel: "Massage & Bien-être",
    pricePerDay: 70,
    pricePerHalfDay: 45,
    depositAmount: 300,
    rating: 4.97,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80",
    isVerified: true,
    amenities: ["Table chauffante", "Variateur de lumière", "Douche privative", "Diffuseur bio"],
  },
  {
    id: "l-6",
    title: "Station Maquillage Professionnel & Miroir Studio",
    salonName: "Studio Glamour Paris",
    city: "Paris 9e • Opéra",
    category: "maquillage",
    categoryLabel: "Maquillage & Regard",
    pricePerDay: 48,
    pricePerHalfDay: 30,
    depositAmount: 190,
    rating: 4.89,
    reviewsCount: 15,
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80",
    isVerified: true,
    amenities: ["Miroir ampoules 5500K", "Siège haut réalisateur", "Rangement sécurisé", "Son d'ambiance"],
  },
];

const categoriesList = [
  { id: "all", label: "Tous les postes" },
  { id: "coiffure", label: "Coiffure" },
  { id: "barbier", label: "Barbier" },
  { id: "tatouage", label: "Tatouage" },
  { id: "onglerie", label: "Onglerie" },
  { id: "massage", label: "Massage & Soin" },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalListing, setActiveModalListing] = useState<ListingItem | null>(null);

  const filteredListings =
    selectedCategory === "all"
      ? mockListings
      : mockListings.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#07080a] text-gray-900 dark:text-gray-100 overflow-x-hidden selection:bg-[#b58e6d]/30 selection:text-black">
      <Navbar />

      {/* ========================================================= */}
      {/* 1. HERO SECTION WITH SUBTLE LUXURY EMBLEM WATERMARK       */}
      {/* ========================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-900 overflow-hidden">
        {/* Subtle Luxury Mercedes-inspired geometric watermark background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
          <BrandEmblem
            size={720}
            subtle
            className="text-gray-200 dark:text-gray-800 scale-125 opacity-30 dark:opacity-20 transform -rotate-12"
          />
        </div>

        {/* Ambient warm champagne glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#b58e6d]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          {/* Quality badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/90 px-4 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-800 dark:bg-[#11141b]/90 dark:text-gray-200 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Marketplace de location de postes certifiés</span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="text-[#b58e6d] font-bold">100% Vérifiés KYC</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-950 dark:text-white leading-[1.12]">
            Louez votre poste de travail.{" "}
            <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-950 via-[#b58e6d] to-gray-800 dark:from-white dark:via-[#d8bc93] dark:to-gray-300">
              Exercez en toute liberté.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400 font-normal leading-relaxed">
            Fauteuils de coiffure, postes de barbier, cabines de tatouage et espaces bien-être.
            Réservez à la journée, sans bail commercial. Cautions sécurisées et contrats instantanés.
          </p>

          {/* Hero Search Bar */}
          <div className="pt-6">
            <HeroSearch
              onSearch={(filters) => {
                if (filters.category !== "all") {
                  setSelectedCategory(filters.category);
                }
              }}
            />
          </div>

          {/* Trust stats pill */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Empreinte de caution non débitée</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck2 className="h-4 w-4 text-[#b58e6d]" />
              <span>Contrat de mise à disposition légal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              <span>Reversements Stripe Connect</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. CATEGORIES FILTER & LISTINGS GRID                      */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#b58e6d]" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#b58e6d]">
                Disponibilités Immédiates
              </h2>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white mt-1">
              Postes équipés d&apos;exception
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Affichage transparent : tarif net, matériel compris et montant précis de la caution.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-gray-950 text-white dark:bg-white dark:text-black shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-[#12151c] dark:text-gray-400 dark:hover:bg-gray-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((item) => (
            <Card
              key={item.id}
              hoverEffect
              className="flex flex-col justify-between overflow-hidden p-0 border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1117] group"
            >
              {/* Photo & verified pill */}
              <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                  <Badge variant="verified" size="sm" className="bg-white/95 text-emerald-800 backdrop-blur shadow-sm dark:bg-black/80 dark:text-emerald-400">
                    <CheckCircle2 className="h-3 w-3" />
                    Vérifié KYC
                  </Badge>
                </div>
                <div className="absolute top-3.5 right-3.5 bg-black/75 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <span>★</span>
                  <span>{item.rating}</span>
                  <span className="text-gray-400 font-normal">({item.reviewsCount})</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#b58e6d]">
                      {item.categoryLabel}
                    </span>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                      {item.salonName}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-gray-950 dark:text-white mt-1.5 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span>{item.city}</span>
                  </p>

                  {/* Amenities tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-gray-50 dark:bg-gray-800/80 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium border border-gray-100 dark:border-gray-800"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pure, clear pricing & caution breakdown */}
                <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800/80 flex items-end justify-between">
                  <PriceTag
                    pricePerDay={item.pricePerDay}
                    depositAmount={item.depositAmount}
                    pricePerHalfDay={item.pricePerHalfDay}
                  />

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveModalListing(item)}
                    className="gap-1.5"
                  >
                    <span>Détails</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. INTERACTIVE MAP SECTION                                */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 bg-gray-50/50 dark:bg-[#0c0e13]">
          <div className="max-w-xl mb-6">
            <Badge variant="luxury" size="sm" className="mb-2">
              Géolocalisation Immédiate
            </Badge>
            <h3 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
              Visualisez les salons sur la carte
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Sélectionnez un point d&apos;intérêt pour vérifier les tarifs à la journée et la localisation exacte.
            </p>
          </div>

          <InteractiveMap />
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. THE 4 PILLARS OF TRUST, KYC & SECURITY                 */}
      {/* ========================================================= */}
      <section id="garanties" className="py-20 border-t border-gray-100 dark:border-gray-900 bg-gray-50/30 dark:bg-[#0a0c10] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <Badge variant="verified">Charte d&apos;Excellence Fauteo</Badge>
            <h3 className="text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
              Sécurité juridique, financière et sanitaire
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Nous avons conçu chaque étape pour éliminer tout risque entre l&apos;hôte et le professionnel nomade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <Card className="p-6">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-gray-950 dark:text-white">
                Vérification KYC Bloquante
              </h4>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Contrôle rigoureux du SIRET actif, pièce d&apos;identité et assurance RC Pro. Attestation hygiène ARS (21h) obligatoire pour les tatoueurs.
              </p>
            </Card>

            {/* Pillar 2 */}
            <Card className="p-6">
              <div className="h-10 w-10 rounded-xl bg-[#b58e6d]/15 text-[#b58e6d] flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-gray-950 dark:text-white">
                Caution Sécurisée par Empreinte
              </h4>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Le montant de la caution n&apos;est jamais débité du compte du pro. Il s&apos;agit d&apos;une pré-autorisation bancaire Stripe bloquée sous séquestre.
              </p>
            </Card>

            {/* Pillar 3 */}
            <Card className="p-6">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <FileCheck2 className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-gray-950 dark:text-white">
                Contrat Instantané Conforme
              </h4>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Génération automatique d&apos;un contrat d&apos;hébergement et de mise à disposition des installations en PDF, signé électroniquement.
              </p>
            </Card>

            {/* Pillar 4 */}
            <Card className="p-6">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-gray-950 dark:text-white">
                Stripe Connect & RGPD
              </h4>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Flux financiers automatisés vers l&apos;hôte, aucune donnée bancaire brute en mémoire, respect strict des normes RGPD et TLS 1.3.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. CALL TO ACTION FOR HOSTS                               */}
      {/* ========================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-[#0d0f14] border border-gray-800 text-white p-8 sm:p-14 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <Badge variant="luxury">Vous êtes propriétaire d&apos;un salon ?</Badge>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Rentabilisez vos postes inoccupés en toute sérénité.
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Un fauteuil vide coûte en charges fixes. Accueillez des professionnels déclarés et vérifiés par notre équipe juridique, sans démarches administratives complexes.
            </p>
            <div className="pt-4 flex flex-wrap gap-3">
              <Link href="/host">
                <Button variant="gold" size="lg" className="gap-2">
                  <span>Créer mon espace hôte</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/select-role">
                <Button variant="outline" size="lg" className="border-gray-700 text-white hover:bg-gray-800">
                  Découvrir le simulateur
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative subtle emblem */}
          <div className="absolute right-[-40px] bottom-[-40px] opacity-15 pointer-events-none">
            <BrandEmblem size={340} />
          </div>
        </div>
      </section>

      {/* Detail / Booking Modal for Listing */}
      <Modal
        isOpen={Boolean(activeModalListing)}
        onClose={() => setActiveModalListing(null)}
        title={activeModalListing ? activeModalListing.title : ""}
        description={activeModalListing ? `${activeModalListing.salonName} • ${activeModalListing.city}` : ""}
      >
        {activeModalListing && (
          <div className="space-y-5">
            <div className="rounded-xl overflow-hidden h-44 w-full bg-gray-100">
              <img
                src={activeModalListing.image}
                alt={activeModalListing.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Tarification transparente & Caution
              </h5>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tarif journée complète :</span>
                  <span className="font-bold text-gray-950 dark:text-white">
                    {formatCurrency(activeModalListing.pricePerDay)}
                  </span>
                </div>
                {activeModalListing.pricePerHalfDay && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tarif demi-journée :</span>
                    <span className="font-semibold text-gray-950 dark:text-white">
                      {formatCurrency(activeModalListing.pricePerHalfDay)}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                  <span>Caution (Empreinte CB bloquée) :</span>
                  <span>{formatCurrency(activeModalListing.depositAmount)}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <Button
                variant="outline"
                className="w-1/2"
                onClick={() => setActiveModalListing(null)}
              >
                Fermer
              </Button>
              <Link href="/pro" className="w-1/2">
                <Button variant="primary" className="w-full">
                  Réserver ce poste
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
