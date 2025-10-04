#!/usr/bin/env bash
set -euo pipefail

APP="apps/website/app"
CMP="$APP/components"

say(){ printf '%s\n' "$*\n"; }

mkdir -p "$CMP"

say "==> 1) Ensure components/Brand.tsx exists"
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

ABANDO="$APP/abando/page.tsx"

if [ -f "$ABANDO" ]; then
  say "==> 2) Fix import path in /abando/page.tsx"
  cp "$ABANDO" "$ABANDO.bak.$(date +%Y%m%d-%H%M%S)"
  perl -0777 -pe 's#\.\./\.\./components/Brand#../components/Brand#g' -i "$ABANDO"

  # Ensure AbandoMark import exists (idempotent)
  if ! grep -q 'AbandoMark' "$ABANDO"; then
    perl -0777 -pe 's#(import Link from "next/link";\s*)#\1import { AbandoMark } from "../components/Brand";\n#s' -i "$ABANDO"
  fi

  # Eyebrow: include the icon (idempotent)
  perl -0777 -pe '
    s#(<div className="text-xs[^"]*">)\s*Abando#\1 <span className="inline-flex items-center gap-1 align-middle"><span className="inline-block translate-y-[1px]"><AbandoMark className="h-3 w-3" /></span>Abando</span>#s
  ' -i "$ABANDO"

  # Add Quick Install buttons after the H1 if not already present
  if ! grep -q 'Quick Install' "$ABANDO"; then
    perl -0777 -pe '
      s#(<h1[^>]*>[\s\S]*?</h1>\s*\n)#\1      <div className="mt-4 flex flex-wrap gap-3">\n        <a href="/install/shopify" className="rounded-xl bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-black">Quick Install · Shopify</a>\n        <a href="/install/woocommerce" className="rounded-xl border px-4 py-2 text-sm font-medium">WooCommerce</a>\n        <a href="/install/bigcommerce" className="rounded-xl border px-4 py-2 text-sm font-medium">BigCommerce</a>\n        <a href="/install/magento" className="rounded-xl border px-4 py-2 text-sm font-medium">Magento</a>\n        <a href="/install/custom" className="rounded-xl border px-4 py-2 text-sm font-medium">Custom/API</a>\n      </div>\n#s' -i "$ABANDO"
  fi
else
  say "⚠️  Not found: $ABANDO (skipping Abando page patch)"
fi

say "==> 3) Ensure /install/* placeholder routes exist"
mkdir -p "$APP/install"/{shopify,woocommerce,bigcommerce,magento,custom}

for p in shopify woocommerce bigcommerce magento custom; do
  FILE="$APP/install/$p/page.tsx"
  case "$p" in
    shopify) NAME="Shopify" ;;
    woocommerce) NAME="WooCommerce" ;;
    bigcommerce) NAME="BigCommerce" ;;
    magento) NAME="Magento" ;;
    custom) NAME="Custom / API" ;;
  esac
  if [ ! -f "$FILE" ]; then
    cat > "$FILE" <<TS
export default function Page(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Install Abando — ${NAME}</h1>
      <p className="mt-3 text-zinc-700">This is a placeholder. Hook your real installer here.</p>
      <div className="mt-6 rounded-xl border p-4 text-sm text-zinc-600">Coming soon</div>
    </div>
  );
}
TS
  fi
done

say "✅ Done. Restart dev (Ctrl+C) then: npm run -w website dev"
