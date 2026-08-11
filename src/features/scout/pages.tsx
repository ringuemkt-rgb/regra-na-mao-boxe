import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Lock, Newspaper, Search, ShieldCheck, Zap } from "lucide-react";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { HudFrame, DataCell, Led, StatBar } from "./HudPrimitives";
import { auditDossier } from "./evidence";
import { getApprovedDossierBySlug, listApprovedScoutAthletes, type ScoutAthleteListItem } from "./repository";
import type { CombatSport, ScoutDossier } from "./types";
import "./hud.css";

const SPORTS: Array<"TODOS" | CombatSport> = ["TODOS", "BOXE", "JIU-JITSU", "MMA"];

function ScoutTopbar() {
  return (
    <div className="border-b border-zinc-800 bg-zinc-950/95 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/" className="font-display font-bold uppercase tracking-wider text-white">BOXE DE CRIA</Link>
        <div className="hidden sm:block text-[11px] font-data tracking-[.25em] uppercase text-zinc-500">Scout de Cria · Inteligência de Combate</div>
        <Led color="green" label="HUD online" />
      </div>
    </div>
  );
}

export function ScoutHomePage() {
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState<ScoutAthleteListItem[]>([]);
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState<(typeof SPORTS)[number]>("TODOS");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    listApprovedScoutAthletes().then((rows) => {
      if (active) { setAthletes(rows); setLoading(false); }
    });
    return () => { active = false; };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return athletes.filter((a) => {
      const matchesSport = sport === "TODOS" || a.sport === sport;
      const haystack = [a.name, a.nickname, a.category, a.nationality].filter(Boolean).join(" ").toLowerCase();
      return matchesSport && (!q || haystack.includes(q));
    }).slice(0, 8);
  }, [athletes, query, sport]);

  return (
    <div className="scout-hud min-h-screen hud-grid-bg">
      <ScoutTopbar />
      <main>
        <section className="max-w-6xl mx-auto px-4 pt-20 pb-12">
          <div className="max-w-3xl">
            <p className="font-data text-[11px] uppercase tracking-[.28em] text-red-500 mb-4">RAIO-X SUPREMO · Evidence First</p>
            <h1 className="font-display text-5xl sm:text-7xl font-bold uppercase leading-[.92] text-white">Leia a carreira.<br/><span className="text-red-500">Não invente o atleta.</span></h1>
            <p className="mt-6 text-zinc-400 text-base sm:text-lg max-w-2xl">Dossiês de Boxe, Jiu-Jitsu e MMA com cartel rastreável, claims ligados às fontes, métricas derivadas e bloqueio automático quando a evidência não sustenta a conclusão.</p>
          </div>
        </section>

        <section className="border-y border-zinc-800 bg-zinc-950/45 py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="font-display text-3xl font-bold uppercase text-white">Search <span className="text-red-500">Command Center</span></h2>
              <Led color={loading ? "amber" : "green"} label={loading ? "Sincronizando" : `${athletes.length} aprovados`} />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {SPORTS.map((item) => (
                <button key={item} onClick={() => setSport(item)} className={`px-4 py-2 text-[11px] font-data uppercase tracking-widest border transition ${sport === item ? "border-red-600 bg-red-600/10 text-red-400" : "border-zinc-700 text-zinc-500 hover:border-zinc-500"}`}>{item}</button>
              ))}
            </div>

            <HudFrame>
              <div className="bg-zinc-900/85 p-2 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Digite nome, apelido, país ou categoria…" className="w-full bg-transparent pl-12 pr-4 py-4 text-white font-data placeholder-zinc-600 focus:outline-none" aria-label="Buscar atleta" />
                </div>
                <button disabled={!results.length} onClick={() => results[0] && navigate(`/scout/atleta/${results[0].slug}`)} className="px-5 sm:px-7 bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 hover:bg-red-700 text-white font-display uppercase tracking-wider flex items-center gap-2"><Zap className="w-4 h-4"/><span className="hidden sm:inline">Raio-X</span></button>
              </div>
            </HudFrame>

            <div className="mt-3 border border-zinc-800 bg-zinc-950/70">
              {loading ? <p className="p-5 text-sm font-data text-zinc-500">Consultando catálogo aprovado…</p> : results.length ? results.map((a) => (
                <button key={a.id} onClick={() => navigate(`/scout/atleta/${a.slug}`)} className="w-full px-4 py-4 flex justify-between items-center text-left border-b last:border-b-0 border-zinc-800 hover:bg-zinc-900 transition">
                  <div><p className="text-white font-medium">{a.name} {a.nickname ? <span className="text-zinc-500">“{a.nickname}”</span> : null}</p><p className="text-[11px] font-data text-zinc-500 uppercase mt-1">{[a.nationality, a.category].filter(Boolean).join(" · ") || "Metadados em validação"}</p></div>
                  <span className="text-[10px] font-data px-2 py-1 border border-red-600/50 text-red-400">{a.sport}</span>
                </button>
              )) : <div className="p-6"><p className="text-white font-display uppercase text-lg">Nenhum dossiê aprovado ainda</p><p className="text-zinc-500 text-sm mt-2">O HUD está pronto, mas o catálogo público permanece vazio até que fontes, claims e cartel passem pelo gate de evidência. Nenhum atleta fictício foi inserido.</p></div>}
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-4">
          {[['01','COLETA RASTREÁVEL','Cada dado importante mantém origem, data de captura e qualidade da fonte.'],['02','CLAIM → EVIDÊNCIA','A síntese não recebe selo apenas porque outro LLM disse que está correta.'],['03','GATE HUMANO','Conflitos, baixa cobertura e temas sensíveis ficam bloqueados para revisão.']].map(([n,t,d]) => <HudFrame key={n} className="bg-zinc-950/70 p-6"><p className="font-data text-red-500 text-xs">{n}</p><h3 className="font-display text-xl uppercase font-bold mt-4">{t}</h3><p className="text-zinc-500 text-sm mt-3">{d}</p></HudFrame>)}
        </section>
      </main>
    </div>
  );
}

const METHODS = ["TODAS", "KO/TKO", "FINALIZAÇÃO", "DECISÃO"] as const;

export function ScoutDossierPage() {
  const { slug = "" } = useParams();
  const [dossier, setDossier] = useState<ScoutDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof METHODS)[number]>("TODAS");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getApprovedDossierBySlug(slug).then((row) => { if (active) { setDossier(row); setLoading(false); } });
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="scout-hud min-h-screen grid place-items-center"><Led color="amber" label="Carregando dossiê" /></div>;
  if (!dossier) return <div className="scout-hud min-h-screen"><ScoutTopbar/><main className="max-w-3xl mx-auto px-4 py-24"><HudFrame className="p-8 bg-zinc-950"><h1 className="font-display text-3xl font-bold uppercase">Dossiê indisponível</h1><p className="text-zinc-500 mt-3">Esse atleta não possui um dossiê aprovado publicamente. Dossiês em processamento, revisão ou bloqueados não são exibidos.</p><Link to="/scout" className="inline-block mt-6 text-red-400 font-data text-sm">← voltar ao Command Center</Link></HudFrame></main></div>;

  const audit = auditDossier(dossier);
  const radar = dossier.metrics.filter((m) => m.unit === "score_100").map((m) => ({ metric: m.label, value: m.value }));
  const fights = dossier.fights.filter((fight) => {
    if (filter === "TODAS") return true;
    const method = (fight.method || "").toUpperCase();
    if (filter === "KO/TKO") return method.includes("KO") || method.includes("TKO");
    if (filter === "FINALIZAÇÃO") return method.includes("SUB") || method.includes("FINAL");
    return method.includes("DEC");
  });

  return (
    <div className="scout-hud min-h-screen hud-noise">
      <ScoutTopbar />
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        <HudFrame className="bg-zinc-950/75"><div className="grid lg:grid-cols-3 gap-8 p-6 sm:p-8">
          <div className="relative overflow-hidden border border-zinc-800 min-h-72 bg-zinc-900 grid place-items-center">{dossier.photoUrl ? <img src={dossier.photoUrl} alt={dossier.name} className="w-full h-72 object-cover object-top" /> : <span className="font-data text-zinc-600 text-xs">IMAGEM NÃO DISPONÍVEL</span>}<div className="scanline"/><span className="absolute top-2 left-2 text-[10px] font-data text-red-400 bg-zinc-950/80 px-2 py-1">SCAN VISUAL</span></div>
          <div className="lg:col-span-2"><p className="text-[11px] font-data uppercase tracking-[.3em] text-red-500">{dossier.sport} · {dossier.category || "categoria não informada"}</p><h1 className="font-display text-5xl sm:text-6xl font-bold uppercase mt-2">{dossier.name} {dossier.nickname ? <span className="text-zinc-600 text-3xl">“{dossier.nickname}”</span> : null}</h1>
            <div className="flex gap-8 mt-6">{[[dossier.record.wins,'VITÓRIAS','text-green-500'],[dossier.record.losses,'DERROTAS','text-red-500'],[dossier.record.draws,'EMPATES','text-zinc-500']].map(([v,l,c]) => <div className="text-center" key={String(l)}><p className={`font-display text-4xl font-bold ${c}`}>{v ?? '—'}</p><p className="text-[10px] font-data text-zinc-500">{l}</p></div>)}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-zinc-800"><DataCell label="Nascimento" value={dossier.identity.birthDate}/><DataCell label="Idade" value={dossier.identity.age ? `${dossier.identity.age} anos` : undefined}/><DataCell label="Natural de" value={dossier.identity.birthPlace}/><DataCell label="Postura" value={dossier.identity.stance}/><DataCell label="Altura" value={dossier.identity.heightCm ? `${dossier.identity.heightCm} cm` : undefined}/><DataCell label="Envergadura" value={dossier.identity.reachCm ? `${dossier.identity.reachCm} cm` : undefined}/><DataCell label="Nacionalidade" value={dossier.identity.nationality}/><DataCell label="Treinador" value={dossier.identity.coach}/></div>
          </div>
        </div></HudFrame>

        <div className="grid lg:grid-cols-2 gap-6"><HudFrame className="bg-zinc-950/75 p-6"><h2 className="font-display text-xl font-bold uppercase mb-4">Radar de Combate</h2>{radar.length ? <ResponsiveContainer width="100%" height={320}><RadarChart data={radar}><PolarGrid stroke="#26262b"/><PolarAngleAxis dataKey="metric" tick={{ fill:'#71717a', fontSize:11 }}/><PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/><Radar dataKey="value" stroke="#dc2626" fill="#dc2626" fillOpacity={0.32}/></RadarChart></ResponsiveContainer> : <p className="text-sm text-zinc-500">Sem métricas de 0–100 publicáveis. O sistema não inventa notas para preencher o gráfico.</p>}</HudFrame>
        <HudFrame className="bg-zinc-950/75 p-6"><h2 className="font-display text-xl font-bold uppercase mb-5">Métricas Derivadas</h2><div className="space-y-5">{radar.map((r) => <StatBar key={r.metric} label={r.metric} value={r.value}/>)}{!radar.length && <p className="text-sm text-zinc-500">Aguardando métricas com derivação documentada.</p>}</div><p className="text-[10px] font-data text-zinc-600 mt-6">Somente métricas calculadas a partir de fontes vinculadas podem aparecer aqui.</p></HudFrame></div>

        <HudFrame className="bg-zinc-950/75 p-6 sm:p-8"><h2 className="font-display text-xl font-bold uppercase mb-8">História de Vida</h2>{dossier.timeline.length ? <div className="relative pl-6 border-l-2 border-red-600/40 space-y-8">{dossier.timeline.map((item, i) => <div key={`${item.date || item.year}-${i}`} className="relative"><span className="absolute -left-[31px] top-1 w-3 h-3 bg-red-600 rounded-full"/><p className="font-data text-red-400 text-sm">{item.date || item.year || 'Data não definida'}</p><p className="text-white font-semibold mt-1">{item.title}</p><p className="text-zinc-400 text-sm mt-1">{item.description}</p></div>)}</div> : <p className="text-zinc-500 text-sm">Nenhum marco biográfico aprovado.</p>}</HudFrame>

        <HudFrame className="bg-zinc-950/75 p-6"><div className="flex flex-wrap items-center justify-between gap-4 mb-6"><h2 className="font-display text-xl font-bold uppercase">Registro de Lutas</h2><div className="flex flex-wrap gap-2">{METHODS.map((m) => <button key={m} onClick={() => setFilter(m)} className={`px-3 py-1 text-[10px] font-data uppercase border ${filter === m ? 'border-red-600 text-red-400' : 'border-zinc-700 text-zinc-500'}`}>{m}</button>)}</div></div><div className="overflow-x-auto"><table className="w-full text-left font-data text-sm"><thead><tr className="text-[10px] uppercase tracking-widest text-zinc-500 border-b border-zinc-800"><th className="py-2 pr-4">Data</th><th className="py-2 pr-4">Evento</th><th className="py-2 pr-4">Oponente</th><th className="py-2 pr-4">Res.</th><th className="py-2 pr-4">Método</th><th className="py-2">R/T</th></tr></thead><tbody className="divide-y divide-zinc-800/60">{fights.map((fight) => <tr key={fight.id} className="hover:bg-zinc-900"><td className="py-3 pr-4 text-zinc-500">{fight.date || '—'}</td><td className="py-3 pr-4 text-zinc-300">{fight.event || '—'}</td><td className="py-3 pr-4 text-white">{fight.opponent || '—'}</td><td className={`py-3 pr-4 font-bold ${fight.result === 'V' ? 'text-green-500' : fight.result === 'D' ? 'text-red-500' : 'text-zinc-500'}`}>{fight.result || '—'}</td><td className="py-3 pr-4 text-zinc-400">{fight.method || '—'}</td><td className="py-3 text-zinc-500">{fight.round ? `R${fight.round}` : '—'}{fight.time ? ` / ${fight.time}` : ''}</td></tr>)}</tbody></table>{!fights.length && <p className="text-zinc-500 text-sm py-6">Nenhuma luta disponível para este filtro.</p>}</div></HudFrame>

        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{dossier.technicalSections.map((section) => <HudFrame key={section.key} className="bg-zinc-950/75 p-5"><p className="font-data text-[10px] uppercase tracking-widest text-red-500">ANÁLISE TÉCNICA</p><h3 className="font-display text-xl font-bold uppercase mt-2">{section.title}</h3><p className="text-zinc-400 text-sm mt-3 leading-relaxed">{section.summary}</p></HudFrame>)}</section>

        <HudFrame className="bg-zinc-950/75 p-6"><h2 className="font-display text-xl font-bold uppercase mb-6 flex items-center gap-2"><Newspaper className="w-5 h-5 text-red-500"/>Contexto de Mídia</h2><div className="grid md:grid-cols-3 gap-4">{dossier.mediaContext.map((n) => <a key={`${n.sourceId}-${n.title}`} href={n.url || '#'} target={n.url ? '_blank' : undefined} rel={n.url ? 'noopener noreferrer' : undefined} className="border border-zinc-800 p-4 hover:border-red-600/50 transition"><p className="text-[10px] font-data text-zinc-500 uppercase">{[n.publisher,n.date].filter(Boolean).join(' · ') || 'Fonte registrada'}</p><p className="text-zinc-200 text-sm mt-2">{n.title}</p></a>)}{!dossier.mediaContext.length && <p className="text-zinc-500 text-sm">Sem contexto de mídia aprovado.</p>}</div></HudFrame>

        <div className="grid lg:grid-cols-2 gap-6"><HudFrame accent={audit.publishable ? "green" : "red"} className="bg-zinc-950/75 p-6"><div className="flex items-center gap-4"><ShieldCheck className={`w-10 h-10 ${audit.publishable ? 'text-green-500' : 'text-red-500'}`}/><div><p className="font-display text-lg font-bold uppercase">Auditoria de Evidência</p><p className="text-[11px] font-data text-zinc-500">{audit.supported} suportados · {audit.uncertain} incertos · {audit.unsupported} sem suporte · cobertura {(audit.coverage*100).toFixed(0)}%</p></div></div></HudFrame>
        <HudFrame accent="amber" className="bg-zinc-950/75 p-6 relative overflow-hidden"><div className="blur-[3px] select-none" aria-hidden="true"><p className="font-display text-lg font-bold uppercase mb-2">Veredito do Scout</p><p className="text-zinc-300 text-sm">{dossier.verdict || 'Conteúdo premium depende de produto e preço reais antes de ser liberado.'}</p></div><div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent flex items-end justify-center pb-6"><span className="flex items-center gap-2 border border-amber-500/60 text-amber-400 font-display uppercase px-5 py-2"><Lock className="w-4 h-4"/>PRO · em preparação</span></div></HudFrame></div>
      </main>
    </div>
  );
}
