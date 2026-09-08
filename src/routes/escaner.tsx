import { createFileRoute } from "@tanstack/react-router";
import { AppShell, ScreenHeader } from "@/components/AppShell";
import { scanResult } from "@/data/med";
import cameraImg from "@/assets/scan-camera.jpg";

export const Route = createFileRoute("/escaner")({
  head: () => ({
    meta: [
      { title: "Escáner de medicamentos · MedScan AI" },
      {
        name: "description",
        content: "Apuntá la cámara al blíster y MedScan AI reconoce el medicamento y su dosis al instante.",
      },
      { property: "og:title", content: "Escáner de medicamentos · MedScan AI" },
      {
        property: "og:description",
        content: "Reconocimiento de medicamentos con la cámara y alta directa al tratamiento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Scanner,
});

function Scanner() {
  return (
    <AppShell>
      <ScreenHeader eyebrow="Cámara activa" title="Escáner" />

      <section className="relative mt-5 animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_.08s_both] overflow-hidden rounded-[22px] ring-1 ring-white/15">
        <img
          src={cameraImg}
          alt="Blíster de medicamento visto por la cámara"
          width={768}
          height={1024}
          className="h-[420px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-abyss/35" />

        <div className="absolute inset-0 grid place-items-center">
          <div className="relative size-52">
            <span className="absolute top-0 left-0 size-8 rounded-tl-md border-t-2 border-l-2 border-mint" />
            <span className="absolute top-0 right-0 size-8 rounded-tr-md border-t-2 border-r-2 border-mint" />
            <span className="absolute bottom-0 left-0 size-8 rounded-bl-md border-b-2 border-l-2 border-mint" />
            <span className="absolute right-0 bottom-0 size-8 rounded-br-md border-r-2 border-b-2 border-mint" />
            <span className="absolute top-1/2 left-0 h-px w-full bg-mint/50" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 rounded-t-[22px] bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-md">
          <div className="mx-auto h-1 w-10 rounded-full bg-white/25" />
          <div className="mt-3 flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-mint/15 font-mono text-xs text-mint ring-1 ring-mint/40">
              M
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-display text-sm font-semibold text-glass">{scanResult.name}</p>
                <span className="rounded-full bg-mint/15 px-2 py-0.5 font-mono text-[10px] text-mint ring-1 ring-mint/30">
                  {scanResult.confidence}
                </span>
              </div>
              <p className="mt-1 font-mono text-[11px] text-glass/60">{scanResult.detail}</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 rounded-xl bg-mint py-3 font-display text-sm font-semibold text-ink transition-colors hover:bg-white">
              Añadir a tratamiento
            </button>
            <button className="rounded-xl px-4 py-3 font-mono text-xs text-glass/70 ring-1 ring-white/20">
              Reintentar
            </button>
          </div>
        </div>
      </section>

      <p className="mt-4 font-mono text-[11px] leading-relaxed text-glass/50">
        Encuadrá el blíster dentro del marco. La lectura se confirma sola cuando el nombre y la dosis son legibles.
      </p>
    </AppShell>
  );
}
