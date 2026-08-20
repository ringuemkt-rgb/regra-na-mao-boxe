// =============================================================
// Camada de dados editorial (Supabase) — somente leitura pública
// de conteúdo publicado + inserts anônimos de métricas/lead.
// O visitante NUNCA consegue ler newsletter_leads.
// =============================================================
import { supabase } from "@/integrations/supabase/client";

/** Insert-only: clique de saída (checkout/afiliado/fonte externa). */
export async function logOutboundClick(input: {
  targetUrl: string;
  targetType: string;
  label?: string;
  postSlug?: string;
  source?: string;
}) {
  try {
    await supabase.from("outbound_clicks").insert({
      target_url: input.targetUrl,
      target_type: input.targetType,
      label: input.label ?? null,
      post_slug: input.postSlug ?? null,
      source: input.source ?? "site",
    });
  } catch {
    /* métricas nunca podem quebrar a navegação */
  }
}

/** Insert-only: visualização de artigo. */
export async function logArticleView(postSlug: string, source = "site") {
  try {
    await supabase.from("article_views").insert({ post_slug: postSlug, source });
  } catch {
    /* silencioso */
  }
}
