"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/login", label: "Connexion" },
  { href: "/signup", label: "Créer un compte" },
];

/** Sélecteur segmenté Connexion / Créer un compte (liens vers les deux pages). */
export function AuthTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Connexion ou inscription" className="flex rounded-full bg-canvas-alt p-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-9 items-center whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors",
              active ? "bg-surface text-ink shadow-card" : "text-ink-muted hover:text-ink"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
