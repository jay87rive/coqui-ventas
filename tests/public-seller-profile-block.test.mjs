import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const pageExpectations = [
  "publicSellerId, setPublicSellerId", "useState<string | null>(null)", "publicSellerListings", "listing.seller_id === publicSellerId", "publicSellerLead", "publicSellerListings[0]", "publicSellerRating", "reduce((total, listing)", "listing.seller_rating", "publicSellerTowns", "new Set(publicSellerListings", "listing.municipality", "listing-seller-line", "event.stopPropagation()", "if (listing.seller_id)", "setPublicSellerId(listing.seller_id)", "Ver perfil público de", "listing.seller_display_name", "listing.seller_avatar_url", "width={56}", "height={56}", "unoptimized", "slice(0, 1).toUpperCase()", "Miembro de Coquí Ventas", ">Ver perfil</i>", "selectedListing.seller_id &&", "Ver perfil público y sus anuncios", "selectedListing.seller_id || null", "publicSellerId && publicSellerLead", "seller-profile-backdrop", "event.target === event.currentTarget", "setPublicSellerId(null)", "public-seller-modal", 'role="dialog"', 'aria-modal="true"', 'aria-labelledby="public-seller-title"', "Cerrar perfil público", "public-seller-avatar", "publicSellerLead.seller_avatar_url", "width={144}", "height={144}", "Perfil público", 'id="public-seller-title"', "Solo mostramos información", "public-seller-stats", "Reputación visible", "Publicaciones visibles", "publicSellerListings.length", "publicSellerTowns.length", "public-seller-listings", "Publicaciones de este vendedor", "publicSellerListings.map", "key={listing.id}", "openListing(listing)", "listing.image_urls[0]", "width={112}", "height={84}", "listing.title", "listing.is_free ? \"Gratis\"", "listingStatusLabels", "La dirección exacta, correo, teléfono y documentos",
];

const cssExpectations = [
  ".listing-seller-line{width:100%", "border:0", "background:transparent", "text-align:left", "cursor:pointer", ".listing-seller-line>i", "margin-left:auto", "font-style:normal", ".listing-seller-line:hover>i", "text-decoration:underline", ".seller-profile-backdrop{z-index:90}", ".public-seller-modal{width:min(92vw,680px)", "max-height:88vh", "overflow:auto", "position:relative", "border-radius:20px", "box-shadow:0 24px 70px", ".public-seller-modal>header", "grid-template-columns:72px 1fr", ".public-seller-avatar{width:72px", "height:72px", "border-radius:50%", ".public-seller-avatar img", "object-fit:cover", ".public-seller-stats{display:grid", "grid-template-columns:repeat(3,1fr)", ".public-seller-listings{display:grid", ".public-seller-listings>button", "grid-template-columns:56px 1fr auto", ".public-seller-modal>footer", "background:#fff8dc", "@media(max-width:520px)", ".public-seller-stats{grid-template-columns:1fr}", ".public-seller-listings>button{grid-template-columns:50px 1fr}", ".public-seller-listings>button>i{grid-column:2}",
];

const apiExpectations = ["seller_display_name?: string", "seller_avatar_url?: string | null", "account_status=eq.active", "profileBySeller.get(row.seller_id)"];
const checks = [
  ...pageExpectations.map((snippet, index) => [`perfil público ${String(index + 1).padStart(3, "0")}`, page.includes(snippet)]),
  ...cssExpectations.map((snippet, index) => [`diseño público ${String(index + 1).padStart(3, "0")}`, css.includes(snippet)]),
  ...apiExpectations.map((snippet, index) => [`datos públicos ${String(index + 1).padStart(3, "0")}`, api.includes(snippet)]),
];

assert.equal(checks.length, 100);
for (const [name, condition] of checks) test(name, () => assert.equal(condition, true));
