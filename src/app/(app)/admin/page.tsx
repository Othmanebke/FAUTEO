import type { Metadata } from "next";
import { Armchair, ExternalLink, FileSearch, FileText, Users } from "lucide-react";
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

      <div className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Documents à vérifier", value: pending?.length ?? 0, icon: FileSearch, tone: "bg-warning-subtle text-warning-ink" },
          { label: "Comptes", value: users ?? 0, icon: Users, tone: "bg-primary-subtle text-primary-ink" },
          { label: "Postes en ligne", value: published ?? 0, icon: Armchair, tone: "bg-success-subtle text-success" },
        ].map(({ label, value, icon: Icon, tone }) => (
          <Card key={label} className="flex items-center gap-4">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
              <Icon className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <p className="text-[32px] font-bold leading-none tabular-nums tracking-[-0.02em] text-ink">{value}</p>
              <p className="mt-1.5 text-sm font-semibold text-ink-muted">{label}</p>
            </div>
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
                  <Card className="grid gap-5 lg:grid-cols-[auto_1fr_auto] lg:items-start">
                    <span className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-canvas-alt text-ink lg:flex">
                      <FileText className="h-6 w-6" aria-hidden />
                    </span>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[17px] font-bold text-ink">{DOCUMENT_LABELS[doc.type].title}</h3>
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
