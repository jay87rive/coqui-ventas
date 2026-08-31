import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const behavior = [
  "quickClickProfileViews", "setQuickClickProfileViews", "getMyJobProfileViewCount", "recordQuickClickProfileView", 'row.status === "submitted"',
  "recordJobProfileView", "applications.map(realQuickClickApplication)", "Tu actividad privada", "Job Tracker", "Solo tú puedes ver este panel",
  "Solicitudes enviadas", "En revisión", "Visitas a tu perfil", "Conteo anónimo · no identifica patronos", "job-tracker-list",
  "Enviada el", "✓ Enviada", "✓ Perfil visto", "○ Esperando revisión", "Todavía no has enviado solicitudes",
  "Cuando uses Quick Click", "cada solicitud aparecerá aquí automáticamente", "recordQuickClickProfileView(application)", "Ver perfil y resumé", "application.appliedAt",
  "application.jobTitle", "application.company", "application.status", "jobsFeed.find", "Ver empleo",
];
const visual = [
  ".job-tracker{grid-column:1/-1", ".job-tracker-heading{display:flex", ".job-tracker-heading span{color:#087f78", ".job-tracker-heading h3", ".job-tracker-heading p",
  ".job-tracker-heading>small", ".job-tracker-summary{display:grid", "grid-template-columns:repeat(3,1fr)", ".job-tracker-summary article", ".job-tracker-summary b",
  ".job-tracker-summary span", ".job-tracker-summary small", ".job-tracker-summary .profile-views", ".job-tracker-summary .profile-views b", ".job-tracker-list{display:grid",
  ".job-tracker-list>article{display:grid", "grid-template-columns:minmax(220px,1fr)", ".tracker-status{width:max-content", ".tracker-status.received", ".tracker-status.reviewing",
  ".tracker-steps{display:flex", ".tracker-steps span.done", ".tracker-steps i", ".job-tracker-list article>button", ".job-tracker-empty{display:flex",
  ".job-tracker-empty>span", ".job-tracker-empty b", ".job-tracker-empty p", "@media(max-width:760px){.job-tracker-heading", ".job-tracker-summary{grid-template-columns:1fr}",
];
assert.equal(behavior.length, 30);
assert.equal(visual.length, 30);
behavior.forEach((token, index) => test(`${String(index + 1).padStart(2,"0")} Job Tracker: ${token}`, () => assert.ok(page.includes(token))));
visual.forEach((token, index) => test(`${String(index + 31).padStart(2,"0")} Job Tracker visual: ${token}`, () => assert.ok(css.includes(token))));
