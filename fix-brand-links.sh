#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
CMP="$APP/app/components"
LAYOUT="$APP/app/layout.tsx"
NAV="$CMP/Navbar.tsx"
FOOT="$CMP/Footer.tsx"

echo "==> Checking files…"
[ -f "$LAYOUT" ] || { echo "❌ $LAYOUT not found"; exit 1; }
[ -f "$NAV" ]    || { echo "❌ $NAV not found"; exit 1; }
[ -f "$FOOT" ]   || { echo "❌ $FOOT not found"; exit 1; }

# 1) Navbar: brand click -> staffordmedia.ai (use a normal <a> so it works in dev & prod)
echo "==> Patching Navbar brand link -> https://staffordmedia.ai"
perl -0777 -pe '
  s#<Link\s+href="/"\s+className="font-semibold([^"]*)">#<a href="https://staffordmedia.ai" className="font-semibold\1" target="_blank" rel="noopener noreferrer">#g;
  s#</Link>#</a>#g if $. == 0;  # safeguard (perl stream quirk)
' -i "$NAV"

# 2) Footer: company name -> staffordmedia.ai
echo "==> Patching Footer company link -> https://staffordmedia.ai"
perl -0777 -pe '
  s#<p>© \{new Date\(\)\.getFullYear\(\)\} Stafford Media Consulting</p>#<p>© {new Date().getFullYear()} <a className="hover:text-zinc-900 underline-offset-4 hover:underline" href="https://staffordmedia.ai" target="_blank" rel="noopener noreferrer">Stafford Media Consulting</a></p>#g;
' -i "$FOOT"

# 3) Layout: (optional) if any stray hardcoded consulting/com URLs exist, flip them to .ai
echo "==> Patching Layout stray domain references -> staffordmedia.ai (best effort)"
perl -0777 -pe '
  s#https?://(www\.)?staffordmediaconsulting\.com#https://staffordmedia.ai#g;
  s#https?://(www\.)?staffordmedia\.ai#https://staffordmedia.ai#g;  # normalize
' -i "$LAYOUT"

# 4) Ensure Home page no longer touches sync dynamic APIs (searchParams) — keep ROI default
HOME="$APP/app/page.tsx"
if [ -f "$HOME" ]; then
  echo "==> Ensuring Home page does not use sync searchParams"
  perl -0777 -pe '
    s/export default function Page\(\{\s*searchParams[^}]*\}\s*:\s*\{[^}]*\}\)\s*\{/
       export default function Page()\{/sx;
    s/const\s+fromQuery[^;]*;//s;
    s/const\s+variant\s*=\s*\([^;]*\);\s*/const variant = "roi";/s;
  ' -i "$HOME"
fi

echo "==> Done. Restart your dev server if it was running."
