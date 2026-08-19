// =============================================================
// Checkout único — todos os CTAs do site usam este módulo.
//
// 🔧 ONDE ALTERAR:
//   - CHECKOUT URL .......... HOTMART_CHECKOUT_URL (abaixo)
//   - NOME DO PRODUTO ....... PRODUCT_NAME
//   - CATEGORIA ............. PRODUCT_CATEGORY
//   - VALOR ................. PRODUCT_VALUE
//   - MOEDA ................. PRODUCT_CURRENCY
//   - CAMPANHA (UTMs) ....... CAMPAIGN_PARAMS
// =============================================================
import { trackInitiateCheckout } from "./metaPixel";
import { appendTrackingParamsToUrl } from "./tracking";
import { isHotmartOverlayOpen } from "./hotmartWidget";

// Link base do checkout Hotmart (checkoutMode=2 = widget/overlay)
export const HOTMART_CHECKOUT_URL =
  "https://pay.hotmart.com/U106561488W?checkoutMode=2";

// Dados do produto (usados nos eventos de tracking)
export const PRODUCT_NAME =
  "Protocolo Escolar Neuroinclusivo para Crianças Autistas";
export const PRODUCT_CATEGORY = "E-book / Educação Inclusiva / Autismo";
export const PRODUCT_CURRENCY = "BRL";
export const PRODUCT_VALUE = 47.0;

// Parâmetros de campanha padrão — só entram se ainda não vierem da URL do visitante
export const CAMPAIGN_PARAMS: Record<string, string> = {
  src: "site_lovable",
  utm_source: "site",
  utm_medium: "checkout_button",
  utm_campaign: "protocolo_autismo_escolar",
  utm_content: "botao_comprar_agora",
};

/**
 * Monta o link final do checkout:
 * 1. preserva utm_*, fbclid, gclid, src e sck capturados do visitante;
 * 2. completa com os parâmetros padrão de campanha que faltarem.
 */
export function buildCheckoutUrl(overrides: Record<string, string> = {}): string {
  const withVisitorParams = appendTrackingParamsToUrl(HOTMART_CHECKOUT_URL);
  try {
    const url = new URL(withVisitorParams);
    for (const [key, value] of Object.entries({ ...CAMPAIGN_PARAMS, ...overrides })) {
      if (!url.searchParams.get(key)) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return withVisitorParams;
  }
}

/**
 * Dispara InitiateCheckout (Meta Pixel) + begin_checkout (GA4).
 * NUNCA dispara Purchase — isso é responsabilidade da Hotmart.
 *
 * @param label rótulo do CTA (ex.: "Hero · Comprar agora")
 * @param value valor reportado (padrão: PRODUCT_VALUE)
 */
export function trackCheckoutIntent(label: string, value: number = PRODUCT_VALUE) {
  // [Meta Pixel] InitiateCheckout — só se o pixel estiver carregado (pós-consent LGPD)
  trackInitiateCheckout(value, label);

  // [GA4] begin_checkout
  const w = window as any;
  if (w.gtag) {
    w.gtag("event", "begin_checkout", {
      event_category: "ecommerce",
      event_label: label,
      items: [{ item_name: PRODUCT_NAME, item_category: PRODUCT_CATEGORY, price: value }],
      currency: PRODUCT_CURRENCY,
      value,
    });
  }
}

/**
 * Handler único de checkout usado por TODOS os CTAs.
 * Deixa o widget da Hotmart abrir o overlay; se ele não abrir
 * (bloqueio de script, rede lenta), redireciona para o checkout.
 */
export function handleCheckoutClick(label: string, value: number = PRODUCT_VALUE) {
  trackCheckoutIntent(label, value);

  const finalUrl = buildCheckoutUrl();

  window.setTimeout(() => {
    if (!isHotmartOverlayOpen()) window.location.href = finalUrl;
  }, 700);
}
