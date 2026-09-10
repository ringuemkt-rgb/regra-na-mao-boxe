// =============================================================
// Página própria de cada produto: /produtos/:slug
// Preços, bullets e checkout vêm de src/config/products.ts.
// =============================================================
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Check, ArrowLeft } from "lucide-react";
import Seo, { SITE_URL } from "@/lib/seo";
import { PRODUCT_LIST, productBySlug } from "@/config/products";
import { COVERS } from "@/lib/covers";
import HotmartCheckoutButton from "@/components/HotmartCheckoutButton";
import { trackViewContent } from "@/lib/metaPixel";
import { trackEvent } from "@/lib/analytics";
import NotFound from "./NotFound";

export default function ProductPage() {
  const { slug } = useParams();
  const product = productBySlug(slug);

  useEffect(() => {
    if (!product) return;
    trackViewContent({
      value: product.price,
      contentName: product.name,
      contentCategory: product.category,
      contentIds: [product.id],
    });
    trackEvent("view_item", {
      currency: product.currency,
      value: product.price,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
        },
      ],
    });
  }, [product]);

  if (!product) return <NotFound />;

  const cover = COVERS[product.id];
  const path = `/produtos/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: `${product.shortName} — ${product.subtitle}. ${product.pages}.`,
    brand: { "@type": "Brand", name: "Boxe de Cria" },
    category: product.category,
    url: `${SITE_URL}${path}`,
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
      url: product.checkoutUrl,
    },
  };

  return (
    <main className="min-h-screen bg-[#050505] text-[#F0E6D2]">
      <Seo
        title={`${product.shortName} — ${product.subtitle} | Boxe de Cria`}
        description={`${product.shortName}: ${product.subtitle}. ${product.pages} em PDF por ${product.priceLabel}. Material visual da Boxe de Cria.`}
        path={path}
        type="product"
        jsonLd={jsonLd}
      />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[#C9BDAA] hover:text-[#FFD700]"
        >
          <ArrowLeft className="size-4" /> Voltar para a página inicial
        </Link>

        <div className="mt-8 grid gap-10 md:grid-cols-2 md:items-center">
          <img
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            style={{ aspectRatio: `${cover.width} / ${cover.height}` }}
            className="mx-auto w-full max-w-sm h-auto object-contain drop-shadow-2xl"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />

          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wide text-[#FFD700]">
              {product.shortName}
            </h1>
            <p className="mt-2 text-lg text-[#C9BDAA]">{product.subtitle}</p>
            <p className="mt-1 text-sm text-[#C9BDAA]/80">{product.pages} · PDF</p>

            <ul className="mt-6 space-y-3">
              {product.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm sm:text-base">
                  <Check className="size-5 shrink-0 text-[#C62828]" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-baseline gap-3">
              {product.oldPriceLabel && (
                <span className="text-lg line-through text-[#C9BDAA]/60">
                  {product.oldPriceLabel}
                </span>
              )}
              <span className="font-display text-4xl font-bold text-[#FFD700]">
                {product.priceLabel}
              </span>
              {product.discountLabel && (
                <span className="rounded-full bg-[#C62828] px-3 py-1 text-xs font-bold text-white">
                  {product.discountLabel}
                </span>
              )}
            </div>

            <div className="mt-6">
              <HotmartCheckoutButton
                product={product}
                label={`Página do produto · ${product.shortName}`}
                variant={product.id === "combo" ? "gold" : "primary"}
              >
                Comprar agora
              </HotmartCheckoutButton>
            </div>
            <p className="mt-3 text-xs text-[#C9BDAA]/80">
              Entrega em PDF por e-mail após a confirmação do pagamento na Hotmart.
              Garantia de 7 dias informada pela plataforma.
            </p>
          </div>
        </div>

        <section className="mt-16 border-t border-white/10 pt-8">
          <h2 className="font-display text-xl uppercase tracking-wide text-[#F0E6D2]">
            Outros materiais
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {PRODUCT_LIST.filter((p) => p.id !== product.id).map((p) => (
              <Link
                key={p.id}
                to={`/produtos/${p.slug}`}
                className="rounded-xl border border-white/15 px-4 py-3 text-sm hover:border-[#FFD700]/60"
              >
                {p.shortName} · {p.priceLabel}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
