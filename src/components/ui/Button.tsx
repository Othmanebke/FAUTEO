import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none cursor-pointer";

const variants: Record<ButtonVariant, string> = {
  // Corail réservé à l'action principale ; texte encre pour le contraste AA
  primary:
    "bg-primary text-on-primary hover:bg-primary-hover shadow-[0_1px_2px_rgb(37_42_49/8%)] " +
    "disabled:not-aria-busy:bg-canvas-alt disabled:not-aria-busy:text-ink-muted disabled:not-aria-busy:shadow-none",
  secondary: "bg-surface text-ink border border-line hover:border-line-strong hover:bg-canvas-alt disabled:text-ink-muted",
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-canvas disabled:opacity-50",
  ghost: "text-ink hover:bg-canvas-alt disabled:opacity-50",
  danger: "bg-danger text-white hover:brightness-95 disabled:opacity-50",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

/** Classes d'un bouton, réutilisables sur un <Link> (évite d'imbriquer un bouton dans un lien). */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading = false, disabled, children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
);

Button.displayName = "Button";
