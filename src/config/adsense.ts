export type AdSenseConsentStrategy = "google-cmp" | "site-consent";

const env = import.meta.env;

const asBool = (value: string | undefined, fallback = false) => {
  if (value == null || value === "") return fallback;
  return value.toLowerCase() === "true";
};

const clean = (value: string | undefined) => (value || "").trim();

/**
 * AdSense is intentionally OFF by default.
 * Production ads only become eligible when ALL of these are true:
 * - VITE_ADSENSE_ENABLED=true
 * - valid publisher id (ca-pub-...)
 * - current route is editorial/monetizable
 * - consent strategy requirements are satisfied
 *
 * Keep Auto ads disabled during the first rollout. Manual slots give us
 * tighter control over UX, Core Web Vitals and accidental-click risk.
 */
export const adsenseConfig = {
  enabled: asBool(env.VITE_ADSENSE_ENABLED, false),
  publisherId: clean(env.VITE_ADSENSE_PUBLISHER_ID),
  consentStrategy: (clean(env.VITE_ADSENSE_CONSENT_STRATEGY) ||
    "google-cmp") as AdSenseConsentStrategy,
  autoAdsEnabled: asBool(env.VITE_ADSENSE_AUTO_ADS, false),
  allowHome: asBool(env.VITE_ADSENSE_ALLOW_HOME, false),
  debug: asBool(env.VITE_ADSENSE_DEBUG, false),
  slots: {
    articleAfterIntro: clean(env.VITE_ADSENSE_SLOT_ARTICLE_AFTER_INTRO),
    articleMid: clean(env.VITE_ADSENSE_SLOT_ARTICLE_MID),
    articleEnd: clean(env.VITE_ADSENSE_SLOT_ARTICLE_END),
    desktopSidebar: clean(env.VITE_ADSENSE_SLOT_DESKTOP_SIDEBAR),
  },
} as const;

export const isValidPublisherId = (value = adsenseConfig.publisherId) =>
  /^ca-pub-\d{10,}$/.test(value);

export const isValidAdSlot = (value?: string) => /^\d+$/.test(value || "");

const ALWAYS_BLOCKED_PREFIXES = [
  "/confianca",
  "/produtos",
  "/checkout",
  "/privacidade",
  "/termos",
  "/contato",
  "/afiliados",
  "/politica-editorial",
  "/sobre",
];

const EDITORIAL_PREFIXES = ["/artigos", "/categoria"];

/**
 * Route-level monetization guard.
 * Ads are allowed only on editorial pages by default.
 */
export function isAdRouteEligible(pathname: string): boolean {
  if (!adsenseConfig.enabled || !isValidPublisherId()) return false;

  if (ALWAYS_BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false;
  }

  if (pathname === "/") return adsenseConfig.allowHome;

  return EDITORIAL_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function adsenseDiagnostics(pathname: string) {
  return {
    enabled: adsenseConfig.enabled,
    publisherIdValid: isValidPublisherId(),
    routeEligible: isAdRouteEligible(pathname),
    autoAdsEnabled: adsenseConfig.autoAdsEnabled,
    consentStrategy: adsenseConfig.consentStrategy,
    configuredSlots: Object.entries(adsenseConfig.slots)
      .filter(([, value]) => isValidAdSlot(value))
      .map(([key]) => key),
  };
}
