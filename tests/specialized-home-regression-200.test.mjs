import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const pageContracts = [
  "Todo Puerto Rico,", "más cerca de ti.", "¿Qué estás buscando?", "Todo Puerto Rico", "Buscar",
  "¿Tienes algo para vender?", "Publicar un artículo", "✓ Publicar es fácil", "✓ Sin comisión por venta", "✓ Comunidad local",
  'className="hero-jobs-card"', 'src="/featured/empleos.png"', 'alt="Profesionales y trabajadores de Puerto Rico"', "fill priority", 'sizes="(max-width: 900px) 100vw, 48vw"',
  'aria-label={isEnglish ? "Jobs in Puerto Rico" : "Empleos en Puerto Rico"}', 'openJobs("candidate")', "Empleos en Puerto Rico", "Oportunidades claras y locales", "Encuentra el trabajo que estás buscando",
  "Salario visible · en los 78 municipios", "Buscar empleos", "Buscar candidatos", 'className="free-zone huellitas-home-zone"', 'id="huellitas-portada"', "🐾",
  "Adopción y rescate responsable", "Huellitas de Amor", "Adopta, encuentra un hogar responsable o ayuda a un animal rescatado.", "Conocer las Huellitas", "onClick={openHuellitas}",
  'id="categorias"', "Explora a tu manera", "Un lugar para todo lo nuestro", 'href="#explorar"', 'isEnglish ? "View all" : "Ver todas"',
  'className="category-grid"', "Marketplace", "Hecho en Puerto Rico", "Turismo y experiencias", "Arte y cultura",
  'aria-label={`Explorar ${category.name}`}', 'className="free-zone moved-free-zone"', 'id="gratis"', "Una sección para compartir", "Gratis",
  "Encuentra artículos que otras personas ofrecen sin costo en Puerto Rico.", "Ver artículos gratis →", "onClick={showFreeListings}", 'id="explorar"', "Destacados cerca de ti",
];

for (const [index, token] of pageContracts.entries()) {
  test(`${String(index + 1).padStart(3, "0")} portada especializada conserva: ${token.slice(0, 44)}`, () => assert.ok(page.includes(token), `Falta ${token}`));
}

const cssContracts = [
  ".hero-jobs-card{height:430px", "position:relative", "overflow:hidden", "border-radius:38px", "background:#10283c",
  "color:#fff", "box-shadow:0 28px 60px", "text-align:left", "isolation:isolate",
  ".hero-jobs-card:hover{transform:translateY(-4px)", ".hero-jobs-actions button{display:flex", ".hero-jobs-card>img{z-index:-3;object-fit:cover", "object-position:center",
  ".hero-jobs-card:hover>img{transform:scale(1.035)", ".hero-jobs-overlay{position:absolute", "linear-gradient(90deg", ".hero-jobs-badge{position:absolute", "border-radius:999px",
  "background:#f3b947", "text-transform:uppercase", ".hero-jobs-copy{position:absolute", "flex-direction:column", ".hero-jobs-copy strong{margin-top:9px",
  "font-family:Georgia,serif", "font-size:clamp(27px,3vw,42px)", ".hero-jobs-copy em{margin-top:13px", ".hero-jobs-actions{width:100%", "justify-content:space-between",
  ".huellitas-home-zone{min-height:310px", "background:#0b4c4a", ".huellitas-home-zone .eyebrow{color:#8ee0d3", ".huellitas-home-zone h2{margin:7px 0 9px;color:#fff", ".huellitas-home-zone p{max-width:450px",
  ".huellitas-home-copy button{display:flex", ".moved-free-zone{margin-top:0", "margin-bottom:76px", ".category-grid:has(+.moved-free-zone){margin-bottom:34px", "@media(max-width:900px){.hero-jobs-card{height:390px",
  "@media(max-width:620px){.hero-jobs-card{height:420px", "border-radius:24px", ".hero-jobs-card>img{object-position:60% center", "linear-gradient(0deg", ".hero-jobs-badge{top:18px;left:18px",
  ".hero-jobs-copy{top:auto;right:22px;bottom:22px;left:22px;width:auto}", ".hero-jobs-copy strong{max-width:320px;font-size:28px", ".hero-jobs-actions{margin-top:18px", ".moved-free-zone{margin-bottom:46px", ".free-zone>button{width:100%;padding:14px}",
];

for (const [index, token] of cssContracts.entries()) {
  test(`${String(index + 51).padStart(3, "0")} estilos especializados conservan: ${token.slice(0, 44)}`, () => assert.ok(css.includes(token), `Falta ${token}`));
}

const flowMarkers = [
  'className="hero"', 'className="hero-jobs-card"', 'id="huellitas-portada"', 'id="categorias"',
  'className="category-grid"', 'id="gratis"', 'id="explorar"', 'className="filter-panel section"',
  'className={`listing-grid section', 'className="safety section"', "<footer",
];
let orderNumber = 101;
for (let left = 0; left < flowMarkers.length; left += 1) {
  for (let right = left + 1; right < flowMarkers.length; right += 1) {
    const a = flowMarkers[left];
    const b = flowMarkers[right];
    test(`${String(orderNumber).padStart(3, "0")} orden visual: ${a} antes de ${b}`, () => {
      assert.ok(page.indexOf(a) >= 0, `No aparece ${a}`);
      assert.ok(page.indexOf(b) > page.indexOf(a), `${b} debe aparecer después de ${a}`);
    });
    orderNumber += 1;
  }
}

const integrityContracts = [
  ["sin tarjeta animada anterior", () => !page.includes('className="island-card"')],
  ["sin cuadrícula duplicada de servicios", () => !page.includes('className="primary-service-grid"')],
  ["Empleos no se repite en categorías", () => page.includes('!["Empleos", "Huellitas de Amor"].includes(category.name)')],
  ["Huellitas no se repite en categorías", () => page.includes('!["Empleos", "Huellitas de Amor"].includes(category.name)')],
  ["una entrada principal de Empleos", () => (page.match(/className="hero-jobs-card"/g) || []).length === 1],
  ["una franja Huellitas", () => (page.match(/id="huellitas-portada"/g) || []).length === 1],
  ["una franja Gratis", () => (page.match(/id="gratis"/g) || []).length === 1],
  ["un destino de categorías", () => (page.match(/id="categorias"/g) || []).length === 1],
  ["un destino de resultados", () => (page.match(/id="explorar"/g) || []).length === 1],
  ["Empleos ofrece dos botones", () => page.includes('className="hero-jobs-actions"') && page.includes('openJobs("candidate")') && page.includes('openJobs("employer")')],
  ["Huellitas es botón", () => page.includes('<button type="button" onClick={openHuellitas}>{isEnglish ? "Meet the Huellitas" : "Conocer las Huellitas"}')],
  ["Gratis es botón", () => page.includes('<button type="button" onClick={showFreeListings}>Ver artículos gratis')],
  ["Empleos limpia filtros", () => page.includes("clearFilters();\n    if (category) setFilterCategory(category.id);")],
  ["Gratis activa filtro exclusivo", () => page.includes("setFreeOnly(true);")],
  ["Gratis desactiva ofertas", () => page.includes("setOffersOnly(false);")],
  ["Gratis limpia precio mínimo", () => page.includes('setMinimumPrice("");')],
  ["Gratis limpia precio máximo", () => page.includes('setMaximumPrice("");')],
  ["Gratis ordena reciente", () => page.includes('setSortOrder("newest");')],
  ["Huellitas carga animales públicos", () => page.includes("setHuellitasAnimals(await getPublicAnimals())")],
  ["Huellitas comunica fallo", () => page.includes("No pudimos cargar Huellitas de Amor.")],
  ["Huellitas siempre termina carga", () => page.includes("finally { setHuellitasLoading(false); }")],
  ["hero Empleos tiene imagen prioritaria", () => page.includes("fill priority")],
  ["imagen Empleos usa sizes responsivo", () => page.includes('(max-width: 900px) 100vw, 48vw')],
  ["icono Huellitas decorativo", () => page.includes('<span className="huellitas-home-badge" aria-hidden="true">🐾</span>')],
  ["icono Gratis decorativo", () => page.includes('<span className="free-zone-icon" aria-hidden="true">🎁</span>')],
];
for (const [index, [name, predicate]] of integrityContracts.entries()) {
  test(`${String(index + 156).padStart(3, "0")} integridad: ${name}`, () => assert.ok(predicate(), name));
}

const assets = [
  ["Empleos", "../public/featured/empleos.png"], ["banner Huellitas", "../public/huellitas/launch-banner.png"],
  ["Luna", "../public/huellitas/luna.png"], ["Milo", "../public/huellitas/milo.png"],
  ["Nube", "../public/huellitas/nube.png"], ["Coco", "../public/huellitas/coco.png"],
  ["Manchitas", "../public/huellitas/manchitas.png"],
];
let assetNumber = 181;
for (const [name, relativePath] of assets) {
  const url = new URL(relativePath, import.meta.url);
  test(`${assetNumber++} recurso ${name} existe`, () => assert.ok(existsSync(url)));
  test(`${assetNumber++} recurso ${name} no está vacío`, () => assert.ok(statSync(url).size > 10_000));
}
const finalContracts = [
  ["Empleos usa PNG", () => page.includes('/featured/empleos.png')],
  ["Huellitas hero usa PNG", () => page.includes('/huellitas/hero.png')],
  ["Huellitas usa únicamente perfiles reales", () => page.includes("const huellitasFeed = huellitasAnimals") && !page.includes("demoHuellitasAnimals")],
  ["adopción particular permanece gratis", () => page.includes("Las adopciones particulares siempre serán gratis")],
  ["no se permite venta de animales", () => page.includes("No se permite vender animales")],
  ["instituciones deben estar verificadas", () => page.includes("Rescates institucionales verificados")],
];
for (const [name, predicate] of finalContracts) test(`${assetNumber++} cierre especializado: ${name}`, () => assert.ok(predicate(), name));

assert.equal(assetNumber, 201, "Este archivo debe registrar exactamente 200 pruebas");
