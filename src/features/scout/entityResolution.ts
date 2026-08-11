export interface SourceRecord {
  sourceId: string;
  sourceType: string;
  externalAthleteId?: string;
  name: string;
  aliases?: string[];
  nationality?: string;
  birthYear?: number;
  category?: string;
  facts: Record<string, string | number | null | undefined>;
}

export interface FactCandidate {
  normalized: string;
  value: string | number;
  sources: string[];
  authorityScore: number;
}

export interface TriangulatedFact {
  field: string;
  value?: string | number;
  confidence: number;
  supportingSources: string[];
  conflicts: Array<{ value: string | number; sources: string[] }>;
  status: "supported" | "conflicted" | "insufficient";
  method: string;
}

const FIELD_AUTHORITY: Record<string, string[]> = {
  record: ["official_commission", "boxrec", "promotion_official", "ufc_stats", "ibjjf", "adcc", "wikipedia"],
  birthDate: ["official_bio", "wikidata", "promotion_official", "wikipedia"],
  heightCm: ["promotion_official", "ufc_stats", "official_commission", "boxrec", "wikidata"],
  reachCm: ["promotion_official", "ufc_stats", "official_commission", "boxrec"],
  category: ["promotion_official", "official_commission", "ufc_stats", "boxrec", "ibjjf", "adcc"],
  nationality: ["official_bio", "wikidata", "promotion_official", "wikipedia"],
};

const strip = (text: string) => text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

function tokenSet(text: string) {
  return new Set(strip(text).split(" ").filter(Boolean));
}

export function nameSimilarity(a: string, b: string): number {
  const A = tokenSet(a);
  const B = tokenSet(b);
  if (!A.size || !B.size) return 0;
  const intersection = [...A].filter((token) => B.has(token)).length;
  const union = new Set([...A, ...B]).size;
  return intersection / union;
}

function namesFor(record: SourceRecord): string[] {
  return [record.name, ...(record.aliases || [])].filter(Boolean);
}

export function entityMatchScore(a: SourceRecord, b: SourceRecord): number {
  const nameScore = Math.max(...namesFor(a).flatMap((x) => namesFor(b).map((y) => nameSimilarity(x, y))));
  let attributeScore = 0;
  let comparable = 0;
  for (const field of ["nationality", "birthYear", "category"] as const) {
    if (a[field] != null && b[field] != null) {
      comparable += 1;
      if (String(a[field]).toLowerCase() === String(b[field]).toLowerCase()) attributeScore += 1;
    }
  }
  const attr = comparable ? attributeScore / comparable : 0;
  return nameScore * 0.75 + attr * 0.25;
}

export function likelySameAthlete(a: SourceRecord, b: SourceRecord, threshold = 0.78): boolean {
  if (a.externalAthleteId && b.externalAthleteId && a.sourceType === b.sourceType) return a.externalAthleteId === b.externalAthleteId;
  return entityMatchScore(a, b) >= threshold;
}

export function clusterAthleteRecords(records: SourceRecord[]): SourceRecord[][] {
  const clusters: SourceRecord[][] = [];
  for (const record of records) {
    let bestIndex = -1;
    let bestScore = 0;
    clusters.forEach((cluster, index) => {
      const score = Math.max(...cluster.map((member) => entityMatchScore(record, member)));
      if (score > bestScore) { bestScore = score; bestIndex = index; }
    });
    if (bestIndex >= 0 && bestScore >= 0.78) clusters[bestIndex].push(record);
    else clusters.push([record]);
  }
  return clusters;
}

function normalizeValue(value: string | number): string {
  if (typeof value === "number") return String(Math.round(value * 1000) / 1000);
  return strip(value);
}

function authorityRank(field: string, sourceType: string): number {
  const list = FIELD_AUTHORITY[field] || [];
  const index = list.indexOf(sourceType);
  return index === -1 ? 0.2 : 1 - index / Math.max(1, list.length);
}

export function triangulateField(field: string, records: SourceRecord[]): TriangulatedFact {
  const groups = new Map<string, FactCandidate>();
  for (const record of records) {
    const raw = record.facts[field];
    if (raw == null || raw === "") continue;
    const normalized = normalizeValue(raw);
    const existing = groups.get(normalized);
    const score = authorityRank(field, record.sourceType);
    if (existing) {
      existing.sources.push(record.sourceId);
      existing.authorityScore = Math.max(existing.authorityScore, score);
    } else {
      groups.set(normalized, { normalized, value: raw, sources: [record.sourceId], authorityScore: score });
    }
  }

  const candidates = [...groups.values()];
  if (!candidates.length) return { field, confidence: 0, supportingSources: [], conflicts: [], status: "insufficient", method: "no-source-value" };

  candidates.sort((a, b) => (b.sources.length - a.sources.length) || (b.authorityScore - a.authorityScore));
  const winner = candidates[0];
  const totalMentions = candidates.reduce((sum, candidate) => sum + candidate.sources.length, 0);
  const agreement = winner.sources.length / totalMentions;
  const confidence = Math.min(0.99, agreement * 0.7 + winner.authorityScore * 0.3);
  const conflicts = candidates.slice(1).map((candidate) => ({ value: candidate.value, sources: candidate.sources }));

  return {
    field,
    value: winner.value,
    confidence: Number(confidence.toFixed(3)),
    supportingSources: winner.sources,
    conflicts,
    status: conflicts.length ? "conflicted" : winner.sources.length >= 2 ? "supported" : "insufficient",
    method: "source-agreement + field-authority weighting; conflicts retained, never silently discarded",
  };
}

export function triangulateFacts(records: SourceRecord[]): Record<string, TriangulatedFact> {
  const fields = new Set(records.flatMap((record) => Object.keys(record.facts)));
  return Object.fromEntries([...fields].map((field) => [field, triangulateField(field, records)]));
}
