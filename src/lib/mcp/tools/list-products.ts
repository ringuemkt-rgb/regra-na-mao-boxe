import { defineTool } from "@lovable.dev/mcp-js";
import { PRODUCTS } from "../catalog";

export default defineTool({
  name: "list_products",
  title: "Listar produtos",
  description:
    "Lista os e-books e o combo do Boxe de Cria com preço em reais, número de páginas e link de checkout.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(PRODUCTS, null, 2) }],
    structuredContent: { products: PRODUCTS },
  }),
});
