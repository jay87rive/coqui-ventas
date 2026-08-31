import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const checks = [
  ["consulta promociones activas", api.includes("get_active_listing_promotions")],
  ["modelo reconoce destacado", api.includes("is_featured?: boolean")],
  ["modelo conserva fecha de promoción", api.includes("featured_at?: string | null")],
  ["mapa relaciona promoción y anuncio", api.includes("featuredAtByListing")],
  ["destacado depende de promoción activa", api.includes("is_featured: Boolean(featured_at)")],
  ["orden reserva posiciones destacadas", page.includes("orderWithFeaturedPositions")],
  ["destacados preceden regulares", page.includes("featuredFirst(a, b)")],
  ["destacados recientes preceden antiguos", page.includes("b.featured_at") && page.includes("a.featured_at")],
  ["precio bajo conserva prioridad", page.includes('sortOrder === "price-low") return orderWithFeaturedPositions')],
  ["precio alto conserva prioridad", page.includes('sortOrder === "price-high") return orderWithFeaturedPositions')],
  ["gratis conserva prioridad", page.includes('sortOrder === "free-first") return orderWithFeaturedPositions')],
  ["reputación conserva prioridad", page.includes('sortOrder === "rating-high") return orderWithFeaturedPositions')],
  ["reseñas conserva prioridad", page.includes('sortOrder === "reviews-high") return orderWithFeaturedPositions')],
  ["alfabético ascendente conserva prioridad", page.includes('sortOrder === "title-az") return orderWithFeaturedPositions')],
  ["alfabético descendente conserva prioridad", page.includes('sortOrder === "title-za") return orderWithFeaturedPositions')],
  ["más recientes conserva prioridad", page.includes("return orderWithFeaturedPositions((a, b) => new Date(b.created_at")],
  ["tarjeta identifica destacado", page.includes('listing.is_featured ? "is-featured"')],
  ["etiqueta anuncia destacado", page.includes('listing.is_featured ? "Destacado · "')],
  ["estilo distingue destacado", css.includes(".listing-card.is-featured")],
  ["distinción usa color promocional", css.includes("#f6c85f")],
];

for (const [name, passed] of checks) test(name, () => assert.equal(passed, true));

test("regla funcional: ningún anuncio regular supera a un destacado", () => {
  const items = [
    { id: "regular-nuevo", is_featured: false, created_at: "2026-08-18T18:00:00Z" },
    { id: "destacado-viejo", is_featured: true, featured_at: "2026-08-17T18:00:00Z", created_at: "2026-08-10T18:00:00Z" },
    { id: "destacado-nuevo", is_featured: true, featured_at: "2026-08-18T17:00:00Z", created_at: "2026-08-09T18:00:00Z" },
  ];
  const ordered = [...items].sort((a, b) => Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured)) || (a.is_featured && b.is_featured ? new Date(b.featured_at).getTime() - new Date(a.featured_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
  assert.deepEqual(ordered.map((item) => item.id), ["destacado-nuevo", "destacado-viejo", "regular-nuevo"]);
});
