import { Suspense } from "react";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";
import { NavbarClient, type NavbarVariant, type NavUser } from "./NavbarClient";

/** Partie de l'en-tête qui dépend de la session, rendue à la requête. */
async function NavbarSession({ variant }: { variant: NavbarVariant }) {
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
  return <NavbarClient user={user} variant={variant} />;
}

/**
 * En-tête du site. La structure est statique, la zone compte arrive en streaming.
 * - floating : pilule blanche flottante posée sur le hero (accueil) ;
 * - bar      : barre classique translucide avec bordure basse (autres pages).
 */
export function Navbar({ variant = "bar", hideOnMobile = false }: { variant?: NavbarVariant; hideOnMobile?: boolean }) {
  const floating = variant === "floating";

  return (
    <header className={cn("sticky top-0 z-40", floating ? "h-0" : "border-b border-line/80 bg-canvas/88 backdrop-blur-[12px]", hideOnMobile && "hidden md:block")}>
      <div
        className={cn(
          "flex items-center justify-between",
          floating
            ? "relative top-3 mx-auto box-border h-[68px] w-[calc(100%-24px)] max-w-[1040px] gap-5 rounded-full border border-white/70 bg-white/90 pl-[22px] pr-2.5 shadow-[0_10px_30px_rgb(37_42_49/8%)] backdrop-blur-[14px] sm:top-5 sm:w-[calc(100%-48px)]"
            : "relative mx-auto h-16 max-w-[1280px] gap-6 px-4 sm:px-8 lg:h-[76px]"
        )}
      >
        <Link href="/" aria-label="Fauteo" className="shrink-0 rounded-lg">
          <Logo size={28} textSize={21} className="hidden lg:inline-flex" />
          <Logo size={26} className="lg:hidden" />
        </Link>
        <Suspense fallback={<div className="h-10 w-44" aria-hidden />}>
          <NavbarSession variant={variant} />
        </Suspense>
      </div>
    </header>
  );
}
