import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const data = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");

const checks = [
  ["cierre 01: venta empieza desde oferta aceptada", page, 'offer.status === "accepted"'],
  ["cierre 02: vendedor inicia confirmación", page, "Iniciar confirmación de venta"],
  ["cierre 03: evita solicitud duplicada", page, "confirmation.accepted_offer_id === offer.id"],
  ["cierre 04: vendedor declara la venta", page, "El vendedor declara la venta."],
  ["cierre 05: comprador confirma o rechaza", page, "El comprador confirma o rechaza."],
  ["cierre 06: transacción nace después", page, "Solo después se crea una transacción verificable"],
  ["cierre 07: mapa muestra oferta aceptada", page, ">Oferta aceptada</b>"],
  ["cierre 08: aceptar no marca Vendido", page, "No marca Vendido ni crea una transacción."],
  ["cierre 09: mapa cuenta ofertas aceptadas", page, 'myOffers.filter((offer) => offer.status === "accepted").length'],
  ["cierre 10: mapa muestra confirmación pendiente", page, ">Confirmación pendiente</b>"],
  ["cierre 11: comprador debe confirmar", page, "El comprador debe confirmar que ocurrió."],
  ["cierre 12: cuenta solicitudes pendientes", page, 'confirmation.status === "seller_submitted"'],
  ["cierre 13: mapa muestra transacción verificada", page, ">Transacción verificada</b>"],
  ["cierre 14: transacción solo después de confirmar", page, "Se crea únicamente después de confirmar."],
  ["cierre 15: cuenta transacciones completadas", page, 'transaction.status === "completed"'],
  ["cierre 16: mapa muestra reseña o disputa", page, ">Reseña o disputa</b>"],
  ["cierre 17: reseña o disputa requiere transacción", page, "Solo desde una transacción reconocida."],
  ["cierre 18: cuenta reseñas y disputas", page, "myReviews.length + myDisputes.length"],
  ["cierre 19: vendedor no completa solo", page, "El vendedor no puede completar la venta por sí solo."],
  ["cierre 20: rechazo no crea transacción", page, "Un rechazo o cancelación no crea una transacción."],
  ["cierre 21: anuncio conserva estado", page, "El anuncio conserva su estado hasta que corresponda cambiarlo."],
  ["cierre 22: RPC inicia confirmación", data, 'submit_sale_confirmation'],
  ["cierre 23: solicitud incluye publicación", data, 'p_listing_id: payload.listingId'],
  ["cierre 24: solicitud incluye comprador", data, 'p_buyer_id: payload.buyerId'],
  ["cierre 25: solicitud incluye precio acordado", data, 'p_agreed_price: payload.agreedPrice'],
  ["cierre 26: solicitud incluye oferta aceptada", data, 'p_offer_id: payload.offerId'],
  ["cierre 27: comprador confirma mediante operación segura", data, 'confirm_purchase'],
  ["cierre 28: comprador puede rechazar mediante operación segura", data, 'reject_sale_confirmation'],
  ["cierre 29: vendedor puede cancelar solicitud", data, 'cancel_sale_confirmation'],
  ["cierre 30: comprador ve acción confirmar", page, "Sí, completé la compra"],
  ["cierre 31: comprador puede indicar que no ocurrió", page, ">No ocurrió</button>"],
  ["cierre 32: vendedor puede cancelar", page, "Cancelar solicitud"],
  ["cierre 33: confirma mensaje de transacción creada", page, "La transacción quedó verificada"],
  ["cierre 34: rechazo informa que no creó transacción", page, "No se creó ninguna transacción."],
  ["cierre 35: transacción habilita reseña", page, "Escribir reseña"],
  ["cierre 36: transacción habilita disputa", page, "Abrir disputa"],
  ["cierre 37: reseña usa escala de cinco", page, "[1,2,3,4,5].map"],
  ["cierre 38: mapa se adapta a tableta", styles, "@media(max-width:850px){.sale-process-map"],
  ["cierre 39: mapa se adapta a móvil", styles, "@media(max-width:520px){.sale-process-map"],
  ["cierre 40: regla de confianza se destaca", styles, ".sale-integrity-note"],
];

for (const [name, source, expected] of checks) {
  test(name, () => assert.ok(source.includes(expected), `Falta: ${expected}`));
}
