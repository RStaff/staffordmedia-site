#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
ROOT_LOCK="package-lock.json"

say(){ printf '%s\n' "$*"; }

say "==> 1) Remove nested lockfiles so Next picks the real workspace root"
mapfile -t NESTED < <(find "$APP" -type f -name 'package-lock.json' 2>/dev/null || true)
if [ "${#NESTED[@]}" -gt 0 ]; then
  printf '   removing nested lockfiles:\n'; printf '     - %s\n' "${NESTED[@]}"
  git rm -f "${NESTED[@]}" 2>/dev/null || true
else
  say "   none found"
fi

say "==> 2) Make sure *only* the root has workspaces + lockfile"
node - <<'NODE'
const fs = require('fs');
const f = 'package.json';
const pkg = JSON.parse(fs.readFileSync(f, 'utf8'));
pkg.private = true;
pkg.workspaces = Array.isArray(pkg.workspaces) && pkg.workspaces.length ? pkg.workspaces : ["apps/*"];
fs.writeFileSync(f, JSON.stringify(pkg, null, 2) + "\n");
NODE
git add package.json

say "==> 3) Git ignore nested lockfiles, node_modules, and .next (defense-in-depth)"
# Keep the single root lockfile; block nested ones from being re-added
{
  echo 'node_modules/'
  echo '.next/'
  echo 'apps/**/package-lock.json'
} | sort -u >> .gitignore.tmp

# Merge deduped into .gitignore
touch .gitignore
cat .gitignore .gitignore.tmp | awk '!seen[$0]++' > .gitignore.new && mv .gitignore.new .gitignore
rm -f .gitignore.tmp
git add .gitignore

say "==> 4) Clean local installs to avoid confused roots"
rm -rf node_modules "$APP/node_modules"

say "==> 5) Install ONCE at repo root (creates/updates the single root lockfile)"
npm install --workspaces

say "==> 6) (Optional) Silence the Next warning by pinning outputFileTracingRoot"
NEXT_CFG_JS="$APP/next.config.js"
if [ ! -f "$NEXT_CFG_JS" ] && [ ! -f "$APP/next.config.mjs" ] && [ ! -f "$APP/next.config.ts" ]; then
  cat > "$NEXT_CFG_JS" <<'JS'
const path = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Next that the monorepo root is two levels up from apps/website
  outputFileTracingRoot: path.join(__dirname, "../.."),
};
module.exports = nextConfig;
JS
  git add "$NEXT_CFG_JS"
fi

say "==> 7) Commit the cleanup"
git commit -m "build: single root lockfile; ignore nested locks; pin outputFileTracingRoot" || true

say "==> 8) Quick proof build (workspace)"
( cd "$APP" && npm run build )

say "✅ Workspace root is clean and Next lockfile warning is resolved."
say "   If you use CI, push now: git push --force-with-lease origin \$(git rev-parse --abbrev-ref HEAD)"
