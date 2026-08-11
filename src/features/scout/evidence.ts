import type { ScoutClaim, ScoutDossier } from "./types";

export interface ScoutAuditSummary {
  supported: number;
  uncertain: number;
  unsupported: number;
  conflicted: number;
  coverage: number;
  publishable: boolean;
  blockers: string[];
}

export function auditClaims(claims: ScoutClaim[]): ScoutAuditSummary {
  const counts = claims.reduce(
    (acc, claim) => {
      acc[claim.status] += 1;
      return acc;
    },
    { supported: 0, uncertain: 0, unsupported: 0, conflicted: 0 } as Record<ScoutClaim["status"], number>,
  );

  const total = claims.length;
  const coverage = total ? counts.supported / total : 0;
  const blockers: string[] = [];

  for (const claim of claims) {
    if (claim.status === "unsupported" || claim.status === "conflicted") {
      blockers.push(`Claim ${claim.id}: ${claim.status}`);
    }
    if (claim.status === "supported" && claim.evidence.length === 0) {
      blockers.push(`Claim ${claim.id}: marcado como supported sem evidência`);
    }
    if (claim.confidence < 0 || claim.confidence > 1) {
      blockers.push(`Claim ${claim.id}: confidence fora de 0–1`);
    }
  }

  return {
    ...counts,
    coverage,
    publishable: total > 0 && blockers.length === 0 && coverage >= 0.9,
    blockers,
  };
}

export function auditDossier(dossier: ScoutDossier): ScoutAuditSummary {
  const audit = auditClaims(dossier.claims);
  const sourceIds = new Set(dossier.sources.map((source) => source.id));
  const blockers = [...audit.blockers];

  dossier.claims.forEach((claim) => {
    claim.evidence.forEach((evidence) => {
      if (!sourceIds.has(evidence.sourceId)) blockers.push(`Claim ${claim.id}: source ${evidence.sourceId} ausente`);
    });
  });

  dossier.fights.forEach((fight) => {
    if (!fight.sourceIds.length) blockers.push(`Fight ${fight.id}: sem fonte`);
    fight.sourceIds.forEach((sourceId) => {
      if (!sourceIds.has(sourceId)) blockers.push(`Fight ${fight.id}: source ${sourceId} ausente`);
    });
  });

  return { ...audit, blockers, publishable: audit.publishable && blockers.length === 0 };
}
