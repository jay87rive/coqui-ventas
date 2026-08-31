import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const checks = [
  ["01 avatar optimizer exists", api.includes("function optimizeAvatarImage")],
  ["02 optimizer validates image", api.includes('file.type.startsWith("image/")')],
  ["03 optimizer creates object URL", api.includes("URL.createObjectURL(file)")],
  ["04 optimizer loads browser image", api.includes("new Image()")],
  ["05 optimizer uses smallest side", api.includes("Math.min(image.naturalWidth, image.naturalHeight)")],
  ["06 optimizer centers horizontal crop", api.includes("image.naturalWidth - side")],
  ["07 optimizer centers vertical crop", api.includes("image.naturalHeight - side")],
  ["08 optimizer creates canvas", api.includes('document.createElement("canvas")')],
  ["09 avatar width is 512", api.includes("canvas.width = 512")],
  ["10 avatar height is 512", api.includes("canvas.height = 512")],
  ["11 optimizer uses high smoothing", api.includes('imageSmoothingQuality = "high"')],
  ["12 optimizer crops square", api.includes("sourceX, sourceY, side, side")],
  ["13 optimizer outputs JPEG", api.includes('"image/jpeg"')],
  ["14 optimizer uses quality compression", api.includes("0.86")],
  ["15 optimized filename is safe", api.includes('"avatar.jpg"')],
  ["16 object URL is revoked", api.includes("URL.revokeObjectURL(objectUrl)")],
  ["17 avatar upload function exists", api.includes("function uploadProfileAvatar")],
  ["18 path belongs to user", api.includes("`${userId}/avatar-${Date.now()}.jpg`")],
  ["19 upload targets public media", api.includes("/storage/v1/object/public-media/")],
  ["20 upload is authenticated", api.includes("Authorization: `Bearer ${token}`")],
  ["21 upload sends content type", api.includes('"Content-Type": file.type')],
  ["22 upload avoids overwrite policy dependency", !api.includes('"x-upsert": "true"')],
  ["23 upload body is file", api.includes("body: file")],
  ["24 upload errors are parsed", api.includes("if (!upload.ok) await parse(upload)")],
  ["25 public avatar URL is created", api.includes("/object/public/public-media/")],
  ["26 avatar URL has cache version", api.includes("?v=${Date.now()}")],
  ["27 profile is patched", api.includes("body: JSON.stringify({ avatar_url: avatarUrl })")],
  ["28 profile patch is owner scoped", api.includes("profiles?id=eq.${userId}")],
  ["29 avatar file state exists", page.includes("signupAvatarFile, setSignupAvatarFile")],
  ["30 avatar preview state exists", page.includes("signupAvatarPreview, setSignupAvatarPreview")],
  ["31 preparing state exists", page.includes("avatarPreparing, setAvatarPreparing")],
  ["32 avatar message state exists", page.includes("avatarMessage, setAvatarMessage")],
  ["33 signup uploads when session exists", page.includes("created?.access_token && created?.user?.id")],
  ["34 confirmation message explains final photo step", page.includes("terminar de guardar tu foto de perfil")],
  ["35 login uploads pending avatar", page.includes("uploadProfileAvatar(next.access_token, next.user.id")],
  ["36 upload failure does not block login", page.includes("Entraste correctamente, pero no pudimos guardar la foto")],
  ["37 selection validates MIME", page.includes("Selecciona una foto en formato de imagen")],
  ["38 selection limits original size", page.includes("12 * 1024 * 1024")],
  ["39 selection calls optimizer", page.includes("optimizeAvatarImage(file)")],
  ["40 selection gives preview", page.includes("setSignupAvatarPreview(URL.createObjectURL(optimized))")],
  ["41 photo can be removed", page.includes("function removeSignupAvatar")],
  ["42 picker only appears on signup", page.includes('authMode === "signup" && <section className="signup-avatar-picker"')],
  ["43 picker is accessible", page.includes('aria-label="Foto de perfil opcional"')],
  ["44 preview has helpful alt", page.includes("Vista previa de tu foto de perfil")],
  ["45 input accepts image formats", page.includes('accept="image/jpeg,image/png,image/webp,image/heic,image/heif"')],
  ["46 picker explains optional", page.includes("Opcional · Ayuda")],
  ["47 picker warns against documents", page.includes("No subas documentos")],
  ["48 picker has responsive style", css.includes("@media(max-width:420px){.signup-avatar-picker")],
  ["49 preview crops visually", css.includes("object-fit:cover")],
  ["50 hidden file input remains labelled", css.includes(".avatar-file-button input")],
];

assert.equal(checks.length, 50);
for (const [name, condition] of checks) test(name, () => assert.equal(condition, true));
