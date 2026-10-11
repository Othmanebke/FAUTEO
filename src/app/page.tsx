"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { BrandEmblem } from "@/components/shared/BrandEmblem";
import { HeroSearch } from "@/components/shared/HeroSearch";
import { InteractiveMap } from "@/components/maps/InteractiveMap";
import { ProfessionalCard } from "@/components/ui/ProfessionalCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/ui/PriceTag";
import { Modal } from "@/components/ui/Modal";
import { BeautyCategory, SearchTarget, ProfessionalWithServices } from "@/types";
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
  Users,
  HeartHandshake,
  Clock,
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

const mockPros: ProfessionalWithServices[] = [
  {
    id: "pro-1",
    name: "Alexandre Tremblay",
    specialty: "Maître Barbier & Dégradés Précision",
    category: "barbier",
    city: "Paris 11e",
    currentSalon: "Maison Barber Bastille",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
    portfolio: [],
    rating: 4.98,
    reviewsCount: 142,
    isVerified: true,
    services: [
      { id: "s-1", name: "Coupe Dégradé Américain & Coiffage", price: 35, duration: "45 min" },
      { id: "s-2", name: "Taille de Barbe Traditionnelle & Serviette Chaude", price: 28, duration: "30 min" },
      { id: "s-3", name: "Le Combo Signature (Coupe + Barbe)", price: 55, duration: "1h15" },
    ],
  },
  {
    id: "pro-2",
    name: "Éléonore Rossi",
    specialty: "Coloriste Haute Coiffure & Balayage",
    category: "coiffure",
    city: "Paris 1er",
    currentSalon: "Atelier Saint-Honoré",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop&q=80",
    portfolio: [],
    rating: 4.99,
    reviewsCount: 189,
    isVerified: true,
    services: [
      { id: "s-4", name: "Balayage Sur-Mesure & Soin Olaplex", price: 145, duration: "2h30" },
      { id: "s-5", name: "Coupe Créateur, Brushing & Soin Botanique", price: 65, duration: "1h00" },
    ],
  },
  {
    id: "pro-3",
    name: "Damien 'Kuro' Vane",
    specialty: "Tatoueur Fineline, Micro-réalisme & Gravure",
    category: "tatouage",
    city: "Paris 10e",
    currentSalon: "Atelier Encre Noire",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80",
    portfolio: [],
    rating: 5.0,
    reviewsCount: 97,
    isVerified: true,
    services: [
      { id: "s-6", name: "Flash Fineline Pièce Dédiée (5-8cm)", price: 120, duration: "1h30" },
      { id: "s-7", name: "Séance Personnalisée Grande Pièce (l'heure)", price: 100, duration: "Par heure" },
    ],
  },
];

const categoriesList = [
  { id: "all", label: "Tous" },
  { id: "coiffure", label: "Coiffure" },
  { id: "barbier", label: "Barbier" },
  { id: "tatouage", label: "Tatouage" },
  { id: "onglerie", label: "Onglerie" },
  { id: "massage", label: "Massage & Soin" },
];

export default function HomePage() {
  const [activeTarget, setActiveTarget] = useState<SearchTarget>("chair");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeModalListing, setActiveModalListing] = useState<ListingItem | null>(null);
  const [activeProForAppointment, setActiveProForAppointment] = useState<ProfessionalWithServices | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);

  const filteredListings =
    selectedCategory === "all"
      ? mockListings
      : mockListings.filter((item) => item.category === selectedCategory);

  const filteredPros =
    selectedCategory === "all"
      ? mockPros
      : mockPros.filter((item) => item.category === selectedCategory);

  const handleOpenProAppointment = (pro: ProfessionalWithServices) => {
    setActiveProForAppointment(pro);
    setSelectedService(pro.services[0] || null);
    setAppointmentConfirmed(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#07080a] text-gray-900 dark:text-gray-100 overflow-x-hidden selection:bg-[#b58e6d]/30 selection:text-black">
      <Navbar />

      {/* ========================================================= */}
      {/* 1. HERO SECTION WITH DUAL SEARCH (CHAIR VS PRO)           */}
      {/* ========================================================= */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-900 overflow-hidden">
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
            <span>Place de marché Beauté & Bien-être</span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="text-[#b58e6d] font-bold">Fauteuils & Artisans d&apos;Exception</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-950 dark:text-white leading-[1.12]">
            {activeTarget === "chair" ? (
              <>
                Louez votre poste de travail.{" "}
                <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-950 via-[#b58e6d] to-gray-800 dark:from-white dark:via-[#d8bc93] dark:to-gray-300">
                  Exercez en toute liberté.
                </span>
              </>
            ) : (
              <>
                Trouvez les meilleurs coiffeurs & pros.{" "}
                <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-950 via-[#b58e6d] to-gray-800 dark:from-white dark:via-[#d8bc93] dark:to-gray-300">
                  Dans des salons de prestige.
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-600 dark:text-gray-400 font-normal leading-relaxed">
            {activeTarget === "chair"
              ? "Fauteuils de coiffure, postes de barbier, cabines de tatouage et espaces bien-être. Réservez à la journée sans bail commercial avec caution sécurisée."
              : "Prenez rendez-vous avec des coiffeurs, barbiers, coloristes et tatoueurs indépendants d'exception exerçant dans nos salons partenaires certifiés."}
          </p>

          {/* Hero Search Bar with Dual Target Toggle */}
          <div className="pt-4">
            <HeroSearch
              initialTarget={activeTarget}
              onTargetChange={(target) => setActiveTarget(target)}
              onSearch={(filters) => {
                setActiveTarget(filters.target);
                if (filters.category !== "all") {
                  setSelectedCategory(filters.category);
                }
              }}
            />
          </div>

          {/* Trust stats pill */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Cautions par empreinte bancaire non débitée</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck2 className="h-4 w-4 text-[#b58e6d]" />
              <span>Contrats de sous-location instantanés</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              <span>Paiements Stripe Connect sécurisés</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. PEDAGOGICAL SECTION: COMPRENDRE LES 3 RÔLES FAUTEO      */}
      {/* ========================================================= */}
      <section className="py-14 bg-gray-50/60 dark:bg-[#0c0e13] border-b border-gray-100 dark:border-gray-900 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <Badge variant="luxury">Guide & Fonctionnement</Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white">
              Hôte, Professionnel ou Client : qui fait quoi ?
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Fauteo relie trois acteurs clés de l&apos;écosystème beauté pour éliminer les contraintes des baux commerciaux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Rôle 1: L'HÔTE */}
            <Card className="p-6 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12151c] flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-[#b58e6d]/15 text-[#b58e6d] flex items-center justify-center mb-4">
                  <Store className="h-6 w-6" />
                </div>
                <Badge variant="luxury" size="sm" className="mb-2">
                  1. L&apos;HÔTE (Gérant de salon)
                </Badge>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                  &quot;J&apos;ai des fauteuils vides&quot;
                </h3>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Vous êtes propriétaire ou titulaire du bail d&apos;un salon de coiffure, barbier ou institut. Certains postes ne sont pas occupés à 100%.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs space-y-1.5 text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white">Ce qu&apos;il gagne :</p>
                  <p>✓ Rentabilise ses charges fixes sans embaucher</p>
                  <p>✓ Versements garantis via Stripe Connect</p>
                  <p>✓ Cautions sous séquestre en cas de dégradation</p>
                </div>
              </div>
              <div className="mt-6 pt-2">
                <Link href="/host">
                  <Button variant="outline" size="sm" className="w-full">
                    Mettre mon salon en location
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Rôle 2: LE PROFESSIONNEL */}
            <Card className="p-6 border-gray-950 dark:border-white/40 bg-white dark:bg-[#12151c] shadow-md flex flex-col justify-between relative">
              <span className="absolute -top-3 right-6 bg-[#b58e6d] text-white text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full">
                Cœur de marché
              </span>
              <div>
                <div className="h-12 w-12 rounded-xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center mb-4">
                  <Scissors className="h-6 w-6" />
                </div>
                <Badge variant="verified" size="sm" className="mb-2">
                  2. LE PRO (Artisan indépendant)
                </Badge>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                  &quot;Je cherche un poste équipé&quot;
                </h3>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Vous êtes coiffeur, barbier, tatoueur ou esthéticienne à votre compte (auto-entrepreneur ou société). Vous ne voulez pas vous endetter avec un bail commercial.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs space-y-1.5 text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white">Ce qu&apos;il gagne :</p>
                  <p>✓ Loue à la demi-journée ou journée selon son agenda</p>
                  <p>✓ Tarifs nets clairs & caution non débitée</p>
                  <p>✓ Reçoit ses clients dans des salons prestigieux</p>
                </div>
              </div>
              <div className="mt-6 pt-2">
                <Link href="/pro">
                  <Button variant="primary" size="sm" className="w-full">
                    Explorer les fauteuils disponibles
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Rôle 3: LE CLIENT FINAL */}
            <Card className="p-6 border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12151c] flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <Badge variant="default" size="sm" className="mb-2">
                  3. LE CLIENT (Particulier)
                </Badge>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                  &quot;Je veux réserver une prestation&quot;
                </h3>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Vous cherchez un coiffeur talentueux, un dégradé impeccable, un balayage sur-mesure ou un tatouage exclusif réalisé par un artiste certifié.
                </p>
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs space-y-1.5 text-gray-700 dark:text-gray-300">
                  <p className="font-semibold text-gray-900 dark:text-white">Ce qu&apos;il gagne :</p>
                  <p>✓ Découvre les meilleurs artistes indépendants</p>
                  <p>✓ Réservation en ligne avec horaires en temps réel</p>
                  <p>✓ Garantie d&apos;accueil dans un salon hygiénique validé</p>
                </div>
              </div>
              <div className="mt-6 pt-2">
                <button
                  onClick={() => setActiveTarget("pro")}
                  className="w-full"
                >
                  <Button variant="gold" size="sm" className="w-full">
                    Trouver un coiffeur ou un pro
                  </Button>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. DUAL DIRECTORY: WORKSTATIONS OR PROFESSIONALS          */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Toggle bar & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#b58e6d]" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#b58e6d]">
                {activeTarget === "chair" ? "Postes de travail disponibles" : "Artisans & Coiffeurs résidents"}
              </h2>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-950 dark:text-white mt-1">
              {activeTarget === "chair"
                ? "Fauteuils équipés à la location"
                : "Réservez votre séance avec un professionnel"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {activeTarget === "chair"
                ? "Affichage transparent : tarif net, caution bloquée et équipements inclus."
                : "Coiffeurs, barbiers et tatoueurs indépendants exerçant dans nos salons partenaires."}
            </p>
          </div>

          {/* Toggle between Chair and Pro views */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-800 p-1 bg-gray-50 dark:bg-gray-900 mr-2">
              <button
                onClick={() => setActiveTarget("chair")}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeTarget === "chair"
                    ? "bg-white text-black dark:bg-[#1f2430] dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-black dark:hover:text-white"
                }`}
              >
                Fauteuils ({mockListings.length})
              </button>
              <button
                onClick={() => setActiveTarget("pro")}
                className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                  activeTarget === "pro"
                    ? "bg-white text-black dark:bg-[#1f2430] dark:text-white shadow-sm"
                    : "text-gray-500 hover:text-black dark:hover:text-white"
                }`}
              >
                Coiffeurs & Pros ({mockPros.length})
              </button>
            </div>

            {/* Category pills */}
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

        {/* VIEW 1: CHAIRS GRID */}
        {activeTarget === "chair" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((item) => (
              <Card
                key={item.id}
                hoverEffect
                className="flex flex-col justify-between overflow-hidden p-0 border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-[#0e1117] group"
              >
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
        )}

        {/* VIEW 2: PROFESSIONALS DIRECTORY */}
        {activeTarget === "pro" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPros.map((pro) => (
              <ProfessionalCard
                key={pro.id}
                pro={pro}
                onBookAppointment={handleOpenProAppointment}
              />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* 4. INTERACTIVE MAP SECTION                                */}
      {/* ========================================================= */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 bg-gray-50/50 dark:bg-[#0c0e13]">
          <div className="max-w-xl mb-6">
            <Badge variant="luxury" size="sm" className="mb-2">
              Salons & Lieux de pratique
            </Badge>
            <h3 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
              Visualisez les salons et ateliers sur la carte
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Retrouvez l&apos;ensemble des salons hébergeant nos fauteuils à louer et nos coiffeurs partenaires.
            </p>
          </div>

          <InteractiveMap />
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. APPOINTMENT BOOKING MODAL FOR CLIENTS                  */}
      {/* ========================================================= */}
      <Modal
        isOpen={Boolean(activeProForAppointment)}
        onClose={() => setActiveProForAppointment(null)}
        title={activeProForAppointment ? `Prendre RDV avec ${activeProForAppointment.name}` : ""}
        description={
          activeProForAppointment
            ? `Chez ${activeProForAppointment.currentSalon} (${activeProForAppointment.city})`
            : ""
        }
      >
        {activeProForAppointment && (
          <div className="space-y-5">
            {!appointmentConfirmed ? (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    1. Choisissez votre prestation :
                  </label>
                  <div className="space-y-2">
                    {activeProForAppointment.services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`cursor-pointer rounded-xl border p-3 flex items-center justify-between text-xs transition-all ${
                          selectedService?.id === service.id
                            ? "border-gray-950 bg-gray-50 dark:border-white dark:bg-gray-800 font-bold"
                            : "border-gray-200 hover:border-gray-300 dark:border-gray-800"
                        }`}
                      >
                        <div>
                          <p className="text-gray-950 dark:text-white">{service.name}</p>
                          <p className="text-[11px] text-gray-500 font-normal">{service.duration}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-950 dark:text-white">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    2. Créneau horaire souhaité :
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {["10:00", "11:30", "14:00", "15:30", "17:00", "18:30"].map((slot, i) => (
                      <div
                        key={slot}
                        className={`p-2.5 rounded-lg border text-center cursor-pointer transition-colors ${
                          i === 1
                            ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black font-bold"
                            : "border-gray-200 hover:bg-gray-50 dark:border-gray-800"
                        }`}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveProForAppointment(null)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="gold"
                    size="sm"
                    onClick={() => setAppointmentConfirmed(true)}
                  >
                    Confirmer le RDV ({formatCurrency(selectedService?.price || 35)})
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-gray-950 dark:text-white">
                  Rendez-vous réservé avec succès !
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activeProForAppointment.name} vous attend chez {activeProForAppointment.currentSalon}. Un SMS de confirmation et les détails d&apos;accès vous ont été envoyés.
                </p>
                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveProForAppointment(null)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* DETAIL MODAL FOR CHAIR RENTAL */}
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
