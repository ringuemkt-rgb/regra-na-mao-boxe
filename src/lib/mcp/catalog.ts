// Catálogo público do site Boxe de Cria — mesma fonte de verdade da landing.
// Somente dados já públicos (títulos, preços, links de checkout, FAQ).

export const CHECKOUT_URL =
  "https://pay.hotmart.com/E105828277Q?checkoutMode=0&bid=1779626342467";

export type Product = {
  id: string;
  name: string;
  price_brl: number;
  old_price_brl?: number;
  pages?: number;
  summary: string;
  checkout_url: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "manual-do-corner",
    name: "O Manual do Córner — Regras do Boxe na Mão",
    price_brl: 49.9,
    pages: 44,
    summary:
      "Regras, arbitragem e preparação para o canto. Guia visual prático para treinadores e atletas.",
    checkout_url: "https://go.hotmart.com/D105758587D",
  },
  {
    id: "caminho-do-boxeador",
    name: "O Caminho do Boxeador — Fundamentos Técnicos",
    price_brl: 67.9,
    pages: 85,
    summary:
      "Fundamentos técnicos e metodologia de aula para o professor de boxe.",
    checkout_url: "https://go.hotmart.com/D105758904F",
  },
  {
    id: "combo-completo",
    name: "Combo Completo — os dois e-books",
    price_brl: 89.9,
    old_price_brl: 117.8,
    pages: 129,
    summary:
      "Os dois manuais juntos com 24% de desconto: regras + fundamentos técnicos, o método completo do professor.",
    checkout_url: CHECKOUT_URL,
  },
];

export const FAQ: { question: string; answer: string }[] = [
  {
    question: "Como recebo o material?",
    answer:
      "Por e-mail, em PDF, logo após a confirmação do pagamento via Hotmart. Acesso vitalício no celular, tablet ou computador.",
  },
  {
    question: "Qual a diferença entre os dois e-books?",
    answer:
      "O Manual do Córner foca em regras, arbitragem e preparação para o canto. O Caminho do Boxeador foca em fundamentos técnicos e metodologia de aula. Juntos formam o método completo do professor.",
  },
  {
    question: "Vale mais a pena comprar o combo?",
    answer:
      "Sim. O combo sai por R$ 89,90 — você economiza R$ 27,90 em relação a comprar os dois separadamente, com 24% de desconto.",
  },
  {
    question: "E se eu não gostar?",
    answer:
      "Você tem 7 dias para pedir reembolso. 100% do seu dinheiro de volta, sem perguntas. Risco zero.",
  },
];
