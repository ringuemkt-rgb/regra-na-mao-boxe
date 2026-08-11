using System.Collections.Generic;
using NUnit.Framework;

namespace BoxeDeCria.Scout.Tests
{
    public sealed class ScoutIntegrityTests
    {
        [Test]
        public void UnsupportedClaimBlocksPublication()
        {
            var d = Minimal("MMA");
            d.claims.Add(new ScoutClaimDto { id = "c1", status = "unsupported", confidence = 0.9f });
            var audit = EvidenceGate.Audit(d);
            Assert.IsFalse(audit.Publishable);
            Assert.AreEqual(1, audit.Unsupported);
        }

        [Test]
        public void CrossSportFaceOffIsBlocked()
        {
            var a = Minimal("MMA");
            var b = Minimal("BOXE");
            var result = FaceOffEngine.Compare(a, b);
            Assert.IsFalse(result.Comparable);
            StringAssert.Contains("modalidades diferentes", result.Reason);
        }

        [Test]
        public void FaceOffUsesOnlySameKeyAndUnit()
        {
            var a = Minimal("MMA");
            var b = Minimal("MMA");
            a.metrics.Add(new ScoutMetricDto { key = "pace", label = "Ritmo", unit = "actions_min", value = 8, confidence = 0.8f });
            b.metrics.Add(new ScoutMetricDto { key = "pace", label = "Ritmo", unit = "actions_min", value = 6, confidence = 0.7f });
            b.metrics.Add(new ScoutMetricDto { key = "pace", label = "Ritmo", unit = "score_100", value = 90, confidence = 0.9f });
            var result = FaceOffEngine.Compare(a, b);
            Assert.IsTrue(result.Comparable);
            Assert.AreEqual(1, result.Dimensions.Count);
            Assert.AreEqual(0.7f, result.Dimensions[0].confidence, 0.001f);
        }

        private static ScoutDossierDto Minimal(string sport)
        {
            return new ScoutDossierDto
            {
                id = System.Guid.NewGuid().ToString(),
                slug = "teste",
                status = "approved",
                sport = sport,
                name = "Atleta Teste",
                sources = new List<ScoutSourceDto>(),
                claims = new List<ScoutClaimDto>(),
                fights = new List<ScoutFightDto>(),
                metrics = new List<ScoutMetricDto>()
            };
        }
    }
}
