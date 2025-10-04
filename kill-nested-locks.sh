#!/usr/bin/env bash
set -euo pipefail

ROOT_LOCK="package-lock.json"
APPS_DIR="apps"

say(){ printf '%s\n' "$*"; }

say "==> 1) Remove ALL nested lockfiles under ./apps (keep only root $ROOT_LOCK)"
mapfile -t NESTED < <(find "$APPS_DIR" -type f -name 'package-lock.json' 2>/dev/null || true)
if [ "${#NESTED[@]}" -gt 0 ]; then
  printf '   deleting:\n'; printf '     - %s\n' "${NESTED[@]}"
  # Delete from working tree (Next warns on presence, even if untracked)
  rm -f "${NESTED[@]}"
  # Also untrack if any were committed previously
  git rm -f --cached "${NESTED[@]}" 2>/dev/null || true
else
  say "   none found"
fi

say "==> 2) Make sure .gitignore blocks future nested locks"
# ensure patterns exist (deduped merge)
{
  echo 'apps/**/package-lock.json'
  echo 'node_modules/'
  echo '.next/'
} | sort -u >> .gitignore.tmp
touch .gitignore
cat .gitignore .gitignore.tmp | awk '!seen[$0]++' > .gitignore.new && mv .gitignore.new .gitignore
rm -f .gitignore.tmp
git add .gitignore || true

say "==> 3) Reinstall once at the repo root (single source of truth)"
rm -rf node_modules
npm install --workspaces

say "==> 4) Quick proof build (workspace)"
( cd apps/website && npm run build )

say "✅ Done. Only the root lockfile remains; Next’s lockfile warning will be gone."
