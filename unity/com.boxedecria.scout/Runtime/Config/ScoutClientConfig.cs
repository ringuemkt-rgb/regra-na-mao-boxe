using UnityEngine;

namespace BoxeDeCria.Scout
{
    [CreateAssetMenu(menuName = "BOXE DE CRIA/Scout Client Config", fileName = "ScoutClientConfig")]
    public sealed class ScoutClientConfig : ScriptableObject
    {
        [Header("Public API only")]
        [Tooltip("Use only an endpoint protected by RLS / public-approved dossier policy. Never use a service-role key in Unity.")]
        public string apiBaseUrl;

        [Tooltip("Optional public/anon key. Never store privileged secrets in a client build.")]
        public string publicAnonKey;

        [Header("Client behavior")]
        [Min(2)] public int timeoutSeconds = 15;
        [Min(0)] public int cacheSeconds = 120;
        public bool requireApprovedStatus = true;
    }
}
