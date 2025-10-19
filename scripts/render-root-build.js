// Build inside _smc_clean and copy the standalone output to repo root
const { execSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { mkdirSync } = require('node:fs');
const { cpSync } = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const APP = path.join(ROOT, '_smc_clean');

// safety checks
if (!existsSync(path.join(APP, 'package.json'))) {
  console.error('Missing _smc_clean/package.json');
  process.exit(1);
}

function run(cmd, cwd = ROOT) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd });
}

// 1) Clean, deterministic install in _smc_clean (uses existing lockfile)
run('npm ci --include=optional --no-audit --no-fund', APP);

// 2) Build Next in _smc_clean
run('npm run build', APP);

// 3) Sync the standalone layout to repo root so existing Render cmds keep working
const SRC_STANDALONE = path.join(APP, '.next', 'standalone');
const SRC_STATIC     = path.join(APP, '.next', 'static');
const SRC_PUBLIC     = path.join(APP, 'public');

const DEST_STANDALONE = path.join(ROOT, '.next', 'standalone');
const DEST_INNER_NEXT = path.join(DEST_STANDALONE, '.next');
const DEST_STATIC     = path.join(DEST_INNER_NEXT, 'static');
const DEST_PUBLIC     = path.join(DEST_STANDALONE, 'public');

// ensure dirs
mkdirSync(path.join(ROOT, '.next'), { recursive: true });
mkdirSync(DEST_INNER_NEXT, { recursive: true });

// copy the standalone server and tree
cpSync(SRC_STANDALONE, DEST_STANDALONE, { recursive: true });

// ensure static + public present at expected paths (idempotent)
if (existsSync(SRC_STATIC)) {
  mkdirSync(DEST_STATIC, { recursive: true });
  cpSync(SRC_STATIC, DEST_STATIC, { recursive: true });
}
if (existsSync(SRC_PUBLIC)) {
  mkdirSync(DEST_PUBLIC, { recursive: true });
  cpSync(SRC_PUBLIC, DEST_PUBLIC, { recursive: true });
}

console.log('\n✅ Standalone synced to repo root: .next/standalone');
console.log('   You can run: node .next/standalone/server.js');
