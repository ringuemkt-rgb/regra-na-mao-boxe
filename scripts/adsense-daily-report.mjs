import fs from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.resolve("reports/adsense");
const API = "https://adsense.googleapis.com/v2";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

const requiredOAuth = [
  "ADSENSE_CLIENT_ID",
  "ADSENSE_CLIENT_SECRET",
  "ADSENSE_REFRESH_TOKEN",
];

const ensureOut = () => fs.mkdir(OUT_DIR, { recursive: true });

function missingOAuth() {
  return requiredOAuth.filter((key) => !process.env[key]);
}

async function getAccessToken() {
  const body = new URLSearchParams({
    client_id: process.env.ADSENSE_CLIENT_ID,
    client_secret: process.env.ADSENSE_CLIENT_SECRET,
    refresh_token: process.env.ADSENSE_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error(`OAuth refresh failed: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  return payload.access_token;
}

async function googleGet(accessToken, endpoint, params = {}) {
  const url = new URL(`${API}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    const values = Array.isArray(value) ? value : [value];
    for (const item of values) url.searchParams.append(key, String(item));
  }

  const response = await fetch(url, {
    headers: { authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`AdSense API failed: ${response.status} ${url.pathname} ${await response.text()}`);
  }

  return response.json();
}

async function resolveAccount(accessToken) {
  const configured = (process.env.ADSENSE_ACCOUNT_ID || "").trim();
  if (configured) {
    return configured.startsWith("accounts/") ? configured : `accounts/${configured}`;
  }

  const data = await googleGet(accessToken, "/accounts");
  const accounts = data.accounts || [];

  if (accounts.length === 1) return accounts[0].name;
  if (accounts.length === 0) throw new Error("No AdSense account is available for this OAuth user.");

  throw new Error(
    `Multiple AdSense accounts found. Set ADSENSE_ACCOUNT_ID. Available: ${accounts
      .map((account) => account.name)
      .join(", ")}`,
  );
}

function rowsToObjects(report) {
  const headers = report.headers || [];
  return (report.rows || []).map((row) => {
    const output = {};
    headers.forEach((header, index) => {
      output[header.name] = row.cells?.[index]?.value ?? null;
    });
    return output;
  });
}

function latestNumber(rows, key) {
  const value = rows.at(-1)?.[key];
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function mdMoney(value, currency) {
  if (value == null) return "—";
  return `${currency || ""} ${Number(value).toFixed(2)}`.trim();
}

async function writeNotConfigured(missing) {
  await ensureOut();
  const result = {
    generatedAt: new Date().toISOString(),
    configured: false,
    missingSecrets: missing,
  };
  await fs.writeFile(path.join(OUT_DIR, "latest.json"), JSON.stringify(result, null, 2));
  await fs.writeFile(
    path.join(OUT_DIR, "latest.md"),
    `# Google AdSense — relatório diário\n\n⚪ API ainda não configurada.\n\nSecrets ausentes: ${missing.join(", ")}\n`,
  );
}

async function main() {
  const missing = missingOAuth();
  if (missing.length) {
    await writeNotConfigured(missing);
    console.log(`AdSense API monitor not configured: ${missing.join(", ")}`);
    return;
  }

  const accessToken = await getAccessToken();
  const account = await resolveAccount(accessToken);
  const accountId = account.replace(/^accounts\//, "");

  const [sites, policyIssues, alerts, report] = await Promise.all([
    googleGet(accessToken, `/${account}/sites`, { pageSize: 100 }),
    googleGet(accessToken, `/${account}/policyIssues`, { pageSize: 100 }),
    googleGet(accessToken, `/${account}/alerts`, { languageCode: "pt-BR" }),
    googleGet(accessToken, `/${account}/reports:generate`, {
      dateRange: "LAST_7_DAYS",
      "dimensions": "DATE",
      "metrics": [
        "PAGE_VIEWS",
        "AD_REQUESTS",
        "IMPRESSIONS",
        "CLICKS",
        "PAGE_VIEWS_CTR",
        "AD_REQUESTS_COVERAGE",
        "ACTIVE_VIEW_VIEWABILITY",
        "ESTIMATED_EARNINGS",
        "PAGE_VIEWS_RPM",
      ],
      reportingTimeZone: "ACCOUNT_TIME_ZONE",
      languageCode: "pt-BR",
    }),
  ]);

  const rows = rowsToObjects(report);
  const currency = report.headers?.find((h) => h.name === "ESTIMATED_EARNINGS")?.currencyCode;
  const siteRows = (sites.sites || []).map((site) => ({
    domain: site.domain,
    state: site.state,
    autoAdsEnabled: site.autoAdsEnabled,
  }));

  const result = {
    generatedAt: new Date().toISOString(),
    configured: true,
    account: accountId,
    sites: siteRows,
    policyIssues: policyIssues.policyIssues || [],
    alerts: alerts.alerts || [],
    report: {
      range: "LAST_7_DAYS",
      currency,
      rows,
      warnings: report.warnings || [],
      latest: {
        pageViews: latestNumber(rows, "PAGE_VIEWS"),
        adRequests: latestNumber(rows, "AD_REQUESTS"),
        impressions: latestNumber(rows, "IMPRESSIONS"),
        clicks: latestNumber(rows, "CLICKS"),
        pageCtr: latestNumber(rows, "PAGE_VIEWS_CTR"),
        coverage: latestNumber(rows, "AD_REQUESTS_COVERAGE"),
        viewability: latestNumber(rows, "ACTIVE_VIEW_VIEWABILITY"),
        estimatedEarnings: latestNumber(rows, "ESTIMATED_EARNINGS"),
        pageRpm: latestNumber(rows, "PAGE_VIEWS_RPM"),
      },
    },
  };

  const readySites = siteRows.filter((site) => site.state === "READY");
  const attentionSites = siteRows.filter((site) => site.state === "NEEDS_ATTENTION");
  const issueCount = result.policyIssues.length;
  const alertCount = result.alerts.length;
  const latest = result.report.latest;

  const markdown = `# Google AdSense — relatório diário\n\n` +
    `Gerado: ${result.generatedAt}\n\n` +
    `## Saúde da conta\n\n` +
    `- Sites READY: **${readySites.length}**\n` +
    `- Sites NEEDS_ATTENTION: **${attentionSites.length}**\n` +
    `- Policy issues: **${issueCount}**\n` +
    `- Alertas: **${alertCount}**\n\n` +
    `## Último dia disponível\n\n` +
    `- Page views: **${latest.pageViews ?? "—"}**\n` +
    `- Impressões: **${latest.impressions ?? "—"}**\n` +
    `- Cliques: **${latest.clicks ?? "—"}**\n` +
    `- Cobertura: **${latest.coverage == null ? "—" : (latest.coverage * 100).toFixed(1) + "%"}**\n` +
    `- Viewability: **${latest.viewability == null ? "—" : (latest.viewability * 100).toFixed(1) + "%"}**\n` +
    `- Page RPM: **${mdMoney(latest.pageRpm, currency)}**\n` +
    `- Receita estimada: **${mdMoney(latest.estimatedEarnings, currency)}**\n\n` +
    `## Sites\n\n` +
    (siteRows.length
      ? siteRows.map((site) => `- ${site.domain}: **${site.state}** · Auto ads: ${site.autoAdsEnabled ? "ON" : "OFF"}`).join("\n")
      : "- Nenhum site retornado pela API") +
    `\n`;

  await ensureOut();
  await fs.writeFile(path.join(OUT_DIR, "latest.json"), JSON.stringify(result, null, 2));
  await fs.writeFile(path.join(OUT_DIR, "latest.md"), markdown);
  console.log(markdown);
}

main().catch(async (error) => {
  await ensureOut();
  const message = error instanceof Error ? error.stack || error.message : String(error);
  await fs.writeFile(
    path.join(OUT_DIR, "latest.md"),
    `# Google AdSense — relatório diário\n\n🔴 Falha no monitor.\n\n\`\`\`\n${message}\n\`\`\`\n`,
  );
  console.error(message);
  process.exitCode = 1;
});
