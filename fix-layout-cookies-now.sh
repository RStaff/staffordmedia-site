#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
LAYOUT="$APP/app/layout.tsx"
BUILD_LOG="$APP/build.log"

say(){ printf "\n▶ %s\n" "$*"; }

[ -f "$LAYOUT" ] || { echo "❌ $LAYOUT not found"; exit 1; }

say "Patch layout.tsx: remove any cookies()/headers() usage and add hydration-safe theming"
node - <<'NODE'
const fs = require('fs');
const p = 'apps/website/app/layout.tsx';
let s = fs.readFileSync(p,'utf8');
const orig = s;

// 1) Remove any imports from next/headers (cookies/headers)
s = s.replace(/import\s*\{[^}]*\}\s*from\s*["']next\/headers["'];?\s*/g, '');

// 2) Remove any leftover identifiers that call cookies()/headers() at module scope
//    (const foo = await cookies();, const x = cookies();, etc.)
s = s.replace(/^\s*const\s+\w+\s*=\s*await\s+cookies\(\)\s*;?\s*$/gm, '// removed await cookies() at module scope');
s = s.replace(/^\s*const\s+\w+\s*=\s*cookies\(\)\s*;?\s*$/gm, '// removed cookies() at module scope');
s = s.replace(/^\s*const\s+\w+\s*=\s*headers\(\)\s*;?\s*$/gm, '// removed headers() at module scope');

// 3) Remove any variables derived from cookies(), like __initialTheme = cookies().get(...)
s = s.replace(/^\s*const\s+__initialTheme[^\n]*$/gm, '// removed __initialTheme derived from cookies()');

// 4) Ensure next/script is imported (once)
if (!/from\s+["']next\/script["']/.test(s)) {
  s = s.replace(/^(import.*\n)+/, (block) => block + `import Script from "next/script";\n`);
}

// 5) Kill raw <script> tags and HTML comments if they snuck in
s = s.replace(/<!--[\s\S]*?-->/g, '');
s = s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
s = s.replace(/<script\b[^>]*\/>/gi, '');

// 6) Ensure <head> exists
if (!/<head>/.test(s)) {
  s = s.replace(/<html([^>]*)>/, '<html$1>\n      <head></head>');
}

// 7) Inject/ensure a beforeInteractive no-flash theme snippet (idempotent)
if (!/id="theme-noflash"/.test(s)) {
  s = s.replace(
    /<head>/,
    `<head>
        <Script
          id="theme-noflash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: \`(function(){try{
              var t = localStorage.getItem('theme');
              if(!t){ t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light'; }
              document.documentElement.setAttribute('data-theme', t);
            }catch(e){}})();\`
          }}
        />`
  );
}

// 8) Ensure we don’t set server-side data-theme (avoid hydration mismatch)
s = s.replace(/<html([^>]*?)\sdata-theme="[^"]*"([^>]*)>/, '<html$1$2>');

// 9) Make sure layout.tsx stays a server component (no "use client" directive)
s = s.replace(/^\s*["']use client["'];?\s*$/m, '');

// Write back if changed
if (s !== orig) {
  fs.writeFileSync(p + '.bak.cookiesfix2', orig);
  fs.writeFileSync(p, s);
  console.log('… layout.tsx sanitized (no cookies/headers; no-flash ensured)');
} else {
  console.log('… layout.tsx already sanitized');
}
NODE

say "Clean workspace cache"
rm -rf "$APP/.next"

say "Run typecheck"
npm run -w website typecheck

say "Run build (log -> $BUILD_LOG)"
: > "$BUILD_LOG"
set +e
npm run -w website build | tee -a "$BUILD_LOG"
rc="${PIPESTATUS[0]}"
set -e

if [ "$rc" -ne 0 ]; then
  echo ""
  echo "⚠ Build failed. Last 120 lines:"
  tail -n 120 "$BUILD_LOG"
  echo ""
  echo "🔎 Grep for remaining next/headers usage in layout/pages:"
  grep -R --line-number --color=never -E 'from "next/headers"|from '\''next/headers'\''' "$APP/app" || true
  exit $rc
fi

echo ""
echo "✅ Hydration-safe theming in layout (no top-level next/headers). Build passed."
echo "Next: npm run -w website dev"
