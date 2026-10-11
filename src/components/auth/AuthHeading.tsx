export function AuthHeading({ title, subtitle }: { title: string; subtitle?: React.ReactNode }) {
  return (
    <div className="mb-8 space-y-2">
      <h1 className="text-3xl font-bold tracking-tight text-ink">{title}</h1>
      {subtitle && <p className="text-[15px] leading-relaxed text-ink-muted">{subtitle}</p>}
    </div>
  );
}
