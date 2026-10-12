import { CheckCircle2, Clock, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DOCUMENT_LABELS } from "@/lib/labels";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { DocumentUploader } from "./DocumentUploader";

const STATUS = {
  missing: { label: "À fournir", variant: "outline" },
  pending: { label: "En vérification", variant: "warning" },
  approved: { label: "Validé", variant: "success" },
  rejected: { label: "Refusé", variant: "danger" },
  expired: { label: "Expiré", variant: "danger" },
} as const;

type Status = keyof typeof STATUS;

const dateFr = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

function daysUntil(iso: string) {
  return Math.ceil((new Date(`${iso}T23:59:59`).getTime() - Date.now()) / 86_400_000);
}

export async function loadDocumentRequirements() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("my_document_requirements");
  if (error) throw new Error("Impossible de charger vos documents.");
  return data ?? [];
}

/** Liste des justificatifs exigés pour les rôles du compte, avec dépôt et statut (F-05). */
export async function DocumentsChecklist({ userId }: { userId: string }) {
  const requirements = await loadDocumentRequirements();

  // Chemins de stockage des documents en attente (pour les remplacer)
  const supabase = await createClient();
  const pendingIds = requirements.filter((r) => r.status === "pending" && r.document_id).map((r) => r.document_id!);
  const { data: pendingDocs } = pendingIds.length
    ? await supabase.from("documents").select("id, storage_path").in("id", pendingIds)
    : { data: [] };
  const pathOf = new Map((pendingDocs ?? []).map((d) => [d.id, d.storage_path]));

  if (requirements.length === 0) {
    return <p className="text-sm text-ink-muted">Créez d&apos;abord votre profil pro ou hôte pour voir les documents à fournir.</p>;
  }

  const approved = requirements.filter((r) => r.status === "approved").length;
  const submitted = requirements.filter((r) => r.status === "approved" || r.status === "pending").length;
  const percent = Math.round((approved / requirements.length) * 100);

  return (
    <div className="space-y-5">
      {/* Progression : documents validés sur documents exigés */}
      <div className="rounded-[24px] border border-line bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[15px] font-bold text-ink">
            {approved} / {requirements.length} document{requirements.length > 1 ? "s" : ""} validé{requirements.length > 1 ? "s" : ""}
          </p>
          <p className="text-[13px] text-ink-muted">
            {submitted - approved > 0 ? `${submitted - approved} en vérification · ` : ""}
            {requirements.length - submitted > 0 ? `${requirements.length - submitted} à fournir` : "Tout est déposé"}
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-canvas-alt" role="progressbar" aria-label="Documents validés" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
          <div className="h-full rounded-full bg-success transition-[width]" style={{ width: `${Math.max(percent, approved ? percent : 2)}%` }} />
        </div>
      </div>
    <ul className="space-y-4">
      {requirements.map((req) => {
        const info = DOCUMENT_LABELS[req.type];
        const status = STATUS[req.status as Status] ?? STATUS.missing;
        const expiringSoon = req.status === "approved" && req.expires_at !== null && daysUntil(req.expires_at) <= 30;

        return (
          <li key={req.type}>
            <Card className="space-y-4 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-canvas-alt text-ink-muted">
                  {req.status === "approved" ? (
                    <CheckCircle2 className="h-5 w-5 text-success" aria-hidden />
                  ) : req.status === "pending" ? (
                    <Clock className="h-5 w-5 text-warning" aria-hidden />
                  ) : (
                    <FileText className="h-5 w-5" aria-hidden />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-ink">{info.title}</h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-muted">{info.description}</p>
                  {req.expires_at && req.status !== "missing" && (
                    <p className={expiringSoon ? "mt-1 text-sm font-semibold text-warning-ink" : "mt-1 text-sm text-ink-muted"}>
                      Valable jusqu&apos;au {dateFr(req.expires_at)}
                    </p>
                  )}
                  {req.status === "rejected" && req.rejection_reason && (
                    <p className="mt-2 text-sm text-danger">Motif du refus : {req.rejection_reason}</p>
                  )}
                </div>
              </div>

              {req.status !== "approved" || expiringSoon ? (
                <DocumentUploader
                  userId={userId}
                  type={req.type}
                  needsExpiry={info.needsExpiry}
                  replaceDocumentId={req.status === "pending" ? req.document_id : null}
                  replacePath={req.document_id ? pathOf.get(req.document_id) : null}
                  label={req.status === "pending" ? "Remplacer" : expiringSoon ? "Renouveler" : "Déposer"}
                  variant={req.status === "pending" ? "secondary" : "primary"}
                />
              ) : null}
            </Card>
          </li>
        );
      })}
    </ul>
    </div>
  );
}
