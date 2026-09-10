// =============================================================
// SEO por rota — title, description, canonical, OG/Twitter e JSON-LD.
// Canonical sempre autorreferente (a própria página).
// =============================================================
import { Helmet } from "react-helmet-async";

export const SITE_URL = "https://regra-na-mao-boxe.lovable.app";
export const SITE_NAME = "Boxe de Cria";

export type SeoProps = {
  title: string;
  description: string;
  /** Caminho da rota, ex.: "/produtos/combo-completo" */
  path: string;
  image?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

export default function Seo({
  title,
  description,
  path,
  image,
  type = "website",
  noindex = false,
  jsonLd,
}: SeoProps) {
  const url = `${SITE_URL}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type === "product" ? "website" : type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {image && <meta name="twitter:image" content={image} />}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}
