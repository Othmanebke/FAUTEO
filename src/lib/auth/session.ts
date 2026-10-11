import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/types";

export interface Session {
  userId: string;
  email: string | null;
  profile: Profile;
}

/**
 * Session de la requête en cours (dédupliquée par React.cache).
 * getUser() valide le jeton auprès de Supabase Auth : c'est la source
 * fiable, contrairement à la seule lecture du cookie.
 */
export const getSession = cache(async (): Promise<Session | null> => {
  // Lecture liée à la requête : le client Auth consulte l'heure pour valider le jeton
  await connection();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile) return null;

  return { userId: user.id, email: user.email ?? null, profile };
});

/** Exige une session ; sinon redirige vers la connexion en conservant la destination. */
export async function requireSession(next?: string): Promise<Session> {
  const session = await getSession();
  if (!session) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  return session;
}

export function hasRole(profile: Profile, role: AppRole) {
  return role === "pro" ? profile.is_pro : profile.is_host;
}

/** Exige un rôle métier ; un compte sans aucun rôle repart dans l'onboarding. */
export async function requireRole(role: AppRole): Promise<Session> {
  const session = await requireSession(role === "pro" ? "/pro" : "/host");
  if (!session.profile.is_pro && !session.profile.is_host) redirect("/onboarding");
  if (!hasRole(session.profile, role)) redirect(`/onboarding/profil?roles=${role}`);
  return session;
}

/** Espace d'arrivée selon le rôle actif. */
export function homeFor(profile: Profile): string {
  if (profile.is_admin) return "/admin";
  if (!profile.is_pro && !profile.is_host) return "/onboarding";
  const role = profile.active_role ?? (profile.is_pro ? "pro" : "host");
  return role === "host" ? "/host" : "/pro";
}

/** Destination de redirection sûre : chemins internes uniquement. */
export function safeNext(next: unknown, fallback = "/"): string {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

/**
 * Exige un administrateur authentifié en double facteur (aal2), comme
 * la fonction SQL is_admin(). Sans aal2, renvoie vers la page sécurité.
 */
export async function requireAdmin(): Promise<Session> {
  const session = await requireSession("/admin");
  if (!session.profile.is_admin) redirect(homeFor(session.profile));

  const supabase = await createClient();
  const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (data?.currentLevel !== "aal2") {
    redirect(data?.nextLevel === "aal2" ? "/login/verification?next=/admin" : "/account/securite?raison=admin");
  }
  return session;
}
