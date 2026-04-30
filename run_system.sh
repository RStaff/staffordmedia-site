#!/usr/bin/env bash
set -e

echo "=== SYSTEM RUN V2 (ENFORCED) ==="

# 1. Preconditions
./staffordos/gates/pre_patch_required_v1.sh

# 2. Runtime
./staffordos/gates/runtime_sync_gate_v1.sh

# 3. Start proof tracking
./staffordos/gates/proof_writer_v1.sh

# 4. Start server
PORT=3010 npm run dev &
sleep 5

# 5. Validate money path (WRITES PROOF)
./staffordos/gates/money_path_gate_v2.sh

# 6. Enforce proof (BLOCKS IF BAD)
./staffordos/gates/proof_enforcement_gate_v1.sh

# 7. Brand integrity
./staffordos/gates/brand_integrity_gate_v1.sh

echo ""
echo "✅ SYSTEM FULLY VERIFIED — SAFE TO WORK"
