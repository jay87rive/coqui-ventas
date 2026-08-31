import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const checks = [
  ["empleos ocupa visual principal", page, 'className="hero-jobs-card"'], ["empleos usa imagen propia", page, 'src="/featured/empleos.png"'],
  ["empleos accesible", page, 'aria-label={isEnglish ? "Jobs in Puerto Rico" : "Empleos en Puerto Rico"}'], ["empleos abre portal candidato", page, 'openJobs("candidate")'],
  ["mensaje de oportunidad", page, "Encuentra el trabajo que estás buscando"], ["salario visible", page, "Salario visible · en los 78 municipios"],
  ["acción empleos", page, "Buscar empleos"], ["acción patronos", page, "Buscar candidatos"], ["Huellitas sustituye Gratis", page, 'className="free-zone huellitas-home-zone"'],
  ["Huellitas tiene sección propia", page, 'id="huellitas-portada"'], ["Huellitas abre portal", page, 'onClick={openHuellitas}'],
  ["mensaje Huellitas", page, "Adopta, encuentra un hogar responsable o ayuda a un animal rescatado"], ["acción Huellitas", page, "Conocer las Huellitas"],
  ["Gratis está después de categorías", page, 'className="free-zone moved-free-zone"'], ["Gratis conserva destino", page, 'id="gratis"'],
  ["Gratis conserva acción", page, 'onClick={showFreeListings}'], ["Gratis conserva mensaje", page, "Encuentra artículos que otras personas ofrecen sin costo"],
  ["no repite tarjetas grandes", page, 'NOT:className="primary-service-grid"'], ["no repite Empleos en categorías", page, '!["Empleos", "Huellitas de Amor"].includes(category.name)'],
  ["empleos tiene altura hero", css, '.hero-jobs-card{height:430px'], ["empleos tiene botones accesibles", css, '.hero-jobs-actions button'],
  ["empleos tiene imagen cubierta", css, '.hero-jobs-card>img{z-index:-3;object-fit:cover'], ["empleos tiene contraste", css, '.hero-jobs-overlay'],
  ["empleos tiene badge", css, '.hero-jobs-badge'], ["empleos tiene dos acciones claras", css, '.hero-jobs-actions'],
  ["Huellitas usa estilo horizontal", css, '.huellitas-home-zone'], ["Huellitas usa teal", css, '.huellitas-home-zone{min-height:310px'],
  ["Gratis baja de posición", css, '.moved-free-zone{margin-top:0'], ["espacio antes de Gratis", css, '.category-grid:has(+.moved-free-zone)'],
  ["hero empleos móvil", css, '@media(max-width:620px){.hero-jobs-card'], ["copy móvil legible", css, '.hero-jobs-copy{top:auto;right:22px;bottom:22px;left:22px;width:auto}'],
];
for (const [name, source, expected] of checks) test(`portada reorganizada: ${name}`, () => expected.startsWith("NOT:") ? assert.ok(!source.includes(expected.slice(4))) : assert.ok(source.includes(expected), `Falta: ${expected}`));
test("portada reorganizada: imagen de empleos existe", () => assert.ok(existsSync(new URL("../public/featured/empleos.png", import.meta.url))));
