"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Saisie d'un code à 6 chiffres en 6 cases : avance automatique, retour
 * arrière, collage d'un code complet. La valeur est contrôlée par le parent.
 */
export function OtpInput({
  value,
  onChange,
  length = 6,
  label = "Code de vérification",
  autoFocus = false,
  invalid = false,
}: {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  label?: string;
  autoFocus?: boolean;
  invalid?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? "");

  function setAt(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").replace(/\s/g, "").slice(0, length));
  }

  function onInput(index: number, raw: string) {
    const clean = raw.replace(/\D/g, "");
    if (clean.length > 1) {
      // Collage (ou remplissage automatique) d'un code complet
      onChange(clean.slice(0, length));
      refs.current[Math.min(clean.length, length) - 1]?.focus();
      return;
    }
    setAt(index, clean);
    if (clean && index < length - 1) refs.current[index + 1]?.focus();
  }

  function onKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      setAt(index - 1, "");
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-semibold text-ink">{label}</legend>
      <div className="flex justify-between gap-2 sm:gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            autoFocus={autoFocus && i === 0}
            maxLength={i === 0 ? length : 1}
            aria-label={`Chiffre ${i + 1} sur ${length}`}
            aria-invalid={invalid || undefined}
            value={digit}
            onChange={(e) => onInput(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            className={cn(
              "h-14 w-full min-w-0 rounded-2xl border bg-surface text-center text-[22px] font-bold tabular-nums text-ink transition-[border-color,box-shadow] focus:border-primary focus:outline-none focus:ring-4 focus:ring-[var(--ring)] sm:h-16",
              invalid ? "border-danger" : digit ? "border-line-strong" : "border-line"
            )}
          />
        ))}
      </div>
    </fieldset>
  );
}
