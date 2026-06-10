// =============================================================
// Tracking utilities — UTMs, fbclid, gclid persistence
// Captura parâmetros da URL na primeira visita e mantém no
// localStorage para reaproveitar em todos os CTAs do site.
// =============================================================

const STORAGE_KEY = "bdc_tracking_params";
const CONSENT_KEY = "bdc_cookie_consent"; // "granted" | "denied"

const TRACKING_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
] as const;

type TrackingParams = Partial<Record<(typeof TRACKING_KEYS)[number], string>>;

/** Lê/atualiza os parâmetros de tracking salvos no localStorage. */
export function captureTrackingParams(): TrackingParams {
  if (typeof window === "undefined") return {};
  try {
    const url = new URL(window.location.href);
    const stored: TrackingParams = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}",
    );

    let changed = false;
    for (const key of TRACKING_KEYS) {
      const v = url.searchParams.get(key);
      if (v && stored[key] !== v) {
        stored[key] = v;
        changed = true;
      }
    }
    if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    return stored;
  } catch {
    return {};
  }
}

export function getStoredTrackingParams(): TrackingParams {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/**
 * Anexa src=site_boxe_de_cria + UTMs/fbclid/gclid salvos ao link
 * de checkout da Hotmart, preservando parâmetros já existentes.
 */
export function appendTrackingParamsToUrl(url: string): string {
  try {
    const u = new URL(url);
    const params = getStoredTrackingParams();

    // src fixo identificando origem
    if (!u.searchParams.has("src")) {
      u.searchParams.set("src", "site_boxe_de_cria");
    }

    for (const [k, v] of Object.entries(params)) {
      if (v && !u.searchParams.has(k)) u.searchParams.set(k, v);
    }
    return u.toString();
  } catch {
    return url;
  }
}

// ----- Cookie consent (LGPD) -----
export type ConsentStatus = "granted" | "denied" | "unknown";

export function getConsent(): ConsentStatus {
  if (typeof window === "undefined") return "unknown";
  const v = localStorage.getItem(CONSENT_KEY);
  return v === "granted" || v === "denied" ? v : "unknown";
}

export function setConsent(value: "granted" | "denied") {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("bdc:consent", { detail: value }));
}
