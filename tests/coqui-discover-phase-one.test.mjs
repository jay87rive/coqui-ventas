import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/discover.css", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const checks = [
  [page, "discoverOpen"], [page, "discoverTab"], [page, "discoverTown"], [page, "alertKeywords"], [page, "followedSellerIds"],
  [page, "coqui-discover-town"], [page, "coqui-alert-keywords"], [page, "coqui-following"], [page, "openDiscover"], [page, "saveDiscoverTown"],
  [page, "addCoquiAlert"], [page, "removeCoquiAlert"], [page, "toggleFollowSeller"], [page, "activeDiscoverTown"], [page, "municipalityListings"],
  [page, "municipalityJobs"], [page, "followingListings"], [page, "personalizedSuggestions"], [page, "alertMatches"], [page, "mapTowns"],
  [page, "Coquí Descubre"], [page, "¿Qué hay pa’ hoy?"], [page, "Alertas Coquí"], [page, "Mi Municipio"], [page, "Siguiendo"],
  [page, "Mapa único Coquí"], [page, "Una isla · una sola experiencia"], [page, "Tu Puerto Rico, preparado para ti"], [page, "Preparado hoy para ti"], [page, "Toda la isla, conectada"],
  [page, "78 municipios"], [page, "Personalización privada"], [page, "Nunca expone tu ubicación exacta"], [page, "ni altera la reputación"], [page, "Seguir vendedor"],
  [page, "✓ Siguiendo"], [page, "Entra a tu cuenta para seguir perfiles"], [page, "Publicaciones activas nuevas"], [page, "Visita el perfil público"], [page, "Crea tu primera alerta"],
  [page, "Marketplace, empleos y actividad comunitaria"], [page, "Anuncios, empleos, experiencias y Huellitas"], [page, "Tourism, culture and workshops"], [page, "Find jobs"], [page, "Meet the Huellitas"],
  [css, ".coqui-discover-home"], [css, ".discover-home-grid"], [css, ".discover-map-entry"], [css, ".discover-backdrop"], [css, ".discover-hub"],
  [css, ".discover-tabs"], [css, ".discover-panel"], [css, ".today-highlight-grid"], [css, ".discover-listing-grid"], [css, ".coqui-alert-form"],
  [css, ".alert-keywords"], [css, ".discover-empty"], [css, ".municipality-summary"], [css, ".coqui-map-shell"], [css, ".coqui-map-toolbar"],
  [css, ".coqui-map-grid"], [css, ".map-legend"], [css, ".follow-button"], [css, ".follow-button.following"], [css, "@media(max-width:900px)"],
  [css, "@media(max-width:620px)"], [layout, 'import "./discover.css"'],
];

checks.forEach(([source, token], index) => test(`Descubre ${String(index + 1).padStart(2, "0")}: ${token}`, () => assert.ok(source.includes(token), `Falta ${token}`)));
