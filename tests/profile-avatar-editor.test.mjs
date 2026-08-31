import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const checks = [
  ["01 profile query includes avatar", api.includes("display_name,avatar_url,municipality")],
  ["02 avatar state belongs to profile", page.includes('avatar_url: "", municipality')],
  ["03 loaded profile restores avatar", page.includes('avatar_url: profile?.avatar_url || ""')],
  ["04 editor is visible in profile", page.includes('className="profile-avatar-editor"')],
  ["05 editor has accessible name", page.includes('aria-label="Foto de perfil"')],
  ["06 current avatar is displayed", page.includes('alt="Tu foto de perfil actual"')],
  ["07 initials remain fallback", page.includes('<span>{publicProfileInitials || "CV"}</span>')],
  ["08 add photo label exists", page.includes('"Agregar foto"')],
  ["09 change photo label exists", page.includes('"Cambiar foto"')],
  ["10 remove photo button exists", page.includes('>Quitar foto</button>')],
  ["11 profile accepts image types", page.includes('accept="image/jpeg,image/png,image/webp,image/heic,image/heif"')],
  ["12 profile picker is disabled while busy", page.includes('disabled={profileAvatarBusy || !accountCanWrite}')],
  ["13 input clears after selection", page.includes('event.currentTarget.value = ""')],
  ["14 image handler exists", page.includes("function handleProfileAvatarChange")],
  ["15 remove handler exists", page.includes("function handleProfileAvatarRemove")],
  ["16 MIME is validated", page.includes('if (!file.type.startsWith("image/"))')],
  ["17 original size is limited", page.includes("file.size > 12 * 1024 * 1024")],
  ["18 photo is optimized", page.includes("optimizeAvatarImage(file)")],
  ["19 optimized photo is uploaded", page.includes("uploadProfileAvatar(session.access_token, session.user.id, optimized)")],
  ["20 state updates after upload", page.includes("avatar_url: result.avatarUrl")],
  ["21 successful upload is announced", page.includes("Tu foto de perfil se actualizó correctamente")],
  ["22 failure is announced", page.includes("No pudimos guardar la foto")],
  ["23 remove API exists", api.includes("function removeProfileAvatar")],
  ["24 remove API scopes owner", api.includes("profiles?id=eq.${userId}")],
  ["25 remove API clears URL", api.includes("JSON.stringify({ avatar_url: null })")],
  ["26 remove handler calls API", page.includes("removeProfileAvatar(session.access_token, session.user.id)")],
  ["27 state clears after removal", page.includes('avatar_url: ""')],
  ["28 successful removal is announced", page.includes("Quitamos la foto de tu perfil")],
  ["29 profile preview uses avatar", page.includes('alt="Foto de perfil"')],
  ["30 external avatar image is unoptimized", page.includes('alt="Foto de perfil" width={96} height={96} unoptimized')],
  ["31 upload uses unique object path", api.includes("avatar-${Date.now()}.jpg")],
  ["32 upload avoids upsert", !api.includes('"x-upsert": "true"')],
  ["33 upload only needs insert policy", api.includes('method: "POST"')],
  ["34 upload remains authenticated", api.includes("Authorization: `Bearer ${token}`")],
  ["35 profile patch returns row", api.includes('Prefer: "return=representation"')],
  ["36 editor has rounded card", css.includes(".profile-avatar-editor{display:grid")],
  ["37 large avatar is round", css.includes(".profile-avatar-large{width:80px;height:80px")],
  ["38 large avatar crops image", css.includes(".profile-avatar-large img{width:100%;height:100%;object-fit:cover}")],
  ["39 preview avatar crops image", css.includes(".profile-preview-avatar img{width:100%;height:100%;object-fit:cover}")],
  ["40 actions wrap on mobile", css.includes(".profile-avatar-actions{display:flex;flex-wrap:wrap")],
  ["41 message spans editor", css.includes(".profile-avatar-editor .avatar-message{grid-column:1/-1}")],
  ["42 disabled controls look disabled", css.includes("label:has(input:disabled)")],
  ["43 small screen layout exists", css.includes("@media(max-width:420px){.profile-avatar-editor")],
  ["44 small avatar size exists", css.includes(".profile-avatar-large{width:64px;height:64px}")],
  ["45 helper copy mentions optimization", page.includes("La recortamos y optimizamos automáticamente")],
  ["46 helper copy protects privacy", page.includes("No subas documentos ni información privada")],
  ["47 status message is live", page.includes('className="avatar-message" role="status"')],
  ["48 busy label is visible", page.includes('profileAvatarBusy ? "Procesando…"')],
  ["49 editor respects account permissions", page.includes("profileAvatarBusy || !accountCanWrite")],
  ["50 avatar persists independently of profile form", page.includes("handleProfileAvatarChange(event.target.files?.[0])")],
];

assert.equal(checks.length, 50);
for (const [name, condition] of checks) test(name, () => assert.equal(condition, true));
