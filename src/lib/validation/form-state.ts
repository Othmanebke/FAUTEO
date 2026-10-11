import type { z } from "zod";

/** État renvoyé par une Server Action de formulaire (useActionState). */
export interface FormState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Valeurs saisies, réaffichées après une erreur (jamais les mots de passe). */
  values?: Record<string, string>;
}

export const initialFormState: FormState = { status: "idle" };

/** Première erreur de chaque champ, au format attendu par les composants de formulaire. */
export function fieldErrorsOf(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}

export function formValues(formData: FormData, omit: string[] = []): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !omit.includes(key)) values[key] = value;
  }
  return values;
}
