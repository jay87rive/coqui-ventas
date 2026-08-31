import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const checks = [
  ["defines notification records", api.includes("export type NotificationSummary")],
  ["defines preference records", api.includes("export type NotificationPreferences")],
  ["loads only in-app notifications", api.includes("channel=eq.in_app")],
  ["orders newest first", api.includes("order=created_at.desc")],
  ["limits notification history", api.includes("limit=100")],
  ["uses authenticated notification request", api.includes("getMyNotifications(token") && api.includes("headers(token), cache")],
  ["calls secure read RPC", api.includes("rpc/mark_notification_read")],
  ["passes notification id to RPC", api.includes("p_notification_id: notificationId")],
  ["loads only own preference row", api.includes("notification_preferences?select=") && api.includes("&user_id=eq.${userId}")],
  ["saves preferences by upsert", api.includes("resolution=merge-duplicates")],
  ["adds notification account tab", page.includes('"notifications" | "safety"')],
  ["stores notifications", page.includes("setMyNotifications")],
  ["stores notification preferences", page.includes("setNotificationPreferences")],
  ["counts unread items", page.includes("unreadNotificationCount")],
  ["does not count read status", page.includes('item.status !== "read"')],
  ["shows a header bell", page.includes("🔔 Avisos")],
  ["bell has accessible label", page.includes("notificaciones sin leer")],
  ["caps large badge", page.includes('"99+"')],
  ["opens notification center", page.includes('openAccount("notifications")')],
  ["labels center clearly", page.includes("Centro de avisos")],
  ["explains privacy", page.includes("Solo tú puedes verla")],
  ["offers all filter", page.includes('["all","Todos"]')],
  ["offers unread filter", page.includes('["unread","Sin leer"]')],
  ["offers message filter", page.includes('["messages","Mensajes"]')],
  ["offers offer filter", page.includes('["offers","Ofertas"]')],
  ["offers marketplace filter", page.includes('["marketplace","Publicaciones"]')],
  ["offers safety filter", page.includes('["disputes","Seguridad"]')],
  ["offers system filter", page.includes('["system","Sistema"]')],
  ["marks one read", page.includes("async function readNotification")],
  ["marks all read", page.includes("async function readAllNotifications")],
  ["disables read-all when empty", page.includes("!unreadNotificationCount")],
  ["shows empty unread state", page.includes("Estás al día")],
  ["shows general empty state", page.includes("No hay avisos aquí")],
  ["supports notification preferences", page.includes("Elige qué deseas recibir")],
  ["keeps safety notice visible", page.includes("avisos de seguridad y del sistema permanecen activos")],
  ["supports message preference", page.includes('["messages_enabled","Mensajes"]')],
  ["supports marketing opt-in", page.includes('["marketing_enabled","Novedades y mercadeo"]')],
  ["warns against notification scams", page.includes("nunca te pedirá contraseñas, códigos o pagos")],
  ["visually distinguishes unread", css.includes(".notification-card.unread")],
  ["adapts notification center to mobile", css.includes(".notification-card>button{grid-column:2")],
];

for (const [name, condition] of checks) test(name, () => assert.equal(condition, true));
