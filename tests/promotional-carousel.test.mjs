import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("includes four clearly labeled demo promotions", () => {
  for (const business of ["Mueblerías Barrios", "Café Borinquen", "AutoCentro Isla", "Isla Solar PR"]) assert.ok(page.includes(business));
  assert.ok(page.includes("Publicidad · Demostración"));
});
test("rotates every five seconds and can pause", () => {
  assert.ok(page.includes("5000"));
  assert.ok(page.includes("promotionPaused"));
  assert.ok(page.includes("prefers-reduced-motion"));
});
test("offers accessible manual navigation", () => {
  assert.ok(page.includes("Promoción anterior"));
  assert.ok(page.includes("Próxima promoción"));
  assert.ok(page.includes("Elegir promoción"));
});
test("has responsive carousel styles", () => {
  assert.ok(css.includes(".promotion-strip"));
  assert.ok(css.includes("@media(max-width:620px){.promotion-strip"));
});
test("ships optimized promotional images", () => {
  for (const name of ["ad-mueblerias-barrios.webp", "ad-cafe-borinquen.webp", "ad-autocentro-isla.webp", "ad-isla-solar-pr.webp"]) assert.ok(existsSync(new URL(`../public/promotions/${name}`, import.meta.url)));
});
