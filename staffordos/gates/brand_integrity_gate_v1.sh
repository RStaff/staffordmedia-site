#!/usr/bin/env bash
set -euo pipefail

echo "=== BRAND INTEGRITY GATE V1 ==="

fail=0

# Only block corrupted/malformed brand strings.
bad_patterns=(
  "Shopi2"
  "Shopi Fixer"
  "Shopi.Fixer"
  "Shopifixer "
  "StaffordMedia Consulting"
  "Stafford Media.ai"
  "Abandoo"
  "Abando AI"
)

for pattern in "${bad_patterns[@]}"; do
  if grep -RIn "$pattern" src/app src/components >/tmp/brand_bad.txt 2>/dev/null; then
    echo "❌ Brand violation: $pattern"
    cat /tmp/brand_bad.txt
    fail=1
  fi
done

# Required canonical brand terms must still exist.
required_patterns=(
  "ShopiFixer"
  "Stafford Media Consulting"
  "Abando"
)

for pattern in "${required_patterns[@]}"; do
  if ! grep -RIn "$pattern" src/app src/components >/dev/null 2>&1; then
    echo "❌ Missing required brand term: $pattern"
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  echo "❌ BRAND INTEGRITY FAILED"
  exit 1
fi

echo "✅ BRAND INTEGRITY PASS"
