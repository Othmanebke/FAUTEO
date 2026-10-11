import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { Steps } from "@/components/onboarding/Steps";
import type { AppRole } from "@/types";
import { ProfileForm } from "./ProfileForm";

export const metadata: Metadata = { title: "Votre profil" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function OnboardingProfilePage({ searchParams }: { searchParams: SearchParams }) {
  const { profile, userId } = await requireSession("/onboarding");
  const params = await searchParams;

  const requested = ([] as string[]).concat(params.roles ?? []).flatMap((r) => r.split(","));
  const roles = (["pro", "host"] as const).filter((r) => requested.includes(r)) as AppRole[];
  if (roles.length === 0) redirect("/onboarding");

  const supabase = await createClient();
  const [{ data: pro }, { data: host }] = await Promise.all([
    supabase.from("pro_profiles").select("*").eq("profile_id", userId).maybeSingle(),
    supabase.from("host_profiles").select("*").eq("profile_id", userId).maybeSingle(),
  ]);

  return (
    <>
      <Steps current={2} />
      <h1 className="text-3xl font-bold tracking-tight text-ink">Votre profil</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
        Ces informations figurent sur vos contrats et vos factures. Elles restent modifiables depuis votre compte.
      </p>
      <ProfileForm
        roles={roles}
        defaults={{
          first_name: profile.first_name,
          last_name: profile.last_name,
          city: profile.city ?? "",
          trades: pro?.trades.join(",") ?? "",
          specialties: pro?.specialties.join(", ") ?? "",
          experience_years: pro?.experience_years?.toString() ?? "",
          pro_siret: pro?.siret ?? "",
          company_name: pro?.company_name ?? "",
          instagram_url: pro?.instagram_url ?? "",
          legal_name: host?.legal_name ?? "",
          host_siret: host?.siret ?? "",
          vat_regime: host?.vat_regime ?? "",
          vat_number: host?.vat_number ?? "",
          billing_address: host?.billing_address ?? "",
          billing_postal_code: host?.billing_postal_code ?? "",
          billing_city: host?.billing_city ?? "",
          birth_date: host?.birth_date ?? "",
          tax_id: host?.tax_id ?? "",
        }}
      />
    </>
  );
}
