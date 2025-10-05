#!/usr/bin/env bash
set -euo pipefail

ROOT="apps/website"

say(){ printf '%s\n' "$*"; }

# 1) Tailwind config — add brand colors
say "==> Update Tailwind config"
TW="$ROOT/tailwind.config.ts"
cp "$TW" "$TW.bak.$(date +%Y%m%d-%H%M%S)"
perl -0777 -pe '
  s#(theme:\s*\{[^}]*colors:\s*\{)#\1\n      smc: { DEFAULT: "#0E2A57", light: "#B0B6BE" },\n      abando: { DEFAULT: "#1877F2", accent: "#13A47B" },#s
' -i "$TW"

# 2) ThemeProvider (wraps next-themes)
say "==> Write ThemeProvider.tsx"
mkdir -p "$ROOT/app/components"
cat > "$ROOT/app/components/ThemeProvider.tsx" <<'TS'
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
TS

# 3) ThemeToggle button
say "==> Write ThemeToggle.tsx"
cat > "$ROOT/app/components/ThemeToggle.tsx" <<'TS'
"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-md border px-3 py-1 text-sm"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
TS

# 4) Patch layout.tsx to wrap in ThemeProvider
LAYOUT="$ROOT/app/layout.tsx"
if [ -f "$LAYOUT" ]; then
  say "==> Patch layout.tsx"
  cp "$LAYOUT" "$LAYOUT.bak.$(date +%Y%m%d-%H%M%S)"
  perl -0777 -pe '
    s#import Navbar from.*#import Navbar from "./components/Navbar";\nimport { ThemeProvider } from "./components/ThemeProvider";#s;
    s#(<body[^>]*>)#\1\n        <ThemeProvider>#s;
    s#(</body>)#        </ThemeProvider>\n  \1#s;
  ' -i "$LAYOUT"
fi

# 5) Patch Navbar.tsx to add ThemeToggle
NAV="$ROOT/app/components/Navbar.tsx"
if [ -f "$NAV" ]; then
  say "==> Patch Navbar.tsx"
  cp "$NAV" "$NAV.bak.$(date +%Y%m%d-%H%M%S)"
  perl -0777 -pe '
    s#import Link from "next/link";#import Link from "next/link";\nimport { ThemeToggle } from "./ThemeToggle";#s;
    s#(<nav[^>]*>[\s\S]*?<div className="ml-auto[^"]*">)#\1\n          <ThemeToggle />#s;
  ' -i "$NAV"
fi

say "✅ Brand theme applied. Restart dev: Ctrl+C then: npm run -w website dev"
