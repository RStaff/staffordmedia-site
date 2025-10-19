#!/usr/bin/env bash
set -euo pipefail
cd "$(git rev-parse --show-toplevel)/_smc_clean/public"
need=( "logos/abando.png" "logos/smc.png" )
miss=0
for p in "${need[@]}"; do
  if [[ ! -f "$p" ]]; then echo "❌ missing public/$p"; miss=1; else echo "✅ $p"; fi
done
exit $miss
