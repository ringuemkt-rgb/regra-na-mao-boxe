// Gera public/sitemap.xml antes de `vite dev` e `vite build`.
// Inclui rotas públicas, páginas de produto e artigos publicados.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://regra-na-mao-boxe.lovable.app";

type SitemapEntry = {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: string;
};

const PRODUCT_SLUGS = [
  "manual-do-corner",
  "caminho-do-boxeador",
  "combo-completo",
];

// Notícias editoriais confirmadas no CMS também ficam disponíveis quando o
// ambiente de geração não expõe credenciais de leitura da API.
const CONFIRMED_ARTICLE_SLUGS = [
  "brasil-semifinais-boxe-santa-fe-17-setembro-2026",
];

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/artigos", changefreq: "weekly", priority: "0.8" },
  { path: "/confianca", changefreq: "monthly", priority: "0.5" },
  ...PRODUCT_SLUGS.map((slug) => ({
    path: `/produtos/${slug}`,
    changefreq: "weekly" as const,
    priority: "0.9",
  })),
];

async function publishedArticlePaths(): Promise<string[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(
      `${url}/rest/v1/posts?select=slug&status=eq.published`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as { slug: string }[];
    return rows.map((r) => `/artigos/${r.slug}`);
  } catch {
    return [];
  }
}

function generateSitemap(list: SitemapEntry[]) {
  const urls = list.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

const articlePaths = Array.from(new Set([
  ...CONFIRMED_ARTICLE_SLUGS.map((slug) => `/artigos/${slug}`),
  ...(await publishedArticlePaths()),
]));
const all = [
  ...entries,
  ...articlePaths.map((path) => ({
    path,
    changefreq: "monthly" as const,
    priority: "0.7",
  })),
];

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(all));
console.log(`sitemap.xml written (${all.length} entries)`);
