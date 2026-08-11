import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, ChevronRight, Instagram, Menu, Search, ShieldCheck, X, Youtube } from "lucide-react";
import { articles, categories, type Article } from "@/data/editorial";
import { supabase } from "@/integrations/supabase/client";
import { PRODUCT_CHECKOUTS, handleCheckoutUrlClick } from "@/lib/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const PRODUCTS = {
  corner: { name: "O Manual do Córner", subtitle: "Regras, Arbitragem & Preparação", price: 49.9, priceLabel: "R$ 49,90", url: PRODUCT_CHECKOUTS.corner },
  caminho: { name: "O Caminho do Boxeador", subtitle: "Fundamentos Técnicos & Metodologia", price: 67.9, priceLabel: "R$ 67,90", url: PRODUCT_CHECKOUTS.caminho },
  combo: { name: "Combo Completo", subtitle: "Os dois manuais", price: 89.9, priceLabel: "R$ 89,90", oldPrice: "R$ 117,80", url: PRODUCT_CHECKOUTS.combo },
} as const;

export function SEOHead({ title, description, canonical, type = "website" }: { title: string; description: string; canonical: string; type?: "website" | "article" }) {
  useEffect(() => {
    document.title = title;
    const setMeta = (selector: string, attr: "name" | "property", key: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.content = value;
    };
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:url"]', "property", "og:url", canonical);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
  }, [title, description, canonical, type]);
  return null;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  const nav = [
    ["Artigos", "/artigos"],
    ["Técnica", "/categoria/tecnica-e-treino"],
    ["Saúde", "/categoria/saude-do-atleta"],
    ["História", "/categoria/historia-e-cultura"],
    ["Equipamentos", "/categoria/equipamentos"],
    ["Produtos", "/produtos"],
    ["Sobre", "/sobre"],
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link to="/" className="min-w-0">
          <div className="font-display text-lg font-black tracking-wider text-[#F0E6D2]">BOXE DE CRIA</div>
          <div className="text-[9px] uppercase tracking-[.28em] text-[#B78A56]">Visão de Cria</div>
        </Link>
        <nav className="hidden xl:flex items-center gap-5 text-sm text-[#C9BDAA]">
          {nav.map(([label, href]) => <Link key={href} to={href} className="hover:text-[#F0E6D2] transition-colors">{label}</Link>)}
        </nav>
        <div className="hidden sm:flex items-center gap-3">
          <a href="#round-semanal" className="rounded-full border border-[#B78A56]/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#F0E6D2] hover:bg-[#B78A56]/10">Round Semanal</a>
        </div>
        <button aria-label="Abrir menu" onClick={() => setOpen(v => !v)} className="xl:hidden rounded-lg border border-white/10 p-2 text-[#F0E6D2]">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <nav className="xl:hidden border-t border-white/10 bg-[#0B0B0B] px-5 py-4">
          <div className="container grid gap-2">
            {nav.map(([label, href]) => <Link key={href} to={href} className="rounded-lg px-3 py-3 text-[#F0E6D2] hover:bg-white/5">{label}</Link>)}
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#050505] py-12 text-[#C9BDAA]">
      <div className="container grid gap-8 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <div className="font-display text-2xl font-black text-[#F0E6D2]">BOXE DE CRIA</div>
          <div className="mt-1 text-xs uppercase tracking-[.28em] text-[#B78A56]">DE CRIA PRA CRIA</div>
          <p className="mt-4 max-w-md text-sm leading-6">Ciência, técnica e cultura da luta. Conteúdo educacional para quem treina, ensina e vive o boxe.</p>
          <div className="mt-5 flex gap-3">
            <a aria-label="Instagram" href="https://instagram.com/boxedecria_" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 p-2 hover:text-white"><Instagram size={18} /></a>
            <a aria-label="YouTube" href="https://youtube.com/@criacombat" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 p-2 hover:text-white"><Youtube size={18} /></a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-3">
          <Link to="/artigos">Artigos</Link><Link to="/categoria/tecnica-e-treino">Técnica</Link><Link to="/categoria/saude-do-atleta">Saúde</Link>
          <Link to="/categoria/equipamentos">Equipamentos</Link><Link to="/produtos">Produtos</Link><Link to="/sobre">Sobre</Link>
          <Link to="/politica-editorial">Política editorial</Link><Link to="/afiliados">Afiliados</Link><Link to="/privacidade">Privacidade</Link>
          <Link to="/termos">Termos</Link><Link to="/contato">Contato</Link><Link to="/confianca">Confiança</Link>
        </div>
      </div>
      <div className="container mt-10 border-t border-white/10 pt-6 text-xs text-white/45">© {new Date().getFullYear()} Boxe de Cria · SER FORTE É SER GENTIL.</div>
    </footer>
  );
}

export function CategoryPill({ slug, name }: { slug: string; name: string }) {
  return <Link to={`/categoria/${slug}`} className="inline-flex rounded-full border border-[#B78A56]/35 bg-[#B78A56]/8 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#B78A56] hover:bg-[#B78A56]/15">{name}</Link>;
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-[#111] p-5 transition hover:-translate-y-0.5 hover:border-[#B78A56]/40">
      <div className="mb-4"><CategoryPill slug={article.categorySlug} name={article.category} /></div>
      <h3 className="font-display text-xl font-bold leading-tight text-[#F0E6D2] group-hover:text-white"><Link to={`/artigos/${article.slug}`}>{article.title}</Link></h3>
      <p className="mt-3 flex-1 text-sm leading-6 text-[#C9BDAA]">{article.excerpt}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-white/45"><span>{article.readTime}</span><Link to={`/artigos/${article.slug}`} className="inline-flex items-center gap-1 font-bold text-[#B78A56]">Ler artigo <ChevronRight size={15} /></Link></div>
    </article>
  );
}

export function ProductCTA({ product = "combo", compact = false }: { product?: keyof typeof PRODUCTS; compact?: boolean }) {
  const item = PRODUCTS[product];
  return (
    <div className={`rounded-2xl border border-[#B78A56]/35 bg-[#171717] ${compact ? "p-5" : "p-7"}`}>
      <div className="text-xs font-bold uppercase tracking-[.2em] text-[#B78A56]">Material BOXE DE CRIA</div>
      <div className="mt-2 font-display text-xl font-black text-[#F0E6D2]">{item.name}</div>
      <p className="mt-1 text-sm text-[#C9BDAA]">{item.subtitle}</p>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div><span className="font-display text-2xl font-black text-white">{item.priceLabel}</span>{"oldPrice" in item && item.oldPrice ? <span className="ml-2 text-sm text-white/40 line-through">{item.oldPrice}</span> : null}</div>
        <Button onClick={() => handleCheckoutUrlClick(item.url, `Editorial · ${item.name}`, item.price)} className="bg-[#C62828] hover:bg-[#8E1C1C]">Conhecer o material</Button>
      </div>
    </div>
  );
}

export function NewsletterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || !consent) {
      setStatus("error"); setMessage("Preencha nome, e-mail válido e confirme o consentimento."); return;
    }
    setStatus("loading"); setMessage("");
    try {
      const client = supabase as any;
      const { error } = await client.from("newsletter_leads").insert({ name: name.trim(), email: email.trim().toLowerCase(), consent: true, consent_at: new Date().toISOString(), source: "round_semanal" });
      if (error && error.code !== "23505") throw error;
      const w = window as any;
      if (w.gtag) w.gtag("event", "newsletter_signup", { source: "round_semanal" });
      setStatus("success"); setMessage(error?.code === "23505" ? "Este e-mail já está no Round Semanal." : "Cadastro confirmado. Bem-vindo ao Round Semanal.");
      setName(""); setEmail(""); setConsent(false);
    } catch {
      setStatus("error"); setMessage("Não foi possível concluir agora. Tente novamente em instantes.");
    }
  }

  return (
    <section id="round-semanal" className="rounded-3xl border border-[#B78A56]/35 bg-gradient-to-br from-[#171717] to-[#0B0B0B] p-6 sm:p-9">
      <div className="grid gap-7 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div><div className="text-xs font-bold uppercase tracking-[.25em] text-[#B78A56]">ROUND SEMANAL</div><h2 className="mt-2 font-display text-3xl font-black text-[#F0E6D2]">Uma leitura por semana. Sem ruído.</h2><p className="mt-3 max-w-xl leading-7 text-[#C9BDAA]">Uma vez por semana: técnica, prevenção, cultura e bastidores do boxe. Sem spam. Só conteúdo de quem vive a luta.</p></div>
        <form onSubmit={submit} className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2"><Input aria-label="Nome" value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" className="border-white/10 bg-black/30" /><Input aria-label="E-mail" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" type="email" className="border-white/10 bg-black/30" /></div>
          <label className="flex items-start gap-2 text-xs leading-5 text-white/55"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} className="mt-1" /> Concordo em receber a newsletter e com o tratamento do meu nome e e-mail para essa finalidade, conforme a Política de Privacidade.</label>
          <Button disabled={status === "loading"} className="bg-[#C62828] hover:bg-[#8E1C1C]">{status === "loading" ? "Cadastrando..." : "Entrar no Round Semanal"}</Button>
          {message && <p role="status" className={`text-sm ${status === "success" ? "text-emerald-400" : "text-red-300"}`}>{message}</p>}
        </form>
      </div>
    </section>
  );
}

export function SearchArticles({ initialCategory }: { initialCategory?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(initialCategory || "todos");
  const filtered = useMemo(() => articles.filter(a => (category === "todos" || a.categorySlug === category) && (`${a.title} ${a.excerpt}`.toLowerCase().includes(query.toLowerCase()))), [query, category]);
  const track = (name: string, params: Record<string, string>) => { const w = window as any; if (w.gtag) w.gtag("event", name, params); };
  return (
    <div>
      <div className="mb-7 grid gap-3 lg:grid-cols-[1fr_auto]">
        <label className="relative"><Search className="absolute left-3 top-3.5 text-white/35" size={18} /><Input value={query} onChange={e => { setQuery(e.target.value); if (e.target.value.length === 3) track("search_used", { query: e.target.value }); }} placeholder="Buscar nos artigos" className="h-11 border-white/10 bg-[#111] pl-10" /></label>
        <div className="flex flex-wrap gap-2">{[{ slug: "todos", name: "Todos" }, ...categories].map(c => <button key={c.slug} onClick={() => { setCategory(c.slug); track("category_filter_used", { category: c.slug }); }} className={`rounded-full border px-3 py-2 text-xs font-bold ${category === c.slug ? "border-[#B78A56] bg-[#B78A56]/15 text-[#F0E6D2]" : "border-white/10 text-white/55"}`}>{c.name}</button>)}</div>
      </div>
      {filtered.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map(article => <ArticleCard key={article.slug} article={article} />)}</div> : <div className="rounded-2xl border border-white/10 bg-[#111] p-10 text-center text-[#C9BDAA]">Nenhum artigo encontrado com esses filtros.</div>}
    </div>
  );
}

export function TrustStrip() {
  return <div className="grid gap-4 sm:grid-cols-3">{[
    ["Conteúdo com método", "Explicações construídas para ensinar, não apenas gerar clique."],
    ["Fontes e limites", "Quando uma afirmação exige fonte ou cuidado profissional, isso aparece no texto."],
    ["Transparência editorial", "Sem depoimentos, números ou credenciais inventados."],
  ].map(([title, body]) => <div key={title} className="rounded-2xl border border-white/10 bg-[#111] p-5"><ShieldCheck className="text-[#B78A56]" /><h3 className="mt-3 font-display font-bold text-[#F0E6D2]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#C9BDAA]">{body}</p></div>)}</div>;
}

export function EditorialShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#0B0B0B] text-[#F0E6D2]"><SiteHeader /><main>{children}</main><SiteFooter /></div>;
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-white/45">{items.map((item, i) => <span key={`${item.label}-${i}`} className="inline-flex items-center gap-1">{i > 0 && <ChevronRight size={12} />}{item.to ? <Link to={item.to} className="hover:text-white">{item.label}</Link> : <span>{item.label}</span>}</span>)}</nav>;
}
