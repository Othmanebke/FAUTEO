"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "../actions";
import { initialFormState } from "@/lib/validation/form-state";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initialFormState);

  if (state.status === "success") return <Alert tone="success">{state.message}</Alert>;

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message && <Alert tone="danger">{state.message}</Alert>}
      <Input name="email" type="email" label="E-mail" autoComplete="email" required defaultValue={state.values?.email} error={state.fieldErrors?.email} />
      <Button type="submit" size="lg" fullWidth isLoading={pending}>
        Envoyer le lien
      </Button>
    </form>
  );
}
