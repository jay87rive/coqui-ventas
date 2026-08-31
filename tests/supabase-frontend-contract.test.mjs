import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const migration = readFileSync(new URL("../supabase/migrations/20260824190000_frontend_backend_contract.sql", import.meta.url), "utf8");

const checks = [
  ["usa la URL real de Coquí Ventas", "sexbivrfdpbhvdgsvgwv.supabase.co", api],
  ["usa una llave publicable, nunca service_role", "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", api],
  ["consulta publicaciones reales", "/rest/v1/listings?", api],
  ["consulta categorías reales", "/rest/v1/categories?", api],
  ["consulta perfiles públicos reales", "/rest/v1/profiles?", api],
  ["consulta animales reales", "/rest/v1/animals?", api],
  ["consulta empleos publicados reales", "/rest/v1/jobs?", api],
  ["incluye patronos verificados", "employers(public_name)", api],
  ["incluye compensación visible", "job_compensation(compensation_type", api],
  ["mapea empleos de Supabase", "export async function getPublicJobs", api],
  ["carga empleos al abrir el portal", "getPublicJobs().then", page],
  ["prefiere empleos reales", "const jobsFeed = liveJobs", page],
  ["identifica oportunidades reales", "Oportunidades reales", page],
  ["no mezcla datos simulados", "const candidateFeed = quickClickApplications", page],
  ["habilita perfiles públicos con RLS", "grant select on table public.profiles to anon", migration],
  ["habilita Huellitas verificadas con RLS", "grant select on table public.rescue_profiles to anon", migration],
  ["habilita patronos verificados con RLS", "employers_public_read_anon", migration],
  ["protege fotos mediante función privada", "private.can_read_listing_image", migration],
  ["conserva vendidos visibles por 24 horas", "interval '24 hours'", migration],
  ["corrige políticas cruzadas de Storage", "private.can_read_cultural_event_image", migration],
];

for (const [name, token, source] of checks) test(name, () => assert.ok(source.includes(token)));
test("no expone service_role en el cliente", () => assert.equal(api.includes("service_role"), false));
