"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "../actions";
import { initialFormState } from "@/lib/validation/form-state";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, initialFormState);

  return (
    <form action={action} className="space-y-5" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.message && <Alert tone="danger">{state.message}</Alert>}
      <Input
        name="email"
        type="email"
        label="E-mail"
        autoComplete="email"
        required
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <div className="space-y-2">
        <PasswordInput name="password" label="Mot de passe" autoComplete="current-password" required error={state.fieldErrors?.password} />
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm font-semibold text-primary-ink hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
      <Button type="submit" size="lg" fullWidth isLoading={pending}>
        Se connecter
      </Button>
    </form>
  );
}
