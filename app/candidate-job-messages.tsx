"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sexbivrfdpbhvdgsvgwv.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_wvAe2A3-XQoQDUzI7ylDUg_qj3yNv6s";

type StoredSession = {
  access_token: string;
  user: { id: string };
};

type JobMessage = {
  id: string;
  body: string | null;
  sender_id: string;
  created_at: string;
};

type JobConversation = {
  conversation_id: string;
  job_application_id: string;
  job_title: string;
  company: string;
  other_user_id: string | null;
  other_person: string;
  created_at: string;
  messages: JobMessage[] | null;
};

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

function headers(token: string) {
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

async function rpc<T>(token: string, name: string, body: Record<string, unknown> = {}) {
  return parseResponse<T>(await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(body),
    cache: "no-store",
  }));
}

function messageDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("es-PR", { dateStyle: "medium", timeStyle: "short" });
}

export default function CandidateJobMessages() {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const [session, setSession] = useState<StoredSession | null>(null);
  const [conversations, setConversations] = useState<JobConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    const current = getSession();
    setSession(current);
    if (!current) {
      setConversations([]);
      return;
    }
    const rows = await rpc<JobConversation[]>(current.access_token, "get_my_job_conversations").catch(() => []);
    setConversations(rows);
  }, []);

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), 10000);
    const onStorage = (event: StorageEvent) => {
      if (event.key === "coqui-session") void refresh();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  useEffect(() => {
    const findHost = () => setHost(document.querySelector<HTMLElement>(".job-tracker"));
    findHost();
    const observer = new MutationObserver(findHost);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const selected = useMemo(
    () => conversations.find((conversation) => conversation.conversation_id === selectedId) || null,
    [conversations, selectedId],
  );

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !selected || !reply.trim()) return;
    setBusy(true);
    setNotice("");
    try {
      await rpc<string>(session.access_token, "send_job_conversation_reply", {
        p_conversation_id: selected.conversation_id,
        p_body: reply.trim(),
      });
      setReply("");
      setNotice("Mensaje enviado. La otra persona recibió una notificación.");
      await refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "No pudimos enviar el mensaje.");
    } finally {
      setBusy(false);
    }
  }

  const panel = host && conversations.length ? createPortal(
    <section className="coqui-job-message-center" aria-label="Mensajes de empleo">
      <div className="coqui-job-message-heading">
        <div>
          <span>Mensajes de empleo</span>
          <strong>Conversaciones sobre tus solicitudes</strong>
        </div>
        <small>{conversations.length} conversación{conversations.length === 1 ? "" : "es"}</small>
      </div>
      <div className="coqui-job-message-list">
        {conversations.slice(0, 5).map((conversation) => {
          const messages = conversation.messages || [];
          const latest = messages.at(-1);
          return (
            <button key={conversation.conversation_id} type="button" onClick={() => {
              setSelectedId(conversation.conversation_id);
              setNotice("");
            }}>
              <span>💼</span>
              <div>
                <strong>{conversation.job_title}</strong>
                <small>{conversation.company} · {conversation.other_person}</small>
                <p>{latest?.body || "Conversación iniciada sobre esta solicitud."}</p>
              </div>
              <time>{latest ? messageDate(latest.created_at) : messageDate(conversation.created_at)}</time>
            </button>
          );
        })}
      </div>
    </section>,
    host,
  ) : null;

  return (
    <>
      {panel}
      {selected && (
        <div className="coqui-job-message-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedId(null);
        }}>
          <section className="coqui-job-message-modal" role="dialog" aria-modal="true" aria-labelledby="coqui-job-message-title">
            <header>
              <div>
                <span>Conversación de empleo</span>
                <h2 id="coqui-job-message-title">{selected.job_title}</h2>
                <p>{selected.company} · {selected.other_person}</p>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} aria-label="Cerrar">×</button>
            </header>

            <div className="coqui-job-message-thread">
              {(selected.messages || []).length ? (selected.messages || []).map((message) => {
                const mine = message.sender_id === session?.user.id;
                return (
                  <article key={message.id} className={mine ? "mine" : "theirs"}>
                    <strong>{mine ? "Tú" : selected.other_person}</strong>
                    <p>{message.body}</p>
                    <time>{messageDate(message.created_at)}</time>
                  </article>
                );
              }) : <p className="coqui-job-message-empty">Todavía no hay mensajes en esta conversación.</p>}
            </div>

            <form onSubmit={sendReply}>
              <textarea value={reply} onChange={(event) => setReply(event.target.value)} maxLength={5000} required placeholder="Escribe tu respuesta…" />
              <button type="submit" disabled={busy || !reply.trim()}>{busy ? "Enviando…" : "Enviar mensaje"}</button>
            </form>
            {notice && <div className="coqui-job-message-notice" role="status">{notice}</div>}
          </section>
        </div>
      )}
    </>
  );
}
