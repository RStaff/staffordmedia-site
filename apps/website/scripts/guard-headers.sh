#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
<<<<<<< HEAD
[ -d app ] || { echo "✓ guard:headers passed (no app/ dir)"; exit 0; }
PATTERN='^[[:space:]]*import[[:space:]]+\{?[[:space:]]*(cookies|headers)[[:space:]]*\}?[[:space:]]+from[[:space:]]+"next/headers"[[:space:]]*;?$'
if grep -R --line-number -E "$PATTERN" app --include='*.ts' --include='*.tsx' --exclude-dir=.next --exclude-dir=node_modules >/dev/null; then
  echo "❌ Guard failed: do NOT import cookies()/headers() from 'next/headers' at module scope in app/**."
  echo "   Move access into a server function or remove it."
=======

[ -d app ] || { echo "✓ guard:headers passed (no app/ dir)"; exit 0; }

PATTERN='^[[:space:]]*import[[:space:]]+\{?[[:space:]]*(cookies|headers)[[:space:]]*\}?[[:space:]]+from[[:space:]]+"next/headers"[[:space:]]*;?$'
if grep -R --line-number -E "$PATTERN" app --include='*.ts' --include='*.tsx' --exclude-dir=.next --exclude-dir=node_modules >/dev/null; then
  echo "❌ Guard failed: do NOT import cookies()/headers() from 'next/headers' at module scope in app/**."
  echo "   Move cookie/header access *inside* a server function (route handler/server action) or remove it."
>>>>>>> 7a98f0c (chore(ci): finalize guardrails + husky modernization)
  exit 1
fi
echo "✓ guard:headers passed"
