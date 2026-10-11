"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/(auth)/actions";
import { initialFormState } from "@/lib/validation/form-state";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialFormState);

  return (
    <form action={action} className="space-y-4" noValidate>
      {state.message && <Alert tone="danger">{state.message}</Alert>}
      <PasswordInput name="password" label="Nouveau mot de passe" autoComplete="new-password" error={state.fieldErrors?.password} />
      <PasswordInput name="confirm" label="Confirmation" autoComplete="new-password" error={state.fieldErrors?.confirm} />
      <Button type="submit" variant="secondary" isLoading={pending}>
        Mettre à jour
      </Button>
    </form>
  );
}
