import React, { useId } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-2xl border border-line bg-surface px-4 text-[15px] text-ink placeholder:text-[#9a9fa5] " +
  "transition-[border-color,box-shadow] duration-150 " +
  "hover:border-line-strong focus:border-primary focus:outline-none focus:ring-4 focus:ring-[var(--ring)] " +
  "disabled:cursor-not-allowed disabled:bg-canvas-alt aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/20";

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

/** Libellé + aide + erreur, reliés au champ pour les lecteurs d'écran. */
function Field({
  id,
  label,
  hint,
  error,
  optional,
  children,
}: FieldProps & { id: string; children: React.ReactNode }) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={id} className="flex items-baseline justify-between text-sm font-semibold text-ink">
          {label}
          {optional && <span className="text-xs font-normal text-ink-muted">Facultatif</span>}
        </label>
      )}
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-sm text-ink-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, FieldProps {
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, optional, leftIcon, rightSlot, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
      <Field id={inputId} label={label} hint={hint} error={error} optional={optional}>
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-4 text-ink-muted" aria-hidden>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(inputId, error, hint)}
            className={cn(control, "h-[52px]", leftIcon && "pl-[46px]", rightSlot && "pr-[52px]", className)}
            {...props}
          />
          {rightSlot && <span className="absolute right-2 flex items-center">{rightSlot}</span>}
        </div>
      </Field>
    );
  }
);
Input.displayName = "Input";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>, FieldProps {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, hint, error, optional, id, children, ...props }, ref) => {
    const autoId = useId();
    const selectId = id ?? autoId;
    return (
      <Field id={selectId} label={label} hint={hint} error={error} optional={optional}>
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(selectId, error, hint)}
          className={cn(control, "h-[52px] appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10",
            "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23697078' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")]",
            className)}
          {...props}
        >
          {children}
        </select>
      </Field>
    );
  }
);
Select.displayName = "Select";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement>, FieldProps {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, error, optional, id, ...props }, ref) => {
    const autoId = useId();
    const areaId = id ?? autoId;
    return (
      <Field id={areaId} label={label} hint={hint} error={error} optional={optional}>
        <textarea
          ref={ref}
          id={areaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(areaId, error, hint)}
          className={cn(control, "min-h-28 py-3 leading-relaxed", className)}
          {...props}
        />
      </Field>
    );
  }
);
Textarea.displayName = "Textarea";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  error?: string;
}

export function Checkbox({ label, error, id, className, ...props }: CheckboxProps) {
  const autoId = useId();
  const boxId = id ?? autoId;
  return (
    <div className={cn("space-y-1", className)}>
      <label htmlFor={boxId} className="flex cursor-pointer items-start gap-3 text-sm text-ink">
        <input
          id={boxId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md border-line-strong accent-[var(--primary)]"
          {...props}
        />
        <span className="leading-snug">{label}</span>
      </label>
      {error && (
        <p className="pl-8 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
