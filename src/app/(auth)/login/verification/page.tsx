import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { requireSession, safeNext } from "@/lib/auth/session";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { MfaVerifyForm } from "@/components/auth/MfaVerifyForm";

export const metadata: Metadata = { title: "Vérification en deux étapes" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MfaVerificationPage({ searchParams }: { searchParams: SearchParams }) {
  await requireSession("/login/verification");
  const { next } = await searchParams;

  return (
    <div className="flex flex-col gap-7">
      <AuthHeading
        icon={ShieldCheck}
        title="Vérification en deux étapes"
        subtitle="Saisissez le code à 6 chiffres affiché dans votre application d'authentification."
      />
      <MfaVerifyForm next={safeNext(next, "/")} />
    </div>
  );
}
