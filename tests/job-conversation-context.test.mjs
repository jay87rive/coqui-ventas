import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const component = readFileSync(new URL("../app/candidate-job-messages.tsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const migration = readFileSync(new URL("../supabase/migrations/20260831_job_conversation_context_and_reply.sql", import.meta.url), "utf8");

const checks = [
  ["carga conversaciones de empleo", component.includes('get_my_job_conversations')],
  ["responde por RPC seguro", component.includes('send_job_conversation_reply')],
  ["muestra título del empleo", component.includes('conversation.job_title')],
  ["muestra compañía", component.includes('conversation.company')],
  ["muestra otra persona", component.includes('conversation.other_person')],
  ["muestra historial de mensajes", component.includes('(selected.messages || []).map')],
  ["distingue mensajes propios", component.includes('message.sender_id === session?.user.id')],
  ["limita respuesta a 5000", component.includes('maxLength={5000}')],
  ["refresca luego de enviar", component.includes('await refresh()')],
  ["se monta en el Job Tracker", component.includes('document.querySelector<HTMLElement>(".job-tracker")')],
  ["layout monta el centro", layout.includes('<CandidateJobMessages />')],
  ["layout importa estilos", layout.includes('candidate-job-messages.css')],
  ["RPC sólo devuelve conversaciones propias", migration.includes('private.is_conversation_member(c.id, (select auth.uid()))')],
  ["RPC de respuesta exige membresía", migration.includes('private.is_conversation_member(p_conversation_id, v_actor)')],
  ["respuesta genera notificación", migration.includes("'messages'::public.notification_module")],
  ["notificación conserva conversation id", migration.includes("'conversation_id', p_conversation_id")],
];

for (const [name, condition] of checks) test(name, () => assert.equal(condition, true));
