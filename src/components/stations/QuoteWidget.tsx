"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, CheckCircle2, Info, ShieldCheck, XCircle, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PRICE_UNIT_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/Button";
import { cn, formatCents } from "@/lib/utils";
import type { BookingMode, BookingQuote, PriceUnit } from "@/types";

const UNAVAILABLE: Record<string, string> = {
  IN_THE_PAST: "Ce créneau est déjà passé.",
  BLOCKED: "L'hôte a bloqué cette période.",
  ALREADY_BOOKED: "Déjà réservé sur cette période.",
  OUTSIDE_OPENING_HOURS: "En dehors des horaires d'ouverture.",
  CLOSED_DAY: "Le poste est fermé l'un de ces jours.",
};

const QTY_LABEL: Record<PriceUnit, [string, string]> = {
  hour: ["heure", "heures"],
  half_day: ["demi-journée", "demi-journées"],
  day: ["jour", "jours"],
  week: ["semaine", "semaines"],
  month: ["mois", "mois"],
};

/** Début du créneau à l'heure de Paris, au format ISO avec décalage. */
function startIso(date: string, time: string) {
  const zone = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", timeZoneName: "longOffset" })
    .formatToParts(new Date(`${date}T12:00:00Z`))
    .find((p) => p.type === "timeZoneName")?.value;
  return `${date}T${time}:00${zone?.replace("GMT", "") || "+00:00"}`;
}

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; quote: BookingQuote; unavailable: string | null }
  | { status: "error"; message: string };

/**
 * Devis en direct (quote_booking) : le prix, les frais et la caution
 * viennent de la base, exactement comme au moment de réserver.
 */
export function QuoteWidget({
  stationId,
  prices,
  depositCents,
  bookingMode,
  proFeeBps,
  initial,
}: {
  stationId: string;
  prices: [PriceUnit, number][];
  depositCents: number;
  bookingMode: BookingMode;
  proFeeBps: number;
  initial: { unit?: PriceUnit; date?: string; time?: string; quantity?: number };
}) {
  const offered = prices.map(([u]) => u);
  const [unit, setUnit] = useState<PriceUnit>(initial.unit && offered.includes(initial.unit) ? initial.unit : offered[0]);
  const [date, setDate] = useState(initial.date ?? "");
  const [time, setTime] = useState(initial.time ?? "09:00");
  const [quantity, setQuantity] = useState(initial.quantity ?? 1);
  const [state, setState] = useState<State>({ status: "idle" });
  const needsTime = unit === "hour" || unit === "half_day";
  const qty = unit === "half_day" ? 1 : quantity;

  useEffect(() => {
    if (!date) return;
    let cancelled = false;
    const supabase = createClient();
    const start = startIso(date, needsTime ? time : "00:00");
    const run = async () => {
      setState({ status: "loading" });
      const { data: quote, error } = await supabase.rpc("quote_booking", {
        p_station: stationId,
        p_unit: unit,
        p_start: start,
        p_quantity: qty,
      });
      if (cancelled) return;
      if (error || !quote) return setState({ status: "error", message: "Impossible de calculer le prix pour ces dates." });
      const { data: refusal } = await supabase.rpc("station_unavailability", {
        p_station: stationId,
        p_unit: unit,
        p_period: quote.period as string,
      });
      if (!cancelled) setState({ status: "ready", quote, unavailable: refusal ? (UNAVAILABLE[refusal] ?? "Indisponible.") : null });
    };
    const timer = setTimeout(run, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [stationId, unit, date, time, qty, needsTime]);

  const unitPrice = prices.find(([u]) => u === unit)?.[1] ?? 0;
  const quote = state.status === "ready" ? state.quote : null;

  return (
    <div className="space-y-5 rounded-[var(--radius-card)] border border-line bg-surface p-6 shadow-raised">
      <p className="flex items-baseline gap-1 text-ink">
        <span className="text-3xl font-bold tabular-nums tracking-tight">{formatCents(unitPrice)}</span>
        <span className="text-ink-muted">/ {PRICE_UNIT_LABELS[unit].short}</span>
      </p>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Durée de location">
          {offered.map((u) => (
            <button
              key={u}
              type="button"
              role="radio"
              aria-checked={u === unit}
              onClick={() => setUnit(u)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
                u === unit ? "border-primary bg-primary-subtle text-primary-ink" : "border-line text-ink hover:border-line-strong"
              )}
            >
              {PRICE_UNIT_LABELS[u].long}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="col-span-2 space-y-1.5 text-sm font-semibold text-ink sm:col-span-1">
            {unit === "hour" || unit === "half_day" ? "Date" : "Début"}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 w-full rounded-xl border border-line bg-surface px-3 font-normal focus:border-primary focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
            />
          </label>
          {needsTime && (
            <label className="space-y-1.5 text-sm font-semibold text-ink">
              Heure d&apos;arrivée
              <input
                type="time"
                step={1800}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-12 w-full rounded-xl border border-line bg-surface px-3 font-normal focus:border-primary focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
              />
            </label>
          )}
          {unit !== "half_day" && (
            <label className="space-y-1.5 text-sm font-semibold text-ink">
              Durée
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="h-12 w-full appearance-none rounded-xl border border-line bg-surface px-3 font-normal focus:border-primary focus:outline-none focus:ring-4 focus:ring-[var(--ring)]"
              >
                {Array.from({ length: unit === "hour" ? 11 : unit === "month" ? 12 : unit === "week" ? 12 : 14 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {QTY_LABEL[unit][n > 1 ? 1 : 0]}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <div aria-live="polite" className="min-h-6">
        {state.status === "idle" && <p className="text-sm text-ink-muted">Choisissez une date pour voir le prix total et la disponibilité.</p>}
        {state.status === "loading" && <p className="text-sm text-ink-muted">Calcul en cours…</p>}
        {state.status === "error" && <p className="text-sm text-danger">{state.message}</p>}
        {quote && state.status === "ready" && (
          <div className="space-y-4">
            {state.unavailable ? (
              <p className="flex items-center gap-2 text-sm font-semibold text-danger">
                <XCircle className="h-4 w-4" aria-hidden /> {state.unavailable}
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm font-semibold text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden /> Disponible
              </p>
            )}
            <dl className="divide-y divide-line text-[15px]">
              <div className="flex justify-between py-2.5">
                <dt className="text-ink-muted">
                  Location · {qty} {QTY_LABEL[unit][qty > 1 ? 1 : 0]}
                </dt>
                <dd className="tabular-nums text-ink">{formatCents(quote.subtotal_cents ?? 0)}</dd>
              </div>
              {(quote.surcharge_cents ?? 0) > 0 && (
                <div className="flex justify-between py-2.5">
                  <dt className="pl-3 text-sm text-ink-muted">dont majoration week-end</dt>
                  <dd className="text-sm tabular-nums text-ink-muted">{formatCents(quote.surcharge_cents ?? 0)}</dd>
                </div>
              )}
              <div className="flex justify-between py-2.5">
                <dt className="text-ink-muted">Frais de service ({(proFeeBps / 100).toLocaleString("fr-FR")} %)</dt>
                <dd className="tabular-nums text-ink">{formatCents(quote.pro_fee_cents ?? 0)}</dd>
              </div>
              <div className="flex justify-between py-3 font-bold">
                <dt className="text-ink">Total</dt>
                <dd className="tabular-nums text-ink">{formatCents(quote.total_cents ?? 0)}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {depositCents > 0 && (
        <p className="flex gap-2 rounded-2xl bg-canvas-alt p-3 text-sm text-ink">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
          <span>
            Caution de <strong>{formatCents(depositCents)}</strong> : empreinte bancaire, non débitée sauf incident constaté, libérée 48 h après la fin.
          </span>
        </p>
      )}

      <div className="space-y-2">
        <Button size="lg" fullWidth disabled>
          {bookingMode === "instant" ? <Zap className="h-4 w-4" aria-hidden /> : <CalendarCheck className="h-4 w-4" aria-hidden />}
          {bookingMode === "instant" ? "Réserver" : "Envoyer une demande"}
        </Button>
        <p className="flex items-start gap-1.5 text-sm text-ink-muted">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          La réservation et le paiement en ligne ouvrent avec la prochaine mise à jour.
        </p>
      </div>
    </div>
  );
}
