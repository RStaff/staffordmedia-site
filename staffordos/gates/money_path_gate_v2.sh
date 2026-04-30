#!/usr/bin/env bash
set -euo pipefail

OUT="staffordos/system_inventory/output/runtime_proof_v1.json"

echo "=== MONEY PATH GATE V2 ==="

routes=(
  "/"
  "/shopifixer"
  "/audit-result"
  "/pricing"
  "/shopifixer/result"
)

fail=0
results=""

for route in "${routes[@]}"
do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3010$route)
  echo "$route -> $code"

  results="$results
    {\"route\":\"$route\",\"status\":$code},"

  if [ "$code" != "200" ]; then
    fail=1
  fi
done

if [ "$fail" -ne 0 ]; then
  status="FAIL"
else
  status="PASS"
fi

# Write proof
cat > "$OUT" <<EOF
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "money_path": "$status",
  "routes": [
    ${results%,}
  ]
}
EOF

if [ "$fail" -ne 0 ]; then
  echo "❌ MONEY PATH FAILED"
  exit 1
fi

echo "✅ MONEY PATH PASS (RECORDED)"
