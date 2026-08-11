import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, Clock, HeartPulse, Library, Share2 } from "lucide-react";
import { articles, categories, getArticle, getCategory, getCategoryArticles } from "@/data/editorial";
import { ArticleCard, Breadcrumbs, CategoryPill, EditorialShell, NewsletterForm, PRODUCTS, ProductCTA, SearchArticles, SEOHead, TrustStrip } from "@/components/editorial/EditorialKit";
import AdSlot from "@/components/ads/AdSlot";
import { ADSENSE_CONFIG } from "@/config/adsense";
import { Button } from "@/components/ui/button";
import { handleCheckoutUrlClick } from "@/lib/checkout";
import regrasCover from "@/assets/ebook-cover.png";
import caminhoCover from "@/assets/caminho-promo.png";

const SITE = "https://regra-na-mao-boxe.lovable.app";

export function HomePage() {
  const featured = articles.find(a => a.featured) || articles[0];
  return (
    <EditorialShell>
      <SEOHead title="BOXE DE CRIA — Ciência, técnica e cultura da luta" description="Visão de Cria: artigos, guias e materiais para quem treina, ensina e vive o boxe." canonical={`${SITE}/`} />
      <section className="relative overflow-hidden border-b border-white/10 bg-[#050505] py-16 sm:py-24">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 20%, #8E1C1C 0, transparent 28%), radial-gradient(circle at 20% 70%, #B78A56 0, transparent 25%)" }} />
        <div className="container relative grid gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <div className="text-xs font-black uppercase tracking-[.3em] text-[#B78A56]">VISÃO DE CRIA · A revista do BOXE DE CRIA</div>
            <h1 className="mt-5 max-w-4xl font-display text-5xl font-black uppercase leading-[.95] text-[#F0E6D2] sm:text-7xl">Ciência, técnica e <span className="text-[#C62828]">cultura da luta.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#C9BDAA]">Conteúdo para quem quer entender o boxe além do golpe: método, corpo, equipamento, história e formação.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button asChild className="bg-[#C62828] hover:bg-[#8E1C1C]"><Link to="/artigos">Ler artigos <ArrowRight className="ml-2" size={18}/></Link></Button><Button asChild variant="outline" className="border-[#B78A56]/45 bg-transparent text-[#F0E6D2] hover:bg-[#B78A56]/10"><Link to="/produtos">Conhecer os manuais</Link></Button></div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-[#111]/90 p-6"><div className="text-xs font-bold uppercase tracking-[.2em] text-[#B78A56]">Comece por aqui</div><h2 className="mt-3 font-display text-2xl font-black">Fundamentos antes da pressa.</h2><p className="mt-3 leading-7 text-[#C9BDAA]">Base, guarda, jab, equipamentos e rotina de treino: os cinco conteúdos essenciais para construir uma entrada segura no boxe.</p><Link to="/artigos/boxe-para-iniciantes" className="mt-5 inline-flex items-center gap-2 font-bold text-[#B78A56]">Abrir guia para iniciantes <ArrowRight size={16}/></Link></div>
        </div>
      </section>

      <section className="container py-14 sm:py-20">
        <div className="mb-7 flex items-end justify-between gap-4"><div><div className="text-xs font-bold uppercase tracking-[.2em] text-[#B78A56]">Em destaque</div><h2 className="mt-2 font-display text-3xl font-black">Leitura principal</h2></div><Link to="/artigos" className="hidden text-sm font-bold text-[#B78A56] sm:inline-flex">Todos os artigos →</Link></div>
        <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#111] lg:grid-cols-[1.2fr_.8fr]">
          <div className="p-7 sm:p-10"><CategoryPill slug={featured.categorySlug} name={featured.category}/><h3 className="mt-5 max-w-3xl font-display text-3xl font-black leading-tight sm:text-5xl"><Link to={`/artigos/${featured.slug}`}>{featured.title}</Link></h3><p className="mt-5 max-w-2xl text-lg leading-8 text-[#C9BDAA]">{featured.excerpt}</p><div className="mt-7 flex gap-4 text-sm text-white/45"><span>{featured.readTime}</span><span>Atualizado em 11/08/2026</span></div><Link to={`/artigos/${featured.slug}`} className="mt-7 inline-flex items-center gap-2 font-bold text-[#B78A56]">Ler agora <ArrowRight size={17}/></Link></div>
          <div className="min-h-[280px] bg-gradient-to-br from-[#8E1C1C] via-[#171717] to-[#050505] p-8 flex items-end"><div><BookOpen className="text-[#B78A56]" size={42}/><p className="mt-4 max-w-sm text-sm leading-6 text-white/65">Conteúdo editorial próprio, organizado para ensinar e servir de referência — sem depender de atalhos de algoritmo.</p></div></div>
        </div>
      </section>

      <section className="container pb-16"><div className="mb-7"><div className="text-xs font-bold uppercase tracking-[.2em] text-[#B78A56]">Últimos artigos</div><h2 className="mt-2 font-display text-3xl font-black">Biblioteca de cria</h2></div><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{articles.slice(0, 5).map(a => <ArticleCard key={a.slug} article={a}/>)}</div></section>

      <section className="border-y border-white/10 bg-[#050505] py-16"><div className="container"><div className="text-xs font-bold uppercase tracking-[.2em] text-[#B78A56]">Editorias</div><h2 className="mt-2 font-display text-3xl font-black">Explore por objetivo</h2><div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-5">{categories.map(c => <Link key={c.slug} to={`/categoria/${c.slug}`} className="rounded-2xl border border-white/10 bg-[#111] p-5 hover:border-[#B78A56]/45"><div className="font-display font-bold">{c.name}</div><p className="mt-2 text-sm leading-6 text-[#C9BDAA]">{c.description}</p></Link>)}</div></div></section>

      <section className="container py-16"><div className="grid gap-6 lg:grid-cols-2"><div className="rounded-3xl border border-[#8E1C1C]/35 bg-[#171717] p-7"><HeartPulse className="text-[#C62828]"/><h2 className="mt-4 font-display text-2xl font-black">Saúde do atleta sem promessa fácil</h2><p className="mt-3 leading-7 text-[#C9BDAA]">Conteúdo educacional com limites claros. Dor, trauma e sintomas persistentes não são tratados como dica de internet.</p><Link to="/categoria/saude-do-atleta" className="mt-5 inline-flex text-sm font-bold text-[#B78A56]">Abrir editoria →</Link></div><div className="rounded-3xl border border-[#B78A56]/30 bg-[#171717] p-7"><Library className="text-[#B78A56]"/><h2 className="mt-4 font-display text-2xl font-black">Formação de treinadores</h2><p className="mt-3 leading-7 text-[#C9BDAA]">Didática, estrutura de aula, observação técnica e materiais para transformar conhecimento em ensino.</p><Link to="/categoria/formacao-de-treinadores" className="mt-5 inline-flex text-sm font-bold text-[#B78A56]">Explorar formação →</Link></div></div></section>

      <section className="container pb-16"><div className="mb-6"><div className="text-xs font-bold uppercase tracking-[.2em] text-[#B78A56]">Confiança</div><h2 className="mt-2 font-display text-3xl font-black">Autoridade que pode ser verificada</h2></div><TrustStrip/></section>
      <section className="container pb-16"><ProductCTA product="combo"/></section>
      <section className="container pb-20"><NewsletterForm/></section>
    </EditorialShell>
  );
}

export function ArticlesPage() {
  return <EditorialShell><SEOHead title="Artigos de boxe | BOXE DE CRIA" description="Guias de técnica, treino, saúde do atleta, equipamentos, história e formação de treinadores." canonical={`${SITE}/artigos`} /><section className="container py-14 sm:py-20"><div className="max-w-3xl"><div className="text-xs font-bold uppercase tracking-[.2em] text-[#B78A56]">VISÃO DE CRIA</div><h1 className="mt-3 font-display text-4xl font-black sm:text-6xl">Artigos</h1><p className="mt-4 text-lg leading-8 text-[#C9BDAA]">Conteúdo organizado para consultar, estudar e aplicar no treino com senso crítico.</p></div><div className="mt-10"><SearchArticles/></div><div className="mt-14"><NewsletterForm/></div></section></EditorialShell>;
}

export function CategoryPage() {
  const { slug = "" } = useParams();
  const category = getCategory(slug);
  if (!category) return <EditorialShell><section className="container py-20"><h1 className="font-display text-4xl font-black">Categoria não encontrada</h1><Link to="/artigos" className="mt-5 inline-flex text-[#B78A56]">Voltar aos artigos</Link></section></EditorialShell>;
  const list = getCategoryArticles(slug);
  return <EditorialShell><SEOHead title={`${category.name} | BOXE DE CRIA`} description={category.description} canonical={`${SITE}/categoria/${slug}`} /><section className="container py-14 sm:py-20"><Breadcrumbs items={[{label:"Início",to:"/"},{label:"Artigos",to:"/artigos"},{label:category.name}]}/><div className="mt-8 max-w-3xl"><div className="text-xs font-bold uppercase tracking-[.2em] text-[#B78A56]">Categoria</div><h1 className="mt-3 font-display text-4xl font-black sm:text-6xl">{category.name}</h1><p className="mt-4 text-lg leading-8 text-[#C9BDAA]">{category.description}</p></div>{list.length ? <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{list.map(a=><ArticleCard key={a.slug} article={a}/>)}</div> : <div className="mt-10 rounded-2xl border border-white/10 bg-[#111] p-8 text-[#C9BDAA]">Esta editoria está em construção. Os primeiros conteúdos serão publicados com o mesmo padrão editorial das demais áreas.</div>}<div className="mt-14"><NewsletterForm/></div></section></EditorialShell>;
}

export function ArticlePage() {
  const { slug = "" } = useParams();
  const article = getArticle(slug);
  useEffect(() => {
    if (!article) return;
    const w = window as any;
    if (w.gtag) w.gtag("event", "article_view", { article_slug: article.slug, category: article.categorySlug });
    const id = "article-jsonld";
    document.getElementById(id)?.remove();
    const script = document.createElement("script"); script.id=id; script.type="application/ld+json"; script.text=JSON.stringify({"@context":"https://schema.org","@type":"Article",headline:article.title,description:article.excerpt,datePublished:article.publishedAt,dateModified:article.updatedAt,author:{"@type":"Person",name:"Satoshi Nishiuchi"},publisher:{"@type":"Organization",name:"Boxe de Cria"},mainEntityOfPage:`${SITE}/artigos/${article.slug}`}); document.head.appendChild(script);
    return () => document.getElementById(id)?.remove();
  }, [article]);
  if (!article) return <EditorialShell><section className="container py-20"><h1 className="font-display text-4xl font-black">Artigo não encontrado</h1><Link to="/artigos" className="mt-5 inline-flex text-[#B78A56]">Voltar à biblioteca</Link></section></EditorialShell>;
  const related = article.related.map(getArticle).filter(Boolean) as typeof articles;
  const shareUrl = `${SITE}/artigos/${article.slug}`;
  return (
    <EditorialShell>
      <SEOHead title={`${article.title} | BOXE DE CRIA`} description={article.excerpt} canonical={shareUrl} type="article" />
      <article>
        <header className="border-b border-white/10 bg-[#050505] py-12 sm:py-16"><div className="container max-w-5xl"><Breadcrumbs items={[{label:"Início",to:"/"},{label:"Artigos",to:"/artigos"},{label:article.category,to:`/categoria/${article.categorySlug}`},{label:article.title}]}/><div className="mt-7"><CategoryPill slug={article.categorySlug} name={article.category}/></div><h1 className="mt-5 max-w-4xl font-display text-4xl font-black leading-[1.02] sm:text-6xl">{article.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-[#C9BDAA]">{article.excerpt}</p><div className="mt-6 flex flex-wrap gap-4 text-sm text-white/45"><span>Por Satoshi Nishiuchi</span><span className="inline-flex items-center gap-1"><Clock size={15}/>{article.readTime}</span><span>Última revisão: 11/08/2026</span></div></div></header>
        <div className="container grid max-w-6xl gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-w-0">
            {article.healthNotice && <div className="mb-7 rounded-2xl border border-[#C62828]/40 bg-[#C62828]/8 p-5"><div className="font-bold text-[#F0E6D2]">Aviso de escopo</div><p className="mt-2 text-sm leading-6 text-[#C9BDAA]">{article.healthNotice}</p></div>}
            <section className="rounded-2xl border border-[#B78A56]/30 bg-[#171717] p-6"><h2 className="font-display text-xl font-black">Em resumo</h2><ul className="mt-4 grid gap-3">{article.summary.map(item=><li key={item} className="flex gap-3 text-sm leading-6 text-[#C9BDAA]"><CheckCircle2 className="mt-1 shrink-0 text-[#B78A56]" size={17}/><span>{item}</span></li>)}</ul></section>
            <AdSlot slot={ADSENSE_CONFIG.slots.afterIntro} label="Publicidade" className="my-8" />
            <div className="mt-8 space-y-10">{article.sections.map((section,index)=><section key={section.id} id={section.id} className="scroll-mt-24"><h2 className="font-display text-2xl font-black sm:text-3xl">{section.title}</h2>{section.paragraphs?.map((p,i)=><p key={i} className="mt-4 text-[17px] leading-8 text-[#D5C9B8]">{p}</p>)}{section.bullets && <ul className="mt-5 grid gap-3">{section.bullets.map(b=><li key={b} className="flex gap-3 leading-7 text-[#D5C9B8]"><span className="mt-3 size-1.5 shrink-0 rounded-full bg-[#B78A56]"/>{b}</li>)}</ul>}{index === 2 && <AdSlot slot={ADSENSE_CONFIG.slots.midArticle} label="Publicidade" className="mt-9"/>}</section>)}</div>
            <div className="mt-12"><ProductCTA product={article.product || "combo"}/></div>
            <AdSlot slot={ADSENSE_CONFIG.slots.endArticle} label="Publicidade" className="my-9" />
            <div className="mt-10 flex flex-wrap items-center gap-3 border-y border-white/10 py-5"><Share2 size={18} className="text-[#B78A56]"/><span className="text-sm text-white/55">Compartilhar:</span><a target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#B78A56]" href={`https://wa.me/?text=${encodeURIComponent(`${article.title} ${shareUrl}`)}`}>WhatsApp</a><button className="text-sm font-bold text-[#B78A56]" onClick={() => navigator.clipboard?.writeText(shareUrl)}>Copiar link</button></div>
            {related.length > 0 && <section className="mt-12"><h2 className="font-display text-2xl font-black">Continue estudando</h2><div className="mt-5 grid gap-5 md:grid-cols-2">{related.map(a=><ArticleCard key={a.slug} article={a}/>)}</div></section>}
            <div className="mt-12"><NewsletterForm/></div>
          </div>
          <aside className="hidden lg:block"><div className="sticky top-24 rounded-2xl border border-white/10 bg-[#111] p-5"><div className="text-xs font-bold uppercase tracking-[.2em] text-[#B78A56]">Neste artigo</div><nav className="mt-4 grid gap-3">{article.sections.map(s=><a key={s.id} href={`#${s.id}`} className="text-sm leading-5 text-white/55 hover:text-white">{s.title}</a>)}</nav></div></aside>
        </div>
      </article>
    </EditorialShell>
  );
}

export function ProductsPage() {
  const cards = [
    { key: "corner" as const, cover: regrasCover, bullets: ["Regras, arbitragem e preparação", "Consulta visual", "Acesso digital"] },
    { key: "caminho" as const, cover: caminhoCover, bullets: ["Fundamentos técnicos", "Metodologia de ensino", "Pranchas visuais"] },
    { key: "combo" as const, cover: caminhoCover, bullets: ["Os dois manuais", "Regras + técnica", "24% de desconto"] },
  ];
  return <EditorialShell><SEOHead title="Produtos | BOXE DE CRIA" description="Manuais digitais do BOXE DE CRIA para treinadores e praticantes de boxe." canonical={`${SITE}/produtos`} /><section className="container py-14 sm:py-20"><div className="max-w-3xl"><div className="text-xs font-bold uppercase tracking-[.2em] text-[#B78A56]">Materiais BOXE DE CRIA</div><h1 className="mt-3 font-display text-4xl font-black sm:text-6xl">Manuais para estudar e ensinar</h1><p className="mt-4 text-lg leading-8 text-[#C9BDAA]">Produtos próprios vêm antes de publicidade. Escolha o material que corresponde ao seu objetivo.</p></div><div className="mt-10 grid gap-6 lg:grid-cols-3">{cards.map(({key,cover,bullets})=>{const p=PRODUCTS[key];return <article key={key} className={`rounded-3xl border p-6 ${key==="combo"?"border-[#B78A56] bg-[#171717]":"border-white/10 bg-[#111]"}`}><img src={cover} alt={`Capa de ${p.name}`} className="mx-auto h-56 w-auto rounded-xl object-contain" loading="lazy"/><h2 className="mt-6 font-display text-2xl font-black">{p.name}</h2><p className="mt-1 text-sm text-[#B78A56]">{p.subtitle}</p><ul className="mt-5 grid gap-2 text-sm text-[#C9BDAA]">{bullets.map(b=><li key={b} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 text-[#B78A56]"/>{b}</li>)}</ul><div className="mt-6"><span className="font-display text-3xl font-black">{p.priceLabel}</span>{"oldPrice" in p && p.oldPrice ? <span className="ml-2 text-sm text-white/35 line-through">{p.oldPrice}</span>:null}</div><Button onClick={()=>handleCheckoutUrlClick(p.url,`Produtos · ${p.name}`,p.price)} className="mt-5 w-full bg-[#C62828] hover:bg-[#8E1C1C]">Comprar na Hotmart</Button><p className="mt-3 text-center text-xs text-white/40">Compra processada pela Hotmart · garantia conforme condições da oferta.</p></article>})}</div><div className="mt-14"><TrustStrip/></div></section></EditorialShell>;
}
