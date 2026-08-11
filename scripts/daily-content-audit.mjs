import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const QUEUE_PATH = path.join(ROOT, 'content', 'editorial-queue.json');
const REPORT_DIR = path.join(ROOT, 'reports');

const POLICY_SOURCES = [
  {
    name: 'Google Helpful Content',
    url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content'
  },
  {
    name: 'Google Generative AI Guidance',
    url: 'https://developers.google.com/search/docs/fundamentals/using-gen-ai-content'
  },
  {
    name: 'Google Spam Policies',
    url: 'https://developers.google.com/search/docs/essentials/spam-policies'
  },
  {
    name: 'Google AdSense Program Policies',
    url: 'https://support.google.com/adsense/answer/48182'
  },
  {
    name: 'Google AdSense Site Approval / Content Quality',
    url: 'https://support.google.com/adsense/answer/81904'
  }
];

const REQUIRED_FIELDS = [
  'slug',
  'title',
  'category',
  'intent',
  'businessRole',
  'priority',
  'status',
  'requiresHealthReview',
  'originalValuePlan',
  'sourceThemes'
];

const allowedStatuses = new Set([
  'idea',
  'brief_needed',
  'researching',
  'drafting',
  'review_needed',
  'approved',
  'published',
  'update_needed',
  'retired'
]);

function normalizeWhitespace(input = '') {
  return input.replace(/\s+/g, ' ').trim();
}

function stripHtml(html = '') {
  return normalizeWhitespace(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  );
}

function fingerprint(text = '') {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

async function checkPolicySource(source) {
  try {
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'BoxeDeCriaEditorialAudit/1.0'
      },
      redirect: 'follow'
    });
    const html = await response.text();
    const text = stripHtml(html).slice(0, 120000);
    return {
      ...source,
      ok: response.ok,
      status: response.status,
      lastModified: response.headers.get('last-modified'),
      fingerprint: fingerprint(text),
      sampleLength: text.length
    };
  } catch (error) {
    return {
      ...source,
      ok: false,
      status: null,
      lastModified: null,
      fingerprint: null,
      sampleLength: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function auditQueue(queue) {
  const errors = [];
  const warnings = [];
  const slugs = new Set();
  const titles = new Set();

  if (!Array.isArray(queue.items)) {
    errors.push('content/editorial-queue.json precisa conter um array `items`.');
    return { errors, warnings, ranked: [] };
  }

  for (const [index, item] of queue.items.entries()) {
    for (const field of REQUIRED_FIELDS) {
      if (!(field in item)) {
        errors.push(`Item ${index + 1}: campo obrigatório ausente: ${field}`);
      }
    }

    if (slugs.has(item.slug)) errors.push(`Slug duplicado: ${item.slug}`);
    if (titles.has(item.title)) errors.push(`Título duplicado: ${item.title}`);
    slugs.add(item.slug);
    titles.add(item.title);

    if (!allowedStatuses.has(item.status)) {
      errors.push(`Status inválido em ${item.slug}: ${item.status}`);
    }

    if (!Number.isFinite(item.priority) || item.priority < 0) {
      errors.push(`Prioridade inválida em ${item.slug}`);
    }

    if (!Array.isArray(item.originalValuePlan) || item.originalValuePlan.length < 2) {
      errors.push(`${item.slug}: precisa de pelo menos 2 elementos de valor original antes de publicar.`);
    }

    if (!Array.isArray(item.sourceThemes) || item.sourceThemes.length === 0) {
      errors.push(`${item.slug}: precisa indicar temas/fontes de pesquisa.`);
    }

    if (item.status === 'approved' || item.status === 'published') {
      if (item.requiresHealthReview && !item.healthReviewApproved) {
        errors.push(`${item.slug}: conteúdo sensível de saúde não pode estar ${item.status} sem healthReviewApproved=true.`);
      }
      if (!item.editorialScore || item.editorialScore < 85) {
        errors.push(`${item.slug}: aprovação/publicação exige editorialScore >= 85.`);
      }
    }

    if (item.intent === 'commercial_investigation' && item.firstHandTested === true && !item.firstHandEvidence) {
      errors.push(`${item.slug}: alegação de teste prático exige firstHandEvidence.`);
    }

    if (item.priority >= 28 && item.status === 'brief_needed') {
      warnings.push(`${item.slug}: alta prioridade e pronto para receber briefing.`);
    }
  }

  const ranked = [...queue.items].sort((a, b) => b.priority - a.priority);
  return { errors, warnings, ranked };
}

function buildMarkdown({ generatedAt, policyChecks, queueAudit }) {
  const policyLines = policyChecks.map((p) => {
    const status = p.ok ? 'OK' : 'FALHA';
    const lm = p.lastModified ? ` | Last-Modified: ${p.lastModified}` : '';
    const fp = p.fingerprint ? ` | fingerprint: ${p.fingerprint}` : '';
    return `- **${status}** — ${p.name}: ${p.status ?? 'sem status'}${lm}${fp}`;
  });

  const next = queueAudit.ranked.find((item) => ['idea', 'brief_needed', 'update_needed'].includes(item.status));

  return `# BOXE DE CRIA — Daily Blog Audit\n\n` +
    `Gerado em: ${generatedAt}\n\n` +
    `## Policy watch\n${policyLines.join('\n')}\n\n` +
    `> Mudança de fingerprint é somente um sinal para revisão humana. Não altera regras nem publica conteúdo automaticamente.\n\n` +
    `## Quality gate\n` +
    `- Erros bloqueadores: **${queueAudit.errors.length}**\n` +
    `- Alertas: **${queueAudit.warnings.length}**\n\n` +
    (queueAudit.errors.length ? `### Bloqueadores\n${queueAudit.errors.map((e) => `- ${e}`).join('\n')}\n\n` : '') +
    (queueAudit.warnings.length ? `### Alertas\n${queueAudit.warnings.map((w) => `- ${w}`).join('\n')}\n\n` : '') +
    `## Próxima prioridade editorial\n` +
    (next
      ? `- **${next.title}**\n  - slug: \`${next.slug}\`\n  - categoria: ${next.category}\n  - status: ${next.status}\n  - prioridade: ${next.priority}\n  - revisão de saúde: ${next.requiresHealthReview ? 'sim' : 'não'}\n`
      : '- Nenhum item elegível encontrado.\n') +
    `\n## Regra de publicação\n` +
    `O robô pode auditar, priorizar e preparar briefing. Conteúdo novo assistido por IA só deve ser publicado após aprovação editorial e score mínimo de 85/100.\n`;
}

async function main() {
  const rawQueue = await fs.readFile(QUEUE_PATH, 'utf8');
  const queue = JSON.parse(rawQueue);
  const queueAudit = auditQueue(queue);
  const policyChecks = await Promise.all(POLICY_SOURCES.map(checkPolicySource));

  const generatedAt = new Date().toISOString();
  const report = {
    generatedAt,
    policyChecks,
    queue: {
      errors: queueAudit.errors,
      warnings: queueAudit.warnings,
      ranked: queueAudit.ranked
    }
  };

  await fs.mkdir(REPORT_DIR, { recursive: true });
  await fs.writeFile(path.join(REPORT_DIR, 'daily-content-audit.json'), JSON.stringify(report, null, 2) + '\n');
  await fs.writeFile(path.join(REPORT_DIR, 'daily-content-audit.md'), buildMarkdown({ generatedAt, policyChecks, queueAudit }));

  console.log(buildMarkdown({ generatedAt, policyChecks, queueAudit }));

  if (queueAudit.errors.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
