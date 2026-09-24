import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { InteractionCard } from "@/components/InteractionCard";
import { setDose } from "@/lib/meds.functions";
import { checkInteractions } from "@/lib/interactions";
import { adherence, fullName, nextSlot, relativeLabel, slotsForDay } from "@/lib/schedule";
import { usePlan } from "@/lib/use-plan";

export const Route = createFileRoute("/_authenticated/hoy")({
  head: () => ({
    meta: [
      { title: "Hoy · MedScan AI" },
      { name: "description", content: "Tu próxima dosis, las tomas de hoy y las alertas de compatibilidad." },
      { property: "og:title", content: "Hoy · MedScan AI" },
      { property: "og:description", content: "Próxima dosis y tomas del día en una sola pantalla." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Today,
});

function Today() {
  const { loading, error, profile, medications, logs, day, reload } = usePlan();
  const [busy, setBusy] = useState("");
  const now = new Date();

  const slots = useMemo(() => slotsForDay(medications, logs, day), [medications, logs, day]);
  const next = nextSlot(slots, now);
  const alerts = useMemo(() => checkInteractions(medications), [medications]);
  const firstName = (profile?.full_name ?? "").split(" ")[0] || "¿Cómo va?";
  const initials = (profile?.full_name ?? "MS")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const mark = async (medicationId: string, time: string, taken: boolean) => {
    setBusy(`${medicationId}|${time}`);
    try {
      await setDose({ data: { medicationId, day, time, taken } });
      await reload();
    } finally {
      setBusy("");
    }
  };

  const dateLabel = now.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <AppShell>
      <ScreenHeader eyebrow={dateLabel} title={`Hola, ${firstName}`} badge={initials} />

      {loading ? <p className="mt-6 font-mono text-[11px] text-glass/50">Cargando tu plan…</p> : null}
      {error ? <p className="mt-6 font-mono text-[11px] text-alert">{error}</p> : null}

      {!loading && medications.length === 0 ? (
        <section className="mt-6 rounded-[22px] bg-white/10 p-5 ring-1 ring-white/15">
          <p className="font-display text-lg font-bold text-glass">Todavía no cargaste medicamentos</p>
          <p className="mt-2 font-body text-sm text-glass/70">
            Escaneá la caja con la cámara o cargalos a mano con su dosis y horarios.
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              to="/escaner"
              className="flex-1 rounded-xl bg-mint py-3 text-center font-display text-sm font-semibold text-ink"
            >
              Escanear
            </Link>
            <Link
              to="/medicamentos"
              className="rounded-xl px-4 py-3 font-mono text-xs text-glass/70 ring-1 ring-white/20"
            >
              Cargar a mano
            </Link>
          </div>
        </section>
      ) : null}

      {next ? (
        <section className="relative mt-5 animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_.08s_both] rounded-[22px] bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-mint/15 px-2.5 py-1 font-mono text-[10px] tracking-wider text-mint uppercase ring-1 ring-mint/30">
              Próxima dosis
            </span>
            <span className="font-mono text-xs text-glass/70">{relativeLabel(next.time, now)}</span>
          </div>
          <div className="mt-4">
            <h1 className="font-display text-2xl font-bold tracking-tight text-glass">{fullName(next.med)}</h1>
            <p className="mt-1 font-body text-sm text-glass/70">
              {next.med.dose} · {next.med.meal.toLowerCase()}
            </p>
          </div>
          <button
            onClick={() => void mark(next.med.id, next.time, true)}
            disabled={busy !== ""}
            className="mt-5 w-full rounded-xl bg-mint px-4 py-3 font-display text-sm font-semibold text-ink transition-colors hover:bg-white disabled:opacity-60"
          >
            Marcar como tomada
          </button>
        </section>
      ) : null}

      {!loading && medications.length > 0 && !next ? (
        <section className="mt-5 rounded-[22px] bg-mint/10 p-5 ring-1 ring-mint/25">
          <p className="font-display text-lg font-bold text-glass">Todo tomado por hoy</p>
          <p className="mt-1 font-mono text-[11px] text-glass/60">Adherencia de hoy: {adherence(slots)}%</p>
        </section>
      ) : null}

      {alerts.length > 0 ? (
        <div className="mt-5 flex flex-col gap-2.5">
          {alerts.slice(0, 2).map((a, i) => (
            <InteractionCard key={a.id} severity={a.severity} title={a.title} body={a.body} delay={0.1 + i * 0.06} />
          ))}
        </div>
      ) : null}

      {slots.length > 0 ? (
        <>
          <div className="mt-6 flex items-center justify-between">
            <h2 className="font-mono text-[11px] tracking-[0.2em] text-glass/50 uppercase">Tomas de hoy</h2>
            <span className="font-mono text-[11px] text-glass/60">
              {slots.filter((s) => s.taken).length}/{slots.length}
            </span>
          </div>

          <section className="mt-3 flex flex-col gap-2.5">
            {slots.map((slot, i) => (
              <div
                key={slot.key}
                className="flex animate-[settle_.5s_cubic-bezier(.32,.72,0,1)_both] items-center gap-3 rounded-2xl bg-white/8 p-3.5 ring-1 ring-white/10"
                style={{ animationDelay: `${0.2 + i * 0.05}s` }}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint/15 font-mono text-[11px] text-mint ring-1 ring-mint/40">
                  {slot.time.slice(0, 2)}
                </span>
                <Link to="/dosis" className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm font-semibold text-glass">{fullName(slot.med)}</p>
                  <p className="font-mono text-[11px] text-glass/55">
                    {slot.time} · {slot.med.dose}
                  </p>
                </Link>
                <button
                  aria-label={slot.taken ? `Marcar ${fullName(slot.med)} como pendiente` : `Marcar ${fullName(slot.med)} como tomada`}
                  onClick={() => void mark(slot.med.id, slot.time, !slot.taken)}
                  disabled={busy === `${slot.med.id}|${slot.time}`}
                  className={`grid size-7 shrink-0 place-items-center rounded-full font-mono text-[11px] transition-colors ${
                    slot.taken ? "bg-mint text-ink" : "bg-transparent text-glass/50 ring-1 ring-white/25"
                  }`}
                >
                  {slot.taken ? "✓" : ""}
                </button>
              </div>
            ))}
          </section>
        </>
      ) : null}
    </AppShell>
  );
}
