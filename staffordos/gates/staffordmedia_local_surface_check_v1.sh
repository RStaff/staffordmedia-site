#!/usr/bin/env bash
set -euo pipefail

BASE="${1:-http://localhost:3010}"

echo "=== STAFFORDMEDIA LOCAL SURFACE CHECK ==="
echo "BASE=$BASE"

for path in "/" "/shopifixer" "/audit-result" "/pricing" "/shopifixer/result" "/services" "/about" "/contact"; do
  code=$(curl -s -o /tmp/smc_surface_check.html -w "%{http_code}" "$BASE$path" || true)
  echo "$code $path"
done
