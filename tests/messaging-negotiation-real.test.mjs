import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const rest = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const migration = readFileSync(new URL("../supabase/migrations/20260824214500_create_offer_rpc_with_notification.sql", import.meta.url), "utf8");

test("las ofertas del chat se limitan a la publicación y a la otra persona", () => {
  assert.match(page, /offer\.listing_id === conversation\.listing_id/);
  assert.match(page, /offer\.buyer_id === conversation\.other_user_id \|\| offer\.seller_id === conversation\.other_user_id/);
});

test("crear una oferta usa una RPC autoritativa y no inserta participantes desde el navegador", () => {
  assert.match(rest, /\/rpc\/create_offer/);
  assert.doesNotMatch(rest, /fetch\(`\$\{url\}\/rest\/v1\/offers`, \{\s*method: "POST"/);
  assert.match(migration, /v_listing\.seller_id, v_actor/);
});

test("la RPC crea el chat y avisa al vendedor en la misma transacción", () => {
  assert.match(migration, /perform public\.start_listing_conversation\(p_listing_id\)/);
  assert.match(migration, /'Nueva oferta'/);
  assert.match(migration, /insert into public\.notifications/);
});

test("el cliente actualiza ofertas y conversaciones después de enviar", () => {
  assert.match(page, /getMyOffers\(session\.access_token, session\.user\.id\)/);
  assert.match(page, /getMyConversations\(session\.access_token, session\.user\.id\)/);
  assert.match(page, /guardada en el chat/);
});

test("la tabla de ofertas queda de lectura y las mutaciones pasan por RPC", () => {
  assert.match(migration, /revoke insert, update, delete on table public\.offers from anon, authenticated/);
  assert.match(migration, /grant execute on function public\.create_offer\(uuid, numeric\) to authenticated/);
});
