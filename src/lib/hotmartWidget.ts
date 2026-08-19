// =============================================================
// Hotmart Checkout Widget — loader único (script + CSS)
//
// 🔧 ONDE ALTERAR:
//   - URL do checkout / produto → src/lib/checkout.ts
//   - Este arquivo só carrega os assets oficiais da Hotmart,
//     uma única vez por sessão, no <head>.
// =============================================================

const SCRIPT_SRC = "https://static.hotmart.com/checkout/widget.min.js";
const CSS_HREF = "https://static.hotmart.com/css/hotmart-fb.min.css";

let loading = false;

/** Injeta o widget da Hotmart no <head>. Idempotente: nunca duplica. */
export function loadHotmartWidget() {
  if (typeof document === "undefined") return;
  if (loading) return;
  loading = true;

  if (!document.querySelector(`script[src="${SCRIPT_SRC}"]`)) {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.head.appendChild(script);
  }

  if (!document.querySelector(`link[href="${CSS_HREF}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = CSS_HREF;
    document.head.appendChild(link);
  }
}

/** Detecta se o overlay do widget realmente abriu (para fallback de redirect). */
export function isHotmartOverlayOpen(): boolean {
  if (typeof document === "undefined") return false;
  return Boolean(
    document.querySelector(
      '.hotmart-fb-overlay, .hotmart_fb_wrapper, iframe[src*="pay.hotmart.com"]',
    ),
  );
}
