import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar a MedScan AI" },
      {
        name: "description",
        content: "Creá tu cuenta de MedScan AI para guardar tus medicamentos y recibir avisos de cada dosis.",
      },
      { property: "og:title", content: "Entrar a MedScan AI" },
      { property: "og:description", content: "Tu plan de medicación, sincronizado y con avisos en el celular." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthScreen,
});

function AuthScreen() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/hoy" });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) void navigate({ to: "/hoy" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "up") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
        });
        if (signUpError) throw signUpError;
        if (!data.session) setMessage("Te enviamos un mail para confirmar la cuenta. Abrilo y volvé a entrar.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos continuar");
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    setError("");
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) setError("No pudimos entrar con Google");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-abyss font-body text-glass">
      <div className="app-aurora pointer-events-none absolute inset-0" />
      <div className="app-grain pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col justify-center px-5 py-10">
        <p className="font-mono text-[10px] tracking-[0.22em] text-mint uppercase">MedScan AI</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
          {mode === "in" ? "Entrá a tu plan" : "Creá tu cuenta"}
        </h1>
        <p className="mt-2 font-body text-sm text-glass/70">
          Guardamos tus medicamentos y te avisamos en el celular antes de cada dosis.
        </p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-2.5">
          {mode === "up" ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="rounded-xl bg-white/8 px-4 py-3 font-body text-sm text-glass ring-1 ring-white/15 outline-none placeholder:text-glass/40 focus:ring-mint/50"
            />
          ) : null}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@mail.com"
            className="rounded-xl bg-white/8 px-4 py-3 font-body text-sm text-glass ring-1 ring-white/15 outline-none placeholder:text-glass/40 focus:ring-mint/50"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="rounded-xl bg-white/8 px-4 py-3 font-body text-sm text-glass ring-1 ring-white/15 outline-none placeholder:text-glass/40 focus:ring-mint/50"
          />
          <button
            type="submit"
            disabled={busy}
            className="mt-1 rounded-xl bg-mint py-3 font-display text-sm font-semibold text-ink transition-colors hover:bg-white disabled:opacity-60"
          >
            {busy ? "Un momento…" : mode === "in" ? "Entrar" : "Crear cuenta"}
          </button>
        </form>

        <button
          onClick={google}
          className="mt-2.5 rounded-xl bg-white/8 py-3 font-display text-sm font-semibold text-glass ring-1 ring-white/15 transition-colors hover:bg-white/15"
        >
          Continuar con Google
        </button>

        {error ? <p className="mt-3 font-mono text-[11px] text-alert">{error}</p> : null}
        {message ? <p className="mt-3 font-mono text-[11px] text-mint">{message}</p> : null}

        <button
          onClick={() => {
            setMode(mode === "in" ? "up" : "in");
            setError("");
            setMessage("");
          }}
          className="mt-5 font-mono text-[11px] text-glass/60 underline decoration-glass/30"
        >
          {mode === "in" ? "No tengo cuenta, quiero registrarme" : "Ya tengo cuenta, quiero entrar"}
        </button>
      </div>
    </div>
  );
}
