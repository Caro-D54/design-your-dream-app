import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { InteractionCard } from "@/components/InteractionCard";
import { interactions, treatments } from "@/data/med";

export const Route = createFileRoute("/dosis")({
  head: () => ({
    meta: [
      { title: "Dosis y guía de toma · MedScan AI" },
      {
        name: "description",
        content: "Horarios de cada dosis, guía de toma con las comidas y alertas de compatibilidad entre fármacos.",
      },
      { property: "og:title", content: "Dosis y guía de toma · MedScan AI" },
      {
        property: "og:description",
        content: "Cada tratamiento con su horario, su guía de comidas y sus advertencias.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Doses;
});

function Doses() {
  const [openId, setOpenId] = useState(treatments[0].id);

  return (
    <AppShell>
      <ScreenHeader eyebrow="Plan de hoy" title="Dosis" />

      <section className="mt-5 flex flex-col gap-2.5">
        {treatments.map((t, i) => {
          const open = openId === t.id;
          return (
            <article
              key={t.id}
              className="animate-[settle_.5s_cubic-bezier(.32,.72,0,1)_both] rounded-2xl bg-white/8 p-4 ring-1 ring-white/10"
              style={{ animationDelay: `${0.08 + i * 0.06}s` }}
            >
              <button onClick={() => setOpenId(open ? "" : t.id)} className="flex w-full items-center gap-3 text-left">
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-full font-mono text-xs ring-1 ${
                    t.severity === "warn" ? "bg-warn/15 text-warn ring-warn/40" : "bg-mint/15 text-mint ring-mint/40"
                  }`}
                >
                  {t.hour}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-body text-sm font-semibold text-glass">{t.name}</p>
                  <p className="font-mono text-[11px] text-glass/55">{t.schedule}</p>
                </div>
                <span className="font-mono text-[10px] tracking-wider text-glass/50 uppercase">{t.meal}</span>
              </button>

              {open ? (
                <div className="mt-4 animate-[settle_.35s_ease-out_both] rounded-xl bg-abyss/40 p-3.5 ring-1 ring-white/10">
                  <p className="font-mono text-[10px] tracking-[0.2em] text-mint uppercase">Guía de toma</p>
                  <ul className="mt-2 flex flex-col gap-2">
                    {t.guide.map((line) => (
                      <li key={line} className="flex gap-2 font-body text-xs leading-relaxed text-glass/75">
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-mint" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 font-mono text-[11px] text-glass/50">{t.condition}</p>
                </div>
              ) : null}
            </article>
          );
        })}
      </section>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-mono text-[11px] tracking-[0.2em] text-glass/50 uppercase">Compatibilidad</h2>
        <span className="font-mono text-[11px] text-glass/60">{interactions.length} avisos</span>
      </div>

      <div className="mt-3 flex flex-col gap-2.5">
        {interactions.map((it, i) => (
          <InteractionCard
            key={it.id}
            severity={it.severity}
            title={it.title}
            body={it.body}
            delay={0.1 + i * 0.06}
          />
        ))}
      </div>
    </AppShell>
  );
}
