import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const api = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

function registerRange(offset, label, source, tokens) {
  tokens.forEach((token, index) => test(`${String(offset + index).padStart(3, "0")} ${label}: ${token.slice(0, 58)}`, () => assert.ok(source.includes(token), `Falta contrato: ${token}`)));
}

const publishing = [
  "async function openPublish()", "if (!session)", "setAuthOpen(true)", 'guardAccountWrite("session")', 'setAccountTab("profile")',
  'setPublishMessage("")', "await getCategories()", "setPublishOpen(true)", "function detectMunicipality()", "navigator.geolocation",
  "Este dispositivo no permite detectar tu ubicación.", "Buscando tu pueblo…", "getCurrentPosition(", "coords.latitude", "coords.longitude",
  "accept-language=es", "address.city", "address.town", "address.village", "address.municipality",
  "address.county", "normalizeTown(candidate)", "setPublishMunicipality(found)", "Ubicación detectada:", "No pudimos identificar el pueblo automáticamente.",
  "No se concedió acceso a la ubicación.", "enableHighAccuracy: false", "timeout: 10000", "maximumAge: 300000", "async function handlePublish",
  "event.preventDefault()", "const formElement = event.currentTarget", "new FormData(formElement)", 'form.get("price")', 'form.get("is_free") === "on"',
  "enteredPrice === 0", "Escoge una categoría para continuar.", '.getAll("images")', "item instanceof File", "item.size > 0",
  "Selecciona entre 1 y 8 fotos reales.", "images.length > 8", "40 * 1024 * 1024", "menor de 40 MB", "createListingDraft(",
  "FREE_CATEGORY_ID", "price: free ? null : enteredPrice", "is_free: free", 'form.get("is_negotiable") === "on"', 'form.get("condition")',
  "No se pudo crear el borrador.", "Optimizando foto", "optimizeListingImage(images[index])", "10 * 1024 * 1024", "No pudimos reducir suficientemente la foto",
  "uploadListingImage(", "publishListing(", "formElement.reset()", 'setSelectedCategoryId("")', 'categoryBeforeFree.current = ""',
  "setIsFreeListing(false)", 'setListingPrice("")', 'setPublishMunicipality("")', "setSelectedPhotoCount(0)", 'setPublishTitle("")',
  'setPublishDescription("")', "Promise.all([", "getPublicListings()", "getMyListings(", "setLiveListings(refreshedListings)",
  "setMyListings(refreshedOwnedListings)", "setPublishedListing(justPublished)", "setPublishOpen(false)", "¡Anuncio publicado!", "No se pudo guardar el borrador.",
  'aria-labelledby="publish-title"', "Cuéntanos qué vendes", "publishStepsComplete * 20", "Requisitos de publicación", "Fotos reales (1–8)",
];

const apiContracts = [
  "export type ListingDraft", "category_id: string", "title: string", "description: string", "municipality: string",
  "price: number | null", "is_free: boolean", "is_negotiable: boolean", "condition: string", "export async function optimizeListingImage",
  "URL.createObjectURL(file)", "new Promise<HTMLImageElement>", "No pudimos procesar una de las fotos.", "const maxSide = 2200", "Math.min(1, maxSide",
  "image.naturalWidth", "image.naturalHeight", 'document.createElement("canvas")', "imageSmoothingEnabled = true", 'imageSmoothingQuality = "high"',
  'fillStyle = "#ffffff"', "context.drawImage(image", "canvas.toBlob", '"image/jpeg"', "encode(0.9)",
  "encode(0.82)", "encode(0.74)", "7 * 1024 * 1024", "9.5 * 1024 * 1024", "URL.revokeObjectURL(objectUrl)",
  "export async function createListingDraft", "draft.is_free ? FREE_CATEGORY_ID", "draft.is_free ? null : draft.price", 'status: "draft"', "seller_id: userId",
  "export async function uploadListingImage", "crypto.randomUUID()", '"x-upsert": "false"', "is_primary: position === 0", "export async function publishListing",
];

const huellitas = [
  'role="dialog"', 'aria-modal="true"', 'aria-labelledby="huellitas-title"', '/huellitas/hero.png', "Perro y gato rescatados",
  "Cada historia merece un hogar seguro.", "Ver animales disponibles", "Encontrarle un hogar", "Adopciones particulares: $0", "Foto real y salud visible",
  "Rescates institucionales verificados", "¿Ya no puedes cuidarlo?", "antes de que termine en la calle", "¿Rescataste un animal?", "Animales disponibles",
  "Todavía no hay animales publicados", "únicamente perfiles reales disponibles para adopción", "Cuotas institucionales transparentes", "No es venta del animal", "donación adicional obligatoria",
  "huellitasSpecies", "huellitasTown", '<option value="dog">Perros</option>', '<option value="cat">Gatos</option>', '<option value="bird">Aves</option>',
  '<option value="reptile">Reptiles</option>', '<option value="other">Otros</option>', "Buscando Huellitas…", "filteredHuellitasAnimals", "verifiedFee",
  'Foto real de', '"Familia particular"', '"Rescate comunitario"', '"Institución sin fines de lucro"', '"Organización de rescate"',
  '"Vacunas"', '"Esterilización"', '"Veterinario"', "Adopción sin costo", "Coquí Ventas no cobra por adoptar.",
];

const visualContracts = [
  ".publish-modal{width:min(100%,590px)", ".photo-field{padding:15px", "border:1px dashed #9bcfc8", ".location-button{width:100%", ".location-button:hover{background:#e2f3f0}",
  ".location-button:disabled{opacity:.65;cursor:wait}", ".category-picker{margin:0;padding:0;border:0}", ".publish-progress{position:relative", ".publish-progress span{position:absolute", ".publish-checklist{display:flex",
  ".publish-checklist span.done{background:#dcf3ed", '.publish-checklist span.done::before{content:"✓ "', ".publish-preview{display:grid", ".publish-preview strong{grid-row:1/3", ".photo-selection{display:grid",
  ".photo-selection span{display:flex", ".photo-guidance{display:flex", ".photo-guidance span{padding:5px 7px", ".huellitas-backdrop{z-index:110", ".huellitas-hub{position:relative",
  ".huellitas-hero{min-height:390px", ".huellitas-hero>img{object-fit:cover}", ".huellitas-hero-shade{position:absolute", ".huellitas-hero-copy{width:min(520px,55%)", ".huellitas-trust{display:grid",
  ".huellitas-content{padding:32px}", ".huellitas-filters{display:grid", ".huellitas-grid{display:grid", ".huellitas-card{overflow:hidden", ".huellitas-photo{height:220px",
  ".huellitas-photo img{object-fit:cover}", ".huellitas-card-body{display:grid", ".huellitas-health{display:flex", ".huellitas-empty{display:grid", ".huellitas-message{margin-top:15px",
  ".huellitas-rules{display:grid", ".huellitas-audience{display:grid", ".huellitas-demo-note{margin:14px 0", ".huellitas-photo>i{position:absolute", ".huellitas-source{color:#087f78!important",
];

assert.equal(publishing.length, 80);
assert.equal(apiContracts.length, 40);
assert.equal(huellitas.length, 40);
assert.equal(visualContracts.length, 40);
registerRange(1, "publicación", page, publishing);
registerRange(81, "datos y fotos", api, apiContracts);
registerRange(121, "Huellitas", page, huellitas);
registerRange(161, "diseño y móvil", css, visualContracts);
