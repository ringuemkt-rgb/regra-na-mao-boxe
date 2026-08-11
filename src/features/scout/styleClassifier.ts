export type CombatStyle = "striker" | "wrestler" | "grappler" | "all-rounder" | "unknown";

export interface StyleStats {
  significantStrikesLandedPer15?: number;
  knockdownsPer15?: number;
  takedownsLandedPer15?: number;
  takedownAccuracyPct?: number;
  takedownDefensePct?: number;
  submissionAttemptsPer15?: number;
  submissionWinsPct?: number;
  controlTimePct?: number;
  sampleMinutes?: number;
}

export interface StyleClassification {
  style: CombatStyle;
  secondary?: CombatStyle;
  confidence: number;
  sampleMinutes: number;
  scores: Record<Exclude<CombatStyle, "all-rounder" | "unknown">, number>;
  rationale: string[];
  limitations: string[];
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const norm = (value: number | undefined, reference: number) => clamp01((value || 0) / reference);

export function classifyStyle(stats: StyleStats): StyleClassification {
  const sampleMinutes = stats.sampleMinutes || 0;
  if (sampleMinutes < 15) {
    return {
      style: "unknown",
      confidence: 0,
      sampleMinutes,
      scores: { striker: 0, wrestler: 0, grappler: 0 },
      rationale: ["Amostra insuficiente para classificar estilo com segurança."],
      limitations: ["Mínimo recomendado: 15 minutos de dados compatíveis.", "As referências de normalização são heurísticas internas e precisam ser calibradas por modalidade/organização."],
    };
  }

  const strikerRaw =
    norm(stats.significantStrikesLandedPer15, 75) * 0.65 +
    norm(stats.knockdownsPer15, 1.2) * 0.35;

  const wrestlerRaw =
    norm(stats.takedownsLandedPer15, 4.5) * 0.5 +
    norm(stats.takedownAccuracyPct, 65) * 0.2 +
    norm(stats.controlTimePct, 45) * 0.3;

  const grapplerRaw =
    norm(stats.submissionAttemptsPer15, 3) * 0.55 +
    norm(stats.submissionWinsPct, 60) * 0.25 +
    norm(stats.controlTimePct, 45) * 0.2;

  const total = strikerRaw + wrestlerRaw + grapplerRaw || 1;
  const scores = {
    striker: Number(((strikerRaw / total) * 100).toFixed(1)),
    wrestler: Number(((wrestlerRaw / total) * 100).toFixed(1)),
    grappler: Number(((grapplerRaw / total) * 100).toFixed(1)),
  };

  const ranking = (Object.entries(scores) as Array<["striker" | "wrestler" | "grappler", number]>).sort((a, b) => b[1] - a[1]);
  const [first, second] = ranking;
  const separation = first[1] - second[1];
  const allRounder = separation < 12 && first[1] >= 30 && second[1] >= 25;
  const style: CombatStyle = allRounder ? "all-rounder" : first[0];
  const confidence = Number(Math.min(0.95, 0.45 + separation / 100 + Math.min(sampleMinutes, 90) / 300).toFixed(2));

  const rationale = [
    `Striking ${scores.striker} · wrestling ${scores.wrestler} · grappling ${scores.grappler}.`,
    allRounder ? `Diferença de ${separation.toFixed(1)} p.p. entre os dois maiores componentes: perfil híbrido.` : `Componente dominante: ${first[0]} com vantagem de ${separation.toFixed(1)} p.p.`,
  ];

  return {
    style,
    secondary: allRounder ? second[0] : second[0],
    confidence,
    sampleMinutes,
    scores,
    rationale,
    limitations: [
      "Classificação descreve comportamento estatístico, não identidade fixa do atleta.",
      "Comparar apenas dados da mesma modalidade e definições estatísticas compatíveis.",
      "Defesa de queda isolada não torna alguém wrestler; ela não entra como componente ofensivo principal.",
      "O classificador deve ser recalibrado quando a distribuição da base de dados mudar.",
    ],
  };
}
