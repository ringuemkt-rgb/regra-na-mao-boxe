import { adsenseConfig } from "@/config/adsense";

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
 * Synchronizes the local cookie choice with Google Consent Mode.
 *
 * google-cmp:
 *   The local banner controls analytics only. Advertising consent stays denied
 *   until Google's certified CMP / Privacy & messaging flow handles it.
 *
 * site-consent:
 *   The local banner also updates advertising consent. This remains an
 *   additional local gate and must NOT be treated as a substitute for Google's
 *   certified CMP/TCF requirement where that requirement applies.
 */
export function updateGoogleConsent(status: GoogleConsentStatus) {
  const gtag = ensureGtag();
  if (!gtag) return;

  const value = status === "granted" ? "granted" : "denied";

  if (adsenseConfig.consentStrategy === "site-consent") {
    gtag("consent", "update", {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
    });
    gtag("set", "ads_data_redaction", status !== "granted");
    return;
  }

  // Google CMP owns ad-related consent. The local banner only controls analytics.
  gtag("consent", "update", {
    analytics_storage: value,
  });
}
