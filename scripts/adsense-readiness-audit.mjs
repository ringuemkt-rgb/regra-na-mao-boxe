import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (p) => {
  try { return fs.readFileSync(path.join(root, p), "utf8"); } catch { return ""; }
};

const index = read("index.html");
const app = read("src/App.tsx");
const cookie = read("src/components/CookieConsent.tsx");
const config = read("src/config/adsense.ts");
const slot = read("src/components/ads/AdSlot.tsx");
const landing = read("src/pages/Index.tsx");
const adsTxt = read("public/ads.txt");

const checks = [];
const add = (name, ok, severity, detail) => checks.push({ name, ok, severity, detail });

const consentPos = index.indexOf("gtag('consent', 'default'");
const gtagPos = index.indexOf("googletagmanager.com/gtag/js");
const gtmPos = index.indexOf("googletagmanager.com/gtm.js");

add(
  "Consent Mode v2 defaults before Google tags",
  consentPos >= 0 && (gtagPos < 0 || consentPos < gtagPos) && (gtmPos < 0 || consentPos < gtmPos),
  "blocker",
  "Default consent must execute before GA/GTM/advertising tags."
);

for (const signal of ["ad_storage", "ad_user_data", "ad_personalization", "analytics_storage"]) {
  add(`Consent signal: ${signal}`, index.includes(`'${signal}'`), "blocker", `Missing ${signal} in index consent defaults.`);
}

add(
  "Banner updates Google consent",
  cookie.includes("updateGoogleConsent") && cookie.includes("setConsent"),
  "blocker",
  "Cookie banner must persist choice and update Consent Mode."
);

add(
  "AdSense bootstrap mounted in SPA",
  app.includes("AdSenseScript") && app.includes("<AdSenseScript"),
  "blocker",
  "AdSenseScript must be mounted under BrowserRouter."
);

add(
  "AdSense disabled by default",
  config.includes("VITE_ADSENSE_ENABLED") && config.includes("false"),
  "blocker",
  "Production ads must require an explicit feature flag."
);

add(
  "Homepage ads blocked by default",
  config.includes("VITE_ADSENSE_ALLOW_HOME") && config.includes("false"),
  "warning",
  "Commercial homepage should not carry AdSense during rollout."
);

add(
  "Manual ads labeled as Publicidade",
  slot.includes("Publicidade") && slot.includes('aria-label="Publicidade"'),
  "blocker",
  "Ad units must be visually distinguishable from editorial UI."
);

add(
  "No ad click interception",
  !/onClick|addEventListener\(["']click|ad_click/i.test(slot),
  "blocker",
  "Do not instrument ad clicks or add click handlers around ad units."
);

add(
  "Landing has no manual AdSense unit",
  !/AdSlot|adsbygoogle|data-ad-slot/.test(landing),
  "warning",
  "The product landing should stay focused on conversion."
);

const hardcodedPublishers = [index, app, config, slot, landing]
  .join("\n")
  .match(/ca-pub-\d{10,}/g) || [];
add(
  "No hard-coded real publisher ID in application source",
  hardcodedPublishers.length === 0,
  "blocker",
  hardcodedPublishers.length ? `Found: ${[...new Set(hardcodedPublishers)].join(", ")}` : "Publisher ID is environment-driven."
);

if (adsTxt) {
  add(
    "ads.txt format",
    /^google\.com, pub-\d{10,}, DIRECT, f08c47fec0942fa0\s*$/m.test(adsTxt),
    "blocker",
    "public/ads.txt exists and must contain the Google seller line with the real publisher ID."
  );
} else {
  add(
    "ads.txt pending publisher activation",
    true,
    "info",
    "No public/ads.txt committed. The build generator will create it only when a real publisher ID is supplied."
  );
}

const blockers = checks.filter((c) => c.severity === "blocker" && !c.ok);
const warnings = checks.filter((c) => c.severity === "warning" && !c.ok);
const generatedAt = new Date().toISOString();

fs.mkdirSync(path.join(root, "reports"), { recursive: true });

const md = [
  "# BOXE DE CRIA — AdSense Readiness Audit",
  "",
  `Generated: ${generatedAt}`,
  `Status: ${blockers.length ? "BLOCKED" : "READY STRUCTURALLY"}`,
  `Blockers: ${blockers.length} · Warnings: ${warnings.length}`,
  "",
  ...checks.map((c) => `${c.ok ? "✅" : c.severity === "blocker" ? "❌" : "⚠️"} **${c.name}** — ${c.detail}`),
  "",
  "> This audit verifies repository structure and policy guardrails. It does not confirm AdSense account approval, live site review status, traffic quality or revenue eligibility.",
  "",
].join("\n");

fs.writeFileSync(path.join(root, "reports/adsense-readiness.md"), md, "utf8");
fs.writeFileSync(path.join(root, "reports/adsense-readiness.json"), JSON.stringify({ generatedAt, blockers, warnings, checks }, null, 2), "utf8");

console.log(md);
if (blockers.length) process.exit(1);
