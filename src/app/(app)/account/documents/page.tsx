import type { Metadata } from "next";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/EmptyState";
import { DocumentsChecklist } from "@/components/documents/DocumentsChecklist";

export const metadata: Metadata = { title: "Mes documents" };

export default async function AccountDocumentsPage() {
  const { userId } = await requireSession("/account/documents");

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Mes documents"
        subtitle="Justificatifs exigés pour vos rôles. Un document expiré doit être renouvelé pour conserver le badge « Vérifié »."
      />
      <DocumentsChecklist userId={userId} />
    </div>
  );
}
