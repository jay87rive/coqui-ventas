import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const checks = [
  ["publicidad 01: carrusel principal permanece", page.includes('className="promotion-strip"')],
  ["publicidad 02: banner compacto integrado", page.includes('className="inline-promotion section"')],
  ["publicidad 03: ubicación después de resultados", page.indexOf('className="inline-promotion section"') > page.indexOf('className="featured"')],
  ["publicidad 04: ubicación antes de seguridad", page.indexOf('className="inline-promotion section"') < page.indexOf('className="safety section"')],
  ["publicidad 05: etiqueta visible en carrusel", page.includes("Publicidad · Demostración")],
  ["publicidad 06: etiqueta accesible del banner", page.includes('aria-label="Espacio publicitario integrado"')],
  ["publicidad 07: imagen decorativa oculta", page.includes('className="inline-promotion-image"') && page.includes('aria-hidden="true"')],
  ["publicidad 08: negocio identificado", page.includes(".business}</small>")],
  ["publicidad 09: oferta visible", page.includes(".offer}</p>")],
  ["publicidad 10: llamada a acción visible", page.includes(".cta} →")],
  ["publicidad 11: información de por qué se muestra", page.includes("¿Por qué veo esto?")],
  ["publicidad 12: control anuncia expansión", page.includes("aria-expanded={smallAdInfoOpen}")],
  ["publicidad 13: explicación con estado accesible", page.includes('className="inline-ad-explanation" role="status"')],
  ["publicidad 14: no usa información privada", page.includes("No usa tu información privada")],
  ["publicidad 15: no altera resultados", page.includes("ni cambia el orden de tus resultados")],
  ["publicidad 16: invitación para negocios", page.includes("¿Tienes un negocio?")],
  ["publicidad 17: entrada de monetización", page.includes("Anúnciate en Coquí")],
  ["publicidad 18: modal informativo", page.includes('className="auth-modal advertising-modal"')],
  ["publicidad 19: modal accesible", page.includes('aria-labelledby="advertising-title"')],
  ["publicidad 20: cierre accesible", page.includes('setAdvertisingInfoOpen(false)} aria-label="Cerrar"')],
  ["publicidad 21: formato principal descrito", page.includes("Carrusel superior")],
  ["publicidad 22: formato integrado descrito", page.includes("Banner compacto")],
  ["publicidad 23: formato destacado descrito", page.includes("Publicación promovida")],
  ["publicidad 24: anuncios siempre identificados", page.includes("Toda publicidad estará identificada")],
  ["publicidad 25: privacidad no vendida", page.includes("No se venderá información privada")],
  ["publicidad 26: negocios verificables", page.includes("Negocios y ofertas deberán ser verificables")],
  ["publicidad 27: reseñas independientes", page.includes("no alterarán reseñas ni estados")],
  ["publicidad 28: contratación marcada futura", page.includes("Precios y contratación se habilitarán más adelante")],
  ["publicidad 29: rotación de cinco segundos", page.includes("5000")],
  ["publicidad 30: rotación reutiliza inventario", page.includes("(activePromotion + 2) % promotionalAds.length")],
  ["publicidad 31: pausa disponible", page.includes("promotionPaused")],
  ["publicidad 32: movimiento reducido respetado", page.includes("prefers-reduced-motion: reduce")],
  ["publicidad 33: navegación anterior", page.includes("Promoción anterior")],
  ["publicidad 34: navegación siguiente", page.includes("Próxima promoción")],
  ["publicidad 35: selección manual", page.includes("Elegir promoción")],
  ["publicidad 36: estilos compactos", css.includes(".inline-promotion{min-height:150px")],
  ["publicidad 37: separación visual", css.includes("border:1px solid #c8ddd9")],
  ["publicidad 38: diseño móvil", css.includes("@media(max-width:760px){.inline-promotion")],
  ["publicidad 39: modal móvil", css.includes(".advertising-options{grid-template-columns:1fr}")],
  ["publicidad 40: anuncios no imitan clasificados", css.includes(".advertise-with-us") && css.includes("linear-gradient(145deg,#17384c,#087f78)")],
];

for (const [name, condition] of checks) test(name, () => assert.equal(condition, true));
