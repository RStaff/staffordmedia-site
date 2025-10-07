#!/usr/bin/env bash
set -euo pipefail

unset HISTTIMEFORMAT || true
export FORCE_COLOR=1

APP="apps/website"
NAV="$APP/app/components/Navbar.tsx"
BUILD_LOG="$APP/build.log"

say(){ printf "\n▶ %s\n" "$*"; }
die(){ printf "\n❌ %s\n" "$*"; exit 1; }

[ -f "$NAV" ] || die "Navbar not found at $NAV"

say "Normalize Navbar.tsx ('use client' once at very top, imports tidy)"
node - <<'NODE'
const fs = require('fs');
const p = 'apps/website/app/components/Navbar.tsx';
let s = fs.readFileSync(p,'utf8');

// 1) Strip ALL "use client" occurrences first
s = s.replace(/^\s*(['"])use client\1;\s*/gm, '');

// 2) Inject a single directive at very top
s = `"use client";\n` + s.trimStart();

// 3) Ensure SMCMark import exists once, directly after directive
//    - remove duplicates
s = s.replace(/^\s*import\s+\{\s*SMCMark\s*\}\s+from\s+"\.\/Brand";\s*$/gm, '');
if (!/import\s+\{\s*SMCMark\s*\}\s+from\s+"\.\/Brand";/.test(s)) {
  s = s.replace(/("use client";\s*)/, `$1import { SMCMark } from "./Brand";\n`);
}

// 4) Keep other imports as-is, but make sure the order is: directive → SMCMark → rest
//    (We already inserted SMCMark right after the directive)

// 5) Replace any legacy <SMCMark size={20}/> with Tailwind className sizing
s = s.replace(/<SMCMark\s+size=\{[^}]+\}\s*\/>/g, '<SMCMark className="h-5 w-5" />');

// 6) If SMCMark is used without className, add default sizing once
s = s.replace(/<SMCMark\s*\/>/g, '<SMCMark className="h-5 w-5" />');

fs.writeFileSync(p, s);
console.log('… Navbar.tsx normalized');
NODE

# Optional: clean website build artifacts
say "Clean .next (website workspace)"
rm -rf "$APP/.next"

# Run quality gate
say "Run lint"
npm run -w website lint

say "Run typecheck"
npm run -w website typecheck

say "Run build (logs -> $BUILD_LOG)"
: > "$BUILD_LOG"
set +e
npm run -w website build | tee -a "$BUILD_LOG"
rc="${PIPESTATUS[0]}"
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
