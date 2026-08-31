create index if not exists job_profile_views_candidate_id_idx
  on public.job_profile_views (candidate_id);

create index if not exists job_profile_views_employer_id_idx
  on public.job_profile_views (employer_id);

-- This read-only public RPC intentionally uses definer rights because the underlying
-- billing tables stay private; it returns only listing ids and feature timestamps.
alter function public.get_active_listing_promotions() security definer;

create or replace function private.protect_profile_admin_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if auth.uid() is not null and auth.uid() = old.id and not private.is_admin() then
    if current_setting('app.coqui_account_deletion', true) = '1' then
      if new.account_status <> 'deleted'::public.account_status
         or new.phone_verified
         or new.identity_verified then
        raise exception 'Invalid account deletion transition';
      end if;
    elsif new.account_status is distinct from old.account_status
       or new.phone_verified is distinct from old.phone_verified
       or new.identity_verified is distinct from old.identity_verified then
      raise exception 'Account status and verification fields can only be changed by authorized Coqui processes';
    end if;
  end if;
  return new;
end;
$function$;

create or replace function public.request_account_deletion()
returns jsonb
language plpgsql
security definer
set search_path = 'pg_catalog', 'public', 'private'
as $function$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  perform set_config('app.coqui_account_deletion', '1', true);

  update public.listings
     set status = 'removed', updated_at = now()
   where seller_id = v_user_id
     and status not in ('sold', 'removed');

  delete from public.favorites where user_id = v_user_id;
  update public.push_devices set is_active = false, updated_at = now() where user_id = v_user_id;
  update public.profiles
     set display_name = 'Miembro retirado',
         avatar_url = null,
         municipality = null,
         bio = null,
         account_status = 'deleted',
         phone_verified = false,
         identity_verified = false,
         updated_at = now()
   where id = v_user_id;

  return jsonb_build_object('deleted', true);
end;
$function$;

revoke all on function public.request_account_deletion() from public, anon;
grant execute on function public.request_account_deletion() to authenticated;

create or replace function public.get_coqui_admin_dashboard()
returns jsonb
language plpgsql
stable
security definer
set search_path = 'pg_catalog', 'public', 'private'
as $function$
begin
  if auth.uid() is null or not private.is_admin() then
    raise exception 'Admin authorization required';
  end if;

  return jsonb_build_object(
    'reports_open', (select count(*) from public.reports where status in ('submitted', 'under_review')),
    'disputes_open', (select count(*) from public.disputes where status in ('submitted', 'under_review', 'awaiting_evidence')),
    'appeals_open', (select count(*) from public.appeals where status in ('submitted', 'under_review')),
    'rescue_verifications_pending', (select count(*) from public.rescue_profiles where verification_status = 'pending'),
    'accounts_restricted', (select count(*) from public.profiles where account_status in ('restricted', 'suspended')),
    'notifications_pending', (select count(*) from public.notifications where status in ('queued', 'failed')),
    'generated_at', now()
  );
end;
$function$;

revoke all on function public.get_coqui_admin_dashboard() from public, anon;
grant execute on function public.get_coqui_admin_dashboard() to authenticated;
