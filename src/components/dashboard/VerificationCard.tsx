import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DOCUMENT_LABELS } from "@/lib/labels";
import { loadDocumentRequirements } from "@/components/documents/DocumentsChecklist";
import { DocumentsValidatedBadge } from "@/components/brand/TrustBadges";
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
      <div className="flex flex-wrap items-center gap-4 rounded-[24px] border border-line bg-surface p-5 sm:p-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success text-white">
          <BadgeCheck className="h-6 w-6" aria-hidden />
        </span>
        <div>
          <p className="text-[17px] font-bold text-success">Profil vérifié</p>
          <p className="text-sm text-ink-muted">
            {role === "pro" ? "Vous pouvez réserver un poste." : "Vos postes peuvent être mis en ligne."}
          </p>
        </div>
        <DocumentsValidatedBadge className="sm:ml-auto" />
      </div>
    );
  }

  const blocking = requirements.filter((r) => r.roles.includes(role) && r.status !== "approved");
  const pendingOnly = blocking.length > 0 && blocking.every((r) => r.status === "pending");

  return (
    <div className="rounded-[24px] border border-warning/30 bg-warning-subtle p-5 sm:p-6">
      <div className="flex gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-warning text-white">
          <ShieldAlert className="h-6 w-6" aria-hidden />
        </span>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-[17px] font-bold text-warning-ink">
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
                <li key={r.type} className="rounded-full bg-surface px-3.5 py-1.5 text-sm font-semibold text-ink">
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
