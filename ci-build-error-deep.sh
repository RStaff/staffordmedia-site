#!/usr/bin/env bash
set -euo pipefail

BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"

echo "▶ Branch: $BRANCH"
RUN_ID="$(gh run list --event pull_request -L 40 --json databaseId,headBranch \
  -q ".[] | select(.headBranch==\"$BRANCH\") | .databaseId" | head -n1 || true)"

[ -z "${RUN_ID:-}" ] && { echo "No PR run found for $BRANCH"; exit 0; }

JOB_ID="$(gh run view "$RUN_ID" --json jobs \
  -q '.jobs[] | select(.name=="build-and-test") | .job_id' || true)"

echo "▶ Run: $RUN_ID | Job: ${JOB_ID:-<none>}"
[ -z "${JOB_ID:-}" ] && { echo "Couldn’t find build job"; exit 0; }

# Pull full job log once
TMP="$(mktemp)"
gh run view "$RUN_ID" --job "$JOB_ID" --log > "$TMP"

echo
echo "==== Build section (start→end) ===="
# Print from the start of the Build step to the next step header
awk '
  /🏗️ Build/ { inbuild=1 }
  inbuild { print }
  inbuild && /^[[:space:]]*[-✓X] / { exit }
' "$TMP"

echo
echo "==== Around first 'Syntax Error' (±120 lines) ===="
# Locate first Syntax Error line and print context around it
line=$(nl -ba "$TMP" | awk '/Syntax Error/ {print $1; exit}')
if [ -n "$line" ]; then
  start=$(( line>120 ? line-120 : 1 ))
  end=$(( line+120 ))
  sed -n "${start},${end}p" "$TMP"
else
  echo "(no 'Syntax Error' marker found)"
fi

echo
echo "==== Import trace blocks (if any) ===="
awk '
  /Import trace for requested module:/ { show=1; print; next }
  show && NF==0 { show=0; print ""; next }
  show { print }
' "$TMP"

echo
echo "==== Top error heads (quick skim) ===="
grep -E '^(Error|Failed to compile|Module not found|Type error|npm error|Syntax Error)' "$TMP" | head -n 80

rm -f "$TMP"
