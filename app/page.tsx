"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useInterfaceLanguage } from "../lib/interface-i18n";
import {
  Category,
  addFavorite,
  addDisputeStatement,
  applyToJob,
  AppealSummary,
  createOffer,
  createCounterOffer,
  cancelSaleConfirmation,
  confirmPurchase,
  createListingDraft,
  createOrganizationAnimal,
  ConversationSummary,
  FREE_CATEGORY_ID,
  getAuthUser,
  getFavoriteListingIds,
  getCategories,
  getCoquiAdminDashboard,
  CoquiAdminDashboard,
  getMyConversations,
  getMyJobApplications,
  getMyJobProfileViewCount,
  getMyJobSeekerProfile,
  JobApplicationSummary,
  getMyOffers,
  getMySaleActivity,
  getMySafetyActivity,
  getMyNotifications,
  getNotificationPreferences,
  getMyListings,
  getMyProfile,
  getMyRescueWorkspace,
  getPublicListings,
  getPublicAnimals,
  getPublicJobs,
  getSellerProfile,
  optimizeListingImage,
  optimizeAvatarImage,
  PublicListing,
  PublicAnimal,
  ManagedAnimal,
  RescueOrganizationProfile,
  PublicJob,
  OfferSummary,
  openTransactionDispute,
  DisputeSummary,
  ModerationActionSummary,
  NotificationSummary,
  NotificationPreferences,
  ReportSummary,
  ReviewSummary,
  SaleConfirmationSummary,
  TransactionSummary,
  publishListing,
  refreshSession,
  requestPasswordReset,
  requestAccountDeletion,
  removeFavorite,
  removeProfileAvatar,
  recordJobProfileView,
  registerRescueOrganization,
  saveMyProfile,
  saveJobSeekerProfile,
  sendMessage,
  Session,
  signIn,
  signOut,
  signUp,
  startListingConversation,
  updateListingStatus,
  updateOrganizationAnimalStatus,
  updateAdoptionInterestStatus,
  updatePassword,
  uploadProfileAvatar,
  updateOfferStatus,
  rejectSaleConfirmation,
  submitReview,
  submitAppeal,
  submitReport,
  submitSaleConfirmation,
  markNotificationRead,
  markListingSoldNonverified,
  respondListingFollowup,
  respondBuyerPurchaseFollowup,
  saveNotificationPreferences,
  updateListingDetails,
  uploadListingImage,
  UserProfile,
} from "../lib/supabase-rest";

const categories = [
  {
    icon: "🛍️",
    name: "Marketplace",
    detail: "Compra y vende cerca de ti",
    tone: "teal",
  },
  {
    icon: "💼",
    name: "Empleos",
    detail: "Oportunidades con salario claro",
    tone: "blue",
  },
  {
    icon: "🐾",
    name: "Huellitas de Amor",
    detail: "Adopción responsable",
    tone: "rose",
  },
  {
    icon: "🇵🇷",
    name: "Hecho en Puerto Rico",
    detail: "Productos y cosechas locales",
    tone: "gold",
  },
  {
    icon: "🌴",
    name: "Turismo y experiencias",
    detail: "Descubre la isla",
    tone: "green",
  },
  {
    icon: "🎨",
    name: "Arte y cultura",
    detail: "Talleres y eventos",
    tone: "violet",
  },
];

const municipalities = [
  "Adjuntas",
  "Aguada",
  "Aguadilla",
  "Aguas Buenas",
  "Aibonito",
  "Añasco",
  "Arecibo",
  "Arroyo",
  "Barceloneta",
  "Barranquitas",
  "Bayamón",
  "Cabo Rojo",
  "Caguas",
  "Camuy",
  "Canóvanas",
  "Carolina",
  "Cataño",
  "Cayey",
  "Ceiba",
  "Ciales",
  "Cidra",
  "Coamo",
  "Comerío",
  "Corozal",
  "Culebra",
  "Dorado",
  "Fajardo",
  "Florida",
  "Guánica",
  "Guayama",
  "Guayanilla",
  "Guaynabo",
  "Gurabo",
  "Hatillo",
  "Hormigueros",
  "Humacao",
  "Isabela",
  "Jayuya",
  "Juana Díaz",
  "Juncos",
  "Lajas",
  "Lares",
  "Las Marías",
  "Las Piedras",
  "Loíza",
  "Luquillo",
  "Manatí",
  "Maricao",
  "Maunabo",
  "Mayagüez",
  "Moca",
  "Morovis",
  "Naguabo",
  "Naranjito",
  "Orocovis",
  "Patillas",
  "Peñuelas",
  "Ponce",
  "Quebradillas",
  "Rincón",
  "Río Grande",
  "Sabana Grande",
  "Salinas",
  "San Germán",
  "San Juan",
  "San Lorenzo",
  "San Sebastián",
  "Santa Isabel",
  "Toa Alta",
  "Toa Baja",
  "Trujillo Alto",
  "Utuado",
  "Vega Alta",
  "Vega Baja",
  "Vieques",
  "Villalba",
  "Yabucoa",
  "Yauco",
];

const normalizeTown = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ municipio| municipality/gi, "")
    .trim()
    .toLowerCase();
const normalizeSearch = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
const conditionLabels: Record<string, string> = {
  new: "Nuevo",
  like_new: "Como nuevo",
  good: "Bueno",
  fair: "Regular",
  for_parts: "Para piezas",
};
const listingStatusLabels: Record<string, string> = {
  available: "Disponible",
  pending: "Pendiente",
  sold: "Vendido",
  paused: "Pausado",
};
const listingSortLabels: Record<string, string> = {
  newest: "Más recientes",
  "rating-high": "Mejor reputación",
  "reviews-high": "Más reseñas",
  "price-low": "Precio: menor a mayor",
  "price-high": "Precio: mayor a menor",
  "free-first": "Gratis primero",
  "title-az": "Título: A–Z",
  "title-za": "Título: Z–A",
};

function listingAge(value?: string) {
  if (!value) return "Publicado recientemente";
  const hours = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 3600000));
  if (hours < 1) return "Publicado hace menos de 1 hora";
  if (hours < 24) return `Publicado hace ${hours} hora${hours === 1 ? "" : "s"}`;
  const days = Math.floor(hours / 24);
  return `Publicado hace ${days} día${days === 1 ? "" : "s"}`;
}

function statusExplanation(status?: string) {
  if (status === "pending") return "El vendedor está coordinando una posible venta, pero el anuncio sigue visible.";
  if (status === "sold") return "La venta fue marcada como completada. El anuncio permanecerá visible durante 24 horas.";
  if (status === "paused") return "El vendedor pausó temporalmente esta publicación.";
  return "El artículo está disponible; confirma los detalles directamente con el vendedor.";
}

const promotionalAds = [
  { business: "Mueblerías Barrios", eyebrow: "Especial para tu hogar", headline: "Renueva tu sala con estilo", offer: "Hasta 30% en muebles seleccionados", cta: "Ver especial", image: "/promotions/ad-mueblerias-barrios.webp", theme: "dark" },
  { business: "Café Borinquen", eyebrow: "Sabor de aquí", headline: "Tu mañana comienza en Puerto Rico", offer: "Café artesanal y repostería fresca", cta: "Conocer el menú", image: "/promotions/ad-cafe-borinquen.webp", theme: "coffee" },
  { business: "AutoCentro Isla", eyebrow: "Muévete con confianza", headline: "Tu próximo vehículo te espera", offer: "Alternativas familiares y financiamiento", cta: "Ver inventario", image: "/promotions/ad-autocentro-isla.webp", theme: "auto" },
  { business: "Isla Solar PR", eyebrow: "Energía para tu hogar", headline: "Prepárate para vivir con más respaldo", offer: "Evaluación solar inicial sin costo", cta: "Solicitar orientación", image: "/promotions/ad-isla-solar-pr.webp", theme: "solar" },
] as const;
type QuickClickProfile = { fullName: string; headline: string; municipality: string; experience: string; skills: string; resumeName: string };
type QuickClickApplication = { id: string; jobId: string; jobTitle: string; company: string; candidate: QuickClickProfile; appliedAt: string; status: "Recibida" | "En revisión" };

function realQuickClickApplication(row: JobApplicationSummary): QuickClickApplication {
  const job = row.jobs || {};
  const employer = Array.isArray(job.employers) ? job.employers[0] : job.employers;
  const person = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const seeker = Array.isArray(person?.job_seeker_profiles) ? person?.job_seeker_profiles[0] : person?.job_seeker_profiles;
  return {
    id:row.id, jobId:row.job_id, jobTitle:job.title || "Empleo", company:employer?.public_name || "Patrono verificado",
    appliedAt:row.submitted_at, status:row.status === "submitted" ? "Recibida" : "En revisión",
    candidate:{ fullName:person?.display_name || "Candidato", headline:seeker?.headline || "Perfil profesional", municipality:seeker?.municipality || "Puerto Rico", experience:seeker?.professional_summary || "Historial profesional disponible", skills:(seeker?.skills || []).join(", "), resumeName:"Perfil Quick Click" },
  };
}
const jobSkills = ["Albañilería","Bilingüe","Carpintería","Cocina","Construcción","CPR","Diagnóstico","Electricidad industrial","Enfermería","Entrada de datos","Frenos","Inventario","Lectura de planos","Mecánica automotriz","Microsoft Office","Plomería","Récord médico electrónico","Seguridad alimentaria","Seguridad OSHA","Servicio al cliente","Soldadura","Trabajo en equipo"];
const FILTER_REFERENCE_TIME = Date.now();

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePromotion, setActivePromotion] = useState(0);
  const [promotionPaused, setPromotionPaused] = useState(false);
  const [advertisingInfoOpen, setAdvertisingInfoOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);
  const [language, setLanguage] = useState<"es" | "en">("es");
  const [jobSearch, setJobSearch] = useState("");
  const [jobSkill, setJobSkill] = useState("");
  const [candidateSearch, setCandidateSearch] = useState("");
  const [candidateSkill, setCandidateSkill] = useState("");
  const [jobTown, setJobTown] = useState("");
  const [jobArrangement, setJobArrangement] = useState("");
  const [selectedJob, setSelectedJob] = useState<PublicJob | null>(null);
  const [liveJobs, setLiveJobs] = useState<PublicJob[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [quickClickMode, setQuickClickMode] = useState<"candidate" | "employer">("candidate");
  const [quickClickProfile, setQuickClickProfile] = useState<QuickClickProfile | null>(null);
  const [quickClickApplications, setQuickClickApplications] = useState<QuickClickApplication[]>([]);
  const [quickClickProfileViews, setQuickClickProfileViews] = useState(0);
  const [quickClickMessage, setQuickClickMessage] = useState("");
  const [huellitasOpen, setHuellitasOpen] = useState(false);
  const [huellitasLoading, setHuellitasLoading] = useState(false);
  const [huellitasAnimals, setHuellitasAnimals] = useState<PublicAnimal[]>([]);
  const [huellitasSpecies, setHuellitasSpecies] = useState("");
  const [huellitasTown, setHuellitasTown] = useState("");
  const [huellitasMessage, setHuellitasMessage] = useState("");
  const [huellitasPortalOpen, setHuellitasPortalOpen] = useState(false);
  const [rescueProfile, setRescueProfile] = useState<RescueOrganizationProfile | null>(null);
  const [managedAnimals, setManagedAnimals] = useState<ManagedAnimal[]>([]);
  const [rescueWorkspaceLoading, setRescueWorkspaceLoading] = useState(false);
  const [smallAdInfoOpen, setSmallAdInfoOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | "recovery" | "update-password">("login");
  const [authPassword, setAuthPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [dataExporting, setDataExporting] = useState(false);
  const [accountStatus, setAccountStatus] = useState<"active" | "restricted" | "suspended" | "deleted">("active");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [deviceDataCleared, setDeviceDataCleared] = useState(false);
  const [signupAvatarFile, setSignupAvatarFile] = useState<File | null>(null);
  const [signupAvatarPreview, setSignupAvatarPreview] = useState("");
  const [avatarPreparing, setAvatarPreparing] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [sessionRefreshing, setSessionRefreshing] = useState(false);
  const [sessionNotice, setSessionNotice] = useState("");
  const [profilePreviewOpen, setProfilePreviewOpen] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [liveListings, setLiveListings] = useState<
    Awaited<ReturnType<typeof getPublicListings>>
  >([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const categoryBeforeFree = useRef("");
  const [isFreeListing, setIsFreeListing] = useState(false);
  const [listingPrice, setListingPrice] = useState("");
  const [publishMessage, setPublishMessage] = useState("");
  const [publishMunicipality, setPublishMunicipality] = useState("");
  const [selectedPhotoCount, setSelectedPhotoCount] = useState(0);
  const [publishedListing, setPublishedListing] = useState<PublicListing | null>(null);
  const [editingListing, setEditingListing] = useState<PublicListing | null>(null);
  const [editingIsFree, setEditingIsFree] = useState(false);
  const [locating, setLocating] = useState(false);
  const [selectedListing, setSelectedListing] = useState<PublicListing | null>(
    null,
  );
  const [sellerProfile, setSellerProfile] = useState<UserProfile | null>(null);
  const [sellerProfileLoading, setSellerProfileLoading] = useState(false);
  const [publicSellerId, setPublicSellerId] = useState<string | null>(null);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactDraft, setContactDraft] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountLastUpdated, setAccountLastUpdated] = useState<Date | null>(null);
  const [accountSyncing, setAccountSyncing] = useState(false);
  const [accountAutoRefresh, setAccountAutoRefresh] = useState(true);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoRole, setDemoRole] = useState<"seller" | "buyer">("buyer");
  const [demoDraft, setDemoDraft] = useState("");
  const [demoOfferAmount, setDemoOfferAmount] = useState("75");
  const [demoCounterAmount, setDemoCounterAmount] = useState("85");
  const [demoOfferStatus, setDemoOfferStatus] = useState<"none" | "pending" | "countered" | "accepted" | "rejected">("none");
  const [demoMessages, setDemoMessages] = useState<Array<{ id: number; role: "seller" | "buyer"; body: string; activity?: boolean }>>([
    { id: 1, role: "buyer", body: "¡Hola! ¿Todavía está disponible?" },
    { id: 2, role: "seller", body: "Sí, todavía está disponible. Podemos coordinar por aquí." },
  ]);
  const [accountTab, setAccountTab] = useState<"profile" | "listings" | "offers" | "sales" | "messages" | "notifications" | "safety" | "admin">("profile");
  const [adminDashboard, setAdminDashboard] = useState<CoquiAdminDashboard | null>(null);
  const [accountDeletionOpen, setAccountDeletionOpen] = useState(false);
  const [accountDeletionConfirmation, setAccountDeletionConfirmation] = useState("");
  const [accountDeletionBusy, setAccountDeletionBusy] = useState(false);
  const [myProfile, setMyProfile] = useState({ display_name: "", avatar_url: "", municipality: "", bio: "" });
  const [profileAvatarBusy, setProfileAvatarBusy] = useState(false);
  const [profileAvatarMessage, setProfileAvatarMessage] = useState("");
  const [myListings, setMyListings] = useState<PublicListing[]>([]);
  const [myConversations, setMyConversations] = useState<Awaited<ReturnType<typeof getMyConversations>>>([]);
  const [myOffers, setMyOffers] = useState<OfferSummary[]>([]);
  const [offerSearch, setOfferSearch] = useState("");
  const [offerStatusFilter, setOfferStatusFilter] = useState<"all" | "pending" | "accepted" | "closed">("all");
  const [offerDirectionFilter, setOfferDirectionFilter] = useState<"all" | "received" | "sent">("all");
  const [saleConfirmations, setSaleConfirmations] = useState<SaleConfirmationSummary[]>([]);
  const [myTransactions, setMyTransactions] = useState<TransactionSummary[]>([]);
  const [saleSearch, setSaleSearch] = useState("");
  const [saleRoleFilter, setSaleRoleFilter] = useState<"all" | "buying" | "selling">("all");
  const [saleStageFilter, setSaleStageFilter] = useState<"all" | "action" | "completed" | "disputed">("all");
  const [myReviews, setMyReviews] = useState<ReviewSummary[]>([]);
  const [myReports, setMyReports] = useState<ReportSummary[]>([]);
  const [myDisputes, setMyDisputes] = useState<DisputeSummary[]>([]);
  const [myModerationActions, setMyModerationActions] = useState<ModerationActionSummary[]>([]);
  const [myAppeals, setMyAppeals] = useState<AppealSummary[]>([]);
  const [safetySearch, setSafetySearch] = useState("");
  const [safetyTypeFilter, setSafetyTypeFilter] = useState<"all" | "reports" | "disputes" | "actions" | "appeals">("all");
  const [safetyStatusFilter, setSafetyStatusFilter] = useState<"all" | "open" | "resolved" | "action">("all");
  const [myNotifications, setMyNotifications] = useState<NotificationSummary[]>([]);
  const [notificationFilter, setNotificationFilter] = useState<"all" | "unread" | "messages" | "offers" | "marketplace" | "disputes" | "system">("all");
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null);
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState<{ kind: "listing" | "conversation"; id: string; userId?: string; label: string } | null>(null);
  const [reportReason, setReportReason] = useState("possible_scam");
  const [reportDescription, setReportDescription] = useState("");
  const [disputeTransaction, setDisputeTransaction] = useState<TransactionSummary | null>(null);
  const [disputeReason, setDisputeReason] = useState("item_not_as_described");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [evidenceDispute, setEvidenceDispute] = useState<DisputeSummary | null>(null);
  const [evidenceDescription, setEvidenceDescription] = useState("");
  const [appealAction, setAppealAction] = useState<ModerationActionSummary | null>(null);
  const [appealReason, setAppealReason] = useState("");
  const [saleOffer, setSaleOffer] = useState<OfferSummary | null>(null);
  const [counteringOffer, setCounteringOffer] = useState<OfferSummary | null>(null);
  const [counterAmount, setCounterAmount] = useState("");
  const [reviewTransaction, setReviewTransaction] = useState<TransactionSummary | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const [chatView, setChatView] = useState<"all" | "messages" | "offers">("all");
  const [conversationSearch, setConversationSearch] = useState("");
  const [conversationFilter, setConversationFilter] = useState<"all" | "offers" | "pending" | "messages">("all");
  const [replyDraft, setReplyDraft] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [myListingSearch, setMyListingSearch] = useState("");
  const [myListingFilter, setMyListingFilter] = useState<"all" | "available" | "pending" | "paused" | "sold" | "draft">("all");
  const [myListingSort, setMyListingSort] = useState<"newest" | "title" | "price">("newest");
  const [pendingStatusChange, setPendingStatusChange] = useState<{ listingId: string; title: string; status: "available" | "pending" | "sold" | "paused" } | null>(null);
  const [soldMethod, setSoldMethod] = useState<"coqui" | "external" | "undisclosed">("coqui");
  const [soldBuyerId, setSoldBuyerId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchMunicipality, setSearchMunicipality] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [freeOnly, setFreeOnly] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);
  const [dateRange, setDateRange] = useState<"" | "day" | "week" | "month">("");
  const [minimumPrice, setMinimumPrice] = useState("");
  const [maximumPrice, setMaximumPrice] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "rating-high" | "reviews-high" | "price-low" | "price-high" | "free-first" | "title-az" | "title-za">("newest");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [publishTitle, setPublishTitle] = useState("");
  const [publishDescription, setPublishDescription] = useState("");
  const [publishCondition, setPublishCondition] = useState("good");
  const [publishNegotiable, setPublishNegotiable] = useState(false);
  const [selectedPhotoNames, setSelectedPhotoNames] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "compact">("grid");
  const [visibleCount, setVisibleCount] = useState(8);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [discoverTab, setDiscoverTab] = useState<"today" | "alerts" | "municipality" | "following" | "map">("today");
  const [discoverTown, setDiscoverTown] = useState(() => typeof window === "undefined" ? "" : window.localStorage.getItem("coqui-discover-town") || "");
  const [alertKeywords, setAlertKeywords] = useState<string[]>(() => { if (typeof window === "undefined") return []; try { return JSON.parse(window.localStorage.getItem("coqui-alert-keywords") || "[]"); } catch { return []; } });
  const [alertDraft, setAlertDraft] = useState("");
  const [followedSellerIds, setFollowedSellerIds] = useState<Set<string>>(() => { if (typeof window === "undefined") return new Set(); try { return new Set(JSON.parse(window.localStorage.getItem("coqui-following") || "[]")); } catch { return new Set(); } });
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem("coqui-recently-viewed") || "[]");
    } catch {
      return [];
    }
  });

  function sendDemoMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = demoDraft.trim();
    if (!body) return;
    setDemoMessages((messages) => [...messages, { id: Date.now(), role: demoRole, body }]);
    setDemoDraft("");
  }

  function recordDemoOfferActivity(role: "seller" | "buyer", body: string, nextStatus: typeof demoOfferStatus) {
    setDemoOfferStatus(nextStatus);
    setDemoMessages((messages) => [...messages, { id: Date.now(), role, body, activity: true }]);
  }

  function resetDemoConversation() {
    setDemoMessages([
      { id: 1, role: "buyer", body: "¡Hola! ¿Todavía está disponible?" },
      { id: 2, role: "seller", body: "Sí, todavía está disponible. Podemos coordinar por aquí." },
    ]);
    setDemoOfferAmount("75");
    setDemoCounterAmount("85");
    setDemoOfferStatus("none");
    setDemoRole("buyer");
    setDemoDraft("");
  }

  const filtersActive = Boolean(
    searchTerm ||
      searchMunicipality ||
      filterCategory ||
      filterCondition ||
      filterStatus ||
      freeOnly ||
      offersOnly ||
      dateRange ||
      favoritesOnly ||
      minimumPrice ||
      maximumPrice ||
      sortOrder !== "newest",
  );
  const activeFilterCount = [searchTerm, searchMunicipality, filterCategory, filterCondition, filterStatus, freeOnly, offersOnly, dateRange, minimumPrice, maximumPrice, favoritesOnly, sortOrder !== "newest"].filter(Boolean).length;
  const invalidPriceRange = minimumPrice !== "" && maximumPrice !== "" && Number(minimumPrice) > Number(maximumPrice);
  const publishStepsComplete = [selectedCategoryId, publishTitle.length >= 5, publishDescription.length >= 15, publishMunicipality, selectedPhotoCount > 0 && selectedPhotoCount <= 8].filter(Boolean).length;
  const filteredListings = useMemo(() => {
    const words = normalizeSearch(searchTerm)
      .split(/\s+/)
      .filter(Boolean);
    const minimum = minimumPrice === "" ? null : Number(minimumPrice);
    const maximum = maximumPrice === "" ? null : Number(maximumPrice);
    const dateLimit = dateRange === "day" ? 1 : dateRange === "week" ? 7 : dateRange === "month" ? 30 : null;
    const matches = liveListings.filter((listing) => {
      const searchable = normalizeSearch(
        `${listing.title} ${listing.description} ${listing.municipality}`,
      );
      const price = listing.is_free ? 0 : Number(listing.price || 0);
      return (
        words.every((word) => searchable.includes(word)) &&
        (!searchMunicipality || listing.municipality === searchMunicipality) &&
        (!filterCategory || listing.category_id === filterCategory) &&
        (!filterCondition || listing.condition === filterCondition) &&
        (!filterStatus || listing.status === filterStatus) &&
        (!freeOnly || listing.is_free) &&
        (!offersOnly || listing.is_negotiable) &&
        (dateLimit === null || !listing.created_at || FILTER_REFERENCE_TIME - new Date(listing.created_at).getTime() <= dateLimit * 86400000) &&
        (!favoritesOnly || favoriteIds.has(listing.id)) &&
        (minimum === null || price >= minimum) &&
        (maximum === null || price <= maximum)
      );
    });
    const featuredFirst = (a: PublicListing, b: PublicListing) => {
      if (Boolean(a.is_featured) !== Boolean(b.is_featured)) return Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured));
      if (a.is_featured && b.is_featured) return new Date(b.featured_at || 0).getTime() - new Date(a.featured_at || 0).getTime();
      return 0;
    };
    const orderWithFeaturedPositions = (compareRegular: (a: PublicListing, b: PublicListing) => number) => [...matches].sort((a, b) => featuredFirst(a, b) || compareRegular(a, b));
    if (sortOrder === "price-low") return orderWithFeaturedPositions((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (sortOrder === "price-high") return orderWithFeaturedPositions((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (sortOrder === "free-first") return orderWithFeaturedPositions((a, b) => Number(b.is_free) - Number(a.is_free));
    if (sortOrder === "rating-high") return orderWithFeaturedPositions((a, b) => Number(b.seller_rating || 0) - Number(a.seller_rating || 0) || Number(b.seller_review_count || 0) - Number(a.seller_review_count || 0) || new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    if (sortOrder === "reviews-high") return orderWithFeaturedPositions((a, b) => Number(b.seller_review_count || 0) - Number(a.seller_review_count || 0) || Number(b.seller_rating || 0) - Number(a.seller_rating || 0) || new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    if (sortOrder === "title-az") return orderWithFeaturedPositions((a, b) => a.title.localeCompare(b.title, "es"));
    if (sortOrder === "title-za") return orderWithFeaturedPositions((a, b) => b.title.localeCompare(a.title, "es"));
    return orderWithFeaturedPositions((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }, [
    filterCategory,
    filterCondition,
    filterStatus,
    freeOnly,
    offersOnly,
    dateRange,
    favoriteIds,
    favoritesOnly,
    liveListings,
    maximumPrice,
    minimumPrice,
    searchMunicipality,
    searchTerm,
    sortOrder,
  ]);
  const selectedConversation = myConversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );
  const soldListing = pendingStatusChange?.status === "sold" ? myListings.find((listing) => listing.id === pendingStatusChange.listingId) : null;
  const soldBuyerCandidates = pendingStatusChange?.status === "sold"
    ? [...new Map(myConversations.filter((conversation) => conversation.listing_id === pendingStatusChange.listingId && conversation.other_user_id).map((conversation) => [conversation.other_user_id, conversation])).values()]
    : [];
  const offersForConversation = (conversation: ConversationSummary) => myOffers.filter((offer) =>
    offer.listing_id === conversation.listing_id
    && (offer.buyer_id === conversation.other_user_id || offer.seller_id === conversation.other_user_id)
  );
  const selectedConversationOffers = selectedConversation ? offersForConversation(selectedConversation) : [];
  const conversationOfferCount = (conversation: ConversationSummary) => offersForConversation(conversation).length;
  const conversationPendingOfferCount = (conversation: ConversationSummary) => offersForConversation(conversation).filter((offer) => offer.status === "pending").length;
  const filteredConversations = [...myConversations].filter((conversation) => {
    const searchable = `${conversation.other_person} ${conversation.listing_title} ${conversation.messages.map((message) => message.body).join(" ")}`;
    const matchesSearch = normalizeSearch(searchable).includes(normalizeSearch(conversationSearch));
    const offers = conversationOfferCount(conversation);
    const pendingOffers = conversationPendingOfferCount(conversation);
    const matchesFilter = conversationFilter === "all" || (conversationFilter === "offers" ? offers > 0 : conversationFilter === "pending" ? pendingOffers > 0 : conversation.messages.length > 0);
    return matchesSearch && matchesFilter;
  }).sort((first, second) => {
    const firstDate = first.messages.at(-1)?.created_at || first.created_at;
    const secondDate = second.messages.at(-1)?.created_at || second.created_at;
    return new Date(secondDate).getTime() - new Date(firstDate).getTime();
  });
  const conversationCounts = {
    all: myConversations.length,
    offers: myConversations.filter((conversation) => conversationOfferCount(conversation) > 0).length,
    pending: myConversations.filter((conversation) => conversationPendingOfferCount(conversation) > 0).length,
    messages: myConversations.filter((conversation) => conversation.messages.length > 0).length,
  };
  const conversationFiltersActive = Boolean(conversationSearch || conversationFilter !== "all");

  function clearConversationFilters() {
    setConversationSearch("");
    setConversationFilter("all");
  }
  const safetyMatchesSearch = (value: string) => normalizeSearch(value).includes(normalizeSearch(safetySearch));
  const safetyStatusMatches = (status: string, needsAction = false) => safetyStatusFilter === "all" || (safetyStatusFilter === "open" ? !["resolved", "closed", "dismissed", "approved", "denied"].includes(status) : safetyStatusFilter === "resolved" ? ["resolved", "closed", "dismissed", "approved", "denied"].includes(status) : needsAction);
  const filteredReports = myReports.filter((report) => (safetyTypeFilter === "all" || safetyTypeFilter === "reports") && safetyMatchesSearch(`${report.reason_code} ${report.description || ""}`) && safetyStatusMatches(report.status));
  const filteredDisputes = myDisputes.filter((dispute) => (safetyTypeFilter === "all" || safetyTypeFilter === "disputes") && safetyMatchesSearch(`${dispute.transactions?.listings?.title || ""} ${dispute.description}`) && safetyStatusMatches(dispute.status, !["resolved", "closed"].includes(dispute.status)));
  const filteredModerationActions = myModerationActions.filter((action) => (safetyTypeFilter === "all" || safetyTypeFilter === "actions") && safetyMatchesSearch(`${action.action_type} ${action.reason}`) && safetyStatusMatches(action.ends_at ? "resolved" : "under_review", !myAppeals.some((appeal) => appeal.moderation_action_id === action.id)));
  const filteredAppeals = myAppeals.filter((appeal) => (safetyTypeFilter === "all" || safetyTypeFilter === "appeals") && safetyMatchesSearch(`${appeal.reason} ${appeal.admin_response || ""}`) && safetyStatusMatches(appeal.status, ["submitted", "under_review"].includes(appeal.status)));
  const safetyResultCount = filteredReports.length + filteredDisputes.length + filteredModerationActions.length + filteredAppeals.length;
  const safetyCounts = { all: myReports.length + myDisputes.length + myModerationActions.length + myAppeals.length, reports: myReports.length, disputes: myDisputes.length, actions: myModerationActions.length, appeals: myAppeals.length };
  const safetyFiltersActive = Boolean(safetySearch || safetyTypeFilter !== "all" || safetyStatusFilter !== "all");

  function clearSafetyFilters() {
    setSafetySearch("");
    setSafetyTypeFilter("all");
    setSafetyStatusFilter("all");
  }
  const publicProfileInitials = (myProfile.display_name || session?.user.email || "CV").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  const publicSellerListings = publicSellerId ? liveListings.filter((listing) => listing.seller_id === publicSellerId).sort((first, second) => new Date(second.created_at || 0).getTime() - new Date(first.created_at || 0).getTime()) : [];
  const publicSellerLead = publicSellerListings[0] || null;
  const publicSellerRating = publicSellerListings.length ? publicSellerListings.reduce((total, listing) => total + Number(listing.seller_rating || 0), 0) / publicSellerListings.length : 0;
  const publicSellerReviewCount = publicSellerListings.reduce((highest, listing) => Math.max(highest, Number(listing.seller_review_count || 0)), 0);
  const publicSellerAvailableCount = publicSellerListings.filter((listing) => (listing.status || "available") === "available").length;
  const publicSellerPendingCount = publicSellerListings.filter((listing) => listing.status === "pending").length;
  const publicSellerSoldCount = publicSellerListings.filter((listing) => listing.status === "sold").length;
  const publicSellerTowns = [...new Set(publicSellerListings.map((listing) => listing.municipality).filter(Boolean))];
  const passwordChecks = {
    length: authPassword.length >= 8,
    upper: /[A-Z]/.test(authPassword),
    lower: /[a-z]/.test(authPassword),
    number: /\d/.test(authPassword),
    symbol: /[^A-Za-z0-9]/.test(authPassword),
  };
  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;
  const newPasswordValid = newPassword.length >= 10 && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && /\d/.test(newPassword) && /[^A-Za-z0-9]/.test(newPassword);
  const accountCanWrite = accountStatus === "active";
  const accountStatusDetails = {
    active: { label: "Activa", detail: "Puedes comprar, publicar y comunicarte normalmente." },
    restricted: { label: "Restringida", detail: "Puedes consultar tu historial, pero las acciones nuevas están limitadas." },
    suspended: { label: "Suspendida", detail: "Tu historial se conserva, pero no puedes realizar acciones nuevas." },
    deleted: { label: "Cerrada", detail: "La cuenta está cerrada y su historial protegido se conserva según corresponda." },
  }[accountStatus];

  function guardAccountWrite(destination: "account" | "session" = "account") {
    if (accountCanWrite) return true;
    const message = `Tu cuenta está ${accountStatusDetails.label.toLowerCase()}. ${accountStatusDetails.detail}`;
    if (destination === "account") setAccountMessage(message);
    else setSessionNotice(message);
    return false;
  }

  function clearPrivateDeviceData() {
    window.localStorage.removeItem("coqui-recent-searches");
    window.localStorage.removeItem("coqui-recently-viewed");
    setRecentlyViewedIds([]);
    setCompareIds([]);
    setComparisonOpen(false);
    setSearchTerm("");
    setDeviceDataCleared(true);
    setSessionNotice("Borramos las búsquedas, vistas recientes y comparaciones guardadas en este dispositivo.");
  }

  function openDiscover(tab: typeof discoverTab = "today") {
    setDiscoverTab(tab);
    setDiscoverOpen(true);
    setMenuOpen(false);
  }

  function saveDiscoverTown(town: string) {
    setDiscoverTown(town);
    window.localStorage.setItem("coqui-discover-town", town);
  }

  function addCoquiAlert(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const keyword = alertDraft.trim();
    if (!keyword || alertKeywords.some((item) => normalizeSearch(item) === normalizeSearch(keyword))) return;
    const next = [keyword, ...alertKeywords].slice(0, 8);
    setAlertKeywords(next);
    setAlertDraft("");
    window.localStorage.setItem("coqui-alert-keywords", JSON.stringify(next));
  }

  function removeCoquiAlert(keyword: string) {
    const next = alertKeywords.filter((item) => item !== keyword);
    setAlertKeywords(next);
    window.localStorage.setItem("coqui-alert-keywords", JSON.stringify(next));
  }

  function toggleFollowSeller(sellerId: string) {
    if (!session) {
      setPublicSellerId(null);
      setAuthMode("login");
      setAuthOpen(true);
      setAuthMessage("Entra a tu cuenta para seguir perfiles y recibir sus novedades.");
      return;
    }
    const next = new Set(followedSellerIds);
    if (next.has(sellerId)) next.delete(sellerId); else next.add(sellerId);
    setFollowedSellerIds(next);
    window.localStorage.setItem("coqui-following", JSON.stringify([...next]));
  }

  function clearLocalSession(notice = "") {
    window.localStorage.removeItem("coqui-session");
    setSession(null);
    setFavoriteIds(new Set());
    setFavoritesOnly(false);
    setAccountOpen(false);
    setSessionNotice(notice);
  }

  async function renewCurrentSession() {
    if (!session?.refresh_token || sessionRefreshing) return;
    setSessionRefreshing(true);
    setSessionNotice("");
    try {
      const renewed = await refreshSession(session.refresh_token);
      setSession(renewed);
      window.localStorage.setItem("coqui-session", JSON.stringify(renewed));
      setSessionNotice("Sesión renovada correctamente.");
    } catch {
      clearLocalSession("Tu sesión venció. Inicia sesión nuevamente para continuar de forma segura.");
      setAuthOpen(true);
    } finally {
      setSessionRefreshing(false);
    }
  }
  const selectedChatTimeline = selectedConversation ? [
    ...selectedConversation.messages.map((message) => ({ kind: "message" as const, createdAt: message.created_at, message })),
    ...selectedConversationOffers.map((offer) => ({ kind: "offer" as const, createdAt: offer.created_at, offer })),
  ].sort((first, second) => new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()) : [];
  const visibleListings = filteredListings.slice(0, visibleCount);
  const comparisonListings = liveListings.filter((listing) => compareIds.includes(listing.id));
  const activeDiscoverTown = discoverTown || myProfile.municipality || searchMunicipality || "San Juan";
  const municipalityListings = liveListings.filter((listing) => listing.municipality === activeDiscoverTown && listing.status !== "sold").slice(0, 4);
  const municipalityJobs = liveJobs.filter((job) => job.municipality === activeDiscoverTown || job.municipality === "Todo Puerto Rico").slice(0, 3);
  const followingListings = liveListings.filter((listing) => listing.seller_id && followedSellerIds.has(listing.seller_id) && listing.status !== "sold");
  const mapTowns = [...new Set([...liveListings.map((listing) => listing.municipality), ...liveJobs.map((job) => job.municipality)].filter((town) => town && town !== "Todo Puerto Rico"))].sort((a, b) => a.localeCompare(b, "es"));
  const personalizedSuggestions = [...liveListings].filter((listing) => listing.status !== "sold").sort((a, b) => Number(Boolean(b.is_featured)) - Number(Boolean(a.is_featured)) || Number(favoriteIds.has(b.id)) - Number(favoriteIds.has(a.id)) || Number(b.municipality === activeDiscoverTown) - Number(a.municipality === activeDiscoverTown)).slice(0, 4);
  const alertMatches = liveListings.filter((listing) => alertKeywords.some((keyword) => normalizeSearch(`${listing.title} ${listing.description} ${listing.municipality}`).includes(normalizeSearch(keyword)))).slice(0, 6);
  const recentlyViewed = recentlyViewedIds.map((id) => liveListings.find((listing) => listing.id === id)).filter((listing): listing is PublicListing => Boolean(listing));
  const similarListings = selectedListing ? liveListings.filter((listing) => listing.id !== selectedListing.id && listing.category_id === selectedListing.category_id && listing.status !== "sold").slice(0, 3) : [];
  const profileCompletion = [myProfile.display_name.trim(), myProfile.municipality, myProfile.bio.trim()].filter(Boolean).length;
  const ownedCounts = myListings.reduce((counts, listing) => {
    const status = listing.status || "draft";
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);
  const filteredMyListings = [...myListings]
    .filter((listing) => (myListingFilter === "all" || listing.status === myListingFilter) && normalizeSearch(`${listing.title} ${listing.municipality}`).includes(normalizeSearch(myListingSearch)))
    .sort((a, b) => myListingSort === "title" ? a.title.localeCompare(b.title, "es") : myListingSort === "price" ? Number(b.price || 0) - Number(a.price || 0) : new Date(b.updated_at || b.created_at || 0).getTime() - new Date(a.updated_at || a.created_at || 0).getTime());
  const unreadNotificationCount = myNotifications.filter((item) => !item.read_at && item.status !== "read").length;
  const filteredNotifications = myNotifications.filter((item) => notificationFilter === "all" || (notificationFilter === "unread" ? !item.read_at && item.status !== "read" : item.module === notificationFilter));
  const offerCounts = myOffers.reduce((counts, offer) => {
    counts.all += 1;
    if (offer.status === "pending") counts.pending += 1;
    else if (offer.status === "accepted") counts.accepted += 1;
    else counts.closed += 1;
    return counts;
  }, { all: 0, pending: 0, accepted: 0, closed: 0 });
  const filteredMyOffers = myOffers.filter((offer) => {
    const received = Boolean(session && offer.offered_by_user_id !== session.user.id);
    const matchesSearch = normalizeSearch(offer.listings?.title || "Publicación").includes(normalizeSearch(offerSearch));
    const matchesDirection = offerDirectionFilter === "all" || (offerDirectionFilter === "received" ? received : !received);
    const matchesStatus = offerStatusFilter === "all" || (offerStatusFilter === "closed" ? !["pending", "accepted"].includes(offer.status) : offer.status === offerStatusFilter);
    return matchesSearch && matchesDirection && matchesStatus;
  });
  const offerFiltersActive = Boolean(offerSearch || offerStatusFilter !== "all" || offerDirectionFilter !== "all");
  const huellitasFeed = huellitasAnimals;
  const huellitasTowns = [...new Set(huellitasFeed.map((animal) => animal.municipality))].sort((a, b) => a.localeCompare(b, "es"));
  const filteredHuellitasAnimals = huellitasFeed.filter((animal) => (!huellitasSpecies || animal.species === huellitasSpecies) && (!huellitasTown || animal.municipality === huellitasTown));
  const jobsFeed = liveJobs;
  const jobTowns = [...new Set(jobsFeed.map((job) => job.municipality).filter((town) => town !== "Todo Puerto Rico"))];
  const filteredJobs = jobsFeed.filter((job) => normalizeSearch(`${job.title} ${job.company} ${job.summary} ${job.requirements.join(" ")} ${job.skills.join(" ")}`).includes(normalizeSearch(jobSearch)) && (!jobSkill || job.skills.some((skill) => normalizeSearch(skill).includes(normalizeSearch(jobSkill)))) && (!jobTown || job.municipality === jobTown) && (!jobArrangement || job.arrangement.includes(jobArrangement)));
  const candidateFeed = quickClickApplications;
  const filteredCandidates = candidateFeed.filter((application) => normalizeSearch(`${application.candidate.fullName} ${application.candidate.headline} ${application.candidate.experience} ${application.candidate.skills} ${application.candidate.municipality}`).includes(normalizeSearch(candidateSearch)) && (!candidateSkill || normalizeSearch(application.candidate.skills).includes(normalizeSearch(candidateSkill))));
  const isEnglish = language === "en";
  useInterfaceLanguage(language);

  function clearOfferFilters() {
    setOfferSearch("");
    setOfferStatusFilter("all");
    setOfferDirectionFilter("all");
  }
  const acceptedSaleOffers = myOffers.filter((offer) => offer.status === "accepted" && offer.seller_id === session?.user.id && !saleConfirmations.some((confirmation) => confirmation.accepted_offer_id === offer.id));
  const saleTitleMatches = (title?: string) => normalizeSearch(title || "Publicación").includes(normalizeSearch(saleSearch));
  const saleRoleMatches = (buyerId: string, sellerId: string) => saleRoleFilter === "all" || (saleRoleFilter === "buying" ? buyerId === session?.user.id : sellerId === session?.user.id);
  const filteredAcceptedSaleOffers = acceptedSaleOffers.filter((offer) => saleStageFilter !== "completed" && saleStageFilter !== "disputed" && saleTitleMatches(offer.listings?.title) && saleRoleMatches(offer.buyer_id, offer.seller_id));
  const filteredSaleConfirmations = saleConfirmations.filter((confirmation) => saleStageFilter !== "completed" && saleStageFilter !== "disputed" && (saleStageFilter !== "action" || confirmation.status === "seller_submitted") && saleTitleMatches(confirmation.listings?.title) && saleRoleMatches(confirmation.buyer_id, confirmation.seller_id));
  const filteredTransactions = myTransactions.filter((transaction) => saleStageFilter !== "action" && (saleStageFilter !== "completed" || transaction.status === "completed") && (saleStageFilter !== "disputed" || transaction.status === "disputed") && saleTitleMatches(transaction.listings?.title) && saleRoleMatches(transaction.buyer_id, transaction.seller_id));
  const saleResultCount = filteredAcceptedSaleOffers.length + filteredSaleConfirmations.length + filteredTransactions.length;
  const saleCounts = {
    all: acceptedSaleOffers.length + saleConfirmations.length + myTransactions.length,
    action: acceptedSaleOffers.length + saleConfirmations.filter((confirmation) => confirmation.status === "seller_submitted").length,
    completed: myTransactions.filter((transaction) => transaction.status === "completed").length,
    disputed: myTransactions.filter((transaction) => transaction.status === "disputed").length,
  };
  const saleFiltersActive = Boolean(saleSearch || saleRoleFilter !== "all" || saleStageFilter !== "all");

  function clearSaleFilters() {
    setSaleSearch("");
    setSaleRoleFilter("all");
    setSaleStageFilter("all");
  }

  function showSearchResults(event?: FormEvent) {
    event?.preventDefault();
    if (searchTerm.trim()) {
      const saved = JSON.parse(window.localStorage.getItem("coqui-recent-searches") || "[]") as string[];
      window.localStorage.setItem("coqui-recent-searches", JSON.stringify([searchTerm.trim(), ...saved.filter((item) => item !== searchTerm.trim())].slice(0, 4)));
    }
    document.getElementById("explorar")?.scrollIntoView({ behavior: "smooth" });
  }

  function showFreeListings() {
    setSearchTerm("");
    setSearchMunicipality("");
    setFilterCategory(FREE_CATEGORY_ID);
    setFilterCondition("");
    setFilterStatus("");
    setFreeOnly(true);
    setOffersOnly(false);
    setDateRange("");
    setMinimumPrice("");
    setMaximumPrice("");
    setFavoritesOnly(false);
    setSortOrder("newest");
    setMenuOpen(false);
    window.setTimeout(() => {
      document.getElementById("explorar")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  function clearFilters() {
    setSearchTerm("");
    setSearchMunicipality("");
    setFilterCategory("");
    setFilterCondition("");
    setFilterStatus("");
    setFreeOnly(false);
    setOffersOnly(false);
    setDateRange("");
    setMinimumPrice("");
    setMaximumPrice("");
    setFavoritesOnly(false);
    setSortOrder("newest");
    setVisibleCount(8);
  }

  function showCategoryListings(label: string) {
    const categoryAliases: Record<string, string> = {
      Marketplace: "Marketplace general",
      "Arte y cultura": "Arte, talleres y eventos",
    };
    const categoryName = categoryAliases[label] || label;
    const category = categoriesData.find((item) => item.name === categoryName);
    clearFilters();
    if (category) setFilterCategory(category.id);
    window.setTimeout(() => {
      document.getElementById("explorar")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  async function openHuellitas() {
    setHuellitasOpen(true);
    setHuellitasLoading(true);
    setHuellitasMessage("");
    try { setHuellitasAnimals(await getPublicAnimals()); }
    catch (error) { setHuellitasAnimals([]); setHuellitasMessage(error instanceof Error ? error.message : "No pudimos cargar Huellitas de Amor."); }
    finally { setHuellitasLoading(false); }
  }

  function changeLanguage(nextLanguage: "es" | "en") {
    setLanguage(nextLanguage);
    window.localStorage.setItem("coqui-language", nextLanguage);
  }

  async function loadRealJobWorkspace(mode: "candidate" | "employer") {
    if (!session) { setQuickClickApplications([]); setQuickClickProfile(null); setQuickClickProfileViews(0); return; }
    const [profile, applications, views] = await Promise.all([
      mode === "candidate" ? getMyJobSeekerProfile(session.access_token, session.user.id) : Promise.resolve(null),
      getMyJobApplications(session.access_token, session.user.id, mode === "employer"),
      mode === "candidate" ? getMyJobProfileViewCount(session.access_token, session.user.id) : Promise.resolve(0),
    ]);
    if (profile) setQuickClickProfile({ fullName:myProfile.display_name || session.user.email || "Candidato", headline:profile.headline || "Perfil profesional", municipality:profile.municipality || "Puerto Rico", experience:profile.professional_summary || "", skills:profile.skills.join(", "), resumeName:"Perfil Quick Click guardado" });
    else if (mode === "candidate") setQuickClickProfile(null);
    setQuickClickApplications(applications.map(realQuickClickApplication));
    setQuickClickProfileViews(views);
  }

  function openJobs(mode: "candidate" | "employer" = "candidate") {
    setJobsOpen(true);
    setQuickClickMode(mode);
    setSelectedJob(null);
    setQuickClickMessage("");
    setJobsLoading(true);
    Promise.all([getPublicJobs().then(setLiveJobs), loadRealJobWorkspace(mode)]).catch((error) => { setLiveJobs([]); setQuickClickMessage(error instanceof Error ? error.message : "No pudimos cargar Empleos."); }).finally(() => setJobsLoading(false));
    try {
      const savedLanguage = window.localStorage.getItem("coqui-language");
      if (savedLanguage === "es" || savedLanguage === "en") setLanguage(savedLanguage);
    } catch { setQuickClickMessage("No pudimos recuperar el idioma preferido de este dispositivo."); }
  }

  function returnToClassifieds() {
    setJobsOpen(false);
    setSelectedJob(null);
    window.setTimeout(() => document.getElementById("explorar")?.scrollIntoView({ behavior: "smooth" }), 0);
  }

  async function saveQuickClickProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      setJobsOpen(false); setAuthMode("signup"); setAuthOpen(true);
      setAuthMessage("Crea tu cuenta para preparar tu perfil Quick Click y solicitar empleos con un clic.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const profile: QuickClickProfile = { fullName:String(form.get("full_name") || "").trim(),headline:String(form.get("headline") || "").trim(),municipality:String(form.get("municipality") || ""),experience:String(form.get("experience") || "").trim(),skills:String(form.get("skills") || "").trim(),resumeName:"Perfil Quick Click guardado" };
    setBusy(true); setQuickClickMessage("");
    try {
      await saveJobSeekerProfile(session.access_token, session.user.id, { headline:profile.headline, professional_summary:profile.experience, municipality:profile.municipality, skills:profile.skills.split(",").map((skill) => skill.trim()).filter(Boolean) });
      setQuickClickProfile(profile);
      setQuickClickMessage("Perfil Quick Click guardado en tu cuenta. Ya puedes solicitar empleos con un clic.");
    } catch (error) { setQuickClickMessage(error instanceof Error ? error.message : "No pudimos guardar tu perfil Quick Click."); }
    finally { setBusy(false); }
  }

  async function applyQuickClick(job: PublicJob) {
    if (!session) {
      setJobsOpen(false); setAuthMode("signup"); setAuthOpen(true);
      setAuthMessage("Necesitas una cuenta de Coquí Ventas para usar Quick Click.");
      return;
    }
    if (!quickClickProfile) {
      setQuickClickMessage("Primero completa tu perfil Quick Click con tu experiencia y resumé.");
      document.getElementById("quick-click-profile")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (quickClickApplications.some((application) => application.jobId === job.id)) {
      setQuickClickMessage("Ya enviaste tu perfil para este empleo.");
      return;
    }
    setBusy(true); setQuickClickMessage("");
    try {
      await applyToJob(session.access_token, job.id);
      await loadRealJobWorkspace("candidate");
      setQuickClickMessage(`Solicitud enviada a ${job.company}. El patrono recibió tu perfil profesional.`);
    } catch (error) { setQuickClickMessage(error instanceof Error ? error.message : "No pudimos enviar la solicitud."); }
    finally { setBusy(false); }
  }

  async function recordQuickClickProfileView(application: QuickClickApplication) {
    if (!session) return;
    try {
      await recordJobProfileView(session.access_token, application.id);
      await loadRealJobWorkspace("employer");
      setQuickClickMessage(`Perfil profesional de ${application.candidate.fullName} abierto.`);
    } catch (error) { setQuickClickMessage(error instanceof Error ? error.message : "No pudimos abrir el perfil."); }
  }

  function startHuellitasProfile() {
    if (!session) {
      setHuellitasOpen(false);
      setAuthMode("signup");
      setAuthOpen(true);
      setAuthMessage("Crea tu cuenta para encontrarle un hogar a un animal o administrar rescates.");
      return;
    }
    setHuellitasMessage("Tu cuenta está lista. Podrás publicar como familia, rescatista, hogar temporero u organización. Las adopciones particulares siempre serán gratis.");
  }

  async function openRescueOrganizationPortal() {
    if (!session) {
      setHuellitasOpen(false); setAuthMode("signup"); setAuthOpen(true);
      setAuthMessage("Crea tu cuenta para registrar y administrar una organización sin fines de lucro."); return;
    }
    setHuellitasPortalOpen(true); setRescueWorkspaceLoading(true); setHuellitasMessage("");
    try { const workspace = await getMyRescueWorkspace(session.access_token, session.user.id); setRescueProfile(workspace.profile); setManagedAnimals(workspace.animals); }
    catch (error) { setHuellitasMessage(error instanceof Error ? error.message : "No pudimos abrir el portal de la organización."); }
    finally { setRescueWorkspaceLoading(false); }
  }

  async function submitRescueOrganization(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!session) return; const form = new FormData(event.currentTarget); setRescueWorkspaceLoading(true);
    try { const profile = await registerRescueOrganization(session.access_token, session.user.id, { public_name: String(form.get("public_name") || "").trim(), municipality: String(form.get("municipality") || ""), description: String(form.get("description") || "").trim(), public_email: String(form.get("public_email") || "").trim(), website_url: String(form.get("website_url") || "").trim() || null }); setRescueProfile(profile); setManagedAnimals([]); setHuellitasMessage("Registro recibido. Coquí revisará la organización antes de permitir publicaciones institucionales."); }
    catch (error) { setHuellitasMessage(error instanceof Error ? error.message : "No pudimos registrar la organización."); } finally { setRescueWorkspaceLoading(false); }
  }

  async function submitOrganizationAnimal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!session || !rescueProfile || rescueProfile.verification_status !== "verified") return; const target = event.currentTarget; const form = new FormData(target); const file = form.get("photo");
    if (!(file instanceof File) || !file.size) { setHuellitasMessage("La foto real es obligatoria."); return; } setRescueWorkspaceLoading(true);
    try { const optimized = await optimizeListingImage(file); const fee = rescueProfile.institutional_fee_allowed ? Number(form.get("adoption_fee") || 0) : 0; await createOrganizationAnimal(session.access_token, rescueProfile, { name: String(form.get("name") || ""), species: String(form.get("species") || "other"), municipality: String(form.get("municipality") || ""), description: String(form.get("description") || ""), sex: String(form.get("sex") || "unknown"), size: String(form.get("size") || "unknown"), vaccinated: String(form.get("vaccinated") || "unknown"), sterilized: String(form.get("sterilized") || "unknown"), veterinarian_evaluated: String(form.get("veterinarian_evaluated") || "unknown"), adoption_fee: fee, adoption_fee_explanation: fee > 0 ? String(form.get("adoption_fee_explanation") || "") : null }, optimized); const workspace = await getMyRescueWorkspace(session.access_token, session.user.id); setManagedAnimals(workspace.animals); target.reset(); setHuellitasMessage("Huellita publicada correctamente."); }
    catch (error) { setHuellitasMessage(error instanceof Error ? error.message : "No pudimos publicar la Huellita."); } finally { setRescueWorkspaceLoading(false); }
  }

  async function changeManagedAnimalStatus(animalId: string, status: "available" | "in_process" | "adopted" | "paused" | "removed") { if (!session) return; await updateOrganizationAnimalStatus(session.access_token, animalId, status); setManagedAnimals((animals) => animals.map((animal) => animal.id === animalId ? { ...animal, status } : animal)); }
  async function changeAdoptionInterest(interestId: string, status: "reviewing" | "contacted" | "approved" | "declined" | "completed") { if (!session) return; await updateAdoptionInterestStatus(session.access_token, interestId, status); setManagedAnimals((animals) => animals.map((animal) => ({ ...animal, adoption_interests: animal.adoption_interests.map((interest) => interest.id === interestId ? { ...interest, status } : interest) }))); }

  function applyQuickFilter(kind: "all" | "available" | "pending" | "free" | "offers" | "recent") {
    clearFilters();
    if (kind === "available") setFilterStatus("available");
    if (kind === "pending") setFilterStatus("pending");
    if (kind === "free") setFreeOnly(true);
    if (kind === "offers") setOffersOnly(true);
    if (kind === "recent") setDateRange("day");
  }

  async function loadAccountData(currentSession: Session, silent = false) {
    if (silent) setAccountSyncing(true);
    else {
      setBusy(true);
      setAccountMessage("");
    }
    try {
      const [profile, ownedListings, conversations, offers, saleActivity, safetyActivity, notifications, preferences] = await Promise.all([
        getMyProfile(currentSession.access_token, currentSession.user.id),
        getMyListings(currentSession.access_token, currentSession.user.id),
        getMyConversations(currentSession.access_token, currentSession.user.id),
        getMyOffers(currentSession.access_token, currentSession.user.id),
        getMySaleActivity(currentSession.access_token, currentSession.user.id),
        getMySafetyActivity(currentSession.access_token, currentSession.user.id),
        getMyNotifications(currentSession.access_token),
        getNotificationPreferences(currentSession.access_token, currentSession.user.id),
      ]);
      setMyProfile({
        display_name: profile?.display_name || "",
        avatar_url: profile?.avatar_url || "",
        municipality: profile?.municipality || "",
        bio: profile?.bio || "",
      });
      setAccountStatus(profile?.account_status === "restricted" || profile?.account_status === "suspended" || profile?.account_status === "deleted" ? profile.account_status : "active");
      setPhoneVerified(Boolean(profile?.phone_verified));
      setIdentityVerified(Boolean(profile?.identity_verified));
      setMyListings(ownedListings);
      setMyConversations(conversations);
      setMyOffers(offers);
      setSaleConfirmations(saleActivity.confirmations);
      setMyTransactions(saleActivity.transactions);
      setMyReviews(saleActivity.reviews);
      setMyReports(safetyActivity.reports);
      setMyDisputes(safetyActivity.disputes);
      setMyModerationActions(safetyActivity.actions);
      setMyAppeals(safetyActivity.appeals);
      setMyNotifications(notifications);
      setNotificationPreferences(preferences || { user_id: currentSession.user.id, marketplace_enabled: true, messages_enabled: true, offers_enabled: true, disputes_enabled: true, system_enabled: true, promotions_enabled: true, push_enabled: false, email_enabled: true, marketing_enabled: false });
      setAdminDashboard(await getCoquiAdminDashboard(currentSession.access_token).catch(() => null));
      setSelectedConversationId((current) => current || conversations[0]?.id || "");
      setAccountLastUpdated(new Date());
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos cargar tu cuenta.");
    } finally {
      if (silent) setAccountSyncing(false);
      else setBusy(false);
    }
  }

  useEffect(() => {
    if (!session || !accountOpen || !accountAutoRefresh) return;
    const refreshActivity = () => {
      if (document.visibilityState === "visible") loadAccountData(session, true);
    };
    const interval = window.setInterval(refreshActivity, 30000);
    document.addEventListener("visibilitychange", refreshActivity);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshActivity);
    };
  }, [accountOpen, accountAutoRefresh, session]);

  async function refreshAccountNow() {
    if (!session || accountSyncing) return;
    await loadAccountData(session, true);
    setAccountMessage("Tu actividad está al día.");
  }

  function openAccount(tab: "profile" | "listings" | "offers" | "sales" | "messages" | "notifications" | "safety" | "admin") {
    if (!session) {
      setAuthOpen(true);
      return;
    }
    setAccountTab(tab);
    setAccountOpen(true);
    loadAccountData(session);
  }

  async function readNotification(notification: NotificationSummary) {
    if (!session || notification.read_at || notification.status === "read") return;
    try {
      await markNotificationRead(session.access_token, notification.id);
      const readAt = new Date().toISOString();
      setMyNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, status: "read", read_at: readAt } : item));
    } catch (error) { setAccountMessage(error instanceof Error ? error.message : "No pudimos marcar el aviso como leído."); }
  }

  async function openNotificationDestination(notification: NotificationSummary) {
    if (!session) return;
    if (!notification.read_at && notification.status !== "read") await readNotification(notification);
    const metadata = notification.metadata || {};
    const metadataValue = (key: string) => typeof metadata[key] === "string" ? metadata[key] as string : "";
    const listingId = metadataValue("listing_id") || (notification.related_content_type === "listing" ? notification.related_content_id || "" : "");
    const conversationId = metadataValue("conversation_id") || (notification.related_content_type === "conversation" ? notification.related_content_id || "" : "");

    if (notification.module === "messages") {
      const conversation = myConversations.find((item) => item.id === conversationId || (listingId && item.listing_id === listingId));
      if (conversation) setSelectedConversationId(conversation.id);
      setChatView("all");
      setAccountTab("messages");
      setAccountMessage(conversation ? "Abrimos la conversación relacionada con este aviso." : "Abrimos tus mensajes más recientes.");
      return;
    }
    if (notification.module === "offers") {
      const conversation = myConversations.find((item) => item.id === conversationId || (listingId && item.listing_id === listingId));
      if (conversation) {
        setSelectedConversationId(conversation.id);
        setChatView("offers");
        setAccountTab("messages");
        setAccountMessage("Abrimos el historial de negociación relacionado.");
      } else {
        setAccountTab("offers");
        setAccountMessage("Abrimos tus ofertas para que puedas responder.");
      }
      return;
    }
    if (notification.module === "marketplace") {
      const listing = [...liveListings, ...myListings].find((item) => item.id === listingId);
      if (listing) {
        setAccountOpen(false);
        setSelectedListing(listing);
        setActiveImageIndex(0);
        setContactMessage("");
        setOfferOpen(false);
        setOfferAmount("");
        setOfferMessage("");
        setContactDraft(`Hola, me interesa ${listing.title}. ¿Todavía está disponible?`);
      } else {
        setAccountTab("listings");
        setAccountMessage("Abrimos tus publicaciones relacionadas.");
      }
      return;
    }
    if (notification.module === "disputes") {
      setAccountTab("safety");
      setAccountMessage("Abrimos el Centro de seguridad relacionado con este aviso.");
      return;
    }
    setAccountMessage("Aviso revisado.");
  }

  function notificationActionLabel(notification: NotificationSummary) {
    if (notification.module === "offers") return "Ver negociación";
    if (notification.module === "messages") return "Abrir mensaje";
    if (notification.module === "marketplace") return "Ver publicación";
    if (notification.module === "disputes") return "Abrir seguridad";
    return "Marcar leída";
  }

  function followupKind(notification: NotificationSummary) {
    return typeof notification.metadata?.kind === "string" ? notification.metadata.kind : "";
  }

  async function answerListingFollowup(notification: NotificationSummary, response: "available" | "pending" | "sold") {
    if (!session) return;
    const listingId = typeof notification.metadata?.listing_id === "string" ? notification.metadata.listing_id : notification.related_content_id || "";
    const listing = myListings.find((item) => item.id === listingId);
    if (response === "sold") {
      if (listing) openListingStatusChange(listing, "sold");
      else setAccountMessage("Abre Mis publicaciones para completar la venta.");
      return;
    }
    setBusy(true);
    try {
      await respondListingFollowup(session.access_token, notification.id, response);
      await loadAccountData(session, true);
      await getPublicListings().then(setLiveListings);
      setAccountMessage(response === "available" ? "Confirmado: el artículo continúa disponible." : "Confirmado: el artículo permanece pendiente.");
    } catch (error) { setAccountMessage(error instanceof Error ? error.message : "No pudimos guardar tu respuesta."); }
    finally { setBusy(false); }
  }

  async function answerBuyerFollowup(notification: NotificationSummary, purchased: boolean) {
    if (!session) return;
    setBusy(true);
    try {
      await respondBuyerPurchaseFollowup(session.access_token, notification.id, purchased);
      await loadAccountData(session, true);
      setAccountMessage(purchased ? "Gracias. Avisamos al vendedor; todavía no cuenta como compra verificada." : "Gracias. Registramos que no compraste este artículo.");
    } catch (error) { setAccountMessage(error instanceof Error ? error.message : "No pudimos guardar tu respuesta."); }
    finally { setBusy(false); }
  }

  function openReportedPurchase(notification: NotificationSummary) {
    const listingId = typeof notification.metadata?.listing_id === "string" ? notification.metadata.listing_id : notification.related_content_id || "";
    const listing = myListings.find((item) => item.id === listingId);
    if (listing) openListingStatusChange(listing, "sold");
    else { setAccountTab("listings"); setAccountMessage("Busca la publicación para completar la confirmación de venta."); }
  }

  async function readAllNotifications() {
    if (!session) return;
    const unread = myNotifications.filter((item) => !item.read_at && item.status !== "read");
    if (!unread.length) return;
    setBusy(true);
    try {
      await Promise.all(unread.map((item) => markNotificationRead(session.access_token, item.id)));
      const readAt = new Date().toISOString();
      setMyNotifications((items) => items.map((item) => ({ ...item, status: "read", read_at: item.read_at || readAt })));
      setAccountMessage("Todos los avisos quedaron marcados como leídos.");
    } catch (error) { setAccountMessage(error instanceof Error ? error.message : "No pudimos actualizar todos los avisos."); }
    finally { setBusy(false); }
  }

  async function updateNotificationPreferences(next: NotificationPreferences) {
    if (!session) return;
    const previous = notificationPreferences;
    setNotificationPreferences(next);
    try { await saveNotificationPreferences(session.access_token, next); setAccountMessage("Preferencias guardadas."); }
    catch (error) { setNotificationPreferences(previous); setAccountMessage(error instanceof Error ? error.message : "No pudimos guardar tus preferencias."); }
  }

  async function changeOfferStatus(offerId: string, status: "accepted" | "rejected" | "withdrawn") {
    if (!session) return;
    setBusy(true);
    setAccountMessage("");
    try {
      await updateOfferStatus(session.access_token, offerId, status);
      await loadAccountData(session, true);
      setAccountMessage(status === "accepted" ? "Oferta aceptada. Avisamos a la otra persona; el anuncio no cambia a Pendiente automáticamente." : status === "rejected" ? "Oferta rechazada. La otra persona recibió un aviso." : "Oferta retirada. La otra persona recibió un aviso.");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos actualizar la oferta.");
    } finally {
      setBusy(false);
    }
  }

  async function submitCounterOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !counteringOffer) return;
    const amount = Number(counterAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setAccountMessage("Escribe una cantidad válida mayor de $0.");
      return;
    }
    setBusy(true);
    setAccountMessage("");
    try {
      await createCounterOffer(session.access_token, counteringOffer.id, amount);
      const offers = await getMyOffers(session.access_token, session.user.id);
      setMyOffers(offers);
      setCounteringOffer(null);
      setCounterAmount("");
      setAccountMessage("Contraoferta enviada y guardada en el chat. La otra persona recibió un aviso.");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos enviar la contraoferta.");
    } finally {
      setBusy(false);
    }
  }

  function openCounterOffer(offer: OfferSummary) {
    setCounteringOffer(offer);
    setCounterAmount(String(Number(offer.amount)));
    setAccountMessage("");
  }

  async function startSaleConfirmation() {
    if (!session || !saleOffer) return;
    setBusy(true);
    setAccountMessage("");
    try {
      await submitSaleConfirmation(session.access_token, { listingId: saleOffer.listing_id, buyerId: saleOffer.buyer_id, agreedPrice: Number(saleOffer.amount), offerId: saleOffer.id });
      const activity = await getMySaleActivity(session.access_token, session.user.id);
      setSaleConfirmations(activity.confirmations);
      setMyTransactions(activity.transactions);
      setSaleOffer(null);
      setAccountTab("sales");
      setAccountMessage("Confirmación enviada al comprador. La venta aún no está completada.");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos iniciar la confirmación.");
    } finally { setBusy(false); }
  }

  async function actOnSaleConfirmation(confirmationId: string, action: "confirm" | "reject" | "cancel") {
    if (!session) return;
    setBusy(true);
    setAccountMessage("");
    try {
      if (action === "confirm") await confirmPurchase(session.access_token, confirmationId);
      if (action === "reject") await rejectSaleConfirmation(session.access_token, confirmationId);
      if (action === "cancel") await cancelSaleConfirmation(session.access_token, confirmationId);
      const activity = await getMySaleActivity(session.access_token, session.user.id);
      setSaleConfirmations(activity.confirmations);
      setMyTransactions(activity.transactions);
      getPublicListings().then(setLiveListings).catch(() => undefined);
      setAccountMessage(action === "confirm" ? "Compra confirmada. La transacción quedó verificada y el anuncio pasará a Vendido." : action === "reject" ? "Confirmación rechazada. No se creó ninguna transacción." : "Confirmación cancelada.");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos actualizar la confirmación.");
    } finally { setBusy(false); }
  }

  async function sendVerifiedReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !reviewTransaction) return;
    const reviewedUserId = reviewTransaction.seller_id === session.user.id ? reviewTransaction.buyer_id : reviewTransaction.seller_id;
    setBusy(true);
    setAccountMessage("");
    try {
      const review = await submitReview(session.access_token, { transactionId: reviewTransaction.id, reviewerId: session.user.id, reviewedUserId, rating: reviewRating, comment: reviewComment.trim() });
      setMyReviews((reviews) => [review, ...reviews]);
      setReviewTransaction(null);
      setReviewComment("");
      setReviewRating(5);
      setAccountMessage("Reseña guardada. Se revelará según las reglas de reseñas verificadas.");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos guardar la reseña.");
    } finally { setBusy(false); }
  }

  async function sendSafetyReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !reportTarget || reportDescription.trim().length < 15) return;
    setBusy(true);
    setAccountMessage("");
    try {
      const report = await submitReport(session.access_token, {
        reporterId: session.user.id,
        reportedUserId: reportTarget.userId || null,
        listingId: reportTarget.kind === "listing" ? reportTarget.id : null,
        conversationId: reportTarget.kind === "conversation" ? reportTarget.id : null,
        reasonCode: reportReason,
        description: reportDescription,
      });
      setMyReports((current) => [report, ...current]);
      setReportTarget(null);
      setReportDescription("");
      setAccountMessage("Reporte recibido. Lo revisaremos de forma privada; no se publicará ninguna acusación automática.");
      setAccountTab("safety");
      setAccountOpen(true);
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos enviar el reporte.");
    } finally { setBusy(false); }
  }

  async function sendDispute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !disputeTransaction || disputeDescription.trim().length < 20) return;
    setBusy(true);
    setAccountMessage("");
    try {
      await openTransactionDispute(session.access_token, { transactionId: disputeTransaction.id, openedBy: session.user.id, reasonCode: disputeReason, description: disputeDescription });
      const safety = await getMySafetyActivity(session.access_token, session.user.id);
      setMyDisputes(safety.disputes);
      setDisputeTransaction(null);
      setDisputeDescription("");
      setAccountTab("safety");
      setAccountMessage("Disputa abierta. La información quedó privada para las partes y Coquí Admin.");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos abrir la disputa.");
    } finally { setBusy(false); }
  }

  async function sendDisputeEvidence(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !evidenceDispute || evidenceDescription.trim().length < 10) return;
    setBusy(true);
    try {
      await addDisputeStatement(session.access_token, { disputeId: evidenceDispute.id, submittedBy: session.user.id, description: evidenceDescription });
      const safety = await getMySafetyActivity(session.access_token, session.user.id);
      setMyDisputes(safety.disputes);
      setEvidenceDispute(null);
      setEvidenceDescription("");
      setAccountMessage("Tu declaración se añadió de forma privada al expediente.");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos añadir la declaración.");
    } finally { setBusy(false); }
  }

  async function sendAppeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !appealAction || appealReason.trim().length < 20) return;
    setBusy(true);
    try {
      const appeal = await submitAppeal(session.access_token, { submittedBy: session.user.id, actionId: appealAction.id, reason: appealReason });
      setMyAppeals((current) => [appeal, ...current]);
      setAppealAction(null);
      setAppealReason("");
      setAccountMessage("Apelación recibida. Coquí Admin revisará la decisión y tu explicación.");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos enviar la apelación.");
    } finally { setBusy(false); }
  }

  async function handleProfileSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !guardAccountWrite()) return;
    setBusy(true);
    setAccountMessage("");
    try {
      await saveMyProfile(session.access_token, {
        id: session.user.id,
        display_name: myProfile.display_name.trim(),
        municipality: myProfile.municipality || null,
        bio: myProfile.bio.trim() || null,
      });
      syncSellerIdentity(myProfile.display_name.trim(), myProfile.avatar_url);
      setAccountMessage("Perfil actualizado correctamente.");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos guardar tu perfil.");
    } finally {
      setBusy(false);
    }
  }

  function syncSellerIdentity(displayName: string, avatarUrl: string) {
    if (!session) return;
    const updateListing = (listing: PublicListing) => listing.seller_id === session.user.id
      ? { ...listing, seller_display_name: displayName || "Miembro de Coquí Ventas", seller_avatar_url: avatarUrl || null }
      : listing;
    setLiveListings((current) => current.map(updateListing));
    setMyListings((current) => current.map(updateListing));
    setSelectedListing((current) => current ? updateListing(current) : current);
  }

  async function handleProfileAvatarChange(file?: File) {
    if (!file || !session || !guardAccountWrite()) return;
    setProfileAvatarMessage("");
    if (!file.type.startsWith("image/")) {
      setProfileAvatarMessage("Selecciona una foto en formato de imagen.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setProfileAvatarMessage("La foto original no puede superar 12 MB.");
      return;
    }
    setProfileAvatarBusy(true);
    try {
      const optimized = await optimizeAvatarImage(file);
      const result = await uploadProfileAvatar(session.access_token, session.user.id, optimized);
      setMyProfile((current) => ({ ...current, avatar_url: result.avatarUrl }));
      syncSellerIdentity(myProfile.display_name.trim(), result.avatarUrl);
      setProfileAvatarMessage("Tu foto de perfil se actualizó correctamente.");
    } catch (error) {
      setProfileAvatarMessage(error instanceof Error ? error.message : "No pudimos guardar la foto.");
    } finally {
      setProfileAvatarBusy(false);
    }
  }

  async function handleProfileAvatarRemove() {
    if (!session || !guardAccountWrite()) return;
    setProfileAvatarBusy(true);
    setProfileAvatarMessage("");
    try {
      await removeProfileAvatar(session.access_token, session.user.id);
      setMyProfile((current) => ({ ...current, avatar_url: "" }));
      syncSellerIdentity(myProfile.display_name.trim(), "");
      setProfileAvatarMessage("Quitamos la foto de tu perfil.");
    } catch (error) {
      setProfileAvatarMessage(error instanceof Error ? error.message : "No pudimos quitar la foto.");
    } finally {
      setProfileAvatarBusy(false);
    }
  }

  async function changeOwnedListingStatus(
    listingId: string,
    status: "available" | "pending" | "sold" | "paused",
  ) {
    if (!session) return;
    setBusy(true);
    setAccountMessage("");
    try {
      await updateListingStatus(session.access_token, session.user.id, listingId, status);
      setMyListings((current) => current.map((listing) => listing.id === listingId ? { ...listing, status } : listing));
      getPublicListings().then(setLiveListings).catch(() => undefined);
      setAccountMessage(`Estado actualizado a ${status === "available" ? "Disponible" : status === "pending" ? "Pendiente" : status === "paused" ? "Pausado" : "Vendido"}.`);
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos cambiar el estado.");
    } finally {
      setBusy(false);
    }
  }

  function openListingStatusChange(listing: PublicListing, status: "available" | "pending" | "sold" | "paused") {
    if (status === "sold") {
      setSoldMethod("coqui");
      setSoldBuyerId("");
    }
    setPendingStatusChange({ listingId: listing.id, title: listing.title, status });
  }

  async function completeSoldFlow() {
    if (!session || !pendingStatusChange || pendingStatusChange.status !== "sold" || !soldListing) return;
    if (soldMethod === "coqui" && !soldBuyerId) {
      setAccountMessage("Escoge al comprador de Coquí Ventas para enviarle la confirmación.");
      return;
    }
    setBusy(true);
    setAccountMessage("");
    try {
      if (soldMethod === "coqui") {
        await submitSaleConfirmation(session.access_token, { listingId: soldListing.id, buyerId: soldBuyerId, agreedPrice: soldListing.is_free ? 0 : Number(soldListing.price || 0), offerId: null });
        await updateListingStatus(session.access_token, session.user.id, soldListing.id, "pending");
        const activity = await getMySaleActivity(session.access_token, session.user.id);
        setSaleConfirmations(activity.confirmations);
        setMyTransactions(activity.transactions);
        setMyListings((current) => current.map((listing) => listing.id === soldListing.id ? { ...listing, status: "pending" } : listing));
        setAccountTab("sales");
        setAccountMessage("Le preguntamos al comprador si completó la compra. El anuncio queda Pendiente hasta que confirme.");
      } else {
        await markListingSoldNonverified(session.access_token, soldListing.id, soldMethod);
        setMyListings((current) => current.map((listing) => listing.id === soldListing.id ? { ...listing, status: "sold", sold_at: new Date().toISOString() } : listing));
        setAccountMessage(soldMethod === "external" ? "Venta externa registrada. No generará una reseña verificada." : "Venta registrada sin identificar comprador. No generará una reseña verificada.");
      }
      getPublicListings().then(setLiveListings).catch(() => undefined);
      setPendingStatusChange(null);
      setSoldBuyerId("");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos completar el registro de la venta.");
    } finally {
      setBusy(false);
    }
  }

  async function sendConversationReply() {
    if (!session || !selectedConversationId || !replyDraft.trim()) return;
    setBusy(true);
    setAccountMessage("");
    try {
      await sendMessage(session.access_token, selectedConversationId, replyDraft.trim());
      setReplyDraft("");
      const conversations = await getMyConversations(session.access_token, session.user.id);
      setMyConversations(conversations);
      setAccountMessage("Mensaje enviado.");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No pudimos enviar el mensaje.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const redirectedAccessToken = hash.get("access_token");
    const redirectedRefreshToken = hash.get("refresh_token");
    const redirectType = hash.get("type");
    if (redirectedAccessToken && redirectedRefreshToken) {
      getAuthUser(redirectedAccessToken)
        .then((user) => {
          const redirectedSession: Session = {
            access_token: redirectedAccessToken,
            refresh_token: redirectedRefreshToken,
            expires_in: Number(hash.get("expires_in") || 3600),
            user,
          };
          setSession(redirectedSession);
          window.localStorage.setItem("coqui-session", JSON.stringify(redirectedSession));
          window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
          if (redirectType === "recovery") {
            setAuthMode("update-password");
            setAuthMessage("Enlace verificado. Crea ahora tu contraseña nueva.");
            setAuthOpen(true);
          } else {
            setSessionNotice("Correo confirmado. Tu cuenta ya está activa.");
          }
        })
        .catch(() => {
          window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
          setAuthMode("recovery");
          setAuthMessage("Ese enlace venció o ya fue utilizado. Solicita uno nuevo.");
          setAuthOpen(true);
        });
    }
    const saved = window.localStorage.getItem("coqui-session");
    if (saved && !redirectedAccessToken) {
      try {
        const stored = JSON.parse(saved) as Session;
        refreshSession(stored.refresh_token)
          .then((renewed) => {
            setSession(renewed);
            window.localStorage.setItem("coqui-session", JSON.stringify(renewed));
          })
          .catch(() => {
            clearLocalSession("Tu sesión anterior venció. Inicia sesión nuevamente.");
          });
      } catch {
        window.localStorage.removeItem("coqui-session");
      }
    }
    void reloadMarketplace();
    void reloadCategories();
    // La carga inicial usa exclusivamente Supabase; las preferencias visuales sí permanecen locales.
  }, []);

  useEffect(() => {
    if (promotionPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rotation = window.setInterval(() => setActivePromotion((current) => (current + 1) % promotionalAds.length), 5000);
    return () => window.clearInterval(rotation);
  }, [promotionPaused]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedListing(null);
        setComparisonOpen(false);
        setPublicSellerId(null);
        setDiscoverOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    if (!session) return;
    getFavoriteListingIds(session.access_token, session.user.id)
      .then((ids) => setFavoriteIds(new Set(ids)))
      .catch(() => setFavoriteIds(new Set()));
  }, [session]);

  useEffect(() => {
    if (!session?.refresh_token) return;
    const refreshDelay = Math.max(30, session.expires_in - 60) * 1000;
    const timer = window.setTimeout(() => {
      refreshSession(session.refresh_token)
        .then((renewed) => {
          setSession(renewed);
          window.localStorage.setItem("coqui-session", JSON.stringify(renewed));
        })
        .catch(() => {
          clearLocalSession("Tu sesión venció. Inicia sesión nuevamente para continuar.");
          setAuthOpen(true);
        });
    }, refreshDelay);
    return () => window.clearTimeout(timer);
  }, [session]);

  useEffect(() => {
    if (!selectedListing?.seller_id || !session) return;
    let active = true;
    getSellerProfile(session.access_token, selectedListing.seller_id)
      .then((profile) => { if (active) setSellerProfile(profile); })
      .catch(() => { if (active) setSellerProfile(null); })
      .finally(() => { if (active) setSellerProfileLoading(false); });
    return () => { active = false; };
  }, [selectedListing?.seller_id, session]);

  useEffect(() => {
    if (!liveListings.length) return;
    const listingId = new URLSearchParams(window.location.search).get("listing");
    const sharedListing = liveListings.find((listing) => listing.id === listingId);
    if (sharedListing) openListing(sharedListing);
    // La URL compartida solo se evalúa cuando cambia el catálogo público.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveListings]);

  function openListing(listing: PublicListing) {
    setSelectedListing(listing);
    setActiveImageIndex(0);
    setContactMessage("");
    setSellerProfile(null);
    setSellerProfileLoading(Boolean(session && listing.seller_id));
    setOfferOpen(false);
    setOfferAmount("");
    setOfferMessage("");
    setContactDraft(`Hola, me interesa ${listing.title}. ¿Todavía está disponible?`);
    setRecentlyViewedIds((current) => {
      const next = [listing.id, ...current.filter((id) => id !== listing.id)].slice(0, 5);
      window.localStorage.setItem("coqui-recently-viewed", JSON.stringify(next));
      return next;
    });
  }

  async function submitOffer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedListing || !session || !selectedListing.seller_id) {
      setAuthOpen(true);
      return;
    }
    const amount = Number(offerAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setOfferMessage("Escribe una oferta válida mayor de $0.");
      return;
    }
    if (selectedListing.price && amount > Number(selectedListing.price) * 1.5) {
      setOfferMessage("Revisa la cantidad: parece mucho mayor que el precio publicado.");
      return;
    }
    setBusy(true);
    setOfferMessage("");
    try {
      await createOffer(session.access_token, { listing_id: selectedListing.id, amount });
      const conversationId = await startListingConversation(session.access_token, selectedListing.id);
      const [offers, conversations] = await Promise.all([
        getMyOffers(session.access_token, session.user.id),
        getMyConversations(session.access_token, session.user.id),
      ]);
      setMyOffers(offers);
      setMyConversations(conversations);
      setSelectedConversationId(String(conversationId));
      setOfferMessage(`Oferta de $${amount.toLocaleString("en-US")} enviada y guardada en el chat. El vendedor podrá aceptarla, rechazarla o responder con una contraoferta.`);
      setOfferAmount("");
    } catch (error) {
      setOfferMessage(error instanceof Error ? error.message : "No pudimos enviar la oferta.");
    } finally {
      setBusy(false);
    }
  }

  function toggleComparison(listingId: string) {
    setCompareIds((current) => {
      if (current.includes(listingId)) return current.filter((id) => id !== listingId);
      if (current.length >= 3) {
        setActionMessage("Puedes comparar hasta 3 publicaciones a la vez.");
        return current;
      }
      return [...current, listingId];
    });
  }

  function moveThroughListings(direction: -1 | 1) {
    if (!selectedListing || !filteredListings.length) return;
    const currentIndex = filteredListings.findIndex((listing) => listing.id === selectedListing.id);
    const nextIndex = (currentIndex + direction + filteredListings.length) % filteredListings.length;
    openListing(filteredListings[nextIndex]);
  }

  function openListingEditor(listing: PublicListing) {
    setEditingListing(listing);
    setEditingIsFree(listing.is_free);
    setAccountMessage("");
  }

  async function shareListing(listing: PublicListing) {
    const link = new URL(window.location.href);
    link.search = "";
    link.hash = "";
    link.searchParams.set("listing", listing.id);
    const shareData = {
      title: `${listing.title} | Coqui Ventas`,
      text: `Mira ${listing.title} en Coqui Ventas, el marketplace de Puerto Rico.`,
      url: link.toString(),
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(link.toString());
        setActionMessage("Enlace copiado. ¡Compártelo y riega Coqui Ventas!");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(link.toString());
        setActionMessage("Enlace copiado. ¡Compártelo y riega Coqui Ventas!");
      } catch {
        setActionMessage("No pudimos abrir las opciones para compartir.");
      }
    }
  }

  async function toggleFavorite(listingId: string) {
    if (!session) {
      setSelectedListing(null);
      setAuthOpen(true);
      return;
    }
    const wasFavorite = favoriteIds.has(listingId);
    setFavoriteIds((current) => {
      const next = new Set(current);
      if (wasFavorite) next.delete(listingId);
      else next.add(listingId);
      return next;
    });
    try {
      if (wasFavorite) {
        await removeFavorite(session.access_token, session.user.id, listingId);
        setActionMessage("Se eliminó de tus favoritos.");
      } else {
        await addFavorite(session.access_token, session.user.id, listingId);
        setActionMessage("Guardado en tus favoritos.");
      }
    } catch {
      setFavoriteIds((current) => {
        const next = new Set(current);
        if (wasFavorite) next.add(listingId);
        else next.delete(listingId);
        return next;
      });
      setActionMessage("No pudimos actualizar tus favoritos.");
    }
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setAuthMessage("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    try {
      if (authMode === "update-password") {
        if (!session) throw new Error("El enlace de recuperación venció. Solicita uno nuevo.");
        if (passwordScore < 4) throw new Error("Usa una contraseña más fuerte para proteger tu cuenta.");
        await updatePassword(session.access_token, password);
        setAuthMessage("Contraseña actualizada correctamente. Ya puedes continuar en Coquí Ventas.");
        setSessionNotice("Tu contraseña fue actualizada de forma segura.");
        setAuthPassword("");
        window.setTimeout(() => setAuthOpen(false), 900);
      } else if (authMode === "recovery") {
        await requestPasswordReset(email, window.location.origin);
        setAuthMessage("Si existe una cuenta con ese correo, recibirás un enlace seguro para recuperar el acceso.");
      } else if (authMode === "signup") {
        if (passwordScore < 4) throw new Error("Usa una contraseña más fuerte antes de crear la cuenta.");
        const displayName = String(form.get("display_name") || "").trim();
        if (displayName.length < 2) throw new Error("Escribe el nombre público que verá la comunidad.");
        const created = await signUp(email, password, displayName);
        if (signupAvatarFile && created?.access_token && created?.user?.id) {
          await uploadProfileAvatar(created.access_token, created.user.id, signupAvatarFile);
          setAvatarMessage("Foto de perfil guardada.");
        }
        setAuthMessage(
          signupAvatarFile && !created?.access_token
            ? "Cuenta creada. Confirma tu correo y luego inicia sesión para terminar de guardar tu foto de perfil."
            : "Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.",
        );
        setAuthMode("login");
      } else {
        const next = await signIn(email, password);
        if (signupAvatarFile) {
          try {
            await uploadProfileAvatar(next.access_token, next.user.id, signupAvatarFile);
            setAvatarMessage("Foto de perfil guardada correctamente.");
            setSignupAvatarFile(null);
            if (signupAvatarPreview) URL.revokeObjectURL(signupAvatarPreview);
            setSignupAvatarPreview("");
          } catch (avatarError) {
            setSessionNotice(avatarError instanceof Error ? avatarError.message : "Entraste correctamente, pero no pudimos guardar la foto.");
          }
        }
        setSession(next);
        setSessionNotice("Sesión iniciada de forma segura.");
        window.localStorage.setItem("coqui-session", JSON.stringify(next));
        setAuthOpen(false);
      }
    } catch (error) {
      setAuthMessage(
        error instanceof Error
          ? error.message
          : "No se pudo completar la solicitud.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSignupAvatar(file?: File) {
    if (!file) return;
    setAvatarMessage("");
    if (!file.type.startsWith("image/")) {
      setAvatarMessage("Selecciona una foto en formato de imagen.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setAvatarMessage("La foto original debe pesar menos de 12 MB.");
      return;
    }
    setAvatarPreparing(true);
    try {
      const optimized = await optimizeAvatarImage(file);
      if (signupAvatarPreview) URL.revokeObjectURL(signupAvatarPreview);
      setSignupAvatarFile(optimized);
      setSignupAvatarPreview(URL.createObjectURL(optimized));
      setAvatarMessage("Foto lista: la recortamos y optimizamos sin perder claridad.");
    } catch (error) {
      setAvatarMessage(error instanceof Error ? error.message : "No pudimos preparar esa foto.");
    } finally {
      setAvatarPreparing(false);
    }
  }

  function removeSignupAvatar() {
    if (signupAvatarPreview) URL.revokeObjectURL(signupAvatarPreview);
    setSignupAvatarFile(null);
    setSignupAvatarPreview("");
    setAvatarMessage("Foto eliminada. Puedes escoger otra.");
  }

  async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || passwordChanging) return;
    setSessionNotice("");
    if (!newPasswordValid) {
      setSessionNotice("La contraseña nueva debe tener 10 caracteres, mayúscula, minúscula, número y símbolo.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setSessionNotice("Las contraseñas nuevas no coinciden.");
      return;
    }
    setPasswordChanging(true);
    try {
      await updatePassword(session.access_token, newPassword);
      setNewPassword("");
      setConfirmNewPassword("");
      setSessionNotice("Contraseña actualizada. Tu sesión actual continúa protegida.");
    } catch (error) {
      setSessionNotice(error instanceof Error ? error.message : "No pudimos actualizar la contraseña.");
    } finally {
      setPasswordChanging(false);
    }
  }

  function exportMyAccountData() {
    if (!session || dataExporting) return;
    setDataExporting(true);
    try {
      const exportPayload = {
        exported_at: new Date().toISOString(),
        account: { id: session.user.id, email: session.user.email || null },
        public_profile: myProfile,
        listings: myListings,
        offers: myOffers,
        conversations: myConversations.map(({ messages, ...conversation }) => ({ ...conversation, message_count: messages.length })),
        sale_confirmations: saleConfirmations,
        transactions: myTransactions,
        reviews: myReviews,
        reports: myReports,
        disputes: myDisputes,
        notification_preferences: notificationPreferences,
      };
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `coqui-ventas-mis-datos-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(downloadUrl);
      setSessionNotice("Tu copia privada fue preparada en este dispositivo.");
    } finally {
      setDataExporting(false);
    }
  }

  async function handleLogout() {
    try { if (session) await signOut(session.access_token); }
    finally { clearLocalSession("Sesión cerrada correctamente."); }
  }

  async function handleAccountDeletion() {
    if (!session || accountDeletionConfirmation !== "CERRAR") return;
    setAccountDeletionBusy(true);
    setSessionNotice("");
    try {
      await requestAccountDeletion(session.access_token);
      try { await signOut(session.access_token); } catch { /* La sesión local siempre se elimina. */ }
      setAccountOpen(false);
      clearLocalSession("Tu cuenta fue cerrada y tus datos públicos fueron anonimizados.");
    } catch (error) {
      setSessionNotice(error instanceof Error ? error.message : "No pudimos cerrar tu cuenta.");
    } finally {
      setAccountDeletionBusy(false);
    }
  }

  async function openPublish() {
    if (!session) {
      setAuthOpen(true);
      return;
    }
    if (!guardAccountWrite("session")) {
      setAccountOpen(true);
      setAccountTab("profile");
      return;
    }
    setPublishMessage("");
    setPublishOpen(true);
    if (!categoriesData.length) {
      setCategoriesLoading(true);
      setCategoriesError("");
      try {
        const realCategories = await getCategories();
        setCategoriesData(realCategories);
        if (!realCategories.length) setCategoriesError("No hay categorías activas disponibles en este momento.");
      } catch {
        setCategoriesError("No pudimos cargar las categorías reales. Intenta nuevamente.");
      } finally {
        setCategoriesLoading(false);
      }
    }
  }

  async function reloadMarketplace() {
    setCatalogLoading(true);
    setCatalogError("");
    try {
      setLiveListings(await getPublicListings());
    } catch {
      setLiveListings([]);
      setCatalogError("No pudimos cargar las publicaciones reales. Revisa tu conexión e intenta nuevamente.");
    } finally {
      setCatalogLoading(false);
    }
  }

  async function reloadCategories() {
    setCategoriesLoading(true);
    setCategoriesError("");
    try {
      const realCategories = await getCategories();
      setCategoriesData(realCategories);
      if (!realCategories.length) setCategoriesError("No hay categorías activas disponibles en este momento.");
    } catch {
      setCategoriesData([]);
      setCategoriesError("No pudimos cargar las categorías reales. Intenta nuevamente.");
    } finally {
      setCategoriesLoading(false);
    }
  }

  function detectMunicipality() {
    if (!navigator.geolocation) {
      setPublishMessage("Este dispositivo no permite detectar tu ubicación.");
      return;
    }
    setLocating(true);
    setPublishMessage("Buscando tu pueblo…");
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}&accept-language=es`,
          );
          if (!response.ok) throw new Error();
          const data = await response.json();
          const address = data.address || {};
          const candidates = [
            address.city,
            address.town,
            address.village,
            address.municipality,
            address.county,
          ].filter(Boolean);
          const found = municipalities.find((town) =>
            candidates.some((candidate: string) =>
              normalizeTown(candidate).includes(normalizeTown(town)),
            ),
          );
          if (!found) throw new Error();
          setPublishMunicipality(found);
          setPublishMessage(`Ubicación detectada: ${found}.`);
        } catch {
          setPublishMessage(
            "No pudimos identificar el pueblo automáticamente. Puedes escogerlo en la lista.",
          );
        } finally {
          setLocating(false);
        }
      },
      () => {
        setPublishMessage(
          "No se concedió acceso a la ubicación. Puedes escoger el pueblo en la lista.",
        );
        setLocating(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  async function handlePublish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;
    setBusy(true);
    setPublishMessage("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const enteredPrice = Number(form.get("price"));
    const free = form.get("is_free") === "on" || enteredPrice === 0;
    if (!selectedCategoryId && !free) {
      setPublishMessage("Escoge una categoría para continuar.");
      setBusy(false);
      return;
    }
    const images = form
      .getAll("images")
      .filter((item): item is File => item instanceof File && item.size > 0);
    if (!images.length || images.length > 8) {
      setPublishMessage("Selecciona entre 1 y 8 fotos reales.");
      setBusy(false);
      return;
    }
    if (images.some((file) => file.size > 40 * 1024 * 1024)) {
      setPublishMessage("Una de las fotos es demasiado grande para procesarla. Escoge una foto menor de 40 MB.");
      setBusy(false);
      return;
    }
    try {
      const created = await createListingDraft(
        session.access_token,
        session.user.id,
        {
          category_id: free ? FREE_CATEGORY_ID : selectedCategoryId,
          title: String(form.get("title")),
          description: String(form.get("description")),
          municipality: String(form.get("municipality")),
          price: free ? null : enteredPrice,
          is_free: free,
          is_negotiable: !free && form.get("is_negotiable") === "on",
          condition: String(form.get("condition")),
        },
      );
      const listingId = created[0]?.id;
      if (!listingId) throw new Error("No se pudo crear el borrador.");
      for (let index = 0; index < images.length; index++) {
        setPublishMessage(`Optimizando foto ${index + 1} de ${images.length}…`);
        const optimizedImage = await optimizeListingImage(images[index]);
        if (optimizedImage.size > 10 * 1024 * 1024) {
          throw new Error(`No pudimos reducir suficientemente la foto ${index + 1}. Intenta escoger otra imagen.`);
        }
        await uploadListingImage(
          session.access_token,
          listingId,
          optimizedImage,
          index,
        );
      }
      await publishListing(session.access_token, session.user.id, listingId);
      formElement.reset();
      setSelectedCategoryId("");
      categoryBeforeFree.current = "";
      setIsFreeListing(false);
      setListingPrice("");
      setPublishMunicipality("");
      setSelectedPhotoCount(0);
      setPublishTitle("");
      setPublishDescription("");
      const [refreshedListings, refreshedOwnedListings] = await Promise.all([
        getPublicListings(),
        getMyListings(session.access_token, session.user.id),
      ]);
      setLiveListings(refreshedListings);
      setMyListings(refreshedOwnedListings);
      const justPublished = refreshedListings.find((listing) => listing.id === listingId);
      if (justPublished) {
        setPublishedListing(justPublished);
        setPublishOpen(false);
      } else {
        setPublishMessage("¡Anuncio publicado! Ya está disponible para Puerto Rico.");
      }
    } catch (error) {
      setPublishMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar el borrador.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleEditListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !editingListing) return;
    setBusy(true);
    setAccountMessage("");
    const form = new FormData(event.currentTarget);
    const isFree = form.get("is_free") === "on";
    try {
      await updateListingDetails(session.access_token, session.user.id, editingListing.id, {
        category_id: String(form.get("category_id")),
        title: String(form.get("title")),
        description: String(form.get("description")),
        municipality: String(form.get("municipality")),
        condition: String(form.get("condition")),
        price: isFree ? null : Number(form.get("price")),
        is_free: isFree,
        is_negotiable: !isFree && form.get("is_negotiable") === "on",
      });
      const [publicRows, ownedRows] = await Promise.all([
        getPublicListings(),
        getMyListings(session.access_token, session.user.id),
      ]);
      setLiveListings(publicRows);
      setMyListings(ownedRows);
      setSelectedListing(publicRows.find((listing) => listing.id === editingListing.id) || null);
      setEditingListing(null);
      setActionMessage("Cambios guardados correctamente.");
    } catch (error) {
      setAccountMessage(error instanceof Error ? error.message : "No se pudieron guardar los cambios.");
    } finally {
      setBusy(false);
    }
  }

  async function contactSeller() {
    if (!selectedListing) return;
    if (!session) {
      setSelectedListing(null);
      setAuthOpen(true);
      return;
    }
    if (!contactDraft.trim()) {
      setContactMessage("Escribe un mensaje para el vendedor.");
      return;
    }
    setBusy(true);
    setContactMessage("");
    try {
      const conversationId = await startListingConversation(
        session.access_token,
        selectedListing.id,
      );
      await sendMessage(session.access_token, String(conversationId), contactDraft.trim());
      setContactMessage("¡Mensaje enviado al vendedor!");
      setContactDraft("");
    } catch (error) {
      setContactMessage(
        error instanceof Error
          ? error.message
          : "No se pudo contactar al vendedor.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main>
      <header className="nav-shell">
        <div className="brand-column"><a className="brand" href="#inicio" aria-label="Coqui Ventas, inicio">
          <Image className="brand-mark" src="/branding/coqui-ventas-mark.png" alt="" width={345} height={349} priority unoptimized />
          <span>
            <strong>COQUI</strong> VENTAS<small>Compra · Vende · Confía</small>
          </span>
        </a><div className="language-switch" role="group" aria-label={isEnglish ? "Choose language" : "Escoger idioma"}><button type="button" className={!isEnglish ? "active" : ""} onClick={() => changeLanguage("es")}>ES</button><button type="button" className={isEnglish ? "active" : ""} onClick={() => changeLanguage("en")}>EN</button></div></div>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <a className="nav-item" href="#explorar">{isEnglish ? "Explore" : "Explorar"}</a>
          <button className="nav-item discover-nav-button" onClick={() => openDiscover("today")}>⌖ {isEnglish ? "Discover" : "Descubre"}</button>
          <a className="nav-item" href="#seguridad">{isEnglish ? "Safety" : "Seguridad"}</a>
          {session ? (
            <>
              <button className="nav-item" onClick={() => openJobs("employer")}>💼 {isEnglish ? "I'm an employer" : "Soy patrono"}</button>
              <button className="nav-item notification-button compact-notification" onClick={() => openAccount("notifications")} aria-label={`🔔 Avisos · ${unreadNotificationCount} notificaciones sin leer`}>🔔<span>Avisos</span>{unreadNotificationCount > 0 && <b>{unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}</b>}</button>
              <button className="nav-item account-nav-button" onClick={() => openAccount("profile")}>Mi Coquí{unreadNotificationCount > 0 && <b aria-label={`${unreadNotificationCount} avisos nuevos`}>{unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}</b>}</button>
              <button className="nav-item primary-button" onClick={openPublish}>{isEnglish ? "Post" : "Publicar"}</button>
            </>
          ) : (
            <><button className="nav-item" onClick={() => openJobs("employer")}>💼 {isEnglish ? "I'm an employer" : "Soy patrono"}</button><button className="nav-item" onClick={() => setAuthOpen(true)}>
              {isEnglish ? "Sign in" : "Entrar"}
            </button><button className="nav-item primary-button" onClick={openPublish}>{isEnglish ? "Post" : "Publicar"}</button></>
          )}
        </nav>
      </header>

      <section className="promotion-strip" aria-label="Promociones destacadas" onMouseEnter={() => setPromotionPaused(true)} onMouseLeave={() => setPromotionPaused(false)} onFocusCapture={() => setPromotionPaused(true)} onBlurCapture={() => setPromotionPaused(false)}>
        <div className="promotion-viewport" aria-live="polite">
          {promotionalAds.map((promotion, index) => <article className={`promotion-slide ${promotion.theme} ${index === activePromotion ? "active" : ""}`} aria-hidden={index !== activePromotion} key={promotion.business} style={{backgroundImage: `url(${promotion.image})`}}><div className="promotion-overlay"><span className="promotion-label">Publicidad · Demostración</span><small>{promotion.eyebrow}</small><h2>{promotion.headline}</h2><p>{promotion.offer}</p><div><strong>{promotion.business}</strong><a href="#explorar">{promotion.cta} →</a></div></div></article>)}
        </div>
        <button className="promotion-arrow previous" type="button" onClick={() => setActivePromotion((activePromotion - 1 + promotionalAds.length) % promotionalAds.length)} aria-label="Promoción anterior">‹</button>
        <button className="promotion-arrow next" type="button" onClick={() => setActivePromotion((activePromotion + 1) % promotionalAds.length)} aria-label="Próxima promoción">›</button>
        <div className="promotion-dots" role="group" aria-label="Elegir promoción">{promotionalAds.map((promotion, index) => <button type="button" key={promotion.business} className={index === activePromotion ? "active" : ""} onClick={() => setActivePromotion(index)} aria-label={`Ver promoción de ${promotion.business}`} aria-pressed={index === activePromotion} />)}</div>
        <button className="promotion-pause" type="button" onClick={() => setPromotionPaused((paused) => !paused)} aria-label={promotionPaused ? "Reanudar promociones" : "Pausar promociones"}>{promotionPaused ? "▶" : "Ⅱ"}</button>
      </section>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow">El marketplace hecho para Puerto Rico</span>
          <h1>
            Todo Puerto Rico,
            <br />
            <em>más cerca de ti.</em>
          </h1>
          <p>
            Compra, vende, encuentra empleo y apoya lo nuestro en una comunidad
            moderna, local y segura.
          </p>
          <form className="search-panel" role="search" onSubmit={showSearchResults}>
            <label>
              <span>⌕</span>
              <input
                aria-label="Qué estás buscando"
                placeholder="¿Qué estás buscando?"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
            <label className="location">
              <span>⌖</span>
              <select
                aria-label="Pueblo"
                value={searchMunicipality}
                onChange={(event) => setSearchMunicipality(event.target.value)}
              >
                <option value="">Todo Puerto Rico</option>
                {municipalities.map((town) => (
                  <option key={town}>{town}</option>
                ))}
              </select>
            </label>
            <button type="submit">Buscar</button>
          </form>
          {searchTerm && <button className="clear-search" type="button" onClick={() => setSearchTerm("")}>Limpiar búsqueda ×</button>}
          <div className="hero-quick-actions">
            <span>¿Tienes algo para vender?</span>
            <button type="button" onClick={openPublish}>
              Publicar un artículo
            </button>
          </div>
          <div className="trust-row">
            <span>✓ Publicar es fácil</span>
            <span>✓ Sin comisión por venta</span>
            <span>✓ Comunidad local</span>
          </div>
        </div>
        <article className="hero-jobs-card" aria-label={isEnglish ? "Jobs in Puerto Rico" : "Empleos en Puerto Rico"}>
          <Image src="/featured/empleos.png" alt="Profesionales y trabajadores de Puerto Rico" fill priority sizes="(max-width: 900px) 100vw, 48vw" unoptimized />
          <span className="hero-jobs-overlay" />
          <span className="hero-jobs-badge">💼 {isEnglish ? "Jobs in Puerto Rico" : "Empleos en Puerto Rico"}</span>
          <span className="hero-jobs-copy"><small>{isEnglish ? "Clear, local opportunities" : "Oportunidades claras y locales"}</small><strong>{isEnglish ? "Find the opportunity you're looking for" : "Encuentra el trabajo que estás buscando"}</strong><em>{isEnglish ? "Visible salary · all 78 municipalities" : "Salario visible · en los 78 municipios"}</em><span className="hero-jobs-actions"><button type="button" onClick={() => openJobs("candidate")}>{isEnglish ? "Find jobs" : "Buscar empleos"} <i>→</i></button><button type="button" onClick={() => openJobs("employer")}>{isEnglish ? "Find candidates" : "Buscar candidatos"} <i>→</i></button></span></span>
        </article>
      </section>

      <section className="coqui-discover-home section" id="coqui-descubre">
        <div className="discover-home-copy"><span className="eyebrow">{isEnglish ? "One island · one experience" : "Una isla · una sola experiencia"}</span><h2>{isEnglish ? "Your Puerto Rico, prepared for you" : "Tu Puerto Rico, preparado para ti"}</h2><p>{isEnglish ? "Choose what you need. Coquí brings together what is happening today, your municipality, the profiles you follow and everything near you." : "Escoge lo que necesitas. Coquí reúne lo que hay pa’ hoy, tu municipio, los perfiles que sigues y todo lo que tienes cerca."}</p></div>
        <div className="discover-home-grid">
          <button type="button" onClick={() => openDiscover("today")}><span>☀️</span><b>{isEnglish ? "What's on today?" : "¿Qué hay pa’ hoy?"}</b><small>{isEnglish ? "Plans and opportunities" : "Planes y oportunidades"}</small></button>
          <button type="button" onClick={() => openDiscover("alerts")}><span>🔔</span><b>{isEnglish ? "Coquí Alerts" : "Alertas Coquí"}</b><small>{alertKeywords.length ? `${alertKeywords.length} ${isEnglish ? "active" : "activas"}` : (isEnglish ? "Create your first alert" : "Crea tu primera alerta")}</small></button>
          <button type="button" onClick={() => openDiscover("municipality")}><span>🏘️</span><b>{isEnglish ? "My municipality" : "Mi Municipio"}</b><small>{activeDiscoverTown}</small></button>
          <button type="button" onClick={() => openDiscover("following")}><span>💚</span><b>{isEnglish ? "Following" : "Siguiendo"}</b><small>{followedSellerIds.size} {isEnglish ? "profiles" : "perfiles"}</small></button>
          <button type="button" className="discover-map-entry" onClick={() => openDiscover("map")}><span>⌖</span><b>{isEnglish ? "Unified Coquí map" : "Mapa único Coquí"}</b><small>{isEnglish ? "Listings, jobs, experiences and Huellitas" : "Anuncios, empleos, experiencias y Huellitas"}</small></button>
        </div>
      </section>

      <section className="free-zone huellitas-home-zone" data-interface-language={language} id="huellitas-portada">
        <Image src="/huellitas/launch-banner.png" alt={isEnglish ? "Bella, the official Huellitas de Amor model" : "Bella, modelo oficial de Huellitas de Amor"} fill sizes="(max-width: 620px) 100vw, 1128px" unoptimized />
        <span className="huellitas-home-overlay" aria-hidden="true" />
        <div className="huellitas-home-copy">
          <span className="huellitas-home-badge" aria-hidden="true">🐾</span>
          <span className="eyebrow">{isEnglish ? "Responsible adoption and rescue" : "Adopción y rescate responsable"}</span>
          <h2>Huellitas de Amor</h2>
          <p>{isEnglish ? "Adopt, find a responsible home, or help a rescued animal." : "Adopta, encuentra un hogar responsable o ayuda a un animal rescatado."}</p>
          <button type="button" onClick={openHuellitas}>{isEnglish ? "Meet the Huellitas" : "Conocer las Huellitas"} <i>→</i></button>
        </div>
        <small className="huellitas-launch-label">{isEnglish ? "Official model · Bella" : "Modelo oficial · Bella"}</small>
      </section>

      <section className="section" id="categorias">
        <div className="section-heading">
          <div>
            <span className="eyebrow">{isEnglish ? "Categories" : "Explora a tu manera"}</span>
            <h2>{isEnglish ? "One place for everything local" : "Un lugar para todo lo nuestro"}</h2>
          </div>
          <a href="#explorar">{isEnglish ? "View all" : "Ver todas"} →</a>
        </div>
      </section>
      <section className="category-grid">
        {categories.filter((category) => !["Empleos", "Huellitas de Amor"].includes(category.name)).map((category) => (
          <button
            type="button"
            className={`category-card ${category.tone}`}
            key={category.name}
            onClick={() => category.name === "Huellitas de Amor" ? openHuellitas() : showCategoryListings(category.name)}
            aria-label={`Explorar ${category.name}`}
          >
            <span className={category.name === "Hecho en Puerto Rico" ? "category-local-seal" : ""}>{category.name === "Hecho en Puerto Rico" ? <Image src="/branding/producto-local-verificado.png" alt="Sello Producto Local Verificado de Coquí Ventas" width={40} height={60} unoptimized /> : category.icon}</span>
            <div>
              <h3>{category.name}</h3>
              <p>{category.detail}</p>
            </div>
            <b>→</b>
          </button>
        ))}
      </section>

      <section className="free-zone moved-free-zone" id="gratis">
        <div>
          <span className="free-zone-icon" aria-hidden="true">🎁</span>
          <div>
            <span className="eyebrow">Una sección para compartir</span>
            <h2>Gratis</h2>
            <p>Encuentra artículos que otras personas ofrecen sin costo en Puerto Rico.</p>
          </div>
        </div>
        <button type="button" onClick={showFreeListings}>Ver artículos gratis →</button>
      </section>

      <section className="featured" id="explorar">
        <div className="section section-heading">
          <div>
            <span className="eyebrow light">Selección de hoy</span>
            <h2>Destacados cerca de ti</h2>
          </div>
          <span className="data-label">
            {liveListings.length
              ? `${filteredListings.length} resultado${filteredListings.length === 1 ? "" : "s"}`
              : "Vista demostrativa"}
          </span>
        </div>
        <div className="quick-discovery section" aria-label="Filtros rápidos">
          <button type="button" onClick={() => applyQuickFilter("all")}>Todo</button>
          <button type="button" onClick={() => applyQuickFilter("available")}>Disponible</button>
          <button type="button" onClick={() => applyQuickFilter("pending")}>Pendiente</button>
          <button type="button" onClick={() => applyQuickFilter("free")}>Gratis</button>
          <button type="button" onClick={() => applyQuickFilter("offers")}>Acepta ofertas</button>
          <button type="button" onClick={() => applyQuickFilter("recent")}>Publicado hoy</button>
        </div>
        <div className="filter-panel section" aria-label="Filtros de publicaciones">
          <label>
            <span>Categoría</span>
            <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)}>
              <option value="">Todas</option>
              {categoriesData.map((category) => (
                <option value={category.id} key={category.id}>{category.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Condición</span>
            <select value={filterCondition} onChange={(event) => setFilterCondition(event.target.value)}>
              <option value="">Cualquiera</option>
              {Object.entries(conditionLabels).map(([value, label]) => (
                <option value={value} key={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Estado</span>
            <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)}>
              <option value="">Todos los estados</option>
              <option value="available">Disponible</option>
              <option value="pending">Pendiente</option>
            </select>
          </label>
          <label>
            <span>Publicado</span>
            <select value={dateRange} onChange={(event) => setDateRange(event.target.value as typeof dateRange)}>
              <option value="">Cualquier fecha</option>
              <option value="day">Hoy</option>
              <option value="week">Últimos 7 días</option>
              <option value="month">Últimos 30 días</option>
            </select>
          </label>
          <label>
            <span>Precio mínimo</span>
            <input type="number" inputMode="decimal" min="0" placeholder="$0" value={minimumPrice} onChange={(event) => setMinimumPrice(event.target.value)} />
          </label>
          <label>
            <span>Precio máximo</span>
            <input type="number" inputMode="decimal" min="0" placeholder="Sin límite" value={maximumPrice} onChange={(event) => setMaximumPrice(event.target.value)} />
          </label>
          <label>
            <span>Ordenar</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as typeof sortOrder)}>
              <option value="newest">Más recientes</option><option value="rating-high">★ Mejor reputación</option><option value="reviews-high">★ Más reseñas</option><option value="price-low">Precio: menor a mayor</option><option value="price-high">Precio: mayor a menor</option><option value="free-first">Gratis primero</option><option value="title-az">Título: A–Z</option><option value="title-za">Título: Z–A</option>
            </select>
          </label>
          <div className="filter-toggles" aria-label="Opciones rápidas">
            <label><input type="checkbox" checked={freeOnly} onChange={(event) => setFreeOnly(event.target.checked)} /> Solo Gratis</label>
            <label><input type="checkbox" checked={offersOnly} onChange={(event) => setOffersOnly(event.target.checked)} /> Acepta ofertas</label>
          </div>
          <button type="button" onClick={clearFilters} disabled={!filtersActive}>Limpiar filtros</button>
        </div>
        {invalidPriceRange && <div className="filter-warning section" role="alert">El precio mínimo no puede ser mayor que el precio máximo.</div>}
        {activeFilterCount > 0 && <div className="filter-summary section" role="status" aria-live="polite"><strong>{activeFilterCount} filtro{activeFilterCount === 1 ? " activo" : "s activos"} · {filteredListings.length} resultado{filteredListings.length === 1 ? "" : "s"}</strong><div className="filter-chips">{searchTerm && <button onClick={() => setSearchTerm("")}>Búsqueda: {searchTerm} ×</button>}{searchMunicipality && <button onClick={() => setSearchMunicipality("")}>{searchMunicipality} ×</button>}{filterCategory && <button onClick={() => setFilterCategory("")}>{categoriesData.find(c => c.id === filterCategory)?.name || "Categoría"} ×</button>}{filterCondition && <button onClick={() => setFilterCondition("")}>{conditionLabels[filterCondition]} ×</button>}{filterStatus && <button onClick={() => setFilterStatus("")}>{listingStatusLabels[filterStatus]} ×</button>}{freeOnly && <button onClick={() => setFreeOnly(false)}>Solo Gratis ×</button>}{offersOnly && <button onClick={() => setOffersOnly(false)}>Acepta ofertas ×</button>}{dateRange && <button onClick={() => setDateRange("")}>{dateRange === "day" ? "Hoy" : dateRange === "week" ? "7 días" : "30 días"} ×</button>}{minimumPrice && <button onClick={() => setMinimumPrice("")}>Desde ${minimumPrice} ×</button>}{maximumPrice && <button onClick={() => setMaximumPrice("")}>Hasta ${maximumPrice} ×</button>}{favoritesOnly && <button onClick={() => setFavoritesOnly(false)}>Favoritos ×</button>}{sortOrder !== "newest" && <button onClick={() => setSortOrder("newest")}>Orden: {listingSortLabels[sortOrder]} ×</button>}</div></div>}
        <div className="results-toolbar section">
          <span>Mostrando {Math.min(visibleCount, filteredListings.length)} de {filteredListings.length}</span>
          <div aria-label="Vista de resultados"><button type="button" className={viewMode === "grid" ? "active" : ""} onClick={() => setViewMode("grid")} aria-label="Vista en tarjetas">▦ Tarjetas</button><button type="button" className={viewMode === "compact" ? "active" : ""} onClick={() => setViewMode("compact")} aria-label="Vista compacta">☷ Compacta</button></div>
        </div>
        <div className={`listing-grid section ${viewMode === "compact" ? "compact-view" : ""}`}>
          {catalogLoading ? (
            <div className="empty-results marketplace-state" role="status">
              <span>⌛</span><h3>Cargando publicaciones reales…</h3><p>Estamos conectando con el Marketplace de Coquí Ventas.</p>
            </div>
          ) : catalogError ? (
            <div className="empty-results marketplace-state error" role="alert">
              <span>!</span><h3>No pudimos cargar el Marketplace</h3><p>{catalogError}</p><button type="button" onClick={() => void reloadMarketplace()}>Intentar nuevamente</button>
            </div>
          ) : liveListings.length ? (
            filteredListings.length ? visibleListings.map((listing, index) => (
                <article
                  className={`listing-card live-card status-${listing.status || "available"} ${listing.is_featured ? "is-featured" : ""}`}
                  key={listing.id}
                  onClick={() => openListing(listing)}
                  onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openListing(listing); } }}
                  tabIndex={0}
                  role="button"
                >
                  <div
                    className={`listing-image ${["mint", "sand", "leaf", "peach"][index % 4]}`}
                  >
                    {listing.image_urls[0] ? (
                      <Image src={listing.image_urls[0]} alt={listing.title} width={900} height={675} unoptimized />
                    ) : (
                      <span>📦</span>
                    )}
                    <b>
                      {listing.is_featured ? "Destacado · " : ""}{listingStatusLabels[listing.status || "available"]}
                      {listing.status === "available" && listing.is_negotiable ? " · Negociable" : ""}
                    </b>
                    <div className="listing-actions">
                      <button
                        className={favoriteIds.has(listing.id) ? "saved" : ""}
                        data-tooltip={favoriteIds.has(listing.id) ? "Quitar favorito" : "Favorito"}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleFavorite(listing.id);
                        }}
                        aria-label={favoriteIds.has(listing.id) ? `Eliminar ${listing.title} de favoritos` : `Guardar ${listing.title}`}
                      >
                        {favoriteIds.has(listing.id) ? "♥" : "♡"}
                      </button>
                      <button
                        data-tooltip="Compartir"
                        onClick={(event) => {
                          event.stopPropagation();
                          shareListing(listing);
                        }}
                        aria-label={`Compartir ${listing.title}`}
                      >
                        ↗
                      </button>
                      <button
                        className={compareIds.includes(listing.id) ? "saved" : ""}
                        data-tooltip={compareIds.includes(listing.id) ? "Quitar comparación" : "Comparar"}
                        onClick={(event) => { event.stopPropagation(); toggleComparison(listing.id); }}
                        aria-label={compareIds.includes(listing.id) ? `Quitar ${listing.title} de comparación` : `Comparar ${listing.title}`}
                      >≍</button>
                    </div>
                  </div>
                  <div className="listing-body">
                    <h3>{listing.title}</h3>
                    <strong>
                      {listing.is_free
                        ? "Gratis"
                        : `$${Number(listing.price).toLocaleString("en-US")}`}
                    </strong>
                    <p>⌖ {listing.municipality}, Puerto Rico</p>
                    <button type="button" className="listing-seller-line" onClick={(event) => { event.stopPropagation(); if (listing.seller_id) setPublicSellerId(listing.seller_id); }} aria-label={`Ver perfil público de ${listing.seller_display_name || "vendedor"}`}><span>{listing.seller_avatar_url ? <Image src={listing.seller_avatar_url} alt="" width={56} height={56} unoptimized /> : (listing.seller_display_name || "CV").slice(0, 1).toUpperCase()}</span><b>{listing.seller_display_name || "Miembro de Coquí Ventas"}</b><small className="listing-seller-rating verified" aria-label={listing.seller_rating ? `${listing.seller_rating.toFixed(1)} de 5 estrellas, ${listing.seller_review_count} reseñas verificadas` : "Vendedor nuevo sin reseñas"} title="Reseñas de transacciones verificables">{listing.seller_rating ? <>★ {listing.seller_rating.toFixed(1)} · {listing.seller_review_count} reseña{listing.seller_review_count === 1 ? "" : "s"}</> : <>☆ Nuevo · sin reseñas</>}</small><i>Ver perfil</i></button>
                    <div className="card-transparency">
                      <span>{categoriesData.find((category) => category.id === listing.category_id)?.name || "Marketplace"}</span>
                      <span>{conditionLabels[listing.condition] || listing.condition}</span>
                      <span>{listing.image_urls.length} foto{listing.image_urls.length === 1 ? "" : "s"}</span>
                    </div>
                    <small>{listingAge(listing.created_at)}</small>
                  </div>
                </article>
              )) : (
                <div className="empty-results">
                  <span>🔎</span>
                  <h3>No encontramos publicaciones con esos filtros</h3>
                  <p>Prueba otro pueblo, amplía el precio o limpia los filtros.</p>
                  <button type="button" onClick={clearFilters}>Ver todas las publicaciones</button>
                </div>
              )
            ) : (
              <div className="empty-results marketplace-state">
                <span>📦</span><h3>El Marketplace está listo para su primera publicación</h3><p>No mostraremos anuncios simulados. Cuando alguien publique, aparecerá aquí de inmediato.</p><button type="button" onClick={() => void openPublish()}>Publicar un artículo</button>
              </div>
            )}
        </div>
        {filteredListings.length > visibleCount && <div className="load-more section"><button type="button" onClick={() => setVisibleCount((count) => count + 8)}>Ver 8 publicaciones más</button><span>{filteredListings.length - visibleCount} todavía disponibles</span></div>}
      </section>

      <aside className="inline-promotion section" aria-label="Espacio publicitario integrado">
        <div className="inline-promotion-image" style={{backgroundImage: `url(${promotionalAds[(activePromotion + 2) % promotionalAds.length].image})`}} aria-hidden="true" />
        <div className="inline-promotion-copy">
          <span>Publicidad · Demostración</span>
          <small>{promotionalAds[(activePromotion + 2) % promotionalAds.length].business}</small>
          <h2>{promotionalAds[(activePromotion + 2) % promotionalAds.length].headline}</h2>
          <p>{promotionalAds[(activePromotion + 2) % promotionalAds.length].offer}</p>
          <div><a href="#explorar">{promotionalAds[(activePromotion + 2) % promotionalAds.length].cta} →</a><button type="button" onClick={() => setSmallAdInfoOpen((open) => !open)} aria-expanded={smallAdInfoOpen}>¿Por qué veo esto?</button></div>
          {smallAdInfoOpen && <p className="inline-ad-explanation" role="status">Este es un espacio promocional de demostración. No usa tu información privada ni cambia el orden de tus resultados.</p>}
        </div>
        <button className="advertise-with-us" type="button" onClick={() => setAdvertisingInfoOpen(true)}>¿Tienes un negocio?<b>Anúnciate en Coquí</b></button>
      </aside>

      {recentlyViewed.length > 0 && <section className="recent-strip section" aria-labelledby="recent-title"><div><span className="eyebrow">Continúa explorando</span><h2 id="recent-title">Vistos recientemente</h2></div><div>{recentlyViewed.map((listing) => <button type="button" key={listing.id} onClick={() => openListing(listing)}><span>{listing.image_urls[0] ? <Image src={listing.image_urls[0]} alt="" width={112} height={84} unoptimized /> : "📦"}</span><b>{listing.title}</b><small>{listing.is_free ? "Gratis" : `$${Number(listing.price).toLocaleString("en-US")}`}</small></button>)}</div><button className="clear-recent" type="button" onClick={() => { setRecentlyViewedIds([]); window.localStorage.removeItem("coqui-recently-viewed"); }}>Borrar historial de este dispositivo</button></section>}

      <section className="safety section" id="seguridad">
        <div>
          <span className="shield">✓</span>
          <span className="eyebrow">Compra · Vende · Confía</span>
          <h2>Tu tranquilidad es parte del trato.</h2>
          <p>
            Perfiles, reputación transparente y herramientas para ayudarte a
            coordinar encuentros más seguros.
          </p>
        </div>
        <ul>
          <li>
            <b>Fotos reales</b>
            <span>Publicaciones claras y transparentes.</span>
          </li>
          <li>
            <b>Reputación verificable</b>
            <span>Reseñas luego de transacciones reales.</span>
          </li>
          <li>
            <b>Encuentros seguros</b>
            <span>Recomendaciones y puntos públicos.</span>
          </li>
        </ul>
      </section>

      <footer>
        <div className="brand footer-brand">
          <Image className="brand-mark" src="/branding/coqui-ventas-mark.png" alt="" width={345} height={349} unoptimized />
          <span>
            <strong>COQUI</strong> VENTAS<small>Compra · Vende · Confía</small>
          </span>
        </div>
        <p>Hecho con orgullo para Puerto Rico 🇵🇷</p>
        {session && <button className="ghost-button" type="button" onClick={() => setDemoOpen(true)}>⇄ Probar comprador</button>}
        <span>© 2026 Coqui Ventas LLC</span>
      </footer>
      {demoOpen && (
        <div className="modal-backdrop modal-priority" onMouseDown={(event) => event.target === event.currentTarget && setDemoOpen(false)}>
          <section className="auth-modal demo-lab" role="dialog" aria-modal="true" aria-labelledby="demo-profile-title">
            <button className="modal-close" onClick={() => setDemoOpen(false)} aria-label="Cerrar prueba">×</button>
            <span className="eyebrow">Laboratorio de prueba</span>
            <h2 id="demo-profile-title">Vendedor ↔ Comprador</h2>
            <p>Prueba la conversación desde ambos lados sin enviarte mensajes a ti mismo.</p>
            <div className="demo-role-switch" role="group" aria-label="Cambiar perfil de demostración">
              <button type="button" className={demoRole === "seller" ? "active" : ""} onClick={() => setDemoRole("seller")} aria-pressed={demoRole === "seller"}><span>JR</span><b>Jayson</b><small>Vendedor</small></button>
              <button type="button" className={demoRole === "buyer" ? "active" : ""} onClick={() => setDemoRole("buyer")} aria-pressed={demoRole === "buyer"}><span>MC</span><b>María</b><small>Compradora demo</small></button>
            </div>
            <div className="demo-current-role" role="status">Ahora respondes como <b>{demoRole === "seller" ? "Jayson · Vendedor" : "María · Compradora demo"}</b></div>
            <article className="demo-listing-summary"><span>Artículo de prueba</span><div><b>Consola portátil</b><strong>$95</strong></div><small>Disponible · San Juan · Acepta ofertas</small></article>
            <section className="demo-offer-panel" aria-label="Oferta de demostración">
              <div><b>Negociación</b><span className={`demo-offer-status status-${demoOfferStatus}`}>{demoOfferStatus === "none" ? "Sin oferta" : demoOfferStatus === "pending" ? "Oferta pendiente" : demoOfferStatus === "countered" ? "Contraoferta" : demoOfferStatus === "accepted" ? "Aceptada" : "Rechazada"}</span></div>
              {demoRole === "buyer" && demoOfferStatus === "none" && <div className="demo-offer-entry"><label>$ <input aria-label="Cantidad de oferta demo" type="number" min="1" value={demoOfferAmount} onChange={(event) => setDemoOfferAmount(event.target.value)} /></label><button type="button" onClick={() => Number(demoOfferAmount) > 0 && recordDemoOfferActivity("buyer", `Oferta enviada · $${Number(demoOfferAmount).toLocaleString("en-US")}`, "pending")}>Enviar oferta</button></div>}
              {demoRole === "buyer" && demoOfferStatus === "pending" && <button type="button" className="demo-secondary" onClick={() => recordDemoOfferActivity("buyer", `Oferta retirada · $${Number(demoOfferAmount || 0).toLocaleString("en-US")}`, "none")}>Retirar mi oferta de ${Number(demoOfferAmount || 0).toLocaleString("en-US")}</button>}
              {demoRole === "seller" && demoOfferStatus === "pending" && <><div className="demo-offer-actions"><strong>Oferta de María: ${Number(demoOfferAmount || 0).toLocaleString("en-US")}</strong><button type="button" onClick={() => recordDemoOfferActivity("seller", `Oferta aceptada · $${Number(demoOfferAmount || 0).toLocaleString("en-US")}`, "accepted")}>Aceptar</button><button type="button" className="demo-secondary" onClick={() => recordDemoOfferActivity("seller", `Oferta rechazada · $${Number(demoOfferAmount || 0).toLocaleString("en-US")}`, "rejected")}>Rechazar</button></div><div className="demo-counter-entry"><label>Tu contraoferta $ <input aria-label="Cantidad de contraoferta demo" type="number" min="1" value={demoCounterAmount} onChange={(event) => setDemoCounterAmount(event.target.value)} /></label><button type="button" onClick={() => Number(demoCounterAmount) > 0 && recordDemoOfferActivity("seller", `Contraoferta enviada · $${Number(demoCounterAmount).toLocaleString("en-US")}`, "countered")}>Hacer contraoferta</button></div></>}
              {demoRole === "buyer" && demoOfferStatus === "countered" && <div className="demo-counter-response"><strong>Jayson propone ${Number(demoCounterAmount || 0).toLocaleString("en-US")}</strong><div><button type="button" onClick={() => recordDemoOfferActivity("buyer", `Contraoferta aceptada · $${Number(demoCounterAmount || 0).toLocaleString("en-US")}`, "accepted")}>Aceptar contraoferta</button><button type="button" className="demo-secondary" onClick={() => recordDemoOfferActivity("buyer", `Contraoferta rechazada · $${Number(demoCounterAmount || 0).toLocaleString("en-US")}`, "rejected")}>Rechazar</button></div></div>}
              {demoRole === "seller" && demoOfferStatus === "countered" && <div className="demo-counter-response"><strong>Contraoferta enviada: ${Number(demoCounterAmount || 0).toLocaleString("en-US")}</strong><small>Esperando respuesta de María.</small><button type="button" className="demo-secondary" onClick={() => recordDemoOfferActivity("seller", `Contraoferta retirada · vuelve la oferta de $${Number(demoOfferAmount || 0).toLocaleString("en-US")}`, "pending")}>Retirar contraoferta</button></div>}
              {demoOfferStatus !== "none" && demoOfferStatus !== "pending" && demoOfferStatus !== "countered" && <small>La publicación continúa Disponible hasta que el vendedor decida cambiarla.</small>}
            </section>
            <section className="demo-chat" aria-label="Conversación de demostración">
              <header><b>{demoRole === "seller" ? "Conversación con María" : "Conversación con Jayson"}</b><small>{demoMessages.length} mensajes</small></header>
              <div className="demo-message-history">{demoMessages.map((message) => <p className={`${message.role === demoRole ? "mine" : "theirs"}${message.activity ? " offer-activity" : ""}`} key={message.id}><small>{message.activity ? "🤝 Negociación" : message.role === "seller" ? "Vendedor" : "Compradora"}</small>{message.body}</p>)}</div>
              <form onSubmit={sendDemoMessage}><input value={demoDraft} maxLength={500} onChange={(event) => setDemoDraft(event.target.value)} placeholder={`Responder como ${demoRole === "seller" ? "vendedor" : "compradora"}…`} aria-label="Mensaje de demostración" /><button type="submit">Enviar</button></form>
            </section>
            <div className="demo-lab-footer"><span>🧪 Esta prueba es privada y no cambia publicaciones reales.</span><button type="button" onClick={resetDemoConversation}>Reiniciar prueba</button></div>
          </section>
        </div>
      )}
      {accountOpen && session && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => event.target === event.currentTarget && setAccountOpen(false)}
        >
          <section className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-title">
            <button className="modal-close" onClick={() => setAccountOpen(false)} aria-label="Cerrar">×</button>
            <div className="account-heading">
              <Image className="brand-mark account-logo" src="/branding/coqui-ventas-mark.png" alt="" width={345} height={349} unoptimized />
              <span className="eyebrow">Tu espacio en Coqui Ventas</span>
              <h2 id="account-title">Mi Coqui</h2>
              <p>{session.user.email}</p>
              <div className="account-sync" role="status" aria-live="polite">
                <span className={accountSyncing ? "sync-dot active" : "sync-dot"} aria-hidden="true" />
                <span>{accountSyncing ? "Actualizando actividad…" : accountLastUpdated ? `Actualizado ${accountLastUpdated.toLocaleTimeString("es-PR", { hour: "numeric", minute: "2-digit" })}` : "Preparando tu actividad"}</span>
                <button type="button" onClick={refreshAccountNow} disabled={accountSyncing}>{accountSyncing ? "Actualizando…" : "Actualizar ahora"}</button>
                <label><input type="checkbox" checked={accountAutoRefresh} onChange={(event) => setAccountAutoRefresh(event.target.checked)} /> Actualización automática</label>
              </div>
            </div>
            <div className="account-tabs" role="tablist">
              <button className={accountTab === "profile" ? "active" : ""} onClick={() => setAccountTab("profile")}>Perfil</button>
              <button className={accountTab === "listings" ? "active" : ""} onClick={() => setAccountTab("listings")}>Mis publicaciones ({myListings.length})</button>
              <button className={accountTab === "offers" ? "active" : ""} onClick={() => setAccountTab("offers")}>Ofertas ({myOffers.filter((offer) => offer.status === "pending").length})</button>
              <button className={accountTab === "sales" ? "active" : ""} onClick={() => setAccountTab("sales")}>Ventas ({saleConfirmations.filter((confirmation) => confirmation.status === "seller_submitted").length})</button>
              <button className={accountTab === "messages" ? "active" : ""} onClick={() => setAccountTab("messages")}>Mensajes ({myConversations.length})</button>
              <button className={accountTab === "notifications" ? "active" : ""} onClick={() => setAccountTab("notifications")}>Avisos ({unreadNotificationCount})</button>
              <button className={accountTab === "safety" ? "active" : ""} onClick={() => setAccountTab("safety")}>Seguridad ({myReports.length + myDisputes.length})</button>
              {adminDashboard && <button className={accountTab === "admin" ? "active" : ""} onClick={() => setAccountTab("admin")}>Coquí Admin</button>}
            </div>

            {accountTab === "profile" && (
              <form className="profile-form" onSubmit={handleProfileSave}>
                <div className="privacy-guide">Tu dirección exacta, documentos, teléfono privado e información interna de verificación nunca se muestran públicamente aquí.</div>
                <div className="profile-completion"><div><b>Perfil {profileCompletion === 3 ? "completo" : "en progreso"}</b><span>{profileCompletion} de 3 datos públicos añadidos</span></div><div><i style={{width: `${profileCompletion / 3 * 100}%`}} /></div>{profileCompletion < 3 && <small>Completa nombre, pueblo y presentación para dar más contexto a compradores.</small>}</div>
                <div className="profile-privacy-summary" aria-label="Resumen de privacidad del perfil"><article><span>Visible</span><b>Nombre, pueblo y presentación</b><small>Solo lo que decides escribir aquí.</small></article><article><span>Privado</span><b>Correo, teléfono y dirección exacta</b><small>No aparecen en tu perfil público.</small></article><article><span>Protegido</span><b>Documentos y verificaciones internas</b><small>Coquí Admin los maneja de forma separada.</small></article></div>
                <section className={`account-status-center status-${accountStatus}`} aria-label="Estado y verificaciones de la cuenta">
                  <header><div><span>Estado de la cuenta</span><h3>{accountStatusDetails.label}</h3><p>{accountStatusDetails.detail}</p></div><i aria-hidden="true">{accountStatus === "active" ? "✓" : accountStatus === "restricted" ? "!" : accountStatus === "suspended" ? "⏸" : "×"}</i></header>
                  {!accountCanWrite && <div className="account-readonly-note" role="status">Tu información e historial permanecen disponibles para consulta. Coquí Ventas bloquea publicaciones, cambios y mensajes nuevos mientras este estado esté vigente.</div>}
                  <div className="verification-statuses" aria-label="Verificaciones administradas por Coquí Ventas">
                    <article className={phoneVerified ? "verified" : "pending"}><span aria-hidden="true">{phoneVerified ? "✓" : "○"}</span><div><b>Teléfono</b><small>{phoneVerified ? "Verificado" : "No verificado"}</small></div></article>
                    <article className={identityVerified ? "verified" : "pending"}><span aria-hidden="true">{identityVerified ? "✓" : "○"}</span><div><b>Identidad</b><small>{identityVerified ? "Verificada" : "No verificada"}</small></div></article>
                  </div>
                  <p className="verification-privacy-note">Estas verificaciones ayudan a proteger la comunidad. El usuario no puede aprobarlas ni cambiar el estado de su propia cuenta; solo Coquí Admin puede hacerlo después de una revisión.</p>
                </section>
                <section className="profile-avatar-editor" aria-label="Foto de perfil">
                  <div className="profile-avatar-large">{myProfile.avatar_url ? <Image src={myProfile.avatar_url} alt="Tu foto de perfil actual" width={160} height={160} unoptimized /> : <span>{publicProfileInitials || "CV"}</span>}</div>
                  <div><span>Foto de perfil</span><h3>{myProfile.avatar_url ? "Cambia tu foto cuando quieras" : "Añade una foto para que te reconozcan"}</h3><p>La recortamos y optimizamos automáticamente. No subas documentos ni información privada.</p><div className="profile-avatar-actions"><label className="avatar-file-button">{profileAvatarBusy ? "Procesando…" : myProfile.avatar_url ? "Cambiar foto" : "Agregar foto"}<input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" disabled={profileAvatarBusy || !accountCanWrite} onChange={(event) => { void handleProfileAvatarChange(event.target.files?.[0]); event.currentTarget.value = ""; }} /></label>{myProfile.avatar_url && <button type="button" className="remove-avatar-button" disabled={profileAvatarBusy || !accountCanWrite} onClick={handleProfileAvatarRemove}>Quitar foto</button>}</div></div>
                  {profileAvatarMessage && <small className="avatar-message" role="status">{profileAvatarMessage}</small>}
                </section>
                <section className="public-profile-preview"><header><div><span>Vista pública</span><b>Así te verá la comunidad</b></div><button type="button" onClick={() => setProfilePreviewOpen((open) => !open)} aria-expanded={profilePreviewOpen}>{profilePreviewOpen ? "Ocultar vista" : "Ver vista"}</button></header>{profilePreviewOpen && <div className="profile-preview-card"><span className="profile-preview-avatar">{myProfile.avatar_url ? <Image src={myProfile.avatar_url} alt="Foto de perfil" width={96} height={96} unoptimized /> : publicProfileInitials || "CV"}</span><div><h3>{myProfile.display_name.trim() || "Tu nombre público"}</h3><p>{myProfile.municipality || "Pueblo no mostrado"}</p><small>{myProfile.bio.trim() || "Tu presentación aparecerá aquí cuando la escribas."}</small></div><i>Perfil de la comunidad</i></div>}</section>
                <label>
                  Nombre público
                  <input required minLength={2} maxLength={80} value={myProfile.display_name} onChange={(event) => setMyProfile({ ...myProfile, display_name: event.target.value })} placeholder="Como quieres aparecer" aria-describedby="public-name-tip" />
                  <small id="public-name-tip">Usa el nombre con el que deseas que compradores y vendedores te reconozcan.</small>
                </label>
                <label>
                  Pueblo
                  <select value={myProfile.municipality} onChange={(event) => setMyProfile({ ...myProfile, municipality: event.target.value })}>
                    <option value="">No mostrar</option>
                    {municipalities.map((town) => <option key={town} value={town}>{town}</option>)}
                  </select>
                </label>
                <label>
                  Sobre mí
                  <textarea maxLength={500} value={myProfile.bio} onChange={(event) => setMyProfile({ ...myProfile, bio: event.target.value })} placeholder="Cuéntale algo breve a la comunidad…" />
                  <small className="profile-character-count">{myProfile.bio.length}/500</small>
                </label>
                <div className="profile-safety-checklist"><b>Antes de guardar</b><span>✓ No incluyas teléfono, dirección exacta ni datos bancarios.</span><span>✓ No publiques documentos, contraseñas o códigos.</span><span>✓ Mantén la presentación breve, respetuosa y útil.</span></div>
                <section className="session-card" aria-label="Seguridad de la sesión"><div><span>Cuenta privada</span><b>{session.user.email}</b><small>Tu correo se usa para iniciar sesión y no se muestra en el perfil público.</small></div><div><b>Conexión protegida</b><small>Coquí Ventas renueva tu sesión automáticamente antes de que expire.</small><button type="button" onClick={renewCurrentSession} disabled={sessionRefreshing}>{sessionRefreshing ? "Renovando…" : "Renovar sesión ahora"}</button></div><button type="button" className="session-signout" onClick={handleLogout}>Cerrar sesión en este dispositivo</button></section>
                <section className="account-security-tools" aria-label="Herramientas de seguridad de la cuenta">
                  <div className="security-tool-heading"><div><span>Seguridad</span><h3>Cambiar contraseña</h3><p>Usa una combinación nueva que no utilices en otras páginas.</p></div><i aria-hidden="true">🔐</i></div>
                  <form onSubmit={handlePasswordChange}>
                    <label>Nueva contraseña<input type="password" autoComplete="new-password" minLength={10} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required placeholder="10 caracteres o más" /></label>
                    <label>Confirmar contraseña<input type="password" autoComplete="new-password" minLength={10} value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} required placeholder="Escríbela nuevamente" /></label>
                    <div className="new-password-rules" aria-live="polite"><span className={newPassword.length >= 10 ? "met" : ""}>10+ caracteres</span><span className={/[A-Z]/.test(newPassword) ? "met" : ""}>Mayúscula</span><span className={/[a-z]/.test(newPassword) ? "met" : ""}>Minúscula</span><span className={/\d/.test(newPassword) ? "met" : ""}>Número</span><span className={/[^A-Za-z0-9]/.test(newPassword) ? "met" : ""}>Símbolo</span></div>
                    <button type="submit" disabled={passwordChanging || !newPassword || !confirmNewPassword}>{passwordChanging ? "Actualizando…" : "Actualizar contraseña"}</button>
                  </form>
                  <div className="account-data-export"><div><b>Tu información, bajo tu control</b><small>Descarga una copia privada de tu perfil y actividad. Los mensajes se resumen por cantidad para no duplicar conversaciones sensibles.</small></div><button type="button" onClick={exportMyAccountData} disabled={dataExporting}>{dataExporting ? "Preparando…" : "Descargar mis datos"}</button></div>
                  <div className="device-privacy-control"><div><b>Privacidad de este dispositivo</b><small>Elimina búsquedas recientes, publicaciones vistas y la lista de comparación. No borra tu cuenta, publicaciones, mensajes ni transacciones.</small></div><button type="button" onClick={clearPrivateDeviceData}>{deviceDataCleared ? "Datos locales borrados" : "Borrar actividad del dispositivo"}</button></div>
                  <div className="account-danger-zone"><div><b>Cerrar y anonimizar mi cuenta</b><small>Oculta tus publicaciones activas y elimina nombre, foto, pueblo y presentación. Conservamos ventas, mensajes y reportes necesarios para seguridad e historial.</small></div>{accountDeletionOpen ? <div className="account-danger-confirm"><label>Escribe CERRAR para confirmar<input value={accountDeletionConfirmation} onChange={(event) => setAccountDeletionConfirmation(event.target.value.toUpperCase())} autoComplete="off" /></label><button type="button" disabled={accountDeletionBusy || accountDeletionConfirmation !== "CERRAR"} onClick={handleAccountDeletion}>{accountDeletionBusy ? "Cerrando…" : "Cerrar definitivamente"}</button><button type="button" onClick={() => { setAccountDeletionOpen(false); setAccountDeletionConfirmation(""); }}>Cancelar</button></div> : <button type="button" onClick={() => setAccountDeletionOpen(true)}>Solicitar cierre</button>}</div>
                </section>
                {sessionNotice && <div className="session-notice" role="status">{sessionNotice}</div>}
                <button className="auth-submit" disabled={busy || !accountCanWrite}>{busy ? "Guardando…" : accountCanWrite ? "Guardar perfil" : "Cuenta en modo consulta"}</button>
              </form>
            )}

            {accountTab === "admin" && adminDashboard && (
              <section className="coqui-admin-panel" aria-label="Centro de Coquí Admin">
                <header><div><span>Acceso protegido</span><h3>Centro de revisión</h3><p>Resumen operativo sin exponer documentos ni conversaciones privadas.</p></div><b>Coquí Admin</b></header>
                <div className="coqui-admin-grid">
                  <article><b>{adminDashboard.reports_open}</b><span>Reportes abiertos</span></article>
                  <article><b>{adminDashboard.disputes_open}</b><span>Disputas abiertas</span></article>
                  <article><b>{adminDashboard.appeals_open}</b><span>Apelaciones</span></article>
                  <article><b>{adminDashboard.rescue_verifications_pending}</b><span>Huellitas por verificar</span></article>
                  <article><b>{adminDashboard.accounts_restricted}</b><span>Cuentas restringidas</span></article>
                  <article><b>{adminDashboard.notifications_pending}</b><span>Avisos pendientes o fallidos</span></article>
                </div>
                <p className="coqui-admin-note">Las acciones administrativas sensibles permanecen separadas y requieren autorización en cada solicitud.</p>
              </section>
            )}

            {accountTab === "listings" && (
              <div className="owned-listings">
                <div className="status-guide"><b>Control del vendedor</b><span>Disponible: listo para vender.</span><span>Pendiente: estás coordinando; seguirá visible.</span><span>Pausado: se oculta temporalmente.</span><span>Vendido: úsalo únicamente al completar una venta verificable.</span><strong>Tu historial es tuyo: las publicaciones vendidas dejan de mostrarse al público después de 24 horas, pero no se borran de Mi Coquí.</strong></div>
                <div className="seller-summary" aria-label="Resumen de publicaciones"><button type="button" className={myListingFilter === "all" ? "active" : ""} onClick={() => setMyListingFilter("all")}><b>{myListings.length}</b><span>Total</span></button><button type="button" className={myListingFilter === "available" ? "active" : ""} onClick={() => setMyListingFilter("available")}><b>{ownedCounts.available || 0}</b><span>Disponibles</span></button><button type="button" className={myListingFilter === "pending" ? "active" : ""} onClick={() => setMyListingFilter("pending")}><b>{ownedCounts.pending || 0}</b><span>Pendientes</span></button><button type="button" className={myListingFilter === "paused" ? "active" : ""} onClick={() => setMyListingFilter("paused")}><b>{ownedCounts.paused || 0}</b><span>Pausadas</span></button><button type="button" className={myListingFilter === "sold" ? "active" : ""} onClick={() => setMyListingFilter("sold")}><b>{ownedCounts.sold || 0}</b><span>Vendidas</span></button></div>
                <div className="owned-toolbar"><label><span>Buscar</span><input value={myListingSearch} onChange={(event) => setMyListingSearch(event.target.value)} placeholder="Título o pueblo" /></label><label><span>Mostrar</span><select value={myListingFilter} onChange={(event) => setMyListingFilter(event.target.value as typeof myListingFilter)}><option value="all">Todas</option><option value="available">Disponibles</option><option value="pending">Pendientes</option><option value="paused">Pausadas</option><option value="sold">Vendidas</option><option value="draft">Borradores</option></select></label><label><span>Ordenar</span><select value={myListingSort} onChange={(event) => setMyListingSort(event.target.value as typeof myListingSort)}><option value="newest">Actualizadas recientemente</option><option value="title">Título A–Z</option><option value="price">Precio mayor primero</option></select></label></div>
                <div className="owned-result-count">{filteredMyListings.length} publicación{filteredMyListings.length === 1 ? "" : "es"} en esta vista</div>
                {myListings.length && filteredMyListings.length ? filteredMyListings.map((listing) => (
                  <article className="owned-listing" key={listing.id}>
                    <div className="owned-thumb">{listing.image_urls[0] ? <Image src={listing.image_urls[0]} alt="" width={112} height={84} unoptimized /> : "📦"}</div>
                    <div>
                      <h3>{listing.title}</h3>
                      <p>{listing.is_free ? "Gratis" : `$${Number(listing.price).toLocaleString("en-US")}`} · {listing.municipality}</p>
                      <div className="owned-facts"><span>{listingStatusLabels[listing.status || "draft"] || "Borrador"}</span><span>{conditionLabels[listing.condition] || listing.condition}</span><span>{listing.image_urls.length} foto{listing.image_urls.length === 1 ? "" : "s"}</span>{listing.status === "sold" && <span>Guardado en tu historial</span>}</div>
                      <div className="owned-actions">
                        <button type="button" onClick={() => { setAccountOpen(false); openListing(listing); }}>Ver</button>
                        <button type="button" onClick={() => { setAccountOpen(false); openListingEditor(listing); }}>Editar</button>
                        <button type="button" onClick={() => shareListing(listing)}>Compartir</button>
                        {listing.status === "available" && <button type="button" onClick={() => openListingStatusChange(listing, "pending")}>Marcar pendiente</button>}
                        {listing.status === "paused" && <button type="button" onClick={() => openListingStatusChange(listing, "available")}>Reactivar</button>}
                      </div>
                    </div>
                    <label>
                      Estado
                      <select value={listing.status || "available"} disabled={busy || listing.status === "draft"} onChange={(event) => openListingStatusChange(listing, event.target.value as "available" | "pending" | "sold" | "paused")}>
                        {listing.status === "draft" && <option value="draft">Borrador</option>}
                        <option value="available">Disponible</option>
                        <option value="pending">Pendiente</option>
                        <option value="paused">Pausado</option>
                        <option value="sold">Vendido</option>
                      </select>
                    </label>
                  </article>
                )) : myListings.length ? <div className="account-empty"><span>🔎</span><h3>No hay publicaciones con esos filtros</h3><button onClick={() => { setMyListingFilter("all"); setMyListingSearch(""); }}>Ver todas</button></div> : <div className="account-empty"><span>📦</span><h3>Aún no tienes publicaciones</h3><button onClick={() => { setAccountOpen(false); openPublish(); }}>Publicar un artículo</button></div>}
              </div>
            )}

            {accountTab === "offers" && (
              <div className="offers-dashboard">
                <div className="offers-guide"><b>Ofertas claras</b><span>Aceptar una oferta no reserva el artículo ni lo marca Pendiente automáticamente.</span><span>Solo cambia a Pendiente cuando realmente estés coordinando la venta.</span><span>Aceptar una oferta no crea todavía una transacción.</span><span>Las demás ofertas permanecen en su estado mientras el anuncio siga Disponible.</span></div>
                <div className="offer-summary-grid" aria-label="Resumen de ofertas">
                  {([['all', 'Todas'], ['pending', 'Pendientes'], ['accepted', 'Aceptadas'], ['closed', 'Finalizadas']] as const).map(([status, label]) => <button type="button" key={status} className={offerStatusFilter === status ? "active" : ""} onClick={() => setOfferStatusFilter(status)} aria-pressed={offerStatusFilter === status}><b>{offerCounts[status]}</b><span>{label}</span></button>)}
                </div>
                <div className="offer-toolbar">
                  <label className="offer-search"><span>Buscar</span><input type="search" value={offerSearch} onChange={(event) => setOfferSearch(event.target.value)} placeholder="Buscar por publicación" aria-label="Buscar ofertas por publicación" /></label>
                  <label><span>Dirección</span><select value={offerDirectionFilter} onChange={(event) => setOfferDirectionFilter(event.target.value as "all" | "received" | "sent")} aria-label="Filtrar ofertas por dirección"><option value="all">Todas</option><option value="received">Recibidas</option><option value="sent">Enviadas</option></select></label>
                  {offerFiltersActive && <button type="button" className="clear-offer-filters" onClick={clearOfferFilters}>Limpiar filtros</button>}
                </div>
                <div className="offer-result-count" aria-live="polite">{filteredMyOffers.length} oferta{filteredMyOffers.length === 1 ? "" : "s"} en esta vista</div>
                {filteredMyOffers.length ? filteredMyOffers.map((offer) => { const received = offer.offered_by_user_id !== session.user.id; return <article className={`offer-card status-${offer.status}`} key={offer.id}><div><span>{offer.offered_by === "seller" ? (received ? "Contraoferta recibida" : "Contraoferta enviada") : (received ? "Oferta recibida" : "Oferta enviada")}</span><h3>{offer.listings?.title || "Publicación"}</h3><small>{new Date(offer.created_at).toLocaleDateString("es-PR", {day: "numeric", month: "short", year: "numeric"})}</small></div><strong>${Number(offer.amount).toLocaleString("en-US")}</strong><b>{offer.status === "pending" ? "Pendiente" : offer.status === "accepted" ? "Aceptada" : offer.status === "rejected" ? "Rechazada" : offer.status === "withdrawn" ? "Retirada" : offer.status === "countered" ? "Respondida con contraoferta" : "Expirada"}</b>{offer.status === "pending" && <div className="offer-actions">{received ? <><button type="button" onClick={() => changeOfferStatus(offer.id, "accepted")} disabled={busy}>Aceptar</button><button type="button" onClick={() => openCounterOffer(offer)} disabled={busy}>Contraofertar</button><button type="button" onClick={() => changeOfferStatus(offer.id, "rejected")} disabled={busy}>Rechazar</button></> : <button type="button" onClick={() => changeOfferStatus(offer.id, "withdrawn")} disabled={busy}>Retirar oferta</button>}</div>}</article>; }) : myOffers.length ? <div className="account-empty offers-filter-empty"><span>🔎</span><h3>No encontramos ofertas con esos filtros</h3><p>Prueba otra palabra o muestra todas las negociaciones.</p><button type="button" onClick={clearOfferFilters}>Ver todas las ofertas</button></div> : <div className="account-empty"><span>🤝</span><h3>No tienes ofertas todavía</h3><p>Las ofertas enviadas o recibidas aparecerán aquí.</p></div>}
              </div>
            )}

            {accountTab === "sales" && (
              <div className="sales-dashboard">
                <div className="sales-guide"><b>Confirmación entre ambas partes</b><span>El vendedor declara la venta.</span><span>El comprador confirma o rechaza.</span><span>Solo después se crea una transacción verificable y se habilitan reseñas.</span></div>
                <div className="sale-process-map" aria-label="Progreso de ventas verificadas"><article><span>1</span><div><b>Oferta aceptada</b><small>No marca Vendido ni crea una transacción.</small></div><strong>{myOffers.filter((offer) => offer.status === "accepted").length}</strong></article><article><span>2</span><div><b>Confirmación pendiente</b><small>El comprador debe confirmar que ocurrió.</small></div><strong>{saleConfirmations.filter((confirmation) => confirmation.status === "seller_submitted").length}</strong></article><article><span>3</span><div><b>Transacción verificada</b><small>Se crea únicamente después de confirmar.</small></div><strong>{myTransactions.filter((transaction) => transaction.status === "completed").length}</strong></article><article><span>4</span><div><b>Reseña o disputa</b><small>Solo desde una transacción reconocida.</small></div><strong>{myReviews.length + myDisputes.length}</strong></article></div>
                <div className="sale-integrity-note"><b>Regla de confianza</b><span>El vendedor no puede completar la venta por sí solo.</span><span>Un rechazo o cancelación no crea una transacción.</span><span>El anuncio conserva su estado hasta que corresponda cambiarlo.</span></div>
                <div className="sale-summary-grid" aria-label="Resumen de compras y ventas">{([['all','Todo'],['action','Requiere acción'],['completed','Completadas'],['disputed','En disputa']] as const).map(([stage,label]) => <button type="button" key={stage} className={saleStageFilter === stage ? "active" : ""} onClick={() => setSaleStageFilter(stage)} aria-pressed={saleStageFilter === stage}><b>{saleCounts[stage]}</b><span>{label}</span></button>)}</div>
                <div className="sale-toolbar"><label><span>Buscar</span><input type="search" value={saleSearch} onChange={(event) => setSaleSearch(event.target.value)} placeholder="Buscar por publicación" aria-label="Buscar compras y ventas por publicación" /></label><label><span>Mi participación</span><select value={saleRoleFilter} onChange={(event) => setSaleRoleFilter(event.target.value as "all" | "buying" | "selling")} aria-label="Filtrar entre compras y ventas"><option value="all">Compras y ventas</option><option value="buying">Mis compras</option><option value="selling">Mis ventas</option></select></label>{saleFiltersActive && <button type="button" onClick={clearSaleFilters}>Limpiar filtros</button>}</div>
                <div className="sale-result-count" aria-live="polite">{saleResultCount} operación{saleResultCount === 1 ? "" : "es"} en esta vista</div>
                {filteredAcceptedSaleOffers.map((offer) => <article className="sale-start-card" key={offer.id}><div><span>Oferta aceptada</span><h3>{offer.listings?.title || "Publicación"}</h3><p>Precio acordado: <b>${Number(offer.amount).toLocaleString("en-US")}</b></p></div><button type="button" onClick={() => setSaleOffer(offer)}>Iniciar confirmación de venta</button></article>)}
                {filteredSaleConfirmations.map((confirmation) => { const buyer = confirmation.buyer_id === session.user.id; return <article className={`confirmation-card status-${confirmation.status}`} key={confirmation.id}><div><span>{buyer ? "Compra por confirmar" : "Confirmación enviada"}</span><h3>{confirmation.listings?.title || "Publicación"}</h3><p>Precio acordado: <b>${Number(confirmation.agreed_price).toLocaleString("en-US")}</b></p><small>{new Date(confirmation.submitted_at).toLocaleDateString("es-PR", {day: "numeric", month: "short", year: "numeric"})}</small></div><strong>{confirmation.status === "seller_submitted" ? "Esperando comprador" : confirmation.status === "buyer_confirmed" ? "Confirmada" : confirmation.status === "buyer_rejected" ? "Rechazada" : confirmation.status === "cancelled" ? "Cancelada" : "Expirada"}</strong>{confirmation.status === "seller_submitted" && <div className="confirmation-actions">{buyer ? <><button type="button" onClick={() => actOnSaleConfirmation(confirmation.id, "confirm")} disabled={busy}>Sí, completé la compra</button><button type="button" onClick={() => actOnSaleConfirmation(confirmation.id, "reject")} disabled={busy}>No ocurrió</button></> : <button type="button" onClick={() => actOnSaleConfirmation(confirmation.id, "cancel")} disabled={busy}>Cancelar solicitud</button>}</div>}</article>; })}
                {filteredTransactions.length > 0 && <div className="transaction-heading"><h3>Transacciones verificadas</h3><span>{filteredTransactions.length}</span></div>}
                {filteredTransactions.map((transaction) => { const reviewed = myReviews.some((review) => review.transaction_id === transaction.id); const disputed = myDisputes.some((dispute) => dispute.transaction_id === transaction.id && !["resolved", "closed"].includes(dispute.status)); return <article className="transaction-card" key={transaction.id}><div><span>{transaction.status === "disputed" ? "⚑ En disputa" : "✓ Completada"}</span><h3>{transaction.listings?.title || "Publicación"}</h3><p>{transaction.buyer_id === session.user.id ? "Compra" : "Venta"} · ${Number(transaction.agreed_price).toLocaleString("en-US")} · {new Date(transaction.completed_at).toLocaleDateString("es-PR", {day: "numeric", month: "short", year: "numeric"})}</p></div><div className="transaction-actions">{reviewed ? <b>Reseña enviada</b> : <button type="button" onClick={() => setReviewTransaction(transaction)}>Escribir reseña</button>}{disputed ? <b>Disputa abierta</b> : <button type="button" className="danger-soft" onClick={() => setDisputeTransaction(transaction)}>Abrir disputa</button>}</div></article>; })}
                {saleResultCount === 0 && (saleFiltersActive ? <div className="account-empty sale-filter-empty"><span>🔎</span><h3>No encontramos operaciones con esos filtros</h3><p>Prueba otra búsqueda o vuelve a mostrar todo tu historial.</p><button type="button" onClick={clearSaleFilters}>Ver todo el historial</button></div> : <div className="account-empty"><span>✓</span><h3>No hay ventas por confirmar</h3><p>Cuando una oferta aceptada avance, aparecerá aquí.</p></div>)}
              </div>
            )}

            {accountTab === "safety" && (
              <div className="safety-center">
                <div className="safety-center-hero"><span>🛡</span><div><h3>Centro de seguridad</h3><p>Tus reportes, disputas, evidencia y apelaciones se manejan en privado. Un reporte no declara culpable a nadie.</p></div></div>
                <div className="safety-principles"><span>✓ Revisión humana por Coquí Admin</span><span>✓ Evidencia visible solo para personas autorizadas</span><span>✓ Sin acusaciones públicas automáticas</span><span>✓ Derecho a explicar y apelar</span></div>
                <div className="safety-eligibility-note">Solo se pueden abrir desde una transacción verificada. Así las disputas protegen acuerdos reales.</div>
                <div className="safety-summary" aria-label="Resumen de casos de seguridad">{([['all','Todos'],['reports','Reportes'],['disputes','Disputas'],['actions','Decisiones'],['appeals','Apelaciones']] as const).map(([type,label]) => <button type="button" key={type} className={safetyTypeFilter === type ? "active" : ""} onClick={() => setSafetyTypeFilter(type)} aria-pressed={safetyTypeFilter === type}><b>{safetyCounts[type]}</b><span>{label}</span></button>)}</div>
                <div className="safety-toolbar"><label><span>Buscar casos</span><input type="search" value={safetySearch} onChange={(event) => setSafetySearch(event.target.value)} placeholder="Motivo, publicación o explicación" aria-label="Buscar casos de seguridad" /></label><label><span>Estado</span><select value={safetyStatusFilter} onChange={(event) => setSafetyStatusFilter(event.target.value as "all" | "open" | "resolved" | "action")} aria-label="Filtrar casos por estado"><option value="all">Todos los estados</option><option value="open">Abiertos</option><option value="resolved">Finalizados</option><option value="action">Requieren acción</option></select></label>{safetyFiltersActive && <button type="button" onClick={clearSafetyFilters}>Limpiar filtros</button>}</div>
                <div className="safety-result-count" aria-live="polite">{safetyResultCount} caso{safetyResultCount === 1 ? "" : "s"} en esta vista</div>
                {filteredReports.length > 0 && <section><div className="safety-section-title"><h3>Mis reportes</h3><b>{filteredReports.length}</b></div>{filteredReports.map((report) => <article className="case-card" key={report.id}><div><span>Reporte privado</span><h4>{report.listing_id ? "Publicación reportada" : "Conversación reportada"}</h4><p>{report.description || "Sin explicación adicional"}</p></div><div><b className={`case-status ${report.status}`}>{report.status === "submitted" ? "Recibido" : report.status === "under_review" ? "En revisión" : report.status === "resolved" ? "Resuelto" : "Descartado"}</b><small>{new Date(report.created_at).toLocaleDateString("es-PR")}</small></div></article>)}</section>}
                {filteredDisputes.length > 0 && <section><div className="safety-section-title"><h3>Disputas de transacciones</h3><b>{filteredDisputes.length}</b></div>{filteredDisputes.map((dispute) => <article className="case-card dispute-card" key={dispute.id}><div><span>Expediente privado</span><h4>{dispute.transactions?.listings?.title || "Transacción verificada"}</h4><p>{dispute.description}</p><small>{dispute.dispute_evidence?.length || 0} declaración{dispute.dispute_evidence?.length === 1 ? "" : "es"} añadida{dispute.dispute_evidence?.length === 1 ? "" : "s"}</small></div><div><b className={`case-status ${dispute.status}`}>{dispute.status === "submitted" ? "Recibida" : dispute.status === "under_review" ? "En revisión" : dispute.status === "awaiting_evidence" ? "Espera evidencia" : dispute.status === "resolved" ? "Resuelta" : "Cerrada"}</b>{!["resolved", "closed"].includes(dispute.status) && <button type="button" onClick={() => setEvidenceDispute(dispute)}>Añadir declaración</button>}</div></article>)}</section>}
                {filteredModerationActions.length > 0 && <section><div className="safety-section-title"><h3>Decisiones administrativas</h3><b>{filteredModerationActions.length}</b></div>{filteredModerationActions.map((action) => { const appealed = myAppeals.some((appeal) => appeal.moderation_action_id === action.id); return <article className="case-card" key={action.id}><div><span>Coquí Admin</span><h4>{action.action_type.replaceAll("_", " ")}</h4><p>{action.reason}</p></div><div>{appealed ? <b>Apelación enviada</b> : <button type="button" onClick={() => setAppealAction(action)}>Apelar</button>}</div></article>; })}</section>}
                {filteredAppeals.length > 0 && <section><div className="safety-section-title"><h3>Mis apelaciones</h3><b>{filteredAppeals.length}</b></div>{filteredAppeals.map((appeal) => <article className="case-card" key={appeal.id}><div><span>Revisión solicitada</span><p>{appeal.reason}</p>{appeal.admin_response && <small>Respuesta: {appeal.admin_response}</small>}</div><b className={`case-status ${appeal.status}`}>{appeal.status === "submitted" ? "Recibida" : appeal.status === "under_review" ? "En revisión" : appeal.status === "approved" ? "Aprobada" : "Denegada"}</b></article>)}</section>}
                {safetyResultCount === 0 && (safetyFiltersActive ? <div className="account-empty safety-filter-empty"><span>🔎</span><h3>No encontramos casos con esos filtros</h3><p>Prueba otra búsqueda o vuelve a mostrar todo tu historial.</p><button type="button" onClick={clearSafetyFilters}>Ver todos los casos</button></div> : <div className="account-empty"><span>✓</span><h3>No tienes casos de seguridad</h3><p>Tus reportes, disputas y apelaciones aparecerán aquí.</p></div>)}
                <div className="urgent-safety"><b>¿Hay peligro inmediato?</b><span>No esperes una respuesta dentro de la plataforma. Llama al 911 o contacta a las autoridades correspondientes.</span></div>
              </div>
            )}

            {accountTab === "messages" && (
              <div className="messages-center">
                <div className="conversation-summary" aria-label="Resumen de conversaciones">{([['all','Todas'],['offers','Con ofertas'],['pending','Esperan respuesta'],['messages','Con mensajes']] as const).map(([filter,label]) => <button type="button" key={filter} className={conversationFilter === filter ? "active" : ""} onClick={() => setConversationFilter(filter)} aria-pressed={conversationFilter === filter}><b>{conversationCounts[filter]}</b><span>{label}</span></button>)}</div>
                <div className="conversation-toolbar"><label><span>Buscar conversaciones</span><input type="search" value={conversationSearch} onChange={(event) => setConversationSearch(event.target.value)} placeholder="Persona, publicación o mensaje" aria-label="Buscar conversaciones por persona, publicación o mensaje" /></label>{conversationFiltersActive && <button type="button" onClick={clearConversationFilters}>Limpiar filtros</button>}<small aria-live="polite">{filteredConversations.length} conversación{filteredConversations.length === 1 ? "" : "es"}</small></div>
              <div className="messages-layout">
                <div className="conversation-list">
                  {filteredConversations.map((conversation) => {
                    const last = conversation.messages[conversation.messages.length - 1];
                    const offerCount = conversationOfferCount(conversation);
                    const pendingOfferCount = conversationPendingOfferCount(conversation);
                    return (
                      <button className={selectedConversationId === conversation.id ? "active" : ""} key={conversation.id} onClick={() => setSelectedConversationId(conversation.id)}>
                        <div><strong>{conversation.other_person}</strong>{pendingOfferCount > 0 && <i>{pendingOfferCount} pendiente{pendingOfferCount === 1 ? "" : "s"}</i>}</div>
                        <span>{conversation.listing_title}</span>
                        <small>{last?.body || "Conversación iniciada"}</small>
                        <em>{conversation.messages.length} mensaje{conversation.messages.length === 1 ? "" : "s"}{offerCount > 0 ? ` · ${offerCount} oferta${offerCount === 1 ? "" : "s"}` : ""} · {new Date(last?.created_at || conversation.created_at).toLocaleDateString("es-PR", {day:"numeric",month:"short"})}</em>
                      </button>
                    );
                  })}
                  {!filteredConversations.length && (myConversations.length ? <div className="account-empty compact conversation-filter-empty"><span>🔎</span><h3>No encontramos conversaciones</h3><p>Prueba otra búsqueda o muestra todos tus chats.</p><button type="button" onClick={clearConversationFilters}>Ver todas</button></div> : <div className="account-empty compact"><span>💬</span><h3>No tienes mensajes todavía</h3></div>)}
                </div>
                {selectedConversation && (
                  <div className="message-thread">
                    <header><strong>{selectedConversation.other_person}</strong><span>{selectedConversation.listing_title}</span><button type="button" className="thread-report" onClick={() => setReportTarget({ kind: "conversation", id: selectedConversation.id, label: `Conversación con ${selectedConversation.other_person}` })}>⚑ Reportar conversación</button></header>
                    <div className="chat-record-summary"><div><b>Registro de la conversación</b><span>{selectedConversation.messages.length} mensaje{selectedConversation.messages.length === 1 ? "" : "s"} · {selectedConversationOffers.length} negociación{selectedConversationOffers.length === 1 ? "" : "es"}</span></div><div role="group" aria-label="Filtrar registro del chat"><button type="button" className={chatView === "all" ? "active" : ""} onClick={() => setChatView("all")}>Todo</button><button type="button" className={chatView === "messages" ? "active" : ""} onClick={() => setChatView("messages")}>Mensajes</button><button type="button" className={chatView === "offers" ? "active" : ""} onClick={() => setChatView("offers")}>Ofertas</button></div></div>
                    <div className="message-history">
                      {selectedChatTimeline.filter((item) => chatView === "all" || (chatView === "messages" ? item.kind === "message" : item.kind === "offer")).map((item) => { if (item.kind === "message") return <p className={item.message.sender_id === session.user.id ? "mine" : "theirs"} key={`message-${item.message.id}`}>{item.message.body}<time>{new Date(item.createdAt).toLocaleString("es-PR", {dateStyle:"short", timeStyle:"short"})}</time></p>; const offer = item.offer; const received = offer.offered_by_user_id !== session.user.id; const statusLabel = offer.status === "pending" ? "Pendiente" : offer.status === "accepted" ? "Aceptada" : offer.status === "rejected" ? "Rechazada" : offer.status === "withdrawn" ? "Retirada" : offer.status === "countered" ? "Respondida" : "Expirada"; return <article className={`chat-offer-event status-${offer.status}`} key={`chat-offer-${offer.id}`}><div><span>🤝 {offer.offered_by === "seller" ? "Contraoferta" : "Oferta"}</span><b>${Number(offer.amount).toLocaleString("en-US")}</b></div><small>{received ? "Recibida" : "Enviada"} · {statusLabel} · {new Date(item.createdAt).toLocaleString("es-PR", {dateStyle:"short", timeStyle:"short"})}</small>{offer.status === "pending" && <div className="chat-offer-actions">{received ? <><button type="button" onClick={() => changeOfferStatus(offer.id, "accepted")} disabled={busy}>Aceptar</button><button type="button" onClick={() => openCounterOffer(offer)} disabled={busy}>Contraofertar</button><button type="button" onClick={() => changeOfferStatus(offer.id, "rejected")} disabled={busy}>Rechazar</button></> : <button type="button" onClick={() => changeOfferStatus(offer.id, "withdrawn")} disabled={busy}>Retirar</button>}</div>}</article>; })}
                      {!selectedChatTimeline.length && <small>Escribe el primer mensaje.</small>}
                      {selectedChatTimeline.length > 0 && !selectedChatTimeline.some((item) => chatView === "all" || (chatView === "messages" ? item.kind === "message" : item.kind === "offer")) && <small className="chat-filter-empty">No hay {chatView === "messages" ? "mensajes" : "ofertas"} en esta conversación.</small>}
                    </div>
                    <div className="seller-quick-replies"><button type="button" onClick={() => setReplyDraft("Sí, todavía está disponible.")}>Sigue disponible</button><button type="button" onClick={() => setReplyDraft("Gracias por tu interés. ¿Qué día te funciona para coordinar en un lugar público?")}>Coordinar encuentro</button><button type="button" onClick={() => setReplyDraft("El precio publicado es el precio actual del artículo.")}>Confirmar precio</button></div>
                    <div className="reply-box">
                      <label><textarea value={replyDraft} onChange={(event) => setReplyDraft(event.target.value)} maxLength={1000} placeholder="Escribe un mensaje…" /><small>{replyDraft.length}/1,000</small></label>
                      <button onClick={sendConversationReply} disabled={busy || !replyDraft.trim()}>{busy ? "Enviando…" : "Enviar"}</button>
                    </div>
                    <small className="message-safety">No compartas dirección exacta, documentos ni información financiera en el chat.</small>
                  </div>
                )}
              </div>
              </div>
            )}
            {accountTab === "notifications" && (
              <div className="notification-center">
                <div className="notification-hero"><div><span className="eyebrow">Al día, sin ruido</span><h3>Centro de avisos</h3><p>Aquí ves actividad importante de tu cuenta. Solo tú puedes verla.</p></div><div className="notification-summary"><b>{unreadNotificationCount}</b><span>sin leer</span></div></div>
                <div className="notification-toolbar"><div className="notification-filters" role="group" aria-label="Filtrar avisos">{([["all","Todos"],["unread","Sin leer"],["messages","Mensajes"],["offers","Ofertas"],["marketplace","Publicaciones"],["disputes","Seguridad"],["system","Sistema"]] as const).map(([value,label]) => <button key={value} className={notificationFilter === value ? "active" : ""} onClick={() => setNotificationFilter(value)}>{label}</button>)}</div><div className="notification-tools"><button type="button" onClick={readAllNotifications} disabled={busy || !unreadNotificationCount}>✓ Leer todas</button><button type="button" onClick={() => setNotificationSettingsOpen((open) => !open)}>⚙ Preferencias</button></div></div>
                {notificationSettingsOpen && notificationPreferences && <div className="notification-preferences"><div><h4>Elige qué deseas recibir</h4><p>Los avisos de seguridad y del sistema permanecen activos para proteger tu cuenta.</p></div>{([["messages_enabled","Mensajes"],["offers_enabled","Ofertas"],["marketplace_enabled","Publicaciones"],["promotions_enabled","Promociones"],["email_enabled","Correo electrónico"],["marketing_enabled","Novedades y mercadeo"]] as const).map(([key,label]) => <label key={key}><span>{label}</span><input type="checkbox" checked={notificationPreferences[key]} onChange={(event) => updateNotificationPreferences({...notificationPreferences,[key]:event.target.checked})} /></label>)}</div>}
                <div className="notification-list">{filteredNotifications.map((notification) => { const unread = !notification.read_at && notification.status !== "read"; const icon = notification.module === "messages" ? "💬" : notification.module === "offers" ? "🤝" : notification.module === "disputes" ? "🛡" : notification.module === "marketplace" ? "🏷" : "🔔"; const kind = followupKind(notification); const actionable = unread || ["messages", "offers", "marketplace", "disputes"].includes(notification.module); return <article key={notification.id} className={`${unread ? "notification-card unread" : "notification-card"} ${kind ? "followup-card" : ""}`}><span className="notification-icon">{icon}</span><div><div className="notification-card-heading"><b>{notification.title}</b>{unread && <i>Nuevo</i>}</div><p>{notification.body}</p><small>{new Date(notification.created_at).toLocaleString("es-PR",{dateStyle:"medium",timeStyle:"short"})}</small></div>{kind === "seller_listing_check" ? <div className="followup-actions"><button onClick={() => answerListingFollowup(notification,"available")} disabled={busy}>Disponible</button><button onClick={() => answerListingFollowup(notification,"pending")} disabled={busy}>Pendiente</button><button className="sold" onClick={() => answerListingFollowup(notification,"sold")} disabled={busy}>Se vendió</button></div> : kind === "buyer_purchase_check" ? <div className="followup-actions"><button onClick={() => answerBuyerFollowup(notification,true)} disabled={busy}>Sí, compré</button><button onClick={() => answerBuyerFollowup(notification,false)} disabled={busy}>No compré</button></div> : kind === "buyer_reported_purchase" ? <div className="followup-actions"><button className="sold" onClick={() => openReportedPurchase(notification)}>Confirmar venta</button></div> : actionable && <button type="button" onClick={() => openNotificationDestination(notification)}>{notificationActionLabel(notification)}</button>}</article>; })}{!filteredNotifications.length && <div className="account-empty"><span>🔔</span><h3>{notificationFilter === "unread" ? "Estás al día" : "No hay avisos aquí"}</h3><p>{notificationFilter === "unread" ? "No tienes avisos pendientes por leer." : "Cuando ocurra algo importante aparecerá en este espacio."}</p></div>}</div>
                <div className="notification-privacy">🔒 Los avisos son privados. Coquí Ventas nunca te pedirá contraseñas, códigos o pagos mediante una notificación.</div>
              </div>
            )}
            {accountMessage && <div className="auth-message" role="status">{accountMessage}</div>}
          </section>
        </div>
      )}
      {discoverOpen && <div className="modal-backdrop discover-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setDiscoverOpen(false)}><section className="discover-hub" role="dialog" aria-modal="true" aria-labelledby="discover-title"><header><div><Image className="brand-mark" src="/branding/coqui-ventas-mark.png" alt="" width={42} height={42} unoptimized /><div><span>COQUÍ DESCUBRE</span><h2 id="discover-title">{isEnglish ? "Everything you care about, in one place" : "Todo lo que te importa, en un solo lugar"}</h2></div></div><button type="button" onClick={() => setDiscoverOpen(false)} aria-label={isEnglish ? "Close Coquí Discover" : "Cerrar Coquí Descubre"}>×</button></header><nav className="discover-tabs" aria-label={isEnglish ? "Discover sections" : "Secciones de Descubre"}><button className={discoverTab === "today" ? "active" : ""} onClick={() => setDiscoverTab("today")}>☀️ {isEnglish ? "Today" : "Pa’ hoy"}</button><button className={discoverTab === "alerts" ? "active" : ""} onClick={() => setDiscoverTab("alerts")}>🔔 {isEnglish ? "Alerts" : "Alertas"}</button><button className={discoverTab === "municipality" ? "active" : ""} onClick={() => setDiscoverTab("municipality")}>🏘️ {isEnglish ? "My municipality" : "Mi Municipio"}</button><button className={discoverTab === "following" ? "active" : ""} onClick={() => setDiscoverTab("following")}>💚 {isEnglish ? "Following" : "Siguiendo"}</button><button className={discoverTab === "map" ? "active" : ""} onClick={() => setDiscoverTab("map")}>⌖ {isEnglish ? "Map" : "Mapa"}</button></nav><main>
        {discoverTab === "today" && <section className="discover-panel"><div className="discover-panel-heading"><div><span>{isEnglish ? "Made fresh for you" : "Preparado hoy para ti"}</span><h3>{isEnglish ? "What's on today in Puerto Rico?" : "¿Qué hay pa’ hoy en Puerto Rico?"}</h3><p>{isEnglish ? "A single selection combining marketplace, jobs, community and experiences." : "Una sola selección que combina marketplace, empleos, comunidad y experiencias."}</p></div><b>{activeDiscoverTown}</b></div><div className="today-highlight-grid"><button onClick={() => openJobs("candidate")}><span>💼</span><b>{isEnglish ? "Jobs hiring now" : "Empleos contratando"}</b><small>{liveJobs.length || "Nuevos"} {isEnglish ? "opportunities" : "oportunidades"}</small></button><button onClick={openHuellitas}><span>🐾</span><b>Huellitas de Amor</b><small>{isEnglish ? "Animals seeking a home" : "Animales buscando hogar"}</small></button><button onClick={() => {setDiscoverOpen(false);document.getElementById("categorias")?.scrollIntoView({behavior:"smooth"});}}><span>🎭</span><b>{isEnglish ? "Plans and experiences" : "Planes y experiencias"}</b><small>{isEnglish ? "Tourism, culture and workshops" : "Turismo, cultura y talleres"}</small></button></div><div className="discover-listing-grid">{personalizedSuggestions.map((listing) => <button key={listing.id} onClick={() => {setDiscoverOpen(false);openListing(listing);}}><span>{listing.image_urls[0] ? <Image src={listing.image_urls[0]} alt="" width={140} height={100} unoptimized /> : "📦"}</span><div><small>{listing.municipality}</small><b>{listing.title}</b><em>{listing.is_free ? (isEnglish ? "Free" : "Gratis") : `$${Number(listing.price || 0).toLocaleString("en-US")}`}</em></div></button>)}</div></section>}
        {discoverTab === "alerts" && <section className="discover-panel"><div className="discover-panel-heading"><div><span>{isEnglish ? "Useful, never noisy" : "Útiles, nunca ruidosas"}</span><h3>{isEnglish ? "Coquí Alerts" : "Alertas Coquí"}</h3><p>{isEnglish ? "Tell Coquí what you are waiting for and return only when there is something relevant." : "Dile a Coquí qué estás esperando y vuelve cuando aparezca algo relevante."}</p></div><b>{alertKeywords.length}/8</b></div><form className="coqui-alert-form" onSubmit={addCoquiAlert}><input value={alertDraft} onChange={(event) => setAlertDraft(event.target.value)} placeholder={isEnglish ? "Example: apartment in Caguas" : "Ej. apartamento en Caguas"} aria-label={isEnglish ? "Create alert" : "Crear alerta"} /><button type="submit">{isEnglish ? "Create alert" : "Crear alerta"}</button></form><div className="alert-keywords">{alertKeywords.map((keyword) => <span key={keyword}>🔔 {keyword}<button onClick={() => removeCoquiAlert(keyword)} aria-label={`${isEnglish ? "Remove" : "Eliminar"} ${keyword}`}>×</button></span>)}</div>{alertKeywords.length === 0 ? <div className="discover-empty"><span>🔔</span><b>{isEnglish ? "You have no alerts yet" : "Todavía no tienes alertas"}</b><p>{isEnglish ? "Create one for an item, job, municipality or interest." : "Crea una para un artículo, empleo, municipio o interés."}</p></div> : <div className="discover-listing-grid">{alertMatches.map((listing) => <button key={listing.id} onClick={() => {setDiscoverOpen(false);openListing(listing);}}><span>{listing.image_urls[0] ? <Image src={listing.image_urls[0]} alt="" width={140} height={100} unoptimized /> : "📦"}</span><div><small>{isEnglish ? "Alert match" : "Coincide con tu alerta"}</small><b>{listing.title}</b><em>{listing.municipality}</em></div></button>)}</div>}</section>}
        {discoverTab === "municipality" && <section className="discover-panel"><div className="discover-panel-heading municipality-heading"><div><span>{isEnglish ? "Your local Coquí" : "Tu Coquí local"}</span><h3>{isEnglish ? "My municipality" : "Mi Municipio"}</h3><p>{isEnglish ? "Marketplace, jobs and community activity near you." : "Marketplace, empleos y actividad comunitaria cerca de ti."}</p></div><select value={activeDiscoverTown} onChange={(event) => saveDiscoverTown(event.target.value)} aria-label={isEnglish ? "Choose municipality" : "Escoger municipio"}>{municipalities.map((town) => <option key={town}>{town}</option>)}</select></div><div className="municipality-summary"><article><b>{municipalityListings.length}</b><span>{isEnglish ? "available listings" : "anuncios disponibles"}</span></article><article><b>{municipalityJobs.length}</b><span>{isEnglish ? "job opportunities" : "oportunidades de empleo"}</span></article><article><b>Hoy</b><span>{isEnglish ? "local activity" : "actividad local"}</span></article></div><div className="discover-listing-grid">{municipalityListings.map((listing) => <button key={listing.id} onClick={() => {setDiscoverOpen(false);openListing(listing);}}><span>{listing.image_urls[0] ? <Image src={listing.image_urls[0]} alt="" width={140} height={100} unoptimized /> : "📦"}</span><div><small>{listing.municipality}</small><b>{listing.title}</b><em>{listing.is_free ? "Gratis" : `$${Number(listing.price || 0).toLocaleString("en-US")}`}</em></div></button>)}</div>{!municipalityListings.length && <div className="discover-empty"><span>🏘️</span><b>{isEnglish ? "We are preparing this municipality" : "Estamos preparando este municipio"}</b><p>{isEnglish ? "You will see local listings, jobs, events and help here." : "Aquí aparecerán anuncios, empleos, eventos y ayudas locales."}</p></div>}</section>}
        {discoverTab === "following" && <section className="discover-panel"><div className="discover-panel-heading"><div><span>{isEnglish ? "Your chosen community" : "Tu comunidad elegida"}</span><h3>{isEnglish ? "Following" : "Siguiendo"}</h3><p>{isEnglish ? "New active posts from the public profiles you follow." : "Publicaciones activas nuevas de los perfiles públicos que sigues."}</p></div><b>{followedSellerIds.size} {isEnglish ? "profiles" : "perfiles"}</b></div>{followingListings.length ? <div className="discover-listing-grid">{followingListings.map((listing) => <button key={listing.id} onClick={() => {setDiscoverOpen(false);openListing(listing);}}><span>{listing.image_urls[0] ? <Image src={listing.image_urls[0]} alt="" width={140} height={100} unoptimized /> : "📦"}</span><div><small>{listing.seller_display_name || "Coquí Ventas"}</small><b>{listing.title}</b><em>{listing.municipality}</em></div></button>)}</div> : <div className="discover-empty"><span>💚</span><b>{isEnglish ? "Follow profiles that matter to you" : "Sigue perfiles que te interesan"}</b><p>{isEnglish ? "Visit a seller's public profile and press Follow. Their active listings will appear here." : "Visita el perfil público de un vendedor y pulsa Seguir. Sus anuncios activos aparecerán aquí."}</p></div>}</section>}
        {discoverTab === "map" && <section className="discover-panel"><div className="discover-panel-heading"><div><span>{isEnglish ? "The whole island, connected" : "Toda la isla, conectada"}</span><h3>{isEnglish ? "Unified Coquí map" : "Mapa único Coquí"}</h3><p>{isEnglish ? "Choose a municipality and discover listings, jobs, experiences, Huellitas and local services together." : "Escoge un municipio y descubre juntos anuncios, empleos, experiencias, Huellitas y servicios locales."}</p></div><b>78 {isEnglish ? "municipalities" : "municipios"}</b></div><div className="coqui-map-shell"><div className="coqui-map-toolbar"><label><span>⌕</span><select value={activeDiscoverTown} onChange={(event) => saveDiscoverTown(event.target.value)} aria-label={isEnglish ? "Explore municipality on map" : "Explorar municipio en el mapa"}>{municipalities.map((town) => <option key={town}>{town}</option>)}</select></label><button type="button" onClick={() => setDiscoverTab("municipality")}>{isEnglish ? "View local summary" : "Ver resumen local"} →</button></div><div className="coqui-map-grid" role="list" aria-label={isEnglish ? "Municipalities with activity" : "Municipios con actividad"}>{(mapTowns.length ? mapTowns : municipalities.slice(0,18)).slice(0,24).map((town) => {const count = liveListings.filter((listing) => listing.municipality === town).length + liveJobs.filter((job) => job.municipality === town).length;return <button type="button" role="listitem" className={town === activeDiscoverTown ? "active" : ""} key={town} onClick={() => saveDiscoverTown(town)}><span>⌖</span><b>{town}</b><small>{count || "Nuevo"} {isEnglish ? "nearby" : "cerca"}</small></button>;})}</div><div className="map-legend"><span>● Marketplace</span><span>● Empleos</span><span>● Huellitas</span><span>● Turismo y cultura</span></div></div></section>}
      </main><footer><span>🔒 {isEnglish ? "Private personalization" : "Personalización privada"}</span><p>{isEnglish ? "Coquí uses your follows, favorites and chosen municipality to organize your cover. It never exposes your exact location or changes reputation scores." : "Coquí usa tus seguidos, favoritos y municipio elegido para organizar tu portada. Nunca expone tu ubicación exacta ni altera la reputación."}</p></footer></section></div>}
      {jobsOpen && <div className="modal-backdrop jobs-backdrop">
        <section className="jobs-hub" role="dialog" aria-modal="true" aria-labelledby="jobs-title">
          <header className="jobs-header">
            <button type="button" className="jobs-return" onClick={returnToClassifieds}>← {isEnglish ? "Back to buy-and-sell classifieds" : "Regresar a los clasificados de compra y venta"}</button>
            <div className="jobs-brand"><Image className="brand-mark" src="/branding/coqui-ventas-mark.png" alt="" width={42} height={42} unoptimized /><span>Coquí Empleos</span></div>
            <div className="jobs-header-tools"><div className="language-switch jobs-language" role="group" aria-label={isEnglish ? "Choose language" : "Escoger idioma"}><button type="button" className={!isEnglish ? "active" : ""} onClick={() => changeLanguage("es")}>ES</button><button type="button" className={isEnglish ? "active" : ""} onClick={() => changeLanguage("en")}>EN</button></div><button type="button" className="jobs-close" onClick={() => setJobsOpen(false)} aria-label={isEnglish ? "Close jobs" : "Cerrar empleos"}>×</button></div>
          </header>
          <div className={`jobs-hero ${quickClickMode === "employer" ? "employer-mode" : "candidate-mode"}`}><span>{quickClickMode === "candidate" ? (isEnglish ? "Opportunities for our people" : "Empleos para nuestra gente") : (isEnglish ? "Talent across the island" : "Talento en toda la isla")}</span><h2 id="jobs-title">{quickClickMode === "candidate" ? (isEnglish ? "Find work across Puerto Rico" : "Encuentra trabajo en Puerto Rico") : (isEnglish ? "Find candidates across Puerto Rico" : "Encuentra candidatos en todo Puerto Rico")}</h2><p>{quickClickMode === "candidate" ? (isEnglish ? "Search by skills, profession, municipality or work arrangement. Salary is always visible." : "Busca por destrezas, profesión, pueblo o modalidad. El salario siempre está visible.") : (isEnglish ? "Search professional profiles by skills and experience without mixing them with classifieds." : "Busca perfiles profesionales por destrezas y experiencia, sin mezclarlos con los clasificados.")}</p>{quickClickMode === "candidate" ? <form onSubmit={(event) => event.preventDefault()}><label><span>⌕</span><input type="search" value={jobSearch} onChange={(event) => setJobSearch(event.target.value)} placeholder={isEnglish ? "Skill, position or company" : "Destreza, puesto o compañía"} aria-label={isEnglish ? "Search jobs by skills" : "Buscar empleos por destrezas"} /></label><select value={jobSkill} onChange={(event) => setJobSkill(event.target.value)} aria-label={isEnglish ? "Filter jobs by skill" : "Filtrar empleos por destreza"}><option value="">{isEnglish ? "All skills" : "Todas las destrezas"}</option>{jobSkills.map((skill) => <option key={skill}>{skill}</option>)}</select><select value={jobTown} onChange={(event) => setJobTown(event.target.value)} aria-label={isEnglish ? "Filter jobs by municipality" : "Filtrar empleos por pueblo"}><option value="">{isEnglish ? "All Puerto Rico" : "Todo Puerto Rico"}</option>{jobTowns.map((town) => <option key={town}>{town}</option>)}</select><select value={jobArrangement} onChange={(event) => setJobArrangement(event.target.value)} aria-label={isEnglish ? "Filter jobs by arrangement" : "Filtrar empleos por modalidad"}><option value="">{isEnglish ? "Any arrangement" : "Cualquier modalidad"}</option><option>Presencial</option><option>Híbrido</option><option>Remoto</option></select><button type="submit">{isEnglish ? "Find jobs" : "Buscar empleos"}</button></form> : <form className="candidate-search-form" onSubmit={(event) => event.preventDefault()}><label><span>⌕</span><input type="search" value={candidateSearch} onChange={(event) => setCandidateSearch(event.target.value)} placeholder={isEnglish ? "Skill, profession or experience" : "Destreza, profesión o experiencia"} aria-label={isEnglish ? "Search candidates" : "Buscar candidatos"} /></label><select value={candidateSkill} onChange={(event) => setCandidateSkill(event.target.value)} aria-label={isEnglish ? "Filter candidates by skill" : "Filtrar candidatos por destreza"}><option value="">{isEnglish ? "All skills" : "Todas las destrezas"}</option>{jobSkills.map((skill) => <option key={skill}>{skill}</option>)}</select><button type="submit">{isEnglish ? "Find candidates" : "Buscar candidatos"}</button></form>}</div>
          <div className="jobs-role-switch" aria-label={isEnglish ? "Change jobs view" : "Cambiar vista de empleos"}><button type="button" className={quickClickMode === "candidate" ? "active" : ""} onClick={() => { setQuickClickMode("candidate"); loadRealJobWorkspace("candidate").catch(() => setQuickClickMessage("No pudimos cargar tu Job Tracker.")); }}>{isEnglish ? "I'm a candidate" : "Busco empleo"}</button><button type="button" className={quickClickMode === "employer" ? "active" : ""} onClick={() => { setQuickClickMode("employer"); loadRealJobWorkspace("employer").catch(() => setQuickClickMessage("No pudimos cargar el panel del patrono.")); }}>{isEnglish ? "I'm an employer" : "Soy patrono"}</button></div>
          {quickClickMessage && <div className="jobs-message" role="status">{quickClickMessage}</div>}
          {quickClickMode === "candidate" ? <main className="jobs-content">
            <section className="job-tracker" aria-labelledby="job-tracker-title"><div className="job-tracker-heading"><div><span>Tu actividad privada</span><h3 id="job-tracker-title">Job Tracker</h3><p>Revisa dónde solicitaste y si tu perfil profesional ha generado interés.</p></div><small>Solo tú puedes ver este panel</small></div><div className="job-tracker-summary"><article><b>{quickClickApplications.length}</b><span>Solicitudes enviadas</span></article><article><b>{quickClickApplications.filter((application) => application.status === "En revisión").length}</b><span>En revisión</span></article><article className="profile-views"><b>{quickClickProfileViews}</b><span>Visitas a tu perfil</span><small>Conteo anónimo · no identifica patronos</small></article></div>{quickClickApplications.length ? <div className="job-tracker-list">{quickClickApplications.map((application) => <article key={application.id}><div><span className={`tracker-status ${application.status === "En revisión" ? "reviewing" : "received"}`}>{application.status}</span><h4>{application.jobTitle}</h4><b>{application.company}</b><small>Enviada el {new Date(application.appliedAt).toLocaleDateString("es-PR")}</small></div><div className="tracker-steps"><span className="done">✓ Enviada</span><i /><span className={application.status === "En revisión" ? "done" : ""}>{application.status === "En revisión" ? "✓ Perfil visto" : "○ Esperando revisión"}</span></div><button type="button" onClick={() => setSelectedJob(jobsFeed.find((job) => job.id === application.jobId) || null)}>Ver empleo</button></article>)}</div> : <div className="job-tracker-empty"><span>🗂️</span><div><b>Todavía no has enviado solicitudes</b><p>Cuando uses Quick Click, cada solicitud aparecerá aquí automáticamente.</p></div></div>}</section>
            <section className="jobs-results"><div className="jobs-section-title"><div><span>{isEnglish ? "Live opportunities" : "Oportunidades reales"}</span><h3>{jobsLoading ? (isEnglish ? "Loading jobs…" : "Cargando empleos…") : `${filteredJobs.length} empleo${filteredJobs.length === 1 ? "" : "s"} disponible${filteredJobs.length === 1 ? "" : "s"}`}</h3></div><small>{isEnglish ? "Connected to Coquí Ventas" : "Conectado con Coquí Ventas"}</small></div>
              <div className="jobs-grid">{filteredJobs.map((job) => <article className={job.featured ? "featured" : ""} key={job.id}><div><span>{job.featured ? (isEnglish ? "Featured" : "Destacado") : job.posted}</span><small>{job.arrangement}</small></div><h3>{job.title}</h3><b>{job.company}</b><p>⌖ {job.municipality} · {job.employmentType}</p><div className="job-skill-tags">{job.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><strong>{job.salary}</strong><em>{isEnglish ? "Visible salary" : "Salario visible"}</em><button type="button" onClick={() => setSelectedJob(job)}>{isEnglish ? "View job" : "Ver empleo"}</button></article>)}</div>
              {!filteredJobs.length && <div className="jobs-empty"><span>💼</span><h3>{isEnglish ? "No jobs match those filters" : "No encontramos empleos con esos filtros"}</h3><button type="button" onClick={() => {setJobSearch("");setJobSkill("");setJobTown("");setJobArrangement("");}}>{isEnglish ? "View all jobs" : "Ver todos los empleos"}</button></div>}
            </section>
            <aside className="quick-click-panel" id="quick-click-profile"><span className="quick-click-badge">⚡ Quick Click</span><h3>{isEnglish ? "Apply with one click" : "Solicita con un clic"}</h3><p>{isEnglish ? "Your profile combines your resume, experience and skills for employers." : "Tu perfil reúne el resumé, experiencia y destrezas que el patrono recibirá con tu solicitud."}</p>{quickClickProfile ? <div className="quick-click-ready"><b>✓ {isEnglish ? "Profile ready" : "Perfil listo"}</b><strong>{quickClickProfile.fullName}</strong><span>{quickClickProfile.headline}</span><small>{quickClickProfile.resumeName}</small><button type="button" onClick={() => setQuickClickProfile(null)}>{isEnglish ? "Edit profile" : "Editar perfil"}</button></div> : <form onSubmit={saveQuickClickProfile}><label>{isEnglish ? "Full name" : "Nombre completo"}<input name="full_name" required defaultValue={myProfile.display_name} /></label><label>{isEnglish ? "Profession or title" : "Profesión o título"}<input name="headline" required placeholder={isEnglish ? "Example: Industrial electrician" : "Ej. Electricista industrial"} /></label><label>{isEnglish ? "Municipality" : "Pueblo"}<select name="municipality" required defaultValue={myProfile.municipality}><option value="">{isEnglish ? "Choose your municipality" : "Escoge tu pueblo"}</option>{municipalities.map((town) => <option key={town}>{town}</option>)}</select></label><label>{isEnglish ? "Experience" : "Experiencia"}<textarea name="experience" required minLength={20} placeholder={isEnglish ? "Summarize your work history and experience" : "Resume tu historial de trabajo y años de experiencia"} /></label><label>{isEnglish ? "Skills" : "Destrezas"}<input name="skills" list="coqui-job-skills" required placeholder={isEnglish ? "Choose or type skills" : "Escoge o escribe destrezas"} /><datalist id="coqui-job-skills">{jobSkills.map((skill) => <option key={skill} value={skill} />)}</datalist><small>{isEnglish ? "You may add several separated by commas." : "Puedes añadir varias separadas por comas."}</small></label><label>{isEnglish ? "Resume or work history" : "Resumé o historial"}<input name="resume" type="file" accept=".pdf,.doc,.docx" /><small>{isEnglish ? "PDF or Word · written history also works" : "PDF o Word · también puedes usar el historial escrito"}</small></label><button type="submit">{isEnglish ? "Save Quick Click profile" : "Guardar perfil Quick Click"}</button>{!session && <small className="account-required">{isEnglish ? "An account is required to save and submit applications." : "Se requiere una cuenta para guardar y enviar solicitudes."}</small>}</form>}</aside>
          </main> : <main className="employer-portal"><div className="employer-heading"><div><span>{isEnglish ? "Private employer dashboard" : "Panel privado de patronos"}</span><h3>{isEnglish ? "Find and manage candidates" : "Encuentra y administra candidatos"}</h3><p>{isEnglish ? "Review applications, search by skills and open professional profiles with one click." : "Revisa solicitudes, busca por destrezas y abre perfiles profesionales con un clic."}</p></div><button type="button" onClick={() => session ? setQuickClickMessage("El formulario para publicar empleos estará disponible para patronos verificados.") : (setJobsOpen(false),setAuthMode("signup"),setAuthOpen(true),setAuthMessage("Crea una cuenta de patrono para publicar empleos y recibir candidatos."))}>{isEnglish ? "Post a job" : "Publicar un empleo"}</button></div><div className="employer-summary"><button type="button" onClick={() => document.getElementById("employer-applications")?.scrollIntoView({behavior:"smooth"})}><b>{quickClickApplications.length}</b><span>{isEnglish ? "New applications" : "Solicitudes nuevas"}</span></button><button type="button" onClick={() => document.getElementById("employer-active-jobs")?.scrollIntoView({behavior:"smooth"})}><b>{liveJobs.length}</b><span>{isEnglish ? "Active jobs" : "Empleos activos"}</span></button><button type="button" onClick={() => document.getElementById("employer-applications")?.scrollIntoView({behavior:"smooth"})}><b>1 {isEnglish ? "click" : "clic"}</b><span>{isEnglish ? "To review a profile" : "Para revisar el perfil"}</span></button></div><section className="employer-active-jobs" id="employer-active-jobs"><div className="employer-subheading"><span>{isEnglish ? "Your opportunities" : "Tus oportunidades"}</span><h3>{isEnglish ? "Active jobs" : "Empleos activos"}</h3></div><div>{liveJobs.map((job) => <article key={job.id}><b>{job.title}</b><span>{job.municipality} · {job.arrangement}</span><small>{job.salary}</small><button type="button" onClick={() => setSelectedJob(job)}>{isEnglish ? "View job" : "Ver empleo"}</button></article>)}</div></section><section id="employer-applications"><div className="employer-subheading"><span>{isEnglish ? "Professional talent" : "Talento profesional"}</span><h3>{filteredCandidates.length} {isEnglish ? "candidate profiles" : "perfiles de candidatos"}</h3></div><div className="candidate-inbox">{filteredCandidates.length ? filteredCandidates.map((application) => <article key={application.id}><div className="candidate-avatar">{application.candidate.fullName.slice(0,1).toUpperCase()}</div><div><span>{application.status} · {new Date(application.appliedAt).toLocaleDateString(isEnglish ? "en-US" : "es-PR")}</span><h4>{application.candidate.fullName}</h4><b>{application.candidate.headline}</b><p>{isEnglish ? "Applied to" : "Solicitó"}: {application.jobTitle}</p><small>{application.candidate.experience}</small><em>{application.candidate.skills}</em></div><button type="button" onClick={() => recordQuickClickProfileView(application)}>{isEnglish ? "View profile and resume" : "Ver perfil y resumé"}</button></article>) : <div className="employer-empty"><span>🔎</span><h4>{isEnglish ? "No candidates match those skills" : "No hay candidatos con esas destrezas"}</h4><button type="button" onClick={() => {setCandidateSearch("");setCandidateSkill("");}}>{isEnglish ? "View all candidates" : "Ver todos los candidatos"}</button></div>}</div></section><div className="employer-note">{isEnglish ? "Real applications remain private between the candidate and verified employer." : "Las solicitudes reales permanecen privadas entre candidato y patrono verificado."}</div></main>}
          {selectedJob && <div className="job-detail-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedJob(null)}><section className="job-detail" role="dialog" aria-modal="true" aria-labelledby="job-detail-title"><button type="button" className="modal-close" onClick={() => setSelectedJob(null)} aria-label="Cerrar empleo">×</button><span>{selectedJob.arrangement} · {selectedJob.employmentType}</span><h2 id="job-detail-title">{selectedJob.title}</h2><b>{selectedJob.company}</b><div className="job-detail-facts"><strong>{selectedJob.salary}</strong><span>⌖ {selectedJob.municipality}</span><em>Publicado {selectedJob.posted.toLowerCase()}</em></div><p>{selectedJob.summary}</p><h3>Lo que buscan</h3><ul>{selectedJob.requirements.map((requirement) => <li key={requirement}>✓ {requirement}</li>)}</ul><div className="job-apply-box"><div><span>⚡ Quick Click</span><b>{quickClickProfile ? "Tu perfil está listo para enviar" : "Prepara tu perfil para solicitar"}</b><small>El patrono recibirá tu información profesional, no tus datos privados del marketplace.</small></div><button type="button" onClick={() => applyQuickClick(selectedJob)}>{quickClickApplications.some((application) => application.jobId === selectedJob.id) ? "Solicitud enviada ✓" : "Solicitar con un clic"}</button></div></section></div>}
        </section>
      </div>}
      {huellitasOpen && <div className="modal-backdrop huellitas-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setHuellitasOpen(false)}>
        <section className="huellitas-hub" role="dialog" aria-modal="true" aria-labelledby="huellitas-title">
          <button className="modal-close" type="button" onClick={() => setHuellitasOpen(false)} aria-label="Cerrar Huellitas de Amor">×</button>
          <header className="huellitas-hero">
            <Image src="/huellitas/hero.png" alt="Perro y gato rescatados en un patio tropical" fill priority sizes="(max-width: 760px) 100vw, 1100px" unoptimized />
            <div className="huellitas-hero-shade" />
            <div className="huellitas-hero-copy"><span>Adopción y rescate responsable</span><h2 id="huellitas-title">Huellitas de Amor</h2><p>Cada historia merece un hogar seguro.</p><div><button type="button" onClick={() => document.getElementById("huellitas-animals")?.scrollIntoView({ behavior: "smooth" })}>Ver animales disponibles</button><button type="button" className="outline" onClick={startHuellitasProfile}>Encontrarle un hogar</button><button type="button" className="outline" onClick={openRescueOrganizationPortal}>Portal de organizaciones</button></div></div>
          </header>
          <div className="huellitas-trust"><span>♡ Adopciones particulares: $0</span><span>◉ Foto real y salud visible</span><span>✓ Rescates institucionales verificados</span></div>
          <main id="huellitas-animals" className="huellitas-content">
            <div className="huellitas-audience"><article><span>🏠</span><div><b>¿Ya no puedes cuidarlo?</b><p>Publícalo gratis y busca una familia responsable. Preferimos ayudarte antes de que termine en la calle.</p></div></article><article><span>🐾</span><div><b>¿Rescataste un animal?</b><p>Una persona, hogar temporero, rescatista u organización también puede publicar.</p></div></article></div>
            {huellitasPortalOpen && <section className="rescue-portal"><div className="rescue-portal-heading"><div><span>Portal privado</span><h3>Organizaciones sin fines de lucro</h3></div><button type="button" onClick={() => setHuellitasPortalOpen(false)}>Cerrar portal</button></div>{rescueWorkspaceLoading ? <div className="huellitas-message">Cargando portal…</div> : !rescueProfile ? <form className="rescue-registration" onSubmit={submitRescueOrganization}><h4>Registrar organización</h4><p>Coquí verificará la institución. Documentos, EIN y notas internas nunca se mostrarán al público.</p><label>Nombre público<input name="public_name" required /></label><label>Pueblo<select name="municipality" required defaultValue=""><option value="">Escoge el pueblo</option>{municipalities.map((town) => <option key={town}>{town}</option>)}</select></label><label>Correo público<input name="public_email" type="email" required /></label><label>Sitio web opcional<input name="website_url" type="url" /></label><label className="wide">Descripción<textarea name="description" required minLength={30} /></label><button className="wide" disabled={rescueWorkspaceLoading}>Enviar para verificación</button></form> : <><div className="rescue-summary"><article><b>{rescueProfile.public_name}</b><span>Organización registrada</span></article><article><b>{rescueProfile.verification_status === "verified" ? "✓ Verificada" : "En revisión"}</b><span>Estado institucional</span></article><article><b>{managedAnimals.length}</b><span>Publicaciones administradas</span></article></div>{rescueProfile.verification_status !== "verified" ? <div className="huellitas-message">Tu organización está en revisión. Podrás publicar y administrar Huellitas cuando Coquí complete la verificación.</div> : <><form className="rescue-animal-form" onSubmit={submitOrganizationAnimal}><h4 className="wide">Publicar una Huellita</h4><label>Nombre<input name="name" required /></label><label>Animal<select name="species"><option value="dog">Perro</option><option value="cat">Gato</option><option value="bird">Ave</option><option value="other">Otro</option></select></label><label>Pueblo<select name="municipality" required defaultValue=""><option value="">Escoge el pueblo</option>{municipalities.map((town) => <option key={town}>{town}</option>)}</select></label><label>Sexo<select name="sex"><option value="unknown">Por confirmar</option><option value="female">Hembra</option><option value="male">Macho</option></select></label><label>Tamaño<select name="size"><option value="unknown">Por confirmar</option><option value="small">Pequeño</option><option value="medium">Mediano</option><option value="large">Grande</option></select></label><label>Vacunas<select name="vaccinated"><option value="unknown">Por confirmar</option><option value="yes">Al día</option><option value="no">Pendientes</option></select></label><label>Esterilización<select name="sterilized"><option value="unknown">Por confirmar</option><option value="yes">Sí</option><option value="no">No</option></select></label><label>Veterinario<select name="veterinarian_evaluated"><option value="unknown">Por confirmar</option><option value="yes">Evaluado</option><option value="no">Pendiente</option></select></label><label className="wide">Descripción<textarea name="description" required minLength={30} /></label><label className="wide">Foto real obligatoria<input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required /></label>{rescueProfile.institutional_fee_allowed ? <><label>Cuota institucional<input name="adoption_fee" type="number" min="0" defaultValue="0" /></label><label>Qué gastos cubre<input name="adoption_fee_explanation" /></label></> : <div className="wide rescue-no-fee">Sin autorización de cuota: la adopción se publicará en $0.</div>}<button className="wide" disabled={rescueWorkspaceLoading}>Publicar Huellita</button></form><div className="managed-animals"><h4>Publicaciones y solicitudes</h4>{managedAnimals.length ? managedAnimals.map((animal) => <article key={animal.id}><div>{animal.image_urls[0] && <Image src={animal.image_urls[0]} alt="" width={64} height={64} unoptimized />}<span><b>{animal.name || "Huellita"}</b><small>{animal.municipality} · {animal.status}</small></span></div><label>Estado<select value={animal.status} onChange={(event) => changeManagedAnimalStatus(animal.id, event.target.value as "available" | "in_process" | "adopted" | "paused" | "removed")}><option value="available">Disponible</option><option value="in_process">En proceso</option><option value="adopted">Adoptado</option><option value="paused">Pausado</option><option value="removed">Retirado</option></select></label>{animal.adoption_interests.map((interest) => <div className="adoption-interest" key={interest.id}><span><b>{Array.isArray(interest.profiles) ? interest.profiles[0]?.display_name : interest.profiles?.display_name || "Solicitante"}</b><small>{interest.message || "Interés de adopción recibido"}</small></span><select value={interest.status} onChange={(event) => changeAdoptionInterest(interest.id, event.target.value as "reviewing" | "contacted" | "approved" | "declined" | "completed")}><option value="submitted">Recibida</option><option value="reviewing">Revisando</option><option value="contacted">Contactado</option><option value="approved">Aprobado</option><option value="declined">No aprobado</option><option value="completed">Completada</option></select></div>)}</article>) : <p>Aún no tienes publicaciones institucionales.</p>}</div></>}</>}</section>}
            <div className="huellitas-heading"><div><span className="eyebrow">Encuentra a tu nueva compañía</span><h3>Animales disponibles</h3></div><div><button type="button" onClick={startHuellitasProfile}>Encontrarle un hogar</button><button type="button" onClick={openRescueOrganizationPortal}>Portal de organizaciones</button></div></div>
            {!huellitasLoading && !huellitasAnimals.length && !huellitasMessage && <div className="huellitas-demo-note">Todavía no hay animales publicados. Aquí aparecerán únicamente perfiles reales disponibles para adopción.</div>}
            <div className="huellitas-fee-guide"><span>🏥</span><div><b>Cuotas institucionales transparentes</b><p>Una organización sin fines de lucro verificada puede solicitar una cuota autorizada para recuperar parte de vacunas, esterilización, microchip o atención médica. La tarjeta siempre explica qué cubre. No es venta del animal ni permite una donación adicional obligatoria.</p></div></div>
            <div className="huellitas-filters"><label>Animal<select value={huellitasSpecies} onChange={(event) => setHuellitasSpecies(event.target.value)}><option value="">Todos</option><option value="dog">Perros</option><option value="cat">Gatos</option><option value="bird">Aves</option><option value="reptile">Reptiles</option><option value="other">Otros</option></select></label><label>Pueblo<select value={huellitasTown} onChange={(event) => setHuellitasTown(event.target.value)}><option value="">Toda Puerto Rico</option>{huellitasTowns.map((town) => <option key={town}>{town}</option>)}</select></label></div>
            {huellitasLoading ? <div className="huellitas-empty"><span>🐾</span><h3>Buscando Huellitas…</h3><p>Estamos cargando los animales disponibles.</p></div> : filteredHuellitasAnimals.length ? <div className="huellitas-grid">{filteredHuellitasAnimals.map((animal) => { const species = {dog:"Perro",cat:"Gato",bird:"Ave",reptile:"Reptil",other:"Otro"}[animal.species] || animal.species; const verifiedFee = animal.adoption_fee > 0 && animal.rescue?.verification_status === "verified" && animal.rescue.institutional_fee_allowed; const sourceLabel = animal.rescue?.profile_type === "individual" ? "Familia particular" : animal.rescue?.profile_type === "community_rescuer" ? "Rescate comunitario" : animal.rescue?.profile_type === "nonprofit" ? "Institución sin fines de lucro" : "Organización de rescate"; const healthItems = animal.health ? [["Vacunas",animal.health.vaccinated],["Esterilización",animal.health.sterilized],["Veterinario",animal.health.veterinarian_evaluated]] : []; return <article className={`huellitas-card ${verifiedFee ? "institutional" : ""}`} key={animal.id}><div className="huellitas-photo">{animal.image_urls[0] ? <Image src={animal.image_urls[0]} alt={`Foto real de ${animal.name || species}`} fill sizes="(max-width: 680px) 100vw, 320px" unoptimized /> : <span>Foto real pendiente</span>}</div><div className="huellitas-card-body"><div><span>{species} · {animal.municipality}</span>{animal.rescue?.verification_status === "verified" && <i>✓ Rescate verificado</i>}</div><div className="huellitas-source">{sourceLabel} · {animal.rescue?.public_name}</div><h4>{animal.name || "Huellita por conocer"}</h4><p>{animal.description}</p><div className="huellitas-health">{healthItems.map(([label,value]) => <span key={label}>{label}: {value === "yes" ? "Al día" : value === "no" ? "Pendiente" : "Por confirmar"}</span>)}</div><strong>{verifiedFee ? `Cuota institucional: $${animal.adoption_fee}` : "Adopción sin costo"}</strong>{verifiedFee && animal.adoption_fee_explanation && <small className="huellitas-fee-explanation">Incluye: {animal.adoption_fee_explanation}</small>}</div></article>; })}</div> : <div className="huellitas-empty"><span>🐾</span><h3>No hay coincidencias</h3><p>Prueba con otro animal o pueblo.</p><button type="button" onClick={() => {setHuellitasSpecies("");setHuellitasTown("");}}>Ver todos</button></div>}
            {huellitasMessage && <div className="huellitas-message" role="status">{huellitasMessage}</div>}
            <section className="huellitas-rules"><div><span>Protección primero</span><h3>Huellitas no es una tienda de animales</h3><p>La información desconocida se muestra honestamente. Nunca inventamos vacunas, tratamientos o historial.</p></div><ul><li>No se permite vender animales.</li><li>Las adopciones particulares no pueden exigir cuota, depósito ni donación.</li><li>Solo instituciones verificadas pueden explicar una cuota autorizada.</li><li>Coquí Ventas no cobra por adoptar.</li></ul></section>
          </main>
        </section>
      </div>}
      {advertisingInfoOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setAdvertisingInfoOpen(false)}><section className="auth-modal advertising-modal" role="dialog" aria-modal="true" aria-labelledby="advertising-title"><button className="modal-close" type="button" onClick={() => setAdvertisingInfoOpen(false)} aria-label="Cerrar">×</button><span className="eyebrow">Crece junto a Puerto Rico</span><h2 id="advertising-title">Anuncia tu negocio en Coquí</h2><p>Estamos preparando espacios publicitarios claros, locales y sin interrumpir la búsqueda.</p><div className="advertising-options"><article><span>Principal</span><b>Carrusel superior</b><small>Mayor visibilidad en la entrada.</small></article><article><span>Integrado</span><b>Banner compacto</b><small>Presencia natural luego de los resultados.</small></article><article><span>Destacado</span><b>Publicación promovida</b><small>Siempre identificada como promoción.</small></article></div><div className="advertising-rules"><b>Compromiso Coquí</b><span>✓ Toda publicidad estará identificada.</span><span>✓ No se venderá información privada.</span><span>✓ Negocios y ofertas deberán ser verificables.</span><span>✓ Los anuncios no alterarán reseñas ni estados.</span></div><button className="auth-submit" type="button" onClick={() => setAdvertisingInfoOpen(false)}>Entendido</button><small className="advertising-coming-soon">Vista demostrativa · Precios y contratación se habilitarán más adelante.</small></section></div>}
      {reportTarget && session && <div className="modal-backdrop modal-priority" onMouseDown={(event) => event.target === event.currentTarget && setReportTarget(null)}><section className="auth-modal safety-form-modal" role="dialog" aria-modal="true" aria-labelledby="report-title"><button className="modal-close" type="button" onClick={() => setReportTarget(null)} aria-label="Cerrar">×</button><span className="eyebrow">Protección comunitaria</span><h2 id="report-title">Reportar de forma privada</h2><p><b>{reportTarget.label}</b></p><div className="privacy-guide">La persona reportada no verá tu explicación. El reporte no crea una acusación pública ni una sanción automática.</div><form onSubmit={sendSafetyReport}><label>¿Qué ocurrió?<select autoFocus value={reportReason} onChange={(event) => setReportReason(event.target.value)}><option value="possible_scam">Posible estafa</option><option value="counterfeit">Producto falso</option><option value="harassment">Acoso o conducta inapropiada</option><option value="prohibited_item">Producto prohibido</option><option value="misleading_content">Información o fotos engañosas</option><option value="spam">Spam</option><option value="unsafe_behavior">Conducta peligrosa</option><option value="wrong_price_condition">Precio o condición incorrectos</option></select></label><label>Explícanos con claridad<textarea required minLength={15} maxLength={2000} value={reportDescription} onChange={(event) => setReportDescription(event.target.value)} placeholder="Describe lo ocurrido sin incluir información privada innecesaria…" /><small>{reportDescription.length}/2,000 · mínimo 15</small></label><div className="review-rules">No incluyas contraseñas, códigos, datos bancarios, documentos de identidad ni dirección exacta.</div><button className="auth-submit" disabled={busy || reportDescription.trim().length < 15}>{busy ? "Enviando…" : "Enviar reporte"}</button></form></section></div>}
      {disputeTransaction && session && <div className="modal-backdrop"><section className="auth-modal safety-form-modal" role="dialog" aria-modal="true" aria-labelledby="dispute-title"><button className="modal-close" type="button" onClick={() => setDisputeTransaction(null)} aria-label="Cerrar">×</button><span className="eyebrow">Transacción verificada</span><h2 id="dispute-title">Abrir una disputa</h2><p>{disputeTransaction.listings?.title || "Publicación"} · ${Number(disputeTransaction.agreed_price).toLocaleString("en-US")}</p><div className="dispute-steps"><span className="done">1. Envías tu explicación</span><span>2. La otra parte aporta evidencia</span><span>3. Coquí Admin revisa</span><span>4. Recibes una decisión</span></div><form onSubmit={sendDispute}><label>Motivo<select value={disputeReason} onChange={(event) => setDisputeReason(event.target.value)}><option value="item_not_as_described">Artículo distinto a lo descrito</option><option value="item_not_received">Artículo no entregado</option><option value="payment_disagreement">Desacuerdo sobre pago</option><option value="unsafe_conduct">Conducta peligrosa</option><option value="counterfeit">Posible falsificación</option><option value="other">Otro incumplimiento</option></select></label><label>Relato de los hechos<textarea required minLength={20} maxLength={3000} value={disputeDescription} onChange={(event) => setDisputeDescription(event.target.value)} placeholder="Explica qué se acordó, qué ocurrió y qué solución solicitas…" /><small>{disputeDescription.length}/3,000 · mínimo 20</small></label><div className="review-rules">Tu explicación será privada para las partes autorizadas y Coquí Admin. Abrir una disputa no garantiza un resultado específico.</div><button className="auth-submit" disabled={busy || disputeDescription.trim().length < 20}>{busy ? "Abriendo…" : "Abrir disputa"}</button></form></section></div>}
      {evidenceDispute && session && <div className="modal-backdrop"><section className="auth-modal safety-form-modal" role="dialog" aria-modal="true" aria-labelledby="evidence-title"><button className="modal-close" type="button" onClick={() => setEvidenceDispute(null)} aria-label="Cerrar">×</button><span className="eyebrow">Expediente privado</span><h2 id="evidence-title">Añadir una declaración</h2><p>{evidenceDispute.transactions?.listings?.title || "Disputa"}</p><form onSubmit={sendDisputeEvidence}><label>Información adicional<textarea required minLength={10} maxLength={3000} value={evidenceDescription} onChange={(event) => setEvidenceDescription(event.target.value)} placeholder="Añade fechas, acuerdos o detalles verificables…" /><small>{evidenceDescription.length}/3,000 · mínimo 10</small></label><div className="review-rules">No alteres ni fabriques evidencia. No incluyas información personal que no sea necesaria para evaluar el caso.</div><button className="auth-submit" disabled={busy || evidenceDescription.trim().length < 10}>{busy ? "Guardando…" : "Añadir al expediente"}</button></form></section></div>}
      {appealAction && session && <div className="modal-backdrop"><section className="auth-modal safety-form-modal" role="dialog" aria-modal="true" aria-labelledby="appeal-title"><button className="modal-close" type="button" onClick={() => setAppealAction(null)} aria-label="Cerrar">×</button><span className="eyebrow">Derecho a revisión</span><h2 id="appeal-title">Apelar una decisión</h2><p>{appealAction.reason}</p><form onSubmit={sendAppeal}><label>¿Por qué debe revisarse?<textarea required minLength={20} maxLength={3000} value={appealReason} onChange={(event) => setAppealReason(event.target.value)} placeholder="Explica qué información falta o qué parte de la decisión consideras incorrecta…" /><small>{appealReason.length}/3,000 · mínimo 20</small></label><div className="review-rules">La apelación no elimina la medida automáticamente. Coquí Admin revisará el expediente y responderá.</div><button className="auth-submit" disabled={busy || appealReason.trim().length < 20}>{busy ? "Enviando…" : "Enviar apelación"}</button></form></section></div>}
      {pendingStatusChange && <div className="modal-backdrop"><section className={`auth-modal status-confirm ${pendingStatusChange.status === "sold" ? "sold-flow-modal" : ""}`} role="dialog" aria-modal="true" aria-labelledby="status-confirm-title"><button className="modal-close" type="button" onClick={() => { setPendingStatusChange(null); setSoldBuyerId(""); }} aria-label="Cerrar">×</button><span className="eyebrow">Confirma el cambio</span><h2 id="status-confirm-title">{pendingStatusChange.status === "sold" ? "¿A quién se vendió?" : `Cambiar a ${listingStatusLabels[pendingStatusChange.status]}`}</h2><p><b>{pendingStatusChange.title}</b></p>{pendingStatusChange.status === "sold" ? <><div className="sold-confirm-note">Elige cómo ocurrió la venta. Solo una compra confirmada por ambas personas habilita reseñas verificadas.</div><fieldset className="sold-methods"><legend>Forma de venta</legend><label className={soldMethod === "coqui" ? "selected" : ""}><input type="radio" name="sold-method" value="coqui" checked={soldMethod === "coqui"} onChange={() => setSoldMethod("coqui")} /><span><b>Usuario de Coquí Ventas</b><small>Le enviaremos una confirmación antes de marcarla Vendida.</small></span></label><label className={soldMethod === "external" ? "selected" : ""}><input type="radio" name="sold-method" value="external" checked={soldMethod === "external"} onChange={() => { setSoldMethod("external"); setSoldBuyerId(""); }} /><span><b>Se vendió fuera de Coquí Ventas</b><small>Se registra como venta externa y no genera reseña verificada.</small></span></label><label className={soldMethod === "undisclosed" ? "selected" : ""}><input type="radio" name="sold-method" value="undisclosed" checked={soldMethod === "undisclosed"} onChange={() => { setSoldMethod("undisclosed"); setSoldBuyerId(""); }} /><span><b>Prefiero no identificar al comprador</b><small>Se marca Vendido sin crear una transacción verificable.</small></span></label></fieldset>{soldMethod === "coqui" && <div className="sold-buyer-picker"><label>Comprador<select value={soldBuyerId} onChange={(event) => setSoldBuyerId(event.target.value)} required><option value="">Escoge entre las personas que escribieron</option>{soldBuyerCandidates.map((conversation) => <option key={conversation.other_user_id} value={conversation.other_user_id}>{conversation.other_person}</option>)}</select></label>{soldBuyerCandidates.length ? <small>Solo aparecen usuarios que conversaron contigo sobre este anuncio.</small> : <div className="sold-no-buyers">Nadie te ha escrito por este anuncio. Escoge venta externa o no identificar comprador.</div>}</div>}<div className="sale-flow-preview"><span>{soldMethod === "coqui" ? "1. Enviamos confirmación" : "1. Registramos la venta"}</span><span>{soldMethod === "coqui" ? "2. El comprador responde" : "2. No se habilitan reseñas"}</span><span>{soldMethod === "coqui" ? "3. Se verifica y marca Vendido" : "3. Visible como Vendido por 24 h"}</span></div></> : pendingStatusChange.status === "pending" ? <div className="pending-confirm-note">El anuncio seguirá visible con la etiqueta Pendiente mientras coordinas.</div> : pendingStatusChange.status === "paused" ? <div className="pending-confirm-note">La publicación se ocultará temporalmente hasta que la reactives.</div> : <div className="pending-confirm-note">La publicación volverá a mostrarse como Disponible.</div>}<div className="confirm-actions"><button type="button" className="secondary-button" onClick={() => { setPendingStatusChange(null); setSoldBuyerId(""); }}>Cancelar</button>{pendingStatusChange.status === "sold" ? <button type="button" className="auth-submit" disabled={busy || (soldMethod === "coqui" && !soldBuyerId)} onClick={completeSoldFlow}>{busy ? "Procesando…" : soldMethod === "coqui" ? "Enviar confirmación" : "Marcar Vendido"}</button> : <button type="button" className="auth-submit" disabled={busy} onClick={async () => { const change = pendingStatusChange; await changeOwnedListingStatus(change.listingId, change.status); setPendingStatusChange(null); }}>Confirmar cambio</button>}</div></section></div>}
      {counteringOffer && <div className="modal-backdrop modal-priority"><section className="auth-modal counter-offer-modal" role="dialog" aria-modal="true" aria-labelledby="counter-offer-title"><button className="modal-close" type="button" onClick={() => setCounteringOffer(null)} aria-label="Cerrar">×</button><span className="eyebrow">Negociación</span><h2 id="counter-offer-title">Enviar una contraoferta</h2><div className="sale-summary"><span>{counteringOffer.listings?.title || "Publicación"}</span><b>Oferta actual: ${Number(counteringOffer.amount).toLocaleString("en-US")}</b></div><p>Tu propuesta quedará registrada en Ofertas y dentro del chat. La otra persona recibirá un aviso.</p><form onSubmit={submitCounterOffer}><label>Nueva cantidad<div className="counter-amount-field"><span>$</span><input aria-label="Cantidad de la contraoferta" type="number" inputMode="decimal" min="0.01" step="0.01" value={counterAmount} onChange={(event) => setCounterAmount(event.target.value)} required autoFocus /></div></label><div className="confirm-actions"><button type="button" className="secondary-button" onClick={() => setCounteringOffer(null)}>Cancelar</button><button type="submit" className="auth-submit" disabled={busy}>{busy ? "Enviando…" : "Enviar contraoferta"}</button></div></form></section></div>}
      {saleOffer && <div className="modal-backdrop"><section className="auth-modal sale-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="sale-start-title"><button className="modal-close" type="button" onClick={() => setSaleOffer(null)} aria-label="Cerrar">×</button><span className="eyebrow">Venta acordada</span><h2 id="sale-start-title">Solicitar confirmación al comprador</h2><div className="sale-summary"><span>{saleOffer.listings?.title || "Publicación"}</span><b>${Number(saleOffer.amount).toLocaleString("en-US")}</b></div><div className="confirmation-steps"><span className="done">1. Oferta aceptada</span><span>2. Vendedor declara</span><span>3. Comprador confirma</span><span>4. Transacción y reseñas</span></div><p>Esto no confirma la venta por sí solo. El comprador deberá indicar que la compra realmente ocurrió.</p><div className="confirm-actions"><button type="button" className="secondary-button" onClick={() => setSaleOffer(null)}>Ahora no</button><button type="button" className="auth-submit" onClick={startSaleConfirmation} disabled={busy}>{busy ? "Enviando…" : "Enviar confirmación"}</button></div></section></div>}
      {reviewTransaction && <div className="modal-backdrop"><section className="auth-modal review-modal" role="dialog" aria-modal="true" aria-labelledby="review-title"><button className="modal-close" type="button" onClick={() => setReviewTransaction(null)} aria-label="Cerrar">×</button><span className="eyebrow">Transacción verificada</span><h2 id="review-title">¿Cómo fue tu experiencia?</h2><p>{reviewTransaction.listings?.title || "Publicación"}</p><form onSubmit={sendVerifiedReview}><fieldset><legend>Calificación</legend><div className="star-picker">{[1,2,3,4,5].map((star) => <button type="button" key={star} className={star <= reviewRating ? "active" : ""} onClick={() => setReviewRating(star)} aria-label={`${star} estrella${star === 1 ? "" : "s"}`}>★</button>)}</div><small>{reviewRating === 5 ? "Excelente" : reviewRating === 4 ? "Muy buena" : reviewRating === 3 ? "Regular" : reviewRating === 2 ? "Mala" : "Muy mala"}</small></fieldset><label>Comentario opcional<textarea value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} maxLength={1000} placeholder="Describe tu experiencia con respeto…" /><small>{reviewComment.length}/1,000</small></label><div className="review-rules">La reseña estará ligada a esta transacción. No publiques teléfonos, direcciones ni información privada.</div><button className="auth-submit" disabled={busy}>{busy ? "Guardando…" : "Enviar reseña verificada"}</button></form></section></div>}
      {authOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setAuthOpen(false)
          }
        >
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-title"
          >
            <button
              className="modal-close"
              onClick={() => setAuthOpen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <Image className="brand-mark modal-logo" src="/branding/coqui-ventas-mark.png" alt="" width={345} height={349} unoptimized />
            <span className="eyebrow">Bienvenido a Coqui Ventas</span>
            <h2 id="auth-title">
              {authMode === "login" ? "Entra a tu cuenta" : authMode === "signup" ? "Crea tu cuenta" : authMode === "recovery" ? "Recupera tu acceso" : "Crea tu contraseña nueva"}
            </h2>
            <p>
              {authMode === "login"
                ? "Continúa comprando, vendiendo y conectando."
                : authMode === "signup" ? "Únete a la comunidad de compraventa de Puerto Rico." : authMode === "recovery" ? "Te enviaremos un enlace seguro si el correo pertenece a una cuenta." : "El enlace fue verificado. Escoge una contraseña fuerte para continuar."}
            </p>
            {authMode === "signup" && <section className="signup-avatar-picker" aria-label="Foto de perfil opcional">
              <div className="signup-avatar-preview">{signupAvatarPreview ? <Image src={signupAvatarPreview} alt="Vista previa de tu foto de perfil" width={112} height={112} unoptimized /> : <span aria-hidden="true">👤</span>}</div>
              <div><b>Tu foto de perfil</b><p>Opcional · Ayuda a que compradores y vendedores te reconozcan.</p><label className="avatar-file-button">{avatarPreparing ? "Preparando foto…" : signupAvatarFile ? "Cambiar foto" : "Escoger foto"}<input type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif" disabled={avatarPreparing} onChange={(event) => handleSignupAvatar(event.target.files?.[0])} /></label>{signupAvatarFile && <button type="button" className="remove-avatar-button" onClick={removeSignupAvatar}>Quitar foto</button>}</div>
              <small>La recortamos automáticamente en formato cuadrado y reducimos su tamaño. No subas documentos ni imágenes con información privada.</small>
              {avatarMessage && <div className="avatar-message" role="status">{avatarMessage}</div>}
            </section>}
            <form onSubmit={handleAuth}>
              {authMode === "signup" && <label>
                Nombre público
                <input name="display_name" type="text" autoComplete="name" minLength={2} maxLength={80} required placeholder="Ej. Jayson Rivera" />
                <small>Será visible en tus anuncios; tu correo permanece privado.</small>
              </label>}
              {authMode !== "update-password" && <label>
                Correo electrónico
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="nombre@correo.com"
                />
              </label>}
              {authMode !== "recovery" && <label>
                Contraseña
                <div className="password-input-wrap"><input name="password" type={passwordVisible ? "text" : "password"} autoComplete={authMode === "login" ? "current-password" : "new-password"} minLength={8} required placeholder="Mínimo 8 caracteres" value={authPassword} onChange={(event) => setAuthPassword(event.target.value)} /><button type="button" onClick={() => setPasswordVisible((visible) => !visible)} aria-label={passwordVisible ? "Ocultar contraseña" : "Mostrar contraseña"}>{passwordVisible ? "Ocultar" : "Mostrar"}</button></div>
                {authMode === "signup" && <div className="password-strength" aria-live="polite"><div><i style={{width: `${passwordScore / 5 * 100}%`}} /></div><b>{passwordScore <= 2 ? "Débil" : passwordScore <= 3 ? "Aceptable" : passwordScore === 4 ? "Fuerte" : "Muy fuerte"}</b><small>Combina mayúscula, minúscula, número y símbolo. Nunca compartas tu contraseña.</small></div>}
              </label>}
              <button className="auth-submit" disabled={busy}>
                {busy
                  ? "Procesando…"
                  : authMode === "login"
                    ? "Entrar"
                    : authMode === "signup" ? "Crear cuenta" : authMode === "recovery" ? "Enviar enlace seguro" : "Guardar contraseña nueva"}
              </button>
            </form>
            {authMode === "login" && <button type="button" className="forgot-password" onClick={() => { setAuthMode("recovery"); setAuthMessage(""); setAuthPassword(""); }}>Olvidé mi contraseña</button>}
            {authMessage && (
              <div className="auth-message" role="status">
                {authMessage}
              </div>
            )}
            {authMode !== "update-password" && <button
              className="auth-switch"
              onClick={() => {
                setAuthMode(authMode === "login" ? "signup" : "login");
                setAuthMessage("");
                setAuthPassword("");
              }}
            >
              {authMode === "login"
                ? "¿No tienes cuenta? Regístrate"
                : authMode === "signup" ? "¿Ya tienes cuenta? Inicia sesión" : "Volver a iniciar sesión"}
            </button>}
          </section>
        </div>
      )}
      {publishOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setPublishOpen(false)
          }
        >
          <section
            className="auth-modal publish-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="publish-title"
          >
            <button
              className="modal-close"
              onClick={() => setPublishOpen(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <Image className="brand-mark modal-logo" src="/branding/coqui-ventas-mark.png" alt="" width={345} height={349} unoptimized />
            <span className="eyebrow">Nueva publicación</span>
            <h2 id="publish-title">Cuéntanos qué vendes</h2>
            <p>
              Añade información clara y fotos reales. Coqui Ventas validará todo
              antes de publicarlo.
            </p>
            <div className="publish-progress"><span style={{width: `${publishStepsComplete * 20}%`}} /><strong>{publishStepsComplete} de 5 pasos listos</strong></div>
            <div className="publish-checklist" aria-label="Requisitos de publicación"><span className={selectedCategoryId ? "done" : ""}>Categoría</span><span className={publishTitle.length >= 5 ? "done" : ""}>Título claro</span><span className={publishDescription.length >= 15 ? "done" : ""}>Descripción</span><span className={publishMunicipality ? "done" : ""}>Pueblo</span><span className={selectedPhotoCount > 0 && selectedPhotoCount <= 8 ? "done" : ""}>Fotos reales</span></div>
            <div className="publish-preview"><span>Vista previa</span><div><b>{publishTitle || "Título de tu artículo"}</b><strong>{isFreeListing ? "Gratis" : listingPrice ? `$${Number(listingPrice).toLocaleString("en-US")}` : "Precio visible"}</strong><small>{publishMunicipality || "Pueblo"} · {conditionLabels[publishCondition]}</small>{publishNegotiable && !isFreeListing && <em>Acepta ofertas</em>}</div></div>
            <form onSubmit={handlePublish}>
              <fieldset className="category-picker">
                <legend>Categoría</legend>
                {categoriesLoading && <div className="category-load-state" role="status">Cargando categorías reales…</div>}
                {categoriesError && <div className="category-load-state error" role="alert"><span>{categoriesError}</span><button type="button" onClick={() => void reloadCategories()}>Intentar nuevamente</button></div>}
                <div className="category-options">
                  {categoriesData.map((category) => (
                    <button
                      className={selectedCategoryId === category.id ? "selected" : ""}
                      type="button"
                      key={category.id}
                      onClick={() => {
                        if (category.id === FREE_CATEGORY_ID) {
                          if (selectedCategoryId !== FREE_CATEGORY_ID) {
                            categoryBeforeFree.current = selectedCategoryId;
                          }
                          setSelectedCategoryId(FREE_CATEGORY_ID);
                          setIsFreeListing(true);
                          setListingPrice("");
                        } else {
                          categoryBeforeFree.current = category.id;
                          setSelectedCategoryId(category.id);
                          setIsFreeListing(false);
                        }
                      }}
                      aria-pressed={selectedCategoryId === category.id}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                {isFreeListing && (
                  <small className="category-note">
                    Este anuncio aparecerá automáticamente en la categoría Gratis.
                  </small>
                )}
              </fieldset>
              <label>
                Título
                <input
                  name="title"
                  required
                  minLength={5}
                  maxLength={120}
                  placeholder="Ej. Generador inverter 3500W"
                  value={publishTitle}
                  onChange={(event) => setPublishTitle(event.target.value)}
                />
                <small>{publishTitle.length}/120 caracteres</small>
                <span className="field-tip">Consejo: incluye marca, modelo y característica principal.</span>
              </label>
              <label>
                Descripción
                <textarea
                  name="description"
                  required
                  minLength={15}
                  maxLength={2000}
                  placeholder="Describe el artículo con claridad…"
                  value={publishDescription}
                  onChange={(event) => setPublishDescription(event.target.value)}
                />
                <small>{publishDescription.length}/2000 caracteres · mínimo 15</small>
                <div className="description-helper"><span>Incluye:</span><button type="button" onClick={() => setPublishDescription((current) => current || "Estado actual:\nTiempo de uso:\nQué incluye:\nDetalles importantes:")}>Usar guía de descripción</button></div>
              </label>
              <div className="form-row">
                <label>
                  Pueblo
                  <select
                    name="municipality"
                    required
                    value={publishMunicipality}
                    onChange={(event) =>
                      setPublishMunicipality(event.target.value)
                    }
                  >
                    <option value="" disabled>
                      Escoge tu pueblo
                    </option>
                    {municipalities.map((town) => (
                      <option value={town} key={town}>
                        {town}
                      </option>
                    ))}
                  </select>
                  <button
                    className="location-button"
                    type="button"
                    onClick={detectMunicipality}
                    disabled={locating}
                  >
                    ⌖ {locating ? "Localizando…" : "Usar mi ubicación actual"}
                  </button>
                </label>
                <label>
                  Condición
                  <select name="condition" value={publishCondition} onChange={(event) => setPublishCondition(event.target.value)}>
                    <option value="new">Nuevo</option>
                    <option value="like_new">Como nuevo</option>
                    <option value="good">Bueno</option>
                    <option value="fair">Regular</option>
                    <option value="for_parts">Para piezas</option>
                  </select>
                  <small>{publishCondition === "new" ? "Sin uso." : publishCondition === "like_new" ? "Uso mínimo, excelente estado." : publishCondition === "good" ? "Funciona bien con señales normales de uso." : publishCondition === "fair" ? "Tiene desgaste visible, pero funciona." : "Requiere reparación o se vende para piezas."}</small>
                </label>
              </div>
              <label>
                {isFreeListing ? "Precio · Gratis" : "Precio"}
                <input
                  name="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder={isFreeListing ? "Gratis" : "0.00"}
                  value={listingPrice}
                  onChange={(event) => setListingPrice(event.target.value)}
                  onBlur={() => {
                    if (listingPrice !== "" && Number(listingPrice) === 0) {
                      if (selectedCategoryId !== FREE_CATEGORY_ID) {
                        categoryBeforeFree.current = selectedCategoryId;
                      }
                      setSelectedCategoryId(FREE_CATEGORY_ID);
                      setIsFreeListing(true);
                      setListingPrice("");
                      setPublishMessage("Precio $0 detectado: el anuncio pasó automáticamente a Gratis.");
                    }
                  }}
                  disabled={isFreeListing}
                  required={!isFreeListing}
                />
              </label>
              <div className="checks">
                <label>
                  <input
                    name="is_free"
                    type="checkbox"
                    checked={isFreeListing}
                    onChange={(event) => {
                      const checked = event.target.checked;
                      setIsFreeListing(checked);
                      if (checked) {
                        if (selectedCategoryId !== FREE_CATEGORY_ID) {
                          categoryBeforeFree.current = selectedCategoryId;
                        }
                        setSelectedCategoryId(FREE_CATEGORY_ID);
                        setListingPrice("");
                      } else {
                        setSelectedCategoryId(categoryBeforeFree.current);
                      }
                    }}
                  /> Es gratis
                </label>
                <label>
                  <input name="is_negotiable" type="checkbox" checked={publishNegotiable} onChange={(event) => setPublishNegotiable(event.target.checked)} disabled={isFreeListing} /> Acepto ofertas
                </label>
              </div>
              <label className="photo-field">
                Fotos reales (1–8)
                <input
                  name="images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                  multiple
                  required
                  onChange={(event) => {
                    const count = event.currentTarget.files?.length || 0;
                    setSelectedPhotoCount(count);
                    setSelectedPhotoNames(Array.from(event.currentTarget.files || []).map((file) => file.name));
                    if (count > 8) {
                      setPublishMessage("Puedes escoger un máximo de 8 fotos.");
                    } else if (count > 0) {
                      setPublishMessage(`${count} foto${count === 1 ? "" : "s"} lista${count === 1 ? "" : "s"} para optimizar automáticamente.`);
                    } else {
                      setPublishMessage("");
                    }
                  }}
                />
                <small>
                  {selectedPhotoCount
                    ? `${selectedPhotoCount} seleccionada${selectedPhotoCount === 1 ? "" : "s"} · la primera será la principal`
                    : "La primera será la foto principal"} · optimización automática sin modificar tus originales
                </small>
                {selectedPhotoNames.length > 0 && <div className="photo-selection">{selectedPhotoNames.slice(0, 8).map((name, index) => <span key={`${name}-${index}`}><b>{index === 0 ? "Principal" : `Foto ${index + 1}`}</b>{name}</span>)}</div>}
                <div className="photo-guidance"><span>✓ Buena iluminación</span><span>✓ Artículo completo</span><span>✓ Defectos visibles</span><span>✓ Sin información privada</span></div>
              </label>
              <button className="auth-submit" disabled={busy || categoriesLoading || Boolean(categoriesError)}>
                {busy ? "Subiendo y validando…" : "Publicar anuncio"}
              </button>
            </form>
            {publishMessage && (
              <div className="auth-message" role="status">
                {publishMessage}
              </div>
            )}
          </section>
        </div>
      )}
      {selectedListing && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) =>
            event.target === event.currentTarget && setSelectedListing(null)
          }
        >
          <section
            className="listing-detail"
            role="dialog"
            aria-modal="true"
            aria-labelledby="listing-detail-title"
          >
            <button
              className="modal-close"
              onClick={() => setSelectedListing(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            <div className="detail-gallery">
              {selectedListing.image_urls[activeImageIndex] ? (
                <Image
                  src={selectedListing.image_urls[activeImageIndex]}
                  alt={selectedListing.title}
                  width={1200}
                  height={900}
                  unoptimized
                />
              ) : (
                <span>📦</span>
              )}
              {selectedListing.image_urls.length > 1 && <><button className="gallery-arrow previous" type="button" onClick={() => setActiveImageIndex((activeImageIndex - 1 + selectedListing.image_urls.length) % selectedListing.image_urls.length)} aria-label="Foto anterior">‹</button><button className="gallery-arrow next" type="button" onClick={() => setActiveImageIndex((activeImageIndex + 1) % selectedListing.image_urls.length)} aria-label="Foto siguiente">›</button><span className="photo-counter" aria-live="polite">{activeImageIndex + 1} / {selectedListing.image_urls.length}</span></>}
              {selectedListing.image_urls.length > 1 && <div className="gallery-thumbnails" aria-label="Fotos del anuncio">{selectedListing.image_urls.map((image, index) => <button type="button" className={activeImageIndex === index ? "active" : ""} onClick={() => setActiveImageIndex(index)} key={image} aria-label={`Ver foto ${index + 1}`}><Image src={image} alt="" width={112} height={84} unoptimized /></button>)}</div>}
            </div>
            <div className="detail-copy">
              <div className="listing-navigation"><button type="button" onClick={() => moveThroughListings(-1)}>← Anterior</button><button type="button" onClick={() => moveThroughListings(1)}>Siguiente →</button></div>
              <span className={`detail-status ${selectedListing.status || "available"}`}>
                {listingStatusLabels[selectedListing.status || "available"]}
                {selectedListing.status === "available" && selectedListing.is_negotiable ? " · Negociable" : ""}
              </span>
              <p className="status-explanation">{statusExplanation(selectedListing.status)}</p>
              <h2 id="listing-detail-title">{selectedListing.title}</h2>
              <strong className="detail-price">
                {selectedListing.is_free
                  ? "Gratis"
                  : `$${Number(selectedListing.price).toLocaleString("en-US")}`}
              </strong>
              <p className="detail-location">
                ⌖ {selectedListing.municipality}, Puerto Rico ·{" "}
                {conditionLabels[selectedListing.condition] ||
                  selectedListing.condition}
              </p>
              <div className="listing-facts" aria-label="Información transparente del anuncio">
                <span><b>Precio</b>{selectedListing.is_free ? "Gratis ($0)" : `$${Number(selectedListing.price).toLocaleString("en-US")}${selectedListing.is_negotiable ? " · Acepta ofertas" : " · Precio indicado"}`}</span>
                <span><b>Condición</b>{conditionLabels[selectedListing.condition] || selectedListing.condition}</span>
                <span><b>Fotos</b>{selectedListing.image_urls.length} foto{selectedListing.image_urls.length === 1 ? "" : "s"} proporcionada{selectedListing.image_urls.length === 1 ? "" : "s"}</span>
                <span><b>Antigüedad</b>{listingAge(selectedListing.created_at).replace("Publicado ", "")}</span>
              </div>
              <section className="seller-public-card" aria-label="Información pública del vendedor">
                <div className="seller-avatar">{sellerProfile?.avatar_url || selectedListing.seller_avatar_url ? <Image src={sellerProfile?.avatar_url || selectedListing.seller_avatar_url || ""} alt={`Foto de ${sellerProfile?.display_name || selectedListing.seller_display_name || "vendedor"}`} width={104} height={104} unoptimized /> : sellerProfile?.display_name?.slice(0, 1).toUpperCase() || selectedListing.seller_display_name?.slice(0, 1).toUpperCase() || "CV"}</div>
                <div className="seller-public-heading"><span>Vendedor</span><h3>{sellerProfileLoading ? "Cargando perfil…" : sellerProfile?.display_name || selectedListing.seller_display_name || "Miembro de Coquí Ventas"}</h3><p>{sellerProfile?.municipality ? `${sellerProfile.municipality}, Puerto Rico` : "Ubicación exacta protegida"}</p></div>
                <div className="seller-public-rating"><b>{selectedListing.seller_rating ? `★ ${selectedListing.seller_rating.toFixed(1)}` : "☆ Nuevo"}</b><span>{selectedListing.seller_review_count || 0} reseña{selectedListing.seller_review_count === 1 ? "" : "s"} verificada{selectedListing.seller_review_count === 1 ? "" : "s"}</span></div>
                {sellerProfile?.bio && <p className="seller-bio">{sellerProfile.bio}</p>}
                <div className="seller-trust-badges"><span className={sellerProfile?.identity_verified ? "verified" : ""}>{sellerProfile?.identity_verified ? "✓ Identidad verificada" : "Identidad no verificada"}</span><span className={sellerProfile?.phone_verified ? "verified" : ""}>{sellerProfile?.phone_verified ? "✓ Teléfono verificado" : "Teléfono no verificado"}</span>{sellerProfile?.created_at && <span>Miembro desde {new Date(sellerProfile.created_at).toLocaleDateString("es-PR", {month: "short", year: "numeric"})}</span>}</div>
                {selectedListing.seller_id && <button type="button" className="seller-login-prompt" onClick={() => setPublicSellerId(selectedListing.seller_id || null)}>Ver perfil público y sus anuncios</button>}
                {!session && <button type="button" className="seller-login-prompt" onClick={() => setAuthOpen(true)}>Entra para ver el perfil público completo</button>}
                <small>Coquí Ventas nunca muestra documentos, teléfono privado ni dirección exacta.</small>
              </section>
              <div className="detail-description">
                <h3>Descripción</h3>
                <p>{selectedListing.description}</p>
              </div>
              <div className="detail-actions">
                <button type="button" onClick={() => toggleFavorite(selectedListing.id)}>
                  {favoriteIds.has(selectedListing.id) ? "♥ Guardado" : "♡ Guardar"}
                </button>
                <button type="button" onClick={() => shareListing(selectedListing)}>
                  ↗ Compartir
                </button>
                {selectedListing.seller_id && !myListings.some((listing) => listing.id === selectedListing.id) && <button type="button" className={followedSellerIds.has(selectedListing.seller_id) ? "follow-button following" : "follow-button"} onClick={() => toggleFollowSeller(selectedListing.seller_id || "")}>{followedSellerIds.has(selectedListing.seller_id) ? "✓ Siguiendo" : "+ Seguir vendedor"}</button>}
                <button type="button" onClick={() => toggleComparison(selectedListing.id)}>
                  {compareIds.includes(selectedListing.id) ? "✓ En comparación" : "≍ Comparar"}
                </button>
                {!myListings.some((listing) => listing.id === selectedListing.id) && <button type="button" className="report-button" onClick={() => session ? setReportTarget({ kind: "listing", id: selectedListing.id, userId: selectedListing.seller_id, label: selectedListing.title }) : setAuthOpen(true)}>⚑ Reportar</button>}
                {session && myListings.some((listing) => listing.id === selectedListing.id) && (
                  <button type="button" onClick={() => openListingEditor(selectedListing)}>
                    ✎ Editar publicación
                  </button>
                )}
              </div>
              {session && myListings.some((listing) => listing.id === selectedListing.id) ? (
                <div className="owner-notice">Esta es tu publicación. Puedes revisarla, compartirla o editarla.</div>
              ) : selectedListing.status === "sold" ? (
                <div className="sold-notice">Este artículo ya fue vendido. Permanecerá visible durante 24 horas para mostrar la actividad de nuestra comunidad.</div>
              ) : (
                <>
                  {selectedListing.is_negotiable && !selectedListing.is_free && selectedListing.status === "available" && <div className="offer-entry"><button type="button" className="offer-toggle" onClick={() => setOfferOpen((open) => !open)}>{offerOpen ? "Cerrar oferta" : "Hacer una oferta"}</button>{offerOpen && <form onSubmit={submitOffer}><label>Monto de tu oferta<div><span>$</span><input type="number" inputMode="decimal" min="0.01" step="0.01" value={offerAmount} onChange={(event) => setOfferAmount(event.target.value)} placeholder="0.00" required /></div></label><div className="offer-reference"><span>Precio publicado</span><b>${Number(selectedListing.price).toLocaleString("en-US")}</b></div><div className="offer-shortcuts"><button type="button" onClick={() => setOfferAmount(String(Math.round(Number(selectedListing.price) * .9)))}>90% · ${Math.round(Number(selectedListing.price) * .9).toLocaleString("en-US")}</button><button type="button" onClick={() => setOfferAmount(String(Math.round(Number(selectedListing.price) * .85)))}>85% · ${Math.round(Number(selectedListing.price) * .85).toLocaleString("en-US")}</button><button type="button" onClick={() => setOfferAmount(String(Math.round(Number(selectedListing.price) * .8)))}>80% · ${Math.round(Number(selectedListing.price) * .8).toLocaleString("en-US")}</button></div><p>La oferta no reserva el artículo ni cambia su estado a Pendiente. Solo el vendedor puede hacerlo.</p><button className="auth-submit" disabled={busy}>{busy ? "Enviando oferta…" : "Enviar oferta"}</button></form>}{offerMessage && <div className="auth-message" role="status">{offerMessage}</div>}</div>}
                  <div className="message-presets" aria-label="Mensajes rápidos">
                    <button type="button" onClick={() => setContactDraft(`Hola, me interesa ${selectedListing.title}. ¿Todavía está disponible?`)}>¿Está disponible?</button>
                    <button type="button" onClick={() => setContactDraft(`Hola, me interesa ${selectedListing.title}. ¿En qué zona de ${selectedListing.municipality} podríamos coordinar un encuentro público?`)}>Coordinar zona</button>
                    {selectedListing.is_negotiable && <button type="button" onClick={() => setContactDraft(`Hola, me interesa ${selectedListing.title}. Veo que acepta ofertas. ¿Podemos conversar sobre el precio?`)}>Hablar del precio</button>}
                    <button type="button" onClick={() => setContactDraft(`Hola, ¿podrías confirmarme si ${selectedListing.title} tiene algún defecto o detalle adicional que deba conocer?`)}>Preguntar por defectos</button>
                    <button type="button" onClick={() => setContactDraft(`Hola, ¿qué accesorios o piezas están incluidos con ${selectedListing.title}?`)}>Qué incluye</button>
                    <button type="button" onClick={() => setContactDraft(`Hola, ¿puedo probar o revisar ${selectedListing.title} al momento del encuentro?`)}>Solicitar revisión</button>
                  </div>
                  <label className="message-field">
                    Mensaje para el vendedor
                    <textarea
                      value={contactDraft}
                      onChange={(event) => setContactDraft(event.target.value)}
                      maxLength={1000}
                      placeholder="Escribe tu mensaje…"
                    />
                    <small>{contactDraft.length} / 1,000 caracteres</small>
                  </label>
                  <button
                    className="auth-submit contact-button"
                    onClick={contactSeller}
                    disabled={busy}
                  >
                    {busy ? "Enviando…" : selectedListing.status === "pending" ? "Preguntar si vuelve a estar disponible" : "Enviar mensaje"}
                  </button>
                </>
              )}
              {contactMessage && (
                <div className="auth-message" role="status">
                  {contactMessage}
                </div>
              )}
              <small className="safety-note">
                Coordina de día, en lugares públicos, iluminados y concurridos. No compartas dirección exacta, documentos ni información financiera. Coqui Ventas no garantiza la seguridad absoluta del encuentro.
              </small>
              <div className="buyer-safety-checklist"><b>Antes de coordinar</b><span>✓ Confirma condición, precio y qué incluye.</span><span>✓ Mantén la conversación dentro de Coquí Ventas.</span><span>✓ No envíes depósitos ni códigos de verificación.</span><span>✓ Revisa el artículo antes de completar la compra.</span><span>✓ Usa un lugar público durante el día.</span></div>
              <div className="communication-note"><b>Comunicación transparente</b><span>Aceptar una oferta no marca automáticamente el artículo como Pendiente.</span><span>Coquí Ventas no procesa el pago entre comprador y vendedor en esta fase.</span></div>
              <div className="transparency-note"><b>Transparencia Coqui</b><span>El precio debe estar visible; nunca es necesario escribir por mensaje para conocerlo.</span><span>Las reseñas solo se habilitan después de transacciones verificables.</span><span>Verificación, reputación y decisiones administrativas no se compran.</span></div>
              {similarListings.length > 0 && <div className="similar-listings"><h3>Publicaciones similares</h3>{similarListings.map((listing) => <button type="button" key={listing.id} onClick={() => openListing(listing)}><span>{listing.image_urls[0] ? <Image src={listing.image_urls[0]} alt="" width={112} height={84} unoptimized /> : "📦"}</span><b>{listing.title}</b><small>{listing.is_free ? "Gratis" : `$${Number(listing.price).toLocaleString("en-US")}`} · {listing.municipality}</small></button>)}</div>}
            </div>
          </section>
        </div>
      )}
      {publicSellerId && publicSellerLead && <div className="modal-backdrop seller-profile-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setPublicSellerId(null)}><section className="public-seller-modal" role="dialog" aria-modal="true" aria-labelledby="public-seller-title" aria-describedby="public-seller-description"><button className="modal-close" type="button" onClick={() => setPublicSellerId(null)} aria-label="Cerrar perfil público">×</button><header><span className="public-seller-avatar">{publicSellerLead.seller_avatar_url ? <Image src={publicSellerLead.seller_avatar_url} alt={`Foto de ${publicSellerLead.seller_display_name || "vendedor"}`} width={144} height={144} unoptimized /> : (publicSellerLead.seller_display_name || "CV").slice(0, 1).toUpperCase()}</span><div><span className="eyebrow">Perfil público</span><h2 id="public-seller-title">{publicSellerLead.seller_display_name || "Miembro de Coquí Ventas"}</h2><p id="public-seller-description">Solo mostramos información relacionada con su actividad pública en Coquí Ventas.</p></div></header><section className="public-seller-reputation verified" aria-label="Resumen de reputación"><div><span className="public-seller-stars" aria-label={publicSellerRating ? `${publicSellerRating.toFixed(1)} de 5 estrellas` : "Vendedor nuevo sin reseñas"}>{publicSellerRating ? "★★★★★" : "☆☆☆☆☆"}</span><b>{publicSellerRating ? publicSellerRating.toFixed(1) : "Nuevo"}</b></div><p>Reputación visible · {publicSellerReviewCount} reseña{publicSellerReviewCount === 1 ? "" : "s"} de transacciones verificables</p></section><div className="public-seller-stats"><article><b>{publicSellerListings.length}</b><span>Publicaciones visibles</span></article><article><b>{publicSellerTowns.length || 1}</b><span>Pueblo{publicSellerTowns.length === 1 ? "" : "s"} publicado{publicSellerTowns.length === 1 ? "" : "s"}</span></article><article><b>{publicSellerAvailableCount}</b><span>Disponible{publicSellerAvailableCount === 1 ? "" : "s"} ahora</span></article></div><div className="public-seller-statuses" aria-label="Estado de publicaciones"><span>{publicSellerAvailableCount} disponible{publicSellerAvailableCount === 1 ? "" : "s"}</span>{publicSellerPendingCount > 0 && <span>{publicSellerPendingCount} pendiente{publicSellerPendingCount === 1 ? "" : "s"}</span>}{publicSellerSoldCount > 0 && <span>{publicSellerSoldCount} vendido{publicSellerSoldCount === 1 ? "" : "s"} · visibles por 24 h</span>}</div><div className="public-seller-listings"><h3>Publicaciones de este vendedor</h3>{publicSellerListings.map((listing) => <button type="button" key={listing.id} aria-label={`Ver ${listing.title}, ${listingStatusLabels[listing.status || "available"]}`} onClick={() => { setPublicSellerId(null); openListing(listing); }}><span>{listing.image_urls[0] ? <Image src={listing.image_urls[0]} alt="" width={112} height={84} unoptimized /> : "📦"}</span><div><b>{listing.title}</b><small>{listing.is_free ? "Gratis" : `$${Number(listing.price).toLocaleString("en-US")}`} · {listing.municipality}</small><em>{listingAge(listing.created_at)}</em></div><i className={`seller-listing-status ${listing.status || "available"}`}>{listingStatusLabels[listing.status || "available"]}</i></button>)}</div><footer><b>Tu privacidad primero.</b> La dirección exacta, correo, teléfono y documentos del usuario nunca aparecen en este perfil.</footer></section></div>}
      {compareIds.length > 0 && <aside className="compare-tray" aria-label="Comparación de publicaciones"><div><b>{compareIds.length} de 3 seleccionadas</b><span>Compara precio, condición y pueblo.</span></div><div className="compare-tray-actions"><button type="button" onClick={() => setCompareIds([])}>Limpiar</button><button type="button" className="open-compare" onClick={() => setComparisonOpen(true)} disabled={compareIds.length < 2}>Comparar ahora</button></div></aside>}
      {comparisonOpen && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setComparisonOpen(false)}><section className="comparison-modal" role="dialog" aria-modal="true" aria-labelledby="comparison-title"><button className="modal-close" type="button" onClick={() => setComparisonOpen(false)} aria-label="Cerrar">×</button><span className="eyebrow">Decide con claridad</span><h2 id="comparison-title">Comparar publicaciones</h2><div className="demo-ratings-banner">Transparencia real · Solo se muestran reseñas de transacciones verificables.</div><div className="comparison-grid">{comparisonListings.map((listing) => <article key={listing.id}>{listing.image_urls[0] ? <Image src={listing.image_urls[0]} alt={listing.title} width={640} height={480} unoptimized /> : <span className="compare-placeholder">📦</span>}<h3>{listing.title}</h3><strong>{listing.is_free ? "Gratis" : `$${Number(listing.price).toLocaleString("en-US")}`}</strong><div className="seller-rating rated"><span className="rating-stars" aria-label={listing.seller_rating ? `${listing.seller_rating.toFixed(1)} de 5 estrellas` : "Vendedor nuevo sin reseñas"}>{listing.seller_rating ? "★★★★★" : "☆☆☆☆☆"}</span><b>{listing.seller_rating?.toFixed(1) || "Nuevo"}</b><small>{listing.seller_review_count || 0} reseña{listing.seller_review_count === 1 ? "" : "s"} verificada{listing.seller_review_count === 1 ? "" : "s"}</small></div><dl><div><dt>Estado</dt><dd>{listingStatusLabels[listing.status || "available"]}</dd></div><div><dt>Condición</dt><dd>{conditionLabels[listing.condition] || listing.condition}</dd></div><div><dt>Pueblo</dt><dd>{listing.municipality}</dd></div><div><dt>Ofertas</dt><dd>{listing.is_negotiable ? "Sí" : "No"}</dd></div><div><dt>Fotos</dt><dd>{listing.image_urls.length}</dd></div></dl><button type="button" onClick={() => { setComparisonOpen(false); openListing(listing); }}>Ver publicación</button><button type="button" className="remove-compare" onClick={() => toggleComparison(listing.id)}>Quitar</button></article>)}</div><p className="verified-review-note">★ Solo cuentan reseñas posteriores a transacciones verificables en Coquí Ventas.</p></section></div>}
      {publishedListing && (
        <div className="modal-backdrop">
          <section className="auth-modal publish-success" role="dialog" aria-modal="true" aria-labelledby="publish-success-title">
            <span className="success-icon">✓</span>
            <span className="eyebrow">Publicación completada</span>
            <h2 id="publish-success-title">¡Tu anuncio ya está publicado!</h2>
            <p>¿Quieres verlo ahora para confirmar que todo quedó como deseas?</p>
            <div className="success-actions">
              <button className="auth-submit" type="button" onClick={() => {
                const listing = publishedListing;
                setPublishedListing(null);
                openListing(listing);
              }}>Ver mi publicación</button>
              <button className="secondary-button" type="button" onClick={() => setPublishedListing(null)}>Ahora no</button>
            </div>
          </section>
        </div>
      )}
      {editingListing && (
        <div className="modal-backdrop">
          <section className="auth-modal publish-modal" role="dialog" aria-modal="true" aria-labelledby="edit-listing-title">
            <button className="modal-close" type="button" onClick={() => setEditingListing(null)} aria-label="Cerrar">×</button>
            <span className="eyebrow">Tu publicación</span>
            <h2 id="edit-listing-title">Editar anuncio</h2>
            <p>Corrige la información y guarda los cambios.</p>
            <form onSubmit={handleEditListing}>
              <label>Categoría
                <select name="category_id" defaultValue={editingListing.category_id} required>
                  {categoriesData.filter((category) => category.id !== FREE_CATEGORY_ID).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                </select>
              </label>
              <label>Título<input name="title" defaultValue={editingListing.title} required minLength={4} maxLength={120} /></label>
              <label>Descripción<textarea name="description" defaultValue={editingListing.description} required minLength={10} maxLength={2000} /></label>
              <label>Pueblo<select name="municipality" defaultValue={editingListing.municipality} required>{municipalities.map((town) => <option key={town} value={town}>{town}</option>)}</select></label>
              <div className="form-row">
                <label>Condición<select name="condition" defaultValue={editingListing.condition}><option value="new">Nuevo</option><option value="like_new">Como nuevo</option><option value="good">Bueno</option><option value="fair">Aceptable</option></select></label>
                <label>Precio<input name="price" type="number" min="0.01" step="0.01" defaultValue={editingListing.price || ""} disabled={editingIsFree} required={!editingIsFree} /></label>
              </div>
              <div className="checks">
                <label><input name="is_free" type="checkbox" checked={editingIsFree} onChange={(event) => setEditingIsFree(event.target.checked)} /> Es gratis</label>
                <label><input name="is_negotiable" type="checkbox" defaultChecked={editingListing.is_negotiable} disabled={editingIsFree} /> Acepto ofertas</label>
              </div>
              <button className="auth-submit" disabled={busy}>{busy ? "Guardando…" : "Guardar cambios"}</button>
            </form>
            {accountMessage && <div className="auth-message" role="status">{accountMessage}</div>}
          </section>
        </div>
      )}
      {actionMessage && (
        <button className="action-toast" type="button" onClick={() => setActionMessage("")}>
          {actionMessage} <span>×</span>
        </button>
      )}
      <nav className="mobile-bottom-nav" aria-label="Navegación principal">
        <a href="#inicio" aria-label="Inicio"><span>⌂</span>Inicio</a>
        <a href="#explorar" aria-label="Explorar"><span>⌕</span>Explorar</a>
        <button type="button" className="mobile-publish" onClick={openPublish}><span>▣</span>Publicar</button>
        <button type="button" onClick={() => openDiscover("today")}><span>⌖</span>Descubre</button>
        <button type="button" onClick={() => openAccount("profile")}><span>♡</span>Mi Coqui</button>
      </nav>
    </main>
  );
}
