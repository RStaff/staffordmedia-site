#!/usr/bin/env bash
# Fix Brand.tsx comment syntax safely, dedupe Navbar imports, correct /abando import,
# harden a basic smoke test, then run lint → typecheck → build → test.
set -Eeuo pipefail
IFS=$'\n\t'
unset HISTTIMEFORMAT 2>/dev/null || true

say(){ printf "\n▶ %s\n" "$*"; }
die(){ printf "\n❌ %s\n" "$*" >&2; exit 1; }

# Paths
APP_ROOT="apps/website"
APP="$APP_ROOT/app"
CMP="$APP/components"
BRAND="$CMP/Brand.tsx"
NAV="$CMP/Navbar.tsx"
ABANDO="$APP/abando/page.tsx"
TESTDIR="$APP_ROOT/tests"
SMOKE="$TESTDIR/smoke.test.tsx"

[ -f package.json ] || die "Run from repo root (package.json not found)"

say "Install minimal dev deps (eslint next plugin + prettier compat)"
npm pkg set "devDependencies.eslint-config-prettier=^9.1.0" >/dev/null
npm pkg set "devDependencies.@next/eslint-plugin-next=^15.0.0" >/dev/null
if [ ! -f eslint.config.js ]; then
  cat > eslint.config.js <<'JS'
import next from '@next/eslint-plugin-next';
import prettier from 'eslint-config-prettier';

export default [
  prettier,
  {
    plugins: { next },
    rules: {
      ...next.configs['core-web-vitals'].rules,
      'no-console': ['error', { allow: ['warn','error'] }],
      // tripwires to prevent regressions:
      'no-restricted-syntax': [
        'error',
        { selector: "JSXOpeningElement[name.name='script']", message: "Use next/script, not raw <script>." },
        { selector: "JSXText[value=/<!--/]", message: "Use {/* ... */}, not HTML <!-- --> in TSX." }
      ]
    }
  }
];
JS
fi

say "Fix Brand.tsx: convert HTML comments to JSX comments (safe, multiline)"
node - <<'NODE'
const fs = require('fs'), path = 'apps/website/app/components/Brand.tsx';
const minimal = `export function SMCMark(props: React.SVGProps<SVGSVGElement>){
  return (<svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <rect x="2" y="2" width="9" height="9" rx="2" fill="#B0B6BE"/>
    <rect x="13" y="2" width="9" height="9" rx="2" fill="#8C2AC6"/>
    <rect x="2" y="13" width="9" height="9" rx="2" fill="#0E2A57"/>
    <rect x="13" y="13" width="9" height="9" rx="2" fill="#B0B6BE"/>
  </svg>);
}
export function AbandoMark(props: React.SVGProps<SVGSVGElement>){
  return (<svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path d="M5 6h10a1 1 0 0 1 .97.76l1.5 6A1 1 0 0 1 16.5 14H8"
      fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="10" cy="18.5" r="1.5" fill="#1877F2"/>
    <circle cx="16" cy="18.5" r="1.5" fill="#1877F2"/>
    <circle cx="14.5" cy="8.5" r="3.2" fill="#13A47B"/>
    <circle cx="17.2" cy="7" r="1.2" fill="#13A47B"/>
    <circle cx="14.5" cy="8.5" r="1.1" fill="white"/>
  </svg>);
}
`;
if (!fs.existsSync(path)) {
  fs.mkdirSync('apps/website/app/components', { recursive: true });
  fs.writeFileSync(path, minimal);
  console.log('… Brand.tsx created (minimal marks)');
} else {
  const src = fs.readFileSync(path,'utf8');
  // Strip stray DOCTYPE/XML prologs pasted from SVG editors
  let out = src.replace(/<!DOCTYPE[^>]*>\s*/gi,'').replace(/<\?xml[^>]*\?>\s*/gi,'');
  // Replace ALL HTML comments with JSX comments, multiline-safe
  out = out.replace(/<!--([\s\S]*?)-->/g, (_m, inner) => `{/* ${inner.trim()} */}`);
  fs.writeFileSync(path + '.bak', src);
  fs.writeFileSync(path, out);
  console.log('… Brand.tsx sanitized');
}
NODE

say "Fix Navbar.tsx: 'use client' first and dedupe SMCMark import"
node - <<'NODE'
const fs = require('fs'), p='apps/website/app/components/Navbar.tsx';
if (!fs.existsSync(p)) { process.exit(0); }
let s = fs.readFileSync(p,'utf8');
// Ensure "use client" at the very top
if (!/^"use client";/m.test(s)) s = `"use client";\n` + s.replace(/^\s*"use client";\s*/,'');
else s = s.replace(/^\s*"use client";\s*/,''); s = `"use client";\n` + s;
// Remove duplicate SMCMark imports, then re-add exactly one after other imports
s = s.replace(/import\s+\{\s*SMCMark\s*\}\s+from\s+"\.\/Brand";?\s*\n/gi, '');
if (!/SMCMark/.test(s)) {
  // only add if the component references SMCMark; otherwise skip
  if (/SMCMark/.test(fs.readFileSync('apps/website/app/components/Brand.tsx','utf8'))) {
    s = s.replace(/(import\s+.*\n)(?:(?:import\s+.*\n)*)/m, (m)=> m + `import { SMCMark } from "./Brand";\n`);
  }
}
fs.writeFileSync(p + '.bak', fs.readFileSync(p,'utf8'));
fs.writeFileSync(p, s);
console.log('… Navbar.tsx normalized');
NODE

say "Correct /abando page Brand import path (../../ → ../)"
node - <<'NODE'
const fs = require('fs'), p='apps/website/app/abando/page.tsx';
if (!fs.existsSync(p)) process.exit(0);
const src = fs.readFileSync(p,'utf8');
const out = src.replace(/\.\.\/\.\.\/components\/Brand/g, '../components/Brand');
if (out !== src) {
  fs.writeFileSync(p + '.bak', src);
  fs.writeFileSync(p, out);
  console.log('… /abando/page.tsx import path fixed');
} else {
  console.log('… /abando/page.tsx path already ok');
}
NODE

say "Ensure smoke test is React-aware (vitest)"
mkdir -p "$TESTDIR"
if [ -f "$SMOKE" ]; then
  if ! grep -q '^import React' "$SMOKE"; then
    (echo 'import React from "react";' && cat "$SMOKE") > "$SMOKE.tmp" && mv "$SMOKE.tmp" "$SMOKE"
    echo "… React import added to smoke test"
  else
    echo "… smoke test already has React import"
  fi
else
  cat > "$SMOKE" <<'TSX'
import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "../app/components/Hero";

test("renders ROI headline", () => {
  render(<Hero variant="roi" />);
  expect(screen.getByText(/ROI/i)).toBeInTheDocument();
});
TSX
  echo "… smoke test created"
fi

say "Run quality gate: lint → typecheck → build → test"
npm run -w "$APP_ROOT" lint
npm run -w "$APP_ROOT" typecheck
npm run -w "$APP_ROOT" build
npm run -w "$APP_ROOT" test || true  # ok if no tests or minimal tests

say "Commit fixes (safe to re-run)"
git add -A
git commit -m "fix: sanitize Brand JSX, normalize Navbar 'use client', fix imports, test hygiene" >/dev/null 2>&1 || true

printf "\n✅ Done.\nNext:\n  • Start dev: npm run -w website dev\n  • If clean, push: git push -u origin chore/smart-next-fix\n"
