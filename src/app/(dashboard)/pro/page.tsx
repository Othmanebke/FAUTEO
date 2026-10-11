"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PriceTag } from "@/components/ui/PriceTag";
import { Modal } from "@/components/ui/Modal";
import { DocumentUpload } from "@/components/shared/DocumentUpload";
import { formatCurrency } from "@/lib/utils";
import {
  Search,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";

const mockChairs = [
  {
    id: "chair-1",
    title: "Fauteuil Barber Cuir & Miroir Rétroéclairé",
    salon: "L'Atelier des Barbiers",
    city: "Paris 3e (Le Marais)",
    category: "Barbier / Coiffure",
    pricePerDay: 55,
    depositAmount: 200,
    rating: 4.95,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80",
    amenities: ["Bac à shampoing", "Serviettes fournies", "Stérilisateur UV", "Accès PMR"],
  },
  {
    id: "chair-2",
    title: "Cabine Tatouage Stérile Agréée ARS",
    salon: "Ink & Prestige Studio",
    city: "Paris 10e (Canal Saint-Martin)",
    category: "Tatouage",
    pricePerDay: 75,
    depositAmount: 350,
    rating: 5.0,
    reviewsCount: 22,
    image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&auto=format&fit=crop&q=80",
    amenities: ["DASRI inclus", "Fauteuil électrique", "Autoclave", "Éclairage médical"],
  },
  {
    id: "chair-3",
    title: "Poste Onglerie & Nail Art Équipé",
    salon: "Studio Pure Beauty",
    city: "Paris 11e (Bastille)",
    category: "Onglerie",
    pricePerDay: 42,
    depositAmount: 150,
    rating: 4.88,
    reviewsCount: 19,
    image: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80",
    amenities: ["Lampe UV double", "Aspirateur de table", "Fraiseuse pro", "Wifi fibre"],
  },
];

export default function ProDashboardPage() {
  const [selectedChair, setSelectedChair] = useState<any | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [isKYCModalOpen, setIsKYCModalOpen] = useState(false);

  const openBookingTunnel = (chair: any) => {
    setSelectedChair(chair);
    setBookingStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#07080a] text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pro Banner: Verification KYC Status reminder */}
        <div className="rounded-2xl border border-[#b58e6d]/30 bg-gradient-to-r from-[#b58e6d]/10 via-[#b58e6d]/5 to-transparent p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-[#b58e6d]/20 flex items-center justify-center text-[#b58e6d] shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-950 dark:text-white">
                  Statut Professionnel : Vérification KYC Requise
                </h2>
                <Badge variant="warning" size="sm">
                  1 document manquant
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                Validez votre SIRET, RC Pro et pièce d&apos;identité pour débloquer le badge &quot;Pro Vérifié&quot; et réserver sans délai.
              </p>
            </div>
          </div>
          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsKYCModalOpen(true)}
            className="shrink-0"
          >
            Compléter mon dossier KYC
          </Button>
        </div>

        {/* Section title & filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 dark:text-white">
              Espace Professionnel Nomade
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Explorez et réservez des postes équipés certifiés avec caution sécurisée et contrat instantané.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Filtrer par :</span>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <Filter className="h-3.5 w-3.5" />
              Tous les métiers
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <MapPin className="h-3.5 w-3.5" />
              Paris & Île-de-France
            </Button>
          </div>
        </div>

        {/* Chairs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockChairs.map((chair) => (
            <Card key={chair.id} hoverEffect className="flex flex-col justify-between overflow-hidden p-0 border-gray-200 dark:border-gray-800">
              {/* Image banner */}
              <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                <img
                  src={chair.image}
                  alt={chair.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="verified" size="sm">
                    <CheckCircle2 className="h-3 w-3" />
                    Salon Vérifié
                  </Badge>
                </div>
                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  ★ {chair.rating} ({chair.reviewsCount})
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#b58e6d]">
                    {chair.category}
                  </span>
                  <h3 className="text-base font-bold text-gray-950 dark:text-white mt-1 leading-snug">
                    {chair.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    {chair.city}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {chair.amenities.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Action */}
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-end justify-between">
                  <PriceTag
                    pricePerDay={chair.pricePerDay}
                    depositAmount={chair.depositAmount}
                    period="jour"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openBookingTunnel(chair)}
                  >
                    Réserver
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* 4-Step Booking Tunnel Modal */}
      <Modal
        isOpen={Boolean(selectedChair)}
        onClose={() => setSelectedChair(null)}
        title={selectedChair ? `Réservation en 4 étapes : ${selectedChair.title}` : ""}
        description="Processus sécurisé avec pré-autorisation d'empreinte bancaire pour la caution."
      >
        {selectedChair && (
          <div className="space-y-6">
            {/* Step Progress indicators */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3 text-xs">
              {[
                { num: 1, label: "Dates" },
                { num: 2, label: "Documents KYC" },
                { num: 3, label: "Tarifs & Caution" },
                { num: 4, label: "Confirmation" },
              ].map((step) => (
                <div
                  key={step.num}
                  className={`flex items-center gap-1.5 font-medium ${
                    bookingStep === step.num
                      ? "text-black dark:text-white font-bold"
                      : bookingStep > step.num
                      ? "text-emerald-600"
                      : "text-gray-400"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${
                      bookingStep === step.num
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : bookingStep > step.num
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {step.num}
                  </span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
              ))}
            </div>

            {/* Step 1: Dates & Durée */}
            {bookingStep === 1 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Étape 1 : Choisissez votre créneau
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-gray-200 p-3 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Date de début</span>
                    <p className="font-bold text-sm mt-0.5">Demain, 09:00</p>
                  </div>
                  <div className="rounded-xl border border-gray-200 p-3 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold">Date de fin</span>
                    <p className="font-bold text-sm mt-0.5">Demain, 19:00</p>
                  </div>
                </div>
                <div className="rounded-lg bg-gray-100 p-3 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  Total durée : 1 journée complète (10 heures de disponibilité).
                </div>
                <Button variant="primary" className="w-full" onClick={() => setBookingStep(2)}>
                  Suivant : Vérification des pièces
                </Button>
              </div>
            )}

            {/* Step 2: KYC Check */}
            {bookingStep === 2 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Étape 2 : Statut KYC & Assurances
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300">
                    <span>SIRET & Immatriculation</span>
                    <span className="font-bold">Validé ✓</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-800 dark:text-emerald-300">
                    <span>Attestation RC Pro active</span>
                    <span className="font-bold">Validé ✓</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-1/3" onClick={() => setBookingStep(1)}>
                    Retour
                  </Button>
                  <Button variant="primary" className="w-2/3" onClick={() => setBookingStep(3)}>
                    Continuer vers le paiement
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Breakdown tarifs & Caution */}
            {bookingStep === 3 && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  Étape 3 : Récapitulatif clair & Caution
                </h4>
                <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/60 space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Location poste (1 jour)</span>
                    <span className="font-semibold">{formatCurrency(selectedChair.pricePerDay)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Frais de service Fauteo (5%)</span>
                    <span className="font-semibold">{formatCurrency(selectedChair.pricePerDay * 0.05)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between font-bold text-sm text-gray-950 dark:text-white">
                    <span>Montant débité aujourd&apos;hui</span>
                    <span>{formatCurrency(selectedChair.pricePerDay * 1.05)}</span>
                  </div>
                </div>

                {/* Caution Box */}
                <div className="rounded-xl border border-[#b58e6d]/30 bg-[#b58e6d]/10 p-3 text-xs text-gray-700 dark:text-gray-300 space-y-1">
                  <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Caution garantie : {formatCurrency(selectedChair.depositAmount)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Simple empreinte bancaire Stripe Connect. Aucun prélèvement ne sera effectué sans incident avéré validé par notre équipe.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="w-1/3" onClick={() => setBookingStep(2)}>
                    Retour
                  </Button>
                  <Button variant="gold" className="w-2/3" onClick={() => setBookingStep(4)}>
                    Confirmer la réservation
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Success confirmation & PDF contract generation */}
            {bookingStep === 4 && (
              <div className="text-center py-4 space-y-4">
                <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto dark:bg-emerald-950 dark:text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-gray-950 dark:text-white">
                  Réservation validée avec succès !
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
                  Le contrat de mise à disposition a été automatiquement généré et envoyé à l&apos;hôte. Votre caution de {formatCurrency(selectedChair.depositAmount)} est sous séquestre sécurisé.
                </p>
                <Button variant="primary" className="w-full" onClick={() => setSelectedChair(null)}>
                  Retour à mon espace
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* KYC Upload Dialog */}
      <Modal
        isOpen={isKYCModalOpen}
        onClose={() => setIsKYCModalOpen(false)}
        title="Dossier de Conformité Légale (KYC)"
        description="Conformément à la réglementation française, nous vérifions l'ensemble des praticiens indépendants."
      >
        <div className="space-y-4">
          <DocumentUpload
            documentType="siret"
            title="Avis de situation SIRENE (SIRET)"
            description="Justificatif de moins de 3 mois attestant de votre statut d'indépendant ou société."
          />
          <DocumentUpload
            documentType="identity"
            title="Pièce d'identité en cours de validité"
            description="Carte Nationale d'Identité recto-verso ou passeport valide."
          />
          <DocumentUpload
            documentType="rc_pro"
            title="Attestation d'Assurance RC Professionnelle"
            description="Couvrant vos activités de beauté et soins pour l'année en cours."
          />
          <DocumentUpload
            documentType="hygiene_cert"
            title="Formation Hygiène et Salubrité"
            description="Certificat obligatoire de 21 heures pour la pratique du tatouage et perçage."
            isMandatory={false}
            requiresHygieneSpecialization={true}
          />

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex justify-end">
            <Button variant="primary" onClick={() => setIsKYCModalOpen(false)}>
              Enregistrer mon dossier
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}
