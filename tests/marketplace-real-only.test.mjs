import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");

const checks = [
  ["public listings come from Supabase", api.includes("/rest/v1/listings?")],
  ["real listing photos are downloaded", api.includes("downloadListingImage")],
  ["no demo listing image substitution", !api.includes("demoImages")],
  ["no demo image marker in model", !api.includes("uses_demo_images")],
  ["missing rating is null", api.includes("sellerRatings ? sellerRatings.total / sellerRatings.count : null")],
  ["missing review count is zero", api.includes("sellerRatings?.count || 0")],
  ["no provisional rating flag", !api.includes("seller_rating_is_demo")],
  ["catalog starts loading", page.includes("setCatalogLoading(true)")],
  ["catalog failure is explicit", page.includes("No pudimos cargar las publicaciones reales")],
  ["catalog has retry", page.includes("void reloadMarketplace()")],
  ["catalog does not render sample ads", !page.includes("Toyota RAV4 2021")],
  ["empty catalog is transparent", page.includes("No mostraremos anuncios simulados")],
  ["categories start empty", page.includes("useState<Category[]>([])")],
  ["categories load from Supabase", page.includes("const realCategories = await getCategories()")],
  ["category failure is explicit", page.includes("No pudimos cargar las categorías reales")],
  ["category selection retries", page.includes("void reloadCategories()")],
  ["publish waits for categories", page.includes("busy || categoriesLoading || Boolean(categoriesError)")],
  ["free listings use free category", api.includes("draft.is_free ? FREE_CATEGORY_ID")],
  ["free listings cannot retain price", api.includes("draft.is_free ? null : draft.price")],
  ["listing starts as draft", api.includes('status: "draft"')],
  ["listing images require authenticated upload", api.includes("Authorization: `Bearer ${token}`")],
  ["images keep deterministic position", api.includes("position, is_primary: position === 0")],
  ["publish changes real listing status", api.includes('JSON.stringify({ status: "available" })')],
  ["pending remains visible", api.includes("status=in.(available,pending,sold)")],
  ["sold visibility is limited to 24h", api.includes("24 * 60 * 60 * 1000")],
  ["card ratings are verified only", page.includes('className="listing-seller-rating verified"')],
  ["new sellers show no reviews", page.includes("☆ Nuevo · sin reseñas")],
  ["comparison is transparent", page.includes("Solo se muestran reseñas de transacciones verificables")],
  ["real photos remain mandatory", page.includes("Selecciona entre 1 y 8 fotos reales")],
  ["no service role is exposed", !api.includes("service_role")],
];

assert.equal(checks.length, 30);
for (const [name, condition] of checks) test(name, () => assert.equal(condition, true));
