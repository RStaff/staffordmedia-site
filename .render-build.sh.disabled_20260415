#!/usr/bin/env bash
set -euo pipefail
cd _smc_clean
npm ci --include=optional --no-audit --no-fund
npm run build
mkdir -p .next/standalone/.next
cp -R .next/static .next/standalone/.next/static
cp -R public .next/standalone/public
