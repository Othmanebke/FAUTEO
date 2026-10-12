import type { Metadata } from "next";
import { Check, Scissors, Store } from "lucide-react";
import { StationImage } from "@/components/stations/StationImage";
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
      <p className="mt-2 text-[17px] leading-relaxed text-ink-muted">
        Comment allez-vous utiliser Fauteo ? Vous pouvez choisir les deux : vous passerez d&apos;un espace à l&apos;autre en un clic.
      </p>

      <form action="/onboarding/profil" method="get" className="mt-8 space-y-6">
        <fieldset className="grid gap-5 sm:grid-cols-2">
          <legend className="sr-only">Vos rôles</legend>
          {ROLES.map(({ value, icon: Icon, title, text }) => (
            <label
              key={value}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-line bg-surface p-3 shadow-card transition-[border-color,box-shadow] hover:border-line-strong has-[:checked]:border-primary has-[:checked]:shadow-[0_0_0_3px_var(--ring)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary-ink"
            >
              <input
                type="checkbox"
                name="roles"
                value={value}
                defaultChecked={held[value] || (!held.pro && !held.host && value === "pro")}
                className="peer sr-only"
              />
              {/* Visuel (à remplacer par une photo d'ambiance) */}
              <StationImage src={null} alt="" type={value === "pro" ? "poste_barber" : "fauteuil_coiffure"} className="aspect-[16/9] rounded-[18px]" />
              <span
                aria-hidden
                className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-white/80 shadow-card backdrop-blur peer-checked:border-primary peer-checked:bg-primary [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
              >
                <Check className="h-4 w-4 text-on-primary" strokeWidth={3} />
              </span>
              <span className="flex flex-col p-3 pb-2 pt-5">
                <span className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-subtle text-primary-ink">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-[20px] font-bold text-ink">{title}</span>
                </span>
                <span className="mt-3 text-[15px] leading-relaxed text-ink-muted">{text}</span>
                {held[value] && <span className="mt-3 text-xs font-bold text-success">Profil déjà créé, vous pourrez le compléter</span>}
              </span>
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
