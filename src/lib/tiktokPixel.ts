// =============================================================
// TikTok Pixel — carregado APENAS após o consentimento LGPD.
// Page é disparado no carregamento inicial e em cada troca de rota.
// =============================================================
import { getConsent } from "./tracking";

const TIKTOK_PIXEL_ID = "7439018240610762760";
const TIKTOK_SCRIPT_URL = "https://analytics.tiktok.com/i18n/pixel/events.js";

type TikTokQueue = Array<unknown> & {
  _i?: Record<string, Array<unknown> & { _u?: string }>;
  _o?: Record<string, Record<string, unknown>>;
  _t?: Record<string, number>;
  load?: (pixelId: string, options?: Record<string, unknown>) => void;
  page?: () => void;
  setAndDefer?: (target: TikTokQueue, method: string) => void;
  methods?: string[];
};

declare global {
  interface Window {
    TiktokAnalyticsObject?: string;
    ttq?: TikTokQueue;
  }
}

let loaded = false;

/** Instala o SDK oficial do TikTok e registra a primeira visualização. */
export function loadTikTokPixel() {
  if (typeof window === "undefined" || getConsent() !== "granted") return;

  if (loaded || window.ttq?.load) {
    if (!loaded) {
      loaded = true;
      window.ttq?.load?.(TIKTOK_PIXEL_ID);
      window.ttq?.page?.();
    }
    return;
  }

  window.TiktokAnalyticsObject = "ttq";
  const ttq = (window.ttq = window.ttq || ([] as unknown as TikTokQueue));
  ttq.methods = [
    "page",
    "track",
    "identify",
    "instances",
    "debug",
    "on",
    "off",
    "once",
    "ready",
    "alias",
    "group",
    "enableCookie",
    "disableCookie",
  ];
  ttq.setAndDefer = (target, method) => {
    (target as unknown as Record<string, (...args: unknown[]) => void>)[method] =
      (...args: unknown[]) => target.push([method, ...args]);
  };
  ttq.methods.forEach((method) => ttq.setAndDefer?.(ttq, method));

  ttq.load = (pixelId, options = {}) => {
    ttq._i = ttq._i || {};
    ttq._i[pixelId] = [];
    ttq._i[pixelId]._u = TIKTOK_SCRIPT_URL;
    ttq._t = ttq._t || {};
    ttq._t[pixelId] = Date.now();
    ttq._o = ttq._o || {};
    ttq._o[pixelId] = options;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `${TIKTOK_SCRIPT_URL}?sdkid=${pixelId}&lib=ttq`;
    document.head.appendChild(script);
  };

  loaded = true;
  ttq.load(TIKTOK_PIXEL_ID);
  ttq.page?.();
}

/** Registra uma visualização nas navegações internas após o consentimento. */
export function trackTikTokPageView() {
  if (typeof window === "undefined" || getConsent() !== "granted" || !loaded) return;
  window.ttq?.page?.();
}