#!/usr/bin/env bash
set -euo pipefail

# -------- config (env overridable) ----------
REPO="${REPO:-RStaff/staffordmedia-site}"   # owner/name
BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '')}"
EVENT_FILTER="${EVENT_FILTER:-pull_request}" # or 'push'
JOB_MATCH="${JOB_MATCH:-build-and-test}"
TIMEOUT_MIN="${TIMEOUT_MIN:-30}"
GET_ARTIFACTS="${GET_ARTIFACTS:-false}"
DEPLOY="${DEPLOY:-false}"
NUDGE_LIMIT="${NUDGE_LIMIT:-6}"

# -------- tiny log helpers ----------
say_info(){ printf "→ %s\n" "$*"; }
say_ok(){   printf "✓ %s\n" "$*"; }
say_warn(){ printf "⚠ %s\n" "$*"; }
say_err(){  printf "✗ %s\n" "$*" >&2; }

# -------- prerequisites ----------
need(){ command -v "$1" >/dev/null 2>&1 || { say_err "Please install $1"; exit 1; }; }
need gh
need jq
gh auth status >/dev/null 2>&1 || { say_err "gh is not authenticated"; exit 1; }

# Derive REPO from origin if not provided
if [[ -z "${REPO}" || "$REPO" == "/" ]]; then
  origin_url="$(git remote get-url origin 2>/dev/null || true)"
  if [[ "$origin_url" =~ github.com[:/]+([^/]+/[^/.]+) ]]; then
    REPO="${BASH_REMATCH[1]}"
  else
    say_err "Set REPO=owner/name"; exit 1
  fi
fi

say_info "Repo:   $REPO"
say_info "Branch: ${BRANCH:-<none>}"
say_info "Event:  $EVENT_FILTER"
say_info "Job re: $JOB_MATCH"

# -------- helpers ----------
get_run_id() {
  gh run list -R "$REPO" --event "$EVENT_FILTER" -L 50 \
    --json databaseId,headBranch,status \
    -q ".[] | select(.headBranch==\"$BRANCH\") | .databaseId" | head -n1
}

summarize_run() {
  gh run view -R "$REPO" "$1" --json workflowName,status,conclusion,headSha,url \
    | jq -r '"Run «\(.workflowName)» | status=\(.status) | conclusion=\(.conclusion) | sha=\(.headSha) | \(.url)"'
}

wait_for_run() { # portable (no GNU timeout)
  local rid="$1" max_secs=$(( TIMEOUT_MIN*60 )) start now elapsed status
  start="$(date +%s)"
  while :; do
    status="$(gh run view -R "$REPO" "$rid" --json status -q .status 2>/dev/null || echo "")"
    [[ "$status" == "completed" ]] && return 0
    now="$(date +%s)"; elapsed=$(( now-start ))
    (( elapsed >= max_secs )) && return 1
    sleep 6
  done
}

# -------- find or nudge a run ----------
RUN_ID="$(get_run_id || true)"
attempt=0
while [[ -z "${RUN_ID:-}" && $attempt -lt $NUDGE_LIMIT ]]; do
  attempt=$((attempt+1))
  say_warn "No run yet for $BRANCH (attempt $attempt/$NUDGE_LIMIT). Nudging with empty commit…"
  git commit --allow-empty -m "ci: nudge watcher $(date -u +%FT%TZ)" >/dev/null 2>&1 || true
  git push --force-with-lease origin "$BRANCH" >/dev/null 2>&1 || say_warn "Push failed; continuing…"
  sleep 5
  RUN_ID="$(get_run_id || true)"
done

[[ -z "${RUN_ID:-}" ]] && { say_err "No CI run found for $BRANCH."; exit 1; }

say_ok "Found CI run: $RUN_ID"
say_info "$(summarize_run "$RUN_ID")"

# Try rerun (ok if denied)
gh run rerun -R "$REPO" "$RUN_ID" >/dev/null 2>&1 || say_warn "Rerun not permitted (already queued/running?)"

say_info "Watching run (max ${TIMEOUT_MIN}m)…"
if ! wait_for_run "$RUN_ID"; then
  say_warn "Timed out waiting for run $RUN_ID"
fi

say_info "Final status:"
gh run view -R "$REPO" "$RUN_ID" --json status,conclusion,url \
  | jq -r '"  status=\(.status)  conclusion=\(.conclusion)  url=\(.url)"'

# -------- fetch job logs ----------
jobs_json=""
for _ in 1 2 3 4 5; do
  jobs_json="$(gh run view -R "$REPO" "$RUN_ID" --json jobs 2>/dev/null || true)"
  [[ -n "$jobs_json" && "$jobs_json" != "null" && "$(jq '.jobs|length' <<<"$jobs_json")" -gt 0 ]] && break
  sleep 3
done

job_id="$(jq -r --arg re "$JOB_MATCH" '
  [.jobs[]? | {id:.job_id, name}] 
  | ( map(select(.name==$re)) + map(select(.name|test($re))) )
  | .[0].id // empty
' <<<"$jobs_json")"

if [[ -z "${job_id:-}" ]]; then
  say_warn "Job match «$JOB_MATCH» not found; using first job."
  job_id="$(jq -r '.jobs[0]?.job_id // empty' <<<"$jobs_json" 2>/dev/null || true)"
fi

if [[ -n "${job_id:-}" ]]; then
  say_info "Streaming logs for job $job_id…"
  gh run view -R "$REPO" "$RUN_ID" --job "$job_id" --log | tee "/tmp/ci-$RUN_ID.log" || true

  if grep -q "Failed to compile\." "/tmp/ci-$RUN_ID.log"; then
    say_warn "Detected compile/type-check failure block:"
    awk '
      /Failed to compile\./ {p=1}
      p;
      /Cleaning up orphan processes/ {exit}
    ' "/tmp/ci-$RUN_ID.log" || true
  fi
else
  say_warn "No jobs found on the run."
fi

# -------- artifacts (optional) ----------
if [[ "${GET_ARTIFACTS}" == "true" ]]; then
  say_info "Downloading artifacts…"
  gh run download -R "$REPO" "$RUN_ID" -D "artifacts/$RUN_ID" || say_warn "No artifacts or download failed."
  [[ -d "artifacts/$RUN_ID" ]] && say_ok "Artifacts saved to artifacts/$RUN_ID"
fi

# -------- deploy (optional) ----------
if [[ "${DEPLOY}" == "true" ]]; then
  concl="$(gh run view -R "$REPO" "$RUN_ID" --json conclusion -q .conclusion 2>/dev/null || echo "")"
  if [[ "$concl" == "success" || -z "$concl" || "$concl" == "null" ]]; then
    say_ok "Deploying to Vercel prod…"
    npx vercel --prod --yes || say_warn "Vercel deploy failed."
  else
    say_warn "Skipping deploy; conclusion=$concl"
  fi
fi

say_ok "Done."
