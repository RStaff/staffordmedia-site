#!/usr/bin/env bash
set -euo pipefail

echo "=== REQUIRED PRE-PATCH GATE ==="

node staffordos/gates/staffordmedia_gate_runner_v1.mjs

echo ""
echo "=== BUILD VERIFY ==="
npm run build

echo ""
echo "=== GIT STATUS ==="
git status --short
