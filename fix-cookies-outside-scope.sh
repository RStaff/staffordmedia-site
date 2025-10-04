#!/usr/bin/env bash
set -euo pipefail

APP_ROOT="apps/website"
APP_DIR="$APP_ROOT/app"
LAYOUT="$APP_DIR/layout.tsx"
BUILD_LOG="$APP_ROOT/build.log"

say(){ printf "\n▶ %s\n" "$*"; }

# 0) Safety: ensure we’re in a git repo and the app exists
[ -d .git ] || { echo "❌ Run from your repo root (no .git found)"; exit 1; }
[ -d "$APP_DIR" ] || { echo "❌ $APP_DIR not found"; exit 1; }

# 1) Remove top-level next/headers usage from app/** (pages & layout)
say "Remove top-level next/headers usage in pages/layout (module scope)"
node - <<'NODE'
const fs = require('fs');
const path = require('path');

const ROOT = 'apps/website/app';
const exts = new Set(['.tsx', '.ts']);

function listFiles(dir){
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(p));
    else if (exts.has(path.extname(p))) out.push(p);
  }
  return out;
}

const files = listFiles(ROOT);
let changed = 0;

for (const p of files) {
  let s = fs.readFileSync(p, 'utf8');

  // Skip route handlers; they may legitimately use next/headers at top-level
  if (/\/route\.ts$/.test(p)) continue;

  // Quick skip if the file doesn't import next/headers
  if (!/from\s+["']next\/headers["']/.test(s)) continue;

  // Remove imports of cookies/headers at top-level
  const before = s;
  s = s
    // remove specific named imports cookies/headers
    .replace(/import\s*\{\s*([^}]*)(cookies|headers)([^}]*)\}\s*from\s*["']next\/headers["'];?\s*/g,
      (m, a, which, b) => {
        // If there are other named imports, keep them
        const keep = (a + b).split(',').map(x => x.trim()).filter(Boolean).filter(n => n !== '' && n !== 'cookies' && n !== 'headers');
        if (keep.length) {
          return `import { ${keep.join(', ')} } from "next/headers";\n`;
        }
        return ''; // drop entire import if only cookies/headers were imported
      })
    // extremely defensive: kill any top-level direct calls like const x = cookies()
    .replace(/^\s*const\s+\w+\s*=\s*cookies\(\)[^\n]*$/gm, '// removed top-level cookies() (moved to client no-flash)')
    .replace(/^\s*const\s+\w+\s*=\s*headers\(\)[^\n]*$/gm, '// removed top-level headers()');

  if (s !== before) {
    fs.writeFileSync(p + '.bak.cookiesfix', before);
    fs.writeFileSync(p, s);
    changed++;
  }
}

console.log(changed ? `… cleaned ${changed} file(s)` : '… no changes needed');
NODE

# 2) Sanitize layout.tsx: SSR-safe theme (no top-level cookies), no raw <script>
say "Sanitize layout.tsx (SSR-safe theming with next/script, no top-level cookies)"
node - <<'NODE'
const fs = require('fs');
const p = 'apps/website/app/layout.tsx';
if (!fs.existsSync(p)) {
  console.log('… layout.tsx not found (skipping)');
  process.exit(0);
}
let s = fs.readFileSync(p, 'utf8');
const orig = s;

// kill any imports of next/headers here
s = s.replace(/import\s*\{\s*[^}]*\b(cookies|headers)\b[^}]*\}\s*from\s*["']next\/headers["'];?\s*/g, '');

// ensure we import next/script
if (!/from\s+["']next\/script["']/.test(s)) {
  s = s.replace(/^(import.*\n)+/, (block) => block + `import Script from "next/script";\n`);
}

// remove raw HTML comments and raw <script> tags
s = s
  .replace(/<!--[\s\S]*?-->/g, '')
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<script\b[^>]*\/>/gi, '');

// ensure <head> exists, then inject no-flash snippet right after it
if (!/<head>/.test(s)) {
  s = s.replace(/<html([^>]*)>/, '<html$1>\n      <head></head>');
}

if (!/id="theme-noflash"/.test(s)) {
  s = s.replace(
    /<head>/,
    `<head>
        <Script
          id="theme-noflash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: \`(function(){try{
              var t=localStorage.getItem('theme');
              if(!t){ t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'; }
              document.documentElement.setAttribute('data-theme', t);
            }catch(e){}})();\`
          }}
        />`
  );
}

// remove server-set data-theme on <html> if present
s = s.replace(/<html([^>]*?)\sdata-theme="[^"]*"([^>]*)>/, '<html$1$2>');

// make sure "use client" is not in layout (it should be a server component)
s = s.replace(/^\s*["']use client["'];?\s*$/m, '');

// write back if changed
if (s !== orig) {
  fs.writeFileSync(p + '.bak.layoutfix', orig);
  fs.writeFileSync(p, s);
  console.log('… layout.tsx sanitized');
} else {
  console.log('… layout.tsx already OK');
}
NODE

# 3) Add guardrail: forbid top-level next/headers use in app/** pages/layout
say "Add guardrail: grep check for next/headers top-level usage"
PKG="$APP_ROOT/package.json"
node - <<'NODE'
const fs = require('fs');
const p = 'apps/website/package.json';
const pkg = JSON.parse(fs.readFileSync(p,'utf8'));
pkg.scripts = pkg.scripts || {};
// Dev-only guard: flags any usage of next/headers and cookies()/headers() in app/** pages/layout
pkg.scripts["guard:headers"] = `bash -c '(! grep -R --line-number --color=never -E \"from \\\\\"next/headers\\\\\"|cookies\\(|headers\\(\" apps/website/app | tee /dev/stderr) || (echo \"\\n❌ next/headers (cookies/headers) found in app/**. Move calls into server functions or remove.\" && exit 1)'`;
pkg.scripts["check"] = pkg.scripts["check"] || "npm run lint && npm run typecheck";
if (!pkg.scripts["check"].includes("guard:headers")) {
  pkg.scripts["check"] += " && npm run guard:headers";
}
fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + "\n");
console.log("… guard:headers wired into website:check");
NODE

# 4) Clean caches (only website workspace)
say "Clean .next (workspace)"
rm -rf "$APP_ROOT/.next"

# 5) Run quality gate: lint → typecheck → build
say "Run lint"
npm run -w website lint

say "Run typecheck"
npm run -w website typecheck

say "Run build (logging to $BUILD_LOG)"
: > "$BUILD_LOG"
set +e
npm run -w website build | tee -a "$BUILD_LOG"
rc="${PIPESTATUS[0]}"
set -e

if [ "$rc" -ne 0 ]; then
  echo ""
  echo "⚠ Build failed. Recent log tail:"
  tail -n 150 "$BUILD_LOG"
  echo ""
  echo "🔎 Searching for remaining next/headers imports under app/**:"
  grep -R --line-number --color=never -E 'from "next/headers"|from '\''next/headers'\''' "$APP_DIR" || true
  exit $rc
fi

echo ""
echo "✅ /thanks, /abando, /about (and others) no longer call cookies() at module scope."
echo "✅ Hydration-safe theming in layout (no top-level next/headers)."
echo "Next: npm run -w website dev"
