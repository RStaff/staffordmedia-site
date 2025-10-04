#!/usr/bin/env bash
set -euo pipefail

say(){ printf "\n🔧 %s\n" "$*"; }

# 1) Ensure Husky is installed correctly
say "Install Husky (root cause fix)"
npm install --save-dev husky@9 lint-staged prettier vitest @testing-library/react @testing-library/jest-dom jsdom

npx husky init
mkdir -p .husky

cat > .husky/pre-commit <<'HOOK'
#!/usr/bin/env sh
. "$(dirname "$0")/_/husky.sh"

# fast staged formatting + lint-fix
npx lint-staged

# run full check
npm run -w website check
npm run -w website test
HOOK
chmod +x .husky/pre-commit

# 2) Add lint-staged config at root
npx --yes json -I -f package.json -e '
  this["lint-staged"] = {
    "**/*.{ts,tsx,js,jsx,json,md,css}": ["prettier --write"],
    "apps/website/**/*.{ts,tsx}": ["eslint --fix"]
  }'

# 3) Add minimal test setup in apps/website
APP="apps/website"
TESTDIR="$APP/tests"
mkdir -p "$TESTDIR"

cat > "$APP/vitest.config.ts" <<'TS'
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts",
  },
});
TS

cat > "$TESTDIR/setup.ts" <<'TS'
import "@testing-library/jest-dom";
TS

cat > "$TESTDIR/smoke.test.tsx" <<'TSX'
import { render, screen } from "@testing-library/react";
import Hero from "../app/components/Hero";

test("renders headline", () => {
  render(<Hero variant="roi" />);
  expect(screen.getByText(/ROI/i)).toBeInTheDocument();
});
TSX

# 4) Add test script to apps/website/package.json
node - <<'NODE'
const fs = require("fs");
const path = "apps/website/package.json";
const pkg = JSON.parse(fs.readFileSync(path,"utf8"));
pkg.scripts ||= {};
pkg.scripts.test = "vitest run --config vitest.config.ts";
fs.writeFileSync(path, JSON.stringify(pkg,null,2) + "\n");
console.log("✅ website test script added");
NODE

# 5) Update CI workflow
mkdir -p .github/workflows
cat > .github/workflows/quality.yml <<'YML'
name: Quality
on:
  pull_request:
  push:
    branches: ["**"]
permissions: { contents: read }
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "22.x", cache: npm }
      - name: Install (workspace root)
        run: npm ci --workspaces
      - name: Lint + Typecheck + Guards
        run: npm run -w website check
      - name: Run Tests
        run: npm run -w website test
      - name: Build
        run: npm run -w website build
YML

say "✅ Guardrails hardened: Husky fixed, smoke test added, CI updated."
say "Next:"
echo "1) Run: npm ci --workspaces"
echo "2) Try a commit — pre-commit will run lint, typecheck, tests."
echo "3) Push to GitHub and protect 'main' with Quality workflow required."
