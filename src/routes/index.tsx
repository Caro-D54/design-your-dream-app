import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedScan AI · Tu medicación al día" },
      {
        name: "description",
        content:
          "MedScan AI lee la etiqueta de tus medicamentos, organiza cada dosis y te avisa en el celular antes de tomarla.",
      },
      { property: "og:title", content: "MedScan AI · Tu medicación al día" },
      {
        property: "og:description",
        content: "Escaneá la caja, cargá tu plan y recibí avisos de cada dosis en el celular.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const points = [
  { title: "Escaneá la etiqueta", body: "La cámara lee el nombre, la dosis y la frecuencia impresas en la caja." },
  { title: "Avisos en el celular", body: "Te llega una notificación minutos antes de cada toma, sin abrir la app." },
  { title: "Compatibilidad", body: "Te avisamos cuando dos medicamentos de tu plan conviene separarlos." },
];

function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/hoy" });
    });
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-abyss font-body text-glass">
      <div className="app-aurora pointer-events-none absolute inset-0" />
      <div className="app-grain pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col px-5 py-12">
        <p className="font-mono text-[10px] tracking-[0.22em] text-mint uppercase">MedScan AI</p>
        <h1 className="mt-3 font-display text-[34px] leading-[1.05] font-bold tracking-tight">
          Tu medicación,
          <br />
          al día y sin dudas.
        </h1>
        <p className="mt-3 font-body text-sm leading-relaxed text-glass/70">
          Cargá tus tratamientos una vez y MedScan te recuerda cada dosis, con la guía de toma de cada medicamento.
        </p>

        <div className="mt-8 flex flex-col gap-2.5">
          {points.map((p, i) => (
            <div
              key={p.title}
              className="animate-[settle_.5s_cubic-bezier(.32,.72,0,1)_both] rounded-2xl bg-white/8 p-4 ring-1 ring-white/10"
              style={{ animationDelay: `${0.1 + i * 0.07}s` }}
            >
              <p className="font-body text-sm font-semibold text-glass">{p.title}</p>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-glass/60">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-10">
          <Link
            to="/auth"
            className="block rounded-xl bg-mint py-3.5 text-center font-display text-sm font-semibold text-ink transition-colors hover:bg-white"
          >
            Empezar
          </Link>
          <p className="mt-3 text-center font-mono text-[10px] text-glass/45">
            MedScan AI no reemplaza la indicación de tu médico.
          </p>
        </div>
      </div>
    </div>
  );
}
