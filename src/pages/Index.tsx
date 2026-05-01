import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Trophy,
  Scale,
  ListChecks,
  Megaphone,
  HeartPulse,
  BookOpenCheck,
  Dumbbell,
  Users,
  Building2,
  HandHeart,
  Swords,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  Download,
  MessageCircle,
  ChevronDown,
  Flame,
  Target,
  Eye,
  Lock,
  FileText,
  Clock,
  Instagram,
} from "lucide-react";
import { useState } from "react";
import ebookMockup from "@/assets/ebook-mockup.png";
import heroBg from "@/assets/hero-bg.jpg";
import preview1 from "@/assets/preview-1.jpg";
import preview2 from "@/assets/preview-2.jpg";
import preview3 from "@/assets/preview-3.jpg";

// 🔧 Edite aqui os links de checkout e WhatsApp
const LINK_CHECKOUT_CAKTO = "https://pay.cakto.com.br/brpc38k_870046";
const LINK_WHATSAPP = "LINK_WHATSAPP";

const PRICE = "R$ 39,90";
const OLD_PRICE = "R$ 79,90";

const CtaButton = ({
  children = "QUERO MEU E-BOOK AGORA",
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) => (
  <a href={LINK_CHECKOUT_CAKTO} target="_blank" rel="noopener noreferrer">
    <Button
      size="lg"
      className={`gradient-blood text-primary-foreground font-display font-bold text-lg sm:text-xl uppercase tracking-wider px-8 py-7 rounded-2xl shadow-blood hover:scale-105 transition-smooth border-2 border-accent/40 animate-pulse-glow ${className}`}
    >
      <Flame className="!size-6 text-accent" />
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
    <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase leading-[1.05] mb-4">
      {title}
    </h2>
    {sub && <p className="text-muted-foreground text-base sm:text-lg">{sub}</p>}
  </div>
);

const painCards = [
  "Você sabe o que realmente conta ponto?",
  "Sabe diferenciar advertência, dedução e desclassificação?",
  "Sabe explicar KO, RSC, abandono e decisão por pontos?",
  "Seu aluno sabe o que não pode fazer no ringue?",
];

const solutionCards = [
  { icon: BookOpenCheck, t: "Linguagem simples" },
  { icon: Eye, t: "Visual didático" },
  { icon: Target, t: "Aplicação prática" },
  { icon: Megaphone, t: "Ideal para professores" },
  { icon: Zap, t: "Ótimo para iniciantes" },
  { icon: ListChecks, t: "Consulta rápida pré-luta" },
];

const features = [
  { n: "01", icon: BookOpenCheck, title: "Regras principais do boxe", desc: "Entenda a estrutura da luta, rounds, categorias, conduta e funcionamento básico." },
  { n: "02", icon: Trophy, title: "Pontuação e critérios de vitória", desc: "Aprenda o que os juízes observam e como o sistema de pontuação é aplicado." },
  { n: "03", icon: Target, title: "Golpes válidos e áreas permitidas", desc: "Saiba onde o golpe pode pontuar e quais áreas são consideradas legais." },
  { n: "04", icon: AlertTriangle, title: "Faltas e penalidades", desc: "Golpe baixo, segurar, empurrar, bater na nuca, virar de costas e outras infrações." },
  { n: "05", icon: Megaphone, title: "Comandos do árbitro", desc: "Entenda os comandos mais importantes e como o atleta deve responder." },
  { n: "06", icon: Dumbbell, title: "Equipamentos obrigatórios", desc: "Luvas, bandagens, protetor bucal, uniforme, capacete e itens de segurança." },
  { n: "07", icon: HeartPulse, title: "Segurança e saúde", desc: "Interrupções, contagens, retorno seguro e proteção do atleta." },
  { n: "08", icon: ListChecks, title: "Checklist para treinador", desc: "Revisão prática para usar antes da aula, treino, sparring ou competição." },
];

const audience = [
  "É treinador e quer explicar regras com mais clareza.",
  "É atleta iniciante e quer competir com mais segurança.",
  "Tem projeto social e precisa de material didático.",
  "É pai, mãe ou responsável e quer entender melhor as lutas.",
  "Gosta de boxe e quer assistir sabendo o que está acontecendo.",
  "Quer ensinar boxe com mais organização e profissionalismo.",
];

const without = [
  "Aluno perdido nas regras",
  "Treinador explicando tudo de improviso",
  "Confusão sobre faltas",
  "Insegurança antes da luta",
  "Pouca padronização no ensino",
];

const withGuide = [
  "Revisão rápida",
  "Material visual para aula",
  "Mais clareza para atleta",
  "Mais segurança no treino",
  "Mais autoridade para o professor",
];

const bonuses = [
  { icon: ListChecks, title: "Checklist pré-luta" },
  { icon: AlertTriangle, title: "Resumo de faltas comuns" },
  { icon: Trophy, title: "Guia rápido de pontuação" },
  { icon: BookOpenCheck, title: "Material de apoio para professores" },
  { icon: Eye, title: "Revisão visual para iniciantes" },
];

const seals = [
  { icon: Lock, t: "Pagamento seguro" },
  { icon: FileText, t: "Produto digital" },
  { icon: Clock, t: "Acesso rápido" },
  { icon: BookOpenCheck, t: "PDF educativo" },
  { icon: Instagram, t: "Suporte via Instagram" },
];

const faqs = [
  { q: "Esse e-book serve para iniciantes?", a: "Sim. Ele foi feito com linguagem simples e visual para quem está começando ou quer revisar as regras de forma prática." },
  { q: "Serve para treinadores?", a: "Sim. O treinador é um dos principais públicos. O material ajuda a explicar regras, orientar atletas e organizar melhor o ensino." },
  { q: "É sobre boxe olímpico ou profissional?", a: "O material aborda fundamentos e diferenças importantes entre o boxe amador/olímpico e o profissional, sempre com linguagem acessível." },
  { q: "Recebo o material como?", a: "Após a compra pela Cakto, você recebe o acesso ao material digital." },
  { q: "Posso usar em aula?", a: "Sim. O e-book foi pensado para estudo, consulta e apoio didático." },
  { q: "Substitui regulamento oficial?", a: "Não. É um material educativo e didático. Para competições oficiais, sempre consulte o regulamento vigente da entidade responsável." },
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
      <header className="relative min-h-screen flex items-center pt-10 pb-32 lg:pb-20">
        <div
          className="absolute inset-0 z-0 opacity-25"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-0 gradient-hero opacity-90" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-background/40 via-transparent to-background" />

        <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blood/15 border border-blood/40 mb-6">
              <Flame className="size-4 text-accent" />
              <span className="text-xs sm:text-sm font-display font-semibold tracking-widest uppercase text-foreground">
                E-book visual · Acesso imediato · Apenas {PRICE}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] mb-6">
              Entenda as <span className="text-primary">Regras do Boxe</span> Sem <span className="text-accent">Complicação</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Um guia visual, direto e prático para <strong className="text-foreground">treinadores, atletas, projetos sociais e apaixonados por luta</strong> aprenderem pontuação, faltas, comandos do árbitro, equipamentos, segurança e fundamentos essenciais do boxe.
            </p>

            <div className="flex flex-wrap items-end gap-6 mb-8">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Acesso imediato</div>
                <div className="flex items-baseline gap-3">
                  <span className="text-xl text-muted-foreground line-through">{OLD_PRICE}</span>
                  <span className="font-display text-5xl sm:text-6xl font-bold text-accent">{PRICE}</span>
                </div>
              </div>
            </div>

            <CtaButton />

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Lock className="size-4 text-accent" /> Compra segura pela Cakto</span>
              <span className="hidden sm:inline">·</span>
              <span className="inline-flex items-center gap-2"><FileText className="size-4 text-accent" /> Material digital em PDF</span>
            </div>
          </div>

          {/* Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-blood/20 blur-3xl rounded-full" />
            <img
              src={ebookMockup}
              alt="Capa do e-book Regras do Boxe na Mão — Boxe de Cria"
              className="relative w-full max-w-md animate-float drop-shadow-2xl"
              width={1024}
              height={1024}
            />
            <div className="absolute -bottom-2 right-2 lg:right-10 gradient-gold text-accent-foreground font-display font-bold uppercase text-xs sm:text-sm px-4 py-2 rounded-xl shadow-gold rotate-3">
              PDF Premium
            </div>
          </div>
        </div>
      </header>

      {/* DOR */}
      <section className="py-20 sm:py-28 bg-navy-deep relative">
        <div className="container">
          <SectionTitle
            kicker="A real do ringue"
            title="Treinar boxe sem entender regra é subir no ringue com metade da preparação."
          />
          <p className="text-center text-muted-foreground max-w-3xl mx-auto -mt-6 mb-12 text-base sm:text-lg leading-relaxed">
            Muitos atletas treinam golpe, base, manopla e condicionamento, mas chegam na competição sem entender pontuação, faltas, comandos do árbitro e critérios de decisão. Isso gera <strong className="text-foreground">insegurança, perda de pontos, confusão no corner e risco desnecessário</strong>.
          </p>
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {painCards.map((p) => (
              <div
                key={p}
                className="gradient-card border border-border rounded-2xl p-6 flex gap-4 hover:border-primary/50 transition-smooth"
              >
                <div className="size-12 rounded-xl gradient-blood flex items-center justify-center shrink-0 shadow-blood">
                  <AlertTriangle className="size-6 text-primary-foreground" />
                </div>
                <p className="font-display text-lg font-semibold uppercase leading-tight self-center">{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <SectionTitle
            kicker="A solução"
            title="O Regras do Boxe na Mão foi criado para resolver isso."
            sub="Um material visual e organizado para estudar rápido, revisar antes da aula, orientar atletas iniciantes e ensinar as regras de forma simples, sem linguagem complicada."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto mb-12">
            {solutionCards.map((s) => (
              <div
                key={s.t}
                className="gradient-card border border-border rounded-2xl p-6 flex items-center gap-4 hover:border-accent/50 transition-smooth"
              >
                <div className="size-12 rounded-xl gradient-gold flex items-center justify-center shrink-0 shadow-gold">
                  <s.icon className="size-6 text-accent-foreground" />
                </div>
                <span className="font-display text-lg font-bold uppercase">{s.t}</span>
              </div>
            ))}
          </div>
          <div className="text-center"><CtaButton /></div>
        </div>
      </section>

      {/* O QUE TEM DENTRO */}
      <section className="py-20 sm:py-28 bg-navy-deep">
        <div className="container">
          <SectionTitle
            kicker="Conteúdo"
            title="O que você vai aprender"
            sub="Direto ao ponto. Visual. Pronto para consultar no celular antes da luta."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {features.map((f) => (
              <div
                key={f.title}
                className="gradient-card border border-border rounded-2xl p-6 hover:border-accent/50 hover:-translate-y-1 transition-smooth group relative"
              >
                <span className="absolute top-4 right-5 font-display text-3xl font-bold text-accent/20 group-hover:text-accent/60 transition-smooth">
                  {f.n}
                </span>
                <div className="size-14 rounded-xl bg-secondary border border-border flex items-center justify-center mb-4 group-hover:gradient-blood group-hover:border-transparent transition-smooth">
                  <f.icon className="size-7 text-accent group-hover:text-primary-foreground transition-smooth" />
                </div>
                <h3 className="font-display text-lg font-bold uppercase mb-2 leading-tight">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Prévias visuais */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {[preview1, preview2, preview3].map((src, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden border border-border shadow-deep hover:scale-[1.02] transition-smooth"
              >
                <img
                  src={src}
                  alt={`Prévia da página ${i + 1} do e-book Regras do Boxe na Mão`}
                  className="w-full h-full object-cover aspect-[4/5]"
                  loading="lazy"
                  width={800}
                  height={1024}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 font-display uppercase text-xs tracking-widest text-accent">
                  Prévia {i + 1}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center"><CtaButton /></div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-20 sm:py-28">
        <div className="container max-w-4xl">
          <SectionTitle kicker="Para quem é" title="Esse material é para você se…" />
          <ul className="space-y-4">
            {audience.map((a) => (
              <li
                key={a}
                className="flex items-start gap-4 gradient-card border border-border rounded-2xl p-5 hover:border-accent/40 transition-smooth"
              >
                <CheckCircle2 className="size-6 text-accent shrink-0 mt-0.5" />
                <span className="text-base sm:text-lg">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* AUTORIDADE */}
      <section className="py-20 sm:py-28 bg-navy-deep">
        <div className="container max-w-4xl">
          <SectionTitle kicker="Autoridade" title="Criado por quem vive o boxe na prática" />
          <div className="gradient-card border border-border rounded-2xl p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="size-8 text-accent" />
              <span className="font-display font-bold uppercase tracking-wide">Boxe de Cria</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-8 text-base sm:text-lg">
              Material desenvolvido por <strong className="text-foreground">Satoshi Nishiuchi</strong>, fisioterapeuta, quiropraxista, treinador de boxe e criador do Boxe de Cria. O objetivo é unir <strong className="text-foreground">técnica, segurança, didática e valores de formação</strong> para tornar o boxe mais claro, acessível e bem ensinado.
            </p>
            <div className="border-t border-border pt-6">
              <div className="font-display text-2xl font-bold uppercase">Satoshi Nishiuchi</div>
              <div className="text-accent font-display uppercase tracking-widest text-sm mt-1">Boxe de Cria</div>
            </div>
          </div>
        </div>
      </section>

      {/* VALOR — comparação */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <SectionTitle kicker="O valor real" title="Por que esse e-book vale mais do que custa?" />
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Sem o guia */}
            <div className="rounded-2xl p-8 border border-primary/40 bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <XCircle className="size-6 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase">Sem o guia</h3>
              </div>
              <ul className="space-y-3">
                {without.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-muted-foreground">
                    <XCircle className="size-5 text-primary shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Com o guia */}
            <div className="rounded-2xl p-8 border-2 border-accent bg-card shadow-gold">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-lg gradient-gold flex items-center justify-center">
                  <CheckCircle2 className="size-6 text-accent-foreground" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase">Com o guia</h3>
              </div>
              <ul className="space-y-3">
                {withGuide.map((w) => (
                  <li key={w} className="flex items-start gap-3 text-foreground">
                    <CheckCircle2 className="size-5 text-accent shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* OFERTA */}
      <section className="py-20 sm:py-28 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-blood/10" />
        <div className="container relative z-10 max-w-3xl text-center">
          <span className="inline-block text-accent font-display font-bold tracking-[0.3em] text-xs sm:text-sm uppercase mb-3">
            Oferta de Lançamento
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase leading-[1.05] mb-6">
            Garanta agora o seu <span className="text-accent">Regras do Boxe na Mão</span>
          </h2>
          <p className="text-lg text-foreground/90 mb-8">
            Pagamento único. Acesso digital. Material em PDF para estudar, consultar e usar como apoio didático.
          </p>

          <div className="gradient-card border-2 border-accent/40 rounded-3xl p-8 mb-8 shadow-deep">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-5 fill-accent text-accent" />
              ))}
            </div>
            <div className="flex items-baseline justify-center gap-3 mb-1">
              <span className="text-xl text-muted-foreground line-through">De {OLD_PRICE}</span>
            </div>
            <div className="font-display text-6xl sm:text-7xl font-bold text-accent mb-1">{PRICE}</div>
            <div className="text-sm text-muted-foreground mb-6">à vista · Pix, cartão ou boleto</div>
            <a href={LINK_CHECKOUT_CAKTO} target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                className="gradient-blood text-primary-foreground font-display font-bold text-base sm:text-xl uppercase tracking-wider px-8 py-7 rounded-2xl shadow-blood hover:scale-105 transition-smooth border-2 border-accent/40 animate-pulse-glow w-full sm:w-auto"
              >
                <Flame className="!size-6 text-accent" />
                COMPRAR AGORA POR {PRICE}
              </Button>
            </a>
            <div className="text-xs text-muted-foreground mt-4">
              Entrega pela Cakto · Acesso imediato após confirmação
            </div>
          </div>
        </div>
      </section>

      {/* BÔNUS */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <SectionTitle
            kicker="Bônus inclusos"
            title="Ao comprar, você recebe também"
            sub="Tudo dentro do mesmo PDF, sem precisar baixar nada extra."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {bonuses.map((b) => (
              <div
                key={b.title}
                className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-accent/30 hover:border-accent transition-smooth"
              >
                <div className="size-12 rounded-xl gradient-gold flex items-center justify-center shrink-0">
                  <b.icon className="size-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-accent text-xs font-display font-bold uppercase tracking-widest mb-1">
                    + Bônus
                  </div>
                  <h3 className="font-display text-lg font-bold uppercase leading-tight">{b.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GARANTIA / CONFIANÇA */}
      <section className="py-20 sm:py-28 bg-navy-deep">
        <div className="container max-w-4xl">
          <SectionTitle kicker="Confiança" title="Compra simples e segura" />
          <p className="text-center text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-10">
            Você será direcionado para a página de pagamento segura da Cakto. Após a confirmação, receberá o acesso ao material digital.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {seals.map((s) => (
              <div
                key={s.t}
                className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-card border border-border text-center"
              >
                <div className="size-12 rounded-xl gradient-gold flex items-center justify-center">
                  <s.icon className="size-6 text-accent-foreground" />
                </div>
                <span className="font-display text-xs sm:text-sm font-bold uppercase">{s.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="container max-w-3xl">
          <SectionTitle kicker="Dúvidas frequentes" title="Perguntas que todo mundo faz" />
          <div className="space-y-4">
            {faqs.map((f) => <Faq key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 sm:py-28 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-blood/10" />
        <div className="container relative z-10 max-w-3xl text-center">
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold uppercase leading-[1.05] mb-6">
            Não deixe a regra ser o <span className="text-primary">ponto fraco</span> do seu boxe.
          </h2>
          <p className="text-lg text-foreground/90 mb-10">
            Aprenda, revise, ensine e entre no ringue com mais clareza.
          </p>
          <CtaButton />
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
            <Download className="size-4 text-accent" />
            <span>Acesso digital imediato após o pagamento</span>
          </div>
        </div>
      </section>

      {/* WHATSAPP */}
      <section className="py-16 bg-navy-deep">
        <div className="container max-w-2xl text-center">
          <div className="inline-flex size-16 rounded-2xl gradient-gold items-center justify-center mb-5 shadow-gold">
            <MessageCircle className="size-8 text-accent-foreground" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase mb-3">
            Tem dúvida? Chame no WhatsApp
          </h2>
          <p className="text-muted-foreground mb-6">
            A gente responde direto, sem enrolação, antes da sua compra.
          </p>
          <a href={LINK_WHATSAPP} target="_blank" rel="noopener noreferrer">
            <Button
              size="lg"
              variant="outline"
              className="font-display font-bold uppercase tracking-wider border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-2xl px-8 py-6 text-base"
            >
              <MessageCircle className="!size-5" />
              Falar no WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container max-w-4xl text-center">
          <div className="font-display text-2xl font-bold uppercase tracking-wider mb-2">
            Boxe <span className="text-primary">de</span> Cria
          </div>
          <p className="text-sm text-muted-foreground mb-1">Satoshi Nishiuchi</p>
          <p className="text-xs text-accent font-display uppercase tracking-[0.3em] mb-6">
            Conhecimento · Disciplina · Segurança · Respeito
          </p>
          <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-2xl mx-auto mb-4">
            Material educativo. Não substitui regulamentos oficiais, orientação profissional individual, avaliação médica ou normas específicas de federações, comissões e eventos.
          </p>
          <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-2xl mx-auto">
            © Boxe de Cria e Satoshi Nishiuchi. Todos os direitos autorais reservados. Material protegido pela Lei nº 9.610/1998.
          </p>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-3 bg-background/95 backdrop-blur-md border-t border-border">
        <a href={LINK_CHECKOUT_CAKTO} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full gradient-blood text-primary-foreground font-display font-bold uppercase tracking-wider text-base py-6 rounded-xl shadow-blood border border-accent/40">
            <Flame className="!size-5 text-accent" />
            Comprar por {PRICE}
          </Button>
        </a>
      </div>

      {/* WhatsApp floating (desktop) */}
      <a
        href={LINK_WHATSAPP}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="hidden lg:flex fixed bottom-6 right-6 z-50 size-14 rounded-full gradient-gold items-center justify-center shadow-gold hover:scale-110 transition-smooth"
      >
        <MessageCircle className="size-7 text-accent-foreground" />
      </a>
    </div>
  );
};

export default Index;
