import { Activity, Crown, ShieldCheck, Swords, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ScoutDossier } from "./types";
import { auditDossier } from "./evidence";
import { buildForensicIndicators } from "./forensics";
import WeaknessMatrix from "./WeaknessMatrix";
import "./premium.css";

function GlassCard({ children, className = "", glow = "" }: { children: React.ReactNode; className?: string; glow?: string }) {
  return <div className={`glass rounded-2xl p-6 ${glow} ${className}`}>{children}</div>;
}

function KPI({ icon: Icon, label, value, tone = "red" }: { icon: typeof Target; label: string; value: string | number; tone?: "red" | "gold" | "green" }) {
  const text = tone === "gold" ? "text-gold" : tone === "green" ? "text-green-400" : "text-blood";
  return (
    <GlassCard glow={tone === "gold" ? "glow-gold" : tone === "red" ? "glow-red" : ""}>
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10"><Icon className="w-5 h-5 text-red-500" /></div>
        <div><p className="text-[10px] font-data uppercase tracking-[.22em] text-zinc-500">{label}</p><p className={`font-display text-2xl font-bold ${text}`}>{value}</p></div>
      </div>
    </GlassCard>
  );
}

export default function PremiumPanel({ dossier }: { dossier: ScoutDossier }) {
  const audit = auditDossier(dossier);
  const indicators = buildForensicIndicators(dossier.fights);
  const supported = indicators.filter((item) => item.status === "supported" && typeof item.score === "number");
  const topSignal = supported.reduce((best, current) => ((current.score || 0) > (best?.score || -1) ? current : best), undefined as (typeof supported)[number] | undefined);
  const comparableMetrics = dossier.metrics.filter((metric) => metric.unit === "score_100" && Number.isFinite(metric.value));
  const barData = comparableMetrics.map((metric) => ({ label: metric.label, value: metric.value }));

  return (
    <section className="premium-mesh rounded-3xl border border-white/5 p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-data uppercase tracking-[.3em] text-gold"><Crown className="w-4 h-4"/>Relatório de Perícia · Painel Premium</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-blood uppercase mt-1">{dossier.name}</h2>
        </div>
        <div className="glass rounded-xl px-4 py-2 flex items-center gap-2"><ShieldCheck className={`w-5 h-5 ${audit.publishable ? "text-green-500" : "text-amber-500"}`}/><span className="font-data text-xs text-zinc-400">Cobertura {(audit.coverage * 100).toFixed(0)}% · {audit.publishable ? "gate aprovado" : "revisão necessária"}</span></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI icon={Target} label="Sinais táticos" value={supported.length} />
        <KPI icon={Swords} label="Sinal mais forte" value={topSignal ? `${topSignal.score}/100` : "—"} />
        <KPI icon={Activity} label="Métricas comparáveis" value={comparableMetrics.length} tone="gold" />
        <KPI icon={ShieldCheck} label="Claims suportados" value={audit.supported} tone="green" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard glow="glow-red">
          <h3 className="font-display text-lg font-bold uppercase mb-4">Métricas Documentadas</h3>
          {barData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid stroke="#26262b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#52525b" fontSize={11} />
                <YAxis type="category" dataKey="label" width={120} stroke="#71717a" fontSize={10} />
                <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #26262b" }} />
                <Bar dataKey="value" fill="#dc2626" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-zinc-500">Nenhuma métrica normalizada de 0–100 disponível.</p>}
        </GlassCard>

        <GlassCard glow="glow-gold">
          <h3 className="font-display text-lg font-bold uppercase mb-4">Qualidade da Evidência</h3>
          <div className="space-y-5 font-data text-xs">
            <div><div className="flex justify-between text-zinc-500 mb-1"><span>CLAIMS SUPORTADOS</span><span>{audit.supported}</span></div><div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{ width: `${audit.coverage * 100}%` }} /></div></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-zinc-800 rounded-xl p-4"><p className="text-zinc-500">INCERTOS</p><p className="font-display text-3xl text-amber-400 mt-1">{audit.uncertain}</p></div>
              <div className="border border-zinc-800 rounded-xl p-4"><p className="text-zinc-500">CONFLITOS</p><p className="font-display text-3xl text-red-400 mt-1">{audit.conflicted}</p></div>
            </div>
            <p className="text-zinc-600 leading-relaxed">O painel não converte ausência de dados em nota. Métricas sem amostra, fonte ou fórmula compatível permanecem vazias ou bloqueadas.</p>
          </div>
        </GlassCard>
      </div>

      <WeaknessMatrix indicators={indicators} />
    </section>
  );
}
