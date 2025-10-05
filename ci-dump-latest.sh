#!/usr/bin/env bash
set -euo pipefail
OR="$(git config --get remote.origin.url | sed -E 's#^.*github\.com[:/](.+/[^/.]+)(\.git)?$#\1#')"
BR="$(git rev-parse --abbrev-ref HEAD)"
WF_ID="192450929"

RUN_JSON="$(gh api "repos/$OR/actions/workflows/$WF_ID/runs?branch=$BR&per_page=1")"
RUN_ID="$(echo "$RUN_JSON" | jq -r '.workflow_runs[0].id // empty')"
[ -z "$RUN_ID" ] && { echo "No run found for $BR"; exit 1; }

echo "▶ Repo: $OR"
echo "▶ Branch: $BR"
echo "▶ Run: $RUN_ID"
gh run view "$RUN_ID" || true

JOBS_JSON="$(gh api "repos/$OR/actions/runs/$RUN_ID/jobs?per_page=50")"
JOB_COUNT="$(echo "$JOBS_JSON" | jq -r '.jobs | length')"
echo "▶ Job count: $JOB_COUNT"

if [ "$JOB_COUNT" -gt 0 ]; then
  echo "▶ Jobs:"; echo "$JOBS_JSON" | jq -r '.jobs[] | "\(.id)\t\(.name)\t\(.status)/\(.conclusion // "n/a")"'
  JOB_ID="$(echo "$JOBS_JSON" | jq -r '.jobs[0].id')"
  echo "▶ Dumping logs for job $JOB_ID"
  gh run view "$JOB_ID" --log | tee /tmp/ci-job.log
  echo; echo "— error heads —"
  egrep -i -n 'error|failed|not found|cannot|Type error|Syntax|ECONN|ELIFECYCLE|ENOENT|ERR!' /tmp/ci-job.log | head -n 120 || true
else
  echo "⚠ No jobs present. Likely blocked pre-job (policy/permissions) or YAML invalid."
  echo "▶ Run summary JSON:"
  gh api "repos/$OR/actions/runs/$RUN_ID" \
    --jq '{status,conclusion,event,run_attempt,head_branch,head_sha,display_title,path,created_at,updated_at,actor:.actor.login}' \
    || true
fi
