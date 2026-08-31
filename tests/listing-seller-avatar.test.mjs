import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const checks = [
  ["01 listing exposes seller name", api.includes("seller_display_name?: string")],
  ["02 listing exposes seller avatar", api.includes("seller_avatar_url?: string | null")],
  ["03 public listings collect sellers", api.includes("const sellerIds = [...new Set")],
  ["04 missing seller ids are removed", api.includes("filter((id): id is string => Boolean(id))")],
  ["05 profiles query is conditional", api.includes("sellerIds.length")],
  ["06 profile query requests id", api.includes("select=id,display_name,avatar_url")],
  ["07 profile query requests display name", api.includes("display_name,avatar_url&id=in")],
  ["08 profile query batches ids", api.includes('sellerIds.join(",")')],
  ["09 profile query restricts active users", api.includes("account_status=eq.active")],
  ["10 profile query avoids cached avatar", api.includes('cache: "no-store"')],
  ["11 profile failure preserves listings", api.includes(".catch(() => [])")],
  ["12 profile map is built", api.includes("const profileBySeller = new Map")],
  ["13 seller profile is resolved per listing", api.includes("profileBySeller.get(row.seller_id)")],
  ["14 name is attached to listing", api.includes("seller_display_name: sellerProfile?.display_name")],
  ["15 avatar is attached to listing", api.includes("seller_avatar_url: sellerProfile?.avatar_url")],
  ["16 safe name fallback exists", api.includes('"Miembro de Coquí Ventas"')],
  ["17 safe avatar fallback is null", api.includes("sellerProfile?.avatar_url || null")],
  ["18 cards render seller line", page.includes('className="listing-seller-line"')],
  ["19 cards test avatar URL", page.includes("listing.seller_avatar_url ?")],
  ["20 cards use Next image", page.includes("src={listing.seller_avatar_url}")],
  ["21 card seller control has accessible label", page.includes('aria-label={`Ver perfil público de ${listing.seller_display_name')],
  ["22 card avatar has fixed dimensions", page.includes("width={56} height={56}")],
  ["23 external avatar bypasses optimizer", page.includes("width={56} height={56} unoptimized")],
  ["24 card has initials fallback", page.includes('.slice(0, 1).toUpperCase()')],
  ["25 card shows seller name", page.includes('listing.seller_display_name || "Miembro de Coquí Ventas"')],
  ["26 detail accepts live profile avatar", page.includes("sellerProfile?.avatar_url || selectedListing.seller_avatar_url")],
  ["27 detail falls back to listing avatar", page.includes("selectedListing.seller_avatar_url ||")],
  ["28 detail image has accessible alt", page.includes('alt={`Foto de ${sellerProfile?.display_name')],
  ["29 detail avatar has dimensions", page.includes("width={104} height={104}")],
  ["30 detail name falls back to listing", page.includes("sellerProfile?.display_name || selectedListing.seller_display_name")],
  ["31 card seller line is flex", css.includes(".listing-seller-line{display:flex")],
  ["32 card line separates content", css.includes("border-top:1px solid var(--line)")],
  ["33 card avatar is round", css.includes("border-radius:50%")],
  ["34 card avatar is clipped", css.includes("overflow:hidden")],
  ["35 card avatar remains fixed", css.includes("flex:0 0 auto")],
  ["36 card and detail images cover", css.includes(".listing-seller-line img,.seller-avatar img")],
  ["37 images use object fit cover", css.includes("object-fit:cover")],
  ["38 long seller names truncate", css.includes("text-overflow:ellipsis")],
  ["39 seller name stays one line", css.includes("white-space:nowrap")],
  ["40 detail avatar clips image", css.includes(".seller-avatar{overflow:hidden}")],
];

assert.equal(checks.length, 40);
for (const [name, condition] of checks) test(name, () => assert.equal(condition, true));
