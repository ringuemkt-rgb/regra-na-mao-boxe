// =============================================================
// Camada única de analytics — respeita consentimento LGPD.
//
// Nada de marketing/analytics é carregado antes do aceite.
// Configuração de IDs: src/config/analytics.ts
//
// Eventos padronizados do portal:
//   page_view, article_view, newsletter_signup,
//   product_cta_click, outbound_click, faq_open
// =============================================================
import {
  ACTIVE_CHANNEL,
  GA4_MEASUREMENT_ID,
  GTM_CONTAINER_ID,
} from "@/config/analytics";
import { getConsent } from "./tracking";

let loaded = false;

function w(): any {
  return typeof window === "undefined" ? null : (window as any);
}

/** Carrega o medidor ativo (uma única vez, somente pós-consentimento). */
export function loadAnalytics() {
  const win = w();
  if (!win || loaded) return;
  if (getConsent() !== "granted") return;
  if (ACTIVE_CHANNEL === "none") return;

  loaded = true;

  if (ACTIVE_CHANNEL === "ga4") {
    win.dataLayer = win.dataLayer || [];
    win.gtag = function () {
      win.dataLayer.push(arguments);
    };
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(s);
    win.gtag("js", new Date());
    // send_page_view: false → page_view é disparado manualmente por rota,
    // evitando duplicidade em navegação SPA.
    win.gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false });
    return;
  }

  if (ACTIVE_CHANNEL === "gtm") {
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`;
    document.head.appendChild(s);
  }
}

/** Evento genérico — no-op sem consentimento. */
export function trackEvent(name: string, params: Record<string, any> = {}) {
  const win = w();
  if (!win || getConsent() !== "granted") return;
  if (win.gtag && ACTIVE_CHANNEL === "ga4") win.gtag("event", name, params);
  else if (win.dataLayer) win.dataLayer.push({ event: name, ...params });
}

/** page_view manual — exatamente um por rota. */
export function trackPageViewGa(path: string, title?: string) {
  trackEvent("page_view", {
    page_path: path,
    page_location: typeof window !== "undefined" ? window.location.href : path,
    page_title: title ?? (typeof document !== "undefined" ? document.title : ""),
  });
}

export function trackArticleView(slug: string, title: string, category?: string) {
  trackEvent("article_view", { post_slug: slug, post_title: title, category });
}

export function trackNewsletterSignup(source: string) {
  trackEvent("newsletter_signup", { method: "round_semanal", source });
}

export function trackOutboundClick(url: string, label: string, type = "external") {
  trackEvent("outbound_click", { target_url: url, label, target_type: type });
}
