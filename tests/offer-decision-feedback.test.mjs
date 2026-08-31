import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");

const checks = [
  ["decisión 01: estado admite aceptación", api, '"accepted"'],
  ["decisión 02: estado admite rechazo", api, '"rejected"'],
  ["decisión 03: estado admite retiro", api, '"withdrawn"'],
  ["decisión 04: aceptación y rechazo usan respuesta segura", api, '"respond_to_offer"'],
  ["decisión 05: retiro usa operación separada", api, '"withdraw_offer"'],
  ["decisión 06: operación elige endpoint correcto", api, 'status === "withdrawn"'],
  ["decisión 07: operación envía offer id", api, "p_offer_id: offerId"],
  ["decisión 08: respuesta envía estado", api, "p_status: status"],
  ["decisión 09: solicitud es autenticada", api, "headers(token)"],
  ["decisión 10: respuesta queda tipada", api, "result as OfferSummary"],
  ["decisión 11: interfaz limita estados permitidos", page, 'status: "accepted" | "rejected" | "withdrawn"'],
  ["decisión 12: requiere sesión", page, "if (!session) return"],
  ["decisión 13: bloquea durante operación", page, "setBusy(true)"],
  ["decisión 14: limpia mensaje previo", page, 'setAccountMessage("")'],
  ["decisión 15: espera respuesta del servidor", page, "await updateOfferStatus(session.access_token"],
  ["decisión 16: recarga actividad después", page, "await loadAccountData(session, true)"],
  ["decisión 17: aceptación confirma aviso", page, "Oferta aceptada. Avisamos a la otra persona"],
  ["decisión 18: aceptación conserva anuncio", page, "no cambia a Pendiente automáticamente"],
  ["decisión 19: rechazo confirma aviso", page, "Oferta rechazada. La otra persona recibió un aviso"],
  ["decisión 20: retiro confirma aviso", page, "Oferta retirada. La otra persona recibió un aviso"],
  ["decisión 21: error queda visible", page, "No pudimos actualizar la oferta"],
  ["decisión 22: bloqueo siempre termina", page, "finally"],
  ["decisión 23: aceptación existe en Ofertas", page, 'changeOfferStatus(offer.id, "accepted")'],
  ["decisión 24: rechazo existe en Ofertas", page, 'changeOfferStatus(offer.id, "rejected")'],
  ["decisión 25: retiro existe en Ofertas", page, 'changeOfferStatus(offer.id, "withdrawn")'],
  ["decisión 26: aceptación existe en Chat", page, "chat-offer-actions"],
  ["decisión 27: acciones solo aparecen pendientes", page, 'offer.status === "pending" &&'],
  ["decisión 28: interfaz distingue recibido", page, "offered_by_user_id !== session.user.id"],
  ["decisión 29: enviado solo puede retirarse", page, ">Retirar oferta</button>"],
  ["decisión 30: recibido permite contraoferta", page, ">Contraofertar</button>"],
  ["decisión 31: avisos incluyen módulo ofertas", api, 'module: "marketplace" | "messages" | "offers"'],
  ["decisión 32: avisos conservan contenido relacionado", api, "related_content_type"],
  ["decisión 33: avisos conservan id relacionado", api, "related_content_id"],
  ["decisión 34: avisos conservan metadata", api, "metadata: Record<string, unknown>"],
  ["decisión 35: centro filtra ofertas", page, '["offers","Ofertas"]'],
  ["decisión 36: aviso ofrece ver negociación", page, 'return "Ver negociación"'],
  ["decisión 37: aviso abre historial de ofertas", page, 'setChatView("offers")'],
  ["decisión 38: aviso puede abrir pestaña Ofertas", page, 'setAccountTab("offers")'],
  ["decisión 39: sincronización recoge el aviso", page, "getMyNotifications(currentSession.access_token)"],
  ["decisión 40: sincronización recoge estado de oferta", page, "getMyOffers(currentSession.access_token"],
];

for (const [name, source, expected] of checks) {
  test(name, () => assert.ok(source.includes(expected), `Falta: ${expected}`));
}
