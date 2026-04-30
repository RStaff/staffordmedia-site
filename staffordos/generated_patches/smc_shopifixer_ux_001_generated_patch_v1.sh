#!/usr/bin/env bash
set -euo pipefail

cd /tmp/smc-approved || exit 1

echo "=== GENERATED PATCH: smc_shopifixer_ux_001 ==="
echo "Objective: Improve ShopiFixer page conversion before StaffordMedia launch"
echo "Scope: UX/copy/layout only"

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
    "Most stores don’t need more traffic — they need to fix the one thing breaking conversion.\nThis audit isolates that issue in minutes.",
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
