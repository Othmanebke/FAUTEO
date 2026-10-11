import type { Metadata } from "next";
import { Armchair, CreditCard, Inbox } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { VerificationCard } from "@/components/dashboard/VerificationCard";
import { EmptyState, PageHeader } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Espace hôte" };

export default async function HostDashboardPage() {
  const { profile, userId } = await requireRole("host");
  const supabase = await createClient();

  const [{ data: host }, { count: stations }, { count: requests }] = await Promise.all([
    supabase.from("host_profiles").select("legal_name, stripe_ready").eq("profile_id", userId).single(),
    supabase.from("stations").select("id", { count: "exact", head: true }).eq("host_id", userId),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("host_id", userId).eq("status", "requested"),
  ]);

  return (
    <>
      <PageHeader
        title={`Bonjour ${profile.first_name || ""}`.trim()}
        subtitle={host?.legal_name ? `Espace hôte · ${host.legal_name}` : "Votre espace hôte"}
      />

      <div className="space-y-8">
        <VerificationCard userId={userId} role="host" />

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="space-y-2">
            <div className="flex items-center gap-2 text-ink-muted">
              <Inbox className="h-4 w-4" aria-hidden />
              <h2 className="text-sm font-semibold">Demandes en attente</h2>
            </div>
            <p className="text-3xl font-bold tabular-nums text-ink">{requests ?? 0}</p>
            <p className="text-sm text-ink-muted">À accepter ou refuser sous 24 h.</p>
          </Card>
          <Card className="space-y-2">
            <div className="flex items-center gap-2 text-ink-muted">
              <Armchair className="h-4 w-4" aria-hidden />
              <h2 className="text-sm font-semibold">Postes</h2>
            </div>
            <p className="text-3xl font-bold tabular-nums text-ink">{stations ?? 0}</p>
            <p className="text-sm text-ink-muted">Brouillons et annonces en ligne.</p>
          </Card>
          <Card className="space-y-2">
            <div className="flex items-center gap-2 text-ink-muted">
              <CreditCard className="h-4 w-4" aria-hidden />
              <h2 className="text-sm font-semibold">Versements</h2>
            </div>
            {host?.stripe_ready ? (
              <Badge variant="success">Compte de paiement actif</Badge>
            ) : (
              <Badge variant="warning">À configurer</Badge>
            )}
            <p className="text-sm text-ink-muted">Compte Stripe Connect pour recevoir vos revenus.</p>
          </Card>
        </div>

        <section aria-labelledby="mes-postes" className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 id="mes-postes" className="text-lg font-bold text-ink">
              Mes postes
            </h2>
            <Badge variant="neutral">Création d&apos;annonce bientôt disponible</Badge>
          </div>
          <EmptyState
            icon={Armchair}
            title="Aucun poste pour le moment"
            text="Vous pourrez décrire votre lieu, vos postes, vos tarifs et votre calendrier, puis les publier une fois vos documents validés."
          />
        </section>
      </div>
    </>
  );
}
