const { existsSync, mkdirSync, cpSync } = require('node:fs');
const { join } = require('node:path');

const ROOT = process.cwd();
const SRC_STANDALONE = join(ROOT, '.next', 'standalone');
const SRC_STATIC     = join(ROOT, '.next', 'static');
const SRC_PUBLIC     = join(ROOT, 'public');

const DEST_STANDALONE = SRC_STANDALONE;
const DEST_INNER_NEXT = join(DEST_STANDALONE, '.next');

function log(msg){ console.log(`[postbuild] ${msg}`); }
function die(msg){ console.error(`[postbuild] ${msg}`); process.exit(1); }

if (!existsSync(SRC_STANDALONE)) die('Build succeeded but .next/standalone is missing (check next.config.js output=standalone).');

mkdirSync(DEST_INNER_NEXT, { recursive: true });

if (existsSync(SRC_STATIC)) {
  cpSync(SRC_STATIC, join(DEST_INNER_NEXT, 'static'), { recursive: true });
  log('Copied .next/static → .next/standalone/.next/static');
} else {
  log('No .next/static (ok)');
}

if (existsSync(SRC_PUBLIC)) {
  cpSync(SRC_PUBLIC, join(DEST_STANDALONE, 'public'), { recursive: true });
  log('Copied public → .next/standalone/public');
} else {
  log('No public/ dir (ok)');
}

log('Standalone postbuild copy complete.');
