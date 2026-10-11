"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import {
  Store,
  Plus,
  CreditCard,
  CalendarDays,
  TrendingUp,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Users,
} from "lucide-react";

export default function HostDashboardPage() {
  const [activeTab, setActiveTab] = useState<"chairs" | "revenues" | "calendar">("chairs");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#07080a] text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header host greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
                Espace Hôte : L&apos;Atelier des Barbiers
              </h1>
              <Badge variant="verified">Compte Vérifié</Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Gérez vos postes vacants, suivez vos réservations et vos virements Stripe Connect automatisés.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-1.5">
              <CalendarDays className="h-4 w-4" />
              <span>Planning</span>
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" />
              <span>Ajouter un fauteuil</span>
            </Button>
          </div>
        </div>

        {/* 4 Key Performance Indicators (Metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Revenus ce mois</span>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
              {formatCurrency(1430)}
            </div>
            <p className="mt-1 text-[11px] text-emerald-600 font-medium">
              +18% par rapport au mois dernier
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Postes loués</span>
              <Store className="h-4 w-4 text-[#b58e6d]" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
              3 / 4
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Taux d&apos;occupation de 75%
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Cautions actives</span>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
              {formatCurrency(750)}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Séquestrées sans incident
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Solde Stripe Connect</span>
              <CreditCard className="h-4 w-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-gray-950 dark:text-white">
              {formatCurrency(385)}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">
              Virement automatique dans 2 jours
            </p>
          </Card>
        </div>

        {/* Workstations Management list */}
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between p-0 mb-4">
            <div>
              <CardTitle>Mes postes répertoriés</CardTitle>
              <CardDescription>
                Fauteuils et cabines disponibles à la sous-location dans votre salon.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[
              {
                id: "1",
                name: "Fauteuil 1 - Barber Cuir Vintage",
                price: 55,
                deposit: 200,
                status: "Loué aujourd'hui",
                pro: "Alexandre T. (Vérifié KYC)",
              },
              {
                id: "2",
                name: "Fauteuil 2 - Coiffure & Coloration",
                price: 50,
                deposit: 200,
                status: "Disponible",
                pro: "Libre pour réservation",
              },
              {
                id: "3",
                name: "Cabine Esthétique / Massage",
                price: 65,
                deposit: 300,
                status: "Loué demain",
                pro: "Sarah B. (Vérifiée KYC)",
              },
            ].map((chair) => (
              <div
                key={chair.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {chair.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {chair.pro} • Tarif : <span className="font-semibold">{formatCurrency(chair.price)} / jour</span> • Caution : {formatCurrency(chair.deposit)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={chair.status === "Disponible" ? "outline" : "verified"}
                  >
                    {chair.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
