import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const metadata: Metadata = { title: "Mot de passe oublié" };

export default function ForgotPasswordPage() {
  return (
    <>
      <Link href="/login" className="mb-8 inline-flex w-fit items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Retour à la connexion
      </Link>
      <AuthHeading title="Mot de passe oublié" subtitle="Indiquez votre e-mail : nous vous envoyons un lien pour en choisir un nouveau." />
      <ForgotPasswordForm />
    </>
  );
}
