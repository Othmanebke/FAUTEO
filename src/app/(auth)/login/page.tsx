import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, homeFor, safeNext } from "@/lib/auth/session";
import { AuthHeading } from "@/components/auth/AuthHeading";
import { Divider, OAuthButtons } from "@/components/auth/OAuthButtons";
import { Alert } from "@/components/ui/Alert";
import { Skeleton } from "@/components/ui/Skeleton";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Connexion" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Partie dépendant de l'URL et de la session, rendue à la requête. */
async function LoginContent({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = safeNext(params.next, "");

  const session = await getSession();
  if (session) redirect(next || homeFor(session.profile));

  return (
    <>
      {params.erreur && (
        <Alert tone="warning" className="mb-6">
          Ce lien n&apos;est plus valide. Connectez-vous ou demandez un nouveau lien.
        </Alert>
      )}
      <div className="space-y-6">
        <OAuthButtons next={next || undefined} />
        <Divider label="ou avec votre e-mail" />
        <LoginForm next={next} />
      </div>
    </>
  );
}

export default function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <>
      <AuthHeading title="Bon retour parmi nous" subtitle="Connectez-vous pour retrouver vos réservations et vos postes." />
      <Suspense fallback={<Skeleton className="h-80" />}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
      <p className="mt-8 text-center text-[15px] text-ink-muted">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="font-semibold text-primary-ink hover:underline">
          Créer un compte
        </Link>
      </p>
    </>
  );
}
