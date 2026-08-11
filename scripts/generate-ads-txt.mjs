import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const out = path.join(publicDir, "ads.txt");

const raw = (
  process.env.ADSENSE_PUBLISHER_ID ||
  process.env.VITE_ADSENSE_PUBLISHER_ID ||
  ""
).trim();

const publisher = raw.replace(/^ca-/, "");
const valid = /^pub-\d{10,}$/.test(publisher);

if (!valid) {
  console.log("[ads.txt] publisher ID not configured; leaving public/ads.txt untouched.");
  process.exit(0);
}

fs.mkdirSync(publicDir, { recursive: true });
const line = `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n`;
fs.writeFileSync(out, line, "utf8");
console.log(`[ads.txt] generated for ${publisher.slice(0, 8)}…`);
