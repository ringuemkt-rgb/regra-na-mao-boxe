// =============================================================
// Meta Pixel — carregado APENAS após o consentimento LGPD.
//
// 🔧 Como trocar o Pixel ID:
//   altere VITE_META_PIXEL_ID em .env e republique.
//
// Eventos disparados pelo SITE:
//   - PageView        → toda mudança de rota (RouteTracker)
//   - ViewContent     → mount da landing do e-book
//   - InitiateCheckout→ clique em qualquer CTA antes do redirect
//
// Purchase NÃO é disparado aqui — fica a cargo da Hotmart.
// =============================================================

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

// Parâmetros padrão de conteúdo (alteráveis se mudar o catálogo)
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
  (window as any).fbq("track", "PageView");
  console.log("[MetaPixel] loaded + PageView", META_PIXEL_ID);
}

/** PageView — disparado em todas as mudanças de rota SPA. */
export function trackPageView() {
  const f = fbq();
  if (!f) return;
  f("track", "PageView");
  console.log("[MetaPixel] PageView");
}

/** ViewContent — mount da landing. `value` deve ser o preço do produto exibido. */
export function trackViewContent(value: number) {
  const f = fbq();
  if (!f) return;
  f("track", "ViewContent", { ...DEFAULT_CONTENT, value });
  console.log("[MetaPixel] ViewContent", value);
}

/** InitiateCheckout — antes de redirecionar p/ Hotmart. `value` é obrigatório. */
export function trackInitiateCheckout(value: number, label?: string) {
  const f = fbq();
  if (!f) return;
  f("track", "InitiateCheckout", {
    ...DEFAULT_CONTENT,
    value,
    ...(label ? { content_label: label } : {}),
  });
  console.log("[MetaPixel] InitiateCheckout", value, label);
}
