// =============================================================
// Checkout único — todos os CTAs usam este handler para
// garantir InitiateCheckout + UTMs/fbclid/gclid/sck/src.
//
// 🔧 Para trocar o destino: altere HOTMART_CHECKOUT_URL.
// 🔧 Para trocar o valor reportado: passe `value` em cada CTA.
// =============================================================
import { trackInitiateCheckout } from "./metaPixel";
import { appendTrackingParamsToUrl } from "./tracking";

// Link único de checkout Hotmart (combo completo)
export const HOTMART_CHECKOUT_URL =
  "https://pay.hotmart.com/E105828277Q?checkoutMode=0&bid=1779626342467";

/**
 * Dispara InitiateCheckout (Meta) + begin_checkout (GA4)
 * e redireciona para o checkout da Hotmart com parâmetros preservados.
 *
 * @param label rótulo do CTA (ex: "Hero · Combo")
 * @param value valor reportado no evento (preço real do item)
 */
export function handleCheckoutClick(label: string, value: number) {
  // [Meta Pixel] InitiateCheckout
  trackInitiateCheckout(value, label);

  // [GA4] begin_checkout
  const w = window as any;
  if (w.gtag) {
    w.gtag("event", "begin_checkout", {
      event_category: "ecommerce",
      event_label: label,
      currency: "BRL",
      value,
    });
  }

  const finalUrl = appendTrackingParamsToUrl(HOTMART_CHECKOUT_URL);
  console.log("[Checkout]", label, value, "→", finalUrl);

  // Delay garante envio do evento antes do redirect
  setTimeout(() => {
    window.location.href = finalUrl;
  }, 300);
}
