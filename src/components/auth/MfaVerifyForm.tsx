"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { FormError } from "./AuthHeading";
import { OtpInput } from "./OtpInput";

/** Saisie du code TOTP pour passer la session au niveau aal2. */
export function MfaVerifyForm({ next }: { next: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const supabase = createClient();

    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
    const factor = factors?.totp.find((f) => f.status === "verified");
    if (listError || !factor) {
      setPending(false);
      setError("Aucune application d'authentification n'est associée à ce compte.");
      return;
    }

    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
    if (verifyError) {
      setPending(false);
      setError("Code incorrect ou expiré. Réessayez avec le code affiché actuellement.");
      return;
    }

    router.replace(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <OtpInput value={code} onChange={setCode} autoFocus invalid={Boolean(error)} />
      <input type="hidden" name="code" value={code} />
      {error && <FormError>{error}</FormError>}
      <Button type="submit" size="lg" fullWidth isLoading={pending} disabled={code.length !== 6}>
        Vérifier
      </Button>
    </form>
  );
}
