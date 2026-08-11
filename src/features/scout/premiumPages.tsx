import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Crown, Swords } from "lucide-react";
import PremiumPanel from "./PremiumPanel";
import FaceOffHUD from "./FaceOffHUD";
import { HudFrame, Led, StatBar } from "./HudPrimitives";
import { buildFaceOff } from "./faceOff";
import { classifyDossierStyle } from "./styleClassifier";
import { getApprovedDossierBySlug, listApprovedScoutAthletes, type ScoutAthleteListItem } from "./repository";
import type { ScoutDossier } from "./types";
import "./hud.css";
import "./premium.css";

function PremiumTopbar() {
  return (
    <div className="border-b border-zinc-800 bg-zinc-950/95 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <Link to="/scout" className="font-display font-bold uppercase tracking-wider text-white">SCOUT DE CRIA</Link>
        <div className="hidden sm:flex items-center gap-2 text-[11px] font-data tracking-[.2em] uppercase text-amber-500"><Crown className="w-4 h-4"/>Perícia Premium</div>
        <Led color="green" label="Evidence first" />
      </div>
    </div>
  );
}

export function ScoutPremiumPage() {
  const { slug = "" } = useParams();
  const [dossier, setDossier] = useState<ScoutDossier | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getApprovedDossierBySlug(slug).then((row) => { if (active) { setDossier(row); setLoading(false); } });
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="scout-hud min-h-screen grid place-items-center"><Led color="amber" label="Montando perícia" /></div>;
  if (!dossier) return <div className="scout-hud min-h-screen"><PremiumTopbar/><main className="max-w-3xl mx-auto px-4 py-24"><HudFrame className="bg-zinc-950 p-8"><h1 className="font-display text-3xl uppercase font-bold">Painel indisponível</h1><p className="text-zinc-500 mt-3">Somente dossiês aprovados pelo gate de evidência possuem painel premium.</p></HudFrame></main></div>;

  const style = classifyDossierStyle(dossier);
  return (
    <div className="scout-hud min-h-screen premium-mesh">
      <PremiumTopbar />
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <div className="flex flex-wrap gap-3 text-xs font-data">
          <Link to={`/scout/atleta/${dossier.slug}`} className="text-zinc-500 hover:text-white">← Dossiê público</Link>
          <span className="text-zinc-800">/</span>
          <Link to={`/scout/face-off?a=${encodeURIComponent(dossier.slug)}`} className="text-amber-500 hover:text-amber-400">Abrir Face-Off</Link>
        </div>

        {dossier.sport === "MMA" && (
          <HudFrame accent="amber" className="glass rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <p className="font-data text-[10px] uppercase tracking-[.25em] text-amber-500">Classificação de estilo · determinística</p>
                <h2 className="font-display text-3xl uppercase font-bold mt-2">{style.style === "unknown" ? "Dados insuficientes" : style.style}</h2>
                <p className="text-sm text-zinc-500 mt-2">Confiança {(style.confidence * 100).toFixed(0)}% · amostra {style.sampleMinutes.toFixed(0)} min</p>
              </div>
              <div className="grid grid-cols-3 gap-4 min-w-0 lg:min-w-[440px]">
                <StatBar label="Striker" value={style.scores.striker} suffix="%" />
                <StatBar label="Wrestler" value={style.scores.wrestler} suffix="%" />
                <StatBar label="Grappler" value={style.scores.grappler} suffix="%" />
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-[10px] text-zinc-600">{style.limitations.join(" · ")}</div>
          </HudFrame>
        )}

        <PremiumPanel dossier={dossier} />
      </main>
    </div>
  );
}

export function ScoutFaceOffPage() {
  const [params, setParams] = useSearchParams();
  const [athletes, setAthletes] = useState<ScoutAthleteListItem[]>([]);
  const [a, setA] = useState<ScoutDossier | null>(null);
  const [b, setB] = useState<ScoutDossier | null>(null);
  const [loading, setLoading] = useState(true);

  const aSlug = params.get("a") || "";
  const bSlug = params.get("b") || "";

  useEffect(() => {
    let active = true;
    listApprovedScoutAthletes().then((rows) => { if (active) setAthletes(rows); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      aSlug ? getApprovedDossierBySlug(aSlug) : Promise.resolve(null),
      bSlug ? getApprovedDossierBySlug(bSlug) : Promise.resolve(null),
    ]).then(([left, right]) => {
      if (active) { setA(left); setB(right); setLoading(false); }
    });
    return () => { active = false; };
  }, [aSlug, bSlug]);

  const filteredB = useMemo(() => {
    const selectedA = athletes.find((item) => item.slug === aSlug);
    if (!selectedA) return athletes;
    return athletes.filter((item) => item.sport === selectedA.sport && item.slug !== aSlug);
  }, [athletes, aSlug]);

  const result = a && b ? buildFaceOff(a, b) : null;

  const update = (key: "a" | "b", value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    if (key === "a" && value === next.get("b")) next.delete("b");
    setParams(next);
  };

  return (
    <div className="scout-hud min-h-screen premium-mesh">
      <PremiumTopbar />
      <main className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        <header className="max-w-3xl">
          <p className="font-data text-[11px] uppercase tracking-[.3em] text-red-500 flex items-center gap-2"><Swords className="w-4 h-4"/>Face-Off Evidence</p>
          <h1 className="font-display text-5xl sm:text-6xl uppercase font-bold mt-2">Casamento de estilos,<br/><span className="text-gold">sem chute estatístico.</span></h1>
          <p className="text-zinc-500 mt-4">Escolha dois dossiês aprovados. O sistema compara apenas dimensões compatíveis, preserva limitações e não converte diferenças em probabilidade de vitória.</p>
        </header>

        <HudFrame accent="amber" className="glass rounded-2xl p-5">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="font-data text-[10px] uppercase tracking-widest text-zinc-500">Atleta A
              <select value={aSlug} onChange={(e) => update("a", e.target.value)} className="mt-2 w-full bg-zinc-950 border border-zinc-700 text-white p-3 text-sm normal-case">
                <option value="">Selecionar</option>
                {athletes.map((item) => <option key={item.id} value={item.slug}>{item.name} · {item.sport}</option>)}
              </select>
            </label>
            <label className="font-data text-[10px] uppercase tracking-widest text-zinc-500">Atleta B
              <select value={bSlug} onChange={(e) => update("b", e.target.value)} className="mt-2 w-full bg-zinc-950 border border-zinc-700 text-white p-3 text-sm normal-case">
                <option value="">Selecionar</option>
                {filteredB.map((item) => <option key={item.id} value={item.slug}>{item.name} · {item.sport}</option>)}
              </select>
            </label>
          </div>
        </HudFrame>

        {loading ? <div className="py-16 grid place-items-center"><Led color="amber" label="Comparando evidências" /></div> : a && b && result ? <FaceOffHUD a={a} b={b} result={result} /> : <HudFrame className="glass rounded-2xl p-8 text-center"><p className="font-display text-2xl uppercase font-bold">Selecione dois atletas</p><p className="text-zinc-500 text-sm mt-2">O Face-Off só começa quando os dois dossiês aprovados estiverem disponíveis.</p></HudFrame>}
      </main>
    </div>
  );
}
