import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const data = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");

const checks = [
  ["venta 01: oferta exige cantidad mayor de cero", page, 'amount <= 0'],
  ["venta 02: alerta cantidades anormalmente altas", page, '* 1.5'],
  ["venta 03: oferta nueva inicia Pendiente", data, 'status: "pending"'],
  ["venta 04: oferta identifica al comprador", data, 'offered_by: "buyer"'],
  ["venta 05: ambas partes pueden consultar ofertas", data, 'or=(buyer_id.eq.${userId},seller_id.eq.${userId})'],
  ["venta 06: ofertas se ordenan más recientes primero", data, 'order=created_at.desc&limit=100'],
  ["venta 07: aceptar o rechazar usa respuesta segura", data, 'respond_to_offer'],
  ["venta 08: retirar usa operación separada", data, 'withdraw_offer'],
  ["venta 09: Mi Coquí incluye pestaña Ofertas", page, '>Ofertas ({myOffers.filter'],
  ["venta 10: aceptar no cambia a Pendiente", page, 'no cambia a Pendiente automáticamente'],
  ["venta 11: aceptar no crea transacción", page, 'Aceptar una oferta no crea todavía una transacción.'],
  ["venta 12: otras ofertas no se rechazan solas", page, 'Las demás ofertas permanecen en su estado'],
  ["venta 13: distingue oferta recibida y enviada", page, 'received ? "Oferta recibida" : "Oferta enviada"'],
  ["venta 14: muestra cantidad ofrecida", page, 'Number(offer.amount).toLocaleString("en-US")'],
  ["venta 15: permite aceptar oferta recibida", page, 'changeOfferStatus(offer.id, "accepted")'],
  ["venta 16: permite rechazar oferta recibida", page, 'changeOfferStatus(offer.id, "rejected")'],
  ["venta 17: comprador puede retirar oferta", page, 'changeOfferStatus(offer.id, "withdrawn")'],
  ["venta 18: reconoce contraoferta en historial", page, 'Contraoferta enviada'],
  ["venta 19: oferta aceptada inicia confirmación", page, 'Iniciar confirmación de venta'],
  ["venta 20: evita confirmación duplicada", page, 'confirmation.accepted_offer_id === offer.id'],
  ["venta 21: modal solicita confirmación al comprador", page, 'Solicitar confirmación al comprador'],
  ["venta 22: muestra flujo de cuatro pasos", page, '4. Transacción y reseñas'],
  ["venta 23: aclara que vendedor no confirma solo", page, 'Esto no confirma la venta por sí solo.'],
  ["venta 24: envía precio y oferta aceptada al RPC", data, 'p_agreed_price: payload.agreedPrice, p_offer_id: payload.offerId'],
  ["venta 25: comprador confirma con RPC", data, 'confirm_purchase'],
  ["venta 26: comprador puede rechazar", data, 'reject_sale_confirmation'],
  ["venta 27: vendedor puede cancelar solicitud", data, 'cancel_sale_confirmation'],
  ["venta 28: declaración queda esperando comprador", page, 'La venta aún no está completada.'],
  ["venta 29: compra confirmada crea transacción", page, 'La transacción quedó verificada y el anuncio pasará a Vendido.'],
  ["venta 30: rechazo no crea transacción", page, 'Confirmación rechazada. No se creó ninguna transacción.'],
  ["venta 31: actualiza anuncios públicos después de confirmar", page, 'getPublicListings().then(setLiveListings)'],
  ["venta 32: actividad se limita a comprador o vendedor", data, 'const participant = `or=(buyer_id.eq.${userId},seller_id.eq.${userId})`'],
  ["venta 33: muestra transacciones verificadas", page, '<h3>Transacciones verificadas</h3>'],
  ["venta 34: distingue completada y en disputa", page, 'transaction.status === "disputed" ? "⚑ En disputa" : "✓ Completada"'],
  ["venta 35: conserva precio acordado", page, 'Number(transaction.agreed_price).toLocaleString("en-US")'],
  ["venta 36: reseña nace desde transacción", page, 'setReviewTransaction(transaction)'],
  ["venta 37: disputa nace desde transacción", page, 'setDisputeTransaction(transaction)'],
  ["venta 38: calificación permite de una a cinco estrellas", page, '[1,2,3,4,5].map'],
  ["venta 39: reseña guarda identificador de transacción", data, 'transaction_id: payload.transactionId'],
  ["venta 40: reseña protege privacidad y se declara verificada", page, 'Enviar reseña verificada'],
];

for (const [name, source, expected] of checks) {
  test(name, () => assert.ok(source.includes(expected), `Falta: ${expected}`));
}
