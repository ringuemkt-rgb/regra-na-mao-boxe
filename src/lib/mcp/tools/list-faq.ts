import { defineTool } from "@lovable.dev/mcp-js";
import { FAQ } from "../catalog";

export default defineTool({
  name: "list_faq",
  title: "Perguntas frequentes",
  description:
    "Lista as perguntas frequentes públicas do site Boxe de Cria (entrega, diferenças entre os e-books, combo e garantia).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(FAQ, null, 2) }],
    structuredContent: { faq: FAQ },
  }),
});
