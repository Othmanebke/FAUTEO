import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Download, FileCheck2, ShieldCheck, UserRound } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { PageHeader } from "@/components/dashboard/EmptyState";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const metadata: Metadata = { title: "Mon compte" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AccountPage({ searchParams }: { searchParams: SearchParams }) {
  const { profile, email } = await requireSession("/account");
  const params = await searchParams;
  const roles = [profile.is_pro && "pro", profile.is_host && "host"].filter(Boolean) as string[];

  const links = [
    {
      href: `/onboarding/profil?roles=${roles.join(",") || "pro"}`,
      icon: UserRound,
      title: "Informations du profil",
      text: "Identité, activité, établissement et informations légales.",
    },
    ...(roles.length < 2
      ? [
          {
            href: "/onboarding/profil?roles=pro,host",
            icon: UserRound,
            title: profile.is_pro ? "Proposer aussi des postes" : "Louer aussi des postes",
            text: "Ajoutez le second rôle à votre compte.",
          },
        ]
      : []),
    { href: "/account/documents", icon: FileCheck2, title: "Mes documents", text: "Justificatifs et état de vérification." },
    { href: "/account/securite", icon: ShieldCheck, title: "Sécurité", text: "Double authentification." },
  ];

  return (
    <>
      <PageHeader title="Mon compte" subtitle={email ?? undefined} />
      {params.motdepasse && (
        <Alert tone="success" className="mb-6">
          Votre mot de passe a été mis à jour.
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
        <div className="space-y-4">
          <Card className="flex flex-wrap items-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-subtle text-2xl font-bold text-primary-ink">
              {(profile.first_name || email || "?").charAt(0).toUpperCase()}
            </span>
            <div className="mr-auto">
              <p className="text-[20px] font-bold text-ink">
                {profile.first_name} {profile.last_name}
              </p>
              <p className="text-sm text-ink-muted">{profile.city}</p>
            </div>
            {profile.is_pro && <Badge variant="brand">Pro</Badge>}
            {profile.is_host && <Badge variant="brand">Hôte</Badge>}
          </Card>

          <nav aria-label="Rubriques du compte" className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-card">
            {links.map(({ href, icon: Icon, title, text }) => (
              <Link key={href + title} href={href} className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-b-0 hover:bg-canvas">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-canvas-alt text-ink">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-ink">{title}</span>
                  <span className="block text-sm text-ink-muted">{text}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-ink-muted" aria-hidden />
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="mb-4 text-[22px] font-bold text-ink">Mot de passe</h2>
            <ChangePasswordForm />
          </Card>
          <Card className="space-y-3">
            <h2 className="text-[22px] font-bold text-ink">Vos données</h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              Téléchargez une copie des données personnelles associées à votre compte (RGPD).
            </p>
            <a href="/account/export" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-ink hover:underline">
              <Download className="h-4 w-4" aria-hidden /> Exporter mes données
            </a>
          </Card>
        </div>
      </div>
    </>
  );
}
