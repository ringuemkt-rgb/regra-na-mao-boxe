// =============================================================
// Meta Pixel — carregado APENAS após o consentimento LGPD.
//
// 🔧 Como trocar o Pixel ID: VITE_META_PIXEL_ID em .env.
//
// Eventos disparados pelo SITE:
//   - PageView         → toda mudança de rota
//   - ViewContent      → páginas de produto/artigo
//   - InitiateCheckout → clique em CTA de compra (por produto)
//
// Purchase NÃO é disparado aqui — fica a cargo da Hotmart.
// =============================================================

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

type ContentParams = {
  value?: number;
  contentName?: string;
  contentCategory?: string;
  contentIds?: string[];
  label?: string;
};

function fbq(): ((...args: any[]) => void) | null {
  if (typeof window === "undefined") return null;
  return (window as any).fbq || null;
}

function payload(p: ContentParams) {
  return {
    content_type: "product",
    currency: "BRL",
    ...(p.contentName ? { content_name: p.contentName } : {}),
    ...(p.contentCategory ? { content_category: p.contentCategory } : {}),
    ...(p.contentIds ? { content_ids: p.contentIds } : {}),
    ...(typeof p.value === "number" ? { value: p.value } : {}),
    ...(p.label ? { content_label: p.label } : {}),
  };
}

/** Carrega o snippet do Meta Pixel e dispara PageView inicial. */
export function loadMetaPixel() {
  if (!META_PIXEL_ID) return;
  if (typeof window === "undefined") return;
  if ((window as any).fbq) {
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
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  (window as any).fbq("init", META_PIXEL_ID);
  (window as any).fbq("track", "PageView");
}

/** PageView — uma vez por rota. */
export function trackPageView() {
  fbq()?.("track", "PageView");
}

/** ViewContent — conteúdo/produto visualizado. */
export function trackViewContent(p: ContentParams) {
  fbq()?.("track", "ViewContent", payload(p));
}

/** InitiateCheckout — antes de abrir/redirecionar o checkout Hotmart. */
export function trackInitiateCheckout(p: ContentParams) {
  fbq()?.("track", "InitiateCheckout", payload(p));
}
