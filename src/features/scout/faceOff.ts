import type { ScoutDossier, ScoutMetric } from "./types";
import { buildForensicIndicators } from "./forensics";

export interface FaceOffDimension {
  key: string;
  label: string;
  a: number;
  b: number;
  delta: number;
  unit?: string;
  confidence: number;
  sourceIds: string[];
  limitations: string[];
}

export interface FaceOffResult {
  comparable: boolean;
  reason?: string;
  evidenceCoverage: number;
  dimensions: FaceOffDimension[];
  edgeSummary: { a: number; b: number; neutral: number };
  tacticalSignalsA: ReturnType<typeof buildForensicIndicators>;
  tacticalSignalsB: ReturnType<typeof buildForensicIndicators>;
  note: string;
}

function metricMap(metrics: ScoutMetric[]) {
  return new Map(metrics.map((metric) => [metric.key, metric]));
}

export function buildFaceOff(a: ScoutDossier, b: ScoutDossier): FaceOffResult {
  if (a.sport !== b.sport) {
    return {
      comparable: false,
      reason: "Modalidades diferentes não são comparadas numericamente.",
      evidenceCoverage: 0,
      dimensions: [],
      edgeSummary: { a: 0, b: 0, neutral: 0 },
      tacticalSignalsA: [],
      tacticalSignalsB: [],
      note: "Face-Off exige definições estatísticas compatíveis.",
    };
  }

  const A = metricMap(a.metrics);
  const B = metricMap(b.metrics);
  const sharedKeys = [...A.keys()].filter((key) => B.has(key));
  const dimensions: FaceOffDimension[] = [];

  for (const key of sharedKeys) {
    const ma = A.get(key)!;
    const mb = B.get(key)!;
    if (ma.unit !== mb.unit) continue;
    if (!Number.isFinite(ma.value) || !Number.isFinite(mb.value)) continue;
    const confidence = Math.min(ma.confidence ?? 0.7, mb.confidence ?? 0.7);
    const sources = [...new Set([...ma.sourceIds, ...mb.sourceIds])];
    dimensions.push({
      key,
      label: ma.label,
      a: ma.value,
      b: mb.value,
      delta: ma.value - mb.value,
      unit: ma.unit,
      confidence,
      sourceIds: sources,
      limitations: [...new Set([...(ma.limitations || []), ...(mb.limitations || [])])],
    });
  }

  const normalized = dimensions.filter((d) => d.unit === "score_100");
  const edgeSummary = normalized.reduce(
    (acc, dim) => {
      if (Math.abs(dim.delta) < 5) acc.neutral += 1;
      else if (dim.delta > 0) acc.a += 1;
      else acc.b += 1;
      return acc;
    },
    { a: 0, b: 0, neutral: 0 },
  );

  const evidenceCoverage = sharedKeys.length ? dimensions.length / sharedKeys.length : 0;
  return {
    comparable: dimensions.length > 0,
    reason: dimensions.length ? undefined : "Nenhuma métrica compatível e documentada entre os dois dossiês.",
    evidenceCoverage,
    dimensions,
    edgeSummary,
    tacticalSignalsA: buildForensicIndicators(a.fights),
    tacticalSignalsB: buildForensicIndicators(b.fights),
    note: "Comparação descritiva baseada somente em métricas compartilhadas. Não representa probabilidade de vitória, aposta ou garantia de resultado.",
  };
}
