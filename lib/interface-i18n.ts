import { useEffect } from "react";

type TranslationRecord = { source: string; translated: string };

const english: Record<string, string> = {
  "Compra · Vende · Confía": "Buy · Sell · Trust",
  "Abrir menú": "Open menu",
  "Explorar": "Explore",
  "Categorías": "Categories",
  "Seguridad": "Safety",
  "Gratis": "Free",
  "Favoritos": "Favorites",
  "Avisos": "Alerts",
  "Mensajes": "Messages",
  "Soy patrono": "I'm an employer",
  "Mi Coquí": "My Coquí",
  "Publicar": "Post",
  "Salir": "Sign out",
  "Entrar": "Sign in",
  "Promociones destacadas": "Featured promotions",
  "Publicidad · Demostración": "Advertisement · Demo",
  "Promoción anterior": "Previous promotion",
  "Próxima promoción": "Next promotion",
  "Elegir promoción": "Choose promotion",
  "Reanudar promociones": "Resume promotions",
  "Pausar promociones": "Pause promotions",
  "El marketplace hecho para Puerto Rico": "The marketplace made for Puerto Rico",
  "Todo Puerto Rico,": "All of Puerto Rico,",
  "más cerca de ti.": "closer to you.",
  "Compra, vende, encuentra empleo y apoya lo nuestro en una comunidad moderna, local y segura.": "Buy, sell, find work, and support local in a modern, secure community.",
  "Qué estás buscando": "What are you looking for",
  "¿Qué estás buscando?": "What are you looking for?",
  "Pueblo": "Municipality",
  "Todo Puerto Rico": "All Puerto Rico",
  "Buscar": "Search",
  "Limpiar búsqueda ×": "Clear search ×",
  "¿Tienes algo para vender?": "Have something to sell?",
  "Publicar un artículo": "Post an item",
  "✓ Publicar es fácil": "✓ Posting is easy",
  "✓ Sin comisión por venta": "✓ No sales commission",
  "✓ Comunidad local": "✓ Local community",
  "Profesionales y trabajadores de Puerto Rico": "Professionals and workers of Puerto Rico",
  "Explora a tu manera": "Explore your way",
  "Un lugar para todo lo nuestro": "One place for everything local",
  "Ver todas →": "View all →",
  "Marketplace": "Marketplace",
  "Compra y vende cerca de ti": "Buy and sell near you",
  "Empleos": "Jobs",
  "Oportunidades con salario claro": "Opportunities with clear salary information",
  "Adopción responsable": "Responsible adoption",
  "Hecho en Puerto Rico": "Made in Puerto Rico",
  "Productos y cosechas locales": "Local products and harvests",
  "Servicios": "Services",
  "Profesionales cerca de ti": "Professionals near you",
  "Arte y cultura": "Arts and culture",
  "Talento, talleres y eventos": "Talent, workshops, and events",
  "Explorar Marketplace": "Explore Marketplace",
  "Explorar Hecho en Puerto Rico": "Explore Made in Puerto Rico",
  "Explorar Servicios": "Explore Services",
  "Explorar Arte y cultura": "Explore Arts and culture",
  "Sello Producto Local Verificado de Coquí Ventas": "Coquí Ventas Verified Local Product seal",
  "Sabor de aquí": "Local flavor",
  "Tu mañana comienza en Puerto Rico": "Your morning starts in Puerto Rico",
  "Café artesanal y repostería fresca": "Artisan coffee and fresh pastries",
  "Conocer el menú": "View the menu",
  "Muévete con confianza": "Move with confidence",
  "Tu próximo vehículo te espera": "Your next vehicle is waiting",
  "Alternativas familiares y financiamiento": "Family-friendly options and financing",
  "Ver inventario": "View inventory",
  "Energía para tu hogar": "Energy for your home",
  "Prepárate para vivir con más respaldo": "Get ready for more energy security",
  "Evaluación solar inicial sin costo": "Free initial solar assessment",
  "Solicitar orientación": "Request guidance",
  "Clasificados cerca de ti": "Classifieds near you",
  "Encuentra lo que necesitas": "Find what you need",
  "Filtros": "Filters",
  "Ocultar filtros": "Hide filters",
  "Mostrar filtros": "Show filters",
  "Categoría": "Category",
  "Todas las categorías": "All categories",
  "Condición": "Condition",
  "Todas las condiciones": "All conditions",
  "Nuevo": "New",
  "Como nuevo": "Like new",
  "Bueno": "Good",
  "Usado": "Used",
  "Para piezas": "For parts",
  "Estado": "Status",
  "Todos los estados": "All statuses",
  "Disponible": "Available",
  "Pendiente": "Pending",
  "Vendido": "Sold",
  "Acepta ofertas": "Accepts offers",
  "Solo gratis": "Free only",
  "Precio mínimo": "Minimum price",
  "Precio máximo": "Maximum price",
  "Cualquier fecha": "Any date",
  "Hoy": "Today",
  "Últimos 7 días": "Last 7 days",
  "Últimos 30 días": "Last 30 days",
  "Más recientes": "Newest",
  "Precio: menor a mayor": "Price: low to high",
  "Precio: mayor a menor": "Price: high to low",
  "Mejor reputación": "Best reputation",
  "Limpiar filtros": "Clear filters",
  "Tarjetas": "Cards",
  "Compacta": "Compact",
  "Cargar más": "Load more",
  "No encontramos publicaciones": "No listings found",
  "Prueba cambiando o limpiando los filtros.": "Try changing or clearing the filters.",
  "Imagen de prueba": "Sample image",
  "Imagen del anuncio": "Listing image",
  "Negociable": "Negotiable",
  "Ver perfil": "View profile",
  "Miembro de Coquí Ventas": "Coquí Ventas member",
  "Favorito": "Favorite",
  "Quitar de favoritos": "Remove from favorites",
  "Agregar a favoritos": "Add to favorites",
  "Compartir": "Share",
  "Comparar": "Compare",
  "Ver anuncio": "View listing",
  "Contactar al vendedor": "Contact seller",
  "Enviar mensaje": "Send message",
  "Escribe un mensaje para el vendedor.": "Write a message to the seller.",
  "¡Mensaje enviado al vendedor!": "Message sent to the seller!",
  "No se pudo contactar al vendedor.": "The seller could not be contacted.",
  "Reportar anuncio": "Report listing",
  "Reportar": "Report",
  "Cerrar": "Close",
  "Cancelar": "Cancel",
  "Guardar": "Save",
  "Continuar": "Continue",
  "Volver": "Back",
  "Confirmar": "Confirm",
  "Eliminar": "Delete",
  "Editar": "Edit",
  "Actualizando…": "Updating…",
  "Cargando…": "Loading…",
  "Enviando…": "Sending…",
  "Guardando…": "Saving…",
  "Algo salió mal. Intenta nuevamente.": "Something went wrong. Please try again.",
  "No se pudo completar la solicitud.": "The request could not be completed.",
  "Centro de seguridad": "Safety Center",
  "Compra y vende con confianza": "Buy and sell with confidence",
  "Consejos de seguridad": "Safety tips",
  "Nunca envíes dinero por adelantado.": "Never send money in advance.",
  "Reúnete en un lugar público y seguro.": "Meet in a safe public place.",
  "Revisa el artículo antes de pagar.": "Inspect the item before paying.",
  "Confía en tus instintos y reporta actividad sospechosa.": "Trust your instincts and report suspicious activity.",
  "Crear una cuenta": "Create an account",
  "Iniciar sesión": "Sign in",
  "Correo electrónico": "Email address",
  "Contraseña": "Password",
  "Mostrar contraseña": "Show password",
  "Ocultar contraseña": "Hide password",
  "¿Olvidaste tu contraseña?": "Forgot your password?",
  "Recuperar contraseña": "Reset password",
  "Enviar enlace": "Send link",
  "Nueva contraseña": "New password",
  "Confirmar contraseña": "Confirm password",
  "Actualizar contraseña": "Update password",
  "Nombre completo": "Full name",
  "Crear cuenta": "Create account",
  "¿Ya tienes cuenta?": "Already have an account?",
  "¿No tienes cuenta?": "Don't have an account?",
  "Tu cuenta": "Your account",
  "Mi perfil": "My profile",
  "Mis publicaciones": "My listings",
  "Mis favoritos": "My favorites",
  "Mis mensajes": "My messages",
  "Mis ofertas": "My offers",
  "Mis ventas": "My sales",
  "Reseñas": "Reviews",
  "Notificaciones": "Notifications",
  "Privacidad y seguridad": "Privacy and security",
  "Foto de perfil": "Profile photo",
  "Subir foto": "Upload photo",
  "Cambiar foto": "Change photo",
  "Eliminar foto": "Remove photo",
  "Nombre público": "Public name",
  "Biografía": "Bio",
  "Teléfono": "Phone",
  "Guardar perfil": "Save profile",
  "Cerrar sesión": "Sign out",
  "Eliminar cuenta": "Delete account",
  "Descargar mis datos": "Download my data",
  "Todos": "All",
  "No leídos": "Unread",
  "Marcar como leído": "Mark as read",
  "No tienes avisos nuevos.": "You have no new alerts.",
  "No tienes mensajes todavía.": "You don't have any messages yet.",
  "Escribe un mensaje…": "Write a message…",
  "Oferta": "Offer",
  "Contraoferta": "Counteroffer",
  "Hacer oferta": "Make an offer",
  "Enviar contraoferta": "Send counteroffer",
  "Aceptar oferta": "Accept offer",
  "Rechazar oferta": "Reject offer",
  "Oferta aceptada": "Offer accepted",
  "Oferta rechazada": "Offer rejected",
  "Recibidas": "Received",
  "Enviadas": "Sent",
  "Activas": "Active",
  "Cerradas": "Closed",
  "Completar venta": "Complete sale",
  "Marcar como vendido": "Mark as sold",
  "Vendido dentro de Coquí Ventas": "Sold through Coquí Ventas",
  "Vendido fuera de Coquí Ventas": "Sold outside Coquí Ventas",
  "Escoge el comprador": "Choose the buyer",
  "Dejar una reseña": "Leave a review",
  "Califica tu experiencia": "Rate your experience",
  "Comentario": "Comment",
  "Enviar reseña": "Submit review",
  "Publica tu anuncio": "Post your listing",
  "Cuéntanos qué vendes": "Tell us what you're selling",
  "Añade información clara y fotos reales. Coquí Ventas validará todo antes de publicarlo.": "Add clear information and real photos. Coquí Ventas will review everything before publishing it.",
  "Selecciona una categoría": "Select a category",
  "Título": "Title",
  "Ej. Generador inverter 3500W": "Example: 3500W inverter generator",
  "Descripción": "Description",
  "Describe el artículo con claridad…": "Describe the item clearly…",
  "Escoge tu pueblo": "Choose your municipality",
  "Usar mi ubicación actual": "Use my current location",
  "Precio": "Price",
  "Es gratis": "It's free",
  "Fotos reales (1–8)": "Real photos (1–8)",
  "La primera será la foto principal · máximo 10 MB por foto": "The first will be the main photo · maximum 10 MB per photo before optimization",
  "Publicar anuncio": "Post listing",
  "Vista previa": "Preview",
  "Tu anuncio fue publicado": "Your listing was posted",
  "¿Quieres ver tu publicación?": "Would you like to view your listing?",
  "Ver mi publicación": "View my listing",
  "Seguir explorando": "Keep exploring",
  "Editar publicación": "Edit listing",
  "Guardar cambios": "Save changes",
  "No pudimos cargar las categorías. Intenta nuevamente.": "We couldn't load the categories. Please try again.",
  "Adopción y rescate responsable": "Responsible adoption and rescue",
  "Adopta, encuentra un hogar responsable o ayuda a un animal rescatado.": "Adopt, find a responsible home, or help a rescued animal.",
  "Conocer las Huellitas": "Meet the Huellitas",
  "Modelo oficial · Bella": "Official model · Bella",
  "Huellitas de Amor": "Huellitas de Amor",
  "Encuentra un nuevo integrante para tu familia": "Find a new member for your family",
  "Todos los animales": "All animals",
  "Todas las especies": "All species",
  "Perro": "Dog",
  "Gato": "Cat",
  "Otro": "Other",
  "En adopción": "For adoption",
  "Necesita ayuda": "Needs help",
  "Conocer": "Meet",
  "Solicitar adopción": "Apply to adopt",
  "Ayudar con gastos": "Help with expenses",
  "Portal de organizaciones": "Organization portal",
  "Organizaciones sin fines de lucro": "Nonprofit organizations",
  "Registrar organización": "Register organization",
  "Nombre de la organización": "Organization name",
  "Información de contacto": "Contact information",
  "Municipio principal": "Primary municipality",
  "Descripción de la misión": "Mission description",
  "Guardar organización": "Save organization",
  "Administrar publicaciones": "Manage listings",
  "Publicar una Huellita": "Post a Huellita",
  "Nombre del animal": "Animal name",
  "Especie": "Species",
  "Edad": "Age",
  "Historia": "Story",
  "Necesidades médicas": "Medical needs",
  "Publicar Huellita": "Post Huellita",
  "Regresar a los clasificados de compra y venta": "Back to buy-and-sell classifieds",
  "Presencial": "On-site",
  "Híbrido": "Hybrid",
  "Remoto": "Remote",
  "Recibida": "Received",
  "En revisión": "Under review",
  "Candidato": "Candidate",
  "Perfil profesional": "Professional profile",
  "Patrono verificado": "Verified employer",
  "Historial profesional disponible": "Professional history available",
  "Perfil Quick Click": "Quick Click profile",
  "Perfil Quick Click guardado": "Quick Click profile saved",
  "Panel del patrono": "Employer dashboard",
  "Job Tracker": "Job Tracker",
  "Mis solicitudes": "My applications",
  "Vistas de tu perfil": "Your profile views",
  "Solicitud enviada": "Application submitted",
  "Solicitar con Quick Click": "Apply with Quick Click",
  "Requisitos": "Requirements",
  "Salario": "Salary",
  "Modalidad": "Work arrangement",
  "Tipo de empleo": "Employment type",
  "Compañía": "Company",
  "Fecha de publicación": "Posted date",
  "Solicitar ahora": "Apply now",
  "Tu privacidad importa": "Your privacy matters",
  "Política de privacidad": "Privacy policy",
  "Términos de uso": "Terms of use",
  "Ayuda": "Help",
  "Contacto": "Contact",
  "Todos los derechos reservados.": "All rights reserved."
};

const textRecords = new WeakMap<Text, TranslationRecord>();
const attributeRecords = new WeakMap<Element, Map<string, TranslationRecord>>();
const translatedAttributes = ["placeholder", "aria-label", "title", "alt"] as const;

export function translateInterfaceText(value: string): string {
  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  const source = value.trim();
  if (!source) return value;
  if (english[source]) return `${leading}${english[source]}${trailing}`;

  const patterns: Array<[RegExp, (...parts: string[]) => string]> = [
    [/^Mostrando (\d+) de (\d+)$/, (shown, total) => `Showing ${shown} of ${total}`],
    [/^(\d+) fotos?$/, (count) => `${count} photo${count === "1" ? "" : "s"}`],
    [/^Publicado hace (.+)$/, (time) => `Posted ${translateTime(time)} ago`],
    [/^hace (.+)$/, (time) => `${translateTime(time)} ago`],
    [/^(\d+) notificaciones? sin leer$/, (count) => `${count} unread notification${count === "1" ? "" : "s"}`],
    [/^(\d+) empleos? disponibles?$/, (count) => `${count} job${count === "1" ? "" : "s"} available`],
    [/^(\d+) perfiles de candidatos$/, (count) => `${count} candidate profile${count === "1" ? "" : "s"}`],
    [/^Explorar (.+)$/, (label) => `Explore ${english[label] || label}`],
    [/^Ver promoción de (.+)$/, (business) => `View promotion from ${business}`],
    [/^Solicitó: (.+)$/, (job) => `Applied to: ${job}`],
  ];
  for (const [pattern, replacement] of patterns) {
    const match = source.match(pattern);
    if (match) return `${leading}${replacement(...match.slice(1))}${trailing}`;
  }
  return value;
}

function translateTime(value: string): string {
  return value
    .replace(/\buna hora\b/g, "1 hour")
    .replace(/\b(\d+) horas?\b/g, "$1 hours")
    .replace(/\bun día\b/g, "1 day")
    .replace(/\b(\d+) días?\b/g, "$1 days")
    .replace(/\bun minuto\b/g, "1 minute")
    .replace(/\b(\d+) minutos?\b/g, "$1 minutes")
    .replace(/\bunos segundos\b/g, "a few seconds");
}

function translateTextNode(node: Text, toEnglish: boolean) {
  const current = node.data;
  const record = textRecords.get(node);
  if (!toEnglish) {
    if (record && current === record.translated) node.data = record.source;
    textRecords.delete(node);
    return;
  }
  if (record && current === record.translated) return;
  const translated = translateInterfaceText(current);
  if (translated !== current) {
    textRecords.set(node, { source: current, translated });
    node.data = translated;
  }
}

function translateAttribute(element: Element, attribute: string, toEnglish: boolean) {
  const current = element.getAttribute(attribute);
  if (current === null) return;
  const records = attributeRecords.get(element);
  const record = records?.get(attribute);
  if (!toEnglish) {
    if (record && current === record.translated) element.setAttribute(attribute, record.source);
    records?.delete(attribute);
    return;
  }
  if (record && current === record.translated) return;
  const translated = translateInterfaceText(current);
  if (translated !== current) {
    const nextRecords = records || new Map<string, TranslationRecord>();
    nextRecords.set(attribute, { source: current, translated });
    attributeRecords.set(element, nextRecords);
    element.setAttribute(attribute, translated);
  }
}

function translateTree(root: Node, toEnglish: boolean) {
  if (root.nodeType === Node.TEXT_NODE) {
    const parent = root.parentElement;
    if (parent && !parent.closest("script, style, noscript, [data-no-interface-translation]")) translateTextNode(root as Text, toEnglish);
    return;
  }
  if (!(root instanceof Element) && root !== document.body) return;
  const element = root instanceof Element ? root : document.body;
  if (element.closest?.("[data-no-interface-translation]")) return;
  for (const attribute of translatedAttributes) translateAttribute(element, attribute, toEnglish);
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    translateTextNode(node as Text, toEnglish);
    node = walker.nextNode();
  }
  element.querySelectorAll("[placeholder], [aria-label], [title], [alt]").forEach((child) => {
    for (const attribute of translatedAttributes) translateAttribute(child, attribute, toEnglish);
  });
}

export function useInterfaceLanguage(language: "es" | "en") {
  useEffect(() => {
    const toEnglish = language === "en";
    document.documentElement.lang = language;
    translateTree(document.body, toEnglish);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") translateTree(mutation.target, toEnglish);
        else if (mutation.type === "attributes") translateAttribute(mutation.target as Element, mutation.attributeName || "", toEnglish);
        else mutation.addedNodes.forEach((node) => translateTree(node, toEnglish));
      }
    });
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: [...translatedAttributes],
    });
    return () => observer.disconnect();
  }, [language]);
}
