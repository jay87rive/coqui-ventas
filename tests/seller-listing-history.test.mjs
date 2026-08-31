import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const data = readFileSync(new URL("../lib/supabase-rest.ts", import.meta.url), "utf8");
const ownedStart = page.indexOf('{accountTab === "listings" &&');
const ownedEnd = page.indexOf('{accountTab === "offers" &&', ownedStart + 30);
const owned = page.slice(ownedStart, ownedEnd);

const checks = [
  ["historial 01: consulta publicaciones del dueño", data, 'seller_id=eq.${userId}'],
  ["historial 02: consulta incluye estado", data, 'condition,status,listing_images'],
  ["historial 03: consulta no exige estado público", data, 'getMyListings'],
  ["historial 04: ordena historial desde lo más reciente", data, 'order=created_at.desc'],
  ["historial 05: Mi Coquí tiene pestaña de publicaciones", page, 'Mis publicaciones ({myListings.length})'],
  ["historial 06: guía explica control del vendedor", owned, 'Control del vendedor'],
  ["historial 07: explica estado Disponible", owned, 'Disponible: listo para vender.'],
  ["historial 08: explica estado Pendiente", owned, 'Pendiente: estás coordinando; seguirá visible.'],
  ["historial 09: explica estado Pausado", owned, 'Pausado: se oculta temporalmente.'],
  ["historial 10: explica estado Vendido", owned, 'Vendido: úsalo únicamente al completar una venta verificable.'],
  ["historial 11: informa permanencia en Mi Coquí", owned, 'no se borran de Mi Coquí'],
  ["historial 12: resume total de publicaciones", owned, '<span>Total</span>'],
  ["historial 13: resume publicaciones disponibles", owned, '<span>Disponibles</span>'],
  ["historial 14: resume publicaciones pendientes", owned, '<span>Pendientes</span>'],
  ["historial 15: resume publicaciones pausadas", owned, '<span>Pausadas</span>'],
  ["historial 16: resume publicaciones vendidas", owned, '<span>Vendidas</span>'],
  ["historial 17: permite filtrar Todas", owned, '<option value="all">Todas</option>'],
  ["historial 18: permite filtrar Borradores", owned, '<option value="draft">Borradores</option>'],
  ["historial 19: permite buscar por título o pueblo", owned, 'placeholder="Título o pueblo"'],
  ["historial 20: ordena por actualización reciente", owned, 'Actualizadas recientemente'],
  ["historial 21: ordena por título", owned, 'Título A–Z'],
  ["historial 22: ordena por precio", owned, 'Precio mayor primero'],
  ["historial 23: cuenta resultados de la vista", owned, 'publicación{filteredMyListings.length === 1 ? "" : "es"} en esta vista'],
  ["historial 24: conserva fotografía de la publicación", owned, 'className="owned-thumb"'],
  ["historial 25: conserva título", owned, '<h3>{listing.title}</h3>'],
  ["historial 26: conserva precio o Gratis", owned, 'listing.is_free ? "Gratis"'],
  ["historial 27: conserva pueblo", owned, '{listing.municipality}</p>'],
  ["historial 28: conserva condición", owned, 'conditionLabels[listing.condition]'],
  ["historial 29: conserva cantidad de fotos", owned, 'listing.image_urls.length} foto'],
  ["historial 30: vendido muestra sello de historial", owned, 'Guardado en tu historial'],
  ["historial 31: permite editar publicación", owned, '>Editar</button>'],
  ["historial 32: permite ver publicación", owned, '>Ver</button>'],
  ["historial 33: borrador no cambia estado directamente", owned, 'disabled={busy || listing.status === "draft"}'],
  ["historial 34: vendedor puede volver a Disponible", owned, '<option value="available">Disponible</option>'],
  ["historial 35: vendedor puede marcar Pendiente", owned, '<option value="pending">Pendiente</option>'],
  ["historial 36: vendedor puede Pausar", owned, '<option value="paused">Pausado</option>'],
  ["historial 37: vendedor puede marcar Vendido", owned, '<option value="sold">Vendido</option>'],
  ["historial 38: cambio de estado exige confirmación", page, 'id="status-confirm-title"'],
  ["historial 39: vendido público se explica por 24 horas", page, 'Visible como Vendido por 24 h'],
  ["historial 40: no ofrece borrar publicaciones del historial", owned, 'Eliminar publicación', false],
];

for (const [name, source, expected, shouldExist = true] of checks) {
  test(name, () => {
    assert.equal(source.includes(expected), shouldExist, `${shouldExist ? "Falta" : "No debe existir"}: ${expected}`);
  });
}
