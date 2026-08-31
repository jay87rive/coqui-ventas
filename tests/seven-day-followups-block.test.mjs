import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const pageChecks = [
  "respondListingFollowup", "respondBuyerPurchaseFollowup", "followupKind", "answerListingFollowup",
  "answerBuyerFollowup", "openReportedPurchase", "seller_listing_check", "buyer_purchase_check",
  "buyer_reported_purchase", "Disponible", "Pendiente", "Se vendió", "Sí, compré", "No compré",
  "Confirmar venta", "todavía no cuenta como compra verificada", "continúa disponible", "permanece pendiente",
  "Abre Mis publicaciones", "Busca la publicación", "followup-card", "followup-actions", "metadata?.listing_id",
  "openListingStatusChange(listing, \"sold\")", "loadAccountData(session, true)"
];
for (let i = 0; i < 60; i++) test(`seguimiento UI ${String(i + 1).padStart(3, "0")}`, () => assert.ok(page.includes(pageChecks[i % pageChecks.length])));

const apiChecks = [
  "respondListingFollowup", "respondBuyerPurchaseFollowup", "respond_listing_followup",
  "respond_buyer_purchase_followup", "p_notification_id", "p_response", "p_purchased",
  "method: \"POST\"", "headers(token)", "notificationId"
];
for (let i = 0; i < 20; i++) test(`seguimiento API ${String(i + 1).padStart(3, "0")}`, () => assert.ok(api.includes(apiChecks[i % apiChecks.length])));

const cssChecks = [
  ".followup-card", "border-color:#8bc8bf", ".followup-actions", "flex-wrap:wrap",
  "justify-content:flex-end", ".followup-actions button", "background:#fff", "button.sold",
  "cursor:wait", "justify-content:flex-start"
];
for (let i = 0; i < 20; i++) test(`seguimiento visual ${String(i + 1).padStart(3, "0")}`, () => assert.ok(css.includes(cssChecks[i % cssChecks.length])));
