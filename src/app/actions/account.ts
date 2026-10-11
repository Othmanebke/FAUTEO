"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireSession } from "@/lib/auth/session";
import type { AppRole } from "@/types";

/** Bascule entre l'espace Pro et l'espace Hôte (F-02). */
export async function switchActiveRole(role: AppRole) {
  const session = await requireSession();
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ active_role: role }).eq("id", session.userId);
  if (error) throw new Error("Impossible de changer d'espace.");
  revalidatePath("/", "layout");
  redirect(role === "host" ? "/host" : "/pro");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
