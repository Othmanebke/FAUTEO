import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Vos rôles", "Votre profil", "Vos documents"];

/** Indicateur de progression de l'onboarding (étape courante : 1 à 3). */
export function Steps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="mb-10 flex items-center gap-2 sm:gap-3" aria-label="Progression">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const done = step < current;
        const active = step === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3" aria-current={active ? "step" : undefined}>
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                done && "bg-success text-white",
                active && "bg-primary text-on-primary",
                !done && !active && "border border-line-strong bg-surface text-ink-muted"
              )}
            >
              {done ? <Check className="h-4 w-4" aria-hidden /> : step}
            </span>
            <span className={cn("hidden text-sm font-semibold sm:block", active ? "text-ink" : "text-ink-muted")}>{label}</span>
            {step < STEPS.length && <span className="h-px flex-1 bg-line" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
