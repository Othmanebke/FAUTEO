import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-lg select-none cursor-pointer";

    const variants = {
      primary:
        "bg-[#11141a] text-white hover:bg-[#202530] active:scale-[0.99] focus-visible:ring-gray-900 dark:bg-white dark:text-[#090a0d] dark:hover:bg-gray-100",
      secondary:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-[0.99] focus-visible:ring-gray-400 dark:bg-[#1a1f29] dark:text-gray-100 dark:hover:bg-[#252c3a]",
      outline:
        "border border-gray-200 bg-transparent text-gray-900 hover:bg-gray-50 active:scale-[0.99] focus-visible:ring-gray-300 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-[#151922]",
      ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
      gold:
        "bg-gradient-to-r from-[#b58e6d] to-[#9c7353] text-white hover:brightness-105 active:scale-[0.99] shadow-sm",
    };

    const sizes = {
      sm: "h-9 px-3 text-xs tracking-wide",
      md: "h-11 px-5 text-sm tracking-wide",
      lg: "h-13 px-7 text-base font-semibold tracking-wide",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Chargement...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
