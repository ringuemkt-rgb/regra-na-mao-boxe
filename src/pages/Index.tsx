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
import { useState } from "react";
import caminhoCover from "@/assets/caminho-promo.png";
import regrasCover from "@/assets/ebook-cover.png";

// 🔧 Links oficiais
const LINK_GUIA = "https://go.hotmart.com/D105758587D"; // Guia do Professor (Regras)
const LINK_CAMINHO = "https://go.hotmart.com/D105758904F"; // Caminho do Boxeador
// ⚠️ Substitua pelo link real do combo da Hotmart quando criado
const LINK_COMBO = "https://go.hotmart.com/D105758904F";

const PRICE_GUIA = "R$ 67,00";
const OLD_PRICE_GUIA = "R$ 97,00";
const PRICE_CAMINHO = "R$ 67,00";
const OLD_PRICE_CAMINHO = "R$ 97,00";
const PRICE_COMBO = "R$ 97,00";
const OLD_PRICE_COMBO = "R$ 134,00";

const trackCheckout = () => {
  // @ts-ignore
  if (typeof window !== "undefined" && (window as any).fbq)
    // @ts-ignore
    (window as any).fbq("track", "InitiateCheckout");
};

const RedCta = ({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer" onClick={trackCheckout} className="inline-block w-full sm:w-auto">
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
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <a href={href} target="_blank" rel="noopener noreferrer" onClick={trackCheckout} className="inline-block w-full sm:w-auto">
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

const ProductCard = ({
  cover,
  badge,
  title,
  desc,
  bullets,
  price,
  oldPrice,
  href,
}: {
  cover: string;
  badge: string;
  title: string;
  desc: string;
  bullets: string[];
  price: string;
  oldPrice: string;
  href: string;
}) => (
  <article className="gradient-card border-2 border-border rounded-3xl p-6 sm:p-8 flex flex-col hover:border-[#FFD700]/60 transition-smooth shadow-deep">
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D32F2F]/15 border border-[#D32F2F]/40 mb-5 self-start">
      <Award className="size-4 text-[#FFD700]" />
      <span className="text-[10px] sm:text-xs font-display font-bold tracking-widest uppercase">{badge}</span>
    </div>

    <div className="relative mb-6 flex justify-center">
      <div className="absolute inset-0 bg-[#FFD700]/10 blur-2xl rounded-full" />
      <img
        src={cover}
        alt={title}
        className="relative h-64 sm:h-72 w-auto drop-shadow-2xl rounded-xl"
        loading="lazy"
      />
    </div>

    <h3 className="font-display text-xl sm:text-2xl font-bold uppercase leading-tight mb-3">{title}</h3>
    <p className="text-muted-foreground text-sm sm:text-base mb-5 leading-relaxed">{desc}</p>

    <ul className="space-y-2.5 mb-6 flex-1">
      {bullets.map((b) => (
        <li key={b} className="flex items-start gap-3">
          <CheckCircle2 className="size-5 text-[#FFD700] shrink-0 mt-0.5" />
          <span className="text-sm sm:text-base">{b}</span>
        </li>
      ))}
    </ul>

    <div className="flex items-baseline gap-3 mb-5">
      <span className="text-base text-muted-foreground line-through">{oldPrice}</span>
      <span className="font-display text-4xl sm:text-5xl font-bold text-gold-gradient">{price}</span>
    </div>

    <RedCta href={href}>Comprar agora</RedCta>

    <p className="text-xs text-muted-foreground mt-4 text-center inline-flex items-center justify-center gap-2">
      <ShieldCheck className="size-4 text-[#FFD700]" /> Garantia de 7 dias · Acesso imediato
    </p>
  </article>
);

const faqs = [
  {
    q: "Por que vale R$ 67 cada e-book?",
    a: "Você recebe um manual visual diagramado por um professor com anos de prática, que organizaria o conteúdo de dezenas de aulas particulares. Menos que uma mensalidade de academia — para consultar e aplicar para sempre.",
  },
  {
    q: "Quanto tempo leva para ler?",
    a: "Cada e-book é objetivo e visual: você consulta páginas específicas conforme a necessidade. Em poucas horas já tem material suficiente para reorganizar suas próximas aulas.",
  },
  {
    q: "Qual a diferença entre os dois e-books?",
    a: "O Guia do Professor foca em didática, regras e arbitragem. O Caminho do Boxeador foca nos fundamentos técnicos (golpes, defesa, deslocamento). Juntos, formam um método completo.",
  },
  {
    q: "E se eu não gostar?",
    a: "Você tem 7 dias para pedir reembolso. 100% do seu dinheiro de volta, sem perguntas. Risco zero.",
  },
  {
    q: "Como recebo o material?",
    a: "Por e-mail, em PDF, logo após a confirmação do pagamento via Hotmart. Acesso vitalício no celular, tablet ou computador.",
  },
];

const Faq = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden transition-smooth hover:border-[#FFD700]/40">
      <button
        onClick={() => setOpen(!open)}
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

        <div className="container relative z-10 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/40 mb-6">
            <Flame className="size-4 text-[#FFD700]" />
            <span className="text-xs sm:text-sm font-display font-semibold tracking-widest uppercase text-[#FFD700]">
              Boxe de Cria · Materiais Oficiais
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase leading-[0.95] mb-6">
            Transforme suas aulas de boxe em um <span className="text-gold-gradient">método profissional</span>.
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Mesmo que você ainda se sinta improvisando — os manuais visuais que faltavam na sua biblioteca.
          </p>

          {/* Mockup duplo */}
          <div className="relative flex items-end justify-center gap-4 sm:gap-8 mb-10 animate-slide-up">
            <div className="absolute inset-0 bg-[#FFD700]/10 blur-3xl rounded-full" />
            <img
              src={regrasCover}
              alt="Guia do Professor de Boxe"
              className="relative h-56 sm:h-80 md:h-96 w-auto drop-shadow-2xl rounded-xl rotate-[-6deg] hover:rotate-0 transition-transform duration-500"
              loading="eager"
            />
            <img
              src={caminhoCover}
              alt="O Caminho do Boxeador — Fundamentos Técnicos"
              className="relative h-56 sm:h-80 md:h-96 w-auto drop-shadow-2xl rounded-xl rotate-[6deg] hover:rotate-0 transition-transform duration-500"
              loading="eager"
            />
          </div>

          <div className="flex flex-col items-center gap-3">
            <RedCta href="#produtos">Quero os manuais agora</RedCta>
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2">
              <ArrowRight className="size-4 text-[#FFD700] animate-pulse" /> A partir de R$ 67 ou combo com desconto
            </p>
            <p className="text-xs uppercase tracking-widest text-[#FFD700]/80 mt-2 font-display">
              🔥 Oferta de lançamento — preço promocional por tempo limitado
            </p>
          </div>
        </div>
      </header>

      {/* TRUST BANNER */}
      <section className="border-y border-[#FFD700]/20 bg-[#0a0a0a] py-5">
        <div className="container">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs sm:text-sm font-display uppercase tracking-wider">
            <span className="inline-flex items-center gap-2"><Lock className="size-4 text-[#FFD700]" /> Compra Segura Hotmart</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-[#FFD700]" /> Garantia 7 Dias</span>
            <span className="inline-flex items-center gap-2"><Zap className="size-4 text-[#FFD700]" /> Acesso Imediato</span>
            <span className="inline-flex items-center gap-2"><Headphones className="size-4 text-[#FFD700]" /> Suporte com o Autor</span>
          </div>
        </div>
      </section>

      {/* PRODUTOS */}
      <section id="produtos" className="py-20 sm:py-28">
        <div className="container">
          <SectionTitle
            kicker="Os manuais"
            title="Escolha o seu — ou leve os dois"
            sub="Dois e-books, um único objetivo: dar a você método, autoridade e clareza para ensinar boxe."
          />

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <ProductCard
              cover={regrasCover}
              badge="E-book 1 · Regras & Didática"
              title="Guia do Professor de Boxe: Da Aula Improvisada ao Aluno que Evolui"
              desc="Domine as regras oficiais, a função do árbitro e os critérios de pontuação — e use isso para estruturar aulas que fazem o aluno evoluir de verdade."
              bullets={[
                "Regras oficiais e arbitragem aplicadas ao ensino",
                "Estrutura didática para sair do improviso",
                "Pontuação, faltas e áreas válidas ilustradas",
              ]}
              price={PRICE_GUIA}
              oldPrice={OLD_PRICE_GUIA}
              href={LINK_GUIA}
            />

            <ProductCard
              cover={caminhoCover}
              badge="E-book 2 · Fundamentos Técnicos"
              title="O Caminho do Boxeador — Manual Completo do Professor"
              desc="O passo a passo dos fundamentos técnicos: postura, golpes, defesa, deslocamentos e progressão pedagógica para iniciantes e avançados."
              bullets={[
                "Jab, direto, cruzado, gancho e uppercut detalhados",
                "Defesa, distância e controle do ringue",
                "Manopla pedagógica e planejamento de aulas",
              ]}
              price={PRICE_CAMINHO}
              oldPrice={OLD_PRICE_CAMINHO}
              href={LINK_CAMINHO}
            />
          </div>
        </div>
      </section>

      {/* COMBO */}
      <section className="py-20 sm:py-28 bg-[#1A1A1A] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, hsl(40 53% 54%) 0 2px, transparent 2px 20px)",
          }}
        />
        <div className="container relative z-10 max-w-4xl">
          <div className="text-center mb-10">
            <span className="inline-block font-display font-bold tracking-[0.3em] text-xs sm:text-sm uppercase mb-3 text-[#D32F2F]">
              Oferta combo
            </span>
            <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold uppercase leading-[1.05] mb-4">
              🔥 Leve os dois e <span className="text-gold-gradient">economize 27%</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              O método completo do professor de boxe: regras + fundamentos técnicos em um único pacote.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-[#FFD700]/50 bg-gradient-to-br from-[#0D0D0D] to-[#1a1a1a] p-8 sm:p-12 text-center shadow-gold">
            <div className="flex items-end justify-center gap-4 sm:gap-8 mb-8">
              <img src={regrasCover} alt="" className="h-32 sm:h-48 w-auto rounded-lg drop-shadow-2xl rotate-[-4deg]" loading="lazy" />
              <img src={caminhoCover} alt="" className="h-32 sm:h-48 w-auto rounded-lg drop-shadow-2xl rotate-[4deg]" loading="lazy" />
            </div>

            <div className="flex items-baseline justify-center gap-4 mb-2">
              <span className="text-xl sm:text-2xl text-muted-foreground line-through">{OLD_PRICE_COMBO}</span>
              <span className="font-display font-bold text-[#FFD700]" style={{ fontSize: "56px", lineHeight: 1 }}>
                {PRICE_COMBO}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-8 uppercase tracking-widest">
              Pagamento único · Acesso vitalício aos 2 e-books
            </p>

            <GoldCta href={LINK_COMBO}>Aproveitar o combo completo</GoldCta>

            <p className="text-xs text-muted-foreground mt-5 inline-flex items-center gap-2">
              <ShieldCheck className="size-4 text-[#FFD700]" /> Garantia de 7 dias · Risco zero
            </p>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 sm:py-28 bg-[#F5F5F5] text-[#0D0D0D]">
        <div className="container">
          <SectionTitle light kicker="Prova social" title="O que dizem os professores" />
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
            Risco zero — 7 dias de garantia incondicional
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Se não gostar por qualquer motivo, devolvo <strong>100% do seu dinheiro</strong>. Sem perguntas.
          </p>
          <RedCta href={LINK_COMBO}>Comprar com confiança</RedCta>
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
            <RedCta href={LINK_COMBO}>Estou pronto para ser um professor blindado</RedCta>
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

      {/* Botão flutuante mobile */}
      <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden p-3 bg-[#0D0D0D]/95 backdrop-blur border-t border-[#D32F2F]/40">
        <a href={LINK_COMBO} target="_blank" rel="noopener noreferrer" onClick={trackCheckout} className="block">
          <Button className="w-full bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-display font-bold text-base uppercase tracking-wider py-6 rounded-xl">
            <Flame className="!size-5" /> Combo · {PRICE_COMBO}
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Index;
