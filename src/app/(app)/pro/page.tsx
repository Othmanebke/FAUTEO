import type { Metadata } from "next";
import { CalendarDays, Search } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { VerificationCard } from "@/components/dashboard/VerificationCard";
import { EmptyState, PageHeader } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
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

        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-subtle text-primary-ink">
              <Search className="h-5 w-5" aria-hidden />
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-ink">Trouver un poste</h2>
                <Badge variant="neutral">Bientôt</Badge>
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">
                Recherche par métier, ville et dates, avec vue liste et carte.
              </p>
            </div>
          </Card>
          <Card className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-canvas-alt text-ink">
              <CalendarDays className="h-5 w-5" aria-hidden />
            </span>
            <div className="space-y-1">
              <h2 className="font-semibold text-ink">Réservations à venir</h2>
              <p className="text-3xl font-bold tabular-nums text-ink">{upcoming ?? 0}</p>
            </div>
          </Card>
        </div>

        <section aria-labelledby="mes-reservations" className="space-y-4">
          <h2 id="mes-reservations" className="text-lg font-bold text-ink">
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
