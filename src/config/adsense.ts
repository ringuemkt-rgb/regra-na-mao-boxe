export type AdSenseConsentStrategy = "google-cmp" | "site-consent";

const env = import.meta.env;
const asBool = (value: string | undefined, fallback = false) => value == null || value === "" ? fallback : value.toLowerCase() === "true";
const clean = (value: string | undefined) => (value || "").trim();

export const adsenseConfig = {
  enabled: asBool(env.VITE_ADSENSE_ENABLED, false),
  publisherId: clean(env.VITE_ADSENSE_PUBLISHER_ID),
  consentStrategy: (clean(env.VITE_ADSENSE_CONSENT_STRATEGY) || "site-consent") as AdSenseConsentStrategy,
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

/** Alias semântico usado pelo layout editorial; mantém uma única fonte de configuração. */
export const ADSENSE_CONFIG = {
  ...adsenseConfig,
  slots: {
    afterIntro: adsenseConfig.slots.articleAfterIntro,
    midArticle: adsenseConfig.slots.articleMid,
    endArticle: adsenseConfig.slots.articleEnd,
    sidebar: adsenseConfig.slots.desktopSidebar,
  },
} as const;

export const isValidPublisherId = (value = adsenseConfig.publisherId) => /^ca-pub-\d{10,}$/.test(value);
export const isValidAdSlot = (value?: string) => /^\d+$/.test(value || "");

const ALWAYS_BLOCKED_PREFIXES = ["/confianca", "/produtos", "/checkout", "/privacidade", "/termos", "/contato", "/afiliados", "/politica-editorial", "/sobre"];
const EDITORIAL_PREFIXES = ["/artigos", "/categoria"];

export function isAdRouteEligible(pathname: string): boolean {
  if (!adsenseConfig.enabled || !isValidPublisherId()) return false;
  if (ALWAYS_BLOCKED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return false;
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
    configuredSlots: Object.entries(adsenseConfig.slots).filter(([, value]) => isValidAdSlot(value)).map(([key]) => key),
  };
}
