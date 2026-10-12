"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeftRight, ChevronDown, FileCheck2, LayoutGrid, LogOut, Menu, Search, ShieldCheck, User, X } from "lucide-react";
import { buttonClasses } from "@/components/ui/Button";
import { signOut, switchActiveRole } from "@/app/actions/account";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/types";

export interface NavUser {
  firstName: string;
  email: string | null;
  isPro: boolean;
  isHost: boolean;
  isAdmin: boolean;
  activeRole: AppRole | null;
}

export type NavbarVariant = "floating" | "bar";

function publicLinks(variant: NavbarVariant) {
  return [
    { href: "/recherche", label: "Trouver un poste" },
    { href: "/#fonctionnement", label: "Comment ça marche" },
    { href: "/#hotes", label: "Proposer un poste" },
    { href: "/#confiance", label: variant === "floating" ? "Confiance" : "Confiance et sécurité" },
  ];
}

function spaceHref(user: NavUser) {
  if (user.isAdmin) return "/admin";
  if (!user.isPro && !user.isHost) return "/onboarding";
  return (user.activeRole ?? (user.isPro ? "pro" : "host")) === "host" ? "/host" : "/pro";
}

export function NavbarClient({ user, variant = "bar" }: { user: NavUser | null; variant?: NavbarVariant }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);
  const floating = variant === "floating";

  // Fermeture du menu compte au clic extérieur et à la touche Échap
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const bothRoles = Boolean(user?.isPro && user?.isHost);
  const currentRole: AppRole | null = user ? (user.activeRole ?? (user.isPro ? "pro" : user.isHost ? "host" : null)) : null;
  const otherRole: AppRole = currentRole === "host" ? "pro" : "host";

  const accountLinks = user
    ? [
        { href: spaceHref(user), label: "Mon espace", icon: LayoutGrid },
        { href: "/recherche", label: "Trouver un poste", icon: Search },
        { href: "/account/documents", label: "Mes documents", icon: FileCheck2 },
        { href: "/account", label: "Mon profil", icon: User },
        { href: "/account/securite", label: "Sécurité", icon: ShieldCheck },
      ]
    : [];

  const navLinks = user ? [{ href: "/recherche", label: "Trouver un poste" }] : publicLinks(variant);
  const isActive = (href: string) => !href.includes("#") && (pathname === href || pathname.startsWith(`${href}/`));

  // Lien de navigation : barre pilule (accueil) = texte encre ; barre classique = texte gris, actif sur fond
  const linkClass = (href: string) =>
    cn(
      "whitespace-nowrap rounded-full px-3.5 py-[9px] text-[15px] transition-colors hover:bg-canvas-alt",
      floating
        ? "font-medium text-ink"
        : isActive(href)
          ? "bg-canvas-alt font-semibold text-ink"
          : "font-medium text-ink-muted hover:text-ink"
    );

  return (
    <>
      {/* Navigation desktop */}
      <nav aria-label="Navigation principale" className={cn("hidden h-10 min-w-0 flex-1 flex-wrap justify-center overflow-hidden md:flex", floating ? "gap-0.5" : "gap-1")}>
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? "page" : undefined} className={linkClass(link.href)}>
            {link.label}
          </Link>
        ))}
        {user && bothRoles && (
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => switchActiveRole(otherRole))}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-line-strong disabled:opacity-60"
          >
            <ArrowLeftRight className="h-4 w-4 text-primary" aria-hidden />
            Passer en espace {otherRole === "host" ? "Hôte" : "Pro"}
          </button>
        )}
      </nav>

      <div className={cn("hidden shrink-0 items-center md:flex", floating ? "gap-1.5" : "gap-2")}>
        {user ? (
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-3 text-sm font-semibold text-ink transition-shadow hover:shadow-card"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-subtle text-sm font-bold text-primary-ink">
                {user.firstName.charAt(0).toUpperCase()}
              </span>
              <span className="max-w-32 truncate">{user.firstName}</span>
              {currentRole && (
                <span className="rounded-full bg-canvas-alt px-2 py-0.5 text-xs font-bold text-ink-muted">{currentRole === "host" ? "Hôte" : "Pro"}</span>
              )}
              <ChevronDown className={cn("h-4 w-4 text-ink-muted transition-transform", menuOpen && "rotate-180")} aria-hidden />
            </button>

            {menuOpen && (
              <div role="menu" className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-[20px] border border-line bg-surface p-1.5 shadow-raised">
                {user.email && <p className="truncate px-3 pb-2 pt-2 text-xs text-ink-muted">{user.email}</p>}
                {accountLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    role="menuitem"
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-canvas-alt"
                  >
                    <Icon className="h-4 w-4 text-ink-muted" aria-hidden />
                    {label}
                  </Link>
                ))}
                <div className="my-1 border-t border-line" />
                <form action={signOut}>
                  <button type="submit" role="menuitem" className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-canvas-alt">
                    <LogOut className="h-4 w-4 text-ink-muted" aria-hidden />
                    Se déconnecter
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              href={`/login${pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : ""}`}
              className={cn(
                "flex items-center whitespace-nowrap rounded-full font-semibold text-ink transition-colors hover:bg-canvas-alt",
                floating ? "h-[46px] px-4 text-[15px]" : "h-10 px-[18px] text-sm"
              )}
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className={cn(
                "flex items-center whitespace-nowrap rounded-full bg-primary font-semibold text-on-primary transition-colors hover:bg-primary-hover",
                floating ? "h-12 px-[22px] text-[15px]" : "h-10 px-5 text-sm"
              )}
            >
              Créer un compte
            </Link>
          </>
        )}
      </div>

      {/* Mobile */}
      <button
        type="button"
        onClick={() => setMobileOpen((open) => !open)}
        aria-expanded={mobileOpen}
        aria-controls="menu-mobile"
        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
        className="-mr-1 rounded-full p-2.5 text-ink hover:bg-canvas-alt md:hidden"
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {mobileOpen && (
        <div
          id="menu-mobile"
          className={cn(
            "absolute inset-x-0 top-full border-line bg-canvas px-4 pb-6 pt-2 shadow-raised md:hidden",
            floating ? "mt-2 rounded-[28px] border" : "border-b"
          )}
        >
          <nav aria-label="Navigation mobile" className="flex flex-col">
            {(user ? accountLinks : publicLinks(variant)).map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-canvas-alt">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
            {user ? (
              <>
                {bothRoles && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => startTransition(() => switchActiveRole(otherRole))}
                    className={buttonClasses({ variant: "secondary", fullWidth: true })}
                  >
                    <ArrowLeftRight className="h-4 w-4 text-primary" aria-hidden />
                    Passer en espace {otherRole === "host" ? "Hôte" : "Pro"}
                  </button>
                )}
                <form action={signOut}>
                  <button type="submit" className={buttonClasses({ variant: "ghost", fullWidth: true })}>
                    Se déconnecter
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className={buttonClasses({ fullWidth: true })}>
                  Créer un compte
                </Link>
                <Link href="/login" onClick={() => setMobileOpen(false)} className={buttonClasses({ variant: "secondary", fullWidth: true })}>
                  Connexion
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
