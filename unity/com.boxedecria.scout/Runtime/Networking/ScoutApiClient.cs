using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Networking;

namespace BoxeDeCria.Scout
{
    public sealed class ScoutApiClient
    {
        [Serializable] private sealed class DossierRow { public string status; public ScoutDossierDto payload; }
        [Serializable] private sealed class DossierRows { public List<DossierRow> items = new(); }

        private readonly ScoutClientConfig _config;
        public ScoutApiClient(ScoutClientConfig config) => _config = config;

        public IEnumerator GetApprovedDossiers(Action<List<ScoutDossierDto>> ok, Action<string> fail)
        {
            var url = BaseRest() + "/scout_dossiers?status=eq.approved&select=status,payload&order=updated_at.desc";
            yield return Send(url, raw =>
            {
                var rows = JsonUtility.FromJson<DossierRows>(WrapArray(raw));
                var result = new List<ScoutDossierDto>();
                if (rows?.items != null)
                {
                    foreach (var row in rows.items)
                    {
                        if (row?.payload == null) continue;
                        row.payload.status = row.status;
                        if (!_config.requireApprovedStatus || row.status == "approved") result.Add(row.payload);
                    }
                }
                ok?.Invoke(result);
            }, fail);
        }

        public IEnumerator GetApprovedDossier(string slug, Action<ScoutDossierDto> ok, Action<string> fail)
        {
            var encoded = UnityWebRequest.EscapeURL(slug ?? string.Empty);
            var url = BaseRest() + $"/scout_dossiers?slug=eq.{encoded}&status=eq.approved&select=status,payload&limit=1";
            yield return Send(url, raw =>
            {
                var rows = JsonUtility.FromJson<DossierRows>(WrapArray(raw));
                if (rows?.items == null || rows.items.Count == 0 || rows.items[0].payload == null)
                {
                    fail?.Invoke("Dossiê aprovado não encontrado.");
                    return;
                }
                var row = rows.items[0];
                row.payload.status = row.status;
                ok?.Invoke(row.payload);
            }, fail);
        }

        private IEnumerator Send(string url, Action<string> ok, Action<string> fail)
        {
            using var request = UnityWebRequest.Get(url);
            request.timeout = Mathf.Max(2, _config.timeoutSeconds);
            request.SetRequestHeader("Accept", "application/json");
            if (!string.IsNullOrWhiteSpace(_config.publicAnonKey))
            {
                request.SetRequestHeader("apikey", _config.publicAnonKey);
                request.SetRequestHeader("Authorization", "Bearer " + _config.publicAnonKey);
            }
            yield return request.SendWebRequest();
            if (request.result != UnityWebRequest.Result.Success)
            {
                fail?.Invoke($"Scout API HTTP {request.responseCode}: {request.error}");
                yield break;
            }
            ok?.Invoke(request.downloadHandler.text);
        }

        private string BaseRest()
        {
            if (_config == null || string.IsNullOrWhiteSpace(_config.apiBaseUrl))
                throw new InvalidOperationException("ScoutClientConfig.apiBaseUrl não configurado.");
            return _config.apiBaseUrl.TrimEnd('/') + "/rest/v1";
        }

        private static string WrapArray(string raw) => "{\"items\":" + (string.IsNullOrWhiteSpace(raw) ? "[]" : raw) + "}";
    }
}
