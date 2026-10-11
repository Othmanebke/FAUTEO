"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Logo } from "@/components/shared/Logo";

/** Erreur inattendue : message sobre, nouvel essai possible sans recharger la page. */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink">Un souci de notre côté</h1>
        <p className="text-[15px] leading-relaxed text-ink-muted">
          La page n&apos;a pas pu s&apos;afficher. Réessayez dans un instant ; si le problème persiste, revenez à l&apos;accueil.
        </p>
        {error.digest && <p className="text-xs text-ink-muted">Référence : {error.digest}</p>}
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => retry()}>
          <RefreshCw className="h-4 w-4" aria-hidden /> Réessayer
        </Button>
        <Link href="/" className={buttonClasses({ variant: "secondary" })}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
