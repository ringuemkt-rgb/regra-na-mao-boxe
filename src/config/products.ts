// =============================================================
// FONTE DE VERDADE DOS PRODUTOS — BOXE DE CRIA
//
// 🔧 ONDE ALTERAR link de checkout, preço, nome, categoria:
//    é AQUI. Nenhum outro arquivo deve conter link Hotmart.
//
// Cada CTA do site aponta para o checkout DO SEU PRÓPRIO produto.
// Purchase nunca é disparado no site — só na Hotmart.
// =============================================================

export type ProductId = "corner" | "caminho" | "combo";

export type Product = {
  id: ProductId;
  /** Nome comercial completo (usado em eventos content_name) */
  name: string;
  shortName: string;
  subtitle: string;
  /** Categoria usada em content_category dos eventos */
  category: string;
  price: number;
  priceLabel: string;
  oldPrice?: number;
  oldPriceLabel?: string;
  discountLabel?: string;
  currency: "BRL";
  /** Link oficial Hotmart deste produto */
  checkoutUrl: string;
  pages: string;
  bullets: string[];
  /** Temas editoriais que devem recomendar este produto */
  topics: string[];
};

export const PRODUCTS: Record<ProductId, Product> = {
  corner: {
    id: "corner",
    name: "O Manual do Córner — Regras, Arbitragem & Preparação",
    shortName: "O Manual do Córner",
    subtitle: "Regras, Arbitragem & Preparação",
    category: "E-book / Boxe / Regras e Arbitragem",
    price: 49.9,
    priceLabel: "R$ 49,90",
    currency: "BRL",
    checkoutUrl: "https://go.hotmart.com/D105758587D",
    pages: "44 páginas",
    bullets: [
      "Regras oficiais explicadas com ilustração",
      "Faltas e áreas válidas de golpe",
      "Checklist de preparação do córner",
      "Leitura de súmula e critérios de pontuação",
    ],
    topics: ["regras", "arbitragem", "corner", "sumula", "competicao"],
  },
  caminho: {
    id: "caminho",
    name: "O Caminho do Boxeador — Fundamentos Técnicos & Metodologia",
    shortName: "O Caminho do Boxeador",
    subtitle: "Fundamentos Técnicos & Metodologia",
    category: "E-book / Boxe / Técnica e Metodologia",
    price: 67.9,
    priceLabel: "R$ 67,90",
    currency: "BRL",
    checkoutUrl: "https://go.hotmart.com/D105758904F",
    pages: "85 páginas",
    bullets: [
      "Guarda, base e deslocamento",
      "Golpes e defesas em pranchas visuais",
      "Progressão didática de manopla",
      "Estrutura de aula do aquecimento ao fim",
    ],
    topics: ["tecnica", "treino", "metodologia", "didatica", "fundamentos"],
  },
  combo: {
    id: "combo",
    name: "Combo Completo — Manual do Córner + Caminho do Boxeador",
    shortName: "Combo Completo",
    subtitle: "Os dois manuais juntos",
    category: "E-book / Boxe / Combo",
    price: 89.9,
    priceLabel: "R$ 89,90",
    oldPrice: 117.8,
    oldPriceLabel: "R$ 117,80",
    discountLabel: "24% OFF",
    currency: "BRL",
    checkoutUrl:
      "https://pay.hotmart.com/E105828277Q?checkoutMode=0&bid=1779626342467",
    pages: "129 páginas",
    bullets: [
      "Regras + Técnica no mesmo método",
      "Economia de R$ 27,90",
      "Material completo do professor",
      "Acesso vitalício aos dois PDFs",
    ],
    topics: ["treinador", "professor", "carreira", "geral"],
  },
};

export const PRODUCT_LIST: Product[] = [
  PRODUCTS.corner,
  PRODUCTS.caminho,
  PRODUCTS.combo,
];

/**
 * CTA contextual por tema editorial:
 *  regras/arbitragem  → Manual do Córner
 *  técnica/metodologia→ Caminho do Boxeador
 *  demais             → Combo
 */
export function productForTopic(topic?: string | null): Product {
  if (!topic) return PRODUCTS.combo;
  const t = topic
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (/regra|arbitr|corner|sumula|competi/.test(t)) return PRODUCTS.corner;
  if (/tecnic|treino|metodolog|fundament|didatic|equipament/.test(t))
    return PRODUCTS.caminho;
  return PRODUCTS.combo;
}
