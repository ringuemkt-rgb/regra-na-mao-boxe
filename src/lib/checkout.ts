import { trackInitiateCheckout } from "./metaPixel";
import { appendTrackingParamsToUrl } from "./tracking";

export const PRODUCT_CHECKOUTS = {
  corner: "https://go.hotmart.com/D105758587D",
  caminho: "https://go.hotmart.com/D105758904F",
  combo: "https://pay.hotmart.com/E105828277Q?checkoutMode=0&bid=1779626342467",
} as const;

// Mantido por compatibilidade com componentes antigos.
export const HOTMART_CHECKOUT_URL = PRODUCT_CHECKOUTS.combo;

/**
 * Dispara InitiateCheckout (Meta) + begin_checkout (GA4), preserva
 * UTMs/fbclid/gclid/src/sck e redireciona para o produto correto.
 */
export function handleCheckoutUrlClick(url: string, label: string, value: number) {
  trackInitiateCheckout(value, label);

  const w = window as any;
  if (w.gtag) {
    w.gtag("event", "begin_checkout", {
      event_category: "ecommerce",
      event_label: label,
      currency: "BRL",
      value,
    });
  }

  const finalUrl = appendTrackingParamsToUrl(url);

  setTimeout(() => {
    window.location.href = finalUrl;
  }, 300);
}

/** Compatibilidade: CTA antigo continua levando ao combo. */
export function handleCheckoutClick(label: string, value: number) {
  handleCheckoutUrlClick(PRODUCT_CHECKOUTS.combo, label, value);
}
