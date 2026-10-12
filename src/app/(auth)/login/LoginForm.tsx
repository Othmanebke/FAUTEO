"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";
import { signIn } from "../actions";
import { initialFormState } from "@/lib/validation/form-state";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/auth/AuthHeading";
import { PasswordInput } from "@/components/auth/PasswordInput";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signIn, initialFormState);

  return (
    <form action={action} className="flex flex-col gap-[18px]" noValidate>
      <input type="hidden" name="next" value={next} />
      <Input
        name="email"
        type="email"
        label="E-mail"
        autoComplete="email"
        placeholder="vous@exemple.fr"
        required
        leftIcon={<Mail className="h-[18px] w-[18px]" />}
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <PasswordInput
        name="password"
        label="Mot de passe"
        autoComplete="current-password"
        placeholder="••••••••••"
        required
        leftIcon={<Lock className="h-[18px] w-[18px]" />}
        error={state.fieldErrors?.password}
      />
      <div className="-mt-2 flex justify-end">
        <Link href="/forgot-password" className="text-sm font-semibold text-primary-ink hover:underline">
          Mot de passe oublié ?
        </Link>
      </div>
      {state.message && <FormError>{state.message}</FormError>}
      <Button type="submit" size="lg" fullWidth isLoading={pending} className="mt-1">
        Se connecter
      </Button>
    </form>
  );
}
