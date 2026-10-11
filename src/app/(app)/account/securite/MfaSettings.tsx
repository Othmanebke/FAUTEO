"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Smartphone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

interface Enrollment {
  factorId: string;
  qrCode: string;
  secret: string;
}

/** Activation / désactivation de la double authentification TOTP (Supabase Auth MFA). */
export function MfaSettings() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verifiedFactorId, setVerifiedFactorId] = useState<string | null>(null);
  const [aal, setAal] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const [{ data: factors }, { data: level }] = await Promise.all([
      supabase.auth.mfa.listFactors(),
      supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    ]);
    setVerifiedFactorId(factors?.totp.find((f) => f.status === "verified")?.id ?? null);
    setAal(level?.currentLevel ?? null);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Lecture de l'état MFA auprès de Supabase Auth au montage
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  async function startEnrollment() {
    setError(null);
    setPending(true);
    const supabase = createClient();
    // Nettoyage d'une tentative précédente non finalisée
    const { data: factors } = await supabase.auth.mfa.listFactors();
    for (const f of factors?.all ?? []) {
      if (f.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: f.id });
    }
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Application d'authentification" });
    setPending(false);
    if (error || !data) return setError("Activation impossible pour le moment. Réessayez.");
    setEnrollment({ factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
  }

  async function confirmEnrollment(e: React.FormEvent) {
    e.preventDefault();
    if (!enrollment) return;
    setError(null);
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: enrollment.factorId, code });
    setPending(false);
    if (error) return setError("Code incorrect. Saisissez le code affiché actuellement dans l'application.");
    setEnrollment(null);
    setCode("");
    await refresh();
    router.refresh();
  }

  async function disable() {
    if (!verifiedFactorId) return;
    setError(null);
    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.unenroll({ factorId: verifiedFactorId });
    setPending(false);
    if (error) return setError("Pour désactiver la double authentification, reconnectez-vous et validez d'abord votre code.");
    await supabase.auth.refreshSession();
    await refresh();
    router.refresh();
  }

  if (loading) return <p className="text-sm text-ink-muted">Chargement…</p>;

  if (verifiedFactorId) {
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <ShieldCheck className="h-6 w-6 shrink-0 text-success" aria-hidden />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-ink">Double authentification</h2>
              <Badge variant="success">Activée</Badge>
            </div>
            <p className="text-sm text-ink-muted">Un code vous est demandé à chaque connexion.</p>
          </div>
        </div>
        {aal !== "aal2" && (
          <Alert tone="info">
            Votre session actuelle n&apos;a pas encore été vérifiée. <a href="/login/verification?next=/account/securite">Saisir mon code</a>
          </Alert>
        )}
        {error && <Alert tone="danger">{error}</Alert>}
        <Button variant="secondary" onClick={disable} isLoading={pending}>
          Désactiver
        </Button>
      </div>
    );
  }

  if (enrollment) {
    return (
      <form onSubmit={confirmEnrollment} className="space-y-5">
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-ink">
          <li>Ouvrez une application d&apos;authentification (Google Authenticator, 1Password, Authy…).</li>
          <li>Scannez ce QR code, ou saisissez la clé manuellement.</li>
          <li>Entrez le code à 6 chiffres affiché.</li>
        </ol>
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-4 sm:flex-row">
          {/* QR code SVG fourni par Supabase sous forme de data URL */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={enrollment.qrCode} alt="QR code d'activation" width={176} height={176} className="h-44 w-44" />
          <code className="break-all rounded-xl bg-canvas-alt px-3 py-2 text-xs text-ink">{enrollment.secret}</code>
        </div>
        {error && <Alert tone="danger">{error}</Alert>}
        <Input
          label="Code de vérification"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          className="text-center text-xl tracking-[0.5em]"
        />
        <div className="flex gap-3">
          <Button type="submit" isLoading={pending} disabled={code.length !== 6}>
            Activer
          </Button>
          <Button variant="ghost" onClick={() => setEnrollment(null)}>
            Annuler
          </Button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-4">
        <Smartphone className="h-6 w-6 shrink-0 text-ink-muted" aria-hidden />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-ink">Double authentification</h2>
            <Badge variant="outline">Désactivée</Badge>
          </div>
          <p className="text-sm leading-relaxed text-ink-muted">
            En plus de votre mot de passe, un code temporaire généré sur votre téléphone sera demandé à la connexion.
          </p>
        </div>
      </div>
      {error && <Alert tone="danger">{error}</Alert>}
      <Button onClick={startEnrollment} isLoading={pending}>
        Activer la double authentification
      </Button>
    </div>
  );
}
