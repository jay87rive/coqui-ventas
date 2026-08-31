"use client";

import { useCallback, useEffect, useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sexbivrfdpbhvdgsvgwv.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_wvAe2A3-XQoQDUzI7ylDUg_qj3yNv6s";

type StoredSession = { access_token: string; user: { id: string } };
type ApplicationStatus = "submitted" | "viewed" | "shortlisted" | "interview" | "rejected" | "hired" | "withdrawn";
type CandidateApplication = { id: string; status: ApplicationStatus; submitted_at: string; updated_at: string | null; jobs?: { title?: string; employers?: { public_name?: string } | { public_name?: string }[] } | null };
type JobNotification = { id: string; related_content_id: string | null; read_at: string | null; status: string; body: string };

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: "Recibida", viewed: "En revisión", shortlisted: "Preseleccionada", interview: "Entrevista", rejected: "No cualificado", hired: "Contratado", withdrawn: "Retirada",
};
const PROGRESS: ApplicationStatus[] = ["submitted", "viewed", "shortlisted", "interview", "hired"];

function getSession(): StoredSession | null { try { const raw = window.localStorage.getItem("coqui-session"); if (!raw) return null; const parsed = JSON.parse(raw) as StoredSession; return parsed?.access_token && parsed?.user?.id ? parsed : null; } catch { return null; } }
function headers(token: string) { return { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, "Content-Type": "application/json" }; }
async function parseResponse<T>(response: Response): Promise<T> { const payload = await response.json().catch(() => null); if (!response.ok) { const record = payload && typeof payload === "object" ? payload as Record<string, unknown> : null; const message = record && (record.message || record.error_description || record.error); throw new Error(typeof message === "string" ? message : "No se pudo completar la solicitud."); } return payload as T; }
async function rpc<T>(token: string, name: string, body: Record<string, unknown>) { return parseResponse<T>(await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, { method: "POST", headers: headers(token), body: JSON.stringify(body), cache: "no-store" })); }
function normalize(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase(); }
function companyName(application: CandidateApplication) { const employer = Array.isArray(application.jobs?.employers) ? application.jobs?.employers[0] : application.jobs?.employers; return employer?.public_name || "Patrono verificado"; }
function canWithdraw(status: ApplicationStatus) { return status === "submitted" || status === "viewed" || status === "shortlisted" || status === "interview"; }
function formatDate(value: string | null) { if (!value) return ""; const date = new Date(value); if (Number.isNaN(date.getTime())) return ""; return date.toLocaleString("es-PR", { dateStyle: "medium", timeStyle: "short" }); }

function buildStatusFlow(application: CandidateApplication) {
  const flow = document.createElement("div");
  flow.className = "coqui-job-status-flow";
  flow.setAttribute("aria-label", `Estado de solicitud: ${STATUS_LABELS[application.status]}`);
  if (application.status === "rejected" || application.status === "withdrawn") {
    const terminal = document.createElement("div");
    terminal.className = `coqui-job-terminal coqui-job-terminal--${application.status}`;
    terminal.textContent = application.status === "rejected" ? "Proceso cerrado · No cualificado" : "Solicitud retirada";
    flow.append(terminal);
    return flow;
  }
  const current = PROGRESS.indexOf(application.status);
  PROGRESS.forEach((status, index) => {
    const step = document.createElement("div");
    step.className = "coqui-job-status-step";
    if (index < current) step.classList.add("is-complete");
    if (index === current) step.classList.add("is-current");
    const dot = document.createElement("span"); dot.className = "coqui-job-status-dot";
    const label = document.createElement("span"); label.className = "coqui-job-status-label"; label.textContent = STATUS_LABELS[status];
    step.append(dot, label); flow.append(step);
  });
  return flow;
}

export default function CandidateJobTrackerControls() {
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [notifications, setNotifications] = useState<JobNotification[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    const session = getSession(); if (!session) { setApplications([]); setNotifications([]); return; }
    const applicationQuery = `select=id,status,submitted_at,updated_at,jobs(title,employers(public_name))&applicant_id=eq.${encodeURIComponent(session.user.id)}&order=submitted_at.desc`;
    const notificationQuery = "select=id,related_content_id,read_at,status,body&module=eq.jobs&related_content_type=eq.job_application&order=created_at.desc&limit=25";
    const [applicationRows, notificationRows] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/job_applications?${applicationQuery}`, { headers: headers(session.access_token), cache: "no-store" }).then((response) => parseResponse<CandidateApplication[]>(response)).catch(() => []),
      fetch(`${SUPABASE_URL}/rest/v1/notifications?${notificationQuery}`, { headers: headers(session.access_token), cache: "no-store" }).then((response) => parseResponse<JobNotification[]>(response)).catch(() => []),
    ]);
    setApplications(applicationRows); setNotifications(notificationRows);
  }, []);
  useEffect(() => { void refresh(); const interval = window.setInterval(() => void refresh(), 10000); const onStorage = (event: StorageEvent) => { if (event.key === "coqui-session") void refresh(); }; window.addEventListener("storage", onStorage); return () => { window.clearInterval(interval); window.removeEventListener("storage", onStorage); }; }, [refresh]);
  useEffect(() => {
    function patchTracker() {
      document.querySelectorAll<HTMLElement>(".job-tracker-list article").forEach((card) => {
        const text = normalize(card.innerText);
        const application = applications.find((row) => text.includes(normalize(row.jobs?.title || "Empleo")) && text.includes(normalize(companyName(row))));
        if (!application) return;
        card.dataset.candidateApplicationId = application.id;
        let statusArea = card.querySelector<HTMLElement>("[data-coqui-job-status-flow]");
        if (!statusArea) { statusArea = document.createElement("div"); statusArea.dataset.coquiJobStatusFlow = "true"; card.append(statusArea); }
        statusArea.replaceChildren(buildStatusFlow(application));
        let meta = card.querySelector<HTMLElement>("[data-coqui-job-meta]");
        if (!meta) { meta = document.createElement("div"); meta.dataset.coquiJobMeta = "true"; meta.className = "coqui-job-tracker-meta"; card.append(meta); }
        meta.textContent = `Estado actual: ${STATUS_LABELS[application.status]} · Última actualización: ${formatDate(application.updated_at || application.submitted_at)}`;
        let actions = card.querySelector<HTMLElement>("[data-coqui-job-actions]");
        if (!actions) { actions = document.createElement("div"); actions.dataset.coquiJobActions = "true"; actions.className = "coqui-job-tracker-actions"; card.append(actions); }
        actions.replaceChildren();
        if (canWithdraw(application.status)) { const withdraw = document.createElement("button"); withdraw.type = "button"; withdraw.className = "coqui-job-withdraw-button"; withdraw.dataset.applicationId = application.id; withdraw.textContent = busyId === application.id ? "Retirando…" : "Retirar solicitud"; withdraw.disabled = busyId === application.id; actions.append(withdraw); }
        const unread = notifications.filter((item) => item.related_content_id === application.id && !item.read_at && item.status !== "read");
        if (unread.length) { const badge = document.createElement("button"); badge.type = "button"; badge.className = "coqui-job-unread-button"; badge.dataset.applicationId = application.id; badge.textContent = `${unread.length} actualización${unread.length === 1 ? "" : "es"} nueva${unread.length === 1 ? "" : "s"}`; actions.append(badge); }
      });
    }
    async function onClick(event: Event) {
      const target = event.target as HTMLElement | null; const withdraw = target?.closest<HTMLButtonElement>(".coqui-job-withdraw-button"); const unread = target?.closest<HTMLButtonElement>(".coqui-job-unread-button"); const session = getSession(); if (!session) return;
      if (withdraw?.dataset.applicationId) { event.preventDefault(); const id = withdraw.dataset.applicationId; if (!window.confirm("¿Seguro que deseas retirar esta solicitud? El patrono ya no podrá cambiar su estado.")) return; setBusyId(id); try { await rpc<boolean>(session.access_token, "withdraw_job_application", { p_application_id: id }); await refresh(); } catch (error) { window.alert(error instanceof Error ? error.message : "No pudimos retirar la solicitud."); } finally { setBusyId(null); } }
      if (unread?.dataset.applicationId) { event.preventDefault(); const ids = notifications.filter((item) => item.related_content_id === unread.dataset.applicationId && !item.read_at && item.status !== "read").map((item) => item.id); await Promise.all(ids.map((id) => rpc<boolean>(session.access_token, "mark_notification_read", { p_notification_id: id }).catch(() => false))); await refresh(); unread.closest("article")?.scrollIntoView({ behavior: "smooth", block: "center" }); }
    }
    patchTracker(); document.addEventListener("click", onClick, true); const observer = new MutationObserver(patchTracker); observer.observe(document.body, { childList: true, subtree: true }); return () => { document.removeEventListener("click", onClick, true); observer.disconnect(); };
  }, [applications, notifications, busyId, refresh]);
  return null;
}
