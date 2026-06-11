import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Flame,
  Lock,
  Zap,
  Headphones,
  Quote,
  Instagram,
  Youtube,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
} from "lucide-react";
import { useEffect, useState } from "react";
import caminhoCover from "@/assets/caminho-promo.png";
import regrasCover from "@/assets/ebook-cover.png";
import { handleCheckoutClick, HOTMART_CHECKOUT_URL } from "@/lib/checkout";
import { appendTrackingParamsToUrl } from "@/lib/tracking";
import { trackViewContent } from "@/lib/metaPixel";

// 🔧 Todos os CTAs apontam para o MESMO checkout (combo)
const LINK_COMBO = HOTMART_CHECKOUT_URL;

// 💰 Preços
const PRICE_REGRAS = "R$ 49,90";
const PRICE_FUNDAMENTOS = "R$ 67,90";
const PRICE_COMBO = "R$ 89,90";
const OLD_PRICE_COMBO = "R$ 117,80";

const trackEvent = (name: string, params: Record<string, any> = {}) => {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (w.gtag) w.gtag("event", name, params);
  if (w.fbq) w.fbq("trackCustom", name, params);
};

// CTA vermelho — chama handleCheckoutClick (InitiateCheckout + redirect)
const RedCta = ({
  label,
  value = 89.9,
  children,
  className = "",
}: {
  href?: string; // ignorado: todos vão p/ LINK_COMBO
  label: string;
  value?: number;
  children: React.ReactNode;
  className?: string;
}) => (
  <a
    href={appendTrackingParamsToUrl(LINK_COMBO)}
    onClick={(e) => {
      e.preventDefault();
      handleCheckoutClick(label, value);
    }}
    className="inline-block w-full sm:w-auto cta-button"
  >
    <Button
      size="lg"
      className={`w-full sm:w-auto bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-display font-bold text-base sm:text-lg uppercase tracking-wider px-6 sm:px-10 py-7 rounded-xl shadow-blood transition-all duration-300 border-2 border-[#D32F2F] hover:brightness-90 ${className}`}
    >
      <Flame className="!size-5" />
      {children}
    </Button>
  </a>
);

const GoldCta = ({
  label,
  value = 89.9,
  children,
  className = "",
}: {
  href?: string;
  label: string;
  value?: number;
  children: React.ReactNode;
  className?: string;
}) => (
  <a
    href={appendTrackingParamsToUrl(LINK_COMBO)}
    onClick={(e) => {
      e.preventDefault();
      handleCheckoutClick(label, value);
    }}
    className="inline-block w-full sm:w-auto cta-button"
  >
    <Button
      size="lg"
      className={`w-full sm:w-auto gradient-gold text-[#0D0D0D] font-display font-bold text-base sm:text-xl uppercase tracking-wider px-6 sm:px-12 py-8 rounded-xl shadow-gold transition-all duration-300 border-2 border-[#FFD700] hover:brightness-95 ${className}`}
    >
      <Sparkles className="!size-6" />
      {children}
    </Button>
  </a>
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
  cover: string;
  badge: string;
  title: string;
  subtitle: string;
  bullets: string[];
  price: string;
  oldPrice?: string;
  href: string;
  ctaLabel: string;
  trackingLabel: string;
  trackingValue: number;
  highlight?: boolean;
  badgeOff?: string;
};


const ProductCard = ({
  cover,
  badge,
  title,
  subtitle,
  bullets,
  price,
  oldPrice,
  href,
  ctaLabel,
  trackingLabel,
  trackingValue,
  highlight = false,
  badgeOff,
}: CardProps) => (
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
        src={cover}
        alt={title}
        className="relative h-56 sm:h-64 w-auto drop-shadow-2xl rounded-xl"
        loading="lazy"
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

    <RedCta href={href} label={trackingLabel} value={trackingValue}>{ctaLabel}</RedCta>

    <p className="text-xs text-muted-foreground mt-4 text-center inline-flex items-center justify-center gap-2">
      <ShieldCheck className="size-4 text-[#FFD700]" /> Garantia de 7 dias · Acesso imediato
    </p>
  </article>
);


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
    a: "Sim. O combo sai por R$ 89,90 — você economiza R$ 27,90 em relação a comprar os dois separadamente, com 24% de desconto.",
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
    trackViewContent(89.9);
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

          {/* Mockup duplo */}
          <div className="relative flex items-end justify-center gap-4 sm:gap-8 mb-10 animate-slide-up">
            <div className="absolute inset-0 bg-[#FFD700]/10 blur-3xl rounded-full" />
            <img
              src={regrasCover}
              alt="O Manual do Córner — Regras, Arbitragem & Preparação"
              width="384"
              height="512"
              className="relative h-56 sm:h-80 md:h-96 w-auto drop-shadow-2xl rounded-xl rotate-[-6deg] hover:rotate-0 transition-transform duration-500"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <img
              src={caminhoCover}
              alt="O Caminho do Boxeador — Fundamentos Técnicos & Metodologia"
              width="384"
              height="512"
              className="relative h-56 sm:h-80 md:h-96 w-auto drop-shadow-2xl rounded-xl rotate-[6deg] hover:rotate-0 transition-transform duration-500"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />

          </div>

          <div className="flex flex-col items-center gap-3">
            <RedCta href={LINK_COMBO} label="Hero · Combo" className="px-12 py-8 text-lg sm:text-xl">
              Quero começar agora
            </RedCta>
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <ArrowRight className="size-4 text-[#FFD700] animate-pulse" /> A partir de R$ 49,90 ou combo com 24% OFF
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
              cover={regrasCover}
              badge="E-book 1 · Regras"
              title="O Manual do Córner"
              subtitle="Regras, Arbitragem & Preparação"
              bullets={[
                "44 páginas",
                "Checklist pré-luta",
                "Faltas ilustradas",
                "Leitura de súmula",
              ]}
              price={PRICE_REGRAS}
              href={LINK_COMBO}
              ctaLabel="Comprar agora"
              trackingLabel="Card · Manual do Córner"
            />

            <ProductCard
              cover={caminhoCover}
              badge="E-book 2 · Fundamentos"
              title="O Caminho do Boxeador"
              subtitle="Fundamentos Técnicos & Metodologia"
              bullets={[
                "85 páginas",
                "Pranchas ilustradas",
                "Biomecânica detalhada",
                "Estrutura de aula",
              ]}
              price={PRICE_FUNDAMENTOS}
              href={LINK_COMBO}
              ctaLabel="Comprar agora"
              trackingLabel="Card · Caminho do Boxeador"
            />

            <ProductCard
              cover={caminhoCover}
              badge="Combo · Mais vendido"
              title="Combo Completo"
              subtitle="Os dois manuais juntos"
              bullets={[
                "129 páginas",
                "Regras + Técnica",
                "Preço com desconto",
                "Método completo do professor",
              ]}
              price={PRICE_COMBO}
              oldPrice={OLD_PRICE_COMBO}
              href={LINK_COMBO}
              ctaLabel="Levar os dois"
              trackingLabel="Card · Combo"
              highlight
              badgeOff="24% OFF"
            />
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 sm:py-28 bg-[#F5F5F5] text-[#0D0D0D]">
        <div className="container">
          <SectionTitle light kicker="Prova social" title="Professores que já usam o método" />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Carlos Mendes", role: "Professor · São Paulo/SP", text: "Material que todo professor de boxe deveria ter. Organizou minhas aulas completamente." },
              { name: "Rafael Souza", role: "Treinador · Rio de Janeiro/RJ", text: "Finalmente um material que ensina boxe com método, segurança e didática real." },
              { name: "André Lima", role: "Personal · Belo Horizonte/MG", text: "As pranchas visuais facilitam demais a correção dos meus alunos iniciantes." },
            ].map((d) => (
              <div key={d.name} className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
                <Quote className="size-7 text-[#D32F2F] mb-3" />
                <p className="text-[15px] leading-relaxed mb-5">"{d.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-gradient-to-br from-[#D32F2F] to-[#0D0D0D] flex items-center justify-center text-white font-display font-bold">
                    {d.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-display font-bold uppercase text-sm">{d.name}</div>
                    <div className="text-xs text-black/60">{d.role}</div>
                  </div>
                </div>
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
          <GoldCta href={LINK_COMBO} label="Garantia · Combo">Quero o combo completo</GoldCta>
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
            <RedCta href={LINK_COMBO} label="Footer · Combo">Garantir meu combo agora</RedCta>
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

      {/* Botão flutuante mobile — mesmo checkout único + InitiateCheckout */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden p-3 pb-[calc(env(safe-area-inset-bottom)+12px)] bg-[#0D0D0D]/95 backdrop-blur border-t border-[#D32F2F]/40">
        <a
          href={appendTrackingParamsToUrl(LINK_COMBO)}
          onClick={(e) => {
            e.preventDefault();
            handleCheckoutClick("Mobile · Combo", 89.9);
          }}
          className="block cta-button"
        >
          <Button className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-display font-bold text-base uppercase tracking-wider py-6 rounded-xl">
            <Flame className="!size-5" /> Combo · {PRICE_COMBO}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Index;
