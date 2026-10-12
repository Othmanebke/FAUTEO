import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, homeFor } from "@/lib/auth/session";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "Créer un compte" };

export default async function SignupPage() {
  const session = await getSession();
  if (session) redirect(homeFor(session.profile));

  return (
    <SignupForm
      footer={
        <p className="text-center text-[15px] text-ink-muted">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-semibold text-primary-ink hover:underline">
            Se connecter
          </Link>
        </p>
      }
    />
  );
}
