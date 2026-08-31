import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const checks = [
  ["botón para reportar una publicación", page, "⚑ Reportar"],
  ["reporte de conversación", page, "Reportar conversación"],
  ["inicio de sesión requerido para reportar", page, "setAuthOpen(true)"],
  ["centro de seguridad", page, "Centro de seguridad"],
  ["reportes privados", page, "Mis reportes"],
  ["disputas privadas", page, "Disputas de transacciones"],
  ["apelaciones visibles", page, "Mis apelaciones"],
  ["emergencias dirigen al 911", page, "Llama al 911"],
  ["posible estafa", page, "possible_scam"],
  ["producto falso", page, "counterfeit"],
  ["acoso", page, "harassment"],
  ["producto prohibido", page, "prohibited_item"],
  ["contenido engañoso", page, "misleading_content"],
  ["spam", page, "spam"],
  ["conducta peligrosa", page, "unsafe_behavior"],
  ["precio o condición incorrectos", page, "wrong_price_condition"],
  ["explicación mínima del reporte", page, "reportDescription.trim().length < 15"],
  ["límite del reporte", page, "maxLength={2000}"],
  ["advertencia de privacidad", page, "datos bancarios"],
  ["sin acusación pública automática", page, "no crea una acusación pública"],
  ["sin sanción automática", page, "ni una sanción automática"],
  ["disputa solo desde transacción", page, "Solo se pueden abrir desde una transacción verificada"],
  ["artículo distinto", page, "item_not_as_described"],
  ["artículo no entregado", page, "item_not_received"],
  ["desacuerdo de pago", page, "payment_disagreement"],
  ["conducta insegura", page, "unsafe_conduct"],
  ["disputa con explicación mínima", page, "disputeDescription.trim().length < 20"],
  ["flujo de cuatro pasos", page, "4. Recibes una decisión"],
  ["declaración adicional", page, "Añadir una declaración"],
  ["advertencia contra evidencia falsa", page, "No alteres ni fabriques evidencia"],
  ["apelación no revoca automáticamente", page, "no elimina la medida automáticamente"],
  ["consulta solo reportes propios", api, "reporter_id=eq.${userId}"],
  ["consulta disputas bajo RLS", api, "/rest/v1/disputes?select="],
  ["creación sin estado manipulable", api, "reason_code: payload.reasonCode"],
  ["disputa sin outcome manipulable", api, "description: payload.description.trim()"],
  ["evidencia como declaración", api, "evidence_type: \"statement\""],
  ["apelación ligada a acción", api, "moderation_action_id: payload.actionId"],
  ["estados de reporte traducidos", page, "En revisión"],
  ["estado espera evidencia", page, "Espera evidencia"],
  ["estilos móviles de seguridad", css, ".safety-principles{grid-template-columns:1fr}"],
];

for (const [index, [name, source, expected]] of checks.entries()) {
  test(`seguridad ${String(index + 1).padStart(2, "0")}: ${name}`, () => {
    assert.ok(source.includes(expected), `Falta: ${expected}`);
  });
}

assert.equal(checks.length, 40);

test("el formulario de reporte queda por encima del anuncio abierto", () => {
  assert.ok(page.includes('className="modal-backdrop modal-priority"'));
  assert.ok(css.includes(".modal-backdrop.modal-priority{z-index:220"));
});
