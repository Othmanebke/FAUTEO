import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { ResetPasswordForm } from "./ResetPasswordForm";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

/** Atteinte via le lien e-mail : /auth/callback a déjà ouvert une session de récupération. */
export default async function ResetPasswordPage() {
  await requireSession("/reset-password");
  return (
    <div className="flex flex-col gap-7">
      <AuthHeading icon={LockKeyhole} title="Nouveau mot de passe" subtitle="Choisissez un mot de passe que vous n'utilisez pas ailleurs." />
      <ResetPasswordForm />
    </div>
  );
}
