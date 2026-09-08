import { createFileRoute } from "@tanstack/react-router";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { treatments, user } from "@/data/med";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Tu perfil de salud · MedScan AI" },
      {
        name: "description",
        content: "Datos personales, alergias declaradas y preferencias de recordatorio de tu plan de medicación.",
      },
      { property: "og:title", content: "Tu perfil de salud · MedScan AI" },
      { property: "og:description", content: "Alergias, recordatorios y resumen de adherencia al tratamiento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Profile,
});

const rows = [
  { label: "Alergias declaradas", value: "Penicilina" },
  { label: "Recordatorios", value: "Push · 10 min antes" },
  { label: "Farmacia de referencia", value: "Av. Rivadavia 1820" },
  { label: "Adherencia 30 días", value: "94%" },
];

function Profile() {
  const taken = treatments.filter((t) => t.taken).length;

  return (
    <AppShell>
      <ScreenHeader eyebrow="Cuenta" title="Perfil" badge={user.initials} />

      <section className="relative mt-5 animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_.08s_both] rounded-[22px] bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-md">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <p className="font-display text-2xl font-bold tracking-tight text-glass">{user.name} López</p>
        <p className="mt-1 font-mono text-[11px] text-glass/60">
          {treatments.length} tratamientos · {taken} al día
        </p>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-mint" style={{ width: "94%" }} />
        </div>
        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-mint uppercase">Adherencia 94%</p>
      </section>

      <section className="mt-5 flex flex-col gap-2.5">
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="flex animate-[settle_.5s_cubic-bezier(.32,.72,0,1)_both] items-center justify-between rounded-2xl bg-white/8 p-3.5 ring-1 ring-white/10"
            style={{ animationDelay: `${0.16 + i * 0.06}s` }}
          >
            <p className="font-mono text-[11px] tracking-wider text-glass/55 uppercase">{r.label}</p>
            <p className="font-body text-sm font-semibold text-glass">{r.value}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
