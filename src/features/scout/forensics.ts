import type { ScoutFight } from "./types";

export type TacticalIndicatorStatus = "supported" | "insufficient_data";

export interface TacticalIndicator {
  key: string;
  title: string;
  status: TacticalIndicatorStatus;
  score?: number;
  sampleSize: number;
  observation: string;
  tacticalImplication?: string;
  formula: string;
  limitations: string[];
  sourceIds: string[];
}

export interface ForensicFight extends ScoutFight {
  opponentStyle?: "striker" | "grappler" | "wrestler" | "mixed" | "unknown";
  titleFight?: boolean;
  knockdownsSuffered?: number;
  takedownsAttemptedAgainst?: number;
  takedownsDefended?: number;
  round1Result?: "won" | "lost" | "draw" | "unknown";
}

const unique = (items: string[]) => [...new Set(items.filter(Boolean))];
const pct = (n: number, d: number) => (d ? (n / d) * 100 : 0);
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

function insufficient(key: string, title: string, formula: string, limitations: string[]): TacticalIndicator {
  return { key, title, status: "insufficient_data", sampleSize: 0, observation: "Dados insuficientes para uma inferência responsável.", formula, limitations, sourceIds: [] };
}

export function methodLossIndicator(fights: ForensicFight[]): TacticalIndicator[] {
  const losses = fights.filter((fight) => fight.result === "D" && fight.method);
  if (losses.length < 2) return [insufficient("loss-method", "Distribuição das derrotas", "derrotas por método ÷ derrotas com método conhecido", ["Amostra mínima: 2 derrotas com método documentado."])];

  const groups = [
    { key: "ko-tko", title: "Derrotas por KO/TKO", match: (m: string) => /(^|\b)(t?ko)(\b|$)/i.test(m) },
    { key: "submission", title: "Derrotas por finalização", match: (m: string) => /sub|finaliza/i.test(m) },
    { key: "decision", title: "Derrotas por decisão", match: (m: string) => /dec/i.test(m) },
  ];

  return groups.map(({ key, title, match }) => {
    const selected = losses.filter((fight) => match(fight.method || ""));
    const percentage = pct(selected.length, losses.length);
    return {
      key,
      title,
      status: "supported" as const,
      score: clamp(percentage),
      sampleSize: losses.length,
      observation: `${selected.length} de ${losses.length} derrotas documentadas ocorreram nesta categoria (${percentage.toFixed(1)}%).`,
      tacticalImplication: selected.length ? "Tratar como tendência histórica a ser estudada em vídeo; não como deficiência física ou garantia de repetição." : "Nenhuma concentração observada nesta amostra.",
      formula: "nº de derrotas no método ÷ nº de derrotas com método conhecido × 100",
      limitations: ["Método da derrota não identifica sozinho a causa técnica.", "Não autoriza inferir 'queixo fraco', lesão, estado psicológico ou condicionamento."],
      sourceIds: unique(losses.flatMap((fight) => fight.sourceIds)),
    };
  });
}

export function matchupStyleIndicators(fights: ForensicFight[]): TacticalIndicator[] {
  const usable = fights.filter((fight) => fight.opponentStyle && fight.opponentStyle !== "unknown" && (fight.result === "V" || fight.result === "D"));
  const styles: ForensicFight["opponentStyle"][] = ["striker", "grappler", "wrestler", "mixed"];

  return styles.flatMap((style) => {
    const sample = usable.filter((fight) => fight.opponentStyle === style);
    if (sample.length < 3) return [];
    const wins = sample.filter((fight) => fight.result === "V").length;
    const winRate = pct(wins, sample.length);
    const opportunity = 100 - winRate;
    return [{
      key: `matchup-${style}`,
      title: `Resultados contra perfil ${style}`,
      status: "supported" as const,
      score: clamp(opportunity),
      sampleSize: sample.length,
      observation: `${wins} vitórias em ${sample.length} confrontos rotulados (${winRate.toFixed(1)}% de vitórias).`,
      tacticalImplication: opportunity >= 60 ? "Há sinal histórico para aprofundar estudo de matchup com revisão de vídeo e contexto competitivo." : "Não há concentração forte de resultados negativos nesta amostra.",
      formula: "100 − (vitórias contra o perfil ÷ confrontos contra o perfil × 100)",
      limitations: ["Rótulos de estilo simplificam atletas híbridos.", "Nível do adversário, fase da carreira e regras do evento são confundidores."],
      sourceIds: unique(sample.flatMap((fight) => fight.sourceIds)),
    }];
  });
}

export function lateFightOutcomeIndicator(fights: ForensicFight[]): TacticalIndicator {
  const usable = fights.filter((fight) => typeof fight.round === "number" && (fight.result === "V" || fight.result === "D"));
  const early = usable.filter((fight) => (fight.round || 0) <= 2);
  const late = usable.filter((fight) => (fight.round || 0) >= 3);
  const formula = "taxa de vitórias em lutas encerradas no R1–R2 versus taxa de vitórias em lutas encerradas no R3+";
  if (early.length < 3 || late.length < 3) return insufficient("late-outcomes", "Resultados em lutas que chegam mais tarde", formula, ["Exige pelo menos 3 resultados em cada grupo.", "Round de encerramento não mede cardio diretamente."]);

  const earlyRate = pct(early.filter((fight) => fight.result === "V").length, early.length);
  const lateRate = pct(late.filter((fight) => fight.result === "V").length, late.length);
  const delta = earlyRate - lateRate;
  return {
    key: "late-outcomes",
    title: "Resultados em lutas que chegam mais tarde",
    status: "supported",
    score: clamp(Math.max(0, delta)),
    sampleSize: early.length + late.length,
    observation: `Vitórias em lutas encerradas até R2: ${earlyRate.toFixed(1)}%. Em lutas encerradas no R3+: ${lateRate.toFixed(1)}%. Diferença: ${delta.toFixed(1)} p.p.`,
    tacticalImplication: delta >= 15 ? "O histórico justifica investigar gestão de ritmo, ajustes tardios e qualidade dos adversários em vídeo — sem concluir automaticamente fadiga." : "A amostra não mostra queda importante nos resultados tardios.",
    formula,
    limitations: ["Não é uma medida direta de condicionamento cardiorrespiratório.", "Duração da luta depende do adversário, regras, estratégia e método de encerramento."],
    sourceIds: unique([...early, ...late].flatMap((fight) => fight.sourceIds)),
  };
}

export function takedownDefenseIndicator(fights: ForensicFight[]): TacticalIndicator {
  const usable = fights.filter((fight) => typeof fight.takedownsAttemptedAgainst === "number" && typeof fight.takedownsDefended === "number");
  const attempts = usable.reduce((sum, fight) => sum + (fight.takedownsAttemptedAgainst || 0), 0);
  const defended = usable.reduce((sum, fight) => sum + (fight.takedownsDefended || 0), 0);
  const formula = "quedas defendidas ÷ tentativas de queda do adversário × 100";
  if (attempts < 10) return insufficient("takedown-defense", "Defesa de quedas observada", formula, ["Mínimo de 10 tentativas documentadas para exibir o indicador."]);
  const defenseRate = pct(defended, attempts);
  return {
    key: "takedown-defense",
    title: "Defesa de quedas observada",
    status: "supported",
    score: clamp(100 - defenseRate),
    sampleSize: attempts,
    observation: `${defended} defesas em ${attempts} tentativas documentadas (${defenseRate.toFixed(1)}%).`,
    tacticalImplication: defenseRate < 60 ? "Sinal para estudar entradas, defesa de grade/cordas e recuperação posicional nas lutas-fonte." : "A taxa agregada não aponta vulnerabilidade evidente nesta amostra.",
    formula,
    limitations: ["Definição de tentativa/defesa varia entre provedores.", "Não transferir esta métrica entre modalidades sem adaptar a taxonomia."],
    sourceIds: unique(usable.flatMap((fight) => fight.sourceIds)),
  };
}

export function comebackIndicator(fights: ForensicFight[]): TacticalIndicator {
  const usable = fights.filter((fight) => fight.round1Result === "lost" && (fight.result === "V" || fight.result === "D"));
  const formula = "vitórias após perder o R1 ÷ lutas com R1 perdido e resultado final conhecido × 100";
  if (usable.length < 3) return insufficient("comeback", "Reversão após perder o primeiro round", formula, ["Exige pontuação/avaliação confiável do R1 e mínimo de 3 lutas.", "Não mede personalidade ou resiliência psicológica."]);
  const wins = usable.filter((fight) => fight.result === "V").length;
  const comebackRate = pct(wins, usable.length);
  return {
    key: "comeback",
    title: "Reversão após perder o primeiro round",
    status: "supported",
    score: clamp(100 - comebackRate),
    sampleSize: usable.length,
    observation: `${wins} viradas em ${usable.length} lutas onde o R1 foi classificado como perdido (${comebackRate.toFixed(1)}%).`,
    tacticalImplication: comebackRate < 40 ? "Investigar em vídeo como o atleta responde tecnicamente a desvantagem no placar e quais ajustes aparecem ou não aparecem." : "O histórico contém capacidade relevante de reversão após desvantagem inicial.",
    formula,
    limitations: ["Não inferir confiança, medo, ansiedade ou fragilidade psicológica.", "Pontuação de rounds precisa vir de fonte/revisão definida."],
    sourceIds: unique(usable.flatMap((fight) => fight.sourceIds)),
  };
}

export function buildForensicIndicators(fights: ForensicFight[]): TacticalIndicator[] {
  return [
    ...methodLossIndicator(fights),
    ...matchupStyleIndicators(fights),
    lateFightOutcomeIndicator(fights),
    takedownDefenseIndicator(fights),
    comebackIndicator(fights),
  ];
}
