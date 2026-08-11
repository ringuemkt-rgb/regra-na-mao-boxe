import { describe, expect, it } from "vitest";
import { auditClaims } from "@/features/scout/evidence";

const supported = (id: string) => ({ id, text: id, status: "supported" as const, confidence: 0.95, evidence: [{ sourceId: `src-${id}` }] });

describe("SCOUT DE CRIA evidence gate", () => {
  it("approves high-coverage claims with evidence", () => {
    const result = auditClaims(Array.from({ length: 10 }, (_, i) => supported(String(i))));
    expect(result.publishable).toBe(true);
    expect(result.coverage).toBe(1);
  });

  it("blocks unsupported claims", () => {
    const claims = [supported("1"), { id: "2", text: "x", status: "unsupported" as const, confidence: 0.4, evidence: [] }];
    expect(auditClaims(claims).publishable).toBe(false);
  });

  it("blocks supported labels without evidence", () => {
    const claims = [{ id: "1", text: "x", status: "supported" as const, confidence: 0.9, evidence: [] }];
    const result = auditClaims(claims);
    expect(result.publishable).toBe(false);
    expect(result.blockers.length).toBeGreaterThan(0);
  });
});
