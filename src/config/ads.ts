export type AdPlacement = "in-article" | "sidebar" | "article-end" | "category";

const env = import.meta.env;

export const adsConfig = {
  enabled: env.VITE_GOOGLE_ADS_ENABLED === "true",
  client: (env.VITE_GOOGLE_ADSENSE_CLIENT || "").trim(),
  autoAds: env.VITE_GOOGLE_AUTO_ADS === "true",
  slots: {
    inArticle: (env.VITE_GOOGLE_AD_SLOT_IN_ARTICLE || "").trim(),
    sidebar: (env.VITE_GOOGLE_AD_SLOT_SIDEBAR || "").trim(),
    articleEnd: (env.VITE_GOOGLE_AD_SLOT_ARTICLE_END || "").trim(),
    category: (env.VITE_GOOGLE_AD_SLOT_CATEGORY || "").trim(),
  },
} as const;

export const ADSENSE_CLIENT_RE = /^ca-pub-\d{16}$/;
export const ADSENSE_SLOT_RE = /^\d{6,20}$/;

export function isAdSenseClientValid(client = adsConfig.client) {
  return ADSENSE_CLIENT_RE.test(client);
}

export function isAdSlotValid(slot?: string) {
  return Boolean(slot && ADSENSE_SLOT_RE.test(slot));
}

/**
 * Regra editorial/comercial do BOXE DE CRIA:
 * publicidade programática só aparece em superfícies editoriais.
 * A landing comercial, checkout e páginas de confiança/legais ficam sem AdSense.
 */
export function adsAllowedOnPath(pathname: string) {
  return pathname.startsWith("/artigos/") || pathname.startsWith("/categoria/");
}

export function isAdSenseConfigured() {
  return adsConfig.enabled && isAdSenseClientValid();
}
