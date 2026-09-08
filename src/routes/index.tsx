import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { InteractionCard } from "@/components/InteractionCard";
import { interactions, nextDose, treatments, user } from "@/data/med";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedScan AI · Tu medicación al día" },
      {
        name: "description",
        content:
          "MedScan AI organiza tus tratamientos: próxima dosis, alertas de interacción y guía de toma con las comidas.",
      },
      { property: "og:title", content: "MedScan AI · Tu medicación al día" },
      {
        property: "og:description",
        content: "Próxima dosis, tratamientos activos y alertas de interacción en una sola pantalla.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const [taken, setTaken] = useState<string[]>(treatments.filter((t) => t.taken).map((t) => t.id));
  const [doseTaken, setDoseTaken] = useState(false);

  const toggle = (id: string) =>
    setTaken((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const alert = interactions[0];

  return (
    <AppShell>
      <ScreenHeader eyebrow={user.today} title={`Hola, ${user.name}`} badge={user.initials} />

      <section className="relative mt-5 animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_.08s_both] rounded-[22px] bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-mint/15 px-2.5 py-1 font-mono text-[10px] tracking-wider text-mint uppercase ring-1 ring-mint/30">
            Próxima dosis
          </span>
          <span className="font-mono text-xs text-glass/70">{nextDose.at}</span>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-glass">{nextDose.name}</h1>
            <p className="mt-1 font-body text-sm text-glass/70">{nextDose.detail}</p>
          </div>
          <div className="flex gap-1.5 pt-1">
            {Array.from({ length: nextDose.pills }).map((_, i) => (
              <span key={i} className="size-4 rounded-full bg-glass/80 ring-1 ring-white/40" />
            ))}
          </div>
        </div>
        <button
          onClick={() => setDoseTaken((v) => !v)}
          className="group mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-mint px-4 py-3 font-display text-sm font-semibold text-ink transition-colors duration-200 hover:bg-white"
        >
          <span className="grid size-5 place-items-center rounded-full bg-ink text-mint transition-transform duration-200 group-hover:rotate-45">
            <span className="block h-2.5 w-0.5 bg-mint" />
          </span>
          {doseTaken ? "Dosis registrada" : "Marcar como tomada"}
        </button>
      </section>

      <div className="mt-5">
        {alert ? (
          <InteractionCard
            severity={alert.severity}
            title={alert.title}
            body={alert.body}
            action="Ver guía de interacción"
          />
        ) : null}
      </div>


      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-mono text-[11px] tracking-[0.2em] text-glass/50 uppercase">Tratamientos activos</h2>
        <span className="font-mono text-[11px] text-glass/60">{treatments.length} en curso</span>
      </div>

      <section className="mt-3 flex flex-col gap-2.5">
        {treatments.map((t, i) => {
          const isTaken = taken.includes(t.id);
          return (
            <div
              key={t.id}
              className="flex animate-[settle_.5s_cubic-bezier(.32,.72,0,1)_both] items-center gap-3 rounded-2xl bg-white/8 p-3.5 ring-1 ring-white/10"
              style={{ animationDelay: `${0.24 + i * 0.06}s` }}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full font-mono text-xs ring-1 ${
                  t.severity === "warn"
                    ? "bg-warn/15 text-warn ring-warn/40"
                    : "bg-mint/15 text-mint ring-mint/40"
                }`}
              >
                {t.hour}
              </span>
              <Link to="/dosis" className="min-w-0 flex-1">
                <p className="truncate font-body text-sm font-semibold text-glass">{t.name}</p>
                <p className="font-mono text-[11px] text-glass/55">{t.schedule}</p>
              </Link>
              <button
                aria-label={isTaken ? "Marcar como pendiente" : "Marcar como tomada"}
                onClick={() => toggle(t.id)}
                className={`grid size-7 shrink-0 place-items-center rounded-full transition-colors ${
                  isTaken ? "bg-mint text-ink" : "bg-transparent ring-1 ring-white/25"
                }`}
                style={isTaken ? { animation: "snap .6s cubic-bezier(.34,1.56,.64,1) both" } : undefined}
              >
                {isTaken ? (
                  <span
                    style={{
                      width: 0,
                      height: 0,
                      borderLeft: "4px solid transparent",
                      borderRight: "4px solid transparent",
                      borderBottom: "7px solid #032024",
                      transform: "translateY(-1px)",
                    }}
                  />
                ) : null}
              </button>
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}
