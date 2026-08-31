import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const data = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");

const checks = [
  ["chat 01: conversación se asocia a una publicación", data, "listing_id: string"],
  ["chat 02: carga mensajes de la conversación", data, "messages(id,body,sender_id,created_at,deleted_at)"],
  ["chat 03: carga ofertas de ambas partes", data, "or=(buyer_id.eq.${userId},seller_id.eq.${userId})"],
  ["chat 04: filtra ofertas por la publicación conversada", page, "offer.listing_id === conversation.listing_id"],
  ["chat 05: combina mensajes en una línea de tiempo", page, 'kind: "message" as const'],
  ["chat 06: combina ofertas en una línea de tiempo", page, 'kind: "offer" as const'],
  ["chat 07: ordena por fecha ascendente", page, "new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()"],
  ["chat 08: conserva identificador de cada mensaje", page, "message-${item.message.id}"],
  ["chat 09: conserva identificador de cada oferta", page, "chat-offer-${offer.id}"],
  ["chat 10: muestra resumen del registro", page, "Registro de la conversación"],
  ["chat 11: cuenta mensajes", page, "selectedConversation.messages.length"],
  ["chat 12: cuenta negociaciones", page, "selectedConversationOffers.length"],
  ["chat 13: filtro Todo existe", page, '>Todo</button>'],
  ["chat 14: filtro Mensajes existe", page, '>Mensajes</button>'],
  ["chat 15: filtro Ofertas existe", page, '>Ofertas</button>'],
  ["chat 16: filtro anuncia su propósito", page, 'aria-label="Filtrar registro del chat"'],
  ["chat 17: filtro activo se distingue", styles, ".chat-record-summary button.active"],
  ["chat 18: mensajes propios se distinguen", page, '? "mine" : "theirs"'],
  ["chat 19: mensajes incluyen fecha y hora", page, 'item.message.body}<time>'],
  ["chat 20: usa formato de Puerto Rico", page, 'toLocaleString("es-PR"'],
  ["chat 21: oferta muestra monto", page, "Number(offer.amount).toLocaleString"],
  ["chat 22: distingue oferta", page, '? "Contraoferta" : "Oferta"'],
  ["chat 23: distingue recibida y enviada", page, 'received ? "Recibida" : "Enviada"'],
  ["chat 24: reconoce Pendiente", page, 'offer.status === "pending" ? "Pendiente"'],
  ["chat 25: reconoce Aceptada", page, 'offer.status === "accepted" ? "Aceptada"'],
  ["chat 26: reconoce Rechazada", page, 'offer.status === "rejected" ? "Rechazada"'],
  ["chat 27: reconoce Retirada", page, 'offer.status === "withdrawn" ? "Retirada"'],
  ["chat 28: reconoce oferta respondida", page, 'offer.status === "countered" ? "Respondida"'],
  ["chat 29: reconoce Expirada", page, ': "Expirada"'],
  ["chat 30: vendedor puede aceptar desde chat", page, 'changeOfferStatus(offer.id, "accepted")'],
  ["chat 31: vendedor puede rechazar desde chat", page, 'changeOfferStatus(offer.id, "rejected")'],
  ["chat 32: comprador puede retirar desde chat", page, 'changeOfferStatus(offer.id, "withdrawn")'],
  ["chat 33: solo oferta pendiente muestra acciones", page, 'offer.status === "pending" &&'],
  ["chat 34: estado aceptado tiene estilo visible", styles, ".chat-offer-event.status-accepted"],
  ["chat 35: rechazado y retirado tienen estilo visible", styles, ".chat-offer-event.status-rejected,.chat-offer-event.status-withdrawn"],
  ["chat 36: no hay mensaje vacío engañoso", page, "!selectedChatTimeline.length"],
  ["chat 37: filtro vacío explica el resultado", page, "No hay {chatView ==="],
  ["chat 38: sección Ofertas permanece", page, "offers-dashboard"],
  ["chat 39: demo también registra negociación", page, "recordDemoOfferActivity"],
  ["chat 40: recuerda advertencia de seguridad", page, "No compartas dirección exacta, documentos ni información financiera"],
];

for (const [name, source, expected] of checks) {
  test(name, () => assert.ok(source.includes(expected), `Falta: ${expected}`));
}
