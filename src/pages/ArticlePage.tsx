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

const SANTA_FE_SLUG = "brasil-semifinais-boxe-santa-fe-17-setembro-2026";

const scheduledFights = [
  ["57 kg", "Jucielen Romeu (BRA)", "Luz Arancibia (ARG)"],
  ["75 kg", "Adriele Nascimento (BRA)", "Lorena Balbuena (ARG)"],
  ["65 kg", "Yuri Falcão (BRA)", "Joiser Medina (VEN)"],
  ["70 kg", "Kaian Reis (BRA)", "Jose Rodriguez (ECU)"],
  ["80 kg", "Wanderley Pereira (BRA)", "Diego Mejias (VEN)"],
] as const;

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

  const isSantaFeNews = post.slug === SANTA_FE_SLUG;
  const absoluteCover = post.cover_image
    ? new URL(post.cover_image, SITE_URL).toString()
    : undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": isSantaFeNews ? "NewsArticle" : "Article",
    headline: post.seo_title || post.title,
    description: post.seo_description || post.excerpt,
    datePublished: post.published_at ?? undefined,
    dateModified: post.published_at ?? undefined,
    inLanguage: "pt-BR",
    mainEntityOfPage: `${SITE_URL}${path}`,
    image: absoluteCover ? [absoluteCover] : undefined,
    author: { "@type": "Person", name: "Satoshi Nishiuchi" },
    publisher: { "@type": "Organization", name: "BOXE DE CRIA", url: SITE_URL },
    ...(isSantaFeNews
      ? {
          articleSection: "Boxe Olímpico / Jogos Sul-Americanos",
          keywords: [
            "boxe Santa Fé 2026",
            "Jucielen Romeu",
            "Adriele Nascimento",
            "Yuri Falcão",
            "Kaian Reis",
            "Wanderley Pereira",
            "Seleção Brasileira de Boxe",
            "Jogos Sul-Americanos 2026",
          ],
        }
      : {}),
  };

  const jsonLd = isSantaFeNews
    ? [
        articleSchema,
        {
          "@context": "https://schema.org",
          "@type": "SportsEvent",
          name: "Semifinais do boxe nos Jogos Sul-Americanos de Santa Fé 2026",
          startDate: "2026-09-17",
          eventStatus: "https://schema.org/EventScheduled",
          sport: "Boxe olímpico",
          location: {
            "@type": "Place",
            name: "Santa Fé, Argentina",
            address: { "@type": "PostalAddress", addressLocality: "Santa Fé", addressCountry: "AR" },
          },
          description: "Cinco confrontos com atletas brasileiros constavam como programados para as semifinais de 17 de setembro de 2026.",
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
            { "@type": "ListItem", position: 2, name: "Artigos", item: `${SITE_URL}/artigos` },
            { "@type": "ListItem", position: 3, name: post.title, item: `${SITE_URL}${path}` },
          ],
        },
      ]
    : articleSchema;

  return (
    <main className="min-h-screen bg-[#050505] text-[#F0E6D2]">
      <Seo
        title={`${post.seo_title || post.title} | Boxe de Cria`}
        description={post.seo_description || post.excerpt}
        path={path}
        type="article"
        image={isSantaFeNews
          ? `${SITE_URL}/__l5e/assets-v1/bc82decd-d082-4841-8f2f-9be56fc30b9a/brasil-semifinais-santa-fe-2026-share.jpg`
          : absoluteCover}
        jsonLd={jsonLd}
      />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <Link to="/artigos" className="text-sm text-[#C9BDAA] hover:text-[#FFD700]">
          ← Artigos
        </Link>
        <nav aria-label="Navegação estrutural" className="mt-5 text-xs text-[#C9BDAA]">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="hover:text-[#FFD700]">Início</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to="/artigos" className="hover:text-[#FFD700]">Artigos</Link></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-[#F0E6D2]">{post.title}</li>
          </ol>
        </nav>
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
            className="mt-6 aspect-[4/5] w-full rounded-lg border border-white/10 object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
            width={1200}
            height={1504}
          />
        )}
        <p className="mt-6 text-lg text-[#C9BDAA]">{post.excerpt}</p>
        <div className="mt-8 space-y-5 leading-relaxed">
          {paragraphs.map((par, i) => (
            <div key={i}>
              <p className="whitespace-pre-line">{par}</p>
              {isSantaFeNews && i === 1 && (
                <aside className="my-8 border-l-4 border-[#FFD700] bg-[#171717] p-5" aria-labelledby="brasileiros-em-acao">
                  <p className="text-xs font-bold uppercase text-[#C9BDAA]">Programação sujeita a confirmação</p>
                  <h2 id="brasileiros-em-acao" className="mt-1 font-display text-2xl uppercase text-[#FFD700]">
                    Brasileiros em ação
                  </h2>
                  <ul className="mt-4 divide-y divide-white/10">
                    {scheduledFights.map(([weight, brazilian, opponent]) => (
                      <li key={weight} className="grid gap-1 py-3 text-sm sm:grid-cols-[4rem_1fr] sm:gap-4">
                        <strong className="text-[#FFD700]">{weight}</strong>
                        <span>{brazilian} <span className="text-[#C9BDAA]">x</span> {opponent}</span>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}
            </div>
          ))}
        </div>

        {isSantaFeNews && (
          <section className="mt-10 border-t border-white/10 pt-8" aria-labelledby="continue-acompanhando">
            <h2 id="continue-acompanhando" className="font-display text-xl uppercase text-[#FFD700]">
              Continue acompanhando
            </h2>
            <p className="mt-3 text-[#C9BDAA]">
              Acompanhe no BOXE DE CRIA cada luta, resultado e caminho dos brasileiros até as finais.
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <Link to="/artigos" className="text-[#FFD700] underline underline-offset-4">Mais notícias de boxe olímpico</Link>
              <Link to="/produtos/manual-do-corner" className="text-[#FFD700] underline underline-offset-4">Entenda regras e arbitragem</Link>
            </div>
          </section>
        )}

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
