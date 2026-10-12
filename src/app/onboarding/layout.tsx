import { Suspense } from "react";
import Link from "next/link";
import { PageSkeleton } from "@/components/ui/Skeleton";
import { Logo } from "@/components/shared/Logo";
import { signOut } from "@/app/actions/account";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/88 backdrop-blur-[12px]">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6 lg:h-[76px]">
          <Link href="/" aria-label="Fauteo, accueil">
            <Logo />
          </Link>
          <form action={signOut}>
            <button type="submit" className="flex h-10 items-center rounded-full px-[18px] text-sm font-semibold text-ink-muted hover:bg-canvas-alt hover:text-ink">
              Se déconnecter
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
      </main>
    </div>
  );
}
