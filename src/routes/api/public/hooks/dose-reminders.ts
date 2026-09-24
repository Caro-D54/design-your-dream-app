import { createFileRoute } from "@tanstack/react-router";
import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

type MedRow = {
  id: string;
  user_id: string;
  name: string;
  strength: string | null;
  dose: string;
  times: string[];
  remind_minutes: number;
};

function localParts(timezone: string) {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value]));
  const hour = parts["hour"] === "24" ? "00" : parts["hour"];
  return {
    day: `${parts["year"]}-${parts["month"]}-${parts["day"]}`,
    minutes: Number(hour) * 60 + Number(parts["minute"]),
  };
}

const toMinutes = (time: string) => {
  const [h = "0", m = "0"] = time.split(":");
  return Number(h) * 60 + Number(m);
};

export const Route = createFileRoute("/api/public/hooks/dose-reminders")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const unauthorized = await authenticateCronRequest(request);
        if (unauthorized) return unauthorized;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { sendPush } = await import("@/lib/push.server");

        const [{ data: meds }, { data: profiles }, { data: subs }] = await Promise.all([
          supabaseAdmin
            .from("medications")
            .select("id, user_id, name, strength, dose, times, remind_minutes")
            .eq("active", true)
            .eq("notify", true),
          supabaseAdmin.from("profiles").select("id, timezone"),
          supabaseAdmin.from("push_subscriptions").select("user_id, endpoint, p256dh, auth"),
        ]);

        const tzByUser = new Map((profiles ?? []).map((p) => [p.id, p.timezone]));
        const subsByUser = new Map<string, { endpoint: string; p256dh: string; auth: string }[]>();
        for (const s of subs ?? []) {
          const list = subsByUser.get(s.user_id) ?? [];
          list.push({ endpoint: s.endpoint, p256dh: s.p256dh, auth: s.auth });
          subsByUser.set(s.user_id, list);
        }

        let sent = 0;
        for (const med of (meds ?? []) as MedRow[]) {
          const rows = subsByUser.get(med.user_id);
          if (!rows || rows.length === 0) continue;

          const tz = tzByUser.get(med.user_id) ?? "America/Argentina/Buenos_Aires";
          const { day, minutes } = localParts(tz);

          for (const time of med.times) {
            const fireAt = toMinutes(time) - (med.remind_minutes ?? 10);
            if (minutes < fireAt || minutes > fireAt + 5) continue;

            const { data: log } = await supabaseAdmin
              .from("dose_logs")
              .select("id")
              .eq("medication_id", med.id)
              .eq("dose_day", day)
              .eq("dose_time", time)
              .maybeSingle();
            if (log) continue;

            const { error: claimError } = await supabaseAdmin
              .from("reminder_sends")
              .insert({ medication_id: med.id, dose_day: day, dose_time: time });
            if (claimError) continue; // ya se envió

            const label = med.strength ? `${med.name} ${med.strength}` : med.name;
            for (const row of rows) {
              const res = await sendPush(row, {
                title: `${label} a las ${time}`,
                body: `Te toca ${med.dose}. Marcala como tomada cuando la tomes.`,
                url: "/hoy",
              });
              if (res.ok) sent += 1;
              if (res.status === 404 || res.status === 410) {
                await supabaseAdmin.from("push_subscriptions").delete().eq("endpoint", row.endpoint);
              }
            }
          }
        }

        return Response.json({ ok: true, sent });
      },
    },
  },
});
