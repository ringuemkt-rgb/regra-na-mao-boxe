using System.Collections.Generic;
using System.Linq;

namespace BoxeDeCria.Scout
{
    public readonly struct EvidenceAudit
    {
        public readonly bool Publishable;
        public readonly float Coverage;
        public readonly int Supported;
        public readonly int Uncertain;
        public readonly int Unsupported;
        public readonly int Conflicted;
        public readonly string[] Reasons;

        public EvidenceAudit(bool publishable, float coverage, int supported, int uncertain, int unsupported, int conflicted, string[] reasons)
        {
            Publishable = publishable; Coverage = coverage; Supported = supported; Uncertain = uncertain;
            Unsupported = unsupported; Conflicted = conflicted; Reasons = reasons;
        }
    }

    public static class EvidenceGate
    {
        public static EvidenceAudit Audit(ScoutDossierDto d, float minimumCoverage = 0.80f)
        {
            if (d == null) return new EvidenceAudit(false, 0, 0, 0, 1, 0, new[] { "Dossiê nulo." });
            var sourceIds = new HashSet<string>((d.sources ?? new()).Where(s => s != null && !string.IsNullOrWhiteSpace(s.id)).Select(s => s.id));
            var claims = d.claims ?? new();
            var supported = claims.Count(c => c != null && c.status == "supported");
            var uncertain = claims.Count(c => c != null && c.status == "uncertain");
            var unsupported = claims.Count(c => c != null && c.status == "unsupported");
            var conflicted = claims.Count(c => c != null && c.status == "conflicted");
            var evidenceBacked = claims.Count(c => c != null && c.evidence != null && c.evidence.Count > 0 && c.evidence.All(e => e != null && sourceIds.Contains(e.sourceId)));
            var coverage = claims.Count == 0 ? 0f : (float)evidenceBacked / claims.Count;
            var reasons = new List<string>();

            if (d.status != "approved") reasons.Add("Status do dossiê não é approved.");
            if (unsupported > 0) reasons.Add($"{unsupported} claim(s) unsupported.");
            if (conflicted > 0) reasons.Add($"{conflicted} claim(s) conflicted.");
            if (coverage < minimumCoverage) reasons.Add($"Cobertura factual {coverage:P0} abaixo do mínimo {minimumCoverage:P0}.");
            if ((d.fights ?? new()).Any(f => f == null || f.sourceIds == null || f.sourceIds.Count == 0 || f.sourceIds.Any(id => !sourceIds.Contains(id))))
                reasons.Add("Existe luta sem fonte pública vinculada.");

            return new EvidenceAudit(reasons.Count == 0, coverage, supported, uncertain, unsupported, conflicted, reasons.ToArray());
        }
    }
}
