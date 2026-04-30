import { NextResponse } from "next/server";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const dynamic = "force-dynamic";

export async function POST() {
  const root = process.cwd();
  const packetDir = join(root, "staffordos", "work_packets");
  const outDir = join(root, "staffordos", "generated_patches");

  if (!existsSync(packetDir)) {
    return NextResponse.json({ ok: false, error: "no_work_packets" }, { status: 400 });
  }

  const packetFile = readdirSync(packetDir).find((f) => f.endsWith(".json"));
  if (!packetFile) {
    return NextResponse.json({ ok: false, error: "no_active_packet" }, { status: 400 });
  }

  const packet = JSON.parse(readFileSync(join(packetDir, packetFile), "utf8"));

  const execution_plan = {
    type: "code_patch",
    target_files: packet.owner_files,
    objective: packet.objective,
    actions: [
      "tighten CTA dominance",
      "reduce repeated explanatory copy",
      "reduce scroll friction before audit form",
      "preserve ShopiFixer / Stafford Media / Abando product boundaries"
    ],
    forbidden_areas: packet.blocked_areas,
    required_after_patch: [
      "./run_system.sh",
      "visual review of /shopifixer",
      "commit only owner files and proof artifacts"
    ]
  };

  mkdirSync(outDir, { recursive: true });

  const patchScript = `#!/usr/bin/env bash
set -euo pipefail

cd /tmp/smc-approved || exit 1

echo "=== GENERATED PATCH: ${packet.work_id} ==="
echo "Objective: ${packet.objective}"
echo "Scope: ${packet.scope}"

python3 <<'PY'
from pathlib import Path

# Owner files only
page = Path("src/app/shopifixer/page.tsx")
hero = Path("src/components/shopifixer/AuditHero.tsx")

if not page.exists():
    raise SystemExit("Missing owner file: src/app/shopifixer/page.tsx")
if not hero.exists():
    raise SystemExit("Missing owner file: src/components/shopifixer/AuditHero.tsx")

page_text = page.read_text()
hero_text = hero.read_text()

# Tighten repeated explanatory language without broad token replacement.
page_text = page_text.replace(
    "First, we identify the highest-impact conversion issue. Then you decide whether Stafford Media fixes it for you.",
    "Get the clearest issue first. Then decide whether Stafford Media fixes it with you."
)

page_text = page_text.replace(
    "How the ShopiFixer path works.",
    "From audit to first fix."
)

page_text = page_text.replace(
    "Abando comes later if recovery automation makes sense after the first fix is clear.",
    "Abando comes later, once the first fix is clear."
)

# Make CTA language consistent.
page_text = page_text.replace(
    "Run ShopiFixer Audit",
    "Find My Revenue Leak"
)

hero_text = hero_text.replace(
    "Most stores don’t need more traffic — they need to fix the one thing breaking conversion.\\nThis audit isolates that issue in minutes.",
    "Most stores don’t need more traffic first. They need to know what is breaking conversion."
)

hero_text = hero_text.replace(
    "ShopiFixer reviews your storefront, identifies the strongest conversion issue first, shows the evidence behind the read, and gives you the first fix worth testing.",
    "ShopiFixer identifies the strongest conversion issue, shows the evidence, and gives you the first fix worth testing."
)

page.write_text(page_text)
hero.write_text(hero_text)

print("✅ Generated patch applied to owner files only")
PY

echo ""
echo "=== VERIFY OWNER FILE DIFF ==="
git diff -- src/app/shopifixer/page.tsx src/components/shopifixer/AuditHero.tsx

echo ""
echo "=== RUN ENFORCED SYSTEM ==="
./run_system.sh
`;

  const scriptPath = join(outDir, `${packet.work_id}_generated_patch_v1.sh`);
  writeFileSync(scriptPath, patchScript);
  writeFileSync(join(outDir, "execution_plan_v1.json"), JSON.stringify({
    generated_at: new Date().toISOString(),
    work_id: packet.work_id,
    execution_plan,
    patch_script: scriptPath
  }, null, 2) + "\n");

  return NextResponse.json({
    ok: true,
    work_id: packet.work_id,
    execution_plan,
    patch_script: scriptPath
  });
}
