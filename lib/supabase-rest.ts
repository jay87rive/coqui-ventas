const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://sexbivrfdpbhvdgsvgwv.supabase.co";
const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_wvAe2A3-XQoQDUzI7ylDUg_qj3yNv6s";
export const FREE_CATEGORY_ID = "26c46c8f-9e02-4350-8857-3412259457d6";

export type Session = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: { id: string; email?: string };
};

type AuthUser = Session["user"];

export type PublicListing = {
  id: string;
  category_id: string;
  seller_id?: string;
  title: string;
  description: string;
  price: number | null;
  is_free: boolean;
  is_negotiable: boolean;
  municipality: string;
  condition: string;
  status?: "draft" | "available" | "pending" | "sold" | "paused" | "removed";
  sold_at?: string | null;
  created_at?: string;
  updated_at?: string;
  image_urls: string[];
  seller_rating?: number | null;
  seller_review_count?: number;
  seller_display_name?: string;
  seller_avatar_url?: string | null;
  is_featured?: boolean;
  featured_at?: string | null;
};

export type UserProfile = {
  id: string;
  display_name: string;
  municipality: string | null;
  bio: string | null;
  phone_verified: boolean;
  identity_verified: boolean;
  avatar_url?: string | null;
  account_status?: string;
  created_at?: string;
};

export type ConversationSummary = {
  id: string;
  listing_id: string;
  created_at: string;
  listing_title: string;
  other_person: string;
  other_user_id: string;
  messages: { id: string; body: string; sender_id: string; created_at: string }[];
};

export type OfferSummary = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  offered_by: "buyer" | "seller";
  offered_by_user_id: string;
  parent_offer_id: string | null;
  amount: number;
  status: "pending" | "accepted" | "rejected" | "countered" | "withdrawn" | "expired";
  created_at: string;
  listings?: { title?: string } | null;
};

export type SaleConfirmationSummary = {
  id: string; listing_id: string; seller_id: string; buyer_id: string;
  accepted_offer_id: string | null; agreed_price: number; status: string;
  submitted_at: string; buyer_confirmed_at: string | null; expires_at: string | null;
  listings?: { title?: string } | null;
};

export type TransactionSummary = {
  id: string; listing_id: string; seller_id: string; buyer_id: string;
  accepted_offer_id: string | null; agreed_price: number; status: string;
  completed_at: string; listings?: { title?: string } | null;
};

export type ReviewSummary = {
  id: string; transaction_id: string; reviewer_id: string; reviewed_user_id: string;
  rating: number; comment: string | null; revealed_at: string | null; created_at: string;
};

export type ReportSummary = {
  id: string; reported_user_id: string | null; listing_id: string | null;
  conversation_id: string | null; reason_code: string; description: string | null;
  status: "submitted" | "under_review" | "resolved" | "dismissed"; created_at: string;
};

export type DisputeSummary = {
  id: string; transaction_id: string; opened_by: string; reason_code: string;
  description: string; status: "submitted" | "under_review" | "awaiting_evidence" | "resolved" | "closed";
  outcome: string | null; resolution_notes: string | null; opened_at: string;
  transactions?: { listing_id?: string; agreed_price?: number; listings?: { title?: string } | null } | null;
  dispute_evidence?: { id: string; submitted_by: string; evidence_type: string; description: string | null; created_at: string }[];
};

export type ModerationActionSummary = {
  id: string; incident_id: string | null; action_type: string; reason: string;
  starts_at: string; ends_at: string | null;
};

export type AppealSummary = {
  id: string; incident_id: string | null; moderation_action_id: string | null;
  reason: string; status: "submitted" | "under_review" | "approved" | "denied";
  admin_response: string | null; created_at: string;
};

export type NotificationSummary = {
  id: string;
  module: "marketplace" | "messages" | "offers" | "jobs" | "huellitas" | "tourism" | "culture" | "disputes" | "promotions" | "system";
  channel: "in_app" | "push" | "email";
  title: string; body: string; related_content_type: string | null; related_content_id: string | null;
  metadata: Record<string, unknown>;
  status: "queued" | "sent" | "delivered" | "failed" | "read";
  created_at: string; read_at: string | null;
};

export type NotificationPreferences = {
  user_id: string; marketplace_enabled: boolean; messages_enabled: boolean; offers_enabled: boolean;
  disputes_enabled: boolean; system_enabled: boolean; promotions_enabled: boolean;
  push_enabled: boolean; email_enabled: boolean; marketing_enabled: boolean;
};

export type Category = { id: string; name: string; slug: string };

export type PublicJob = {
  id: string; title: string; company: string; municipality: string; arrangement: string;
  employmentType: string; salary: string; summary: string; requirements: string[];
  skills: string[]; posted: string; featured?: boolean; source: "supabase";
};

export type JobSeekerProfile = {
  user_id: string; headline: string | null; professional_summary: string | null; municipality: string | null;
  desired_job_titles: string[]; skills: string[]; years_experience: number | null;
  visible_to_employers: boolean;
};

export type JobApplicationSummary = {
  id: string; job_id: string; applicant_id: string; status: string; submitted_at: string;
  jobs?: { title?: string; employers?: { public_name?: string } | { public_name?: string }[] } | null;
  profiles?: { display_name?: string; job_seeker_profiles?: JobSeekerProfile | JobSeekerProfile[] | null } | { display_name?: string; job_seeker_profiles?: JobSeekerProfile | JobSeekerProfile[] | null }[] | null;
};

export type PublicAnimal = {
  id: string; name: string | null; species: string; breed: string | null; approximate_age: string | null;
  sex: "male" | "female" | "unknown"; size: "small" | "medium" | "large" | "unknown";
  municipality: string; description: string; temperament: string | null;
  compatibility_children: string | null; compatibility_dogs: string | null; compatibility_cats: string | null;
  special_needs: string | null; status: string; adoption_fee: number; adoption_fee_explanation: string | null;
  image_urls: string[];
  health: { vaccinated: string; sterilized: string; dewormed: string; microchipped: string; veterinarian_evaluated: string; medications: string | null; medical_conditions: string | null; pending_care: string | null } | null;
  rescue: { id: string; public_name: string; profile_type: string; verification_status: string; institutional_fee_allowed: boolean } | null;
};

export type RescueOrganizationProfile = {
  id: string; owner_user_id: string; profile_type: string; public_name: string;
  description: string | null; municipality: string; public_email: string | null;
  website_url: string | null; social_url: string | null; public_phone: string | null;
  verification_status: "unverified" | "pending" | "verified" | "rejected" | "suspended";
  institutional_fee_allowed: boolean; donation_enabled: boolean; donation_url: string | null;
  is_active: boolean;
};

export type AdoptionInterestSummary = {
  id: string; animal_id: string; message: string | null; status: string; submitted_at: string;
  profiles?: { display_name?: string | null } | { display_name?: string | null }[] | null;
};

export type ManagedAnimal = PublicAnimal & {
  rescue_profile_id: string; created_at: string; adoption_interests: AdoptionInterestSummary[];
};

export type ListingDraft = {
  category_id: string; title: string; description: string; municipality: string;
  price: number | null; is_free: boolean; is_negotiable: boolean; condition: string;
};

export async function optimizeListingImage(file: File): Promise<File> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("No pudimos procesar una de las fotos."));
      element.src = objectUrl;
    });
    const maxSide = 2200;
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No pudimos optimizar la foto.");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    const encode = (quality: number) => new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((result) => result ? resolve(result) : reject(new Error("No pudimos optimizar la foto.")), "image/jpeg", quality);
    });
    let blob = await encode(0.9);
    if (blob.size > 7 * 1024 * 1024) blob = await encode(0.82);
    if (blob.size > 9.5 * 1024 * 1024) blob = await encode(0.74);
    const safeName = file.name.replace(/\.[^.]+$/, "") || "foto";
    return new File([blob], `${safeName}.jpg`, { type: "image/jpeg", lastModified: Date.now() });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function optimizeAvatarImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) throw new Error("Selecciona una imagen válida.");
  const objectUrl = URL.createObjectURL(file);
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("No pudimos leer esa imagen."));
      element.src = objectUrl;
    });
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const sourceX = Math.max(0, (image.naturalWidth - side) / 2);
    const sourceY = Math.max(0, (image.naturalHeight - side) / 2);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No pudimos preparar la foto de perfil.");
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(image, sourceX, sourceY, side, side, 0, 0, 512, 512);
    const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
      (result) => result ? resolve(result) : reject(new Error("No pudimos preparar la foto de perfil.")),
      "image/jpeg",
      0.86,
    ));
    return new File([blob], "avatar.jpg", { type: "image/jpeg", lastModified: Date.now() });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function headers(token?: string) {
  return { apikey: apiKey, "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

async function parse(response: Response) {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.msg || payload.message || payload.error_description || payload.error || "No se pudo completar la solicitud.");
  return payload;
}

export async function getPublicListings(): Promise<PublicListing[]> {
  if (!url || !apiKey) return [];
  const query = "select=id,category_id,seller_id,title,description,price,is_free,is_negotiable,municipality,condition,status,sold_at,created_at,updated_at,listing_images(storage_path,position,is_primary)&status=in.(available,pending,sold)&order=updated_at.desc&limit=100";
  const [rows, reviews, activePromotions] = await Promise.all([
    parse(await fetch(`${url}/rest/v1/listings?${query}`, { headers: headers(), cache: "no-store" })),
    parse(await fetch(`${url}/rest/v1/reviews?select=reviewed_user_id,rating&revealed_at=not.is.null`, { headers: headers(), cache: "no-store" })).catch(() => []),
    parse(await fetch(`${url}/rest/v1/rpc/get_active_listing_promotions`, { method: "POST", headers: headers(), body: "{}", cache: "no-store" })).catch(() => []),
  ]);
  const featuredAtByListing = new Map((activePromotions as { listing_id: string; featured_at: string }[]).map((promotion) => [promotion.listing_id, promotion.featured_at]));
  const ratingBySeller = (reviews as { reviewed_user_id: string; rating: number }[]).reduce((map, review) => {
    const current = map.get(review.reviewed_user_id) || { total: 0, count: 0 };
    current.total += Number(review.rating);
    current.count += 1;
    map.set(review.reviewed_user_id, current);
    return map;
  }, new Map<string, { total: number; count: number }>());
  const sellerIds = [...new Set((rows as PublicListing[]).map((row) => row.seller_id).filter((id): id is string => Boolean(id)))];
  const profiles = sellerIds.length
    ? await parse(await fetch(`${url}/rest/v1/profiles?select=id,display_name,avatar_url&id=in.(${sellerIds.join(",")})&account_status=eq.active`, { headers: headers(), cache: "no-store" })).catch(() => [])
    : [];
  const profileBySeller = new Map((profiles as { id: string; display_name: string; avatar_url: string | null }[]).map((profile) => [profile.id, profile]));
  const visibleRows = rows.filter((row: PublicListing) => row.status !== "sold" || !row.sold_at || Date.now() - new Date(row.sold_at).getTime() <= 24 * 60 * 60 * 1000);
  return Promise.all(visibleRows.map(async (row: PublicListing & { listing_images?: { storage_path: string; position: number; is_primary: boolean }[] }) => {
    const images = [...(row.listing_images || [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.position - b.position);
    const image_urls = (await Promise.all(images.map(image => downloadListingImage(image.storage_path)))).filter((value): value is string => Boolean(value));
    const { listing_images: _images, ...listing } = row;
    void _images;
    const sellerRatings = row.seller_id ? ratingBySeller.get(row.seller_id) : undefined;
    const sellerProfile = row.seller_id ? profileBySeller.get(row.seller_id) : undefined;
    const featured_at = featuredAtByListing.get(row.id) || null;
    return { ...listing, image_urls, seller_rating: sellerRatings ? sellerRatings.total / sellerRatings.count : null, seller_review_count: sellerRatings?.count || 0, seller_display_name: sellerProfile?.display_name || "Miembro de Coquí Ventas", seller_avatar_url: sellerProfile?.avatar_url || null, is_featured: Boolean(featured_at), featured_at };
  }));
}

async function downloadListingImage(path: string) {
  const response = await fetch(`${url}/storage/v1/object/authenticated/listing-images/${path}`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` }, cache: "no-store"
  });
  if (!response.ok) return null;
  return URL.createObjectURL(await response.blob());
}

async function downloadAnimalImage(path: string, token?: string) {
  const response = await fetch(`${url}/storage/v1/object/authenticated/animal-images/${path}`, {
    headers: { apikey: apiKey, Authorization: `Bearer ${token || apiKey}` }, cache: "no-store"
  });
  if (!response.ok) return null;
  return URL.createObjectURL(await response.blob());
}

export async function getMyRescueWorkspace(token: string, userId: string): Promise<{ profile: RescueOrganizationProfile | null; animals: ManagedAnimal[] }> {
  const profileRows = await parse(await fetch(`${url}/rest/v1/rescue_profiles?select=id,owner_user_id,profile_type,public_name,description,municipality,public_email,website_url,social_url,public_phone,verification_status,institutional_fee_allowed,donation_enabled,donation_url,is_active&owner_user_id=eq.${userId}&order=created_at.asc&limit=1`, { headers: headers(token), cache: "no-store" }));
  const profile = (profileRows[0] || null) as RescueOrganizationProfile | null;
  if (!profile) return { profile: null, animals: [] };
  const rows = await parse(await fetch(`${url}/rest/v1/animals?select=id,rescue_profile_id,name,species,breed,approximate_age,sex,size,municipality,description,temperament,compatibility_children,compatibility_dogs,compatibility_cats,special_needs,status,adoption_fee,adoption_fee_explanation,created_at,animal_images(storage_path,position,is_primary),animal_health(vaccinated,sterilized,dewormed,microchipped,veterinarian_evaluated,medications,medical_conditions,pending_care),adoption_interests(id,animal_id,message,status,submitted_at,profiles(display_name))&rescue_profile_id=eq.${profile.id}&order=created_at.desc`, { headers: headers(token), cache: "no-store" }));
  const animals = await Promise.all((rows as Array<Record<string, unknown> & { animal_images?: { storage_path: string; position: number; is_primary: boolean }[]; animal_health?: PublicAnimal["health"] | PublicAnimal["health"][]; adoption_interests?: AdoptionInterestSummary[] }>).map(async (row) => {
    const images = [...(row.animal_images || [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.position - b.position);
    const image_urls = (await Promise.all(images.map((image) => downloadAnimalImage(image.storage_path, token)))).filter((value): value is string => Boolean(value));
    const health = Array.isArray(row.animal_health) ? row.animal_health[0] || null : row.animal_health || null;
    const { animal_images: _images, animal_health: _health, ...animal } = row;
    void _images; void _health;
    return { ...animal, adoption_fee: Number(animal.adoption_fee || 0), image_urls, health, rescue: profile, adoption_interests: row.adoption_interests || [] } as ManagedAnimal;
  }));
  return { profile, animals };
}

export async function registerRescueOrganization(token: string, userId: string, details: { public_name: string; municipality: string; description: string; public_email: string; website_url?: string | null }) {
  const rows = await parse(await fetch(`${url}/rest/v1/rescue_profiles`, { method: "POST", headers: { ...headers(token), Prefer: "return=representation" }, body: JSON.stringify({ owner_user_id: userId, profile_type: "nonprofit", public_name: details.public_name, municipality: details.municipality, description: details.description, public_email: details.public_email, website_url: details.website_url || null, verification_status: "pending" }) }));
  return rows[0] as RescueOrganizationProfile;
}

export async function createOrganizationAnimal(token: string, profile: RescueOrganizationProfile, draft: { name: string; species: string; municipality: string; description: string; sex: string; size: string; vaccinated: string; sterilized: string; veterinarian_evaluated: string; adoption_fee: number; adoption_fee_explanation: string | null }, file: File) {
  const animals = await parse(await fetch(`${url}/rest/v1/animals`, { method: "POST", headers: { ...headers(token), Prefer: "return=representation" }, body: JSON.stringify({ rescue_profile_id: profile.id, name: draft.name, species: draft.species, municipality: draft.municipality, description: draft.description, sex: draft.sex, size: draft.size, adoption_fee: draft.adoption_fee, adoption_fee_explanation: draft.adoption_fee_explanation, status: "draft" }) }));
  const animalId = String(animals[0].id);
  await parse(await fetch(`${url}/rest/v1/animal_health`, { method: "POST", headers: { ...headers(token), Prefer: "return=minimal" }, body: JSON.stringify({ animal_id: animalId, vaccinated: draft.vaccinated, sterilized: draft.sterilized, veterinarian_evaluated: draft.veterinarian_evaluated }) }));
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${profile.id}/${animalId}/${crypto.randomUUID()}.${extension}`;
  const upload = await fetch(`${url}/storage/v1/object/animal-images/${path}`, { method: "POST", headers: { apikey: apiKey, Authorization: `Bearer ${token}`, "Content-Type": file.type, "x-upsert": "false" }, body: file });
  if (!upload.ok) await parse(upload);
  await parse(await fetch(`${url}/rest/v1/animal_images`, { method: "POST", headers: { ...headers(token), Prefer: "return=minimal" }, body: JSON.stringify({ animal_id: animalId, storage_path: path, position: 0, is_primary: true }) }));
  await parse(await fetch(`${url}/rest/v1/animals?id=eq.${animalId}`, { method: "PATCH", headers: { ...headers(token), Prefer: "return=representation" }, body: JSON.stringify({ status: "available" }) }));
  return animalId;
}

export async function updateOrganizationAnimalStatus(token: string, animalId: string, status: "available" | "in_process" | "adopted" | "paused" | "removed") {
  return parse(await fetch(`${url}/rest/v1/animals?id=eq.${animalId}`, { method: "PATCH", headers: { ...headers(token), Prefer: "return=representation" }, body: JSON.stringify({ status, adopted_at: status === "adopted" ? new Date().toISOString() : null }) }));
}

export async function updateAdoptionInterestStatus(token: string, interestId: string, status: "reviewing" | "contacted" | "approved" | "declined" | "completed") {
  return parse(await fetch(`${url}/rest/v1/rpc/update_adoption_interest_status`, { method: "POST", headers: headers(token), body: JSON.stringify({ p_interest_id: interestId, p_status: status }) }));
}

export async function getPublicAnimals(): Promise<PublicAnimal[]> {
  const query = "select=id,name,species,breed,approximate_age,sex,size,municipality,description,temperament,compatibility_children,compatibility_dogs,compatibility_cats,special_needs,status,adoption_fee,adoption_fee_explanation,animal_images(storage_path,position,is_primary),animal_health(vaccinated,sterilized,dewormed,microchipped,veterinarian_evaluated,medications,medical_conditions,pending_care),rescue_profiles(id,public_name,profile_type,verification_status,institutional_fee_allowed)&status=eq.available&order=published_at.desc&limit=100";
  const rows = await parse(await fetch(`${url}/rest/v1/animals?${query}`, { headers: headers(), cache: "no-store" }));
  return Promise.all((rows as Array<Record<string, unknown> & { animal_images?: { storage_path: string; position: number; is_primary: boolean }[]; animal_health?: PublicAnimal["health"] | PublicAnimal["health"][]; rescue_profiles?: PublicAnimal["rescue"] | PublicAnimal["rescue"][] }>).map(async (row) => {
    const images = [...(row.animal_images || [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.position - b.position);
    const image_urls = (await Promise.all(images.map((image) => downloadAnimalImage(image.storage_path)))).filter((value): value is string => Boolean(value));
    const health = Array.isArray(row.animal_health) ? row.animal_health[0] || null : row.animal_health || null;
    const rescue = Array.isArray(row.rescue_profiles) ? row.rescue_profiles[0] || null : row.rescue_profiles || null;
    const { animal_images: _images, animal_health: _health, rescue_profiles: _rescue, ...animal } = row;
    void _images; void _health; void _rescue;
    return { ...animal, adoption_fee: Number(animal.adoption_fee || 0), image_urls, health, rescue } as PublicAnimal;
  }));
}

export async function getCategories(): Promise<Category[]> {
  return parse(await fetch(`${url}/rest/v1/categories?select=id,name,slug&is_active=eq.true&order=sort_order.asc`, { headers: headers(), cache: "no-store" }));
}

export async function getPublicJobs(): Promise<PublicJob[]> {
  const query = "select=id,title,description,municipality,employment_type,remote_allowed,experience_required,requirements,benefits,published_at,employers(public_name),job_compensation(compensation_type,minimum_amount,maximum_amount,currency,has_commission,commission_details,has_tips,tips_details,compensation_notes)&status=eq.published&order=published_at.desc&limit=100";
  const rows = await parse(await fetch(`${url}/rest/v1/jobs?${query}`, { headers: headers(), cache: "no-store" })) as Array<Record<string, unknown>>;
  const typeLabel: Record<string, string> = { full_time:"Tiempo completo", part_time:"Tiempo parcial", contract:"Contrato", temporary:"Temporero", internship:"Internado", per_diem:"Por día" };
  const payLabel: Record<string, string> = { hourly:"por hora", weekly:"por semana", biweekly:"quincenal", monthly:"por mes", annual:"al año", commission_only:"solo comisión", tips_only:"solo propinas", mixed:"compensación mixta" };
  return rows.map((row) => {
    const employer = (Array.isArray(row.employers) ? row.employers[0] : row.employers) as { public_name?: string } | null;
    const compensation = (Array.isArray(row.job_compensation) ? row.job_compensation[0] : row.job_compensation) as { compensation_type?: string; minimum_amount?: number | string | null; maximum_amount?: number | string | null; currency?: string; has_commission?: boolean; commission_details?: string | null; has_tips?: boolean; tips_details?: string | null; compensation_notes?: string | null } | null;
    const minimum = compensation?.minimum_amount == null ? null : Number(compensation.minimum_amount);
    const maximum = compensation?.maximum_amount == null ? null : Number(compensation.maximum_amount);
    const money = (amount: number) => new Intl.NumberFormat("en-US", { style:"currency", currency:compensation?.currency || "USD", maximumFractionDigits: amount % 1 ? 2 : 0 }).format(amount);
    const baseSalary = minimum != null && maximum != null ? `${money(minimum)}–${money(maximum)}` : minimum != null ? `${money(minimum)} o más` : maximum != null ? `Hasta ${money(maximum)}` : "Compensación detallada";
    const additions = [compensation?.has_commission ? compensation.commission_details || "comisión" : "", compensation?.has_tips ? compensation.tips_details || "propinas" : ""].filter(Boolean);
    const requirementText = String(row.requirements || row.experience_required || "Requisitos disponibles en la descripción");
    const requirements = requirementText.split(/\n|;|\u2022/).map((item) => item.trim()).filter(Boolean);
    const skills = [...new Set([String(row.title || ""), ...requirements].filter(Boolean))];
    const publishedAt = row.published_at ? new Date(String(row.published_at)) : null;
    const ageDays = publishedAt ? Math.max(0, Math.floor((Date.now() - publishedAt.getTime()) / 86400000)) : 0;
    return {
      id:String(row.id), title:String(row.title), company:employer?.public_name || "Patrono verificado",
      municipality:String(row.municipality), arrangement:row.remote_allowed ? "Remoto o híbrido" : "Presencial",
      employmentType:typeLabel[String(row.employment_type)] || String(row.employment_type),
      salary:`${baseSalary} ${payLabel[compensation?.compensation_type || ""] || ""}${additions.length ? ` + ${additions.join(" + ")}` : ""}`.trim(),
      summary:String(row.description), requirements, skills,
      posted:ageDays === 0 ? "Hoy" : ageDays === 1 ? "Hace 1 día" : `Hace ${ageDays} días`, source:"supabase" as const,
    };
  });
}

export async function getMyJobSeekerProfile(token: string, userId: string): Promise<JobSeekerProfile | null> {
  const rows = await parse(await fetch(`${url}/rest/v1/job_seeker_profiles?select=user_id,headline,professional_summary,municipality,desired_job_titles,skills,years_experience,visible_to_employers&user_id=eq.${userId}&limit=1`, { headers: headers(token), cache: "no-store" }));
  return rows[0] || null;
}

export async function saveJobSeekerProfile(token: string, userId: string, profile: { headline: string; professional_summary: string; municipality: string; skills: string[] }) {
  return parse(await fetch(`${url}/rest/v1/job_seeker_profiles?on_conflict=user_id`, {
    method: "POST", headers: { ...headers(token), Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ user_id:userId, headline:profile.headline, professional_summary:profile.professional_summary, municipality:profile.municipality, desired_job_titles:[profile.headline], skills:profile.skills, availability:"available_now", desired_employment_types:["full_time"], willing_to_relocate:false, remote_interest:true, visible_to_employers:true }),
  }));
}

export async function applyToJob(token: string, jobId: string) {
  return parse(await fetch(`${url}/rest/v1/rpc/apply_to_job`, { method:"POST", headers:headers(token), body:JSON.stringify({ p_job_id:jobId }) }));
}

export async function getMyJobApplications(token: string, userId: string, employer = false): Promise<JobApplicationSummary[]> {
  if (employer) {
    type EmployerApplicationRow = {
      id: string; job_id: string; applicant_id: string; status: string; submitted_at: string;
      job_title: string; company: string; display_name: string | null; headline: string | null;
      professional_summary: string | null; municipality: string | null; skills: string[] | null;
      years_experience: number | null; visible_to_employers: boolean;
    };
    const rows = await parse(await fetch(`${url}/rest/v1/rpc/get_employer_job_applications`, {
      method:"POST", headers:headers(token), body:"{}", cache:"no-store",
    })) as EmployerApplicationRow[];
    return rows.map((row) => ({
      id:row.id, job_id:row.job_id, applicant_id:row.applicant_id, status:row.status, submitted_at:row.submitted_at,
      jobs:{ title:row.job_title, employers:{ public_name:row.company } },
      profiles:{
        display_name:row.display_name || undefined,
        job_seeker_profiles:{
          user_id:row.applicant_id, headline:row.headline, professional_summary:row.professional_summary,
          municipality:row.municipality, desired_job_titles:row.headline ? [row.headline] : [],
          skills:row.skills || [], years_experience:row.years_experience,
          visible_to_employers:row.visible_to_employers,
        },
      },
    }));
  }

  const applications = await parse(await fetch(
    `${url}/rest/v1/job_applications?select=id,job_id,applicant_id,status,submitted_at,jobs(title,employers(public_name))&applicant_id=eq.${userId}&order=submitted_at.desc`,
    { headers:headers(token), cache:"no-store" },
  )) as JobApplicationSummary[];
  if (!applications.length) return [];

  const applicantIds = [...new Set(applications.map((item) => item.applicant_id))];
  const profiles = await parse(await fetch(
    `${url}/rest/v1/profiles?select=id,display_name,job_seeker_profiles(user_id,headline,professional_summary,municipality,desired_job_titles,skills,years_experience,visible_to_employers)&id=in.(${applicantIds.join(",")})`,
    { headers:headers(token), cache:"no-store" },
  )) as Array<{ id: string; display_name?: string; job_seeker_profiles?: JobSeekerProfile | JobSeekerProfile[] | null }>;
  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  return applications.map((application) => ({
    ...application,
    profiles: profilesById.get(application.applicant_id) || null,
  }));
}

export async function getMyJobProfileViewCount(token: string, userId: string): Promise<number> {
  const response = await fetch(`${url}/rest/v1/job_profile_views?select=id&candidate_id=eq.${userId}`, { headers:{...headers(token),Prefer:"count=exact"}, cache:"no-store" });
  if (!response.ok) await parse(response);
  return Number(response.headers.get("content-range")?.split("/")[1] || 0);
}

export async function recordJobProfileView(token: string, applicationId: string) {
  return parse(await fetch(`${url}/rest/v1/rpc/record_job_profile_view`, { method:"POST", headers:headers(token), body:JSON.stringify({ p_application_id:applicationId }) }));
}

export async function getSellerProfile(token: string, sellerId: string): Promise<UserProfile | null> {
  const rows = await parse(await fetch(`${url}/rest/v1/profiles?select=id,display_name,avatar_url,municipality,bio,account_status,phone_verified,identity_verified,created_at&id=eq.${sellerId}&account_status=eq.active&limit=1`, { headers: headers(token), cache: "no-store" }));
  return rows[0] || null;
}

export async function createOffer(token: string, payload: { listing_id: string; amount: number }) {
  return parse(await fetch(`${url}/rest/v1/rpc/create_offer`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ p_listing_id: payload.listing_id, p_amount: payload.amount }),
  }));
}

export async function getMyOffers(token: string, userId: string): Promise<OfferSummary[]> {
  const query = `select=id,listing_id,buyer_id,seller_id,offered_by,offered_by_user_id,parent_offer_id,amount,status,created_at,listings(title)&or=(buyer_id.eq.${userId},seller_id.eq.${userId})&order=created_at.desc&limit=100`;
  return parse(await fetch(`${url}/rest/v1/offers?${query}`, { headers: headers(token), cache: "no-store" }));
}

export async function createCounterOffer(token: string, offerId: string, amount: number) {
  const result = await parse(await fetch(`${url}/rest/v1/rpc/counter_offer`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ p_offer_id: offerId, p_amount: amount }),
  }));
  return result as OfferSummary;
}

export async function updateOfferStatus(token: string, offerId: string, status: "accepted" | "rejected" | "withdrawn") {
  const endpoint = status === "withdrawn" ? "withdraw_offer" : "respond_to_offer";
  const payload = status === "withdrawn" ? { p_offer_id: offerId } : { p_offer_id: offerId, p_status: status };
  const result = await parse(await fetch(`${url}/rest/v1/rpc/${endpoint}`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(payload),
  }));
  return result as OfferSummary;
}

export async function getMySaleActivity(token: string, userId: string) {
  const participant = `or=(buyer_id.eq.${userId},seller_id.eq.${userId})`;
  const [confirmations, transactions, reviews] = await Promise.all([
    parse(await fetch(`${url}/rest/v1/sale_confirmations?select=id,listing_id,seller_id,buyer_id,accepted_offer_id,agreed_price,status,submitted_at,buyer_confirmed_at,expires_at,listings(title)&${participant}&order=submitted_at.desc`, { headers: headers(token), cache: "no-store" })),
    parse(await fetch(`${url}/rest/v1/transactions?select=id,listing_id,seller_id,buyer_id,accepted_offer_id,agreed_price,status,completed_at,listings(title)&${participant}&order=completed_at.desc`, { headers: headers(token), cache: "no-store" })),
    parse(await fetch(`${url}/rest/v1/reviews?select=id,transaction_id,reviewer_id,reviewed_user_id,rating,comment,revealed_at,created_at&reviewer_id=eq.${userId}&order=created_at.desc`, { headers: headers(token), cache: "no-store" })),
  ]);
  return { confirmations: confirmations as SaleConfirmationSummary[], transactions: transactions as TransactionSummary[], reviews: reviews as ReviewSummary[] };
}

async function saleRpc(token: string, name: string, body: Record<string, unknown>) {
  return parse(await fetch(`${url}/rest/v1/rpc/${name}`, { method: "POST", headers: headers(token), body: JSON.stringify(body) }));
}

export function submitSaleConfirmation(token: string, payload: { listingId: string; buyerId: string; agreedPrice: number; offerId: string | null }) {
  return saleRpc(token, "submit_sale_confirmation", { p_listing_id: payload.listingId, p_buyer_id: payload.buyerId, p_agreed_price: payload.agreedPrice, p_offer_id: payload.offerId });
}
export function confirmPurchase(token: string, confirmationId: string) { return saleRpc(token, "confirm_purchase", { p_confirmation_id: confirmationId }); }
export function rejectSaleConfirmation(token: string, confirmationId: string) { return saleRpc(token, "reject_sale_confirmation", { p_confirmation_id: confirmationId }); }
export function cancelSaleConfirmation(token: string, confirmationId: string) { return saleRpc(token, "cancel_sale_confirmation", { p_confirmation_id: confirmationId }); }
export function markListingSoldNonverified(token: string, listingId: string, saleChannel: "external" | "undisclosed") { return saleRpc(token, "mark_listing_sold_nonverified", { p_listing_id: listingId, p_sale_channel: saleChannel }); }

export async function submitReview(token: string, payload: { transactionId: string; reviewerId: string; reviewedUserId: string; rating: number; comment: string }) {
  const rows = await parse(await fetch(`${url}/rest/v1/reviews`, { method: "POST", headers: { ...headers(token), Prefer: "return=representation" }, body: JSON.stringify({ transaction_id: payload.transactionId, reviewer_id: payload.reviewerId, reviewed_user_id: payload.reviewedUserId, rating: payload.rating, comment: payload.comment || null }) }));
  return rows[0] as ReviewSummary;
}

export async function getMySafetyActivity(token: string, userId: string) {
  const [reports, disputes, actions, appeals] = await Promise.all([
    parse(await fetch(`${url}/rest/v1/reports?select=id,reported_user_id,listing_id,conversation_id,reason_code,description,status,created_at&reporter_id=eq.${userId}&order=created_at.desc`, { headers: headers(token), cache: "no-store" })),
    parse(await fetch(`${url}/rest/v1/disputes?select=id,transaction_id,opened_by,reason_code,description,status,outcome,resolution_notes,opened_at,transactions(listing_id,agreed_price,listings(title)),dispute_evidence(id,submitted_by,evidence_type,description,created_at)&order=opened_at.desc`, { headers: headers(token), cache: "no-store" })),
    parse(await fetch(`${url}/rest/v1/moderation_actions?select=id,incident_id,action_type,reason,starts_at,ends_at&user_id=eq.${userId}&order=starts_at.desc`, { headers: headers(token), cache: "no-store" })),
    parse(await fetch(`${url}/rest/v1/appeals?select=id,incident_id,moderation_action_id,reason,status,admin_response,created_at&submitted_by=eq.${userId}&order=created_at.desc`, { headers: headers(token), cache: "no-store" })),
  ]);
  return { reports: reports as ReportSummary[], disputes: disputes as DisputeSummary[], actions: actions as ModerationActionSummary[], appeals: appeals as AppealSummary[] };
}

export async function getMyNotifications(token: string): Promise<NotificationSummary[]> {
  const query = "select=id,module,channel,title,body,related_content_type,related_content_id,metadata,status,created_at,read_at&channel=eq.in_app&order=created_at.desc&limit=100";
  return parse(await fetch(`${url}/rest/v1/notifications?${query}`, { headers: headers(token), cache: "no-store" }));
}

export async function markNotificationRead(token: string, notificationId: string) {
  return parse(await fetch(`${url}/rest/v1/rpc/mark_notification_read`, { method: "POST", headers: headers(token), body: JSON.stringify({ p_notification_id: notificationId }) }));
}

export async function respondListingFollowup(token: string, notificationId: string, response: "available" | "pending") {
  return parse(await fetch(`${url}/rest/v1/rpc/respond_listing_followup`, { method: "POST", headers: headers(token), body: JSON.stringify({ p_notification_id: notificationId, p_response: response }) }));
}

export async function respondBuyerPurchaseFollowup(token: string, notificationId: string, purchased: boolean) {
  return parse(await fetch(`${url}/rest/v1/rpc/respond_buyer_purchase_followup`, { method: "POST", headers: headers(token), body: JSON.stringify({ p_notification_id: notificationId, p_purchased: purchased }) }));
}

export async function getNotificationPreferences(token: string, userId: string): Promise<NotificationPreferences | null> {
  const rows = await parse(await fetch(`${url}/rest/v1/notification_preferences?select=user_id,marketplace_enabled,messages_enabled,offers_enabled,disputes_enabled,system_enabled,promotions_enabled,push_enabled,email_enabled,marketing_enabled&user_id=eq.${userId}&limit=1`, { headers: headers(token), cache: "no-store" }));
  return rows[0] || null;
}

export async function saveNotificationPreferences(token: string, preferences: NotificationPreferences) {
  const rows = await parse(await fetch(`${url}/rest/v1/notification_preferences`, { method: "POST", headers: { ...headers(token), Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify(preferences) }));
  return rows[0] as NotificationPreferences;
}

export async function submitReport(token: string, payload: { reporterId: string; reportedUserId?: string | null; listingId?: string | null; conversationId?: string | null; reasonCode: string; description: string }) {
  const rows = await parse(await fetch(`${url}/rest/v1/reports`, {
    method: "POST", headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify({ reporter_id: payload.reporterId, reported_user_id: payload.reportedUserId || null, listing_id: payload.listingId || null, conversation_id: payload.conversationId || null, reason_code: payload.reasonCode, description: payload.description.trim() || null }),
  }));
  return rows[0] as ReportSummary;
}

export async function openTransactionDispute(token: string, payload: { transactionId: string; openedBy: string; reasonCode: string; description: string }) {
  const rows = await parse(await fetch(`${url}/rest/v1/disputes`, {
    method: "POST", headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify({ transaction_id: payload.transactionId, opened_by: payload.openedBy, reason_code: payload.reasonCode, description: payload.description.trim() }),
  }));
  return rows[0] as DisputeSummary;
}

export async function addDisputeStatement(token: string, payload: { disputeId: string; submittedBy: string; description: string }) {
  return parse(await fetch(`${url}/rest/v1/dispute_evidence`, {
    method: "POST", headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify({ dispute_id: payload.disputeId, submitted_by: payload.submittedBy, evidence_type: "statement", description: payload.description.trim() }),
  }));
}

export async function submitAppeal(token: string, payload: { submittedBy: string; actionId: string; reason: string }) {
  const rows = await parse(await fetch(`${url}/rest/v1/appeals`, {
    method: "POST", headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify({ submitted_by: payload.submittedBy, moderation_action_id: payload.actionId, reason: payload.reason.trim() }),
  }));
  return rows[0] as AppealSummary;
}

export async function createListingDraft(token: string, userId: string, draft: ListingDraft) {
  return parse(await fetch(`${url}/rest/v1/listings`, {
    method: "POST", headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify({
      ...draft,
      category_id: draft.is_free ? FREE_CATEGORY_ID : draft.category_id,
      price: draft.is_free ? null : draft.price,
      seller_id: userId,
      status: "draft",
    }),
  }));
}

export async function uploadListingImage(token: string, listingId: string, file: File, position: number) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${listingId}/${crypto.randomUUID()}.${extension}`;
  await parse(await fetch(`${url}/storage/v1/object/listing-images/${path}`, {
    method: "POST", headers: { apikey: apiKey, Authorization: `Bearer ${token}`, "Content-Type": file.type, "x-upsert": "false" }, body: file,
  }));
  await parse(await fetch(`${url}/rest/v1/listing_images`, {
    method: "POST", headers: { ...headers(token), Prefer: "return=minimal" },
    body: JSON.stringify({ listing_id: listingId, storage_path: path, position, is_primary: position === 0 }),
  }));
  return path;
}

export async function publishListing(token: string, userId: string, listingId: string) {
  return parse(await fetch(`${url}/rest/v1/listings?id=eq.${listingId}&seller_id=eq.${userId}`, {
    method: "PATCH", headers: { ...headers(token), Prefer: "return=representation" }, body: JSON.stringify({ status: "available" }),
  }));
}

export async function startListingConversation(token: string, listingId: string) {
  return parse(await fetch(`${url}/rest/v1/rpc/start_listing_conversation`, {
    method: "POST", headers: headers(token), body: JSON.stringify({ p_listing_id: listingId })
  }));
}

export async function sendMessage(token: string, conversationId: string, body: string) {
  return parse(await fetch(`${url}/rest/v1/rpc/send_message`, {
    method: "POST", headers: headers(token),
    body: JSON.stringify({ p_conversation_id: conversationId, p_body: body }),
  }));
}

export async function getFavoriteListingIds(token: string, userId: string): Promise<string[]> {
  const rows = await parse(await fetch(
    `${url}/rest/v1/favorites?select=listing_id&user_id=eq.${userId}&order=created_at.desc`,
    { headers: headers(token), cache: "no-store" },
  ));
  return rows.map((row: { listing_id: string }) => row.listing_id);
}

export async function addFavorite(token: string, userId: string, listingId: string) {
  return parse(await fetch(`${url}/rest/v1/favorites`, {
    method: "POST",
    headers: { ...headers(token), Prefer: "return=minimal" },
    body: JSON.stringify({ user_id: userId, listing_id: listingId }),
  }));
}

export async function removeFavorite(token: string, userId: string, listingId: string) {
  const response = await fetch(
    `${url}/rest/v1/favorites?user_id=eq.${userId}&listing_id=eq.${listingId}`,
    { method: "DELETE", headers: { ...headers(token), Prefer: "return=minimal" } },
  );
  if (!response.ok) await parse(response);
}

export async function getMyProfile(token: string, userId: string): Promise<UserProfile | null> {
  const rows = await parse(await fetch(
    `${url}/rest/v1/profiles?select=id,display_name,avatar_url,municipality,bio,account_status,phone_verified,identity_verified,created_at&id=eq.${userId}&limit=1`,
    { headers: headers(token), cache: "no-store" },
  ));
  return rows[0] || null;
}

export type CoquiAdminDashboard = {
  reports_open: number;
  disputes_open: number;
  appeals_open: number;
  rescue_verifications_pending: number;
  accounts_restricted: number;
  notifications_pending: number;
  generated_at: string;
};

export async function getCoquiAdminDashboard(token: string): Promise<CoquiAdminDashboard | null> {
  const response = await fetch(`${url}/rest/v1/rpc/get_coqui_admin_dashboard`, {
    method: "POST", headers: headers(token), body: "{}", cache: "no-store",
  });
  if (response.status === 400 || response.status === 401 || response.status === 403) return null;
  return parse(response);
}

export async function requestAccountDeletion(token: string): Promise<{ deleted: boolean }> {
  return parse(await fetch(`${url}/rest/v1/rpc/request_account_deletion`, {
    method: "POST", headers: headers(token), body: "{}",
  }));
}

export async function saveMyProfile(
  token: string,
  profile: Pick<UserProfile, "id" | "display_name" | "municipality" | "bio">,
) {
  const rows = await parse(await fetch(`${url}/rest/v1/profiles`, {
    method: "POST",
    headers: { ...headers(token), Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify(profile),
  }));
  return rows[0] as UserProfile;
}

export async function uploadProfileAvatar(token: string, userId: string, file: File) {
  const path = `${userId}/avatar-${Date.now()}.jpg`;
  const upload = await fetch(`${url}/storage/v1/object/public-media/${path}`, {
    method: "POST",
    headers: {
      apikey: apiKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!upload.ok) await parse(upload);
  const avatarUrl = `${url}/storage/v1/object/public/public-media/${path}?v=${Date.now()}`;
  const rows = await parse(await fetch(`${url}/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify({ avatar_url: avatarUrl }),
  }));
  return { avatarUrl, profile: rows[0] as UserProfile | undefined };
}

export async function removeProfileAvatar(token: string, userId: string) {
  const rows = await parse(await fetch(`${url}/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers: { ...headers(token), Prefer: "return=representation" },
    body: JSON.stringify({ avatar_url: null }),
  }));
  return rows[0] as UserProfile | undefined;
}

export async function getMyListings(token: string, userId: string): Promise<PublicListing[]> {
  const query = `select=id,category_id,title,description,price,is_free,is_negotiable,municipality,condition,status,listing_images(storage_path,position,is_primary)&seller_id=eq.${userId}&order=created_at.desc&limit=100`;
  const rows = await parse(await fetch(`${url}/rest/v1/listings?${query}`, {
    headers: headers(token), cache: "no-store",
  }));
  return Promise.all(rows.map(async (row: PublicListing & { listing_images?: { storage_path: string; position: number; is_primary: boolean }[] }) => {
    const images = [...(row.listing_images || [])].sort((a, b) => Number(b.is_primary) - Number(a.is_primary) || a.position - b.position);
    const image_urls = (await Promise.all(images.map(image => downloadListingImage(image.storage_path)))).filter((value): value is string => Boolean(value));
    const { listing_images: _images, ...listing } = row;
    void _images;
    return { ...listing, image_urls };
  }));
}

export async function updateListingStatus(
  token: string,
  userId: string,
  listingId: string,
  status: "available" | "pending" | "sold" | "paused",
) {
  const timestamps = status === "pending"
    ? { pending_at: new Date().toISOString(), sold_at: null }
    : status === "sold"
      ? { sold_at: new Date().toISOString() }
      : { pending_at: null, sold_at: null };
  return parse(await fetch(
    `${url}/rest/v1/listings?id=eq.${listingId}&seller_id=eq.${userId}`,
    {
      method: "PATCH",
      headers: { ...headers(token), Prefer: "return=representation" },
      body: JSON.stringify({ status, ...timestamps }),
    },
  ));
}

export async function updateListingDetails(
  token: string,
  userId: string,
  listingId: string,
  details: ListingDraft,
) {
  const rows = await parse(await fetch(
    `${url}/rest/v1/listings?id=eq.${listingId}&seller_id=eq.${userId}`,
    {
      method: "PATCH",
      headers: { ...headers(token), Prefer: "return=representation" },
      body: JSON.stringify({
        ...details,
        category_id: details.is_free ? FREE_CATEGORY_ID : details.category_id,
        price: details.is_free ? null : details.price,
        is_negotiable: details.is_free ? false : details.is_negotiable,
      }),
    },
  ));
  return rows[0] as PublicListing;
}

export async function getMyConversations(token: string, userId: string): Promise<ConversationSummary[]> {
  const query = "select=id,listing_id,created_at,listings(title),conversation_members(user_id,profiles(display_name)),messages(id,body,sender_id,created_at,deleted_at)&order=created_at.desc&limit=100";
  const rows = await parse(await fetch(`${url}/rest/v1/conversations?${query}`, {
    headers: headers(token), cache: "no-store",
  }));
  return rows.map((row: {
    id: string; listing_id: string; created_at: string;
    listings?: { title?: string } | { title?: string }[];
    conversation_members?: { user_id: string; profiles?: { display_name?: string } | { display_name?: string }[] }[];
    messages?: { id: string; body: string; sender_id: string; created_at: string; deleted_at?: string | null }[];
  }) => {
    const listing = Array.isArray(row.listings) ? row.listings[0] : row.listings;
    const other = row.conversation_members?.find(member => member.user_id !== userId);
    const otherProfile = Array.isArray(other?.profiles) ? other?.profiles[0] : other?.profiles;
    return {
      id: row.id,
      listing_id: row.listing_id,
      created_at: row.created_at,
      listing_title: listing?.title || "Publicación",
      other_person: otherProfile?.display_name || "Usuario de Coqui Ventas",
      other_user_id: other?.user_id || "",
      messages: (row.messages || [])
        .filter(message => !message.deleted_at)
        .sort((a, b) => a.created_at.localeCompare(b.created_at)),
    };
  });
}

export async function signIn(email: string, password: string): Promise<Session> {
  return parse(await fetch(`${url}/auth/v1/token?grant_type=password`, { method: "POST", headers: headers(), body: JSON.stringify({ email, password }) }));
}

export async function refreshSession(refreshToken: string): Promise<Session> {
  return parse(await fetch(`${url}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  }));
}

export async function signUp(email: string, password: string, displayName: string) {
  return parse(await fetch(`${url}/auth/v1/signup`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, password, data: { display_name: displayName.trim() } }),
  }));
}

export async function requestPasswordReset(email: string, redirectTo: string) {
  return parse(await fetch(`${url}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email }),
  }));
}

export async function updatePassword(token: string, password: string) {
  return parse(await fetch(`${url}/auth/v1/user`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({ password }),
  }));
}

export async function getAuthUser(token: string): Promise<AuthUser> {
  return parse(await fetch(`${url}/auth/v1/user`, {
    headers: headers(token),
    cache: "no-store",
  }));
}

export async function signOut(token: string) {
  await fetch(`${url}/auth/v1/logout`, { method: "POST", headers: headers(token) });
}
