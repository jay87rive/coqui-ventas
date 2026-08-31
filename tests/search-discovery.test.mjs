import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const data = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const checks = [
  ["búsqueda 01: formulario con rol de búsqueda", page, 'className="search-panel" role="search"'],
  ["búsqueda 02: campo principal accesible", page, 'aria-label="Qué estás buscando"'],
  ["búsqueda 03: selector de pueblo accesible", page, 'aria-label="Pueblo"'],
  ["búsqueda 04: opción para toda la isla", page, 'Todo Puerto Rico'],
  ["búsqueda 05: comunica cobertura de 78 municipios", page, 'en los 78 municipios'],
  ["búsqueda 06: guarda búsquedas recientes localmente", page, 'coqui-recent-searches'],
  ["búsqueda 07: limita historial a cuatro búsquedas", page, '.slice(0, 4)'],
  ["búsqueda 08: lleva a resultados al buscar", page, 'getElementById("explorar")?.scrollIntoView'],
  ["búsqueda 09: permite limpiar texto de búsqueda", page, 'Limpiar búsqueda ×'],
  ["búsqueda 10: categorías son botones reales", page, 'onClick={() => category.name === "Huellitas de Amor" ? openHuellitas() : showCategoryListings(category.name)}'],
  ["búsqueda 11: categorías tienen nombre accesible", page, 'aria-label={`Explorar ${category.name}`}'],
  ["búsqueda 12: Marketplace apunta a categoría real", page, 'Marketplace: "Marketplace general"'],
  ["búsqueda 13: Arte apunta a categoría real", page, '"Arte y cultura": "Arte, talleres y eventos"'],
  ["búsqueda 14: selección de categoría aplica filtro", page, 'if (category) setFilterCategory(category.id)'],
  ["búsqueda 15: filtro rápido Todo", page, 'applyQuickFilter("all")'],
  ["búsqueda 16: filtro rápido Disponible", page, 'applyQuickFilter("available")'],
  ["búsqueda 17: filtro rápido Pendiente", page, 'applyQuickFilter("pending")'],
  ["búsqueda 18: filtro rápido Gratis", page, 'applyQuickFilter("free")'],
  ["búsqueda 19: filtro rápido Acepta ofertas", page, 'applyQuickFilter("offers")'],
  ["búsqueda 20: filtro rápido Publicado hoy", page, 'applyQuickFilter("recent")'],
  ["búsqueda 21: filtra por condición", page, 'listing.condition === filterCondition'],
  ["búsqueda 22: filtra por precio mínimo", page, 'price >= minimum'],
  ["búsqueda 23: filtra por precio máximo", page, 'price <= maximum'],
  ["búsqueda 24: advierte rango de precio inválido", page, 'El precio mínimo no puede ser mayor que el precio máximo.'],
  ["búsqueda 25: ordena precio menor a mayor", page, 'sortOrder === "price-low"'],
  ["búsqueda 26: ordena precio mayor a menor", page, 'sortOrder === "price-high"'],
  ["búsqueda 27: ordena Gratis primero", page, 'sortOrder === "free-first"'],
  ["búsqueda 28: ordena títulos A–Z", page, 'sortOrder === "title-az"'],
  ["búsqueda 29: ordena títulos Z–A", page, 'sortOrder === "title-za"'],
  ["búsqueda 30: opción Solo Gratis", page, 'checked={freeOnly}'],
  ["búsqueda 31: opción Acepta ofertas", page, 'checked={offersOnly}'],
  ["búsqueda 32: limpiar filtros restaura orden", page, 'setSortOrder("newest")'],
  ["búsqueda 33: muestra resumen de filtros", page, 'aria-live="polite"'],
  ["búsqueda 34: cada filtro puede quitarse como ficha", page, 'className="filter-chips"'],
  ["búsqueda 35: Pendiente permanece en resultados públicos", data, 'status=in.(available,pending,sold)'],
  ["búsqueda 36: Vendido se limita a 24 horas", data, '24 * 60 * 60 * 1000'],
  ["búsqueda 37: resultados vacíos explican qué hacer", page, 'No encontramos publicaciones con esos filtros'],
  ["búsqueda 38: resultados vacíos ofrecen restaurar todo", page, 'Ver todas las publicaciones'],
  ["búsqueda 39: permite vista tarjetas y compacta", page, 'aria-label="Vista compacta"'],
  ["búsqueda 40: carga ocho publicaciones adicionales", page, 'Ver 8 publicaciones más'],
];

for (const [name, source, expected] of checks) {
  test(name, () => assert.ok(source.includes(expected), `Falta: ${expected}`));
}
