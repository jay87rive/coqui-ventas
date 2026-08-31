create or replace function public.get_employer_job_applications()
returns table (
  id uuid,
  job_id uuid,
  applicant_id uuid,
  status text,
  submitted_at timestamptz,
  job_title text,
  company text,
  display_name text,
  headline text,
  professional_summary text,
  municipality text,
  skills text[],
  years_experience numeric,
  visible_to_employers boolean
)
language sql
stable
security invoker
set search_path = ''
as $function$
  select
    a.id,
    a.job_id,
    a.applicant_id,
    a.status::text,
    a.submitted_at,
    j.title,
    e.public_name,
    p.display_name,
    jsp.headline,
    jsp.professional_summary,
    jsp.municipality,
    coalesce(jsp.skills, array[]::text[]),
    jsp.years_experience,
    coalesce(jsp.visible_to_employers, false)
  from public.employers e
  join public.jobs j on j.employer_id = e.id
  join public.job_applications a on a.job_id = j.id
  left join public.profiles p on p.id = a.applicant_id
  left join public.job_seeker_profiles jsp on jsp.user_id = a.applicant_id
  where e.owner_user_id = (select auth.uid())
  order by a.submitted_at desc;
$function$;

revoke all on function public.get_employer_job_applications() from public, anon;
grant execute on function public.get_employer_job_applications() to authenticated;
