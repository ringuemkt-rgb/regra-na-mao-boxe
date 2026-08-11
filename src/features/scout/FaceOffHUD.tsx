import { ShieldCheck, Swords } from "lucide-react";
import type { ScoutDossier } from "./types";
import type { FaceOffResult } from "./faceOff";

function AthleteSide({ dossier, side }: { dossier: ScoutDossier; side: "a" | "b" }) {
  return (
    <div className="text-center">
      <p className={`font-display text-3xl font-bold uppercase ${side === "a" ? "text-blood" : "text-white"}`}>{dossier.name}</p>
      <p className="font-data text-xs text-zinc-500 uppercase mt-1">{dossier.sport} · {dossier.category || "categoria não informada"}</p>
      <div className="mt-4 flex justify-center gap-4 text-[10px] font-data text-zinc-500">
        <span>{dossier.record.wins ?? "—"} V</span><span>{dossier.record.losses ?? "—"} D</span><span>{dossier.record.draws ?? "—"} E</span>
      </div>
    </div>
  );
}

export default function FaceOffHUD({ a, b, result }: { a: ScoutDossier; b: ScoutDossier; result: FaceOffResult }) {
  if (!result.comparable) {
    return (
      <div className="glass rounded-2xl p-8 glow-gold text-center">
        <ShieldCheck className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="font-display text-2xl uppercase font-bold mt-4">Comparação bloqueada</h2>
        <p className="text-zinc-500 text-sm mt-2">{result.reason}</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 sm:p-8 glow-red">
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
        <AthleteSide dossier={a} side="a" />
        <div className="flex flex-col items-center gap-2"><Swords className="w-10 h-10 text-amber-500"/><span className="font-display text-2xl font-bold text-gold">VS</span></div>
        <AthleteSide dossier={b} side="b" />
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <div className="flex flex-wrap justify-center gap-3 text-[10px] font-data uppercase">
          <span className="border border-red-500/40 text-red-400 px-3 py-1">Vantagens A: {result.edgeSummary.a}</span>
          <span className="border border-zinc-600 text-zinc-400 px-3 py-1">Equilíbrio: {result.edgeSummary.neutral}</span>
          <span className="border border-zinc-500/60 text-zinc-300 px-3 py-1">Vantagens B: {result.edgeSummary.b}</span>
          <span className="border border-green-500/40 text-green-400 px-3 py-1">Cobertura {(result.evidenceCoverage * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {result.dimensions.map((dim) => {
          const total = Math.abs(dim.a) + Math.abs(dim.b) || 1;
          const aWidth = Math.max(5, Math.min(95, (Math.abs(dim.a) / total) * 100));
          return (
            <div key={dim.key}>
              <div className="flex justify-between font-data text-[10px] uppercase tracking-widest text-zinc-500 mb-1">
                <span className={dim.delta > 0 ? "text-red-400" : ""}>{dim.a}</span>
                <span>{dim.label} · conf {(dim.confidence * 100).toFixed(0)}%</span>
                <span className={dim.delta < 0 ? "text-white" : ""}>{dim.b}</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden bg-white/10">
                <div className="bg-gradient-to-r from-red-800 to-red-500" style={{ width: `${aWidth}%` }} />
                <div className="bg-zinc-600 flex-1" />
              </div>
              {dim.limitations.length > 0 && <p className="text-[9px] text-zinc-700 mt-1">{dim.limitations.join(" · ")}</p>}
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="border border-white/10 rounded-xl p-4"><p className="font-data text-[10px] uppercase tracking-widest text-red-400 mb-3">Sinais a estudar em {a.name}</p>{result.tacticalSignalsA.filter((x) => x.status === "supported").slice(0, 4).map((x) => <p key={x.key} className="font-data text-xs text-zinc-400 mb-2">• {x.title}: {x.score}/100 <span className="text-zinc-600">(n={x.sampleSize})</span></p>)}</div>
        <div className="border border-white/10 rounded-xl p-4"><p className="font-data text-[10px] uppercase tracking-widest text-zinc-300 mb-3">Sinais a estudar em {b.name}</p>{result.tacticalSignalsB.filter((x) => x.status === "supported").slice(0, 4).map((x) => <p key={x.key} className="font-data text-xs text-zinc-400 mb-2">• {x.title}: {x.score}/100 <span className="text-zinc-600">(n={x.sampleSize})</span></p>)}</div>
      </div>

      <p className="font-data text-[10px] text-zinc-600 mt-6 text-center">{result.note}</p>
    </div>
  );
}
