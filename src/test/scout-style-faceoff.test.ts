import { describe, expect, it } from "vitest";
import { classifyStyle } from "@/features/scout/styleClassifier";
import { buildFaceOff } from "@/features/scout/faceOff";
import type { ScoutDossier } from "@/features/scout/types";

const base = (name: string, sport: ScoutDossier["sport"], value: number): ScoutDossier => ({
  id: name,
  slug: name.toLowerCase(),
  status: "approved",
  sport,
  name,
  identity: {},
  record: {},
  timeline: [],
  fights: [],
  metrics: [{ key: "pressure_score", label: "Pressão", value, unit: "score_100", derivation: "fixture", sourceIds: [`src-${name}`], confidence: 0.9 }],
  technicalSections: [],
  mediaContext: [],
  claims: [{ id: `c-${name}`, text: "fixture", status: "supported", confidence: 0.9, evidence: [{ sourceId: `src-${name}` }] }],
  sources: [{ id: `src-${name}`, kind: "official", title: "fixture", retrievedAt: "2026-08-11", reliability: 0.9 }],
  lastUpdatedAt: "2026-08-11",
});

describe("style classifier", () => {
  it("refuses short samples", () => {
    expect(classifyStyle({ sampleMinutes: 5 }).style).toBe("unknown");
  });

  it("classifies a striking-heavy documented sample deterministically", () => {
    const result = classifyStyle({ sampleMinutes: 60, significantStrikesLandedPer15: 72, knockdownsPer15: 1, takedownsLandedPer15: 0.2, submissionAttemptsPer15: 0 });
    expect(result.style).toBe("striker");
    expect(result.confidence).toBeGreaterThan(0.5);
  });
});

describe("Face-Off", () => {
  it("blocks cross-sport numerical comparisons", () => {
    const result = buildFaceOff(base("A", "BOXE", 70), base("B", "MMA", 60));
    expect(result.comparable).toBe(false);
  });

  it("compares only shared compatible metrics and does not output win probability", () => {
    const result = buildFaceOff(base("A", "MMA", 70), base("B", "MMA", 55));
    expect(result.comparable).toBe(true);
    expect(result.dimensions).toHaveLength(1);
    expect(result.edgeSummary.a).toBe(1);
    expect(JSON.stringify(result)).not.toContain("projecao_vitoria");
  });
});
