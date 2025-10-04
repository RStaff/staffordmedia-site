#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
POSTCSS_CJS="$APP/postcss.config.cjs"
TAILWIND_CJS="$APP/tailwind.config.cjs"
GLOBALS="$APP/app/globals.css"

say(){ printf '%s\n' "$*"; }

# 1) Remove all legacy JS configs repo-wide (they shadow the .cjs)
say "==> Remove legacy postcss/tailwind JS configs (repo-wide)"
mapfile -t LEGACY < <(git ls-files | grep -E '(?:^|/)(postcss|tailwind)\.config\.js$' || true)
if [ "${#LEGACY[@]}" -gt 0 ]; then
  git rm -f "${LEGACY[@]}" || true
  say "   removed: ${LEGACY[*]}"
else
  say "   none found"
fi

# 2) Write canonical Tailwind v4 PostCSS config (CJS)
say "==> Write canonical $POSTCSS_CJS (Tailwind v4)"
mkdir -p "$(dirname "$POSTCSS_CJS")"
cat > "$POSTCSS_CJS" <<'CFG'
/** Tailwind v4 PostCSS (CJS) */
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
CFG
git add "$POSTCSS_CJS"

# 3) Write a minimal Tailwind config (CJS)
say "==> Write canonical $TAILWIND_CJS"
cat > "$TAILWIND_CJS" <<'CFG'
/** Minimal Tailwind config (CJS) */
module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}", "./components/**/*.{ts,tsx,js,jsx}", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: { extend: {} },
  plugins: [],
};
CFG
git add "$TAILWIND_CJS"

# 4) Ensure globals.css imports Tailwind (v4 uses @import "tailwindcss";)
say "==> Ensure globals.css imports Tailwind"
mkdir -p "$(dirname "$GLOBALS")"
if [ -f "$GLOBALS" ]; then
  # Prepend @import if missing
  if ! grep -q '@import "tailwindcss";' "$GLOBALS"; then
    tmp="$GLOBALS.tmp.$$"
    { echo '@import "tailwindcss";'; cat "$GLOBALS"; } > "$tmp"
    mv "$tmp" "$GLOBALS"
  fi
else
  cat > "$GLOBALS" <<'CSS'
@import "tailwindcss";
:root { color-scheme: light dark; }
html, body { margin: 0; padding: 0; }
CSS
fi
git add "$GLOBALS"

# 5) Ensure deps: install tailwindcss + @tailwindcss/postcss at app level
say "==> Ensure tailwind deps at $APP"
npm --prefix "$APP" install -D tailwindcss @tailwindcss/postcss autoprefixer >/dev/null 2>&1 || \
npm --prefix "$APP" install -D tailwindcss @tailwindcss/postcss autoprefixer

# 6) Commit and build
say "==> Commit"
git commit -m "build: Tailwind v4 PostCSS migration (use @tailwindcss/postcss; canonical .cjs configs)" || true

say "==> Proof build"
( cd "$APP" && npm run build )
say "✅ Tailwind v4/PostCSS config is fixed."
