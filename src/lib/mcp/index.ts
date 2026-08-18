import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import getProduct from "./tools/get-product";
import listFaq from "./tools/list-faq";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "boxe-de-cria-guia-essencial",
  title: "Boxe de Cria: Guia Essencial",
  version: "0.1.0",
  instructions:
    "Ferramentas do Boxe de Cria (requer login). Use `list_products` para ver os e-books, preços e links de checkout, `get_product` para detalhes de um item e `list_faq` para as dúvidas frequentes.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProducts, getProduct, listFaq],
});
