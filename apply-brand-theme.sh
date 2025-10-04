#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
CMP="$APP/app/components"
PAGES="$APP/app"

say(){ printf "\n==> %s\n" "$*"; }

[ -d "$APP" ] || { echo "❌ Run from the repo root (apps/website not found)"; exit 1; }
mkdir -p "$CMP"

# 1) Theme toggle (client component)
say "Write components/ThemeToggle.tsx"
cat > "$CMP/ThemeToggle.tsx" <<'TS'
"use client";
import { useEffect, useState } from "react";

function getInitial(){
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export default function ThemeToggle(){
  const [theme, setTheme] = useState<"light"|"dark">(getInitial());

  useEffect(()=> {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={()=> setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-xl border px-3 py-2 text-sm"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
TS

# 2) No-flash bootstrap in <html> before paint + metadata tidy
LAYOUT="$PAGES/layout.tsx"
if [ -f "$LAYOUT" ]; then
  say "Patch layout: add no-flash bootstrap + ensure metadata"
  cp "$LAYOUT" "$LAYOUT.bak.$(date +%Y%m%d-%H%M%S)"

  # Insert a no-flash script right after <html lang="en">
  perl -0777 -pe '
    s/<html([^>]*)>/<html$1>\n<script dangerouslySetInnerHTML={{__html: "(function(){try{var t=localStorage.getItem(\\\"theme\\\");if(!t){t=window.matchMedia(\\\"(prefers-color-scheme: dark)\\\").matches?\\\"dark\\\":\\\"light\\\"}document.documentElement.setAttribute(\\\"data-theme\\\",t);}catch(e){}})();"}} \/>/ unless $_ =~ /prefers-color-scheme: dark/;
  ' -i "$LAYOUT"

  # Ensure metadata exists (idempotent)
  perl -0777 -pe '
    if (!/export const metadata/s){
      $_ = "export const metadata = { title: \\"Stafford Media Consulting\\", description: \\"ROI through automation. Abando cart recovery + AI automation consulting.\\" };\n\n$_";
    }
  ' -i "$LAYOUT"
fi

# 3) Put the ThemeToggle into Navbar (right side controls)
NAV="$CMP/Navbar.tsx"
if [ -f "$NAV" ]; then
  say "Patch Navbar to include ThemeToggle on the right"
  cp "$NAV" "$NAV.bak.$(date +%Y%m%d-%H%M%S)"
  # import
  perl -0777 -pe '
    s/import Link from "next\/link";/import Link from "next\/link";\nimport ThemeToggle from ".\/ThemeToggle";/s if /import Link/;
  ' -i "$NAV"
  # add toggle just before closing </div> of the right controls container
  perl -0777 -pe '
    s/(<div className="flex items-center gap-2">[\s\S]*?)(<\/div>\s*<\/div>\s*<\/header>)/$1\n          <ThemeToggle \/>\n        $2/s;
  ' -i "$NAV" || true
fi

# 4) Brand palette + dark-mode overrides in globals.css
say "Wire brand palette + dark CSS overrides"
GCSS="$APP/app/globals.css"
mkdir -p "$(dirname "$GCSS")"
touch "$GCSS"

# Append (idempotent guard)
if ! grep -q "/* BRAND THEME */" "$GCSS"; then
  cat >> "$GCSS" <<'CSS'

/* BRAND THEME */
:root{
  --brand-purple: #8E2DE2;
  --brand-navy:   #0D2A57;
  --brand-gold:   #F3C23C;
  --brand-gray:   #B0B6BE;

  --bg:    #ffffff;
  --fg:    #0b1220;
  --card:  #ffffff;
  --muted: #475569;
  --line:  #e5e7eb;
  color-scheme: light;
}
[data-theme="dark"]{
  --bg:   #0b1220;   /* deep navy */
  --fg:   #E5E7EB;   /* light fg */
  --card: #0f172a;   /* slate-900-ish */
  --muted:#A1A1AA;   /* zinc-400-ish */
  --line: #253149;   /* brandy border */
  color-scheme: dark;
}
html, body { background: var(--bg); color: var(--fg); }

/* global border tone */
* { border-color: var(--line); }

/* Cards/surfaces using common utility combos */
.bg-white       { background-color: var(--card) !important; }
.bg-white\/80   { background-color: color-mix(in oklab, var(--card) 80%, transparent) !important; }
.border-zinc-200{ border-color: var(--line) !important; }

/* Text neutrals to brand-muted in dark */
[data-theme="dark"] .text-zinc-900,
[data-theme="dark"] .text-zinc-800 { color: var(--fg) !important; }
[data-theme="dark"] .text-zinc-700,
[data-theme="dark"] .text-zinc-600,
[data-theme="dark"] .text-zinc-500 { color: var(--muted) !important; }

/* Buttons that use bg-zinc-900 become brand-purple in dark */
[data-theme="dark"] .bg-zinc-900 { background-color: var(--brand-purple) !important; }
[data-theme="dark"] .hover\:bg-black:hover { background-color: #6d1ab8 !important; }

/* Subtle hover surfaces */
[data-theme="dark"] .hover\:bg-zinc-50:hover { background-color: #111827 !important; }

/* Links */
a[href] { text-underline-offset: 2px; }
[data-theme="dark"] a[href]:hover { color: var(--brand-purple); }

/* Eyebrow mark tint */
[data-theme="dark"] .abando-eyebrow { color: var(--brand-gray); }
CSS
fi

# 5) Tint Abando eyebrow line (class hook only; non-breaking)
ABANDO="$PAGES/abando/page.tsx"
if [ -f "$ABANDO" ]; then
  say "Add eyebrow tint class to /abando"
  cp "$ABANDO" "$ABANDO.bak.$(date +%Y%m%d-%H%M%S)"
  perl -0777 -pe '
    s/className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500"/className="abando-eyebrow flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500"/s;
  ' -i "$ABANDO"
fi

say "✅ Brand theme applied. Restart dev: Ctrl+C then: npm run -w website dev"
