import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");

const checks = [
  ["aviso accionable 01: conserva tipo de contenido relacionado", api, "related_content_type: string | null"],
  ["aviso accionable 02: conserva id de contenido relacionado", api, "related_content_id: string | null"],
  ["aviso accionable 03: conserva metadatos estructurados", api, "metadata: Record<string, unknown>"],
  ["aviso accionable 04: operación central abre destino", page, "openNotificationDestination"],
  ["aviso accionable 05: exige sesión activa", page, "if (!session) return"],
  ["aviso accionable 06: marca el aviso antes de navegar", page, "await readNotification(notification)"],
  ["aviso accionable 07: evita repetir lectura", page, '!notification.read_at && notification.status !== "read"'],
  ["aviso accionable 08: protege metadatos ausentes", page, "notification.metadata || {}"],
  ["aviso accionable 09: valida valores de metadatos", page, 'typeof metadata[key] === "string"'],
  ["aviso accionable 10: reconoce listing_id", page, 'metadataValue("listing_id")'],
  ["aviso accionable 11: reconoce conversation_id", page, 'metadataValue("conversation_id")'],
  ["aviso accionable 12: usa relación directa de publicación", page, 'related_content_type === "listing"'],
  ["aviso accionable 13: usa relación directa de conversación", page, 'related_content_type === "conversation"'],
  ["aviso accionable 14: mensajes buscan conversación exacta", page, "item.id === conversationId"],
  ["aviso accionable 15: mensajes pueden buscar por publicación", page, "item.listing_id === listingId"],
  ["aviso accionable 16: selecciona conversación relacionada", page, "setSelectedConversationId(conversation.id)"],
  ["aviso accionable 17: mensajes abren historial completo", page, 'setChatView("all")'],
  ["aviso accionable 18: mensajes abren pestaña correcta", page, 'setAccountTab("messages")'],
  ["aviso accionable 19: confirma conversación relacionada", page, "Abrimos la conversación relacionada"],
  ["aviso accionable 20: ofrece alternativa si no encuentra conversación", page, "Abrimos tus mensajes más recientes"],
  ["aviso accionable 21: ofertas reconocen su módulo", page, 'notification.module === "offers"'],
  ["aviso accionable 22: ofertas abren filtro de negociación", page, 'setChatView("offers")'],
  ["aviso accionable 23: negociación explica destino", page, "Abrimos el historial de negociación relacionado"],
  ["aviso accionable 24: ofertas tienen pestaña alternativa", page, 'setAccountTab("offers")'],
  ["aviso accionable 25: alternativa permite responder", page, "para que puedas responder"],
  ["aviso accionable 26: publicaciones buscan catálogo y cuenta", page, "[...liveListings, ...myListings]"],
  ["aviso accionable 27: publicación cierra panel de cuenta", page, "setAccountOpen(false)"],
  ["aviso accionable 28: publicación abre detalle", page, "setSelectedListing(listing)"],
  ["aviso accionable 29: publicación ausente abre historial propio", page, 'setAccountTab("listings")'],
  ["aviso accionable 30: disputas reconocen módulo", page, 'notification.module === "disputes"'],
  ["aviso accionable 31: disputas abren seguridad", page, 'setAccountTab("safety")'],
  ["aviso accionable 32: seguridad confirma destino", page, "Centro de seguridad relacionado"],
  ["aviso accionable 33: aviso general confirma lectura", page, "Aviso revisado"],
  ["aviso accionable 34: oferta usa etiqueta directa", page, 'return "Ver negociación"'],
  ["aviso accionable 35: mensaje usa etiqueta directa", page, 'return "Abrir mensaje"'],
  ["aviso accionable 36: publicación usa etiqueta directa", page, 'return "Ver publicación"'],
  ["aviso accionable 37: disputa usa etiqueta directa", page, 'return "Abrir seguridad"'],
  ["aviso accionable 38: aviso general conserva lectura manual", page, 'return "Marcar leída"'],
  ["aviso accionable 39: avisos relacionados siguen accionables leídos", page, 'const actionable = unread || ["messages", "offers", "marketplace", "disputes"]'],
  ["aviso accionable 40: botón usa la acción y etiqueta correctas", page, "openNotificationDestination(notification)}>{notificationActionLabel(notification)"],
];

for (const [name, source, expected] of checks) {
  test(name, () => assert.ok(source.includes(expected), `Falta: ${expected}`));
}
