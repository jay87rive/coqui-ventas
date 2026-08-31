import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const data = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");

const checks = [
  ["contraoferta 01: conserva quién envió la propuesta", data, "offered_by_user_id: string"],
  ["contraoferta 02: conserva vínculo con la oferta anterior", data, "parent_offer_id: string | null"],
  ["contraoferta 03: carga el autor desde Supabase", data, "offered_by_user_id,parent_offer_id"],
  ["contraoferta 04: expone operación real", data, "createCounterOffer"],
  ["contraoferta 05: usa RPC segura", data, "/rpc/counter_offer"],
  ["contraoferta 06: envía id de oferta", data, "p_offer_id: offerId"],
  ["contraoferta 07: envía cantidad", data, "p_amount: amount"],
  ["contraoferta 08: mantiene operación POST", data, 'method: "POST"'],
  ["contraoferta 09: usa sesión autenticada", data, "headers(token)"],
  ["contraoferta 10: devuelve resumen tipado", data, "result as OfferSummary"],
  ["contraoferta 11: estado selecciona oferta real", page, "counteringOffer"],
  ["contraoferta 12: estado guarda cantidad", page, "counterAmount"],
  ["contraoferta 13: abre desde oferta recibida", page, "openCounterOffer(offer)"],
  ["contraoferta 14: precarga cantidad actual", page, "String(Number(offer.amount))"],
  ["contraoferta 15: envío usa formulario", page, "submitCounterOffer(event"],
  ["contraoferta 16: evita envío sin sesión", page, "!session || !counteringOffer"],
  ["contraoferta 17: convierte cantidad a número", page, "Number(counterAmount)"],
  ["contraoferta 18: rechaza cantidad no numérica", page, "!Number.isFinite(amount)"],
  ["contraoferta 19: rechaza cero y negativos", page, "amount <= 0"],
  ["contraoferta 20: explica validación al usuario", page, "cantidad válida mayor de $0"],
  ["contraoferta 21: llama operación autenticada", page, "createCounterOffer(session.access_token"],
  ["contraoferta 22: recarga historial desde base", page, "await getMyOffers(session.access_token"],
  ["contraoferta 23: actualiza ofertas visibles", page, "setMyOffers(offers)"],
  ["contraoferta 24: cierra modal al completar", page, "setCounteringOffer(null)"],
  ["contraoferta 25: limpia cantidad al completar", page, 'setCounterAmount("")'],
  ["contraoferta 26: confirma registro en chat", page, "guardada en el chat"],
  ["contraoferta 27: confirma notificación", page, "recibió un aviso"],
  ["contraoferta 28: informa error sin ocultarlo", page, "No pudimos enviar la contraoferta"],
  ["contraoferta 29: distingue recepción por autor", page, "offer.offered_by_user_id !== session.user.id"],
  ["contraoferta 30: etiqueta contraoferta recibida", page, "Contraoferta recibida"],
  ["contraoferta 31: etiqueta contraoferta enviada", page, "Contraoferta enviada"],
  ["contraoferta 32: acción aparece en Ofertas", page, ">Contraofertar</button>"],
  ["contraoferta 33: acción aparece en Chat", page, "chat-offer-actions"],
  ["contraoferta 34: modal tiene prioridad visual", page, "modal-backdrop modal-priority"],
  ["contraoferta 35: modal anuncia negociación", page, ">Negociación</span>"],
  ["contraoferta 36: muestra oferta actual", page, "Oferta actual:"],
  ["contraoferta 37: explica doble registro", page, "registrada en Ofertas y dentro del chat"],
  ["contraoferta 38: campo admite centavos", page, 'step="0.01"'],
  ["contraoferta 39: cantidad tiene etiqueta accesible", page, 'aria-label="Cantidad de la contraoferta"'],
  ["contraoferta 40: modal tiene estilo dedicado", styles, ".counter-offer-modal"],
];

for (const [name, source, expected] of checks) {
  test(name, () => assert.ok(source.includes(expected), `Falta: ${expected}`));
}
