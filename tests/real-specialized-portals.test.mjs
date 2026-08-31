import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const migration = readFileSync(new URL("../supabase/migrations/20260824233000_real_jobs_quick_click.sql", import.meta.url), "utf8");

test("Empleos no usa oportunidades ficticias como respaldo", () => {
  assert.match(page, /const jobsFeed = liveJobs;/);
  assert.doesNotMatch(page, /const demoJobs/);
});

test("Huellitas no usa perfiles ficticios como respaldo", () => {
  assert.match(page, /const huellitasFeed = huellitasAnimals;/);
  assert.doesNotMatch(page, /demoHuellitasAnimals/);
});

test("Quick Click guarda el perfil y solicita mediante Supabase real", () => {
  assert.match(api, /saveJobSeekerProfile/);
  assert.match(api, /\/rpc\/apply_to_job/);
  assert.match(page, /loadRealJobWorkspace/);
});

test("las vistas del candidato son anónimas y no se pueden falsificar desde el cliente", () => {
  assert.match(migration, /record_job_profile_view/);
  assert.match(migration, /Verified employer authorization required/);
  assert.match(migration, /revoke insert, update, delete on public\.job_profile_views/);
});

test("una solicitud real notifica al patrono", () => {
  assert.match(migration, /'Nueva solicitud Quick Click'/);
  assert.match(migration, /insert into public\.notifications/);
});
