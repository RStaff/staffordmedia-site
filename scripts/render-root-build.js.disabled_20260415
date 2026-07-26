const { execSync } = require('node:child_process');
const { existsSync, mkdirSync, cpSync } = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const APP = path.join(ROOT, '_smc_clean');

function run(cmd, cwd = APP) {
  console.log(`\n$ (in ${cwd.replace(ROOT,'./')}) ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

if (!existsSync(path.join(APP, 'package.json'))) {
  console.error('❌ Missing _smc_clean/package.json');
  process.exit(1);
}

run('npm ci --include=optional --no-audit --no-fund');   // install in _smc_clean
run('npm run build');                                    // next build in _smc_clean

// Copy standalone layout to repo root so start command is stable
const SRC_STANDALONE = path.join(APP, '.next', 'standalone');
const SRC_STATIC     = path.join(APP, '.next', 'static');
const SRC_PUBLIC     = path.join(APP, 'public');

const DEST_STANDALONE = path.join(ROOT, '.next', 'standalone');
const DEST_INNER_NEXT = path.join(DEST_STANDALONE, '.next');

if (!existsSync(SRC_STANDALONE)) {
  console.error('❌ Build completed but .next/standalone not found');
  process.exit(2);
}

mkdirSync(path.join(ROOT, '.next'), { recursive: true });
mkdirSync(DEST_INNER_NEXT, { recursive: true });

cpSync(SRC_STANDALONE, DEST_STANDALONE, { recursive: true });
if (existsSync(SRC_STATIC)) {
  cpSync(SRC_STATIC, path.join(DEST_INNER_NEXT, 'static'), { recursive: true });
}
if (existsSync(SRC_PUBLIC)) {
  cpSync(SRC_PUBLIC, path.join(DEST_STANDALONE, 'public'), { recursive: true });
}

console.log('\n✅ Built in _smc_clean and synced .next/standalone to repo root.');
