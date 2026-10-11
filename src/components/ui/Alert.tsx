import React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertTone = "info" | "success" | "warning" | "danger";

const tones: Record<AlertTone, { box: string; icon: React.ElementType }> = {
  info: { box: "border-line bg-canvas-alt text-ink", icon: Info },
  success: { box: "border-success/25 bg-success-subtle text-success", icon: CheckCircle2 },
  warning: { box: "border-warning/30 bg-warning-subtle text-warning-ink", icon: AlertTriangle },
  danger: { box: "border-danger/25 bg-danger-subtle text-danger", icon: XCircle },
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: AlertTone;
  title?: string;
}

export function Alert({ tone = "info", title, className, children, ...props }: AlertProps) {
  const { box, icon: Icon } = tones[tone];
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-2xl border px-4 py-3 text-sm", box, className)}
      {...props}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="space-y-0.5">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className="leading-relaxed [&_a]:font-semibold [&_a]:underline">{children}</div>}
      </div>
    </div>
  );
}
