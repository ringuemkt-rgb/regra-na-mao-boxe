
import {
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Flame,
  Lock,
  Zap,
  Headphones,
  Instagram,
  Youtube,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
} from "lucide-react";
import { useEffect, useState } from "react";
import HotmartCheckoutButton from "@/components/HotmartCheckoutButton";
import { PRODUCTS, PRODUCT_LIST, Product, ProductId } from "@/config/products";
import { trackViewContent } from "@/lib/metaPixel";
import { trackEvent } from "@/lib/analytics";
import cornerCover from "@/assets/manual-corner-site-v2.png";
import caminhoCover from "@/assets/caminho-boxeador-site-v2.png";
import comboCover from "@/assets/combo-completo-site-v2.png";

// 🔧 Nome, preço, páginas, bullets e checkout: src/config/products.ts
// Capas reais de cada produto (PNG com fundo transparente)
const COVERS: Record<ProductId, { src: string; width: number; height: number; alt: string }> = {
  corner: {
    src: cornerCover,
    width: 1024,
    height: 1536,
    alt: "Capa do e-book Regras do Boxe — O Manual do Córner, edição premium para treinadores",
  },
  caminho: {
    src: caminhoCover,
    width: 1024,
    height: 1536,
    alt: "Capa do e-book Domine os Fundamentos do Boxe — O Caminho do Boxeador",
  },
  combo: {
    src: comboCover,
    width: 1230,
    height: 1278,
    alt: "Combo Completo: os dois e-books Regras do Boxe e O Caminho do Boxeador lado a lado",
  },
};

/** Menor preço vigente — usado em copy “a partir de”. */
const LOWEST_PRICE_LABEL = PRODUCT_LIST.reduce((a, b) => (a.price <= b.price ? a : b)).priceLabel;
const COMBO_SAVING_LABEL = "R$ 27,90";

// CTA vermelho — wrapper do componente único de checkout
const RedCta = ({
  label,
  product = "combo",
  children,
  className = "",
}: {
  label: string;
  product?: Product | ProductId;
  children: React.ReactNode;
  className?: string;
}) => (
  <HotmartCheckoutButton label={label} product={product} variant="primary" icon="flame" className={className}>
    {children}
  </HotmartCheckoutButton>
);

// CTA dourado — variação visual
const GoldCta = ({
  label,
  product = "combo",
  children,
  className = "",
}: {
  label: string;
  product?: Product | ProductId;
  children: React.ReactNode;
  className?: string;
}) => (
  <HotmartCheckoutButton
    label={label}
    product={product}
    variant="gold"
    icon="sparkles"
    className={`sm:text-xl px-6 sm:px-12 py-8 ${className}`}
  >
    {children}
  </HotmartCheckoutButton>
);



const SectionTitle = ({
  kicker,
  title,
  sub,
  light = false,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  light?: boolean;
}) => (
  <div className="text-center max-w-3xl mx-auto mb-12">
    {kicker && (
      <span className={`inline-block font-display font-bold tracking-[0.3em] text-xs sm:text-sm uppercase mb-3 ${light ? "text-[#D32F2F]" : "text-[#FFD700]"}`}>
        {kicker}
      </span>
    )}
    <h2 className={`font-display text-3xl sm:text-5xl md:text-6xl font-bold uppercase leading-[1.05] mb-4 ${light ? "text-[#0D0D0D]" : ""}`}>
      {title}
    </h2>
    {sub && <p className={`text-base sm:text-lg leading-relaxed ${light ? "text-black/70" : "text-muted-foreground"}`}>{sub}</p>}
  </div>
);

type CardProps = {
  /** Único dado obrigatório: o resto vem de src/config/products.ts */
  product: ProductId;
  badge: string;
  ctaLabel: string;
  trackingLabel: string;
  highlight?: boolean;
};


const ProductCard = ({
  product,
  badge,
  ctaLabel,
  trackingLabel,
  highlight = false,
}: CardProps) => {
  const p = PRODUCTS[product];
  const cover = COVERS[product];
  const title = p.shortName;
  const subtitle = p.subtitle;
  const bullets = [p.pages, ...p.bullets];
  const price = p.priceLabel;
  const oldPrice = p.oldPriceLabel;
  const badgeOff = p.discountLabel;

  return (
  <article
    className={`relative rounded-3xl p-6 sm:p-8 flex flex-col transition-smooth shadow-deep ${
      highlight
        ? "bg-[#1A1A1A] border-2 border-[#FFD700] shadow-gold lg:scale-[1.03]"
        : "gradient-card border-2 border-border hover:border-[#FFD700]/60"
    }`}
  >
    {badgeOff && (
      <div className="absolute -top-3 right-6 bg-[#D32F2F] text-white font-display font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full shadow-blood">
        {badgeOff}
      </div>
    )}

    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D32F2F]/15 border border-[#D32F2F]/40 mb-5 self-start">
      <Award className="size-4 text-[#FFD700]" />
      <span className="text-[10px] sm:text-xs font-display font-bold tracking-widest uppercase">{badge}</span>
    </div>

    <div className="relative mb-6 flex justify-center">
      <div className="absolute inset-0 bg-[#FFD700]/10 blur-2xl rounded-full" />
      <img
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        className="relative h-56 sm:h-64 w-auto object-contain drop-shadow-2xl"
        loading="lazy"
        decoding="async"
      />
    </div>

    <h3 className="font-display text-xl sm:text-2xl font-bold uppercase leading-tight mb-1">{title}</h3>
    <p className="text-[#FFD700] text-sm font-display uppercase tracking-wider mb-5">{subtitle}</p>

    <ul className="space-y-2.5 mb-6 flex-1">
      {bullets.map((b) => (
        <li key={b} className="flex items-start gap-3">
          <CheckCircle2 className="size-5 text-[#FFD700] shrink-0 mt-0.5" />
          <span className="text-sm sm:text-base">{b}</span>
        </li>
      ))}
    </ul>

    <div className="flex items-baseline gap-3 mb-5">
      {oldPrice && <span className="text-base text-muted-foreground line-through">{oldPrice}</span>}
      <span className={`font-display font-bold text-gold-gradient ${highlight ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"}`}>
        {price}
      </span>
    </div>

    <RedCta label={trackingLabel} product={product}>{ctaLabel}</RedCta>

    <p className="text-xs text-muted-foreground mt-4 text-center inline-flex items-center justify-center gap-2">
      <ShieldCheck className="size-4 text-[#FFD700]" /> Garantia de 7 dias · Acesso imediato
    </p>
  </article>
  );
};


const faqs = [
  {
    q: "Como recebo o material?",
    a: "Por e-mail, em PDF, logo após a confirmação do pagamento via Hotmart. Acesso vitalício no celular, tablet ou computador.",
  },
  {
    q: "Qual a diferença entre os dois e-books?",
    a: "O Manual do Córner foca em regras, arbitragem e preparação para o canto. O Caminho do Boxeador foca em fundamentos técnicos e metodologia de aula. Juntos formam o método completo do professor.",
  },
  {
    q: "Vale mais a pena comprar o combo?",
    a: `Sim. O combo sai por ${PRODUCTS.combo.priceLabel} (de ${PRODUCTS.combo.oldPriceLabel}) — você economiza ${COMBO_SAVING_LABEL} em relação a comprar os dois separadamente, com ${PRODUCTS.combo.discountLabel}.`,
  },
  {
    q: "Qual o valor de cada material?",
    a: `${PRODUCTS.corner.shortName}: ${PRODUCTS.corner.priceLabel}. ${PRODUCTS.caminho.shortName}: ${PRODUCTS.caminho.priceLabel}. ${PRODUCTS.combo.shortName}: ${PRODUCTS.combo.priceLabel}.`,
  },
  {
    q: "E se eu não gostar?",
    a: "Você tem 7 dias para pedir reembolso. 100% do seu dinheiro de volta, sem perguntas. Risco zero.",
  },
];

const Faq = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden transition-smooth hover:border-[#FFD700]/40">
      <button
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) trackEvent("faq_open", { event_category: "engagement", event_label: q });
        }}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display font-semibold text-base sm:text-lg uppercase tracking-wide">{q}</span>
        <ChevronDown className={`size-5 text-[#FFD700] shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-6 pb-5 text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
};

const Index = () => {
  // [Meta Pixel] ViewContent — dispara ao carregar a landing do e-book
  useEffect(() => {
    trackViewContent({
      value: PRODUCTS.combo.price,
      contentName: PRODUCTS.combo.name,
      contentCategory: PRODUCTS.combo.category,
      contentIds: [PRODUCTS.combo.id],
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] overflow-x-hidden">
      {/* HERO */}
      <header className="relative pt-12 pb-20">
        <div className="absolute inset-0 z-0 gradient-hero" />
        <div
          className="absolute inset-0 z-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, hsl(40 53% 54% / 0.4) 0 1px, transparent 1px 14px)",
          }}
        />
        {/* Holofote dourado */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FFD700]/10 rounded-full blur-[120px] z-0" />

        <div className="container relative z-10 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/40 mb-6">
            <Flame className="size-4 text-[#FFD700]" />
            <span className="text-xs sm:text-sm font-display font-semibold tracking-widest uppercase text-[#FFD700]">
              Boxe de Cria · Materiais Oficiais
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase leading-[0.95] mb-6">
            O manual que faltava para você ensinar boxe com{" "}
            <span className="text-gold-gradient">método e segurança</span>.
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Dois guias visuais que transformam o improviso em aula profissional. Chega de conteúdo genérico.
          </p>

          {/* Imagem real do combo — evita sobreposição de duas capas */}
          <div className="relative flex justify-center mb-10 animate-slide-up">
            <div className="absolute inset-0 bg-[#FFD700]/10 blur-3xl rounded-full" />
            <img
              src={COVERS.combo.src}
              alt={COVERS.combo.alt}
              width={COVERS.combo.width}
              height={COVERS.combo.height}
              className="relative w-full max-w-md sm:max-w-lg md:max-w-2xl h-auto object-contain drop-shadow-2xl"
              style={{ aspectRatio: `${COVERS.combo.width} / ${COVERS.combo.height}` }}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            <RedCta label="Hero · Comprar agora" product="combo" className="px-12 py-8 text-lg sm:text-xl">
              Comprar agora com acesso imediato
            </RedCta>

            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <ArrowRight className="size-4 text-[#FFD700] animate-pulse" /> A partir de {LOWEST_PRICE_LABEL} ou combo por{" "}
              {PRODUCTS.combo.priceLabel} ({PRODUCTS.combo.discountLabel})
            </p>
          </div>

          {/* Selos */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-display uppercase tracking-wider mt-8 text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Lock className="size-4 text-[#FFD700]" /> Compra Segura Hotmart</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-[#FFD700]" /> Garantia de 7 Dias</span>
            <span className="inline-flex items-center gap-2"><Zap className="size-4 text-[#FFD700]" /> Acesso Imediato</span>
          </div>
        </div>
      </header>

      {/* PRODUTOS */}
      <section id="produtos" className="py-20 sm:py-28">
        <div className="container">
          <SectionTitle
            kicker="Escolha seu manual"
            title="Três opções, um único método"
            sub="Comece pelo que mais precisa — ou leve o combo completo com desconto."
          />

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            <ProductCard
              product="corner"
              badge="E-book 1 · Regras"
              ctaLabel="Comprar agora"
              trackingLabel="Card · Manual do Córner"
            />

            <ProductCard
              product="caminho"
              badge="E-book 2 · Fundamentos"
              ctaLabel="Comprar agora"
              trackingLabel="Card · Caminho do Boxeador"
            />

            <ProductCard
              product="combo"
              badge="Combo · Os dois manuais"
              ctaLabel="Levar os dois"
              trackingLabel="Card · Combo"
              highlight
            />
          </div>
        </div>
      </section>

      {/* POR QUE CONFIAR — somente fatos verificáveis */}
      <section className="py-20 sm:py-28 bg-[#F5F5F5] text-[#0D0D0D]">
        <div className="container">
          <SectionTitle
            light
            kicker="Transparência"
            title="Por que confiar"
            sub="Sem promessas de resultado e sem depoimentos: só o que dá para conferir antes de comprar."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                Icon: Award,
                title: "Autoria identificada",
                text: "Material assinado por Satoshi Nishiuchi, da Boxe de Cria, com canais públicos no Instagram e no YouTube.",
              },
              {
                Icon: BookOpen,
                title: "Material visual verificável",
                text: `${PRODUCTS.corner.pages} e ${PRODUCTS.caminho.pages} de conteúdo ilustrado, com sumário e pranchas técnicas.`,
              },
              {
                Icon: ShieldCheck,
                title: "Base em regulamentos oficiais",
                text: "O conteúdo de regras e arbitragem é organizado a partir de regulamentos oficiais vigentes; não substitui o texto original da entidade.",
              },
              {
                Icon: Lock,
                title: "Pagamento e garantia Hotmart",
                text: "Compra processada pela Hotmart, com nota, suporte e prazo de arrependimento de 7 dias informado no checkout.",
              },
            ].map((d) => (
              <div key={d.title} className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
                <d.Icon className="size-7 text-[#D32F2F] mb-3" />
                <h3 className="font-display font-bold uppercase text-sm mb-2">{d.title}</h3>
                <p className="text-[15px] leading-relaxed text-black/75">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="py-20 sm:py-24 bg-[#FFF8E1] text-[#0D0D0D]">
        <div className="container max-w-3xl text-center">
          <ShieldCheck className="size-24 mx-auto text-[#D32F2F] mb-4" strokeWidth={2.2} />
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase mb-4">
            Risco zero — 7 dias de garantia
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Se não gostar por qualquer motivo, devolvo <strong>100% do seu dinheiro</strong>. Sem perguntas.
          </p>
          <GoldCta label="Garantia · Baixar e-book" product="combo">Baixar o e-book agora</GoldCta>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="container max-w-3xl">
          <SectionTitle kicker="Dúvidas" title="Perguntas frequentes" />
          <div className="space-y-3">
            {faqs.map((f) => <Faq key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="py-16 border-t border-border bg-[#0a0a0a]">
        <div className="container text-center space-y-4">
          <div className="mb-8">
            <RedCta label="Footer · Comprar agora" product="combo">Comprar agora com acesso imediato</RedCta>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 text-xs font-display uppercase tracking-widest text-muted-foreground mb-6">
            <span className="inline-flex items-center gap-2"><Lock className="size-4 text-[#FFD700]" /> Compra Segura</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-[#FFD700]" /> Garantia 7 Dias</span>
            <span className="inline-flex items-center gap-2"><BookOpen className="size-4 text-[#FFD700]" /> Acesso Vitalício</span>
            <span className="inline-flex items-center gap-2"><Headphones className="size-4 text-[#FFD700]" /> Suporte com o Autor</span>
          </div>

          <div className="font-display text-2xl font-bold uppercase tracking-wider text-gold-gradient">Boxe de Cria</div>
          <div className="font-display uppercase tracking-[0.3em] text-sm text-[#FFD700]">De Cria pra Cria</div>
          <p className="text-muted-foreground text-sm">Satoshi Nishiuchi · Autor</p>

          <div className="flex justify-center gap-4 pt-3">
            <a
              href="https://instagram.com/boxedecria_"
              target="_blank"
              rel="noopener noreferrer"
              className="size-11 rounded-full border border-border flex items-center justify-center hover:border-[#FFD700] hover:text-[#FFD700] transition-smooth"
              aria-label="Instagram @boxedecria_"
            >
              <Instagram className="size-5" />
            </a>
            <a
              href="https://youtube.com/@criacombat"
              target="_blank"
              rel="noopener noreferrer"
              className="size-11 rounded-full border border-border flex items-center justify-center hover:border-[#FFD700] hover:text-[#FFD700] transition-smooth"
              aria-label="YouTube @criacombat"
            >
              <Youtube className="size-5" />
            </a>
          </div>

          <p className="text-xs text-muted-foreground max-w-2xl mx-auto pt-6 leading-relaxed">
            Material educativo. Não substitui regulamentos oficiais, orientação profissional individual nem avaliação médica.
          </p>
          <p className="text-xs text-muted-foreground/70 pt-2">
            © {new Date().getFullYear()} Boxe de Cria · Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Botão flutuante mobile — mesmo componente/checkout dos demais CTAs */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden p-3 pb-[calc(env(safe-area-inset-bottom)+12px)] bg-[#0D0D0D]/95 backdrop-blur border-t border-[#D32F2F]/40">
        <HotmartCheckoutButton
          label="Mobile · Comprar agora"
          product="combo"
          variant="primary"
          icon="flame"
          ariaLabel="Comprar agora com acesso imediato"
          className="py-6 text-sm"
        >
          Comprar agora com acesso imediato
        </HotmartCheckoutButton>
      </div>

    </div>
  );
};

export default Index;
