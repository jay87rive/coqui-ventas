create table if not exists public.job_profile_views (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.job_applications(id) on delete cascade,
  candidate_id uuid not null references auth.users(id) on delete cascade,
  employer_id uuid not null references public.employers(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  unique (application_id, employer_id)
);

alter table public.job_profile_views enable row level security;

create policy job_profile_views_candidate_read
on public.job_profile_views for select to authenticated
using ((select auth.uid()) = candidate_id);

create or replace function public.apply_to_job(p_job_id uuid)
returns public.job_applications
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_actor uuid := (select auth.uid());
  v_job public.jobs%rowtype;
  v_application public.job_applications%rowtype;
begin
  if v_actor is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.job_seeker_profiles where user_id = v_actor) then
    raise exception 'Complete your Quick Click profile first';
  end if;
  select * into v_job from public.jobs where id = p_job_id and status = 'published'::public.job_status;
  if not found then raise exception 'Job is not available'; end if;
  if exists (select 1 from public.employers where id = v_job.employer_id and owner_user_id = v_actor) then
    raise exception 'Employer cannot apply to own job';
  end if;
  insert into public.job_applications (job_id, applicant_id, cover_message, status)
  values (p_job_id, v_actor, 'Solicitud enviada con Quick Click.', 'submitted'::public.job_application_status)
  on conflict (job_id, applicant_id) do nothing
  returning * into v_application;
  if v_application.id is null then raise exception 'Application already submitted'; end if;
  insert into public.notifications (user_id,module,channel,title,body,related_content_type,related_content_id,metadata,status)
  select e.owner_user_id,'jobs'::public.notification_module,'in_app'::public.notification_channel,
    'Nueva solicitud Quick Click','Recibiste una solicitud para ' || v_job.title,
    'job_application',v_application.id,jsonb_build_object('job_id',p_job_id,'application_id',v_application.id),
    'queued'::public.notification_status
  from public.employers e where e.id = v_job.employer_id;
  return v_application;
end;
$function$;

create or replace function public.record_job_profile_view(p_application_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_actor uuid := (select auth.uid());
  v_application public.job_applications%rowtype;
  v_employer public.employers%rowtype;
begin
  if v_actor is null then raise exception 'Authentication required'; end if;
  select a.* into v_application
  from public.job_applications a join public.jobs j on j.id = a.job_id
  where a.id = p_application_id;
  if not found then raise exception 'Application not found'; end if;
  select e.* into v_employer from public.employers e
  join public.jobs j on j.employer_id = e.id
  where j.id = v_application.job_id and e.owner_user_id = v_actor and e.verification_status = 'verified'::public.employer_verification_status;
  if not found then raise exception 'Verified employer authorization required'; end if;
  insert into public.job_profile_views(application_id,candidate_id,employer_id)
  values (v_application.id,v_application.applicant_id,v_employer.id)
  on conflict (application_id,employer_id) do nothing;
  if v_application.status = 'submitted'::public.job_application_status then
    update public.job_applications set status='viewed'::public.job_application_status,updated_at=now() where id=v_application.id;
  end if;
end;
$function$;

revoke all on function public.apply_to_job(uuid) from public, anon;
revoke all on function public.record_job_profile_view(uuid) from public, anon;
grant execute on function public.apply_to_job(uuid) to authenticated;
grant execute on function public.record_job_profile_view(uuid) to authenticated;
revoke insert, update, delete on public.job_profile_views from anon, authenticated;
grant select on public.job_profile_views to authenticated;
