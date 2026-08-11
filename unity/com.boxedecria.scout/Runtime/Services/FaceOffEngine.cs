using System;
using System.Collections.Generic;
using System.Linq;

namespace BoxeDeCria.Scout
{
    [Serializable]
    public sealed class FaceOffDimension
    {
        public string key;
        public string label;
        public string unit;
        public float a;
        public float b;
        public float delta;
        public float confidence;
        public string limitation;
    }

    public sealed class FaceOffResult
    {
        public bool Comparable;
        public string Reason;
        public List<FaceOffDimension> Dimensions = new();
        public int AdvantagesA;
        public int AdvantagesB;
        public int Balanced;
        public float Coverage;
    }

    public static class FaceOffEngine
    {
        public static FaceOffResult Compare(ScoutDossierDto a, ScoutDossierDto b)
        {
            var result = new FaceOffResult();
            if (a == null || b == null) { result.Reason = "Selecione dois dossiês."; return result; }
            if (!string.Equals(a.sport, b.sport, StringComparison.OrdinalIgnoreCase))
            {
                result.Reason = "Face-Off bloqueado: modalidades diferentes.";
                return result;
            }

            var metricsA = (a.metrics ?? new()).Where(IsComparableMetric).GroupBy(m => Key(m)).ToDictionary(g => g.Key, g => g.First());
            var metricsB = (b.metrics ?? new()).Where(IsComparableMetric).GroupBy(m => Key(m)).ToDictionary(g => g.Key, g => g.First());
            var shared = metricsA.Keys.Intersect(metricsB.Keys).ToList();
            var universe = metricsA.Keys.Union(metricsB.Keys).Distinct().Count();
            result.Coverage = universe == 0 ? 0 : (float)shared.Count / universe;

            foreach (var key in shared)
            {
                var ma = metricsA[key]; var mb = metricsB[key];
                var d = new FaceOffDimension
                {
                    key = ma.key,
                    label = string.IsNullOrWhiteSpace(ma.label) ? ma.key : ma.label,
                    unit = ma.unit,
                    a = ma.value,
                    b = mb.value,
                    delta = ma.value - mb.value,
                    confidence = Math.Min(NormalizeConfidence(ma.confidence), NormalizeConfidence(mb.confidence)),
                    limitation = MergeLimitations(ma.limitations, mb.limitations)
                };
                result.Dimensions.Add(d);
                var tolerance = Math.Max(0.01f, Math.Max(Math.Abs(d.a), Math.Abs(d.b)) * 0.03f);
                if (Math.Abs(d.delta) <= tolerance) result.Balanced++;
                else if (d.delta > 0) result.AdvantagesA++;
                else result.AdvantagesB++;
            }

            result.Comparable = result.Dimensions.Count > 0;
            result.Reason = result.Comparable ? "Comparação descritiva; não representa probabilidade de vitória ou recomendação de aposta." : "Nenhuma métrica compatível entre os dossiês.";
            return result;
        }

        private static bool IsComparableMetric(ScoutMetricDto m) => m != null && !string.IsNullOrWhiteSpace(m.key) && !string.IsNullOrWhiteSpace(m.unit) && !float.IsNaN(m.value) && !float.IsInfinity(m.value);
        private static string Key(ScoutMetricDto m) => (m.key + "::" + m.unit).ToLowerInvariant();
        private static float NormalizeConfidence(float c) => c <= 0 ? 0.5f : Math.Clamp(c, 0f, 1f);
        private static string MergeLimitations(List<string> a, List<string> b)
        {
            var items = new List<string>();
            if (a != null) items.AddRange(a.Where(v => !string.IsNullOrWhiteSpace(v)));
            if (b != null) items.AddRange(b.Where(v => !string.IsNullOrWhiteSpace(v)));
            return string.Join(" · ", items.Distinct());
        }
    }
}
