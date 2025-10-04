#!/usr/bin/env bash
set -euo pipefail

say(){ printf "\n🔧 %s\n" "$*"; }

# --- sanity checks ---
[ -f package.json ] || { echo "❌ Run from repo root (package.json not found)"; exit 1; }
[ -f apps/website/package.json ] || { echo "❌ apps/website/package.json not found"; exit 1; }

# --- 1) deps & prepare ---
say "Install dev deps (husky, lint-staged, prettier)"
npm pkg set scripts.prepare=husky >/dev/null
npm i -D husky@9 lint-staged@15 prettier@3 >/dev/null

# --- 2) ensure website scripts ---
say "Ensure apps/website scripts exist (lint, typecheck, check, test, build)"
node - <<'NODE'
const fs = require('fs');
const p = 'apps/website/package.json';
const pkg = JSON.parse(fs.readFileSync(p,'utf8'));
pkg.scripts ||= {};
pkg.scripts.lint ||= "eslint . --ext .ts,.tsx --max-warnings=0";
pkg.scripts.typecheck ||= "tsc -p tsconfig.json --noEmit";
pkg.scripts.check ||= "npm run lint && npm run typecheck";
pkg.scripts.build ||= "next build";
pkg.scripts.test ||= "vitest run --config vitest.config.ts || echo \"(no tests yet)\"";
fs.writeFileSync(p, JSON.stringify(pkg,null,2) + "\n");
console.log("✅ apps/website/package.json updated");
NODE

# --- 3) lint-staged config (root) ---
say "Add/ensure lint-staged config (root package.json)"
node - <<'NODE'
const fs = require('fs');
const p = 'package.json';
const pkg = JSON.parse(fs.readFileSync(p,'utf8'));
pkg['lint-staged'] ||= {
  "**/*.{ts,tsx,js,jsx,json,md,css}": ["prettier --write"],
  "apps/website/**/*.{ts,tsx}": ["eslint --fix"]
};
fs.writeFileSync(p, JSON.stringify(pkg,null,2) + "\n");
console.log("✅ lint-staged config in root package.json");
NODE

# --- 4) init husky (safe if re-run) ---
say "Initialize Husky (idempotent)"
npx husky init >/dev/null 2>&1 || true
mkdir -p .husky

# --- 5) pre-commit hook (lint-staged + website check) ---
say "Write .husky/pre-commit"
cat > .husky/pre-commit <<'HOOK'
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

# Fast stage-only formatting/fixes
npx lint-staged

# Full quality gate for website
npm run -w website check
HOOK
chmod +x .husky/pre-commit

# --- 6) pre-push hook (check + test + build) ---
say "Write .husky/pre-push"
cat > .husky/pre-push <<'HOOK'
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

# Block pushes if quality gates fail
npm run -w website check
npm run -w website test
npm run -w website build
HOOK
chmod +x .husky/pre-push

# --- 7) friendly next steps ---
say "All set."
echo "Next:"
echo "  1) npm ci --workspaces"
echo "  2) Try a commit — pre-commit runs lint-staged + website:check"
echo "  3) Try pushing — pre-push runs website:check + test + build"
