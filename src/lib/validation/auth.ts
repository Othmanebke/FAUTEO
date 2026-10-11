import { z } from "zod";

export const emailSchema = z.email("Adresse e-mail invalide.").trim().toLowerCase();

export const passwordSchema = z
  .string()
  .min(10, "10 caractères minimum.")
  .regex(/[A-Za-z]/, "Au moins une lettre.")
  .regex(/[0-9]/, "Au moins un chiffre.");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Mot de passe requis."),
});

export const signUpSchema = z.object({
  first_name: z.string().trim().min(1, "Prénom requis.").max(80),
  last_name: z.string().trim().min(1, "Nom requis.").max(80),
  email: emailSchema,
  password: passwordSchema,
  terms: z.literal("on", { error: "Vous devez accepter les conditions générales." }),
});

export const forgotPasswordSchema = z.object({ email: emailSchema });

export const resetPasswordSchema = z
  .object({ password: passwordSchema, confirm: z.string() })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "Les mots de passe ne correspondent pas." });
