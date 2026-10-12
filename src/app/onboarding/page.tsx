import type { Metadata } from "next";
import { Scissors, Store } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { Steps } from "@/components/onboarding/Steps";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Bienvenue" };

const ROLES = [
  {
    value: "pro",
    icon: Scissors,
    title: "Je cherche un poste",
    text: "Coiffeur, barber, esthéticienne, prothésiste ongulaire ou tatoueur indépendant : je loue un poste équipé à l'heure, à la journée, à la semaine ou au mois.",
  },
  {
    value: "host",
    icon: Store,
    title: "Je propose des postes",
    text: "Salon, barbershop, institut, onglerie ou shop de tatouage : je rentabilise mes fauteuils, cabines ou box inoccupés avec des pros vérifiés.",
  },
] as const;

/** Étape 1 : choix des rôles (cumulables, F-02). Formulaire GET, fonctionne sans JavaScript. */
export default async function OnboardingRolesPage() {
  const { profile } = await requireSession("/onboarding");
  const held = { pro: profile.is_pro, host: profile.is_host };

  return (
    <>
      <Steps current={1} />
      <h1 className="text-[32px] font-bold tracking-[-0.02em] text-ink sm:text-[40px]">
        Bienvenue{profile.first_name ? `, ${profile.first_name}` : ""}
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
        Comment allez-vous utiliser Fauteo ? Vous pouvez choisir les deux : vous passerez d&apos;un espace à l&apos;autre en un clic.
      </p>

      <form action="/onboarding/profil" method="get" className="mt-8 space-y-6">
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="sr-only">Vos rôles</legend>
          {ROLES.map(({ value, icon: Icon, title, text }) => (
            <label
              key={value}
              className="group relative flex cursor-pointer flex-col rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-card transition-[border-color,box-shadow] hover:border-line-strong has-[:checked]:border-primary has-[:checked]:shadow-[0_0_0_3px_var(--ring)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-ink"
            >
              <input
                type="checkbox"
                name="roles"
                value={value}
                defaultChecked={held[value] || (!held.pro && !held.host && value === "pro")}
                className="peer absolute right-5 top-5 h-5 w-5 accent-[var(--primary)]"
              />
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary-ink">
                <Icon className="h-6 w-6" aria-hidden />
              </span>
              <span className="mt-5 text-[20px] font-bold text-ink">{title}</span>
              <span className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</span>
              {held[value] && <span className="mt-4 text-xs font-semibold text-success">Profil déjà créé, vous pourrez le compléter</span>}
            </label>
          ))}
        </fieldset>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Continuer
          </Button>
        </div>
      </form>
    </>
  );
}
