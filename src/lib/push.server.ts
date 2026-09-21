import { buildPushPayload, type PushSubscription } from "@block65/webcrypto-web-push";

export type PushRow = { endpoint: string; p256dh: string; auth: string };

export function vapidKeys() {
  return {
    subject: process.env["VAPID_SUBJECT"] ?? "mailto:avisos@medscan.app",
    publicKey: process.env["VAPID_PUBLIC_KEY"],
    privateKey: process.env["VAPID_PRIVATE_KEY"],
  };
}

export async function sendPush(
  row: PushRow,
  data: { title: string; body: string; url?: string },
): Promise<{ ok: boolean; status: number }> {
  const subscription: PushSubscription = {
    endpoint: row.endpoint,
    expirationTime: null,
    keys: { p256dh: row.p256dh, auth: row.auth },
  };

  const payload = await buildPushPayload({ data, options: { ttl: 3600, urgency: "high" } }, subscription, vapidKeys());
  const res = await fetch(row.endpoint, payload);
  if (!res.ok) console.error(`Push failed [${res.status}] ${await res.text()}`);
  return { ok: res.ok, status: res.status };
}
