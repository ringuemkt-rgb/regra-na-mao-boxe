import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Trophy,
  Timer,
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
  AlertTriangle,
  Star,
  Download,
  MessageCircle,
  ChevronDown,
  Flame,
} from "lucide-react";
import { useState } from "react";
import ebookMockup from "@/assets/ebook-mockup.png";
import heroBg from "@/assets/hero-bg.jpg";
import preview1 from "@/assets/preview-1.jpg";
import preview2 from "@/assets/preview-2.jpg";
import preview3 from "@/assets/preview-3.jpg";

// 🔧 Edite aqui os links de checkout e WhatsApp
const LINK_CHECKOUT_CAKTO = "LINK_CHECKOUT_CAKTO";
const LINK_WHATSAPP = "LINK_WHATSAPP";

const PRICE = "R$ 48,99";

const CtaButton = ({ children = "QUERO MEU E-BOOK AGORA", className = "" }: { children?: React.ReactNode; className?: string }) => (
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

const SectionTitle = ({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) => (
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

const features = [
  { icon: Trophy, title: "Pontuação e golpes válidos", desc: "Como os juízes pontuam de verdade e o que conta como golpe limpo." },
  { icon: AlertTriangle, title: "Faltas e penalidades", desc: "Cabeçada, golpe baixo, segurar, empurrar — saiba quando perde ponto." },
  { icon: Megaphone, title: "Comandos do árbitro", desc: "Box, Stop, Break, Time. Entenda na hora dentro do ringue." },
  { icon: Scale, title: "Função dos juízes", desc: "Como o resultado é decidido nos três cards e o que cada juiz observa." },
  { icon: HandHeart, title: "Responsabilidades do corner", desc: "O que o segundo pode (e não pode) fazer entre os rounds." },
  { icon: Dumbbell, title: "Pesagem e equipamentos", desc: "Luva, bandagem, protetor bucal, capacete: o que vale e o que reprova." },
  { icon: HeartPulse, title: "KO/RSC e segurança médica", desc: "Contagem, RSC, suspensões médicas e protocolo após nocaute." },
  { icon: Swords, title: "Amador vs. profissional", desc: "Diferenças de rounds, equipamentos, pontuação e estratégia." },
  { icon: ListChecks, title: "Checklist final do treinador", desc: "Página de consulta rápida para usar antes de cada luta." },
];

const audience = [
  { icon: Megaphone, title: "Treinadores", desc: "Pare de perder atleta por detalhe que ninguém ensinou." },
  { icon: Zap, title: "Atletas iniciantes", desc: "Entre no ringue sabendo o que pode e o que não pode." },
  { icon: Trophy, title: "Atletas competidores", desc: "Some pontos por inteligência, não só por força." },
  { icon: Building2, title: "Academias", desc: "Padronize o ensino de regras na sua sala." },
  { icon: HandHeart, title: "Projetos sociais", desc: "Material acessível para formar atletas com base sólida." },
  { icon: Users, title: "Equipes de competição", desc: "Toda a comissão técnica falando a mesma língua." },
];

const bonuses = [
  { icon: ListChecks, title: "Checklist do Treinador", desc: "Conferência completa antes de subir no ringue." },
  { icon: BookOpenCheck, title: "Glossário Essencial", desc: "Termos do boxe traduzidos e explicados." },
  { icon: AlertTriangle, title: "Consulta Rápida de Faltas", desc: "Página única para abrir no celular durante o treino." },
  { icon: Megaphone, title: "Guia de Comandos", desc: "Tudo o que o árbitro fala — e o que fazer em cada um." },
];

const faqs = [
  { q: "Como recebo o material?", a: "Após a confirmação do pagamento via Cakto você recebe o link de download do PDF imediatamente por e-mail. É 100% digital." },
  { q: "Serve para iniciante?", a: "Sim. A linguagem é direta e visual. Quem está começando entende todas as regras sem precisar de conhecimento prévio." },
  { q: "Serve para treinador?", a: "Sim — esse é o foco principal. Tem checklist do córner, comandos do árbitro, responsabilidades do segundo e diferenças entre amador e profissional." },
  { q: "É impresso?", a: "Não. É um e-book em PDF de alta qualidade, otimizado para leitura no celular, tablet e computador. Você pode imprimir se quiser." },
  { q: "Posso usar em aula?", a: "Sim. O material é ideal para apoiar treinos, aulas teóricas e formação de novos atletas dentro da sua academia ou projeto." },
  { q: "As regras podem variar?", a: "Sim. Federação, evento e categoria podem ter ajustes. O e-book usa fontes oficiais (World Boxing, CBBoxe e regulamentos profissionais), mas o regulamento oficial do evento sempre prevalece." },
  { q: "Como faço o pagamento?", a: "O pagamento é processado pela Cakto, plataforma segura. Você pode pagar via Pix, cartão de crédito ou boleto." },
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
        <span className="font-display font-semibold text-lg uppercase tracking-wide">{q}</span>
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
          className="absolute inset-0 z-0 opacity-30"
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
                Boxe de Cria · Oferta de Lançamento
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-[0.95] mb-6">
              Pare de perder luta por <span className="text-primary">não dominar</span> as <span className="text-accent">regras do boxe</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Guia visual prático para treinadores e atletas entenderem <strong className="text-foreground">pontuação, faltas, penalidades, arbitragem, equipamentos, corner, segurança médica</strong> e resultados oficiais.
            </p>

            <div className="flex flex-wrap items-end gap-6 mb-8">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Lançamento</div>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-5xl sm:text-6xl font-bold text-accent">{PRICE}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">à vista no Pix · ou no cartão</div>
              </div>
            </div>

            <CtaButton />

            <div className="flex items-center gap-2 mt-6 text-sm text-muted-foreground">
              <Download className="size-4 text-accent" />
              <span>Acesso digital imediato após pagamento</span>
            </div>
          </div>

          {/* Mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 bg-blood/20 blur-3xl rounded-full" />
            <img
              src={ebookMockup}
              alt="Capa do e-book Regras do Boxe — Boxe de Cria"
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
            title="Treinar forte não basta"
          />
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { icon: AlertTriangle, t: "Perdeu ponto que era seu", d: "Golpe limpo que o juiz não validou — porque você não sabia onde acertar." },
              { icon: ShieldCheck, t: "Tomou warning bobo", d: "Cabeçada, golpe baixo, segurar… falta que custa o round inteiro." },
              { icon: Swords, t: "Foi desclassificado", d: "Atitude que parecia normal no treino virou DQ na hora da luta." },
              { icon: Trophy, t: "Perdeu resultado oficial", d: "Decisão dividida que poderia ter sido sua — se o corner soubesse a regra." },
            ].map((x) => (
              <div
                key={x.t}
                className="gradient-card border border-border rounded-2xl p-6 flex gap-4 hover:border-primary/50 transition-smooth"
              >
                <div className="size-12 rounded-xl gradient-blood flex items-center justify-center shrink-0 shadow-blood">
                  <x.icon className="size-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase mb-1">{x.t}</h3>
                  <p className="text-muted-foreground text-sm">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-lg sm:text-xl text-foreground/90 mt-12 max-w-2xl mx-auto">
            <strong className="text-accent">Quem domina a regra, controla a luta.</strong> Esse e-book existe para você nunca mais perder por desconhecimento.
          </p>
        </div>
      </section>

      {/* O QUE VOCÊ RECEBE */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <SectionTitle
            kicker="O que você recebe"
            title="Tudo o que importa, num só PDF"
            sub="Direto ao ponto. Visual. Pronto para consultar no celular antes da luta."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {features.map((f) => (
              <div
                key={f.title}
                className="gradient-card border border-border rounded-2xl p-6 hover:border-accent/50 hover:-translate-y-1 transition-smooth group"
              >
                <div className="size-14 rounded-xl bg-secondary border border-border flex items-center justify-center mb-4 group-hover:gradient-blood group-hover:border-transparent transition-smooth">
                  <f.icon className="size-7 text-accent group-hover:text-primary-foreground transition-smooth" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center"><CtaButton /></div>
        </div>
      </section>

      {/* PROVA VISUAL */}
      <section className="py-20 sm:py-28 bg-navy-deep">
        <div className="container">
          <SectionTitle
            kicker="Por dentro do material"
            title="Visual, direto e fácil de consultar no treino"
            sub="Páginas ilustradas, ícones objetivos e diagramas que você entende em segundos."
          />
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[preview1, preview2, preview3].map((src, i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden border border-border shadow-deep hover:scale-[1.02] transition-smooth"
              >
                <img
                  src={src}
                  alt={`Prévia da página ${i + 1} do e-book Regras do Boxe`}
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
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-20 sm:py-28">
        <div className="container">
          <SectionTitle kicker="Para quem é" title="Feito para quem vive o boxe" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {audience.map((a) => (
              <div
                key={a.title}
                className="gradient-card border border-border rounded-2xl p-6 flex items-start gap-4 hover:border-primary/40 transition-smooth"
              >
                <div className="size-12 rounded-xl gradient-gold flex items-center justify-center shrink-0 shadow-gold">
                  <a.icon className="size-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold uppercase mb-1">{a.title}</h3>
                  <p className="text-muted-foreground text-sm">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BÔNUS */}
      <section className="py-20 sm:py-28 bg-navy-deep">
        <div className="container">
          <SectionTitle
            kicker="Bônus inclusos"
            title="Mais valor que o preço cobra"
            sub="Tudo dentro do mesmo PDF, sem precisar baixar nada extra."
          />
          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto mb-12">
            {bonuses.map((b) => (
              <div key={b.title} className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-accent/30 hover:border-accent transition-smooth">
                <div className="size-12 rounded-xl gradient-gold flex items-center justify-center shrink-0">
                  <b.icon className="size-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-accent text-xs font-display font-bold uppercase tracking-widest mb-1">+ Bônus</div>
                  <h3 className="font-display text-lg font-bold uppercase">{b.title}</h3>
                  <p className="text-muted-foreground text-sm">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center"><CtaButton /></div>
        </div>
      </section>

      {/* AUTORIDADE */}
      <section className="py-20 sm:py-28">
        <div className="container max-w-4xl">
          <SectionTitle kicker="Credibilidade" title="Baseado em fontes oficiais" />
          <div className="gradient-card border border-border rounded-2xl p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="size-8 text-accent" />
              <span className="font-display font-bold uppercase tracking-wide">Material atualizado</span>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Conteúdo construído a partir de regulamentos e materiais oficiais — incluindo
              {" "}<strong className="text-foreground">World Boxing</strong>, <strong className="text-foreground">CBBoxe</strong>{" "}
              e regulamentos das principais entidades e comissões do boxe profissional. Tudo traduzido para a realidade brasileira do ringue, do treino e da corner.
            </p>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary border border-border">
              <AlertTriangle className="size-5 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Importante:</strong> o regulamento oficial do evento, federação ou comissão sempre prevalece. Use este e-book como base de estudo e consulta — confirme detalhes específicos no edital de cada competição.
              </p>
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
            Garanta seu acesso por <span className="text-accent">{PRICE}</span>
          </h2>
          <p className="text-lg text-foreground/90 mb-8">
            <strong>Menos que muita bandagem</strong> — e mais valioso que <strong className="text-primary">uma luta perdida por erro de regra.</strong>
          </p>

          <div className="gradient-card border-2 border-accent/40 rounded-3xl p-8 mb-8 shadow-deep">
            <div className="flex items-center justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="size-5 fill-accent text-accent" />)}
            </div>
            <ul className="text-left space-y-3 max-w-md mx-auto mb-6">
              {[
                "PDF premium ilustrado em alta qualidade",
                "Acesso imediato após pagamento",
                "Leitura em celular, tablet ou computador",
                "Bônus inclusos sem custo extra",
                "Pagamento seguro via Cakto",
              ].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-accent shrink-0 mt-0.5" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <div className="font-display text-6xl sm:text-7xl font-bold text-accent mb-1">{PRICE}</div>
            <div className="text-sm text-muted-foreground mb-6">à vista · Pix, cartão ou boleto</div>
            <CtaButton />
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="size-4 text-accent" />
            <span>Compra 100% segura · Acesso vitalício ao arquivo</span>
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

      {/* WHATSAPP */}
      <section className="py-16 bg-navy-deep">
        <div className="container max-w-2xl text-center">
          <div className="inline-flex size-16 rounded-2xl gradient-gold items-center justify-center mb-5 shadow-gold">
            <MessageCircle className="size-8 text-accent-foreground" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold uppercase mb-3">Tem dúvida? Chame no WhatsApp</h2>
          <p className="text-muted-foreground mb-6">A gente responde direto, sem enrolação, antes da sua compra.</p>
          <a href={LINK_WHATSAPP} target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline" className="font-display font-bold uppercase tracking-wider border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-2xl px-8 py-6 text-base">
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
          <p className="text-sm text-muted-foreground mb-4">por Satoshi Nishiuchi</p>
          <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-2xl mx-auto">
            © Boxe de Cria e Satoshi Nishiuchi. Todos os direitos autorais reservados. Material protegido pela Lei nº 9.610/1998. Reprodução, distribuição, revenda, cópia parcial ou total não autorizada são proibidas.
          </p>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-3 bg-background/95 backdrop-blur-md border-t border-border">
        <a href={LINK_CHECKOUT_CAKTO} target="_blank" rel="noopener noreferrer" className="block">
          <Button className="w-full gradient-blood text-primary-foreground font-display font-bold uppercase tracking-wider text-base py-6 rounded-xl shadow-blood border border-accent/40">
            <Flame className="!size-5 text-accent" />
            Comprar agora — {PRICE}
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
