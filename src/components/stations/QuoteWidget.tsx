"use client";

import { useEffect, useId, useState } from "react";
import { CalendarCheck, CalendarDays, CircleCheck, Clock, Info, Minus, Plus, ShieldCheck, XCircle, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PRICE_UNIT_LABELS } from "@/lib/labels";
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

const MAX_QTY: Record<PriceUnit, number> = { hour: 11, half_day: 1, day: 14, week: 12, month: 12 };

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

const fieldBox =
  "relative flex h-12 items-center rounded-[14px] border border-line bg-surface transition-[border-color,box-shadow] focus-within:border-primary focus-within:ring-4 focus-within:ring-[var(--ring)]";

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
  const ids = useId();
  const offered = prices.map(([u]) => u);
  const [unit, setUnit] = useState<PriceUnit>(initial.unit && offered.includes(initial.unit) ? initial.unit : offered[0]);
  const [date, setDate] = useState(initial.date ?? "");
  const [time, setTime] = useState(initial.time ?? "09:00");
  const [quantity, setQuantity] = useState(initial.quantity ?? 1);
  const [state, setState] = useState<State>({ status: "idle" });
  const needsTime = unit === "hour" || unit === "half_day";
  const qty = unit === "half_day" ? 1 : Math.min(quantity, MAX_QTY[unit]);

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
  const qtyLabel = `${qty} ${QTY_LABEL[unit][qty > 1 ? 1 : 0]}`;

  return (
    <div className="flex flex-col gap-5 rounded-[28px] border border-line bg-surface p-[26px] shadow-raised">
      <p className="text-ink">
        <span className="text-[32px] font-bold tabular-nums tracking-[-0.02em]">{formatCents(unitPrice)}</span>
        <span className="text-base text-ink-muted"> / {PRICE_UNIT_LABELS[unit].short}</span>
      </p>

      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Durée de location">
        {offered.map((u) => (
          <button
            key={u}
            type="button"
            role="radio"
            aria-checked={u === unit}
            onClick={() => setUnit(u)}
            className={cn(
              "h-9 rounded-full border px-3.5 text-sm font-semibold transition-colors",
              u === unit ? "border-primary bg-primary-subtle text-primary-ink" : "border-line bg-surface text-ink hover:border-line-strong"
            )}
          >
            {PRICE_UNIT_LABELS[u].long}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${ids}-date`} className="text-sm font-semibold text-ink">
            {needsTime ? "Date" : "Début"}
          </label>
          <div className={fieldBox}>
            <CalendarDays className="pointer-events-none absolute left-3 h-4 w-4 text-ink-muted" aria-hidden />
            <input
              id={`${ids}-date`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-full w-full rounded-[14px] bg-transparent pl-9 pr-2 text-[15px] text-ink focus:outline-none"
            />
          </div>
        </div>

        {unit !== "half_day" && (
          <div className="flex flex-col gap-1.5">
            <span id={`${ids}-qty`} className="text-sm font-semibold text-ink">
              Durée
            </span>
            <div className={cn(fieldBox, "justify-between px-1.5")} role="group" aria-labelledby={`${ids}-qty`}>
              <button
                type="button"
                aria-label="Moins"
                disabled={qty <= 1}
                onClick={() => setQuantity(Math.max(1, qty - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-canvas-alt text-ink transition-colors hover:bg-line disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-[15px] font-semibold text-ink" aria-live="polite">
                {qtyLabel}
              </span>
              <button
                type="button"
                aria-label="Plus"
                disabled={qty >= MAX_QTY[unit]}
                onClick={() => setQuantity(Math.min(MAX_QTY[unit], qty + 1))}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-canvas-alt text-ink transition-colors hover:bg-line disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {needsTime && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`${ids}-time`} className="text-sm font-semibold text-ink">
              Heure d&apos;arrivée
            </label>
            <div className={fieldBox}>
              <Clock className="pointer-events-none absolute left-3 h-4 w-4 text-ink-muted" aria-hidden />
              <input
                id={`${ids}-time`}
                type="time"
                step={1800}
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-full w-full rounded-[14px] bg-transparent pl-9 pr-2 text-[15px] text-ink focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      <div aria-live="polite" className="flex flex-col gap-3">
        {state.status === "idle" && <p className="text-sm text-ink-muted">Choisissez une date pour voir le prix total et la disponibilité.</p>}
        {state.status === "loading" && <p className="text-sm text-ink-muted">Calcul en cours…</p>}
        {state.status === "error" && <p className="text-sm text-danger">{state.message}</p>}
        {quote && state.status === "ready" && (
          <>
            {state.unavailable ? (
              <p className="flex items-center gap-2 text-sm font-semibold text-danger">
                <XCircle className="h-4 w-4" aria-hidden /> {state.unavailable}
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm font-semibold text-success">
                <CircleCheck className="h-4 w-4" aria-hidden /> Disponible
              </p>
            )}
            <dl className="flex flex-col text-[15px]">
              <div className="flex justify-between border-b border-line py-2.5">
                <dt className="text-ink-muted">Location · {qtyLabel}</dt>
                <dd className="tabular-nums text-ink">{formatCents(quote.subtotal_cents ?? 0)}</dd>
              </div>
              {(quote.surcharge_cents ?? 0) > 0 && (
                <div className="flex justify-between border-b border-line py-2.5 text-sm">
                  <dt className="pl-3 text-ink-muted">dont majoration week-end</dt>
                  <dd className="tabular-nums text-ink-muted">{formatCents(quote.surcharge_cents ?? 0)}</dd>
                </div>
              )}
              <div className="flex justify-between border-b border-line py-2.5">
                <dt className="text-ink-muted">Frais de service ({(proFeeBps / 100).toLocaleString("fr-FR")} %)</dt>
                <dd className="tabular-nums text-ink">{formatCents(quote.pro_fee_cents ?? 0)}</dd>
              </div>
              <div className="flex justify-between pt-3 text-[17px] font-bold text-ink">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatCents(quote.total_cents ?? 0)}</dd>
              </div>
            </dl>
          </>
        )}
      </div>

      {depositCents > 0 && (
        <p className="flex gap-2.5 rounded-2xl bg-canvas-alt p-3.5 text-sm leading-[1.5] text-ink">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
          <span>
            Caution de <b>{formatCents(depositCents)}</b> : empreinte bancaire, non débitée sauf incident constaté, libérée 48 h après la fin.
          </span>
        </p>
      )}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled
          aria-describedby={`${ids}-soon`}
          className="flex h-[54px] items-center justify-center gap-2 rounded-full bg-canvas-alt text-base font-semibold text-ink-muted"
        >
          {bookingMode === "instant" ? <Zap className="h-4 w-4" aria-hidden /> : <CalendarCheck className="h-4 w-4" aria-hidden />}
          {bookingMode === "instant" ? "Réserver" : "Envoyer une demande"}
        </button>
        <p id={`${ids}-soon`} className="flex items-center justify-center gap-1.5 text-center text-[13px] text-ink-muted">
          <Info className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Réservation et paiement en ligne : ouverture très prochainement
        </p>
      </div>
    </div>
  );
}
