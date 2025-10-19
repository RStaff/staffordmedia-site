import fs from 'fs';
import path from 'path';

const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(),'package.json'),'utf8'));
const need = ['resend','zod'];
const missing = need.filter(n => !(pkg.dependencies && pkg.dependencies[n]));
if (missing.length) {
  console.error('❌ Missing required deps in _smc_clean/package.json:', missing.join(', '));
  process.exit(1);
}
const must = ['app/api/lead/route.ts', 'components/LeadForm.tsx'];
for (const rel of must) {
  const p = path.join(process.cwd(), rel);
  if (!fs.existsSync(p)) {
    console.error('❌ Expected file missing in _smc_clean:', rel);
    process.exit(2);
  }
}
console.log('✓ verify-build: deps & files look good');
