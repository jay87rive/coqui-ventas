import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const cases = [
  ["idioma español e inglés", 'useState<"es" | "en">("es")'],
  ["preferencia de idioma persistente", 'coqui-language'],
  ["cambio de idioma", 'function changeLanguage'],
  ["selector global", 'className="language-switch"'],
  ["selector dentro de empleos", 'jobs-language'],
  ["navegación en inglés", 'isEnglish ? "Explore" : "Explorar"'],
  ["categorías en inglés", 'isEnglish ? "Categories" : "Explora a tu manera"'],
  ["seguridad en inglés", 'isEnglish ? "Safety" : "Seguridad"'],
  ["entrada patrono navegación", 'employer-nav-button'],
  ["entrada patrono bilingüe", '"I\'m an employer" : "Soy patrono"'],
  ["portada abre candidato", 'openJobs("candidate")'],
  ["portada abre patrono", 'openJobs("employer")'],
  ["dos acciones en banner", 'hero-jobs-actions'],
  ["buscar candidatos desde portada", '"Find candidates" : "Buscar candidatos"'],
  ["modo inicial parametrizable", 'function openJobs(mode: "candidate" | "employer"'],
  ["modo candidato", 'candidate-mode'],
  ["modo patrono", 'employer-mode'],
  ["hero candidato", 'Encuentra trabajo en Puerto Rico'],
  ["hero patrono", 'Encuentra candidatos en todo Puerto Rico'],
  ["hero patrono en inglés", 'Find candidates across Puerto Rico'],
  ["búsqueda candidato por destreza", 'Buscar empleos por destrezas'],
  ["búsqueda patrono por candidatos", 'Buscar candidatos'],
  ["estado destreza empleos", 'jobSkill, setJobSkill'],
  ["estado búsqueda candidatos", 'candidateSearch, setCandidateSearch'],
  ["estado destreza candidatos", 'candidateSkill, setCandidateSkill'],
  ["lista central de destrezas", 'const jobSkills = ['],
  ["destrezas de electricidad", 'Electricidad industrial'],
  ["destrezas de oficina", 'Microsoft Office'],
  ["destrezas de enfermería", 'Enfermería'],
  ["destrezas de mecánica", 'Mecánica automotriz'],
  ["destrezas de servicio", 'Servicio al cliente'],
  ["destrezas de construcción", 'Construcción'],
  ["filtro flexible para vacantes", 'job.skills.some((skill) => normalizeSearch(skill).includes(normalizeSearch(jobSkill)))'],
  ["filtro candidato por destreza", 'application.candidate.skills'],
  ["perfiles reales de candidatos", 'realQuickClickApplication'],
  ["candidatos reales visibles", 'candidateFeed'],
  ["candidatos filtrados", 'filteredCandidates'],
  ["lista de destrezas en perfil", 'list="coqui-job-skills"'],
  ["datalist de destrezas", 'id="coqui-job-skills"'],
  ["varias destrezas", 'varias separadas por comas'],
  ["resumen patrono clicable", 'employer-summary"><button'],
  ["solicitudes navegan", 'employer-applications'],
  ["empleos activos navegan", 'employer-active-jobs'],
  ["revisión de perfil en un clic", 'Para revisar el perfil'],
  ["sección empleos activos", 'className="employer-active-jobs"'],
  ["sección perfiles candidatos", 'perfiles de candidatos'],
  ["limpiar filtro candidato", 'setCandidateSkill("")'],
  ["buscador candidato responsivo", '.jobs-hero.candidate-mode form'],
  ["buscador patrono responsivo", '.jobs-hero.employer-mode form'],
  ["tarjetas resumen interactivas", '.employer-summary button'],
  ["cuadrícula empleos patrono", '.employer-active-jobs>div:last-child'],
  ["botones banner accesibles", '.hero-jobs-actions button'],
  ["selector idioma compacto", '.language-switch button'],
  ["cabecera patrono distinta", '.jobs-hero.employer-mode'],
  ["móvil apila buscadores", '@media(max-width:820px){.jobs-hero.candidate-mode form,.jobs-hero.employer-mode form{grid-template-columns:1fr}'],
];

for (const [name, needle] of cases) test(name, () => assert.ok((page + css).includes(needle)));

test("la lista de destrezas no contiene duplicados", () => {
  const match = page.match(/const jobSkills = \[(.*?)\];/s);
  assert.ok(match);
  const skills = [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]);
  assert.equal(new Set(skills).size, skills.length);
  assert.ok(skills.length >= 20);
});
