import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = ["Vos rôles", "Votre profil", "Vos documents"];

/** Progression de l'onboarding (étape courante : 1 à 3) : pastilles reliées + barre d'avancement. */
export function Steps({ current }: { current: 1 | 2 | 3 }) {
  const progress = ((current - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="mb-10">
      <ol className="flex items-center gap-2" aria-label="Progression">
        {STEPS.map((label, index) => {
          const step = index + 1;
          const done = step < current;
          const active = step === current;
          return (
            <li key={label} className="flex flex-1 items-center gap-2 last:flex-none" aria-current={active ? "step" : undefined}>
              <span
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border pl-1.5 pr-3.5 text-sm font-semibold transition-colors sm:pr-4",
                  done && "border-success/25 bg-success-subtle text-success",
                  active && "border-primary bg-primary-subtle text-primary-ink",
                  !done && !active && "border-line bg-surface text-ink-muted"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-bold",
                    done && "bg-success text-white",
                    active && "bg-primary text-on-primary",
                    !done && !active && "bg-canvas-alt text-ink-muted"
                  )}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : step}
                </span>
                <span className={cn(!active && "hidden sm:inline")}>{label}</span>
              </span>
              {step < STEPS.length && <span className={cn("h-0.5 flex-1 rounded-full", done ? "bg-success" : "bg-line")} aria-hidden />}
            </li>
          );
        })}
      </ol>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${Math.max(progress, 6)}%` }} />
      </div>
      <p className="mt-2 text-[13px] font-semibold text-ink-muted">Étape {current} sur {STEPS.length}</p>
    </div>
  );
}
