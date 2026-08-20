// =============================================================
// Checkout Hotmart — BOXE DE CRIA
//
// 🔧 ONDE ALTERAR link/preço/nome/categoria de cada produto:
//    src/config/products.ts (fonte de verdade única)
//    Campanha padrão (UTMs): CAMPAIGN_PARAMS abaixo.
//
// Regras:
//  - cada CTA vai para o checkout DO SEU produto;
//  - utm_*, fbclid, gclid, src e sck são preservados;
//  - antes de sair, dispara InitiateCheckout (Meta) e
//    begin_checkout (GA4). Purchase é só na Hotmart.
// =============================================================
import { Product, PRODUCTS, ProductId } from "@/config/products";
import { trackInitiateCheckout } from "./metaPixel";
import { appendTrackingParamsToUrl } from "./tracking";
import { trackEvent } from "./analytics";
import { logOutboundClick } from "./blog";

// Parâmetros de campanha padrão — só entram se não vierem da URL do visitante
export const CAMPAIGN_PARAMS: Record<string, string> = {
  src: "site_lovable",
  utm_source: "site",
  utm_medium: "checkout_button",
  utm_campaign: "boxe_de_cria_manuais",
};

export function resolveProduct(product: Product | ProductId): Product {
  return typeof product === "string" ? PRODUCTS[product] : product;
}

/** Monta o link final do checkout do produto, preservando tracking. */
export function buildCheckoutUrl(
  product: Product | ProductId,
  overrides: Record<string, string> = {},
): string {
  const p = resolveProduct(product);
  const withVisitorParams = appendTrackingParamsToUrl(p.checkoutUrl);
  try {
    const url = new URL(withVisitorParams);
    const defaults = { ...CAMPAIGN_PARAMS, utm_content: `cta_${p.id}`, ...overrides };
    for (const [key, value] of Object.entries(defaults)) {
      if (!url.searchParams.get(key)) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return withVisitorParams;
  }
}

/** InitiateCheckout (Meta) + begin_checkout e product_cta_click (GA4). */
export function trackCheckoutIntent(
  product: Product | ProductId,
  label: string,
  postSlug?: string,
) {
  const p = resolveProduct(product);

  trackInitiateCheckout({
    value: p.price,
    contentName: p.name,
    contentCategory: p.category,
    contentIds: [p.id],
    label,
  });

  trackEvent("product_cta_click", {
    product_id: p.id,
    item_name: p.name,
    item_category: p.category,
    value: p.price,
    currency: p.currency,
    event_label: label,
  });

  trackEvent("begin_checkout", {
    currency: p.currency,
    value: p.price,
    event_label: label,
    items: [{ item_id: p.id, item_name: p.name, item_category: p.category, price: p.price }],
  });

  // Log first-party (Supabase) — insert-only, sem dados pessoais.
  void logOutboundClick({
    targetUrl: p.checkoutUrl,
    targetType: "hotmart_checkout",
    label: `${label} · ${p.shortName}`,
    postSlug,
  });
}
