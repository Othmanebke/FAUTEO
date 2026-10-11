import type { Metadata } from "next";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { MfaSettings } from "./MfaSettings";

export const metadata: Metadata = { title: "Sécurité" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SecurityPage({ searchParams }: { searchParams: SearchParams }) {
  const { profile } = await requireSession("/account/securite");
  const { raison } = await searchParams;

  return (
    <div className="max-w-2xl">
      <PageHeader title="Sécurité" subtitle="Protégez votre compte avec une application d'authentification." />
      {raison === "admin" && profile.is_admin && (
        <Alert tone="warning" className="mb-6" title="Double authentification requise">
          L&apos;accès à l&apos;administration exige la double authentification. Activez-la ci-dessous, puis vérifiez votre code.
        </Alert>
      )}
      <Card className="sm:p-8">
        <MfaSettings />
      </Card>
    </div>
  );
}
