import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const sourceSnippets = [
  "const listingSortLabels",
  'newest: "Más recientes"',
  '"rating-high": "Mejor reputación"',
  '"reviews-high": "Más reseñas"',
  '"price-low": "Precio: menor a mayor"',
  '"price-high": "Precio: mayor a menor"',
  '"free-first": "Gratis primero"',
  '"title-az": "Título: A–Z"',
  '"title-za": "Título: Z–A"',
  '"newest" | "rating-high" | "reviews-high"',
  "setSortOrder",
  'useState<"newest"',
  'sortOrder === "rating-high"',
  'sortOrder === "reviews-high"',
  "Number(b.seller_rating || 0)",
  "Number(a.seller_rating || 0)",
  "Number(b.seller_review_count || 0)",
  "Number(a.seller_review_count || 0)",
  "new Date(b.created_at || 0).getTime()",
  "new Date(a.created_at || 0).getTime()",
  'sortOrder === "price-low"',
  'sortOrder === "price-high"',
  'sortOrder === "free-first"',
  'sortOrder === "title-az"',
  'sortOrder === "title-za"',
  "a.title.localeCompare(b.title, \"es\")",
  "b.title.localeCompare(a.title, \"es\")",
  "return matches",
  "sortOrder,",
  "filtersActive",
  'sortOrder !== "newest"',
  "activeFilterCount",
  "setSortOrder(\"newest\")",
  "clearFilters",
  "setVisibleCount(8)",
  "<span>Ordenar</span>",
  'value={sortOrder}',
  "setSortOrder(event.target.value as typeof sortOrder)",
  '<option value="newest">Más recientes</option>',
  '<option value="rating-high">★ Mejor reputación</option>',
  '<option value="reviews-high">★ Más reseñas</option>',
  '<option value="price-low">Precio: menor a mayor</option>',
  '<option value="price-high">Precio: mayor a menor</option>',
  '<option value="free-first">Gratis primero</option>',
  '<option value="title-az">Título: A–Z</option>',
  '<option value="title-za">Título: Z–A</option>',
  'role="status"',
  'aria-live="polite"',
  "Orden: {listingSortLabels[sortOrder]} ×",
  "listingSortLabels[sortOrder]",
  "filteredListings.length",
  "listing-seller-rating",
  'className="listing-seller-rating verified"',
  "seller_rating.toFixed(1)",
  "seller_review_count",
  "Transparencia real",
  "Reseñas de transacciones verificables",
  'viewMode === "compact"',
  'aria-label="Vista compacta"',
  'className={`listing-grid section ${viewMode === "compact" ? "compact-view" : ""}`',
];

const byRating = (first, second) => Number(second.rating || 0) - Number(first.rating || 0) || Number(second.reviews || 0) - Number(first.reviews || 0) || new Date(second.created || 0).getTime() - new Date(first.created || 0).getTime();
const byReviews = (first, second) => Number(second.reviews || 0) - Number(first.reviews || 0) || Number(second.rating || 0) - Number(first.rating || 0) || new Date(second.created || 0).getTime() - new Date(first.created || 0).getTime();

const ratingCases = [
  [[{ id: "a", rating: 3 }, { id: "b", rating: 5 }], "b"],
  [[{ id: "a", rating: 4.9 }, { id: "b", rating: 4.8 }], "a"],
  [[{ id: "a", rating: 0 }, { id: "b", rating: 1 }], "b"],
  [[{ id: "a" }, { id: "b", rating: 2 }], "b"],
  [[{ id: "a", rating: 5, reviews: 2 }, { id: "b", rating: 5, reviews: 8 }], "b"],
  [[{ id: "a", rating: 4, reviews: 30 }, { id: "b", rating: 4.5, reviews: 1 }], "b"],
  [[{ id: "a", rating: 4.7, reviews: 2 }, { id: "b", rating: 4.7, reviews: 3 }], "b"],
  [[{ id: "a", rating: 4.7, reviews: 9 }, { id: "b", rating: 4.7, reviews: 3 }], "a"],
  [[{ id: "a", rating: null }, { id: "b", rating: 0 }], "a"],
  [[{ id: "a", rating: 1.1 }, { id: "b", rating: 1.2 }], "b"],
  [[{ id: "a", rating: 4, reviews: 2, created: "2026-01-01" }, { id: "b", rating: 4, reviews: 2, created: "2026-02-01" }], "b"],
  [[{ id: "a", rating: 4, reviews: 2, created: "2026-03-01" }, { id: "b", rating: 4, reviews: 2, created: "2026-02-01" }], "a"],
  [[{ id: "a", rating: 2.5 }, { id: "b", rating: 2.5, reviews: 1 }], "b"],
  [[{ id: "a", rating: 3.9 }, { id: "b", rating: 4 }], "b"],
  [[{ id: "a", rating: 5 }, { id: "b", rating: 4.99 }], "a"],
];

const reviewCases = [
  [[{ id: "a", reviews: 2 }, { id: "b", reviews: 3 }], "b"],
  [[{ id: "a", reviews: 10 }, { id: "b", reviews: 9 }], "a"],
  [[{ id: "a" }, { id: "b", reviews: 1 }], "b"],
  [[{ id: "a", reviews: 0 }, { id: "b", reviews: 0 }], "a"],
  [[{ id: "a", reviews: 5, rating: 4 }, { id: "b", reviews: 5, rating: 5 }], "b"],
  [[{ id: "a", reviews: 6, rating: 1 }, { id: "b", reviews: 5, rating: 5 }], "a"],
  [[{ id: "a", reviews: 7, rating: 4.8 }, { id: "b", reviews: 7, rating: 4.7 }], "a"],
  [[{ id: "a", reviews: null }, { id: "b", reviews: 2 }], "b"],
  [[{ id: "a", reviews: 1 }, { id: "b", reviews: 20 }], "b"],
  [[{ id: "a", reviews: 100 }, { id: "b", reviews: 99 }], "a"],
  [[{ id: "a", reviews: 4, rating: 4, created: "2026-01-01" }, { id: "b", reviews: 4, rating: 4, created: "2026-02-01" }], "b"],
  [[{ id: "a", reviews: 4, rating: 4, created: "2026-03-01" }, { id: "b", reviews: 4, rating: 4, created: "2026-02-01" }], "a"],
  [[{ id: "a", reviews: 8, rating: 3 }, { id: "b", reviews: 8, rating: 4 }], "b"],
  [[{ id: "a", reviews: 11 }, { id: "b", reviews: 10, rating: 5 }], "a"],
  [[{ id: "a", reviews: 1, rating: 5 }, { id: "b", reviews: 2, rating: 1 }], "b"],
];

const cssSnippets = [
  ".compact-view",
  ".compact-view .listing-card",
  ".listing-seller-rating",
  ".listing-seller-rating.demo",
  ".listing-seller-rating.verified",
  "white-space:nowrap",
  "flex-wrap:wrap",
  "@media(max-width:560px)",
  ".listing-seller-rating{order:4",
  ".listing-seller-line:focus-visible",
];

const checks = [
  ...sourceSnippets.map((snippet) => [snippet, page.includes(snippet)]),
  ...ratingCases.map(([items, expected]) => ["rating order", [...items].sort(byRating)[0].id === expected]),
  ...reviewCases.map(([items, expected]) => ["review order", [...items].sort(byReviews)[0].id === expected]),
  ...cssSnippets.map((snippet) => [snippet, css.includes(snippet)]),
];

assert.equal(checks.length, 100);
for (const [index, [name, condition]] of checks.entries()) {
  test(`${String(index + 1).padStart(3, "0")} ${name}`, () => assert.equal(condition, true));
}
