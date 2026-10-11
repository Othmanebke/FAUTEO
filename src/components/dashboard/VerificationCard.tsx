import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DOCUMENT_LABELS } from "@/lib/labels";
import { loadDocumentRequirements } from "@/components/documents/DocumentsChecklist";
import { buttonClasses } from "@/components/ui/Button";
import type { AppRole } from "@/types";

/** État de vérification d'un rôle : badge « Vérifié » ou liste des documents bloquants. */
export async function VerificationCard({ userId, role }: { userId: string; role: AppRole }) {
  const supabase = await createClient();
  const [{ data: verified }, requirements] = await Promise.all([
    supabase.rpc("is_verified", { uid: userId, role }),
    loadDocumentRequirements(),
  ]);

  if (verified) {
    return (
      <div className="flex items-center gap-4 rounded-[var(--radius-card)] border border-success/25 bg-success-subtle p-5">
        <BadgeCheck className="h-6 w-6 shrink-0 text-success" aria-hidden />
        <div>
          <p className="font-semibold text-success">Profil vérifié</p>
          <p className="text-sm text-ink-muted">
            {role === "pro" ? "Vous pouvez réserver un poste." : "Vos postes peuvent être mis en ligne."}
          </p>
        </div>
      </div>
    );
  }

  const blocking = requirements.filter((r) => r.roles.includes(role) && r.status !== "approved");
  const pendingOnly = blocking.length > 0 && blocking.every((r) => r.status === "pending");

  return (
    <div className="rounded-[var(--radius-card)] border border-warning/30 bg-warning-subtle p-5 sm:p-6">
      <div className="flex gap-4">
        <ShieldAlert className="h-6 w-6 shrink-0 text-warning-ink" aria-hidden />
        <div className="flex-1 space-y-3">
          <div>
            <p className="font-semibold text-warning-ink">
              {pendingOnly ? "Vérification en cours" : "Profil à compléter"}
            </p>
            <p className="text-sm leading-relaxed text-ink">
              {pendingOnly
                ? "Notre équipe examine vos documents. Vous serez notifié dès leur validation."
                : role === "pro"
                  ? "Ces documents sont obligatoires avant toute réservation :"
                  : "Ces documents sont obligatoires avant la mise en ligne d'un poste :"}
            </p>
          </div>
          {!pendingOnly && (
            <ul className="flex flex-wrap gap-2">
              {blocking.map((r) => (
                <li key={r.type} className="rounded-full bg-surface px-3 py-1 text-sm font-medium text-ink">
                  {DOCUMENT_LABELS[r.type].title}
                  {r.status === "pending" && <span className="text-ink-muted"> · en vérification</span>}
                  {(r.status === "rejected" || r.status === "expired") && <span className="text-danger"> · à redéposer</span>}
                </li>
              ))}
            </ul>
          )}
          {!pendingOnly && (
            <Link href="/account/documents" className={buttonClasses({ size: "sm" })}>
              Compléter mes documents <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
