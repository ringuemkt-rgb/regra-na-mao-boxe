// =============================================================
// Checkout único — todos os CTAs usam este handler para
// garantir InitiateCheckout + UTMs/fbclid/gclid + src.
// =============================================================
import { trackInitiateCheckout } from "./metaPixel";
import { appendTrackingParamsToUrl } from "./tracking";

// Link único de checkout Hotmart (combo completo)
export const HOTMART_CHECKOUT_URL =
  "https://pay.hotmart.com/E105828277Q?checkoutMode=0&bid=1779626342467";

export function handleCheckoutClick(label = "CTA", value = 89.9) {
  // [Meta Pixel] InitiateCheckout — disparado em TODOS os botões de compra
  trackInitiateCheckout(value, label);

  // [GA4] begin_checkout — mantém compatibilidade com GA
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
  console.log("[Checkout] redirecting →", finalUrl);

  // Pequeno delay para garantir envio do evento antes do redirect
  setTimeout(() => {
    window.location.href = finalUrl;
  }, 250);
}
