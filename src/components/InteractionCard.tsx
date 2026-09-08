import type { Severity } from "@/data/med";

const tone: Record<Severity, { bg: string; ring: string; chip: string; edge: string; mark: string }> = {
  alert: { bg: "bg-alert/12", ring: "ring-alert/40", chip: "bg-alert", edge: "#ef5a4b", mark: "!" },
  warn: { bg: "bg-warn/12", ring: "ring-warn/40", chip: "bg-warn", edge: "#f2a63a", mark: "!" },
  safe: { bg: "bg-safe/12", ring: "ring-safe/40", chip: "bg-safe", edge: "#2fd39a", mark: "✓" },
};

export function InteractionCard({
  severity,
  title,
  body,
  action,
  delay = 0.16,
}: {
  severity: Severity;
  title: string;
  body: string;
  action?: string;
  delay?: number;
}) {
  const t = tone[severity];
  return (
    <section
      className={`rounded-[22px] p-4 ring-1 ${t.bg} ${t.ring} animate-[rise_.5s_cubic-bezier(.32,.72,0,1)_both]`}
      style={{ borderLeft: `3px solid ${t.edge}`, animationDelay: `${delay}s` }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-md font-display font-bold text-ink ${t.chip}`}
        >
          {t.mark}
        </div>
        <div>
          <p className="font-display text-sm font-semibold text-glass">{title}</p>
          <p className="mt-1 font-body text-xs leading-relaxed text-glass/75">{body}</p>
          {action ? (
            <button className="mt-2 font-mono text-xs text-mint underline-offset-2 hover:underline">{action}</button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
