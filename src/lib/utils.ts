import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to combine Tailwind CSS classes safely with clsx and twMerge.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a currency amount in EUR cleanly without superfluous decimals if integer.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculates marketplace commission breakdown
 * Host payout = price - host_fee (e.g. 10%)
 * Guest total = price + service_fee (e.g. 5%)
 */
export function calculateBookingBreakdown(basePrice: number, depositAmount: number = 250) {
  const serviceFeeRate = 0.05; // 5% guest fee
  const hostFeeRate = 0.08; // 8% host fee

  const guestServiceFee = Math.round(basePrice * serviceFeeRate * 100) / 100;
  const totalChargedNow = basePrice + guestServiceFee;
  const hostCommission = Math.round(basePrice * hostFeeRate * 100) / 100;
  const hostPayout = basePrice - hostCommission;

  return {
    basePrice,
    guestServiceFee,
    totalChargedNow,
    depositAmount,
    hostCommission,
    hostPayout,
  };
}
