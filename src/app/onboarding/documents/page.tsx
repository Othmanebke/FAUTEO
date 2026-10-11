import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { homeFor, requireSession } from "@/lib/auth/session";
import { Steps } from "@/components/onboarding/Steps";
import { DocumentsChecklist } from "@/components/documents/DocumentsChecklist";
import { buttonClasses } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Vos documents" };

/** Étape 3 : justificatifs. On peut terminer plus tard ; les actions restent bloquées tant qu'ils ne sont pas validés. */
export default async function OnboardingDocumentsPage() {
  const { profile, userId } = await requireSession("/onboarding/documents");
  if (!profile.is_pro && !profile.is_host) redirect("/onboarding");

  return (
    <>
      <Steps current={3} />
      <h1 className="text-3xl font-bold tracking-tight text-ink">Vos documents</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
        {profile.is_host && profile.is_pro
          ? "Ils conditionnent la réservation d'un poste et la mise en ligne de vos annonces."
          : profile.is_host
            ? "Ils conditionnent la mise en ligne de vos annonces."
            : "Ils conditionnent la réservation d'un poste."}{" "}
        Ils sont stockés de façon chiffrée et ne sont visibles que par l&apos;équipe de vérification.
      </p>

      <div className="mt-8">
        <DocumentsChecklist userId={userId} />
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link href={`/onboarding/profil?roles=${[profile.is_pro && "pro", profile.is_host && "host"].filter(Boolean).join(",")}`} className={buttonClasses({ variant: "ghost" })}>
          Retour
        </Link>
        <Link href={homeFor(profile)} className={buttonClasses({ size: "lg" })}>
          Accéder à mon espace
        </Link>
      </div>
    </>
  );
}
