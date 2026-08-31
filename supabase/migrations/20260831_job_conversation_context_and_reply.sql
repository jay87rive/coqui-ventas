create or replace function public.get_my_job_conversations()
returns table(
  conversation_id uuid,
  job_application_id uuid,
  job_title text,
  company text,
  other_user_id uuid,
  other_person text,
  created_at timestamptz,
  messages jsonb
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    c.id,
    c.job_application_id,
    j.title,
    e.public_name,
    other_member.user_id,
    coalesce(other_profile.display_name, 'Usuario de Coqui Ventas'),
    c.created_at,
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', m.id,
            'body', m.body,
            'sender_id', m.sender_id,
            'created_at', m.created_at
          ) order by m.created_at
        )
        from public.messages m
        where m.conversation_id = c.id
          and m.deleted_at is null
      ),
      '[]'::jsonb
    )
  from public.conversations c
  join public.job_applications a on a.id = c.job_application_id
  join public.jobs j on j.id = a.job_id
  join public.employers e on e.id = j.employer_id
  left join lateral (
    select cm.user_id
    from public.conversation_members cm
    where cm.conversation_id = c.id
      and cm.user_id <> (select auth.uid())
    order by cm.joined_at
    limit 1
  ) other_member on true
  left join public.profiles other_profile on other_profile.id = other_member.user_id
  where (select auth.uid()) is not null
    and private.is_conversation_member(c.id, (select auth.uid()))
  order by coalesce(
    (select max(m2.created_at) from public.messages m2 where m2.conversation_id = c.id and m2.deleted_at is null),
    c.created_at
  ) desc;
$$;

grant execute on function public.get_my_job_conversations() to authenticated;

create or replace function public.send_job_conversation_reply(p_conversation_id uuid, p_body text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor uuid := (select auth.uid());
  v_message_id uuid;
  v_application_id uuid;
  v_job_title text;
  v_company text;
  v_recipient uuid;
  v_actor_name text;
begin
  if v_actor is null then raise exception 'Authentication required'; end if;
  if p_body is null or char_length(trim(p_body)) = 0 then raise exception 'Message cannot be empty'; end if;
  if char_length(trim(p_body)) > 5000 then raise exception 'Message is too long'; end if;
  if not private.is_conversation_member(p_conversation_id, v_actor) then raise exception 'Not a conversation member'; end if;

  select c.job_application_id, j.title, e.public_name
  into v_application_id, v_job_title, v_company
  from public.conversations c
  join public.job_applications a on a.id = c.job_application_id
  join public.jobs j on j.id = a.job_id
  join public.employers e on e.id = j.employer_id
  where c.id = p_conversation_id;

  if v_application_id is null then raise exception 'Job conversation not found'; end if;

  select cm.user_id into v_recipient
  from public.conversation_members cm
  where cm.conversation_id = p_conversation_id
    and cm.user_id <> v_actor
  order by cm.joined_at
  limit 1;

  if v_recipient is null then raise exception 'Conversation recipient not found'; end if;

  select coalesce(p.display_name, 'Usuario de Coqui Ventas') into v_actor_name
  from public.profiles p where p.id = v_actor;

  insert into public.messages(conversation_id, sender_id, type, body, metadata)
  values(
    p_conversation_id,
    v_actor,
    'text'::public.message_type,
    trim(p_body),
    jsonb_build_object('job_application_id', v_application_id, 'job_title', v_job_title)
  ) returning id into v_message_id;

  insert into public.notifications(
    user_id, module, channel, title, body, related_content_type,
    related_content_id, metadata, status
  ) values (
    v_recipient,
    'messages'::public.notification_module,
    'in_app'::public.notification_channel,
    'Nuevo mensaje de ' || coalesce(v_actor_name, v_company),
    'Tienes un mensaje sobre ' || v_job_title || '.',
    'conversation',
    p_conversation_id,
    jsonb_build_object(
      'job_application_id', v_application_id,
      'job_title', v_job_title,
      'company', v_company,
      'conversation_id', p_conversation_id
    ),
    'queued'::public.notification_status
  );

  return v_message_id;
end;
$$;

grant execute on function public.send_job_conversation_reply(uuid, text) to authenticated;
