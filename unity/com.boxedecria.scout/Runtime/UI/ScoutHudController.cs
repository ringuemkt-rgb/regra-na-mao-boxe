using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UIElements;

namespace BoxeDeCria.Scout
{
    [RequireComponent(typeof(UIDocument))]
    public sealed class ScoutHudController : MonoBehaviour
    {
        public ScoutClientConfig config;
        public VisualTreeAsset layout;
        public StyleSheet styleSheet;

        private UIDocument _document;
        private ScoutApiClient _api;
        private readonly List<ScoutDossierDto> _catalog = new();
        private DateTime _lastRefreshUtc = DateTime.MinValue;
        private TextField _search;
        private ScrollView _results;
        private VisualElement _dossierPanel;
        private Label _status;
        private DropdownField _athleteA;
        private DropdownField _athleteB;
        private ScrollView _faceOff;
        private Label _faceSummary;

        private void Awake()
        {
            _document = GetComponent<UIDocument>();
            if (layout != null)
            {
                _document.rootVisualElement.Clear();
                layout.CloneTree(_document.rootVisualElement);
            }
            if (styleSheet != null && !_document.rootVisualElement.styleSheets.Contains(styleSheet))
                _document.rootVisualElement.styleSheets.Add(styleSheet);
            _api = new ScoutApiClient(config);
            BindUi();
        }

        private void OnEnable() => RefreshCatalog(false);

        private void BindUi()
        {
            var root = _document.rootVisualElement;
            _search = root.Q<TextField>("searchField");
            _results = root.Q<ScrollView>("resultsContainer");
            _dossierPanel = root.Q<VisualElement>("dossierPanel");
            _status = root.Q<Label>("statusLabel");
            _athleteA = root.Q<DropdownField>("athleteAField");
            _athleteB = root.Q<DropdownField>("athleteBField");
            _faceOff = root.Q<ScrollView>("faceOffContainer");
            _faceSummary = root.Q<Label>("faceOffSummary");
            root.Q<Button>("refreshButton").clicked += () => RefreshCatalog(true);
            root.Q<Button>("compareButton").clicked += RenderFaceOff;
            _search.RegisterValueChangedCallback(_ => RenderSearchResults());
            _athleteA.RegisterValueChangedCallback(_ => SyncFaceOffChoices());
        }

        private void RefreshCatalog(bool force)
        {
            if (config == null)
            {
                SetStatus("CONFIG AUSENTE", true);
                return;
            }
            if (!force && config.cacheSeconds > 0 && (DateTime.UtcNow - _lastRefreshUtc).TotalSeconds < config.cacheSeconds && _catalog.Count > 0)
            {
                RenderSearchResults();
                return;
            }

            SetStatus("SINCRONIZANDO", false);
            StartCoroutine(_api.GetApprovedDossiers(rows =>
            {
                _catalog.Clear();
                _catalog.AddRange(rows.Where(d => d != null && EvidenceGate.Audit(d).Publishable));
                _lastRefreshUtc = DateTime.UtcNow;
                SetStatus($"{_catalog.Count} APROVADOS", false);
                UpdateChoices();
                RenderSearchResults();
            }, error =>
            {
                Debug.LogError(error);
                SetStatus("ERRO DE API", true);
            }));
        }

        private void RenderSearchResults()
        {
            if (_results == null) return;
            _results.Clear();
            var q = (_search?.value ?? string.Empty).Trim().ToLowerInvariant();
            var matches = _catalog.Where(d => string.IsNullOrEmpty(q) || SearchBlob(d).Contains(q)).Take(12);
            foreach (var d in matches)
            {
                var row = new Button(() => RenderDossier(d));
                row.AddToClassList("result-row");
                var left = new VisualElement();
                var title = new Label(string.IsNullOrWhiteSpace(d.nickname) ? d.name : $"{d.name} · ‘{d.nickname}’");
                title.AddToClassList("result-name");
                var meta = new Label(string.Join(" · ", new[] { d.sport, d.category, d.identity?.nationality }.Where(v => !string.IsNullOrWhiteSpace(v))));
                meta.AddToClassList("result-meta");
                left.Add(title); left.Add(meta); row.Add(left); row.Add(new Label("RAIO-X →"));
                _results.Add(row);
            }
        }

        private void RenderDossier(ScoutDossierDto d)
        {
            var root = _document.rootVisualElement;
            var audit = EvidenceGate.Audit(d);
            _dossierPanel.RemoveFromClassList("hidden");
            root.Q<Label>("dossierEyebrow").text = $"{d.sport} · {d.category}";
            root.Q<Label>("dossierName").text = string.IsNullOrWhiteSpace(d.nickname) ? d.name : $"{d.name} · ‘{d.nickname}’";
            root.Q<Label>("dossierMeta").text = string.Join(" · ", new[] { d.identity?.nationality, d.identity?.stance, d.team }.Where(v => !string.IsNullOrWhiteSpace(v)));
            root.Q<Label>("winsValue").text = d.record?.wins.ToString() ?? "—";
            root.Q<Label>("lossesValue").text = d.record?.losses.ToString() ?? "—";
            root.Q<Label>("coverageValue").text = audit.Coverage.ToString("P0");
            root.Q<Label>("supportedValue").text = audit.Supported.ToString();
            root.Q<Label>("auditLabel").text = audit.Publishable ? "✓ Gate de evidência aprovado para exibição pública." : "BLOQUEADO · " + string.Join(" · ", audit.Reasons);

            var metrics = root.Q<ScrollView>("metricsContainer");
            metrics.Clear();
            foreach (var metric in (d.metrics ?? new()).OrderByDescending(m => m.confidence)) metrics.Add(BuildMetric(metric));
        }

        private VisualElement BuildMetric(ScoutMetricDto m)
        {
            var row = new VisualElement(); row.AddToClassList("metric-row");
            var head = new VisualElement(); head.AddToClassList("metric-head");
            var label = new Label(string.IsNullOrWhiteSpace(m.label) ? m.key : m.label); label.AddToClassList("metric-label");
            var value = new Label($"{m.value:0.##} {m.unit}"); value.AddToClassList("metric-value");
            head.Add(label); head.Add(value); row.Add(head);
            var limitation = m.limitations == null || m.limitations.Count == 0 ? string.Empty : " · Limitações: " + string.Join(" · ", m.limitations);
            var note = new Label($"Confiança {(m.confidence <= 0 ? 0.5f : m.confidence):P0} · n={m.sampleSize} · {m.derivation}{limitation}");
            note.AddToClassList("metric-note"); row.Add(note);
            return row;
        }

        private void UpdateChoices()
        {
            var choices = _catalog.Select(DisplayName).ToList();
            _athleteA.choices = choices;
            _athleteB.choices = choices;
        }

        private void SyncFaceOffChoices()
        {
            var a = FindByDisplay(_athleteA.value);
            _athleteB.choices = _catalog.Where(d => a == null || (d.id != a.id && d.sport == a.sport)).Select(DisplayName).ToList();
            if (!_athleteB.choices.Contains(_athleteB.value)) _athleteB.value = null;
        }

        private void RenderFaceOff()
        {
            _faceOff.Clear();
            var a = FindByDisplay(_athleteA.value); var b = FindByDisplay(_athleteB.value);
            var result = FaceOffEngine.Compare(a, b);
            _faceSummary.text = result.Reason;
            if (!result.Comparable) return;
            _faceSummary.text = $"A {result.AdvantagesA} vantagens dimensionais · {result.Balanced} equilibradas · B {result.AdvantagesB} · cobertura {result.Coverage:P0}";
            foreach (var d in result.Dimensions)
            {
                var row = new VisualElement(); row.AddToClassList("face-row");
                row.Add(new Label($"{a.name}: {d.a:0.##}   |   {d.label}   |   {b.name}: {d.b:0.##} {d.unit}"));
                var note = new Label($"Δ {d.delta:+0.##;-0.##;0} · confiança {d.confidence:P0}{(string.IsNullOrWhiteSpace(d.limitation) ? "" : " · " + d.limitation)}");
                note.AddToClassList("metric-note"); row.Add(note); _faceOff.Add(row);
            }
        }

        private ScoutDossierDto FindByDisplay(string display) => _catalog.FirstOrDefault(d => DisplayName(d) == display);
        private static string DisplayName(ScoutDossierDto d) => $"{d.name} · {d.sport}";
        private static string SearchBlob(ScoutDossierDto d) => string.Join(" ", new[] { d.name, d.nickname, d.sport, d.category, d.identity?.nationality }.Where(v => !string.IsNullOrWhiteSpace(v))).ToLowerInvariant();

        private void SetStatus(string text, bool error)
        {
            if (_status == null) return;
            _status.text = text;
            _status.style.color = new StyleColor(error ? new Color(0.95f, 0.27f, 0.27f) : new Color(0.13f, 0.77f, 0.37f));
        }
    }
}
