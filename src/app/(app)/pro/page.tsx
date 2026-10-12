import type { Metadata } from "next";
import { CalendarDays, Search } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { VerificationCard } from "@/components/dashboard/VerificationCard";
import { EmptyState, PageHeader } from "@/components/dashboard/EmptyState";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Espace pro" };

export default async function ProDashboardPage() {
  const { profile, userId } = await requireRole("pro");
  const supabase = await createClient();

  const { count: upcoming } = await supabase
    .from("bookings")
    .select("id", { count: "exact", head: true })
    .eq("pro_id", userId)
    .in("status", ["requested", "confirmed", "in_progress"]);

  return (
    <>
      <PageHeader title={`Bonjour ${profile.first_name || ""}`.trim()} subtitle="Votre espace pour trouver et réserver un poste équipé." />

      <div className="space-y-8">
        <VerificationCard userId={userId} role="pro" />

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr]">
          {/* Grande carte d'appel à l'action */}
          <Link
            href="/recherche"
            className="group relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-[28px] p-7 text-white shadow-raised transition-transform hover:-translate-y-0.5"
          >
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_90%_at_85%_0%,#ffb39f_0%,#ff8a72_28%,#c2412f_60%,#252a31_100%)]" />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(37_42_49/0%)_20%,rgb(37_42_49/70%)_100%)]" />
            <div className="relative space-y-3">
              <h2 className="text-[26px] font-bold leading-tight tracking-[-0.02em]">Trouver un poste</h2>
              <p className="max-w-md text-[15px] text-white/88">Recherche par métier, lieu et dates, avec vue liste et carte.</p>
              <span className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink">
                <Search className="h-4 w-4" aria-hidden /> Rechercher
              </span>
            </div>
          </Link>
          <Card className="flex flex-col justify-between gap-6">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary-ink">
              <CalendarDays className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-[40px] font-bold leading-none tabular-nums tracking-[-0.02em] text-ink">{upcoming ?? 0}</p>
              <h2 className="mt-2 text-[15px] font-semibold text-ink-muted">Réservations à venir</h2>
            </div>
          </Card>
        </div>

        <section aria-labelledby="mes-reservations" className="space-y-4">
          <h2 id="mes-reservations" className="text-[22px] font-bold text-ink">
            Mes réservations
          </h2>
          <EmptyState
            icon={CalendarDays}
            title="Aucune réservation pour le moment"
            text="Vos réservations, contrats et factures apparaîtront ici."
          />
        </section>
      </div>
    </>
  );
}
