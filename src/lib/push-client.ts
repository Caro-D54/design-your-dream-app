import { getVapidPublicKey, removePushSubscription, savePushSubscription } from "./push.functions";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

export function pushSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window;
}

export async function enablePush() {
  if (!pushSupported()) throw new Error("Este navegador no admite avisos en el celular");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Tenés que permitir los avisos en el navegador");

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const { key } = await getVapidPublicKey();
  if (!key) throw new Error("Los avisos no están configurados");

  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key),
    }));

  const json = subscription.toJSON() as { endpoint?: string; keys?: { p256dh?: string; auth?: string } };
  await savePushSubscription({
    data: {
      endpoint: json.endpoint ?? subscription.endpoint,
      p256dh: json.keys?.p256dh ?? "",
      auth: json.keys?.auth ?? "",
    },
  });
  return true;
}

export async function disablePush() {
  if (!pushSupported()) return;
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  const subscription = await registration?.pushManager.getSubscription();
  if (!subscription) return;
  await removePushSubscription({ data: { endpoint: subscription.endpoint } });
  await subscription.unsubscribe();
}

export async function pushEnabled() {
  if (!pushSupported() || Notification.permission !== "granted") return false;
  const registration = await navigator.serviceWorker.getRegistration("/sw.js");
  return Boolean(await registration?.pushManager.getSubscription());
}
