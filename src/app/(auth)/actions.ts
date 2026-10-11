"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { homeFor, safeNext } from "@/lib/auth/session";
import { siteUrl } from "@/lib/site-url";
import { forgotPasswordSchema, resetPasswordSchema, signInSchema, signUpSchema } from "@/lib/validation/auth";
import { fieldErrorsOf, formValues, type FormState } from "@/lib/validation/form-state";

/** Traduction des erreurs Supabase Auth les plus courantes. */
function authMessage(code: string | undefined, fallback: string): string {
  switch (code) {
    case "invalid_credentials":
      return "E-mail ou mot de passe incorrect.";
    case "email_not_confirmed":
      return "Confirmez d'abord votre adresse e-mail grâce au lien reçu.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Trop de tentatives. Patientez quelques minutes avant de réessayer.";
    case "weak_password":
      return "Mot de passe trop faible.";
    case "same_password":
      return "Choisissez un mot de passe différent de l'actuel.";
    default:
      return fallback;
  }
}

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, ["password"]);
  const parsed = signInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrorsOf(parsed.error), values };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    return { status: "error", message: authMessage(error?.code, "Connexion impossible pour le moment."), values };
  }

  const next = formData.get("next");

  // Double authentification activée : vérification du code avant d'entrer
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
    redirect(`/login/verification?next=${encodeURIComponent(safeNext(next, ""))}`);
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single();
  revalidatePath("/", "layout");
  redirect(safeNext(next, profile ? homeFor(profile) : "/onboarding"));
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, ["password"]);
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrorsOf(parsed.error), values };

  const { email, password, first_name, last_name } = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name, last_name },
      emailRedirectTo: `${await siteUrl()}/auth/callback?next=/onboarding`,
    },
  });

  if (error) {
    return { status: "error", message: authMessage(error.code, "Inscription impossible pour le moment."), values };
  }

  // Sans confirmation d'e-mail exigée, la session est ouverte immédiatement
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/onboarding");
  }

  // Message identique que l'adresse existe déjà ou non (pas d'énumération des comptes)
  return {
    status: "success",
    message: `Un lien de confirmation vient d'être envoyé à ${email}. Ouvrez-le pour activer votre compte.`,
  };
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData);
  const parsed = forgotPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrorsOf(parsed.error), values };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${await siteUrl()}/auth/callback?next=/reset-password`,
  });
  if (error?.code?.startsWith("over_")) {
    return { status: "error", message: authMessage(error.code, ""), values };
  }

  return {
    status: "success",
    message: "Si un compte existe pour cette adresse, vous allez recevoir un lien pour choisir un nouveau mot de passe.",
  };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { status: "error", fieldErrors: fieldErrorsOf(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return {
      status: "error",
      message: authMessage(error.code, "Le lien a expiré. Demandez un nouveau lien de réinitialisation."),
    };
  }

  revalidatePath("/", "layout");
  redirect("/account?motdepasse=1");
}
