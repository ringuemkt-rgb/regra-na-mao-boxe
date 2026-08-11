import { adsenseConfig, isAdRouteEligible, isValidPublisherId } from "@/config/adsense";
import { getConsent } from "@/lib/tracking";

const SCRIPT_ID = "bdc-google-adsense";

export type AdSenseLoadResult =
  | "loaded"
  | "already-loaded"
  | "disabled"
  | "invalid-publisher"
  | "blocked-route"
  | "awaiting-consent"
  | "server";

function log(...args: unknown[]) {
  if (adsenseConfig.debug && typeof console !== "undefined") {
    console.info("[BOXE DE CRIA · AdSense]", ...args);
  }
}

/**
 * Loads the official AdSense script exactly once.
 *
 * Consent strategies:
 * - google-cmp: load the Google script and manage European messaging/CMP
 *   from AdSense Privacy & messaging. This is the preferred production mode.
 * - site-consent: additionally requires the local BOXE DE CRIA marketing
 *   consent before loading. This does NOT replace Google's certified CMP
 *   requirement for personalized ads in the EEA/UK/Switzerland.
 */
export function loadAdSense(pathname = window.location.pathname): AdSenseLoadResult {
  if (typeof window === "undefined" || typeof document === "undefined") return "server";
  if (!adsenseConfig.enabled) return "disabled";
  if (!isValidPublisherId()) return "invalid-publisher";
  if (!isAdRouteEligible(pathname)) return "blocked-route";

  if (
    adsenseConfig.consentStrategy === "site-consent" &&
    getConsent() !== "granted"
  ) {
    return "awaiting-consent";
  }

  if (document.getElementById(SCRIPT_ID)) return "already-loaded";

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
    adsenseConfig.publisherId,
  )}`;
  script.setAttribute("data-bdc-adsense", "true");

  document.head.appendChild(script);
  log("script loaded", { pathname, autoAdsEnabled: adsenseConfig.autoAdsEnabled });
  return "loaded";
}

export function requestAdFill() {
  if (typeof window === "undefined") return false;

  try {
    const adsWindow = window as typeof window & {
      adsbygoogle?: Array<Record<string, never>>;
    };
    adsWindow.adsbygoogle = adsWindow.adsbygoogle || [];
    adsWindow.adsbygoogle.push({});
    return true;
  } catch (error) {
    log("request failed", error);
    return false;
  }
}

export function hasAdSenseScript() {
  if (typeof document === "undefined") return false;
  return Boolean(document.getElementById(SCRIPT_ID));
}
