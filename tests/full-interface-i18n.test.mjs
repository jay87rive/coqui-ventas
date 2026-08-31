import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const i18n = await readFile(new URL("../lib/interface-i18n.ts", import.meta.url), "utf8");
const bellaCss = await readFile(new URL("../app/huellitas-bella.css", import.meta.url), "utf8");

test("the global language hook is connected to the saved selector state", () => {
  assert.match(page, /import \{ useInterfaceLanguage \}/);
  assert.match(page, /useInterfaceLanguage\(language\)/);
  assert.match(page, /localStorage\.setItem\("coqui-language", nextLanguage\)/);
});

test("translation observes dynamic dialogs and translated accessibility attributes", () => {
  assert.match(i18n, /new MutationObserver/);
  assert.match(i18n, /childList: true/);
  assert.match(i18n, /characterData: true/);
  for (const attribute of ["placeholder", "aria-label", "title", "alt"]) {
    assert.ok(i18n.includes(`\"${attribute}\"`), `missing ${attribute} translation`);
  }
  assert.match(i18n, /document\.documentElement\.lang = language/);
});

test("English coverage spans every major Coquí Ventas area", () => {
  const requiredSpanishSources = [
    "El marketplace hecho para Puerto Rico",
    "Publica tu anuncio",
    "Mi perfil",
    "Mis mensajes",
    "Mis ofertas",
    "Mis ventas",
    "Centro de seguridad",
    "Huellitas de Amor",
    "Portal de organizaciones",
    "Job Tracker",
    "Panel del patrono",
    "Política de privacidad",
  ];
  for (const source of requiredSpanishSources) {
    assert.ok(i18n.includes(`\"${source}\"`), `missing coverage for ${source}`);
  }
});

test("dynamic listing counts, dates, photos, promotions and candidate totals translate", () => {
  for (const fragment of [
    "Mostrando",
    "Publicado hace",
    "fotos?",
    "notificaciones? sin leer",
    "empleos? disponibles?",
    "perfiles de candidatos",
    "Ver promoción de",
  ]) assert.ok(i18n.includes(fragment), `missing dynamic pattern ${fragment}`);
});

test("English Bella presentation masks embedded Spanish launch copy", () => {
  assert.match(page, /data-interface-language=\{language\}/);
  assert.match(bellaCss, /\.huellitas-home-zone\[data-interface-language="en"\] \.huellitas-home-overlay/);
  assert.match(bellaCss, /right: 47%/);
});
