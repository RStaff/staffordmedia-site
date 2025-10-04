#!/usr/bin/env bash
set -euo pipefail

APP="apps/website"
APP_TSC="$APP/tsconfig.json"
ROOT_TSC="tsconfig.json"
WF_DIR=".github/workflows"
WF_FILE="$WF_DIR/ci.yml"

MODE="plan"   # plan | apply
DO_BUILD=1
SKIP_CI=0

usage(){ echo "Usage: $0 [--apply] [--plan] [--no-build] [--no-ci]"; exit 0; }
if [ "$#" -gt 0 ]; then
  for arg in "$@"; do
    case "$arg" in
      --apply) MODE="apply" ;;
      --plan) MODE="plan" ;;
      --no-build) DO_BUILD=0 ;;
      --no-ci) SKIP_CI=1 ;;
      -h|--help) usage ;;
      *) echo "Unknown arg: $arg"; exit 2 ;;
    esac
  done
fi

say(){ printf '%s\n' "$*"; }
do_or_echo(){ [ "$MODE" = "apply" ] && eval "$1" || echo "[PLAN] $1"; }

ensure_json () {
  local file="$1" js="$2"
  node -e "
    const fs=require('fs'), f='$file';
    const j = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f,'utf8')) : {};
    $js
    fs.writeFileSync(f, JSON.stringify(j,null,2)+'\n');
  "
}

ensure_file_with () {
  local file="$1" content="$2"
  if [ -f "$file" ]; then return 0; fi
  if [ "$MODE" = "apply" ]; then
    mkdir -p "$(dirname "$file")"
    printf '%s\n' "$content" > "$file"
  else
    say "[PLAN] create $file"
  fi
}

git_mv_or_add () {
  local from="$1" to="$2"
  if [ "$MODE" = "apply" ]; then
    mkdir -p "$(dirname "$to")"
    if git ls-files --error-unmatch "$from" >/dev/null 2>&1; then
      git mv -f "$from" "$to"
    else
      mv -f "$from" "$to"
      git add "$to"
    fi
  else
    say "[PLAN] move $from -> $to"
  fi
}

say "==> 0) Preconditions"
[ -d "$APP" ] || { echo "ERROR: $APP not found"; exit 1; }

say "==> 1) One workspace at the repo root (private + workspaces)"
ensure_json package.json '
  j.private = true;
  if(!Array.isArray(j.workspaces) || j.workspaces.length===0){ j.workspaces = ["apps/*"]; }
'
say "    ✓ private/workspaces enforced"

say "==> 2) App package basics (scripts + engine guard)"
ensure_json "$APP/package.json" '
  j.name = j.name || "website";
  j.scripts = j.scripts || {};
  j.scripts.build = j.scripts.build || "next build";
  j.scripts["playwright:install"] = j.scripts["playwright:install"] || "playwright install --with-deps || true";
  j.scripts["test:e2e"] = j.scripts["test:e2e"] || "playwright test || true";
  j.engines = j.engines || {};
  j.engines.node = ">=20 <=22";
'
say "    ✓ scripts & engines set"

say "==> 3) Build-tool configs (CJS) + Tailwind v4 PostCSS plugin"
ensure_file_with "$APP/postcss.config.cjs" 'module.exports = { plugins: { "@tailwindcss/postcss": {}, autoprefixer: {} } };'
ensure_file_with "$APP/tailwind.config.cjs" 'module.exports = { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"], theme: { extend: {} }, plugins: [] };'

if [ "$MODE" = "apply" ]; then
  if ! (jq -e '.devDependencies["@tailwindcss/postcss"] // .dependencies["@tailwindcss/postcss"]' "$APP/package.json" >/dev/null 2>&1); then
    npm --prefix "$APP" install -D @tailwindcss/postcss >/dev/null 2>&1 || npm --prefix "$APP" install -D @tailwindcss/postcss
  fi
fi
say "    ✓ postcss/tailwind configs ready (+ @tailwindcss/postcss ensured)"

say "==> 4) Canonical globals.css & layout import"
ensure_file_with "$APP/app/globals.css" ':root{color-scheme:light dark} html,body{margin:0;padding:0}'
# collect duplicates tracked in git (exclude canonical)
mapfile -t DUPS < <(git ls-files | grep -E '(^|/)app/globals\.css$' | grep -v "^$APP/app/globals.css" || true)
if [ "${#DUPS[@]}" -gt 0 ]; then
  if [ "$MODE" = "apply" ]; then
    git rm -f "${DUPS[@]}" || true
  else
    say "[PLAN] git rm ${DUPS[*]}"
  fi
fi
LAYOUT="$APP/app/layout.tsx"
if [ -f "$LAYOUT" ] && ! grep -q "['\"]\.\/globals\.css['\"]" "$LAYOUT"; then
  if [ "$MODE" = "apply" ]; then
    tmp="$LAYOUT.tmp.$$"
    { echo 'import "./globals.css"'; cat "$LAYOUT"; } > "$tmp"
    mv "$tmp" "$LAYOUT"
    git add "$LAYOUT"
  else
    say "[PLAN] prepend import \"./globals.css\" to $LAYOUT"
  fi
fi
say "    ✓ globals.css canonicalized"

say "==> 5) TypeScript alias: app owns @/* -> src/*"
ensure_file_with "$APP_TSC" '{}'
ensure_json "$APP_TSC" '
  j.extends = j.extends || "../../tsconfig.json";
  j.compilerOptions = j.compilerOptions || {};
  j.compilerOptions.baseUrl = ".";
  j.compilerOptions.moduleResolution = "Bundler";
  j.compilerOptions.paths = j.compilerOptions.paths || {};
  j.compilerOptions.paths["@/*"] = ["src/*"];
  j.include = Array.from(new Set(["app","components","lib","src","next-env.d.ts",".next/types/**/*.ts","**/*.ts","**/*.tsx"]));
'
if [ -f "$ROOT_TSC" ]; then
  ensure_json "$ROOT_TSC" '
    j.compilerOptions = j.compilerOptions || {};
    if(j.compilerOptions.paths && j.compilerOptions.paths["@/*"]) {
      delete j.compilerOptions.paths["@/*"];
      if (Object.keys(j.compilerOptions.paths).length===0) delete j.compilerOptions.paths;
    }
  '
fi
say "    ✓ @/* resolves to app/src/*"

say "==> 6) Place lib/config under app/src/lib/config.ts (move if found)"
mkdir -p "$APP/src/lib"
mapfile -t CFG < <(git ls-files | grep -E '(^|/)lib/config\.(ts|tsx|js|mjs|cjs)$' || true)
DEST="$APP/src/lib/config.ts"
if [ "${#CFG[@]}" -gt 0 ]; then
  PICK=""
  for f in "${CFG[@]}"; do [[ "$f" == $APP/* ]] && { PICK="$f"; break; }; done
  [[ -n "$PICK" ]] || PICK="${CFG[0]}"
  if [ "$PICK" != "$DEST" ]; then git_mv_or_add "$PICK" "$DEST"; fi
else
  ensure_file_with "$DEST" $'export const PRICE_BASIC="$0";\nexport const PRICE_GROWTH="$0";\nexport const PRICE_PRO="$0";\nexport const TRIAL_URL="https://example.com/start";'
fi
say "    ✓ lib/config in app src"

say "==> 7) CI workflow (Node 22.x; workspace install/build website)"
if [ "$SKIP_CI" -eq 0 ]; then
  mkdir -p "$WF_DIR"
  if [ ! -f "$WF_FILE" ]; then
    ensure_file_with "$WF_FILE" '
name: CI
on:
  pull_request:
    branches: ["*"]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 🔧 Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "22.x"
          cache: npm
      - name: 📦 Install deps (workspace root)
        run: |
          if [ ! -f package-lock.json ]; then npm install --workspaces; fi
          npm ci --workspaces
      - name: 🎭 Install Playwright (optional)
        run: npm run -w website playwright:install
      - name: 🏗️ Build (production, website workspace only)
        run: npm run -w website build
      - name: ✅ E2E tests (optional)
        run: npm run -w website test:e2e
'
  else
    if [ "$MODE" = "apply" ]; then
      perl -0777 -pe 's/actions\/setup-node@v4[^\n]*\n(\s*with:\n)?(?:[\s\S]*?node-version:[^\n]*\n)?/actions\/setup-node@v4\n        with:\n          node-version: "22.x"\n          cache: npm\n/g' -i "$WF_FILE"
      perl -0777 -pe 's/run:\s*npm\s+ci(\b[^\n]*)?/run: |\n          if [ ! -f package-lock.json ]; then npm install --workspaces; fi\n          npm ci --workspaces\n/g' -i "$WF_FILE"
      perl -0777 -pe 's/run:\s*(npx\s+next\s+build|npm\s+run\s+build(:prod)?)/run: npm run -w website build$2/g' -i "$WF_FILE"
    else
      say "[PLAN] normalize $WF_FILE to Node 22.x + workspaces"
    fi
  fi
  say "    ✓ CI normalized"
else
  say "    ↷ skipping CI edits (--no-ci)"
fi

say "==> 8) Git hygiene (.gitignore + untrack node_modules/.next)"
ensure_file_with ".gitignore" $'node_modules/\n.next/\n'
if [ "$MODE" = "apply" ]; then
  git add .gitignore || true
  git rm -r --cached "$APP/node_modules" 2>/dev/null || true
  git rm -r --cached node_modules 2>/dev/null || true
  git rm -r --cached "$APP/.next" 2>/dev/null || true
else
  say "[PLAN] git add .gitignore; git rm -r --cached node_modules .next"
fi
say "    ✓ node_modules/.next kept out of git"

say "==> 9) Install at root (single source of truth)"
if [ "$MODE" = "apply" ]; then
  npm install --workspaces >/dev/null 2>&1 || npm install --workspaces
else
  say "[PLAN] npm install --workspaces"
fi

say "==> 10) Optional local proof build (Next prod build)"
if [ "$MODE" = "apply" ] && [ "$DO_BUILD" -eq 1 ]; then
  (cd "$APP" && npm run build)
else
  say "[PLAN] (skip) npm run -w website build"
fi

say
say "✅ Done ($MODE)."
[ "$MODE" = "plan" ] && say "Run again with --apply to write changes."
