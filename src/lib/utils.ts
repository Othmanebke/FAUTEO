import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combine des classes Tailwind sans conflit. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
const euroRound = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

/** Montant en centimes → « 60 € » ou « 64,80 € » (décimales seulement si nécessaires). */
export function formatCents(cents: number): string {
  return cents % 100 === 0 ? euroRound.format(cents / 100) : euro.format(cents / 100);
}
