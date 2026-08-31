import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const checks = [
  ["demo 01: ofrece acceso rápido para probar comprador", page, "⇄ Probar comprador"],
  ["demo 02: identifica el laboratorio de prueba", page, "Laboratorio de prueba"],
  ["demo 03: incluye perfil vendedor", page, "Jayson · Vendedor"],
  ["demo 04: incluye perfil comprador separado", page, "María · Compradora demo"],
  ["demo 05: permite cambiar al vendedor", page, 'setDemoRole("seller")'],
  ["demo 06: permite cambiar al comprador", page, 'setDemoRole("buyer")'],
  ["demo 07: anuncia el perfil activo", page, 'role="status"'],
  ["demo 08: muestra artículo de prueba", page, "Consola portátil"],
  ["demo 09: comprador puede enviar oferta", page, "Enviar oferta"],
  ["demo 10: comprador puede retirar oferta", page, "Retirar mi oferta"],
  ["demo 11: vendedor puede aceptar oferta", page, 'Oferta aceptada · $'],
  ["demo 12: vendedor puede rechazar oferta", page, 'Oferta rechazada · $'],
  ["demo 13: aceptar no cambia estado del anuncio", page, "La publicación continúa Disponible"],
  ["demo 14: ambos perfiles pueden escribir mensajes", page, "sendDemoMessage"],
  ["demo 15: mensajes distinguen vendedor y compradora", page, 'message.role === "seller" ? "Vendedor" : "Compradora"'],
  ["demo 16: incluye conversación inicial", page, "¿Todavía está disponible?"],
  ["demo 17: permite reiniciar la prueba", page, "Reiniciar prueba"],
  ["demo 18: aclara que no cambia datos reales", page, "no cambia publicaciones reales"],
  ["demo 19: interfaz adapta mensajes al perfil activo", styles, ".demo-message-history p.mine"],
  ["demo 20: selector se adapta a pantallas pequeñas", styles, "@media(max-width:620px){.demo-lab"],
  ["demo 21: vendedor puede hacer contraoferta", page, "Hacer contraoferta"],
  ["demo 22: contraoferta permite cantidad diferente", page, "Cantidad de contraoferta demo"],
  ["demo 23: comprador puede aceptar contraoferta", page, "Aceptar contraoferta"],
  ["demo 24: comprador puede rechazar contraoferta", page, 'Contraoferta rechazada · $'],
  ["demo 25: vendedor puede retirar contraoferta", page, "Retirar contraoferta"],
  ["demo 26: contraoferta espera respuesta del comprador", page, "Esperando respuesta de María."],
  ["demo 27: estado distingue contraoferta", page, 'demoOfferStatus === "countered" ? "Contraoferta"'],
  ["demo 28: contraoferta tiene estado visual propio", styles, ".demo-offer-status.status-countered"],
  ["demo 29: registra actividad de oferta en conversación", page, "recordDemoOfferActivity"],
  ["demo 30: oferta enviada aparece en el chat", page, "Oferta enviada · $"],
  ["demo 31: contraoferta enviada aparece en el chat", page, "Contraoferta enviada · $"],
  ["demo 32: aceptación aparece en el chat", page, "Contraoferta aceptada · $"],
  ["demo 33: rechazo aparece en el chat", page, "Contraoferta rechazada · $"],
  ["demo 34: retiro aparece en el chat", page, "Contraoferta retirada · vuelve la oferta"],
  ["demo 35: actividades tienen tarjeta diferenciada", styles, ".demo-message-history p.offer-activity"],
  ["demo 36: chat real muestra ofertas de esa conversación", page, "offer.listing_id === conversation.listing_id"],
  ["demo 37: chat real distingue oferta y contraoferta", page, 'offer.offered_by === "seller" ? "Contraoferta" : "Oferta"'],
  ["demo 38: chat real permite responder oferta", page, "chat-offer-actions"],
  ["demo 39: sección separada de ofertas permanece", page, "offers-dashboard"],
  ["demo 40: tarjetas de negociación tienen estilo propio", styles, ".chat-offer-event"],
];

for (const [name, source, expected] of checks) {
  test(name, () => assert.ok(source.includes(expected), `Falta: ${expected}`));
}
