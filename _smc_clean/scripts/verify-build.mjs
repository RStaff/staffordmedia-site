import fs from 'fs';
const pkg = JSON.parse(fs.readFileSync('_smc_clean/package.json','utf8'));
const build = pkg?.scripts?.build || '';
if (!/^next build\s*$/.test(build)) {
  console.error('❌ Build script must be exactly: "next build" (no folder args). Found:', build);
  process.exit(3);
}
const needDeps = ['resend','zod'];
const miss = needDeps.filter(n => !(pkg.dependencies && pkg.dependencies[n]));
if (miss.length) { console.error('❌ Missing deps in _smc_clean/package.json:', miss.join(', ')); process.exit(1); }
const needFiles = ['app/api/lead/route.ts','components/LeadForm.tsx'];
for (const f of needFiles) if (!fs.existsSync(`_smc_clean/${f}`)) { console.error('❌ Missing expected file:', f); process.exit(2); }
console.log('✓ verify-build: scripts, deps, files look good');
