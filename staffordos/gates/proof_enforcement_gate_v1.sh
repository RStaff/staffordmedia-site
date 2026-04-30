#!/usr/bin/env bash
set -euo pipefail

FILE="staffordos/system_inventory/output/runtime_proof_v1.json"

echo "=== PROOF ENFORCEMENT GATE ==="

if [ ! -f "$FILE" ]; then
  echo "❌ NO PROOF FILE FOUND"
  exit 1
fi

status=$(grep -o '"money_path": *"[^"]*"' "$FILE" | cut -d'"' -f4)

echo "Money path status: $status"

if [ "$status" != "PASS" ]; then
  echo "❌ BLOCKED — MONEY PATH NOT VERIFIED"
  exit 1
fi

echo "✅ PROOF VALID — CONTINUE"
