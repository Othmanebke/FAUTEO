"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatCurrency } from "@/lib/utils";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Search,
  Filter,
  Users,
  AlertTriangle,
} from "lucide-react";

interface KYCSubmission {
  id: string;
  applicantName: string;
  companyName: string;
  profession: string;
  siret: string;
  hasRCPro: boolean;
  hasHygieneCert: boolean; // Requis si tatoueur
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

const mockSubmissions: KYCSubmission[] = [
  {
    id: "kyc-01",
    applicantName: "Julien Mercier",
    companyName: "Mercier Ink Studio",
    profession: "Tatoueur Indépendant",
    siret: "849 203 118 00029",
    hasRCPro: true,
    hasHygieneCert: true,
    submittedAt: "Il y a 2 heures",
    status: "pending",
  },
  {
    id: "kyc-02",
    applicantName: "Camille Faure",
    companyName: "Camille Hairstyling",
    profession: "Coiffeuse Coloriste",
    siret: "912 344 551 00014",
    hasRCPro: true,
    hasHygieneCert: false, // Pas requis pour coiffure
    submittedAt: "Il y a 5 heures",
    status: "pending",
  },
  {
    id: "kyc-03",
    applicantName: "Marc Vasseur",
    companyName: "Barber King SAS",
    profession: "Barbier",
    siret: "791 228 903 00031",
    hasRCPro: false, // Bloquant !
    hasHygieneCert: false,
    submittedAt: "Hier à 18:20",
    status: "pending",
  },
];

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>(mockSubmissions);
  const [activeItem, setActiveItem] = useState<KYCSubmission | null>(null);

  const handleDecision = (id: string, decision: "approved" | "rejected") => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status: decision } : sub))
    );
    setActiveItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#07080a] text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
                Back-Office : Modération & Conformité KYC
              </h1>
              <Badge variant="luxury">Administration</Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Contrôle bloquant des dossiers légaux (SIRET, Pièce d&apos;identité, RC Pro, Attestation hygiène).
            </p>
          </div>
        </div>

        {/* Verification Queue Table */}
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
            <div>
              <CardTitle>Dossiers en attente de validation</CardTitle>
              <CardDescription>
                Les professionnels ne peuvent pas réserver tant que leur dossier n&apos;est pas approuvé.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-100 text-gray-500 uppercase dark:border-gray-800 text-[10px] tracking-wider">
                <tr>
                  <th className="pb-3 font-semibold">Candidat & Métier</th>
                  <th className="pb-3 font-semibold">SIRET</th>
                  <th className="pb-3 font-semibold">RC Pro</th>
                  <th className="pb-3 font-semibold">Hygiène (Tatouage)</th>
                  <th className="pb-3 font-semibold">Statut</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/40">
                    <td className="py-4">
                      <div className="font-bold text-gray-950 dark:text-white">
                        {sub.applicantName}
                      </div>
                      <div className="text-gray-500 text-[11px]">
                        {sub.companyName} • {sub.profession}
                      </div>
                    </td>
                    <td className="py-4 font-mono text-gray-700 dark:text-gray-300">
                      {sub.siret}
                    </td>
                    <td className="py-4">
                      {sub.hasRCPro ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Fournie
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" /> Manquante
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      {sub.profession.includes("Tatoueur") ? (
                        sub.hasHygieneCert ? (
                          <span className="text-emerald-600 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Valide
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold flex items-center gap-1">
                            <AlertTriangle className="h-3.5 w-3.5" /> Bloquant
                          </span>
                        )
                      ) : (
                        <span className="text-gray-400">Non requis</span>
                      )}
                    </td>
                    <td className="py-4">
                      <Badge
                        variant={
                          sub.status === "approved"
                            ? "verified"
                            : sub.status === "rejected"
                            ? "warning"
                            : "outline"
                        }
                      >
                        {sub.status === "approved"
                          ? "Badge Vérifié"
                          : sub.status === "rejected"
                          ? "Rejeté"
                          : "En attente"}
                      </Badge>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveItem(sub)}
                          className="gap-1 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Examiner
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* Review Modal */}
      <Modal
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        title={activeItem ? `Audit dossier : ${activeItem.applicantName}` : ""}
        description="Vérification des justificatifs officiels avant attribution du badge de confiance."
      >
        {activeItem && (
          <div className="space-y-5 text-xs">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Profession :</span>
                <span className="font-semibold">{activeItem.profession}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">SIRET certifié :</span>
                <span className="font-mono font-semibold">{activeItem.siret}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Assurance RC Pro :</span>
                <span className={activeItem.hasRCPro ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
                  {activeItem.hasRCPro ? "Conforme" : "Manquante"}
                </span>
              </div>
              {activeItem.profession.includes("Tatoueur") && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Formation Hygiène (21h) :</span>
                  <span className={activeItem.hasHygieneCert ? "text-emerald-600 font-bold" : "text-red-500 font-bold"}>
                    {activeItem.hasHygieneCert ? "Attestation ARS Conforme" : "Manquante"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="w-1/2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                onClick={() => handleDecision(activeItem.id, "rejected")}
              >
                Rejeter le dossier
              </Button>
              <Button
                variant="primary"
                className="w-1/2 bg-emerald-700 hover:bg-emerald-800"
                onClick={() => handleDecision(activeItem.id, "approved")}
              >
                Approuver & Activer
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}
