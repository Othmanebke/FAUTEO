import { Suspense } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { Logo } from "./Logo";
import { NavbarClient, type NavUser } from "./NavbarClient";

/** Partie de l'en-tête qui dépend de la session, rendue à la requête. */
async function NavbarSession() {
  const session = await getSession();
  const user: NavUser | null = session
    ? {
        firstName: session.profile.first_name || session.email?.split("@")[0] || "Mon compte",
        email: session.email,
        isPro: session.profile.is_pro,
        isHost: session.profile.is_host,
        isAdmin: session.profile.is_admin,
        activeRole: session.profile.active_role,
      }
    : null;
  return <NavbarClient user={user} />;
}

/** En-tête du site : la structure est statique, la zone compte arrive en streaming. */
export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:h-18 lg:px-8">
        <Link href="/" aria-label="Fauteo, accueil" className="rounded-lg">
          <Logo />
        </Link>
        <Suspense fallback={<div className="h-10 w-44" aria-hidden />}>
          <NavbarSession />
        </Suspense>
      </div>
    </header>
  );
}
