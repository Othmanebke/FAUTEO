import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, homeFor } from "@/lib/auth/session";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { Divider, OAuthButtons } from "@/components/auth/OAuthButtons";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Créer un compte" };

export default async function SignupPage() {
  const session = await getSession();
  if (session) redirect(homeFor(session.profile));

  return (
    <>
      <AuthHeading
        title="Créer votre compte"
        subtitle="Un seul compte pour louer un poste et pour proposer les vôtres. Vous choisirez vos rôles à l'étape suivante."
      />
      <div className="space-y-6">
        <OAuthButtons next="/onboarding" />
        <Divider label="ou avec votre e-mail" />
        <SignupForm />
      </div>
      <p className="mt-8 text-center text-[15px] text-ink-muted">
        Déjà inscrit ?{" "}
        <Link href="/login" className="font-semibold text-primary-ink hover:underline">
          Se connecter
        </Link>
      </p>
    </>
  );
}
