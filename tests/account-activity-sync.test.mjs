import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const checks = [
  ["sincronización 01: guarda última actualización", page, "accountLastUpdated"],
  ["sincronización 02: distingue actualización silenciosa", page, "accountSyncing"],
  ["sincronización 03: automática inicia activa", page, "useState(true)"],
  ["sincronización 04: carga acepta modo silencioso", page, "silent = false"],
  ["sincronización 05: modo silencioso activa indicador", page, "setAccountSyncing(true)"],
  ["sincronización 06: carga normal mantiene bloqueo", page, "setBusy(true)"],
  ["sincronización 07: carga normal limpia mensaje", page, 'setAccountMessage("")'],
  ["sincronización 08: recarga perfil", page, "getMyProfile(currentSession.access_token"],
  ["sincronización 09: recarga publicaciones", page, "getMyListings(currentSession.access_token"],
  ["sincronización 10: recarga conversaciones", page, "getMyConversations(currentSession.access_token"],
  ["sincronización 11: recarga ofertas", page, "getMyOffers(currentSession.access_token"],
  ["sincronización 12: recarga ventas", page, "getMySaleActivity(currentSession.access_token"],
  ["sincronización 13: recarga seguridad", page, "getMySafetyActivity(currentSession.access_token"],
  ["sincronización 14: recarga avisos", page, "getMyNotifications(currentSession.access_token)"],
  ["sincronización 15: recarga preferencias", page, "getNotificationPreferences(currentSession.access_token"],
  ["sincronización 16: actualiza marca de tiempo al completar", page, "setAccountLastUpdated(new Date())"],
  ["sincronización 17: apaga indicador silencioso", page, "setAccountSyncing(false)"],
  ["sincronización 18: conserva bloqueo normal separado", page, "else setBusy(false)"],
  ["sincronización 19: requiere sesión", page, "!session || !accountOpen || !accountAutoRefresh"],
  ["sincronización 20: solo trabaja con cuenta abierta", page, "!accountOpen"],
  ["sincronización 21: respeta interruptor automático", page, "!accountAutoRefresh"],
  ["sincronización 22: evita actividad en pestaña oculta", page, 'document.visibilityState === "visible"'],
  ["sincronización 23: usa actualización silenciosa", page, "loadAccountData(session, true)"],
  ["sincronización 24: intervalo de treinta segundos", page, "setInterval(refreshActivity, 30000)"],
  ["sincronización 25: escucha regreso a la página", page, 'addEventListener("visibilitychange"'],
  ["sincronización 26: limpia intervalo", page, "clearInterval(interval)"],
  ["sincronización 27: limpia listener", page, 'removeEventListener("visibilitychange"'],
  ["sincronización 28: botón evita solicitudes duplicadas", page, "!session || accountSyncing"],
  ["sincronización 29: botón espera actualización", page, "await loadAccountData(session, true)"],
  ["sincronización 30: confirma actividad al día", page, "Tu actividad está al día"],
  ["sincronización 31: región anuncia cambios", page, 'aria-live="polite"'],
  ["sincronización 32: indicador refleja proceso", page, 'accountSyncing ? "sync-dot active"'],
  ["sincronización 33: texto anuncia actualización", page, "Actualizando actividad…"],
  ["sincronización 34: muestra hora local", page, 'toLocaleTimeString("es-PR"'],
  ["sincronización 35: ofrece actualización manual", page, "Actualizar ahora"],
  ["sincronización 36: botón se desactiva durante carga", page, "disabled={accountSyncing}"],
  ["sincronización 37: ofrece control automático", page, "Actualización automática"],
  ["sincronización 38: control refleja preferencia", page, "checked={accountAutoRefresh}"],
  ["sincronización 39: indicador tiene animación", styles, "@keyframes sync-pulse"],
  ["sincronización 40: controles se adaptan al móvil", styles, "account-sync{align-items:flex-start;flex-wrap:wrap}"],
];

for (const [name, source, expected] of checks) {
  test(name, () => assert.ok(source.includes(expected), `Falta: ${expected}`));
}
