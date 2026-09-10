// Leitura completa do artigo: /artigos/:slug
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Seo, { SITE_URL } from "@/lib/seo";
import {
  fetchPostBySlug,
  logArticleView,
  postBodyText,
  type Post,
} from "@/lib/blog";
import { trackArticleView } from "@/lib/analytics";
import { trackViewContent } from "@/lib/metaPixel";
import HotmartCheckoutButton from "@/components/HotmartCheckoutButton";
import { productForTopic } from "@/config/products";

export default function ArticlePage() {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPostBySlug(slug)
      .then((p) => setPost(p))
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!post) return;
    // article_view → GA4 + Meta Pixel + log first-party
    trackArticleView(post.slug, post.title);
    trackViewContent({
      contentName: post.title,
      contentCategory: "Artigo",
      contentIds: [post.slug],
      label: "article_view",
    });
    void logArticleView(post.slug);
  }, [post]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-20 text-[#C9BDAA]">
        Carregando…
      </main>
    );
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-[#050505] px-4 py-20 text-[#F0E6D2]">
        <Seo
          title="Artigo não encontrado | Boxe de Cria"
          description="Este artigo não está disponível."
          path={`/artigos/${slug}`}
          noindex
        />
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-2xl text-[#FFD700]">
            Artigo não encontrado
          </h1>
          <Link to="/artigos" className="mt-4 inline-block text-sm underline">
            Ver todos os artigos
          </Link>
        </div>
      </main>
    );
  }

  const path = `/artigos/${post.slug}`;
  const product = productForTopic(post.title);
  const paragraphs = postBodyText(post).split(/\n{2,}/).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    datePublished: post.published_at ?? undefined,
    mainEntityOfPage: `${SITE_URL}${path}`,
    publisher: { "@type": "Organization", name: "Boxe de Cria" },
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#F0E6D2]">
      <Seo
        title={`${post.seo_title || post.title} | Boxe de Cria`}
        description={post.seo_description || post.excerpt}
        path={path}
        type="article"
        image={post.cover_image ?? undefined}
        jsonLd={jsonLd}
      />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/artigos" className="text-sm text-[#C9BDAA] hover:text-[#FFD700]">
          ← Artigos
        </Link>
        <h1 className="mt-6 font-display text-3xl sm:text-4xl font-bold text-[#FFD700]">
          {post.title}
        </h1>
        <p className="mt-2 text-xs uppercase tracking-widest text-[#B78A56]">
          {[
            post.published_at
              ? new Date(post.published_at).toLocaleDateString("pt-BR")
              : null,
            post.read_time,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="mt-6 w-full rounded-2xl border border-white/10"
            loading="lazy"
            decoding="async"
          />
        )}
        <p className="mt-6 text-lg text-[#C9BDAA]">{post.excerpt}</p>
        <div className="mt-8 space-y-5 leading-relaxed">
          {paragraphs.map((par, i) => (
            <p key={i} className="whitespace-pre-line">
              {par}
            </p>
          ))}
        </div>

        <aside className="mt-12 rounded-2xl border border-[#FFD700]/30 p-6">
          <h2 className="font-display text-lg uppercase tracking-wide text-[#FFD700]">
            {product.shortName}
          </h2>
          <p className="mt-2 text-sm text-[#C9BDAA]">
            {product.subtitle} · {product.pages} · {product.priceLabel}
          </p>
          <div className="mt-4">
            <HotmartCheckoutButton
              product={product}
              postSlug={post.slug}
              label={`Artigo · ${post.slug}`}
              variant="gold"
            >
              Conhecer o material
            </HotmartCheckoutButton>
          </div>
        </aside>
      </article>
    </main>
  );
}
