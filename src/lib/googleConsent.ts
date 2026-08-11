export type GoogleConsentStatus = "granted" | "denied";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function ensureGtag() {
  if (typeof window === "undefined") return null;
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer.push(args);
    };
  }
  return window.gtag;
}

/**
 * Sincroniza o banner LGPD do site com o Google Consent Mode v2.
 * O estado default é definido no <head>, antes de GA/GTM.
 */
export function updateGoogleConsent(status: GoogleConsentStatus) {
  const gtag = ensureGtag();
  if (!gtag) return;

  const value = status === "granted" ? "granted" : "denied";

  gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });

  gtag("set", "ads_data_redaction", status !== "granted");
}
