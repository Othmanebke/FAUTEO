"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Check, Lock, Mail, MailCheck } from "lucide-react";
import { signUp } from "../actions";
import { initialFormState } from "@/lib/validation/form-state";
import { Input } from "@/components/ui/Input";
import { Button, buttonClasses } from "@/components/ui/Button";
import { AuthHeading, FormError } from "@/components/auth/AuthHeading";
import { Divider, OAuthButtons } from "@/components/auth/OAuthButtons";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { cn } from "@/lib/utils";

/** Solidité : 10 caractères, lettre + chiffre, puis 14 caractères (3 segments). */
function strength(password: string) {
  if (!password) return 0;
  return [password.length >= 10, /[a-zA-Z]/.test(password) && /\d/.test(password), password.length >= 14].filter(Boolean).length;
}

const BAR_COLOR = ["bg-line", "bg-danger", "bg-warning", "bg-success"];

export function SignupForm({ footer }: { footer: React.ReactNode }) {
  const [state, action, pending] = useActionState(signUp, initialFormState);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(state.values?.email ?? "");
  const score = strength(password);

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-3.5 rounded-[32px] border border-line bg-surface px-8 py-10 text-center shadow-raised">
        <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-success-subtle">
          <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-success">
            <MailCheck className="h-7 w-7 text-white" aria-hidden />
          </span>
        </span>
        <h1 className="mt-1.5 text-2xl font-bold text-ink">Vérifiez votre boîte de réception</h1>
        <p className="text-[15px] leading-[1.6] text-ink-muted">
          Un lien de confirmation vient d&apos;être envoyé à <b className="text-ink">{email || "votre adresse"}</b>. Cliquez dessus pour activer votre compte.
        </p>
        <p className="text-sm text-ink-muted">Pensez à regarder dans les courriers indésirables.</p>
        <Link href="/login" className={buttonClasses({ fullWidth: true, className: "mt-2.5 h-[52px]" })}>
          Aller à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-7">
      <AuthHeading
        title="Créer votre compte"
        subtitle="Un seul compte pour louer un poste et pour proposer les vôtres. Vous choisirez vos rôles à l'étape suivante."
      />
      <OAuthButtons next="/onboarding" />
      <Divider label="ou avec votre e-mail" />

      <form action={action} className="flex flex-col gap-[18px]" noValidate>
        <div className="grid grid-cols-2 gap-3.5">
          <Input name="first_name" label="Prénom" autoComplete="given-name" placeholder="Inès" required defaultValue={state.values?.first_name} error={state.fieldErrors?.first_name} />
          <Input name="last_name" label="Nom" autoComplete="family-name" placeholder="Martin" required defaultValue={state.values?.last_name} error={state.fieldErrors?.last_name} />
        </div>
        <Input
          name="email"
          type="email"
          label="E-mail"
          autoComplete="email"
          placeholder="vous@exemple.fr"
          required
          leftIcon={<Mail className="h-[18px] w-[18px]" />}
          defaultValue={state.values?.email}
          onChange={(e) => setEmail(e.target.value)}
          error={state.fieldErrors?.email}
        />
        <PasswordInput
          name="password"
          label="Mot de passe"
          autoComplete="new-password"
          placeholder="••••••••••"
          required
          leftIcon={<Lock className="h-[18px] w-[18px]" />}
          onChange={(e) => setPassword(e.target.value)}
          error={state.fieldErrors?.password}
        />
        <div className="-mt-1.5 flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-1.5" role="meter" aria-label="Solidité du mot de passe" aria-valuemin={0} aria-valuemax={3} aria-valuenow={score}>
            {[1, 2, 3].map((n) => (
              <span key={n} className={cn("h-1 rounded-full transition-colors", score >= n ? BAR_COLOR[score] : "bg-line")} />
            ))}
          </div>
          <p className="text-[13px] text-ink-muted">10 caractères minimum, avec au moins une lettre et un chiffre.</p>
        </div>

        <div className="space-y-1">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-[1.5] text-ink">
            <input type="checkbox" name="terms" defaultChecked={state.values?.terms === "on"} className="peer sr-only" aria-invalid={state.fieldErrors?.terms ? true : undefined} />
            <span
              aria-hidden
              className="mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] border-[1.5px] border-line-strong bg-surface transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-ink [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
            >
              <Check className="h-3.5 w-3.5 text-on-primary" strokeWidth={3} />
            </span>
            <span>
              J&apos;accepte les{" "}
              <Link href="/legal/cgu" className="font-semibold text-primary-ink underline">
                conditions générales
              </Link>{" "}
              et la{" "}
              <Link href="/legal/confidentialite" className="font-semibold text-primary-ink underline">
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          {state.fieldErrors?.terms && (
            <p className="pl-[34px] text-sm text-danger" role="alert">
              {state.fieldErrors.terms}
            </p>
          )}
        </div>

        {state.message && <FormError>{state.message}</FormError>}
        <Button type="submit" size="lg" fullWidth isLoading={pending} className="mt-1">
          Créer mon compte
        </Button>
      </form>
      {footer}
    </div>
  );
}
