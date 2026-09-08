import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Inicio", shape: "square-solid" },
  { to: "/escaner", label: "Escáner", shape: "circle" },
  { to: "/dosis", label: "Dosis", shape: "square" },
  { to: "/perfil", label: "Perfil", shape: "circle" },
] as const;

function TabIcon({ shape, active }: { shape: string; active: boolean }) {
  if (shape === "square-solid") {
    return <span className={`block h-3 w-3 rounded-[3px] ${active ? "bg-mint" : "bg-current"}`} />;
  }
  if (shape === "square") {
    return <span className="block h-3 w-3 rounded-[3px] border-2 border-current" />;
  }
  return <span className="block h-3 w-3 rounded-full border-2 border-current" />;
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-abyss font-body text-glass">
      <div className="app-aurora pointer-events-none absolute inset-0" />
      <div className="app-grain pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[390px] flex-col px-4 pt-5 pb-28">
        {children}
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[390px] px-4 pb-5">
        <nav className="flex items-center justify-between rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15 backdrop-blur-md">
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              className="flex flex-1 flex-col items-center gap-1 py-1.5 text-glass/60"
              activeProps={{ className: "text-mint" }}
              activeOptions={{ exact: tab.to === "/" }}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid size-8 place-items-center rounded-lg ${
                      isActive ? "bg-mint/15 ring-1 ring-mint/30" : ""
                    }`}
                  >
                    <TabIcon shape={tab.shape} active={isActive} />
                  </span>
                  <span className="font-mono text-[10px]">{tab.label}</span>
                </>
              )}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function ScreenHeader({ eyebrow, title, badge }: { eyebrow: string; title: string; badge?: string }) {
  return (
    <header className="flex animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both] items-center justify-between">
      <div>
        <p className="font-mono text-[10px] tracking-[0.22em] text-glass/50 uppercase">{eyebrow}</p>
        <p className="font-display text-lg font-bold tracking-tight text-glass">{title}</p>
      </div>
      {badge ? (
        <div className="grid size-10 place-items-center rounded-full bg-white/10 font-mono text-xs text-glass ring-1 ring-white/15">
          {badge}
        </div>
      ) : null}
    </header>
  );
}
