#!/usr/bin/env bash
set -euo pipefail

APP="apps/website/app"
CMP="$APP/components"
AB="$APP/abando/page.tsx"
LAYOUT="$APP/layout.tsx"

echo "🔧 Ensure components directory"
mkdir -p "$CMP"

echo "🔧 Ensure Brand.tsx (inline SMC/Abando marks)"
if [ ! -f "$CMP/Brand.tsx" ]; then
  cat > "$CMP/Brand.tsx" <<'TS'
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
      <path d="M5 6h10a1 1 0 0 1 .97.76l1.5 6A1 1 0 0 1 16.5 14H8" fill="none" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="10" cy="18.5" r="1.5" fill="#1877F2"/>
      <circle cx="16" cy="18.5" r="1.5" fill="#1877F2"/>
      <circle cx="14.5" cy="8.5" r="3.2" fill="#13A47B"/>
      <circle cx="17.2" cy="7" r="1.2" fill="#13A47B"/>
      <circle cx="14.5" cy="8.5" r="1.1" fill="white"/>
    </svg>
  );
}
TS
else
  echo "… Brand.tsx already present (ok)"
fi

echo "🔧 Fix /abando import path (../components/Brand)"
if [ -f "$AB" ]; then
  cp "$AB" "$AB.bak.$(date +%Y%m%d-%H%M%S)"
  perl -0777 -pe 's#\.\./\.\./components/Brand#../components/Brand#g' -i "$AB"
else
  echo "… /abando/page.tsx not found (skipping import fix)"
fi

echo "🔧 Sanitize layout (remove raw <script>/HTML comments, add next/script no-flash)"
if [ -f "$LAYOUT" ]; then
  node - <<'NODE'
const fs = require('fs');
const p = "apps/website/app/layout.tsx";
let s = fs.readFileSync(p, 'utf8');

// Remove raw HTML comments and inline <script> blocks in TSX
s = s.replace(/<!--[\s\S]*?-->/g, '');
s = s.replace(/<script[\s\S]*?<\/script>/gi, '');

// Ensure next/script import
if (!/from\s+["']next\/script["']/.test(s)) {
  s = s.replace(/(import .+?;\s*)+/s, (m) => m + 'import Script from "next/script";\n');
}

// Ensure <head> exists and inject no-flash
if (!/<head>[\s\S]*<\/head>/.test(s)) {
  s = s.replace(/<html([^>]*)>/, `<html$1>
      <head>
        <Script id="theme-noflash" strategy="beforeInteractive">
          {\\`
            try {
              var t = localStorage.getItem('theme');
              if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              document.documentElement.setAttribute('data-theme', t);
            } catch(e) {}
          \\`}
        </Script>
      </head>`);
} else {
  // Replace existing head with one that includes our no-flash (idempotent insert)
  s = s.replace(/<head>[\s\S]*?<\/head>/, (headBlock) => {
    if (headBlock.includes('id="theme-noflash"')) return headBlock;
    return headBlock.replace(
      /<head>/,
      `<head>
        <Script id="theme-noflash" strategy="beforeInteractive">
          {\\`
            try {
              var t = localStorage.getItem('theme');
              if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              document.documentElement.setAttribute('data-theme', t);
            } catch(e) {}
          \\`}
        </Script>`
    );
  });
}

// Ensure body class isn’t locked to light-only palette
s = s.replace(/className="antialiased[^"]*"/, 'className="antialiased"');

fs.writeFileSync(p, s);
console.log("… layout.tsx sanitized");
NODE
else
  echo "… layout.tsx not found (skipping sanitize)"
fi

echo "✅ Stabilized imports and layout."
