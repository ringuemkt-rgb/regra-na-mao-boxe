using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;

namespace BoxeDeCria.Scout.Editor
{
    public static class ScoutInstaller
    {
        private const string RootFolder = "Assets/ScoutDeCria";

        [MenuItem("Tools/BOXE DE CRIA/Install Scout HUD in Current Scene")]
        public static void Install()
        {
            EnsureFolder("Assets", "ScoutDeCria");

            var panel = AssetDatabase.LoadAssetAtPath<PanelSettings>($"{RootFolder}/ScoutPanelSettings.asset");
            if (panel == null)
            {
                panel = ScriptableObject.CreateInstance<PanelSettings>();
                panel.scaleMode = PanelScaleMode.ScaleWithScreenSize;
                panel.referenceResolution = new Vector2Int(1440, 900);
                panel.screenMatchMode = PanelScreenMatchMode.MatchWidthOrHeight;
                panel.match = 0.5f;
                AssetDatabase.CreateAsset(panel, $"{RootFolder}/ScoutPanelSettings.asset");
            }

            var config = AssetDatabase.LoadAssetAtPath<ScoutClientConfig>($"{RootFolder}/ScoutClientConfig.asset");
            if (config == null)
            {
                config = ScriptableObject.CreateInstance<ScoutClientConfig>();
                AssetDatabase.CreateAsset(config, $"{RootFolder}/ScoutClientConfig.asset");
            }

            var layout = FindFirst<VisualTreeAsset>("ScoutHud");
            var style = FindFirst<StyleSheet>("ScoutHud");
            if (layout == null || style == null)
            {
                EditorUtility.DisplayDialog("SCOUT DE CRIA", "ScoutHud.uxml/uss não encontrados no package.", "OK");
                return;
            }

            var existing = GameObject.Find("SCOUT_DE_CRIA_HUD");
            var go = existing != null ? existing : new GameObject("SCOUT_DE_CRIA_HUD");
            Undo.RegisterCreatedObjectUndo(go, "Install Scout HUD");

            var document = go.GetComponent<UIDocument>() ?? Undo.AddComponent<UIDocument>(go);
            document.panelSettings = panel;

            var controller = go.GetComponent<ScoutHudController>() ?? Undo.AddComponent<ScoutHudController>(go);
            controller.config = config;
            controller.layout = layout;
            controller.styleSheet = style;

            Selection.activeGameObject = go;
            EditorUtility.SetDirty(go);
            AssetDatabase.SaveAssets();
            Debug.Log("SCOUT DE CRIA instalado. Configure ScoutClientConfig.apiBaseUrl e publicAnonKey antes de Play.");
        }

        private static T FindFirst<T>(string name) where T : Object
        {
            foreach (var guid in AssetDatabase.FindAssets($"{name} t:{typeof(T).Name}"))
            {
                var asset = AssetDatabase.LoadAssetAtPath<T>(AssetDatabase.GUIDToAssetPath(guid));
                if (asset != null) return asset;
            }
            return null;
        }

        private static void EnsureFolder(string parent, string child)
        {
            var path = parent + "/" + child;
            if (!AssetDatabase.IsValidFolder(path)) AssetDatabase.CreateFolder(parent, child);
        }
    }
}
