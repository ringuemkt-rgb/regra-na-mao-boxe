import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Trophy,
  ListChecks,
  Megaphone,
  HeartPulse,
  BookOpenCheck,
  Dumbbell,
  Users,
  Building2,
  Swords,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  MessageCircle,
  ChevronDown,
  Flame,
  Target,
  Eye,
  Lock,
  FileText,
  Clock,
  Instagram,
  Brain,
  Activity,
  Compass,
  Hand,
  CreditCard,
  QrCode,
  Receipt,
  Wallet,
  Headphones,
  Quote,
} from "lucide-react";
import { useState } from "react";
import promo from "@/assets/caminho-promo.png";
import pageManopla from "@/assets/caminho-pag71-manopla.png";
import pageDefesas from "@/assets/caminho-pag65-defesas.png";
import pageDireto from "@/assets/caminho-pag63-direto.png";
import pageCombinacoes from "@/assets/caminho-pag67-combinacoes.png";
import regrasCover from "@/assets/ebook-cover.png";
import regrasAreas from "@/assets/page-areas-validas.png";
import regrasArbitro from "@/assets/page-arbitro-juizes.png";
import regrasFaltas from "@/assets/page-faltas.png";
import regrasJuizRound from "@/assets/page-juiz-round.png";

// 🔧 Edite aqui o link de pagamento e o WhatsApp
const PAYMENT_LINK = "https://go.hotmart.com/D105758904F";
const PAYMENT_LINK_REGRAS = "https://pay.cakto.com.br/3wz3cxj_768081";
const LINK_WHATSAPP = "LINK_WHATSAPP";

const PRICE = "R$ 67,00";
const OLD_PRICE = "R$ 127,00";
const PRICE_REGRAS = "R$ 39,90";

const CtaButton = ({
  children = "GARANTIR MEU E-BOOK AGORA",
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <a
    href={PAYMENT_LINK}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => {
      // @ts-ignore
      if (typeof window !== "undefined" && (window as any).fbq) (window as any).fbq("track", "InitiateCheckout");
    }}
  >
    <Button
      size="lg"
      className={`bg-[#D32F2F] hover:bg-[#B71C1C] text-white font-display font-bold text-base sm:text-xl uppercase tracking-wider px-6 sm:px-10 py-7 rounded-xl shadow-blood hover:scale-[1.02] transition-all duration-300 border-2 border-[#D32F2F] ${className}`}
    >
      <Flame className="!size-6" />
      {children}
    </Button>
  </a>
);

const SectionTitle = ({
  kicker,
  title,
  sub,
}: {
  kicker?: string;
  title: string;
  sub?: string;
}) => (
  <div className="text-center max-w-3xl mx-auto mb-12">
    {kicker && (
      <span className="inline-block text-accent font-display font-bold tracking-[0.3em] text-xs sm:text-sm uppercase mb-3">
        {kicker}
      </span>
    )}
    <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold uppercase leading-[1.05] mb-4">
      {title}
    </h2>
    {sub && <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">{sub}</p>}
  </div>
);

const painCards = [
  { icon: ListChecks, title: "Falta de sequência didática", desc: "Aulas montadas no improviso, sem progressão lógica entre fundamentos." },
  { icon: AlertTriangle, title: "Dificuldade para corrigir erros", desc: "Você vê o erro, mas falta vocabulário técnico e ordem para corrigir." },
  { icon: Target, title: "Treinos sem progressão clara", desc: "O aluno repete por meses e não sente que está evoluindo de verdade." },
];

const content = [
  { icon: ShieldCheck, t: "Postura, guarda e deslocamentos" },
  { icon: Hand, t: "Jab, direto, cruzado, gancho e uppercut" },
  { icon: Eye, t: "Defesa, distância e controle do ringue" },
  { icon: Dumbbell, t: "Bandagem, equipamentos e prevenção" },
  { icon: Activity, t: "Mobilidade, aquecimento e preparação física" },
  { icon: ListChecks, t: "Estrutura da sessão e avaliação" },
  { icon: Brain, t: "Mentalidade, ética e cultura do boxe" },
];

const audience = [
  { icon: Megaphone, t: "Dá aula de boxe ou quer começar" },
  { icon: Dumbbell, t: "É personal trainer e usa boxe nos treinos" },
  { icon: Building2, t: "Trabalha com projeto social" },
  { icon: ListChecks, t: "Quer organizar melhor suas aulas" },
  { icon: ShieldCheck, t: "Quer corrigir alunos com mais segurança" },
  { icon: BookOpenCheck, t: "Quer estudar boxe de forma profissional" },
];

const benefits = [
  "Menos improviso na aula",
  "Mais clareza para corrigir erros",
  "Mais segurança para conduzir iniciantes",
  "Mais autoridade diante dos alunos",
  "Mais organização para montar treinos",
  "Mais profissionalismo na sua entrega",
];

const bonuses = [
  { icon: ListChecks, title: "Checklist do professor antes da aula", desc: "Tenha certeza de que nada importante foi esquecido antes de começar." },
  { icon: FileText, title: "Modelo simples de planejamento de treino", desc: "Estrutura pronta para montar sessões com aquecimento, técnica e finalização." },
  { icon: AlertTriangle, title: "Lista de erros comuns para corrigir iniciantes", desc: "Os deslizes que mais aparecem nas primeiras aulas — e como corrigir." },
];

const faqs = [
  { q: "O material é físico ou digital?", a: "Digital, em PDF. Você consulta no celular, tablet ou computador." },
  { q: "Para quem é indicado?", a: "Professores, treinadores, personal trainers, praticantes e projetos sociais." },
  { q: "Serve para iniciantes?", a: "Sim, especialmente para quem quer entender e ensinar a base com método." },
  { q: "Como recebo o material?", a: "Por link de acesso enviado logo após a confirmação do pagamento." },
  { q: "Posso revender?", a: "Não. Uso pessoal e educativo, protegido por direitos autorais." },
];

const Faq = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl bg-card overflow-hidden transition-smooth hover:border-accent/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display font-semibold text-base sm:text-lg uppercase tracking-wide">{q}</span>
        <ChevronDown className={`size-5 text-accent shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-6 pb-5 text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* HERO */}
      <header className="relative pt-10 pb-24 lg:pb-20">
        <div className="absolute inset-0 z-0 gradient-hero" />
        <div
          className="absolute inset-0 z-0 opacity-[0.07] mix-blend-screen"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, hsl(40 53% 54% / 0.4) 0 1px, transparent 1px 12px)",
          }}
        />

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/40 mb-6">
              <Star className="size-4 text-accent" />
              <span className="text-xs sm:text-sm font-display font-semibold tracking-widest uppercase">
                Lançamento · Boxe de Cria
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] mb-6">
              Aprenda a ensinar boxe com{" "}
              <span className="text-gold-gradient">método, segurança e autoridade</span>.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Um manual prático para <strong className="text-foreground">professores, treinadores, personal trainers e praticantes</strong> que querem dominar os fundamentos técnicos do boxe e organizar aulas com mais clareza.
            </p>

            <div className="flex flex-wrap items-end gap-6 mb-8">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Acesso digital imediato</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl text-muted-foreground line-through">{OLD_PRICE}</span>
                  <span className="font-display text-5xl sm:text-6xl font-bold text-gold-gradient">{PRICE}</span>
                </div>
              </div>
            </div>

            <CtaButton>QUERO O MANUAL COMPLETO</CtaButton>

            <p className="text-sm text-muted-foreground mt-4 inline-flex items-center gap-2">
              <Lock className="size-4 text-accent" /> Garantia de 7 dias · Acesso imediato · Pagamento seguro
            </p>
          </div>

          {/* Mockup */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="absolute inset-0 bg-accent/15 blur-3xl rounded-full" />
            <img
              src={promo}
              alt="O Caminho do Boxeador — Fundamentos Técnicos · E-book Boxe de Cria"
              className="relative w-full max-w-md drop-shadow-2xl rounded-2xl border border-accent/20"
              width={950}
              height={1400}
            />
          </div>
        </div>
      </header>

      {/* TRUST BANNER */}
      <section className="border-y border-accent/20 bg-navy-deep/80 py-5">
        <div className="container">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 text-xs sm:text-sm font-display uppercase tracking-wider">
            <span className="inline-flex items-center gap-2"><Lock className="size-4 text-accent" /> Compra Segura Hotmart</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-accent" /> Garantia de 7 Dias</span>
            <span className="inline-flex items-center gap-2"><Zap className="size-4 text-accent" /> Acesso Imediato</span>
            <span className="inline-flex items-center gap-2"><Headphones className="size-4 text-accent" /> Suporte com o Autor</span>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-navy-deep relative">
        <div className="container">
          <SectionTitle
            kicker="O problema"
            title="Você está ensinando boxe… ou apenas repetindo treino?"
            sub="Muitos professores sabem fazer, mas não sabem organizar o ensino. O resultado é aula improvisada, aluno confuso, erro técnico repetido e pouca evolução. Este manual foi criado para transformar conhecimento solto em método aplicável."
          />
          <div className="grid sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {painCards.map((p) => (
              <div key={p.title} className="gradient-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-smooth">
                <div className="size-12 rounded-xl gradient-blood flex items-center justify-center mb-4 shadow-blood">
                  <p.icon className="size-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold uppercase leading-tight mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="py-20 sm:py-28">
        <div className="container max-w-4xl text-center">
          <SectionTitle
            kicker="A solução"
            title="O Caminho do Boxeador organiza o ensino do boxe — do fundamento à aplicação."
            sub="Você terá uma estrutura visual e prática para planejar aulas, corrigir postura, ensinar golpes, trabalhar defesa, controlar progressão e conduzir o aluno com mais segurança."
          />
          <CtaButton />
        </div>
      </section>

      {/* O QUE VOCÊ VAI ENCONTRAR */}
      <section className="py-20 sm:py-28 bg-navy-deep">
        <div className="container">
          <SectionTitle
            kicker="Conteúdo"
            title="O que você vai encontrar"
            sub="Tudo o que sustenta uma aula de boxe bem dada — do fundamento básico à condução pedagógica."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-12">
            {content.map((c) => (
              <div key={c.t} className="gradient-card border border-border rounded-2xl p-6 flex items-center gap-4 hover:border-accent/50 transition-smooth">
                <div className="size-12 rounded-xl gradient-gold flex items-center justify-center shrink-0 shadow-gold">
                  <c.icon className="size-6 text-accent-foreground" />
                </div>
                <span className="font-display text-base sm:text-lg font-bold uppercase leading-tight">{c.t}</span>
              </div>
            ))}
          </div>
          <div className="text-center"><CtaButton /></div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <SectionTitle kicker="Público" title="Esse material é para você se…" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {audience.map((a) => (
              <div key={a.t} className="gradient-card border border-border rounded-2xl p-6 flex items-start gap-4 hover:border-accent/50 transition-smooth">
                <div className="size-11 rounded-xl bg-secondary border border-border flex items-center justify-center shrink-0">
                  <a.icon className="size-5 text-accent" />
                </div>
                <span className="font-body text-base leading-snug">{a.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-20 sm:py-28 bg-navy-deep">
        <div className="container">
          <SectionTitle
            kicker="Benefícios"
            title="Você não compra só um PDF. Você compra direção."
          />
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
            {benefits.map((b) => (
              <div key={b} className="flex items-start gap-3 bg-card border border-border rounded-xl px-5 py-4">
                <CheckCircle2 className="size-6 text-accent shrink-0" />
                <span className="font-display text-base sm:text-lg uppercase font-semibold">{b}</span>
              </div>
            ))}
          </div>
          <div className="text-center"><CtaButton /></div>
        </div>
      </section>

      {/* PROVA VISUAL — PÁGINAS REAIS */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <SectionTitle
            kicker="Veja por dentro"
            title="Páginas reais do e-book"
            sub="Conteúdo 100% visual, ilustrado e diagramado — exatamente como você vai receber em PDF."
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              { src: pageDireto, tag: "Pág. 63", title: "Direto de trás: potência com controle", desc: "Cadeia mecânica, onde entrar, erros comuns e checklist técnico para gerar força sem perder base." },
              { src: pageDefesas, tag: "Pág. 65", title: "Defesas básicas integradas", desc: "Bloqueio, aparo, slip, esquiva e passo atrás — quando usar cada uma e como combinar com resposta." },
              { src: pageCombinacoes, tag: "Pág. 67", title: "Combinações fundamentais para ensino", desc: "Sequências simples que educam ritmo, distância e decisão — com critérios de qualidade." },
              { src: pageManopla, tag: "Pág. 71", title: "Manopla pedagógica: ritmo, precisão e comunicação", desc: "Como usar a manopla para ensinar técnica, timing, defesa e leitura — sem virar treino aleatório." },
            ].map((p) => (
              <article key={p.title} className="group rounded-2xl overflow-hidden border border-border bg-card shadow-deep hover:border-accent/60 transition-smooth">
                <div className="relative overflow-hidden bg-secondary">
                  <img src={p.src} alt={`Página real do e-book — ${p.title}`} className="w-full h-auto group-hover:scale-[1.02] transition-smooth" loading="lazy" />
                  <div className="absolute top-4 left-4 gradient-gold text-accent-foreground font-display text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-md shadow-gold">
                    {p.tag}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl sm:text-2xl font-bold uppercase mb-2 leading-tight">{p.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{p.desc}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="text-center mt-14"><CtaButton /></div>
        </div>
      </section>

      {/* INVESTIMENTO */}
      <section className="py-20 sm:py-28 bg-[#1A1A1A]">
        <div className="container max-w-3xl">
          <SectionTitle kicker="Investimento" title="Acesso completo ao manual" />
          <div className="rounded-3xl border-2 border-accent/40 bg-card p-8 sm:p-12 text-center shadow-gold">
            <p className="text-muted-foreground text-base sm:text-lg mb-6 leading-relaxed">
              Menos que uma aula particular. Um guia para consultar, estudar e aplicar no treino — para sempre.
            </p>

            <div className="flex items-baseline justify-center gap-4 mb-3">
              <span className="text-2xl text-muted-foreground line-through">{OLD_PRICE}</span>
              <span className="font-display font-bold text-[#FFD700]" style={{ fontSize: '48px', lineHeight: 1 }}>{PRICE}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-8 uppercase tracking-widest">Pagamento único · Acesso vitalício</p>

            <div className="flex flex-wrap justify-center items-center gap-4 mb-8 text-muted-foreground">
              <span className="inline-flex items-center gap-2 text-sm"><QrCode className="size-5 text-accent" /> PIX</span>
              <span className="inline-flex items-center gap-2 text-sm"><CreditCard className="size-5 text-accent" /> Cartão até 12x</span>
              <span className="inline-flex items-center gap-2 text-sm"><Receipt className="size-5 text-accent" /> Boleto</span>
              <span className="inline-flex items-center gap-2 text-sm"><Wallet className="size-5 text-accent" /> PayPal</span>
            </div>

            <CtaButton>COMPRAR AGORA</CtaButton>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Lock className="size-4 text-accent" /> Pagamento 100% seguro via Hotmart</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-accent" /> Garantia de 7 dias</span>
            </div>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-20 sm:py-28 bg-[#F5F5F5] text-[#0D0D0D]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block text-[#B33939] font-display font-bold tracking-[0.3em] text-xs sm:text-sm uppercase mb-3">Prova social</span>
            <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase leading-tight mb-3">O que dizem os professores</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "Carlos Mendes", role: "Professor · Academia Punch", text: "Material extremamente didático. Minhas aulas ficaram muito mais organizadas." },
              { name: "Rafael Souza", role: "Treinador · Projeto Social", text: "Finalmente um material que ensina boxe com método e segurança." },
              { name: "André Lima", role: "Instrutor · Equipe de Competição", text: "As pranchas visuais facilitam demais a correção dos alunos." },
            ].map((d) => (
              <div key={d.name} className="bg-white border border-black/10 rounded-2xl p-6 shadow-sm">
                <Quote className="size-7 text-[#D32F2F] mb-3" />
                <p className="text-[15px] leading-relaxed mb-5">“{d.text}”</p>
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

      {/* GARANTIA — RISCO ZERO */}
      <section className="py-20 sm:py-24 bg-[#FFF8E1] text-[#0D0D0D]">
        <div className="container max-w-3xl text-center">
          <ShieldCheck className="size-20 mx-auto text-[#D32F2F] mb-4" strokeWidth={2.2} />
          <h2 className="font-display text-3xl sm:text-5xl font-bold uppercase mb-4">Risco zero para você</h2>
          <p className="text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Você tem <strong>7 dias</strong> para acessar o material completo. Se por qualquer motivo não gostar, devolvo <strong>100% do seu dinheiro</strong>. Basta enviar um e-mail.
          </p>
          <CtaButton>COMPRAR COM GARANTIA</CtaButton>
        </div>
      </section>

      {/* COMPLETE SUA BIBLIOTECA — E-BOOK REGRAS DO BOXE */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-60" />
        <div className="container relative z-10">
          <SectionTitle
            kicker="Complete sua biblioteca"
            title="Conheça também: Regras do Boxe na Mão"
            sub="O guia visual definitivo para entender as regras oficiais do boxe — perfeito para complementar os fundamentos técnicos e treinar com domínio completo do esporte."
          />

          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
              <img
                src={regrasCover}
                alt="E-book Regras do Boxe na Mão — Boxe de Cria"
                className="relative w-full max-w-sm drop-shadow-2xl rounded-2xl border border-accent/30"
                loading="lazy"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/40 mb-5">
                <Trophy className="size-4 text-primary" />
                <span className="text-xs font-display font-semibold tracking-widest uppercase">2º E-book Boxe de Cria</span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl font-bold uppercase leading-tight mb-4">
                Domine as <span className="text-gold-gradient">regras oficiais</span> do boxe de forma visual e prática.
              </h3>

              <p className="text-muted-foreground text-base sm:text-lg mb-6 leading-relaxed">
                Áreas válidas de golpe, faltas, função do árbitro e dos juízes, critérios de pontuação no sistema 10-Point Must e muito mais — tudo ilustrado para consulta rápida.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  "Áreas válidas e proibidas de golpe",
                  "Faltas e penalidades explicadas",
                  "Funções do árbitro e dos juízes",
                  "Como um round é pontuado (10-Point Must)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="size-5 text-accent shrink-0 mt-0.5" />
                    <span className="font-body text-base">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">Por apenas</span>
                <span className="font-display text-5xl font-bold text-gold-gradient">{PRICE_REGRAS}</span>
              </div>

              <a
                href={PAYMENT_LINK_REGRAS}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  // @ts-ignore
                  if (typeof window !== "undefined" && (window as any).fbq) (window as any).fbq("track", "InitiateCheckout");
                }}
              >
                <Button
                  size="lg"
                  className="gradient-blood text-primary-foreground font-display font-bold text-base sm:text-lg uppercase tracking-wider px-6 sm:px-8 py-7 rounded-2xl shadow-blood hover:scale-[1.03] transition-smooth border-2 border-primary/60"
                >
                  <BookOpenCheck className="!size-5" />
                  Quero o E-book Regras por {PRICE_REGRAS}
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { src: regrasAreas, tag: "Áreas válidas" },
              { src: regrasFaltas, tag: "Faltas" },
              { src: regrasArbitro, tag: "Árbitro & Juízes" },
              { src: regrasJuizRound, tag: "Pontuação" },
            ].map((p) => (
              <div key={p.tag} className="rounded-xl overflow-hidden border border-border bg-card hover:border-accent/60 transition-smooth group">
                <div className="relative">
                  <img src={p.src} alt={`Página real — ${p.tag}`} className="w-full h-auto group-hover:scale-[1.03] transition-smooth" loading="lazy" />
                  <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur text-foreground font-display text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2 py-1 rounded">
                    {p.tag}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BÔNUS */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <SectionTitle kicker="Brindes" title="Bônus de lançamento" />
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {bonuses.map((b) => (
              <div key={b.title} className="gradient-card border border-accent/30 rounded-2xl p-6 hover:border-accent transition-smooth">
                <div className="size-12 rounded-xl gradient-gold flex items-center justify-center mb-4 shadow-gold">
                  <b.icon className="size-6 text-accent-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold uppercase leading-tight mb-2">{b.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SUPORTE WHATSAPP */}
      <section className="py-16 bg-navy-deep">
        <div className="container max-w-2xl text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase mb-3">Tem dúvida antes de comprar?</h2>
          <p className="text-muted-foreground mb-5">Fale direto com o autor pelo WhatsApp.</p>
          <a
            href={LINK_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-accent/40 text-accent font-display font-semibold uppercase tracking-wider hover:bg-accent/10 transition-smooth"
          >
            <MessageCircle className="size-5" /> Falar no WhatsApp
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="container max-w-3xl">
          <SectionTitle kicker="Dúvidas" title="Perguntas frequentes" />
          <div className="space-y-3">
            {faqs.map((f) => <Faq key={f.q} {...f} />)}
          </div>
          <div className="text-center mt-12"><CtaButton /></div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="py-14 border-t border-border bg-navy-deep">
        <div className="container text-center space-y-3">
          <div className="mb-6"><CtaButton>COMEÇAR AGORA MESMO</CtaButton></div>
          <div className="font-display text-2xl font-bold uppercase tracking-wider text-gold-gradient">Boxe de Cria</div>
          <div className="font-display uppercase tracking-[0.3em] text-sm text-accent">De Cria pra Cria</div>
          <p className="text-muted-foreground text-sm">Satoshi Nishiuchi · Autor</p>
          <a
            href={LINK_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-foreground/80 hover:text-accent transition-smooth text-sm"
          >
            <MessageCircle className="size-4" /> Contato / WhatsApp
          </a>
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto pt-6 leading-relaxed">
            Este material é educativo e não substitui avaliação médica, fisioterapêutica ou regras oficiais de competição.
          </p>
          <p className="text-xs text-muted-foreground/70 pt-4">
            © {new Date().getFullYear()} Boxe de Cria · Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* Botão flutuante mobile */}
      <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden p-3 bg-background/95 backdrop-blur border-t border-accent/30">
        <a href={PAYMENT_LINK} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full gradient-gold text-accent-foreground font-display font-bold text-base uppercase tracking-wider py-6 rounded-xl shadow-gold">
            <Flame className="!size-5" /> Comprar agora · {PRICE}
          </Button>
        </a>
      </div>

      {/* WhatsApp flutuante */}
      <a
        href={LINK_WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden lg:flex fixed bottom-6 right-6 z-50 size-14 rounded-full bg-[#25D366] items-center justify-center shadow-2xl hover:scale-110 transition-smooth"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle className="size-7 text-white" />
      </a>
    </div>
  );
};

export default Index;
