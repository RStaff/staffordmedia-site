#!/usr/bin/env bash
set -euo pipefail

APP="apps/website/app"
CMP="$APP/components"
CSS="$APP/globals.css"
LAYOUT="$APP/layout.tsx"
NAV="$CMP/Navbar.tsx"

say(){ printf '%s\n' "$*"; }

mkdir -p "$CMP"

# 1) Write a dependency-free ThemeToggle that flips data-theme and saves to localStorage
say "==> Write components/ThemeToggle.tsx"
cat > "$CMP/ThemeToggle.tsx" <<'TS'
"use client";

import { useEffect, useState } from "react";

export function ThemeToggle(){
  const [theme,setTheme] = useState<"light"|"dark">("light");

  useEffect(()=>{
    try{
      const saved = localStorage.getItem("theme");
      const initial = (saved === "dark" || saved === "light")
        ? (saved as "light"|"dark")
        : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial);
    }catch(e){}
  },[]);

  function toggle(){
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try{ localStorage.setItem("theme", next); }catch(e){}
  }

  return (
    <button onClick={toggle}
      className="rounded-md border px-3 py-1 text-sm"
      aria-label="Toggle theme">
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
TS

# 2) Patch layout.tsx: ensure <head> exists and add async no-flash script there.
#    Also remove any previous inline <script> directly under <html> that caused the error.
say "==> Patch layout.tsx (head no-flash + cleanup)"
cp "$LAYOUT" "$LAYOUT.bak.$(date +%Y%m%d-%H%M%S)"

# Remove any prior inline script right after <html ...>
perl -0777 -pe 's#(<html[^>]*>\s*)<script[^>]*dangerouslySetInnerHTML[\s\S]*?</script>#\1#s' -i "$LAYOUT"

# Ensure we have a <head> block; inject one if missing
if ! grep -q "<head>" "$LAYOUT"; then
  perl -0777 -pe 's#(<html[^>]*>)#\1\n      <head></head>#s' -i "$LAYOUT"
fi

# Insert async no-flash script into <head> (idempotent)
perl -0777 -pe '
  s#(<head>)(?![\s\S]*?<!-- THEME NO-FLASH -->)#\1\n        <!-- THEME NO-FLASH -->\n        <script async>try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t);}catch(e){}</script>#s
' -i "$LAYOUT"

# 3) Mount ThemeToggle in the Navbar’s right-side button group
say "==> Patch Navbar.tsx (add ThemeToggle)"
cp "$NAV" "$NAV.bak.$(date +%Y%m%d-%H%M%S)"
# Import
perl -0777 -pe 's#import Link from "next/link";#import Link from "next/link";\nimport { ThemeToggle } from "./ThemeToggle";#s' -i "$NAV"
# Insert toggle into the right controls container
perl -0777 -pe '
  s#(<div className="flex items-center gap-2">)#\1\n          <ThemeToggle />#s
' -i "$NAV"

# 4) Brand colors + dark tokens in globals.css (Tailwind v4 friendly)
say "==> Update globals.css with brand tokens (light/dark)"
mkdir -p "$(dirname "$CSS")"
if ! grep -q "--brand-bg" "$CSS" 2>/dev/null; then
  cat >> "$CSS" <<'CSS'

/* === Brand tokens === */
:root {
  /* SMC + Abando colors (light) */
  --brand-surface: #ffffff;
  --brand-text: #0a0a0a;

  --smc: #0E2A57;          /* deep navy */
  --smc-muted: #B0B6BE;    /* cool gray */

  --ab-blue: #1877F2;      /* Abando blue */
  --ab-green: #13A47B;     /* Abando accent green */

  --brand-border: #e5e7eb;
}

[data-theme="dark"] {
  --brand-surface: #0b1220;
  --brand-text: #e5e7eb;
  --brand-border: #1f2937;

  /* keep brand hues stable in dark */
  --smc: #7aa0d1;
  --smc-muted: #8a93a3;
  --ab-blue: #7aa7ff;
  --ab-green: #4ad3a7;
}

/* Utility helpers */
.bg-brand { background: var(--brand-surface); }
.text-brand { color: var(--brand-text); }
.border-brand { border-color: var(--brand-border); }

.btn-brand {
  background: var(--ab-blue);
  color: white;
}
.btn-brand:hover { filter: brightness(0.95); }

.btn-outline-brand {
  border: 1px solid var(--brand-border);
  color: var(--brand-text);
  background: transparent;
}
.btn-outline-brand:hover { background: color-mix(in oklab, var(--brand-text) 6%, transparent); }

/* Apply surface/text to body */
html, body { background: var(--brand-surface); color: var(--brand-text); }
CSS
fi

say "✅ Dark mode + brand colors installed (no Tailwind config needed)."
say "   Restart dev: Ctrl+C, then: npm run -w website dev"
