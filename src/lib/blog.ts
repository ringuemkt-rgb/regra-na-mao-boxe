// =============================================================
// Camada de dados editorial (Supabase) — leitura pública de
// conteúdo publicado, inserts anônimos de métricas/lead e
// operações de administração (protegidas por RLS: só admin).
// O visitante NUNCA consegue ler newsletter_leads.
// =============================================================
import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: { content?: string } | Record<string, unknown>;
  cover_image: string | null;
  category_id: string | null;
  author_id: string | null;
  status: string;
  featured: boolean;
  published_at: string | null;
  read_time: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

/** Texto do corpo do artigo (markdown simples guardado em body.content). */
export function postBodyText(post: Pick<Post, "body">): string {
  const body = post.body as { content?: string } | null;
  return typeof body?.content === "string" ? body.content : "";
}

// ---------- Leitura pública ----------

export async function fetchPublishedPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Post[];
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return (data as Post) ?? null;
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throw error;
  return (data ?? []) as Category[];
}

// ---------- Administração (RLS exige papel admin) ----------

export async function fetchAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Post[];
}

export type PostInput = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category_id: string | null;
  cover_image: string | null;
  read_time: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published";
  featured: boolean;
};

function toRow(input: PostInput) {
  return {
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    body: { format: "markdown", content: input.content },
    category_id: input.category_id,
    cover_image: input.cover_image,
    read_time: input.read_time,
    seo_title: input.seo_title,
    seo_description: input.seo_description,
    status: input.status,
    featured: input.featured,
    published_at:
      input.status === "published" ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };
}

export async function createPost(input: PostInput) {
  const { error } = await supabase.from("posts").insert(toRow(input));
  if (error) throw error;
}

export async function updatePost(id: string, input: PostInput) {
  const row = toRow(input);
  const { error } = await supabase.from("posts").update(row).eq("id", id);
  if (error) throw error;
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

export async function createCategory(input: {
  name: string;
  slug: string;
  description: string;
}) {
  const { error } = await supabase.from("categories").insert(input);
  if (error) throw error;
}

export async function updateCategory(
  id: string,
  input: { name: string; slug: string; description: string },
) {
  const { error } = await supabase.from("categories").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Métricas first-party (insert-only) ----------

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
