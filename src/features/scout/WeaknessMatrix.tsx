import { AlertTriangle, Target } from "lucide-react";
import { HudFrame } from "./HudPrimitives";
import type { TacticalIndicator } from "./forensics";

export default function WeaknessMatrix({ indicators }: { indicators: TacticalIndicator[] }) {
  const supported = indicators.filter((item) => item.status === "supported" && typeof item.score === "number");
  const insufficient = indicators.filter((item) => item.status === "insufficient_data");

  return (
    <HudFrame className="bg-zinc-950/75 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="font-display text-xl font-bold text-white uppercase flex items-center gap-2">
          <Target className="w-5 h-5 text-red-500" /> Matriz de Oportunidades Táticas
        </h2>
        <span className="font-data text-[10px] text-zinc-500 uppercase">Somente indicadores calculáveis</span>
      </div>

      <div className="space-y-4">
        {supported.map((item) => {
          const score = Math.max(0, Math.min(100, item.score || 0));
          return (
            <article key={item.key} className="border border-zinc-800 p-4 hover:border-red-600/50 transition">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="font-display font-bold text-white uppercase text-sm">{item.title}</p>
                <span className={`font-data text-xs px-2 py-0.5 border ${score >= 70 ? "border-red-500 text-red-400" : score >= 40 ? "border-amber-500 text-amber-400" : "border-zinc-600 text-zinc-400"}`}>SINAL {score}</span>
              </div>
              <div className="h-1 bg-zinc-800 mb-3"><div className="h-full bg-red-600" style={{ width: `${score}%` }} /></div>
              <p className="font-data text-xs text-zinc-400 flex items-start gap-2"><AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />{item.observation}</p>
              {item.tacticalImplication && <p className="text-xs text-zinc-500 mt-2"><span className="text-zinc-300">Leitura tática:</span> {item.tacticalImplication}</p>}
              <div className="grid md:grid-cols-2 gap-3 mt-4 pt-3 border-t border-zinc-800 text-[10px] font-data text-zinc-600">
                <p><span className="text-zinc-500">FÓRMULA</span><br/>{item.formula}</p>
                <p><span className="text-zinc-500">AMOSTRA</span><br/>{item.sampleSize}</p>
              </div>
              {item.limitations.length > 0 && <ul className="mt-3 text-[10px] text-zinc-600 space-y-1 list-disc pl-4">{item.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}</ul>}
            </article>
          );
        })}

        {!supported.length && <p className="text-zinc-500 text-sm">Nenhum indicador possui amostra suficiente. O sistema não preenche o painel com inferências artificiais.</p>}
      </div>

      {insufficient.length > 0 && (
        <div className="mt-6 border-t border-zinc-800 pt-4">
          <p className="font-data text-[10px] uppercase tracking-widest text-amber-500 mb-3">Indicadores bloqueados por dados insuficientes</p>
          <div className="grid md:grid-cols-2 gap-2">
            {insufficient.map((item) => <div key={item.key} className="border border-zinc-800 p-3"><p className="text-xs text-zinc-400">{item.title}</p><p className="text-[10px] text-zinc-600 mt-1">{item.limitations.join(" · ")}</p></div>)}
          </div>
        </div>
      )}
    </HudFrame>
  );
}
