import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const register = (offset, label, source, tokens) => tokens.forEach((token, index) => test(`${String(offset + index).padStart(3, "0")} ${label}: ${token.slice(0, 56)}`, () => assert.ok(source.includes(token), `Falta ${token}`)));

const separation = [
  'function openJobs(mode: "candidate" | "employer" = "candidate")', "setJobsOpen(true)", "setSelectedJob(null)", "function returnToClassifieds()", "setJobsOpen(false)",
  'document.getElementById("explorar")', 'onClick={() => openJobs("candidate")}', 'className="modal-backdrop jobs-backdrop"', 'className="jobs-hub"', 'aria-labelledby="jobs-title"',
  '"Regresar a los clasificados de compra y venta"', "Coquí Empleos", "Cerrar empleos", "Empleos para nuestra gente", "Encuentra trabajo en Puerto Rico",
  "Busca por destrezas, profesión, pueblo o modalidad.", "El salario siempre está visible.", "Destreza, puesto o compañía", 'aria-label={isEnglish ? "Search jobs by skills" : "Buscar empleos por destrezas"}', "Buscar empleos",
  "Todo Puerto Rico", "Cualquier modalidad", "Presencial", "Híbrido", "Remoto",
  "Busco empleo", "Soy patrono", "Oportunidades reales", "Conectado con Coquí Ventas", "No encontramos empleos con esos filtros",
  "Ver todos los empleos", "Salario visible", "Ver empleo", "jobSearch", "jobTown",
  "jobArrangement", "filteredJobs", "jobTowns", "jobsFeed", "selectedJob",
];

const quickClick = [
  "type QuickClickProfile", "type QuickClickApplication", "function saveQuickClickProfile", "function applyQuickClick", "saveJobSeekerProfile",
  "getMyJobApplications", "Necesitas una cuenta de Coquí Ventas", "Primero completa tu perfil Quick Click", "Ya enviaste tu perfil", "Solicitud enviada a",
  "El patrono recibió tu perfil profesional.", "⚡ Quick Click", "Solicita con un clic", "Tu perfil reúne el resumé", "Perfil listo",
  "Nombre completo", "Profesión o título", "Experiencia", "Destrezas", "Resumé o historial",
  'accept=".pdf,.doc,.docx"', "PDF o Word", "Guardar perfil Quick Click", "Se requiere una cuenta", "Solicitar con un clic",
  "Panel privado de patronos", "Encuentra y administra candidatos", "Revisa solicitudes, busca por destrezas", "Publicar un empleo", "Solicitudes nuevas",
  "Empleos activos", "Para revisar el perfil", "Ver perfil y resumé", "No hay candidatos con esas destrezas", "perfiles de candidatos",
  "Las solicitudes reales permanecen privadas", "Tu perfil está listo para enviar", "Prepara tu perfil para solicitar", "no tus datos privados del marketplace", "Solicitud enviada ✓",
];

const visuals = [
  ".jobs-backdrop{z-index:130", ".jobs-hub{width:100vw;height:100vh", ".jobs-header{position:sticky", ".jobs-return{justify-self:start", ".jobs-brand{display:flex",
  ".jobs-close{justify-self:end", ".jobs-hero{padding:56px", ".jobs-hero h2{max-width:760px", ".jobs-hero form{display:grid", "grid-template-columns:2fr 1fr 1fr auto",
  ".jobs-role-switch{display:flex", ".jobs-role-switch button.active", ".jobs-message{max-width:1180px", ".jobs-content{max-width:1180px", "grid-template-columns:minmax(0,1fr) 340px",
  ".jobs-grid{display:grid", "grid-template-columns:repeat(2,1fr)", ".jobs-grid article.featured", ".quick-click-panel{align-self:start", "position:sticky",
  ".quick-click-panel form{display:grid", ".quick-click-ready{display:grid", ".employer-portal{max-width:1100px", ".employer-summary{display:grid", ".candidate-inbox>article{display:grid",
  ".candidate-avatar{width:48px", ".employer-empty,.jobs-empty{display:grid", ".job-detail-backdrop{position:fixed", ".job-detail{position:relative", ".job-detail-facts{display:flex",
  ".job-apply-box{display:flex", ".job-apply-box button{flex:0 0 auto", "@media(max-width:820px){.jobs-header", ".jobs-hero form{grid-template-columns:1fr}", ".jobs-content{grid-template-columns:1fr",
  ".quick-click-panel{position:static}", ".jobs-grid{grid-template-columns:1fr}", ".candidate-inbox>article{grid-template-columns:44px 1fr}", ".job-apply-box{align-items:stretch;flex-direction:column}", "@media(max-width:520px){.jobs-header",
];

assert.equal(separation.length, 40);
assert.equal(quickClick.length, 40);
assert.equal(visuals.length, 40);
register(1, "portal separado", page, separation);
register(41, "Quick Click", page, quickClick);
register(81, "diseño responsivo", css, visuals);
