"use client";

import { useActionState } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { signUp } from "../actions";
import { initialFormState } from "@/lib/validation/form-state";
import { Checkbox, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function SignupForm() {
  const [state, action, pending] = useActionState(signUp, initialFormState);

  if (state.status === "success") {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-surface p-6 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-subtle text-success">
          <MailCheck className="h-7 w-7" aria-hidden />
        </span>
        <h2 className="mt-4 text-lg font-bold text-ink">Vérifiez votre boîte de réception</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">{state.message}</p>
        <p className="mt-4 text-sm text-ink-muted">Pensez à regarder dans les courriers indésirables.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message && <Alert tone="danger">{state.message}</Alert>}
      <div className="grid gap-5 sm:grid-cols-2">
        <Input name="first_name" label="Prénom" autoComplete="given-name" required defaultValue={state.values?.first_name} error={state.fieldErrors?.first_name} />
        <Input name="last_name" label="Nom" autoComplete="family-name" required defaultValue={state.values?.last_name} error={state.fieldErrors?.last_name} />
      </div>
      <Input name="email" type="email" label="E-mail" autoComplete="email" required defaultValue={state.values?.email} error={state.fieldErrors?.email} />
      <PasswordInput
        name="password"
        label="Mot de passe"
        autoComplete="new-password"
        required
        hint="10 caractères minimum, avec au moins une lettre et un chiffre."
        error={state.fieldErrors?.password}
      />
      <Checkbox
        name="terms"
        defaultChecked={state.values?.terms === "on"}
        error={state.fieldErrors?.terms}
        label={
          <>
            J&apos;accepte les{" "}
            <Link href="/legal/cgu" className="font-semibold text-primary-ink underline">
              conditions générales
            </Link>{" "}
            et la{" "}
            <Link href="/legal/confidentialite" className="font-semibold text-primary-ink underline">
              politique de confidentialité
            </Link>
            .
          </>
        }
      />
      <Button type="submit" size="lg" fullWidth isLoading={pending}>
        Créer mon compte
      </Button>
    </form>
  );
}
