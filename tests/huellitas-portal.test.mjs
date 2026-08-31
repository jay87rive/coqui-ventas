import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const checks = [
  ["nombre oficial", page, "Huellitas de Amor"], ["portal independiente", page, "huellitas-hub"],
  ["hero propio", page, "/huellitas/hero.png"], ["mensaje de hogar", page, "Cada historia merece un hogar seguro"],
  ["botón animales", page, "Ver animales disponibles"], ["botón para encontrar hogar", page, "Encontrarle un hogar"],
  ["adopción particular gratis", page, "Adopciones particulares: $0"], ["foto real visible", page, "Foto real y salud visible"],
  ["rescate verificado", page, "Rescates institucionales verificados"], ["filtro animal", page, "huellitasSpecies"],
  ["filtro pueblo", page, "huellitasTown"], ["perros", page, '<option value="dog">Perros</option>'],
  ["gatos", page, '<option value="cat">Gatos</option>'], ["aves", page, '<option value="bird">Aves</option>'],
  ["reptiles", page, '<option value="reptile">Reptiles</option>'], ["otros", page, '<option value="other">Otros</option>'],
  ["demostración honesta", page, "Aquí aparecerán únicamente perfiles reales disponibles para adopción"], ["no es tienda", page, "Huellitas no es una tienda de animales"],
  ["prohíbe venta", page, "No se permite vender animales"], ["prohíbe depósito", page, "no pueden exigir cuota, depósito ni donación"],
  ["cuota institucional limitada", page, "institutional_fee_allowed"], ["coquí no cobra", page, "Coquí Ventas no cobra por adoptar"],
  ["salud desconocida honesta", page, "Por confirmar"], ["vacunas", page, '[["Vacunas",animal.health.vaccinated]'],
  ["esterilización", page, '["Esterilización",animal.health.sterilized]'], ["evaluación veterinaria", page, '["Veterinario",animal.health.veterinarian_evaluated]'],
  ["solo disponibles", api, "status=eq.available"], ["consulta fotos", api, "animal_images"],
  ["consulta salud", api, "animal_health"], ["consulta rescate", api, "rescue_profiles"],
  ["bucket privado", api, "animal-images"], ["objeto autenticado", api, "/storage/v1/object/authenticated/"],
  ["portal prioritario", css, ".huellitas-backdrop{z-index:110"], ["hero adaptable", css, ".huellitas-hero"],
  ["tarjetas animales", css, ".huellitas-card"], ["fotos con cobertura", css, ".huellitas-photo img{object-fit:cover}"],
  ["reglas visibles", css, ".huellitas-rules"], ["móvil", css, "@media(max-width:760px)"],
  ["móvil una columna", css, ".huellitas-filters,.huellitas-grid,.huellitas-rules{grid-template-columns:1fr}"],
  ["familias pueden publicar", page, "¿Ya no puedes cuidarlo?"], ["prevención de abandono", page, "antes de que termine en la calle"],
  ["publicación familiar gratis", page, "Las adopciones particulares siempre serán gratis"], ["fuente real", page, "const huellitasFeed = huellitasAnimals"],
  ["sin Luna ficticia", page, "Todavía no hay animales publicados"], ["carga real", page, "getPublicAnimals"],
  ["estado vacío real", page, "únicamente perfiles reales"], ["fotos reales", page, "Foto real pendiente"],
  ["solo disponibles reales", api, "status=eq.available"], ["origen transparente", page, "rescue?.public_name"],
  ["familia particular visible", page, '"Familia particular"'], ["rescate comunitario visible", page, '"Rescate comunitario"'],
  ["organización visible", page, '"Organización de rescate"'], ["audiencia adaptable", css, ".huellitas-audience{grid-template-columns:1fr}"],
  ["institución sin fines de lucro visible", page, '"Institución sin fines de lucro"'],
  ["cuota institucional real", page, "verifiedFee"], ["explicación real", page, "adoption_fee_explanation"],
  ["permiso institucional validado", page, "institutional_fee_allowed"],
  ["verificación institucional", page, 'verification_status === "verified"'],
  ["explica salud", page, "animal.health.vaccinated"],
  ["explica cuota", page, "huellitas-fee-explanation"],
  ["guía de cuotas", page, "Cuotas institucionales transparentes"], ["no es venta", page, "No es venta del animal"],
  ["no permite donación obligatoria", page, "donación adicional obligatoria"],
  ["tarjeta institucional distintiva", css, ".huellitas-card.institutional"], ["explicación de cuota distintiva", css, ".huellitas-fee-explanation"],
];

for (const [name, source, expected] of checks) test(`Huellitas: ${name}`, () => assert.ok(source.includes(expected), `Falta: ${expected}`));
test("Huellitas: imagen hero existe", () => assert.ok(existsSync(new URL("../public/huellitas/hero.png", import.meta.url))));
for (const name of ["luna", "milo", "nube", "coco", "manchitas"]) test(`Huellitas: imagen ${name} existe`, () => assert.ok(existsSync(new URL(`../public/huellitas/${name}.png`, import.meta.url))));
