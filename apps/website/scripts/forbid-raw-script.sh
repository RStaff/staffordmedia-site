#!/usr/bin/env bash
set -euo pipefail
# Fail if any TSX contains raw <script ...> or HTML <!-- ... -->
if grep -RIn --include="*.tsx" "<script" app/ | grep -v 'next/script' >/dev/null 2>&1; then
  echo "❌ Found raw <script> in TSX. Use \`import Script from \"next/script\"\`."; exit 1;
fi
if grep -RIn --include="*.tsx" "<!--" app/ >/dev/null 2>&1; then
  echo "❌ Found HTML comments in TSX. Use {/* ... */}."; exit 1;
fi
echo "✅ No forbidden patterns."
