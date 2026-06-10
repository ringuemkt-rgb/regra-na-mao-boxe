// =============================================================
// Meta Pixel — carregado APENAS após o consentimento LGPD.
// ID via VITE_META_PIXEL_ID (publishable, ok em código cliente).
// =============================================================

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

const DEFAULT_CONTENT = {
  content_name: "Boxe de Cria Ebook",
  content_category: "Ebook / Boxe / Artes Marciais",
  content_type: "product",
  currency: "BRL",
};

function fbq(): ((...args: any[]) => void) | null {
  if (typeof window === "undefined") return null;
  return (window as any).fbq || null;
}

/** Carrega o snippet do Meta Pixel e dispara PageView inicial. */
export function loadMetaPixel() {
  if (!META_PIXEL_ID) {
    console.warn("[MetaPixel] VITE_META_PIXEL_ID não configurado");
    return;
  }
  if (typeof window === "undefined") return;
  if ((window as any).fbq) {
    // Já carregado — apenas dispara PageView novamente
    trackPageView();
    return;
  }

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );
  /* eslint-enable */

  (window as any).fbq("init", META_PIXEL_ID);
  // [Meta Pixel] PageView — dispara em toda carga inicial
  (window as any).fbq("track", "PageView");
  console.log("[MetaPixel] loaded + PageView", META_PIXEL_ID);
}

/** Dispara PageView (útil em mudanças de rota SPA). */
export function trackPageView() {
  const f = fbq();
  if (!f) return;
  f("track", "PageView");
  console.log("[MetaPixel] PageView");
}

/** Dispara ViewContent — usar ao carregar a landing do e-book. */
export function trackViewContent(value = 89.9) {
  const f = fbq();
  if (!f) return;
  f("track", "ViewContent", { ...DEFAULT_CONTENT, value });
  console.log("[MetaPixel] ViewContent", value);
}

/** Dispara InitiateCheckout — usar antes de redirecionar p/ Hotmart. */
export function trackInitiateCheckout(value = 89.9, label?: string) {
  const f = fbq();
  if (!f) return;
  f("track", "InitiateCheckout", {
    ...DEFAULT_CONTENT,
    value,
    ...(label ? { content_label: label } : {}),
  });
  console.log("[MetaPixel] InitiateCheckout", value, label);
}
