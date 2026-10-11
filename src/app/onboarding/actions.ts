"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/auth/session";
import {
  hostProfileSchema,
  identitySchema,
  proProfileSchema,
  rolesSchema,
} from "@/lib/validation/onboarding";
import { fieldErrorsOf, formValues, type FormState } from "@/lib/validation/form-state";

/**
 * Étape 2 de l'onboarding : identité + profil métier pour chaque rôle choisi.
 * Les profils pro / hôte sont créés ou mis à jour (créer un profil active le rôle).
 */
export async function saveOnboardingProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSession("/onboarding");
  const values = formValues(formData);
  values.trades = formData.getAll("trades").join(",");

  const roles = rolesSchema.safeParse(formData.getAll("roles"));
  if (!roles.success) return { status: "error", message: "Choisissez au moins un rôle.", values };

  const raw = Object.fromEntries(formData);
  const identity = identitySchema.safeParse(raw);
  const pro = roles.data.includes("pro") ? proProfileSchema.safeParse({ ...raw, trades: formData.getAll("trades") }) : null;
  const host = roles.data.includes("host") ? hostProfileSchema.safeParse(raw) : null;

  const fieldErrors = {
    ...(identity.success ? {} : fieldErrorsOf(identity.error)),
    ...(pro && !pro.success ? fieldErrorsOf(pro.error) : {}),
    ...(host && !host.success ? fieldErrorsOf(host.error) : {}),
  };
  if (Object.keys(fieldErrors).length > 0 || !identity.success) {
    return { status: "error", message: "Certains champs sont à corriger.", fieldErrors, values };
  }

  const supabase = await createClient();
  const uid = session.userId;

  const { error: identityError } = await supabase.from("profiles").update(identity.data).eq("id", uid);
  if (identityError) return { status: "error", message: "Enregistrement impossible. Réessayez.", values };

  if (pro?.success) {
    const { pro_siret, ...rest } = pro.data;
    const payload = { ...rest, siret: pro_siret, experience_years: rest.experience_years ?? null };
    const { data: existing } = await supabase.from("pro_profiles").select("profile_id").eq("profile_id", uid).maybeSingle();
    const { error } = existing
      ? await supabase.from("pro_profiles").update(payload).eq("profile_id", uid)
      : await supabase.from("pro_profiles").insert({ profile_id: uid, ...payload });
    if (error) return { status: "error", message: "Le profil professionnel n'a pas pu être enregistré.", values };
  }

  if (host?.success) {
    const { host_siret, ...rest } = host.data;
    const payload = { ...rest, siret: host_siret, vat_number: rest.vat_regime === "assujetti" ? rest.vat_number : null };
    const { data: existing } = await supabase.from("host_profiles").select("profile_id").eq("profile_id", uid).maybeSingle();
    const { error } = existing
      ? await supabase.from("host_profiles").update(payload).eq("profile_id", uid)
      : await supabase.from("host_profiles").insert({ profile_id: uid, ...payload });
    if (error) return { status: "error", message: "Le profil hôte n'a pas pu être enregistré.", values };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/documents");
}
