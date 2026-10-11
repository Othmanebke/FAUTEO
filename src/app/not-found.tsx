import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { Logo } from "@/components/shared/Logo";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div className="space-y-2">
        <p className="text-sm font-bold uppercase tracking-wider text-primary-ink">Page introuvable</p>
        <h1 className="text-2xl font-bold tracking-tight text-ink">Ce lieu n&apos;existe pas, ou plus</h1>
        <p className="text-[15px] leading-relaxed text-ink-muted">L&apos;annonce a peut-être été retirée par son hôte.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/recherche" className={buttonClasses()}>
          Trouver un poste
        </Link>
        <Link href="/" className={buttonClasses({ variant: "secondary" })}>
          Accueil
        </Link>
      </div>
    </main>
  );
}
