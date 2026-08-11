import type { ReactNode } from "react";

export function HudFrame({ children, accent = "red", className = "" }: { children: ReactNode; accent?: "red" | "amber" | "green"; className?: string }) {
  const c = accent === "amber" ? "border-amber-500" : accent === "green" ? "border-green-500" : "border-red-600";
  return (
    <div className={`relative border border-zinc-800 ${className}`}>
      <span className={`absolute -top-px -left-px w-4 h-4 border-t-2 border-l-2 ${c}`} />
      <span className={`absolute -top-px -right-px w-4 h-4 border-t-2 border-r-2 ${c}`} />
      <span className={`absolute -bottom-px -left-px w-4 h-4 border-b-2 border-l-2 ${c}`} />
      <span className={`absolute -bottom-px -right-px w-4 h-4 border-b-2 border-r-2 ${c}`} />
      {children}
    </div>
  );
}

export function DataCell({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500 font-data">{label}</p>
      <p className="text-white font-data text-sm mt-0.5">{value ?? "—"}</p>
    </div>
  );
}

export function Led({ color = "green", label }: { color?: "green" | "red" | "amber"; label: string }) {
  const bg = color === "green" ? "bg-green-500" : color === "red" ? "bg-red-500" : "bg-amber-500";
  return (
    <span className="flex items-center gap-2">
      <span className={`led ${bg}`} aria-hidden="true" />
      <span className="text-[10px] font-data uppercase tracking-widest text-zinc-400">{label}</span>
    </span>
  );
}

export function StatBar({ label, value, color = "bg-red-600", suffix = "/100" }: { label: string; value: number; color?: string; suffix?: string }) {
  const safe = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div>
      <div className="flex justify-between text-[11px] font-data uppercase tracking-widest text-zinc-400 mb-1">
        <span>{label}</span><span className="text-white">{safe}{suffix}</span>
      </div>
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden" aria-label={`${label}: ${safe}${suffix}`}>
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}
