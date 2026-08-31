import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const sql = readFileSync(new URL("../supabase/migrations/20260825013000_prelaunch_hardening.sql", import.meta.url), "utf8");

const checks = [
  ["índice de vistas por candidato", sql.includes("job_profile_views_candidate_id_idx")],
  ["índice de vistas por patrono", sql.includes("job_profile_views_employer_id_idx")],
  ["RPC de cierre autenticado", sql.includes("request_account_deletion()")],
  ["cierre exige autenticación", sql.includes("Authentication required")],
  ["cierre retira publicaciones activas", sql.includes("status = 'removed'")],
  ["ventas permanecen en historial", sql.includes("status not in ('sold', 'removed')")],
  ["cierre elimina favoritos", sql.includes("delete from public.favorites")],
  ["cierre desactiva dispositivos", sql.includes("is_active = false")],
  ["perfil se anonimiza", sql.includes("Miembro retirado")],
  ["cuenta queda cerrada", sql.includes("account_status = 'deleted'")],
  ["anon no puede cerrar cuentas", sql.includes("from public, anon")],
  ["panel admin verifica autorización", sql.includes("not private.is_admin()")],
  ["panel admin resume reportes", sql.includes("reports_open")],
  ["panel admin resume disputas", sql.includes("disputes_open")],
  ["API expone cierre seguro", api.includes("requestAccountDeletion")],
  ["API expone panel admin", api.includes("getCoquiAdminDashboard")],
  ["panel admin no aparece sin autorización", page.includes("adminDashboard &&")],
  ["cierre requiere palabra de confirmación", page.includes('accountDeletionConfirmation !== "CERRAR"')],
  ["interfaz explica anonimización", page.includes("Cerrar y anonimizar mi cuenta")],
  ["interfaz preserva historial necesario", page.includes("Conservamos ventas, mensajes y reportes")],
  ["cierre termina sesión local", page.includes("clearLocalSession(\"Tu cuenta fue cerrada")],
  ["tablero tiene seis métricas", (page.match(/adminDashboard\./g) || []).length >= 6],
  ["estilos de zona peligrosa", css.includes(".account-danger-zone")],
  ["estilos del tablero admin", css.includes(".coqui-admin-panel")],
  ["tablero se adapta a móvil", css.includes(".coqui-admin-grid{grid-template-columns:1fr 1fr}")],
  ["logo evita optimizador incompatible en producción", page.includes('src="/branding/coqui-ventas-mark.png" alt="" width={345} height={349} priority unoptimized')],
  ["imagen de Empleos se sirve directamente", page.includes('src="/featured/empleos.png" alt="Profesionales y trabajadores de Puerto Rico" fill priority sizes="(max-width: 900px) 100vw, 48vw" unoptimized')],
  ["hero de Huellitas se sirve directamente", page.includes('src="/huellitas/hero.png" alt="Perro y gato rescatados en un patio tropical" fill priority sizes="(max-width: 760px) 100vw, 1100px" unoptimized')],
];

for (const [name, condition] of checks) test(name, () => assert.equal(condition, true));
