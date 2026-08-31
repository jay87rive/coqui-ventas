create or replace function public.create_offer(
  p_listing_id uuid,
  p_amount numeric
)
returns public.offers
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_actor uuid := (select auth.uid());
  v_listing public.listings%rowtype;
  v_offer public.offers%rowtype;
begin
  if v_actor is null then
    raise exception 'Authentication required';
  end if;
  if p_amount is null or p_amount <= 0 then
    raise exception 'Offer amount must be greater than zero';
  end if;

  select * into v_listing
  from public.listings
  where id = p_listing_id
  for share;

  if not found or v_listing.status <> 'available'::public.listing_status then
    raise exception 'Listing is not available';
  end if;
  if v_listing.seller_id = v_actor then
    raise exception 'Seller cannot make an offer on own listing';
  end if;
  if v_listing.is_free then
    raise exception 'Offers are not allowed on free listings';
  end if;
  if not v_listing.is_negotiable then
    raise exception 'Listing does not accept offers';
  end if;

  perform public.start_listing_conversation(p_listing_id);

  insert into public.offers (
    listing_id, buyer_id, seller_id, offered_by_user_id,
    offered_by, amount, status
  ) values (
    p_listing_id, v_actor, v_listing.seller_id, v_actor,
    'buyer'::public.offer_actor, p_amount, 'pending'::public.offer_status
  ) returning * into v_offer;

  insert into public.notifications (
    user_id, module, channel, title, body,
    related_content_type, related_content_id, metadata, status
  ) values (
    v_listing.seller_id,
    'offers'::public.notification_module,
    'in_app'::public.notification_channel,
    'Nueva oferta',
    'Recibiste una oferta de $' || trim(to_char(p_amount, 'FM9999999990.00')) || '.',
    'offer',
    v_offer.id,
    jsonb_build_object('listing_id', p_listing_id, 'offer_id', v_offer.id),
    'queued'::public.notification_status
  );

  return v_offer;
end;
$function$;

revoke all on function public.create_offer(uuid, numeric) from public, anon;
grant execute on function public.create_offer(uuid, numeric) to authenticated;

revoke insert, update, delete on table public.offers from anon, authenticated;
grant select on table public.offers to authenticated;
