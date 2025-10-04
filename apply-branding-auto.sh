#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
PUB="$APP/public/logos"
CMP="$APP/app/components"
PAGES="$APP/app"

say(){ printf "\n==> %s\n" "$*"; }

mkdir -p "$PUB" "$CMP"

# --- Helper: find and copy first match among common filename patterns/dirs ---
copy_first_match () {
  local out="$1"; shift
  local -a patterns=("$@")
  local -a roots=("." "$APP" "$APP/public" "$APP/public/logos" "public" "assets" "static" "images" "src" "src/assets" "..")
  local found=""
  for r in "${roots[@]}"; do
    for p in "${patterns[@]}"; do
      local cand
      # shellcheck disable=SC2046
      cand=$(find "$r" -type f -iname "$p" 2>/dev/null | head -n 1 || true)
      if [[ -n "${cand:-}" && -f "$cand" ]]; then
        found="$cand"
        break 2
      fi
    done
  done
  if [[ -n "${found:-}" ]]; then
    cp -f "$found" "$out"
    echo "✔ copied $(basename "$found") -> $out"
  else
    echo "⚠ could not find any of: ${patterns[*]} (skipping)"
  fi
}

say "Copy logos you already have into $PUB"
# SMC logo (prefer svg; fall back to png)
copy_first_match "$PUB/smc-logo.svg"        "smc-logo*.svg" "smc*logo*svg"
copy_first_match "$PUB/smc-logo.png"        "smc-logo*.png" "smc*logo*1024*.png" "smc*logo*300dpi*.png"
# Abando marks
copy_first_match "$PUB/abando-logo.png"     "abando*logo*2048*.png" "abando*logo*.png"
copy_first_match "$PUB/abando-logo-256.png" "abando*logo*256*.png"  "abando*256*.png"
copy_first_match "$PUB/abando-favicon.ico"  "abando*favicon*.ico"   "*.ico"

say "Update Navbar to show SMC logo"
cat > "$CMP/Navbar.tsx" <<'TS'
"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/abando", label: "Abando" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/services", label: "Consulting" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar(){
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-zinc-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logos/smc-logo.svg"
            alt="Stafford Media Consulting"
            width={28}
            height={28}
            priority
          />
          <span className="font-semibold tracking-tight text-zinc-900">Stafford Media Consulting</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm">
          {nav.map(n => (
            <Link key={n.href}
              href={n.href}
              className={`hover:text-zinc-900 ${path===n.href ? "text-zinc-900" : "text-zinc-600"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/how-it-works" className="hidden sm:inline-block rounded-xl border px-3 py-2 text-sm">See how</Link>
          <Link href="/signup" className="rounded-xl bg-zinc-900 text-white px-4 py-2 text-sm font-medium hover:bg-black">Get Started</Link>
        </div>
      </div>
    </header>
  );
}
TS

say "Set favicon + metadata in layout"
cat > "$PAGES/layout.tsx" <<'TS'
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata: Metadata = {
  title: "Stafford Media Consulting",
  description: "ROI through automation. Abando cart recovery for Shopify, WooCommerce, BigCommerce, Magento & more.",
  icons: {
    icon: "/logos/abando-favicon.ico",
    shortcut: "/logos/abando-favicon.ico",
    apple: "/logos/abando-favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body className="antialiased bg-white text-zinc-900">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
TS

say "Fix Next.js searchParams usage on Home (await it)"
# Make the page async and await the promise-shaped searchParams per Next 15
if [[ -f "$PAGES/page.tsx" ]]; then
  cat > "$PAGES/page.tsx" <<'TS'
import Hero from "./components/Hero";
import ValueProps from "./components/ValueProps";
import ConsultingTeaser from "./components/ConsultingTeaser";
import FAQ from "./components/FAQ";

export default async function Page({ searchParams }: { searchParams: Promise<{ v?: string }> }){
  const sp = await searchParams;
  const fromQuery = (sp?.v === "roi" || sp?.v === "recover") ? sp.v : null;

  const fromEnv = (process.env.NEXT_PUBLIC_HERO_VARIANT === "roi" || process.env.NEXT_PUBLIC_HERO_VARIANT === "recover")
    ? (process.env.NEXT_PUBLIC_HERO_VARIANT as "roi"|"recover")
    : "roi";
  const variant = (fromQuery ?? fromEnv) as "roi"|"recover";

  return (
    <>
      <Hero variant={variant} />
      <ValueProps />
      <ConsultingTeaser />
      <FAQ />
    </>
  );
}
TS
else
  echo "ℹ️ Home page file missing at $PAGES/page.tsx (skipped)."
fi

say "Add Abando logo to /abando hero (if page exists)"
ABP="$PAGES/abando/page.tsx"
if [[ -f "$ABP" ]]; then
  # Replace the heading kicker block to include a small logo badge if not already present
  perl -0777 -pe 's/ABANDO — CART RECOVERY/ABANDO — CART RECOVERY/g' "$ABP" > "$ABP.tmp" && mv "$ABP.tmp" "$ABP"
  # Inject a small logo near the top (idempotent)
  if ! grep -q 'abando-logo' "$ABP"; then
    awk '
      /<h1 className=/ && !inserted {print; print "      <div className=\"mt-3\"><img src=\"/logos/abando-logo-256.png\" alt=\"Abando\" width=\"36\" height=\"36\" /></div>"; inserted=1; next}1
    ' "$ABP" > "$ABP.tmp" && mv "$ABP.tmp" "$ABP" || true
  fi
else
  echo "ℹ️  /abando page not found at $ABP (skipped logo badge)."
fi

say "Ensure globals.css contains Tailwind directives"
mkdir -p "$APP/app"
if ! grep -q "@tailwind" "$APP/app/globals.css" 2>/dev/null; then
  cat > "$APP/app/globals.css" <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
CSS
fi

say "Done. Logos copied (where found), navbar + favicon wired, home warning fixed."
