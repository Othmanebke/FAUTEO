import type { Metadata } from "next";
import { ExternalLink, FileSearch } from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { DOCUMENT_LABELS } from "@/lib/labels";
import { EmptyState, PageHeader } from "@/components/dashboard/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ReviewForm } from "./ReviewForm";

export const metadata: Metadata = { title: "Administration" };

const dateTimeFr = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default async function AdminPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ data: pending }, { count: users }, { count: published }] = await Promise.all([
    supabase
      .from("documents")
      .select("id, type, storage_path, expires_at, created_at, owner:profiles!documents_owner_id_fkey(id, first_name, last_name, city, is_pro, is_host)")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(50),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("stations").select("id", { count: "exact", head: true }).eq("status", "published"),
  ]);

  // Liens d'accès temporaires (10 min) vers les fichiers du bucket privé
  const paths = (pending ?? []).map((d) => d.storage_path);
  const { data: signed } = paths.length
    ? await supabase.storage.from("documents").createSignedUrls(paths, 600)
    : { data: [] };
  const urlOf = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));

  return (
    <>
      <PageHeader title="Administration" subtitle="Validation des profils et suivi de la plateforme." />

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Documents à vérifier", value: pending?.length ?? 0 },
          { label: "Comptes", value: users ?? 0 },
          { label: "Postes en ligne", value: published ?? 0 },
        ].map((stat) => (
          <Card key={stat.label} className="space-y-1">
            <p className="text-sm font-semibold text-ink-muted">{stat.label}</p>
            <p className="text-3xl font-bold tabular-nums text-ink">{stat.value}</p>
          </Card>
        ))}
      </div>

      <section aria-labelledby="file-kyc" className="space-y-4">
        <h2 id="file-kyc" className="text-[22px] font-bold text-ink">
          File de vérification
        </h2>
        {!pending?.length ? (
          <EmptyState icon={FileSearch} title="Aucun document en attente" text="Les nouveaux justificatifs apparaîtront ici, du plus ancien au plus récent." />
        ) : (
          <ul className="space-y-4">
            {pending.map((doc) => {
              const owner = doc.owner;
              const url = urlOf.get(doc.storage_path);
              return (
                <li key={doc.id}>
                  <Card className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-ink">{DOCUMENT_LABELS[doc.type].title}</h3>
                        {owner?.is_pro && <Badge variant="neutral">Pro</Badge>}
                        {owner?.is_host && <Badge variant="neutral">Hôte</Badge>}
                      </div>
                      <p className="text-sm text-ink">
                        {owner ? `${owner.first_name} ${owner.last_name}` : "Utilisateur"}
                        {owner?.city && <span className="text-ink-muted"> · {owner.city}</span>}
                      </p>
                      <p className="text-sm text-ink-muted">
                        Déposé le {dateTimeFr(doc.created_at)}
                        {doc.expires_at && ` · valable jusqu'au ${new Date(`${doc.expires_at}T12:00:00`).toLocaleDateString("fr-FR")}`}
                      </p>
                      {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-ink hover:underline">
                          Ouvrir le document <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                        </a>
                      )}
                    </div>
                    <ReviewForm documentId={doc.id} />
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
