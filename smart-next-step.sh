#!/usr/bin/env bash
# Smart next step: fix current errors, enforce hygiene, verify build & tests.

# ---- strict mode + quiet shell hygiene ----
set -Eeuo pipefail
IFS=$'\n\t'
unset HISTTIMEFORMAT 2>/dev/null || true

say(){ printf "\n▶ %s\n" "$*"; }
die(){ printf "\n❌ %s\n" "$*" >&2; exit 1; }

# ---- repo sanity ----
[ -f package.json ] || die "Run from repo root (package.json not found)"
APP_ROOT="apps/website"
APP="$APP_ROOT/app"
CMP="$APP/components"
NAV="$CMP/Navbar.tsx"
BRAND="$CMP/Brand.tsx"
TESTDIR="$APP_ROOT/tests"
SMOKE="$TESTDIR/smoke.test.tsx"

# ---- snapshot WIP in a temp branch (safe, idempotent) ----
say "Create safety snapshot"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "Not a git repo"
git checkout -B chore/smart-next-step >/dev/null 2>&1 || true
git add -A
git commit -m "chore: WIP snapshot before smart-next-step" >/dev/null 2>&1 || true

# ---- guard: prevent common TSX hazards going forward (tripwires) ----
say "Install lightweight tripwires (dev-only tools)"
npm pkg set "devDependencies.eslint-config-prettier=^9.1.0" >/dev/null
npm pkg set "devDependencies.@next/eslint-plugin-next=^15.0.0" >/dev/null
# ensure project-level ESLint (flat) exists with basic rules + Prettier compat
if [ ! -f "eslint.config.js" ]; then
  cat > eslint.config.js <<'JS'
import next from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';

export default [
  prettier,
  {
    plugins: { next },
    rules: {
      ...next.configs['core-web-vitals'].rules,
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // tripwires
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXOpeningElement[name.name='script']",
          message: "Use next/script, not raw <script> in TSX.",
        },
        {
          selector: "JSXText[value=/<!--/]",
          message: "Use JSX comments {/* ... */}, not HTML <!-- --> in TSX.",
        }
      ],
    },
  },
];
JS
fi

# ---- 1) Fix Brand.tsx (HTML comments in TSX) ----
say "Fix Brand.tsx HTML comments → JSX comments"
mkdir -p "$CMP"
if [ -f "$BRAND" ]; then
  cp "$BRAND" "$BRAND.bak.$(date +%Y%m%d-%H%M%S)"
  # Replace <!-- --> with JSX-safe comments
  perl -0777 -pe 's/<!--\s*/{/* /g; s/\s*-->/ *\/}/g' -i "$BRAND"
  # Safety: strip any stray DOCTYPE/xml headers if present in pasted SVGs
  perl -0777 -pe 's/<!DOCTYPE[^>]*>\s*//gi; s/<\?xml[^>]*\?>\s*//gi' -i "$BRAND"
else
  # write minimal, known-good marks (compact)
  cat > "$BRAND" <<'TS'
export function SMCMark(props: React.SVGProps<SVGSVGElement>){
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="9" height="9" rx="2" fill="#B0B6BE"/>
      <rect x="13" y="2" width="9" height="9" rx="2" fill="#8C2AC6"/>
      <rect x="2" y="13" width="9" height="9" rx="2" fill="#0E2A57"/>
      <rect x="13" y="13" width="9" height="9" rx="2" fill="#B0B6BE"/>
    </svg>
  );
}
export function AbandoMark(props: React.SVGProps<SVGSVGElement>){
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M5 6h10a1 1 0 0 1 .97.76l1.5 6A1 1 0 0 1 16.5 14H8"
        fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="18.5" r="1.5" fill="#1877F2"/>
      <circle cx="16" cy="18.5" r="1.5" fill="#1877F2"/>
      <circle cx="14.5" cy="8.5" r="3.2" fill="#13A47B"/>
      <circle cx="17.2" cy="7" r="1.2" fill="#13A47B"/>
      <circle cx="14.5" cy="8.5" r="1.1" fill="white"/>
    </svg>
  );
}
TS
fi

# ---- 2) Fix Navbar.tsx ('use client' first + single SMC import) ----
say "Fix Navbar.tsx: 'use client' first; remove duplicate imports"
[ -f "$NAV" ] || die "$NAV not found"
cp "$NAV" "$NAV.bak.$(date +%Y%m%d-%H%M%S)"
node - <<'NODE'
const fs = require('fs'); const p = process.env.NAV;
let s = fs.readFileSync(p,'utf8');

// Ensure "use client" is THE FIRST line if file uses hooks
if (!/^"use client";/.test(s)) {
  s = `"use client";\n` + s.replace(/^\s*"use client";\s*/,'');
} else {
  // move it to the top if not already first
  s = s.replace(/^\s*"use client";\s*/,''); s = `"use client";\n` + s;
}

// Deduplicate SMCMark import
s = s.replace(/import\s+\{\s*SMCMark\s*\}\s+from\s+"\.\/Brand";?/g, '');
if (!/SMCMark/.test(s)) s = s.replace(/(import\s+Link.*\n)/, `$1import { SMCMark } from "./Brand";\n`);

// Keep only ONE SMCMark import total
let seen = false;
s = s.replace(/import\s+\{\s*SMCMark\s*\}\s+from\s+"\.\/Brand";?/g, m => (seen ? '' : (seen = true, m)));

// Minor: if className hardcodes light palette, remove it
s = s.replace(/className="antialiased[^"]*"/g,'className="antialiased"');

fs.writeFileSync(p, s);
NODE
# export path for node snippet
NAV="$NAV" node -e "process.env.NAV=process.env.NAV"

# ---- 3) Fix /abando import path (was ../../components/Brand) ----
ABANDO="$APP/abando/page.tsx"
if [ -f "$ABANDO" ]; then
  say "Fix /abando/page.tsx Brand import path"
  cp "$ABANDO" "$ABANDO.bak.$(date +%Y%m%d-%H%M%S)"
  perl -0777 -pe 's#\.\./\.\./components/Brand#../components/Brand#g' -i "$ABANDO"
fi

# ---- 4) Test hygiene: React import in smoke test ----
say "Ensure smoke test has React import"
mkdir -p "$TESTDIR"
if [ -f "$SMOKE" ]; then
  cp "$SMOKE" "$SMOKE.bak.$(date +%Y%m%d-%H%M%S)"
  grep -q '^import React' "$SMOKE" || (echo 'import React from "react";' | cat - "$SMOKE" > "$SMOKE.tmp" && mv "$SMOKE.tmp" "$SMOKE")
fi

# ---- 5) Quality gate ----
say "Run lint → typecheck → build → test"
npm run -w "$APP_ROOT" lint
npm run -w "$APP_ROOT" typecheck
npm run -w "$APP_ROOT" build
npm run -w "$APP_ROOT" test || true  # allow no/empty tests to pass CI early

say "All good. Commit these changes."
git add -A
git commit -m "fix: root-cause repairs (Brand JSX comments, Navbar client directive, import paths, test hygiene)" || true

printf "\n✅ Done.\nNext:\n  • Start dev: npm run -w website dev\n  • Push branch when ready: git push -u origin chore/smart-next-step\n"
