import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = "neutral" | "brand" | "success" | "warning" | "danger" | "outline";

const variants: Record<BadgeVariant, string> = {
  neutral: "bg-canvas-alt text-ink",
  brand: "bg-primary-subtle text-primary-ink",
  success: "bg-success-subtle text-success",
  warning: "bg-warning-subtle text-warning-ink",
  danger: "bg-danger-subtle text-danger",
  outline: "border border-line text-ink-muted",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-[5px] text-xs font-bold leading-none [&>svg]:h-3.5 [&>svg]:w-3.5",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
