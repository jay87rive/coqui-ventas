import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");

const checks = [
  ["signup captures public display name", page.includes('name="display_name"')],
  ["signup keeps email private message", page.includes("tu correo permanece privado")],
  ["signup sends display name metadata", api.includes('data: { display_name: displayName.trim() }')],
  ["auth user is verified against Supabase", api.includes("function getAuthUser")],
  ["auth user endpoint is real", api.includes("`${url}/auth/v1/user`")],
  ["redirect access token is detected", page.includes('hash.get("access_token")')],
  ["redirect refresh token is detected", page.includes('hash.get("refresh_token")')],
  ["redirect type is detected", page.includes('hash.get("type")')],
  ["redirected token is validated", page.includes("getAuthUser(redirectedAccessToken)")],
  ["confirmed session is persisted", page.includes('window.localStorage.setItem("coqui-session", JSON.stringify(redirectedSession))')],
  ["sensitive URL fragment is removed", page.includes("window.history.replaceState({}, document.title")],
  ["recovery opens password update", page.includes('redirectType === "recovery"')],
  ["recovery has dedicated auth mode", page.includes('"update-password"')],
  ["password update requires a session", page.includes("El enlace de recuperación venció")],
  ["password update requires strength", page.includes("passwordScore < 4")],
  ["password update calls Supabase", page.includes("updatePassword(session.access_token, password)")],
  ["expired redirects are handled", page.includes("Ese enlace venció o ya fue utilizado")],
  ["email confirmation activates session", page.includes("Correo confirmado. Tu cuenta ya está activa")],
  ["stored session refresh is not raced", page.includes("saved && !redirectedAccessToken")],
  ["no service role secret is exposed", !api.includes("service_role")],
];

assert.equal(checks.length, 20);
for (const [name, condition] of checks) test(name, () => assert.equal(condition, true));
