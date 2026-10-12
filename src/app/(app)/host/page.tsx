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

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col gap-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary-ink">
              <Inbox className="h-6 w-6" aria-hidden />
            </span>
            <div className="space-y-1.5">
              <h2 className="text-[15px] font-semibold text-ink-muted">Demandes en attente</h2>
              <p className="text-[40px] font-bold leading-none tabular-nums tracking-[-0.02em] text-ink">{requests ?? 0}</p>
              <p className="text-sm text-ink-muted">À accepter ou refuser sous 24 h.</p>
            </div>
          </Card>
          <Card className="flex flex-col gap-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary-ink">
              <Armchair className="h-6 w-6" aria-hidden />
            </span>
            <div className="space-y-1.5">
              <h2 className="text-[15px] font-semibold text-ink-muted">Postes</h2>
              <p className="text-[40px] font-bold leading-none tabular-nums tracking-[-0.02em] text-ink">{stations ?? 0}</p>
              <p className="text-sm text-ink-muted">Brouillons et annonces en ligne.</p>
            </div>
          </Card>
          <Card className="flex flex-col gap-5">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary-ink">
              <CreditCard className="h-6 w-6" aria-hidden />
            </span>
            <div className="space-y-1.5">
              <h2 className="text-[15px] font-semibold text-ink-muted">Versements</h2>
              {host?.stripe_ready ? <Badge variant="success">Compte de paiement actif</Badge> : <Badge variant="warning">À configurer</Badge>}
              <p className="text-sm text-ink-muted">Compte Stripe Connect pour recevoir vos revenus.</p>
            </div>
          </Card>
        </div>

        <section aria-labelledby="mes-postes" className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 id="mes-postes" className="text-[22px] font-bold text-ink">
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
