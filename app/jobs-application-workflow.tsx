"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sexbivrfdpbhvdgsvgwv.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_wvAe2A3-XQoQDUzI7ylDUg_qj3yNv6s";

type StoredSession = {
  access_token: string;
  user: { id: string; email?: string };
};

type EmployerApplication = {
  id: string;
  job_id: string;
  applicant_id: string;
  status: JobApplicationStatus;
  submitted_at: string;
  job_title: string;
  company: string;
  display_name: string | null;
  headline: string | null;
  professional_summary: string | null;
  municipality: string | null;
  skills: string[] | null;
  years_experience: number | null;
  visible_to_employers: boolean;
};

type CandidateApplication = {
  id: string;
  job_id: string;
  status: JobApplicationStatus;
  submitted_at: string;
  jobs?: {
    title?: string;
    employers?: { public_name?: string } | { public_name?: string }[];
  } | null;
};

type ApplicationContact = {
  candidate_email: string | null;
  resume_title: string | null;
  resume_storage_path: string | null;
};

type JobNotification = {
  id: string;
  title: string;
  body: string;
  related_content_id: string | null;
  status: string;
  read_at: string | null;
  created_at: string;
};

type JobApplicationStatus =
  | "submitted"
  | "viewed"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "hired"
  | "withdrawn";

const STATUS_LABELS: Record<JobApplicationStatus, string> = {
  submitted: "Recibida",
  viewed: "En revisión",
  shortlisted: "Preseleccionada",
  interview: "Entrevista solicitada",
  rejected: "No cualificado",
  hired: "Contratado",
  withdrawn: "Retirada",
};

const EMPLOYER_STATUSES: Array<{ value: Exclude<JobApplicationStatus, "submitted" | "withdrawn">; label: string }> = [
  { value: "viewed", label: "En revisión" },
  { value: "shortlisted", label: "Preseleccionada" },
  { value: "interview", label: "Entrevista solicitada" },
  { value: "rejected", label: "No cualificado" },
  { value: "hired", label: "Contratado" },
];

function getSession(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem("coqui-session");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    return parsed?.access_token && parsed?.user?.id ? parsed : null;
  } catch {
    return null;
  }
}

function authHeaders(token: string) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const record = payload && typeof payload === "object" ? payload as Record<string, unknown> : null;
    const message = record && (record.message || record.error_description || record.error);
    throw new Error(typeof message === "string" ? message : "No se pudo completar la solicitud.");
  }
  return payload as T;
}

async function rpc<T>(token: string, name: string, body: Record<string, unknown> = {}): Promise<T> {
  return parseResponse<T>(await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body),
    cache: "no-store",
  }));
}

function applicationCompany(application: CandidateApplication) {
  const employer = Array.isArray(application.jobs?.employers)
    ? application.jobs?.employers[0]
    : application.jobs?.employers;
  return employer?.public_name || "Patrono verificado";
}

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

function isApplicationButton(text: string) {
  const value = normalize(text);
  return value === normalize("Ver perfil y resumé") || value === normalize("View profile and resume");
}

export default function JobsApplicationWorkflow() {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [employerApplications, setEmployerApplications] = useState<EmployerApplication[]>([]);
  const [candidateApplications, setCandidateApplications] = useState<CandidateApplication[]>([]);
  const [jobNotifications, setJobNotifications] = useState<JobNotification[]>([]);
  const [selected, setSelected] = useState<EmployerApplication | null>(null);
  const [contact, setContact] = useState<ApplicationContact | null>(null);
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const refreshData = useCallback(async (currentSession = getSession()) => {
    setSession(currentSession);
    if (!currentSession) {
      setEmployerApplications([]);
      setCandidateApplications([]);
      setJobNotifications([]);
      return;
    }

    const employerPromise = rpc<EmployerApplication[]>(currentSession.access_token, "get_employer_job_applications").catch(() => []);
    const candidateQuery = `select=id,job_id,status,submitted_at,jobs(title,employers(public_name))&applicant_id=eq.${encodeURIComponent(currentSession.user.id)}&order=submitted_at.desc`;
    const candidatePromise = fetch(`${SUPABASE_URL}/rest/v1/job_applications?${candidateQuery}`, {
      headers: authHeaders(currentSession.access_token),
      cache: "no-store",
    }).then((response) => parseResponse<CandidateApplication[]>(response)).catch(() => []);
    const notificationQuery = "select=id,title,body,related_content_id,status,read_at,created_at&module=eq.jobs&order=created_at.desc&limit=10";
    const notificationsPromise = fetch(`${SUPABASE_URL}/rest/v1/notifications?${notificationQuery}`, {
      headers: authHeaders(currentSession.access_token),
      cache: "no-store",
    }).then((response) => parseResponse<JobNotification[]>(response)).catch(() => []);

    const [employerRows, candidateRows, notificationRows] = await Promise.all([
      employerPromise,
      candidatePromise,
      notificationsPromise,
    ]);
    setEmployerApplications(employerRows);
    setCandidateApplications(candidateRows);
    setJobNotifications(notificationRows);
  }, []);

  useEffect(() => {
    void refreshData();
    const onStorage = (event: StorageEvent) => {
      if (event.key === "coqui-session") void refreshData();
    };
    window.addEventListener("storage", onStorage);
    const interval = window.setInterval(() => void refreshData(), 10000);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.clearInterval(interval);
    };
  }, [refreshData]);

  const employerByIdentity = useMemo(() => employerApplications.map((application) => ({
    application,
    name: normalize(application.display_name || "Candidato"),
    job: normalize(application.job_title || "Empleo"),
  })), [employerApplications]);

  const openApplication = useCallback(async (application: EmployerApplication) => {
    if (!session) return;
    setSelected(application);
    setContact(null);
    setMessage("");
    setNotice("");
    try {
      let currentApplication = application;
      if (application.status === "submitted") {
        await rpc<boolean>(session.access_token, "update_job_application_status", {
          p_application_id: application.id,
          p_status: "viewed",
        });
        currentApplication = { ...application, status: "viewed" };
        setSelected(currentApplication);
        setEmployerApplications((rows) => rows.map((row) => row.id === application.id ? currentApplication : row));
      }
      await rpc<null>(session.access_token, "record_job_profile_view", {
        p_application_id: application.id,
      });
      const rows = await rpc<ApplicationContact[]>(session.access_token, "get_employer_job_application_contact", {
        p_application_id: application.id,
      });
      setContact(rows[0] || null);
      if (application.status === "submitted") {
        setNotice("Solicitud abierta. El candidato ahora ve “En revisión” y recibió una notificación.");
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No pudimos cargar los datos de la solicitud.");
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;

    function patchCandidateTracker() {
      const cards = document.querySelectorAll<HTMLElement>(".job-tracker-list article");
      cards.forEach((card) => {
        const text = normalize(card.innerText);
        const application = candidateApplications.find((row) => {
          const title = normalize(row.jobs?.title || "Empleo");
          const company = normalize(applicationCompany(row));
          return text.includes(title) && text.includes(company);
        });
        if (!application) return;
        const label = STATUS_LABELS[application.status] || application.status;
        const status = card.querySelector<HTMLElement>(".tracker-status");
        if (status) {
          status.textContent = label;
          status.dataset.jobStatus = application.status;
        }
        const steps = card.querySelectorAll<HTMLElement>(".tracker-steps span");
        const secondStep = steps.item(1);
        if (secondStep) {
          secondStep.textContent = application.status === "submitted" ? "○ Esperando revisión" : `✓ ${label}`;
          secondStep.classList.toggle("done", application.status !== "submitted");
        }
        card.dataset.jobApplicationStatus = application.status;
      });

      const tracker = document.querySelector<HTMLElement>(".job-tracker");
      if (!tracker) return;
      const existing = tracker.querySelector<HTMLElement>("[data-coqui-job-updates]");
      const unread = jobNotifications.filter((item) => !item.read_at && item.status !== "read");
      if (!unread.length) {
        existing?.remove();
        return;
      }
      const panel = existing || document.createElement("div");
      panel.dataset.coquiJobUpdates = "true";
      panel.className = "coqui-job-update-strip";
      const latest = unread[0];
      panel.replaceChildren();
      const heading = document.createElement("strong");
      heading.textContent = `💼 ${unread.length} actualización${unread.length === 1 ? "" : "es"} de empleo`;
      const detail = document.createElement("span");
      detail.textContent = latest.body;
      panel.append(heading, detail);
      if (!existing) tracker.prepend(panel);
    }

    function openFromEmployerCard(event: Event) {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button");
      if (!button || !isApplicationButton(button.textContent || "")) return;
      const card = button.closest<HTMLElement>(".candidate-inbox article");
      if (!card) return;
      const text = normalize(card.innerText);
      const match = employerByIdentity.find(({ name, job }) => text.includes(name) && text.includes(job));
      if (!match) return;
      event.preventDefault();
      event.stopPropagation();
      void openApplication(match.application);
    }

    patchCandidateTracker();
    document.addEventListener("click", openFromEmployerCard, true);
    const observer = new MutationObserver(patchCandidateTracker);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      document.removeEventListener("click", openFromEmployerCard, true);
      observer.disconnect();
    };
  }, [candidateApplications, employerByIdentity, jobNotifications, openApplication, session]);

  async function changeStatus(status: Exclude<JobApplicationStatus, "submitted" | "withdrawn">) {
    if (!session || !selected) return;
    setBusy(true);
    setNotice("");
    try {
      await rpc<boolean>(session.access_token, "update_job_application_status", {
        p_application_id: selected.id,
        p_status: status,
      });
      setSelected((current) => current ? { ...current, status } : current);
      setEmployerApplications((rows) => rows.map((row) => row.id === selected.id ? { ...row, status } : row));
      setNotice(`Estado actualizado a “${STATUS_LABELS[status]}”. El candidato recibió una notificación.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No pudimos actualizar el estado.");
    } finally {
      setBusy(false);
    }
  }

  async function sendApplicationMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !selected || !message.trim()) return;
    setBusy(true);
    setNotice("");
    try {
      await rpc<string>(session.access_token, "send_job_application_message", {
        p_application_id: selected.id,
        p_body: message.trim(),
      });
      setMessage("");
      setNotice("Mensaje enviado. También generamos un aviso para el candidato.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No pudimos enviar el mensaje.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadResume() {
    if (!session || !selected) return;
    if (!contact?.resume_storage_path) {
      setNotice("Esta solicitud no tiene un archivo de resumé adjunto. Puedes revisar el historial profesional en el perfil.");
      return;
    }
    setBusy(true);
    setNotice("");
    try {
      const safePath = contact.resume_storage_path.split("/").map(encodeURIComponent).join("/");
      const response = await fetch(`${SUPABASE_URL}/storage/v1/object/authenticated/resume-files/${safePath}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
        cache: "no-store",
      });
      if (!response.ok) throw new Error("No pudimos descargar el resumé.");
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = contact.resume_title || "resume-candidato";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      setNotice("Resumé descargado de forma segura.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No pudimos descargar el resumé.");
    } finally {
      setBusy(false);
    }
  }

  if (!selected) return null;

  const currentStatus = STATUS_LABELS[selected.status] || selected.status;
  return (
    <div className="job-application-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setSelected(null);
    }}>
      <section className="job-application-modal" role="dialog" aria-modal="true" aria-labelledby="job-application-title">
        <header>
          <div>
            <span>Solicitud Quick Click</span>
            <h2 id="job-application-title">{selected.display_name || "Candidato"}</h2>
            <p>{selected.headline || "Perfil profesional"} · {selected.municipality || "Puerto Rico"}</p>
          </div>
          <button type="button" className="job-application-close" onClick={() => setSelected(null)} aria-label="Cerrar">×</button>
        </header>

        <div className="job-application-context">
          <div><small>Solicitó para</small><strong>{selected.job_title}</strong><span>{selected.company}</span></div>
          <div><small>Estado actual</small><strong>{currentStatus}</strong><span>{new Date(selected.submitted_at).toLocaleDateString("es-PR")}</span></div>
          <div><small>Experiencia</small><strong>{selected.years_experience == null ? "No indicada" : `${selected.years_experience} año${selected.years_experience === 1 ? "" : "s"}`}</strong><span>{selected.visible_to_employers ? "Perfil visible a patronos" : "Perfil privado"}</span></div>
        </div>

        <div className="job-application-body">
          <main>
            <section>
              <h3>Perfil profesional</h3>
              <p>{selected.professional_summary || "El candidato no añadió un resumen profesional."}</p>
            </section>
            <section>
              <h3>Destrezas</h3>
              <div className="job-application-skills">
                {(selected.skills || []).length ? selected.skills?.map((skill) => <span key={skill}>{skill}</span>) : <em>No indicó destrezas.</em>}
              </div>
            </section>
            <section>
              <h3>Contacto y documentos</h3>
              <div className="job-application-contact-actions">
                {contact?.candidate_email ? <a href={`mailto:${contact.candidate_email}?subject=${encodeURIComponent(`Coqui Ventas — ${selected.job_title}`)}`}>✉ Enviar email</a> : <button type="button" disabled>✉ Email no disponible</button>}
                <button type="button" onClick={downloadResume} disabled={busy}>⬇ {contact?.resume_storage_path ? "Descargar resumé" : "Ver historial del perfil"}</button>
              </div>
              {contact?.candidate_email && <small className="job-application-email">{contact.candidate_email}</small>}
            </section>
          </main>

          <aside>
            <section>
              <h3>Estado de la solicitud</h3>
              <p>Cada cambio se refleja en el Job Tracker del candidato y genera un aviso.</p>
              <div className="job-application-statuses">
                {EMPLOYER_STATUSES.map((option) => (
                  <button key={option.value} type="button" disabled={busy || selected.status === option.value} className={selected.status === option.value ? "active" : ""} onClick={() => changeStatus(option.value)}>
                    {selected.status === option.value ? "✓ " : ""}{option.label}
                  </button>
                ))}
              </div>
            </section>
            <form onSubmit={sendApplicationMessage}>
              <h3>Mensaje privado</h3>
              <p>El candidato recibe el mensaje en Coqui Ventas y una notificación.</p>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={5000} required placeholder="Ej. Nos interesa coordinar una entrevista. ¿Qué disponibilidad tienes esta semana?" />
              <button type="submit" disabled={busy || !message.trim()}>{busy ? "Procesando…" : "Enviar mensaje"}</button>
            </form>
          </aside>
        </div>

        {notice && <div className="job-application-notice" role="status">{notice}</div>}
      </section>
    </div>
  );
}
