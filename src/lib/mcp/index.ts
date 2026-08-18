import { defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import getProduct from "./tools/get-product";
import listFaq from "./tools/list-faq";

export default defineMcp({
  name: "boxe-de-cria-guia-essencial",
  title: "Boxe de Cria: Guia Essencial",
  version: "0.1.0",
  instructions:
    "Ferramentas públicas do Boxe de Cria. Use `list_products` para ver os e-books, preços e links de checkout, `get_product` para detalhes de um item e `list_faq` para as dúvidas frequentes. Todos os dados são públicos do site.",
  tools: [listProducts, getProduct, listFaq],
});
