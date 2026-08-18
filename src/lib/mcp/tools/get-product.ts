import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS } from "../catalog";

export default defineTool({
  name: "get_product",
  title: "Detalhes de um produto",
  description:
    "Retorna os detalhes de um e-book do Boxe de Cria pelo seu id (manual-do-corner, caminho-do-boxeador, combo-completo).",
  inputSchema: {
    id: z.string().describe("Id do produto, como retornado por list_products."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ id }) => {
    const product = PRODUCTS.find((p) => p.id === id.trim());
    if (!product) {
      throw new ToolError(
        `Produto "${id}" não encontrado. Use list_products para ver os ids disponíveis.`,
      );
    }
    return {
      content: [{ type: "text", text: JSON.stringify(product, null, 2) }],
      structuredContent: { product },
    };
  },
});
