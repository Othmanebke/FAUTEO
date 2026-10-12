export function AuthHeading({ title, subtitle }: { title: string; subtitle?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-[28px] font-bold tracking-[-0.02em] text-ink sm:text-[36px]">{title}</h1>
      {subtitle && <p className="text-[15px] leading-[1.6] text-ink-muted">{subtitle}</p>}
    </div>
  );
}

/** Message d'erreur de formulaire (bloc rouge doux). */
export function FormError({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="rounded-[14px] bg-danger-subtle px-3.5 py-3 text-sm font-semibold text-danger">
      {children}
    </p>
  );
}
