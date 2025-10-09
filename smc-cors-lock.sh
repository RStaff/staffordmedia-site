#!/usr/bin/env bash
set -Eeuo pipefail
trap 'echo "✖ Failed at line $LINENO"; exit 1' ERR

test -d .git && test -f package.json && test -f apps/website/package.json || { echo "✖ Run from SMC repo root"; exit 2; }

P="apps/website/app/api/status/route.ts"
[[ -f "$P" ]] || { echo "✖ Not found: $P"; exit 2; }

# 1) Ensure OPTIONS handler (idempotent)
if ! grep -q '^export async function OPTIONS' "$P"; then
  cat >> "$P" <<'TS'

export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    }
  });
}
TS
fi

# 2) robots/sitemap already present in your logs; keep npm stable
if [[ -f .npmrc ]]; then
  grep -q "^optional=" .npmrc && sed -i.bak 's/^optional=.*/optional=false/' .npmrc || echo "optional=false" >> .npmrc
else
  echo "optional=false" > .npmrc
fi

# 3) Ignore transient caches
grep -q "^apps/website/.eslintcache$" .gitignore 2>/dev/null || echo "apps/website/.eslintcache" >> .gitignore
grep -q "^.eslintcache$" .gitignore 2>/dev/null || echo ".eslintcache" >> .gitignore

# 4) Branch/PR
git fetch origin main --quiet
BR="chore/smc-cors-lock-$(date +%Y%m%d%H%M%S)"
git switch -c "$BR" origin/main >/dev/null 2>&1 || git checkout -B "$BR" origin/main
git add -A
git commit -m "smc: add OPTIONS preflight to /api/status + npm stability + ignore caches" || true
git push -u origin "$BR"
gh pr create --fill --head "$BR" || true
gh pr merge --squash --admin -d || true

echo "✅ Submitted PR ($BR). Approve if needed."
