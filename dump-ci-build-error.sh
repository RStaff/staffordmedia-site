#!/usr/bin/env bash
set -euo pipefail

# Requires: gh (logged in), run from repo root
BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"

echo "Looking for latest PR run on branch: $BRANCH"
RUN_ID="$(gh run list --event pull_request -L 30 --json databaseId,headBranch \
  -q ".[] | select(.headBranch==\"$BRANCH\") | .databaseId" | head -n1 || true)"

if [ -z "${RUN_ID:-}" ]; then
  echo "No PR run found for $BRANCH."; exit 0
fi

JOB_ID="$(gh run view "$RUN_ID" --json jobs \
  -q '.jobs[] | select(.name=="build-and-test") | .job_id' || true)"

echo
echo "Run: $RUN_ID  |  Job: ${JOB_ID:-<unknown>}"
echo "---- BUILD SECTION (from “🏗️ Build”) ----"
gh run view "$RUN_ID" --job "$JOB_ID" --log \
  | sed -n '/🏗️ Build/,$p' \
  | sed -n '/🏗️ Build/,/^[[:space:]]*[-✓X] /p' || true

echo
echo "---- COMMON ERROR HEADS (first 50 lines after failure) ----"
gh run view "$RUN_ID" --job "$JOB_ID" --log \
  | awk '/^Error|Failed to compile|Module not found|Type error|npm error|Syntax Error/ {print; c++} c>=50 {exit}'
