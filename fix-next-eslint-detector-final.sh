set -euo pipefail

say(){ printf '\n▶ %s\n' "$*"; }

APP="apps/website"
PKG="$APP/package.json"
CFG="$APP/eslint.config.js"
ESLINTRC="$APP/.eslintrc.json"

[ -f "$PKG" ] || { echo "❌ $PKG not found. Run this from the repo root."; exit 1; }

say "Install lint deps in the website workspace"
npm i -D -w website eslint@^9 typescript-eslint@^8 @next/eslint-plugin-next@^15 eslint-config-prettier eslint-plugin-import >/dev/null

say "Write flat eslint.config.js (TypeScript + Next + Prettier)"
cat > "$CFG" <<'JS'
import tseslint from "typescript-eslint";
import next from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";

export default [
  { ignores: ["node_modules/**", ".next/**", "dist/**"] },
  ...tseslint.configs.recommended,
  {
    plugins: { "@next/next": next, import: pluginImport },
    rules: {
      ...next.configs["core-web-vitals"].rules,
      "import/order": ["warn", { alphabetize: { order: "asc" } }],
    },
    languageOptions: { parserOptions: { ecmaVersion: "latest", sourceType: "module" } },
  },
  prettier,
];
// Flat config drives ESLint; the file below only satisfies Next's detector.
JS

say "Add tiny detector shim for Next (legacy extends)"
cat > "$ESLINTRC" <<'JSON'
{
  "extends": ["next/core-web-vitals"]
}
JSON

say "Ensure website scripts exist (pass a REAL path to node, not STDIN)"
node - "$PKG" <<'NODE'
const fs = require('fs'); 
const p = process.argv[1];
const pkg = JSON.parse(fs.readFileSync(p,'utf8'));
pkg.scripts ||= {};
pkg.scripts.lint ||= 'eslint app components src --ext .ts,.tsx --max-warnings=0 --cache --cache-location .eslintcache';
pkg.scripts.typecheck ||= 'tsc -p tsconfig.json --noEmit';
pkg.scripts.build ||= 'next build';
pkg.scripts.check ||= 'npm run lint && npm run typecheck';
fs.writeFileSync(p, JSON.stringify(pkg, null, 2) + '\n');
console.log(`… scripts ensured in ${p}`);
NODE

say "Run lint"
npm run -w website lint

say "Run typecheck"
npm run -w website typecheck

say "Run build (Next ESLint warning should be gone)"
npm run -w website build

printf '\n✅ Next ESLint plugin detected (warning silenced) and rules active under flat config.\n'
