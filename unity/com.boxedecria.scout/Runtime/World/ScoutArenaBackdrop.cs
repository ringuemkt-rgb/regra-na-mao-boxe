using UnityEngine;

namespace BoxeDeCria.Scout
{
    public sealed class ScoutArenaBackdrop : MonoBehaviour
    {
        public bool buildOnAwake = true;
        public Color floorColor = new(0.025f, 0.025f, 0.035f);
        public Color accentColor = new(0.86f, 0.15f, 0.15f);
        public Color ropeColor = new(0.22f, 0.22f, 0.25f);

        private void Awake() { if (buildOnAwake) Build(); }

        [ContextMenu("Build Scout Arena")]
        public void Build()
        {
            var old = transform.Find("SCOUT_STAGE");
            if (old != null) DestroyImmediate(old.gameObject);

            var stage = new GameObject("SCOUT_STAGE").transform;
            stage.SetParent(transform, false);

            var floor = GameObject.CreatePrimitive(PrimitiveType.Cube);
            floor.name = "Analysis Floor";
            floor.transform.SetParent(stage, false);
            floor.transform.localScale = new Vector3(10, 0.1f, 10);
            floor.GetComponent<Renderer>().sharedMaterial = MakeMaterial(floorColor, 0.25f);

            var ring = new GameObject("Ring").transform;
            ring.SetParent(stage, false);
            var half = 3.6f;
            var postPositions = new[] { new Vector3(-half, 0, -half), new Vector3(half, 0, -half), new Vector3(half, 0, half), new Vector3(-half, 0, half) };
            foreach (var p in postPositions) CreatePost(ring, p);

            for (var level = 0; level < 3; level++)
            {
                var y = 1.0f + level * 0.45f;
                CreateRope(ring, new Vector3(0, y, -half), new Vector3(7.2f, 0.035f, 0.035f));
                CreateRope(ring, new Vector3(0, y, half), new Vector3(7.2f, 0.035f, 0.035f));
                CreateRope(ring, new Vector3(-half, y, 0), new Vector3(0.035f, 0.035f, 7.2f));
                CreateRope(ring, new Vector3(half, y, 0), new Vector3(0.035f, 0.035f, 7.2f));
            }

            if (Camera.main == null)
            {
                var cameraGo = new GameObject("Scout Camera", typeof(Camera), typeof(AudioListener));
                cameraGo.tag = "MainCamera";
                cameraGo.transform.position = new Vector3(8.5f, 6f, -9f);
                cameraGo.transform.LookAt(new Vector3(0, 1.1f, 0));
                cameraGo.GetComponent<Camera>().backgroundColor = new Color(0.015f, 0.015f, 0.02f);
            }
        }

        private void CreatePost(Transform parent, Vector3 position)
        {
            var go = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            go.name = "Corner Post";
            go.transform.SetParent(parent, false);
            go.transform.localPosition = position + Vector3.up * 1.25f;
            go.transform.localScale = new Vector3(0.14f, 1.25f, 0.14f);
            go.GetComponent<Renderer>().sharedMaterial = MakeMaterial(accentColor, 0.55f);
        }

        private void CreateRope(Transform parent, Vector3 position, Vector3 scale)
        {
            var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
            go.name = "Rope";
            go.transform.SetParent(parent, false);
            go.transform.localPosition = position;
            go.transform.localScale = scale;
            go.GetComponent<Renderer>().sharedMaterial = MakeMaterial(ropeColor, 0.25f);
        }

        private static Material MakeMaterial(Color color, float smoothness)
        {
            var shader = Shader.Find("Universal Render Pipeline/Lit") ?? Shader.Find("Standard");
            var material = new Material(shader) { color = color };
            if (material.HasProperty("_Smoothness")) material.SetFloat("_Smoothness", smoothness);
            return material;
        }
    }
}
