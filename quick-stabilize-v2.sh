#!/usr/bin/env bash
set -euo pipefail

APP="apps/website/app"
CMP="$APP/components"
AB="$APP/abando/page.tsx"
LAYOUT="$APP/layout.tsx"

echo "🔧 Ensure components/Brand.tsx exists"
mkdir -p "$CMP"
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

echo "🔧 Sanitize & patch layout.tsx"
if [ -f "$LAYOUT" ]; then
  node - <<'NODE'
const fs = require('fs');
const p = "apps/website/app/layout.tsx";
let s = fs.readFileSync(p, 'utf8');

// 1) Strip raw HTML comments and inline <script> blocks
s = s.replace(/<!--[\s\S]*?-->/g, '');
s = s.replace(/<script[\s\S]*?<\/script>/gi, '');

// 2) Ensure Script import
if (!/from\s+["']next\/script["']/.test(s)) {
  // insert after the last import line
  const importBlock = s.match(/^(?:import[^\n]*\n)+/);
  if (importBlock) {
    const end = importBlock[0].length;
    s = s.slice(0, end) + 'import Script from "next/script";\n' + s.slice(end);
  } else {
    s = 'import Script from "next/script";\n' + s;
  }
}

// 3) Prepare no-flash snippet (no nested backticks)
const noflash = `
        <Script
          id="theme-noflash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{__html:"(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();"}}
        />`;

// 4) Ensure <head> exists and contains our no-flash script
if (!/<head>[\s\S]*<\/head>/.test(s)) {
  s = s.replace(/<html([^>]*)>/, `<html$1>\n  <head>\n${noflash}\n  </head>`);
} else if (!s.includes('id="theme-noflash"')) {
  s = s.replace(/<head>/, `<head>\n${noflash}`);
}

// 5) Don’t lock body to a light palette
s = s.replace(/className="antialiased[^"]*"/, 'className="antialiased"');

fs.writeFileSync(p, s);
console.log("… layout.tsx sanitized/patched");
NODE
else
  echo "… layout.tsx not found (skipping sanitize)"
fi

echo "✅ Stabilized imports and layout."
