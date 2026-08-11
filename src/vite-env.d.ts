/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;

  readonly VITE_ADSENSE_ENABLED?: string;
  readonly VITE_ADSENSE_PUBLISHER_ID?: string;
  readonly VITE_ADSENSE_CONSENT_STRATEGY?: "google-cmp" | "site-consent";
  readonly VITE_ADSENSE_AUTO_ADS?: string;
  readonly VITE_ADSENSE_ALLOW_HOME?: string;
  readonly VITE_ADSENSE_DEBUG?: string;
  readonly VITE_ADSENSE_SLOT_ARTICLE_AFTER_INTRO?: string;
  readonly VITE_ADSENSE_SLOT_ARTICLE_MID?: string;
  readonly VITE_ADSENSE_SLOT_ARTICLE_END?: string;
  readonly VITE_ADSENSE_SLOT_DESKTOP_SIDEBAR?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
