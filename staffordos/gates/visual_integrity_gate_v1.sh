#!/usr/bin/env bash
set -euo pipefail

echo "=== VISUAL INTEGRITY GATE V1 ==="

node staffordos/utils/visual_validate_shopifixer.mjs

echo "✅ VISUAL INTEGRITY PASS"
