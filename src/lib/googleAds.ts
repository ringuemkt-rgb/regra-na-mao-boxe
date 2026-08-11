import { adsConfig, isAdSenseConfigured } from "@/config/ads";
import { getConsent } from "@/lib/tracking";

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

const SCRIPT_ID = "boxe-de-cria-adsense";
let loadPromise: Promise<boolean> | null = null;

/**
 * Carrega o AdSense apenas quando:
 * 1) a monetização foi explicitamente habilitada;
 * 2) o publisher ID é válido;
 * 3) o visitante concedeu consentimento no banner atual.
 *
 * Não anexa handlers de clique a anúncios e não tenta inspecionar iframes Google.
 */
export function loadGoogleAds(): Promise<boolean> {
  if (typeof document === "undefined") return Promise.resolve(false);
  if (!isAdSenseConfigured()) return Promise.resolve(false);
  if (getConsent() !== "granted") return Promise.resolve(false);

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing?.dataset.loaded === "true") return Promise.resolve(true);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<boolean>((resolve) => {
    const script = existing || document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsConfig.client)}`;

    script.onload = () => {
      script.dataset.loaded = "true";
      window.adsbygoogle = window.adsbygoogle || [];
      resolve(true);
    };
    script.onerror = () => {
      loadPromise = null;
      resolve(false);
    };

    if (!existing) document.head.appendChild(script);
  });

  return loadPromise;
}

export function isGoogleAdsScriptLoaded() {
  if (typeof document === "undefined") return false;
  const script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  return script?.dataset.loaded === "true";
}
