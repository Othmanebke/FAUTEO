import { z } from "zod";
import { Constants } from "@/types/database.types";

/**
 * Contrôle de la clé d'un SIRET (algorithme de Luhn).
 * Exception : les établissements de La Poste (SIREN 356000000), dont la
 * somme des chiffres doit être un multiple de 5.
 */
export function isValidSiret(siret: string): boolean {
  if (!/^\d{14}$/.test(siret)) return false;
  if (siret.startsWith("356000000")) {
    return siret.split("").reduce((sum, d) => sum + Number(d), 0) % 5 === 0;
  }
  let sum = 0;
  for (let i = 0; i < 14; i++) {
    let digit = Number(siret[13 - i]);
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

const siretSchema = z
  .string()
  .transform((v) => v.replace(/\s/g, ""))
  .refine((v) => /^\d{14}$/.test(v), "Le SIRET comporte 14 chiffres.")
  .refine(isValidSiret, "Ce numéro SIRET n'est pas valide. Vérifiez la saisie.");

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || null)
    .nullable()
    .optional();

export const rolesSchema = z.array(z.enum(Constants.public.Enums.app_role)).min(1, "Choisissez au moins un rôle.");

export const identitySchema = z.object({
  first_name: z.string().trim().min(1, "Prénom requis.").max(80),
  last_name: z.string().trim().min(1, "Nom requis.").max(80),
  city: z.string().trim().min(2, "Ville requise.").max(120),
});

export const proProfileSchema = z.object({
  trades: z.array(z.enum(Constants.public.Enums.trade)).min(1, "Choisissez au moins un métier."),
  specialties: z
    .string()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 20)
    ),
  experience_years: z.coerce.number().int().min(0, "Valeur invalide.").max(70, "Valeur invalide.").nullable().optional(),
  pro_siret: siretSchema,
  company_name: optionalText(200),
  instagram_url: optionalText(200),
});

export const hostProfileSchema = z
  .object({
    legal_name: z.string().trim().min(1, "Raison sociale ou nom commercial requis.").max(200),
    host_siret: siretSchema,
    vat_regime: z.enum(Constants.public.Enums.vat_regime, { error: "Indiquez votre régime de TVA." }),
    vat_number: optionalText(20),
    billing_address: z.string().trim().min(3, "Adresse requise.").max(200),
    billing_postal_code: z.string().trim().regex(/^\d{5}$/, "Code postal à 5 chiffres."),
    billing_city: z.string().trim().min(2, "Ville requise.").max(120),
    birth_date: z.iso.date("Date invalide."),
    tax_id: z
      .string()
      .transform((v) => v.replace(/\s/g, ""))
      .refine((v) => /^\d{13}$/.test(v), "Le numéro fiscal comporte 13 chiffres."),
  })
  .refine((v) => v.vat_regime === "franchise" || Boolean(v.vat_number), {
    path: ["vat_number"],
    message: "Numéro de TVA requis pour un établissement assujetti.",
  });
