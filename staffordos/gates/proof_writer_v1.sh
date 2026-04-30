#!/usr/bin/env bash
set -euo pipefail

OUT="staffordos/system_inventory/output/runtime_proof_v1.json"

mkdir -p staffordos/system_inventory/output

timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > "$OUT" <<EOF
{
  "timestamp": "$timestamp",
  "status": "RUNNING"
}
EOF

echo "Proof initialized at $OUT"
