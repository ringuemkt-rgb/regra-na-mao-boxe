import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('unity/com.boxedecria.scout');
const required = [
  'package.json',
  'Runtime/Models/ScoutDtos.cs',
  'Runtime/Networking/ScoutApiClient.cs',
  'Runtime/Services/EvidenceGate.cs',
  'Runtime/Services/FaceOffEngine.cs',
  'Runtime/UI/ScoutHud.uxml',
  'Runtime/UI/ScoutHud.uss',
  'Runtime/UI/ScoutHudController.cs',
  'Editor/ScoutInstaller.cs',
  'Tests/Editor/ScoutIntegrityTests.cs',
];

const errors = [];
for (const file of required) if (!fs.existsSync(path.join(root, file))) errors.push(`missing ${file}`);

const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (manifest.name !== 'com.boxedecria.scout') errors.push('unexpected package name');
if (!String(manifest.unity || '').startsWith('6000.')) errors.push('Unity 6 baseline is not explicit');

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else files.push(full);
  }
}
walk(root);
const source = files.filter(f => /\.(cs|uxml|uss|json)$/i.test(f)).map(f => fs.readFileSync(f, 'utf8')).join('\n');
const lower = source.toLowerCase();
for (const forbidden of [
  'supabase_service_role_key',
  'service_role_key',
  'service-role-key',
  'service_role=',
  'projecao_vitoria',
  'win_probability',
]) {
  if (lower.includes(forbidden)) errors.push(`forbidden client token: ${forbidden}`);
}

const api = fs.readFileSync(path.join(root, 'Runtime/Networking/ScoutApiClient.cs'), 'utf8');
if (!api.includes('status=eq.approved')) errors.push('API client must query only approved dossiers');
if (!api.includes('select=status,payload')) errors.push('API client must preserve database approval status');

const face = fs.readFileSync(path.join(root, 'Runtime/Services/FaceOffEngine.cs'), 'utf8');
if (!face.includes('modalidades diferentes')) errors.push('cross-sport Face-Off guard missing');
if (!face.includes('unit')) errors.push('metric compatibility guard missing');

if (errors.length) {
  console.error('SCOUT Unity audit FAILED');
  errors.forEach(e => console.error('- ' + e));
  process.exit(1);
}
console.log(`SCOUT Unity audit OK · ${files.length} package files checked`);
