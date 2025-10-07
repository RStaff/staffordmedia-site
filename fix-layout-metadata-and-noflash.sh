#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
LAYOUT="$APP/app/layout.tsx"

[ -f "$LAYOUT" ] || { echo "❌ $LAYOUT not found"; exit 1; }

cp "$LAYOUT" "$LAYOUT.bak.$(date +%Y%m%d-%H%M%S)"

node - <<'NODE'
const fs = require('fs');
const path = 'apps/website/app/layout.tsx';
let src = fs.readFileSync(path, 'utf8');

let changed = false;

// 1) Inject no-flash script after <html ...> if not present
if (!src.includes('prefers-color-scheme: dark') && src.includes('<html')) {
  src = src.replace(
    /<html([^>]*)>/,
    `<html$1>
<script dangerouslySetInnerHTML={{__html: "(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();"}} />`
  );
  changed = true;
}

// 2) Ensure a metadata export exists
if (!/export\s+const\s+metadata\s*:\s*Metadata\s*=|export\s+const\s+metadata\s*=/.test(src)) {
  const metaBlock =
    `export const metadata: Metadata = {\n`+
    `  title: "Stafford Media Consulting",\n`+
    `  description: "ROI through automation. Abando cart recovery + AI automation consulting.",\n`+
    `};\n\n`;

  // Try to insert after imports (and any type import for Metadata)
  const importEndMatch = src.match(/^(?:import.*\n)+/);
  if (importEndMatch) {
    const endIdx = importEndMatch[0].length;
    src = src.slice(0, endIdx) + metaBlock + src.slice(endIdx);
  } else {
    // fallback: prepend
    src = metaBlock + src;
  }
  changed = true;
}

if (changed) {
  fs.writeFileSync(path, src);
  console.log('✅ layout.tsx patched (no-flash + metadata)');
} else {
  console.log('ℹ️ layout.tsx already had no-flash + metadata');
}
NODE

echo "Done. Restart dev if it’s running."
