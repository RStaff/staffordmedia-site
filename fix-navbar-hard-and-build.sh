#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
NAV="$APP/app/components/Navbar.tsx"
BUILD_LOG="$APP/build.log"

say(){ printf "\n▶ %s\n" "$*"; }
die(){ printf "\n❌ %s\n" "$*"; exit 1; }

[ -f "$NAV" ] || die "Navbar not found at $NAV"

say "Sanitize Navbar.tsx: collapse all directive variants → single 'use client' at file top"
node - <<'NODE'
const fs = require('fs');
const p = 'apps/website/app/components/Navbar.tsx';
let s = fs.readFileSync(p,'utf8');

// 1) Remove ANY line that is some form of the directive (with or without parens/semicolon)
const directiveLine = /^\s*\(?['"]use client['"]\)?;?\s*$/gm;
s = s.replace(directiveLine, '');

// 2) Also remove inline fragments like ;("use client"); that may appear on same line
s = s.replace(/\;?\s*\(\s*['"]use client['"]\s*\)\s*;?/g, '');

// 3) Ensure the file starts with exactly one directive
s = `"use client";\n` + s.trimStart();

// 4) Ensure a single SMCMark import, remove duplicates
s = s.replace(/^\s*import\s+\{\s*SMCMark\s*\}\s+from\s+"\.\/Brand";\s*$/gm, '');
if (!/import\s+\{\s*SMCMark\s*\}\s+from\s+"\.\/Brand";/.test(s)) {
  s = s.replace(/("use client";\s*)/, `$1import { SMCMark } from "./Brand";\n`);
}

// 5) Normalize ThemeToggle import location (keep once)
s = s.replace(/^\s*import\s+\{\s*ThemeToggle\s*\}\s+from\s+"\.\/ThemeToggle";\s*$/gm, '');
s = s.replace(/("use client";\s*(?:import[^\n]*\n)*)/, `$1import { ThemeToggle } from "./ThemeToggle";\n`);

// 6) Replace any <SMCMark size={...}/> with class-based sizing
s = s.replace(/<SMCMark\s+size=\{[^}]+\}\s*\/>/g, '<SMCMark className="h-5 w-5" />');
// …and give default sizing if none provided
s = s.replace(/<SMCMark\s*\/>/g, '<SMCMark className="h-5 w-5" />');

// 7) Keep Link/usePathname imports intact, do not reorder further to avoid churn

fs.writeFileSync(p, s);
console.log('… Navbar.tsx sanitized');
NODE

say "Clean website build artifacts"
rm -rf "$APP/.next"

say "Run lint"
npm run -w website lint

say "Run typecheck"
npm run -w website typecheck

say "Run build (logs → $BUILD_LOG)"
: > "$BUILD_LOG"
set +e
npm run -w website build | tee -a "$BUILD_LOG"
rc=${PIPESTATUS[0]}
set -e

if [ "$rc" -ne 0 ]; then
  echo ""
  echo "⚠ Build failed. Last 120 lines:"
  tail -n 120 "$BUILD_LOG"
  exit $rc
fi

echo ""
echo "✅ Navbar fixed and build passed."
echo "Next: npm run -w website dev"
