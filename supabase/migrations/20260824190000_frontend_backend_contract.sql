-- Block 1: align public frontend reads with the real Supabase security model.

grant select on table public.profiles to anon;
grant select on table public.rescue_profiles to anon;
grant select on table public.employers to anon;
-- Required only so anonymous RLS expressions can evaluate adoption visibility;
-- adoption_interests itself remains protected by RLS and exposes no rows to anon.
grant select on table public.adoption_interests to anon;

drop policy if exists employers_public_read_anon on public.employers;
create policy employers_public_read_anon
on public.employers
for select
to anon
using (verification_status = 'verified'::public.employer_verification_status and is_active = true);

drop policy if exists listing_images_read on public.listing_images;
create policy listing_images_read
on public.listing_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.listings l
    where l.id = listing_images.listing_id
      and (
        l.status in ('available'::public.listing_status, 'pending'::public.listing_status)
        or (l.status = 'sold'::public.listing_status and l.sold_at is not null and l.sold_at >= now() - interval '24 hours')
        or l.seller_id = (select auth.uid())
      )
  )
);

create or replace function private.can_read_listing_image(p_listing_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.listings l
    where l.id = p_listing_id
      and (
        l.status in ('available'::public.listing_status, 'pending'::public.listing_status)
        or (l.status = 'sold'::public.listing_status and l.sold_at is not null and l.sold_at >= now() - interval '24 hours')
        or l.seller_id = p_user_id
      )
  );
$$;

create or replace function private.can_read_experience_image(p_experience_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.experiences e
    join public.tourism_providers tp on tp.id = e.provider_id
    where e.id = p_experience_id
      and (e.status = 'published'::public.experience_status or tp.owner_user_id = p_user_id)
  );
$$;

create or replace function private.can_read_cultural_event_image(p_event_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.cultural_events ce
    join public.cultural_organizers co on co.id = ce.organizer_id
    where ce.id = p_event_id
      and (ce.status = 'published'::public.cultural_event_status or co.owner_user_id = p_user_id)
  );
$$;

revoke all on function private.can_read_listing_image(uuid, uuid) from public;
revoke all on function private.can_read_experience_image(uuid, uuid) from public;
revoke all on function private.can_read_cultural_event_image(uuid, uuid) from public;
grant execute on function private.can_read_listing_image(uuid, uuid) to anon, authenticated;
grant execute on function private.can_read_experience_image(uuid, uuid) to anon, authenticated;
grant execute on function private.can_read_cultural_event_image(uuid, uuid) to anon, authenticated;

drop policy if exists listing_storage_read on storage.objects;
create policy listing_storage_read
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'listing-images'
  and private.can_read_listing_image((nullif((storage.foldername(name))[1], ''))::uuid, (select auth.uid()))
);

drop policy if exists experience_storage_read on storage.objects;
create policy experience_storage_read
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'experience-images'
  and private.can_read_experience_image((nullif((storage.foldername(name))[1], ''))::uuid, (select auth.uid()))
);

drop policy if exists cultural_storage_read on storage.objects;
create policy cultural_storage_read
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'cultural-event-images'
  and private.can_read_cultural_event_image((nullif((storage.foldername(name))[1], ''))::uuid, (select auth.uid()))
);
