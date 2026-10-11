"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import type { FormState } from "@/lib/validation/form-state";

const reviewSchema = z
  .object({
    document_id: z.uuid(),
    decision: z.enum(["approve", "reject"]),
    reason: z.string().trim().max(500).optional(),
  })
  .refine((v) => v.decision === "approve" || (v.reason?.length ?? 0) >= 5, {
    path: ["reason"],
    message: "Précisez le motif du refus : il sera affiché à l'utilisateur.",
  });

/** Validation ou refus d'un justificatif (B-02), journalisé par la fonction SQL review_document. */
export async function reviewDocument(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = reviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", fieldErrors: { reason: parsed.error.issues[0]?.message ?? "Saisie invalide." } };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("review_document", {
    document_id: parsed.data.document_id,
    approve: parsed.data.decision === "approve",
    reason: parsed.data.decision === "reject" ? parsed.data.reason : undefined,
  });
  if (error) return { status: "error", message: "L'opération a échoué. Rechargez la page et réessayez." };

  revalidatePath("/admin");
  return { status: "success" };
}
