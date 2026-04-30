#!/usr/bin/env bash
set -euo pipefail

echo "=== RUNTIME SYNC GATE V1 — HARD RESET ==="

echo ""
echo "1) Path / branch"
pwd
git branch --show-current

echo ""
echo "2) Stop local dev server ports"
kill -9 $(lsof -t -i:3010) 2>/dev/null || true

echo ""
echo "3) Remove corrupted runtime/build caches"
rm -rf .next
rm -rf node_modules/.cache
rm -f .eslintcache

echo ""
echo "4) Reinstall optional native deps"
npm install --include=optional

echo ""
echo "5) Verify build from clean cache"
rm -rf .next
npm run build

echo ""
echo "=== RUNTIME SYNC PASS ==="
