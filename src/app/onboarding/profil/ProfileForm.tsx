"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveOnboardingProfile } from "../actions";
import { initialFormState } from "@/lib/validation/form-state";
import { TRADE_LABELS } from "@/lib/labels";
import { Input } from "@/components/ui/Input";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import type { AppRole, Trade } from "@/types";

const TRADES = Object.entries(TRADE_LABELS) as [Trade, string][];

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <Card className="space-y-5 sm:p-8">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        {description && <p className="text-sm leading-relaxed text-ink-muted">{description}</p>}
      </div>
      {children}
    </Card>
  );
}

export function ProfileForm({ roles, defaults }: { roles: AppRole[]; defaults: Record<string, string> }) {
  const [state, action, pending] = useActionState(saveOnboardingProfile, initialFormState);
  const v = state.values ?? defaults;
  const e = state.fieldErrors ?? {};
  const [vatRegime, setVatRegime] = useState(v.vat_regime || "franchise");
  const selectedTrades = (v.trades ?? "").split(",").filter(Boolean);

  return (
    <form action={action} className="mt-8 space-y-6" noValidate>
      {roles.map((role) => (
        <input key={role} type="hidden" name="roles" value={role} />
      ))}
      {state.message && <Alert tone="danger">{state.message}</Alert>}

      <Section title="Vous">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input name="first_name" label="Prénom" autoComplete="given-name" defaultValue={v.first_name} error={e.first_name} required />
          <Input name="last_name" label="Nom" autoComplete="family-name" defaultValue={v.last_name} error={e.last_name} required />
        </div>
        <Input name="city" label="Ville" autoComplete="address-level2" defaultValue={v.city} error={e.city} required />
      </Section>

      {roles.includes("pro") && (
        <Section title="Votre activité" description="Visible par les hôtes lorsque vous leur envoyez une demande.">
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-ink">Métiers</legend>
            <div className="flex flex-wrap gap-2">
              {TRADES.map(([value, label]) => (
                <label key={value} className="cursor-pointer">
                  <input type="checkbox" name="trades" value={value} defaultChecked={selectedTrades.includes(value)} className="peer sr-only" />
                  <span
                    className={cn(
                      "inline-flex rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink transition-colors",
                      "hover:border-line-strong peer-checked:border-primary peer-checked:bg-primary-subtle peer-checked:text-primary-ink",
                      "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-ink"
                    )}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
            {e.trades && <p className="text-sm text-danger" role="alert">{e.trades}</p>}
            <p className="text-sm text-ink-muted">Le tatouage demande en plus une attestation de formation hygiène et la déclaration ARS.</p>
          </fieldset>
          <Input name="specialties" label="Spécialités" optional hint="Séparées par des virgules : dégradé, coloration, nail art…" defaultValue={v.specialties} error={e.specialties} />
          <div className="grid gap-5 sm:grid-cols-2">
            <Input name="pro_siret" label="SIRET" inputMode="numeric" autoComplete="off" defaultValue={v.pro_siret} error={e.pro_siret} required />
            <Input name="experience_years" label="Années d'expérience" type="number" min={0} max={70} optional defaultValue={v.experience_years} error={e.experience_years} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input name="company_name" label="Nom commercial" optional defaultValue={v.company_name} error={e.company_name} />
            <Input name="instagram_url" label="Instagram" optional placeholder="@votrecompte" defaultValue={v.instagram_url} error={e.instagram_url} />
          </div>
        </Section>
      )}

      {roles.includes("host") && (
        <Section
          title="Votre établissement"
          description="Informations légales utilisées pour les factures émises en votre nom et pour vos versements."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Input name="legal_name" label="Raison sociale ou nom commercial" defaultValue={v.legal_name} error={e.legal_name} required />
            <Input name="host_siret" label="SIRET de l'établissement" inputMode="numeric" autoComplete="off" defaultValue={v.host_siret} error={e.host_siret} required />
          </div>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-ink">Régime de TVA</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "franchise", label: "Franchise en base", hint: "Pas de TVA facturée (art. 293 B du CGI)" },
                { value: "assujetti", label: "Assujetti à la TVA", hint: "TVA à 20 % sur les locations" },
              ].map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer gap-3 rounded-2xl border border-line bg-surface p-4 has-[:checked]:border-primary has-[:checked]:bg-primary-subtle/40"
                >
                  <input
                    type="radio"
                    name="vat_regime"
                    value={option.value}
                    checked={vatRegime === option.value}
                    onChange={() => setVatRegime(option.value)}
                    className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{option.label}</span>
                    <span className="block text-sm text-ink-muted">{option.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            {e.vat_regime && <p className="text-sm text-danger" role="alert">{e.vat_regime}</p>}
          </fieldset>
          {vatRegime === "assujetti" && (
            <Input name="vat_number" label="Numéro de TVA intracommunautaire" placeholder="FR12345678901" defaultValue={v.vat_number} error={e.vat_number} required />
          )}

          <Input name="billing_address" label="Adresse de facturation" autoComplete="street-address" defaultValue={v.billing_address} error={e.billing_address} required />
          <div className="grid gap-5 sm:grid-cols-[1fr_2fr]">
            <Input name="billing_postal_code" label="Code postal" inputMode="numeric" autoComplete="postal-code" defaultValue={v.billing_postal_code} error={e.billing_postal_code} required />
            <Input name="billing_city" label="Ville" autoComplete="address-level2" defaultValue={v.billing_city} error={e.billing_city} required />
          </div>

          <div className="rounded-2xl bg-canvas-alt p-4 text-sm leading-relaxed text-ink-muted">
            La loi impose aux plateformes de déclarer chaque année les revenus de leurs utilisateurs à l&apos;administration fiscale.
            Ces deux informations servent uniquement à cette déclaration et ne sont jamais affichées.
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input name="birth_date" label="Date de naissance" type="date" autoComplete="bday" defaultValue={v.birth_date} error={e.birth_date} required />
            <Input name="tax_id" label="Numéro fiscal" inputMode="numeric" hint="13 chiffres, en haut de votre avis d'imposition." defaultValue={v.tax_id} error={e.tax_id} required />
          </div>
        </Section>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Link href="/onboarding" className={buttonClasses({ variant: "ghost" })}>
          Retour
        </Link>
        <Button type="submit" size="lg" isLoading={pending}>
          Enregistrer et continuer
        </Button>
      </div>
    </form>
  );
}
