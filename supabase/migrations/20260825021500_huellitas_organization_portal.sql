drop policy if exists rescue_profiles_manage_own on public.rescue_profiles;

create policy rescue_profiles_insert_own_safe
on public.rescue_profiles for insert to authenticated
with check (
  owner_user_id = (select auth.uid())
  and verification_status in ('unverified', 'pending')
  and institutional_fee_allowed = false
  and donation_enabled = false
);

create policy rescue_profiles_update_own
on public.rescue_profiles for update to authenticated
using (owner_user_id = (select auth.uid()))
with check (owner_user_id = (select auth.uid()));

create policy rescue_profiles_delete_own
on public.rescue_profiles for delete to authenticated
using (owner_user_id = (select auth.uid()));

create or replace function public.update_adoption_interest_status(
  p_interest_id uuid,
  p_status public.adoption_interest_status
)
returns public.adoption_interests
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'private'
as $function$
declare
  v_interest public.adoption_interests;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if p_status not in ('reviewing', 'contacted', 'approved', 'declined', 'completed') then
    raise exception 'Invalid organization response status';
  end if;

  update public.adoption_interests ai
     set status = p_status,
         updated_at = now()
   where ai.id = p_interest_id
     and exists (
       select 1
       from public.animals a
       join public.rescue_profiles rp on rp.id = a.rescue_profile_id
       where a.id = ai.animal_id
         and rp.owner_user_id = auth.uid()
         and rp.verification_status = 'verified'
         and rp.is_active = true
     )
  returning ai.* into v_interest;

  if v_interest.id is null then
    raise exception 'Interest not found or organization not authorized';
  end if;

  return v_interest;
end;
$function$;

revoke all on function public.update_adoption_interest_status(uuid, public.adoption_interest_status) from public, anon;
grant execute on function public.update_adoption_interest_status(uuid, public.adoption_interest_status) to authenticated;
