#!/usr/bin/env bash
set -euo pipefail

VERSION="2.0"

# ===================== Defaults (override via env or flags) =====================
STAFFORD_DOMAIN="${STAFFORD_DOMAIN:-staffordmedia.ai}"
ABANDO_DOMAIN="${ABANDO_DOMAIN:-abando.ai}"

STAFFORD_STATUS_PATH="${STAFFORD_STATUS_PATH:-/api/status}"
ABANDO_STATUS_PATH="${ABANDO_STATUS_PATH:-/api/status}"

TIMEOUT="${TIMEOUT:-15}"
RETRIES="${RETRIES:-2}"
BACKOFF_SECS="${BACKOFF_SECS:-2}"

JSON_OUT=""
QUICK=0
VERBOSE=0
SOFT=0
NO_COLOR=0

# ===================== CLI flags =====================
usage() {
  cat <<EOF
SMC ↔ Abando Diagnostics v$VERSION

Usage:
  $(basename "$0") [--quick] [--verbose] [--soft] [--no-color]
                   [--json report.json]
                   [--stafford-domain d] [--abando-domain d]
                   [--stafford-status /path] [--abando-status /path]
                   [--timeout sec] [--retries n] [--backoff sec]

Examples:
  ./smc-abando-diagnose.sh
  STAFFORD_DOMAIN=www.staffordmedia.ai ABANDO_DOMAIN=www.abando.ai ./smc-abando-diagnose.sh
  ./smc-abando-diagnose.sh --json diag.json --quick
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --quick) QUICK=1; shift;;
    --verbose) VERBOSE=1; shift;;
    --soft) SOFT=1; shift;;
    --no-color) NO_COLOR=1; shift;;
    --json) JSON_OUT="${2:-}"; shift 2;;
    --stafford-domain) STAFFORD_DOMAIN="${2}"; shift 2;;
    --abando-domain) ABANDO_DOMAIN="${2}"; shift 2;;
    --stafford-status) STAFFORD_STATUS_PATH="${2}"; shift 2;;
    --abando-status) ABANDO_STATUS_PATH="${2}"; shift 2;;
    --timeout) TIMEOUT="${2}"; shift 2;;
    --retries) RETRIES="${2}"; shift 2;;
    --backoff) BACKOFF_SECS="${2}"; shift 2;;
    -h|--help) usage; exit 0;;
    *) echo "Unknown flag: $1"; usage; exit 2;;
  esac
done

# ===================== Colors =====================
if [[ "$NO_COLOR" = "1" || -n "${NO_COLOR:-}" ]]; then
  C_RESET=''; C_GREEN=''; C_RED=''; C_YEL=''; C_BLUE='';
else
  C_RESET='\033[0m'; C_GREEN='\033[0;32m'; C_RED='\033[0;31m'; C_YEL='\033[0;33m'; C_BLUE='\033[0;34m';
fi
ok(){ printf "${C_GREEN}✓ %s${C_RESET}\n" "$*"; }
warn(){ printf "${C_YEL}⚠ %s${C_RESET}\n" "$*"; }
err(){ printf "${C_RED}✗ %s${C_RESET}\n" "$*"; }
info(){ printf "${C_BLUE}→ %s${C_RESET}\n" "$*"; }
debug(){ [[ $VERBOSE -eq 1 ]] && printf "… %s\n" "$*"; }
dash(){ printf "%0.s─" $(seq 1 72); echo; }

have(){ command -v "$1" >/dev/null 2>&1; }

need_tools(){
  local need=(curl grep awk sed tr dig openssl)
  local miss=0
  for t in "${need[@]}"; do
    have "$t" || { err "Missing tool: $t"; miss=1; }
  done
  [[ $miss -eq 0 ]] || exit 1
}

# curl wrappers (retries + timeouts + follows redirects; strips CRs)
curl_head(){
  local url="$1"
  curl -sSIL --retry "$RETRIES" --retry-delay "$BACKOFF_SECS" \
       --max-time "$TIMEOUT" -H "User-Agent: smc-diagnose/$VERSION" "$url" | tr -d '\r'
}
curl_get(){
  local url="$1"
  curl -sS --retry "$RETRIES" --retry-delay "$BACKOFF_SECS" \
       --max-time "$TIMEOUT" -H "User-Agent: smc-diagnose/$VERSION" "$url"
}
curl_options(){
  local url="$1" origin="$2"
  curl -sSIL -X OPTIONS --retry "$RETRIES" --retry-delay "$BACKOFF_SECS" \
       --max-time "$TIMEOUT" -H "Origin: https://${origin}" \
       -H "Access-Control-Request-Method: GET" "$url" | tr -d '\r'
}

json_escape(){ python - <<'PY' 2>/dev/null || perl -0777 -pe 's/"/\\"/g'
import sys,json
print(json.dumps(sys.stdin.read()))
PY
}

collect_json_kv(){ # collect "key":"value"
  local k="$1" v="$2"
  JSON_BUF+=$(printf '"%s":%s,' "$k" "$v")
}

finalize_json(){
  JSON_BUF="${JSON_BUF%,}"
  printf '{%s}\n' "$JSON_BUF"
}

# ===================== Checks =====================
dns_report(){
  local d="$1"; local out
  out="$(dig +short A "$d" 2>/dev/null; dig +short AAAA "$d" 2>/dev/null; dig +short CNAME "$d" 2>/dev/null)"
  if [[ -n "$out" ]]; then
    ok "DNS resolves for $d"
    [[ $VERBOSE -eq 1 ]] && printf "%s\n" "$out" | sed 's/^/    /'
  else
    warn "No DNS records returned for $d"
  fi
  [[ "$out" =~ vercel|cname\.vercel-dns\.com ]] && ok "$d appears to be on Vercel (CNAME/edge detected)"
}

tls_check(){
  local d="$1"
  local days=""
  if out="$(echo | openssl s_client -servername "$d" -connect "$d:443" 2>/dev/null | openssl x509 -noout -issuer -enddate 2>/dev/null)"; then
    local issuer end raw_date
    issuer="$(printf "%s" "$out" | awk -F'issuer=' 'NF>1{print $2}' | sed 's/^ *//')"
    end="$(printf "%s" "$out" | awk -F'notAfter=' 'NF>1{print $2}' | sed 's/^ *//')"
    if have date; then
      if [[ "$(uname -s)" == "Darwin" ]]; then
        raw_date="$(date -j -f "%b %e %T %Y %Z" "$end" "+%s" 2>/dev/null || true)"
      else
        raw_date="$(date -d "$end" "+%s" 2>/dev/null || true)"
      fi
      now="$(date "+%s")"
      [[ -n "$raw_date" ]] && days="$(( (raw_date - now) / 86400 ))"
    fi
    ok "TLS OK for https://$d (issuer: ${issuer:-?}; expires in ${days:-?} days)"
  else
    warn "Could not inspect TLS certificate for $d"
  fi
}

http_overview(){
  local d="$1"
  local hdr; hdr="$(curl_head "https://${d}" || true)"
  if echo "$hdr" | grep -q '^HTTP/'; then
    local code; code="$(printf "%s" "$hdr" | sed -n '1s/^HTTP[^ ]* //p' | awk '{print $1}')"
    [[ "$code" =~ ^2|3 ]] && ok "HTTPS reachable for $d (HTTP $code)" || warn "Non-2xx/3xx for $d (HTTP $code)"
    # Surface Vercel header if present
    local vx; vx="$(printf "%s" "$hdr" | awk -F': ' 'BEGIN{IGNORECASE=1}/^x-vercel-id/{print $2}' | tail -n1)"
    [[ -n "$vx" ]] && ok "x-vercel-id: $vx"
  else
    err "No HTTP response from $d"
  fi
}

fetch_robots_sitemap(){
  local d="$1"
  local robots_url="https://${d}/robots.txt"
  local robots sm_url sm
  robots="$(curl_get "$robots_url" || true)"
  if [[ -n "$robots" ]]; then
    ok "$d robots.txt present"
  else
    warn "$d robots.txt missing"
  fi
  sm_url="$(printf "%s" "$robots" | grep -i \'^sitemap:\' | head -n1 | cut -d\' \' -f2- | tr -d \'[:space:]\')"
  [[ -n "$sm_url" ]] || sm_url="https://${d}/sitemap.xml"

  # try plain + gzip
  sm="$(curl_get "$sm_url" || true)"
  if [[ -z "$sm" ]]; then
    sm="$(curl -sS --max-time "$TIMEOUT" --retry "$RETRIES" --retry-delay "$BACKOFF_SECS" \
            -H "User-Agent: smc-diagnose/$VERSION" "$sm_url" | gunzip -c 2>/dev/null || true)"
  fi

  if [[ -n "$sm" ]]; then
    ok "$d sitemap present ($sm_url)"
  else
    warn "$d sitemap missing ($sm_url)"
  fi

  SITEMAP_CONTENT="$sm"
}

sitemap_crosslink(){
  local from_d="$1" to_d="$2" xml="$3"
  if [[ -z "$xml" ]]; then
    warn "No sitemap content for $from_d to inspect cross-links"
    return
  fi
  # Prefer XML <loc> nodes, fall back to generic URL regex
  if printf "%s" "$xml" | grep -oE '<loc>[^<]+' | grep -q "$to_d"; then
    ok "Sitemap($from_d) references $to_d"
  elif printf "%s" "$xml" | grep -qE "https?://[^\"'<>]*${to_d}"; then
    ok "Sitemap($from_d) references $to_d (non-<loc> match)"
  else
    warn "Sitemap($from_d) does NOT reference $to_d"
  fi
}

status_probe(){
  local d="$1" primary="$2"
  local base="https://${d}" code body path
  local tries=("$primary" "/api/health" "/health" "/healthz")
  for path in "${tries[@]}"; do
    body="$(curl -sS -w '\n%{http_code}' --max-time "$TIMEOUT" "$base$path" 2>/dev/null || true)"
    code="$(printf "%s" "$body" | tail -n1)"
    content="$(printf "%s" "$body" | sed '$d')"
    if [[ "$code" =~ ^2 ]]; then
      ok "Status OK $d$path (HTTP $code)"
      [[ $VERBOSE -eq 1 ]] && printf "%s\n" "$content" | sed -n '1,10p' | sed 's/^/    /'
      echo "$path"; return 0
    fi
  done
  warn "No status endpoint responded on $d"
  echo ""; return 1
}

cors_probe_pair(){
  local origin_d="$1" target_d="$2" status_path="$3"
  local target="https://${target_d}${status_path:-/}"
  dash; info "CORS: Origin https://${origin_d} → ${target}"
  # OPTIONS preflight (best signal)
  local opt; opt="$(curl_options "$target" "$origin_d" || true)"
  local allow_o; allow_o="$(printf "%s" "$opt" | awk -F': ' 'BEGIN{IGNORECASE=1}/^Access-Control-Allow-Origin/{print $2}' | tail -n1)"
  local allow_m; allow_m="$(printf "%s" "$opt" | awk -F': ' 'BEGIN{IGNORECASE=1}/^Access-Control-Allow-Methods/{print $2}' | tail -n1)"
  if [[ -n "$allow_o" ]]; then
    ok "Preflight ACAO: $allow_o"
    [[ -n "$allow_m" ]] && ok "Preflight ACAM: $allow_m"
  else
    warn "No ACAO on preflight; trying HEAD…"
    local hdr; hdr="$(curl_head "https://${target_d}" || true)"
    local head_acao; head_acao="$(printf "%s" "$hdr" | awk -F': ' 'BEGIN{IGNORECASE=1}/^Access-Control-Allow-Origin/{print $2}' | tail -n1)"
    if [[ -n "$head_acao" ]]; then
      ok "HEAD ACAO: $head_acao"
    else
      warn "No visible ACAO; API may still set it dynamically on GET/POST routes."
    fi
  fi
}

# ===================== Run =====================
need_tools
echo
dash; echo "SMC ↔ Abando Diagnostics v$VERSION"; dash
printf "Stafford: %s\nAbando:  %s\n" "$STAFFORD_DOMAIN" "$ABANDO_DOMAIN"
[[ $QUICK -eq 1 ]] && info "Quick mode enabled (skips some verbosity)"

CRIT_FAIL=0
JSON_BUF=""

for D in "$STAFFORD_DOMAIN" "$ABANDO_DOMAIN"; do
  dash; info "DNS/TLS/HTTPS for $D"
  dns_report "$D" || true
  tls_check "$D"  || true
  http_overview "$D" || { CRIT_FAIL=1; true; }
done

dash; info "robots/sitemap for $STAFFORD_DOMAIN"
fetch_robots_sitemap "$STAFFORD_DOMAIN"; SM_S="$SITEMAP_CONTENT"

dash; info "robots/sitemap for $ABANDO_DOMAIN"
fetch_robots_sitemap "$ABANDO_DOMAIN"; SM_A="$SITEMAP_CONTENT"

dash; info "Cross-link check"
sitemap_crosslink "$STAFFORD_DOMAIN" "$ABANDO_DOMAIN" "$SM_S"
sitemap_crosslink "$ABANDO_DOMAIN" "$STAFFORD_DOMAIN" "$SM_A"

[[ $QUICK -eq 1 ]] || {
  dash; info "Status endpoints"
}

USED_S="$(status_probe "$STAFFORD_DOMAIN" "$STAFFORD_STATUS_PATH" || true)"
USED_A="$(status_probe "$ABANDO_DOMAIN" "$ABANDO_STATUS_PATH" || true)"

[[ -n "$USED_S" ]] && ok "Stafford status path: $USED_S" || { warn "Stafford status missing"; }
[[ -n "$USED_A" ]] && ok "Abando status path:   $USED_A" || { warn "Abando status missing"; }

# CORS (only if we found some path; else still try root)
cors_probe_pair "$STAFFORD_DOMAIN" "$ABANDO_DOMAIN" "$USED_A"
cors_probe_pair "$ABANDO_DOMAIN" "$STAFFORD_DOMAIN" "$USED_S"

dash; info "Summary"
printf "  Stafford domain:  %s\n" "$STAFFORD_DOMAIN"
printf "  Abando domain:    %s\n" "$ABANDO_DOMAIN"
printf "  Stafford status:  %s\n" "${USED_S:-none}"
printf "  Abando status:    %s\n" "${USED_A:-none}"
echo

# Recommendations
[[ -z "$USED_S" ]] && warn "Add GET ${STAFFORD_STATUS_PATH} (or /api/health) returning JSON {service:'staffordmedia', connected_to:'abando.ai'}"
[[ -z "$USED_A" ]] && warn "Add GET ${ABANDO_STATUS_PATH} (or /api/health) returning JSON {service:'abando', connected_to:'staffordmedia.ai'}"

# JSON report (lightweight)
if [[ -n "$JSON_OUT" ]]; then
  JSON_BUF=""
  collect_json_kv "stafford_domain" "$(printf '"%s"' "$STAFFORD_DOMAIN")"
  collect_json_kv "abando_domain"   "$(printf '"%s"' "$ABANDO_DOMAIN")"
  collect_json_kv "stafford_status"  "$(printf '"%s"' "${USED_S:-}")"
  collect_json_kv "abando_status"    "$(printf '"%s"' "${USED_A:-}")"
  REPORT="$(finalize_json)"
  printf "%s\n" "$REPORT" > "$JSON_OUT"
  ok "Wrote JSON report → $JSON_OUT"
fi

if [[ $SOFT -eq 0 ]]; then
  if [[ -z "${USED_S:-}" || -z "${USED_A:-}" ]]; then
    err "Critical: one or both status endpoints missing"
    exit 10
  fi
fi

ok "Diagnostics complete."
