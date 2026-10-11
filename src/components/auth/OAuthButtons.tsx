"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { buttonClasses } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

type Provider = "google" | "apple";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.3-4.8 3.3-8Z" />
      <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.8 14c-.2-.7-.4-1.3-.4-2s.1-1.4.4-2V7.2H2.1a11 11 0 0 0 0 9.8L5.8 14Z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.2L5.8 10c.9-2.6 3.3-4.6 6.2-4.6Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.4-.9a5 5 0 0 0-4.2 2.6c-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5a11 11 0 0 0 1.4-2.9c0 0-2.7-1-2.7-4.1ZM13.8 5c.7-.9 1.2-2 1-3.2-1 0-2.2.7-3 1.6-.6.7-1.2 1.9-1 3 1.1.1 2.3-.6 3-1.4Z" />
    </svg>
  );
}

/** Connexion Google / Apple (F-01). Les fournisseurs s'activent dans la console Supabase. */
export function OAuthButtons({ next }: { next?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<Provider | null>(null);

  async function signInWith(provider: Provider) {
    setError(null);
    setPending(provider);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ""}`;
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } });
    if (error) {
      setPending(null);
      setError(
        error.message.toLowerCase().includes("not enabled")
          ? "Ce mode de connexion n'est pas encore disponible. Utilisez votre e-mail."
          : "Connexion impossible pour le moment. Réessayez."
      );
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" disabled={pending !== null} onClick={() => signInWith("google")} className={buttonClasses({ variant: "secondary" })}>
          <GoogleIcon /> Google
        </button>
        <button type="button" disabled={pending !== null} onClick={() => signInWith("apple")} className={buttonClasses({ variant: "secondary" })}>
          <AppleIcon /> Apple
        </button>
      </div>
      {error && <Alert tone="warning">{error}</Alert>}
    </div>
  );
}

export function Divider({ label = "ou" }: { label?: string }) {
  return (
    <div className="flex items-center gap-4 text-sm text-ink-muted" role="separator">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
