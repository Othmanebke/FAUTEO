"use client";

import { useActionState } from "react";
import { updatePassword } from "../actions";
import { initialFormState } from "@/lib/validation/form-state";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialFormState);

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message && <Alert tone="danger">{state.message}</Alert>}
      <PasswordInput
        name="password"
        label="Nouveau mot de passe"
        autoComplete="new-password"
        required
        hint="10 caractères minimum, avec au moins une lettre et un chiffre."
        error={state.fieldErrors?.password}
      />
      <PasswordInput name="confirm" label="Confirmation" autoComplete="new-password" required error={state.fieldErrors?.confirm} />
      <Button type="submit" size="lg" fullWidth isLoading={pending}>
        Enregistrer
      </Button>
    </form>
  );
}
