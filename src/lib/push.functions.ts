import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getVapidPublicKey = createServerFn({ method: "GET" }).handler(async () => ({
  key: process.env["VAPID_PUBLIC_KEY"] ?? "",
}));

export const savePushSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { endpoint: string; p256dh: string; auth: string }) => {
    const endpoint = String(data.endpoint ?? "");
    if (!endpoint.startsWith("https://")) throw new Error("Suscripción inválida");
    return { endpoint, p256dh: String(data.p256dh), auth: String(data.auth) };
  })
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("push_subscriptions")
      .upsert({ ...data, user_id: context.userId }, { onConflict: "endpoint" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const removePushSubscription = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { endpoint: string }) => ({ endpoint: String(data.endpoint) }))
  .handler(async ({ data, context }) => {
    await context.supabase.from("push_subscriptions").delete().eq("endpoint", data.endpoint);
    return { ok: true };
  });

export const sendTestPush = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: rows, error } = await context.supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    if (!rows || rows.length === 0) throw new Error("Todavía no activaste los avisos en este celular");

    const { sendPush } = await import("./push.server");
    let sent = 0;
    for (const row of rows) {
      const res = await sendPush(row, {
        title: "MedScan AI",
        body: "Los avisos están activos. Te vamos a recordar cada dosis.",
        url: "/hoy",
      });
      if (res.ok) sent += 1;
    }
    if (sent === 0) throw new Error("No pudimos enviar el aviso de prueba");
    return { sent };
  });
