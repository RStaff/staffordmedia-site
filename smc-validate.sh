#!/usr/bin/env bash
set -euo pipefail
SM="${SM:-staffordmedia.ai}"
AB="${AB:-abando.ai}"

echo "== STATUS =="
for U in "https://$SM/api/status" "https://www.$SM/api/status" "https://$AB/api/status"; do
  echo "-- $U"; curl -sS -w "\nHTTP %{http_code}\n" "$U" || true
done

echo; echo "== SEO =="
for f in robots.txt sitemap.xml; do
  echo "-- $f ($SM)"; curl -sS "https://$SM/$f" | head -n 10
  echo "-- $f ($AB)"; curl -sS "https://$AB/$f" | head -n 10
done

echo; echo "== CROSS LINKS =="
curl -sS "https://$SM/sitemap.xml" | grep -qi "$AB" && echo "SM → AB ✅" || echo "SM → AB ❌"
curl -sS "https://$AB/sitemap.xml" | grep -qi "$SM" && echo "AB → SM ✅" || echo "AB → SM ❌"

echo; echo "== CORS PREFLIGHT =="
curl -sSIL -X OPTIONS "https://$SM/api/status" -H "Origin: https://$AB" \
  -H "Access-Control-Request-Method: GET" | head -n 20
curl -sSIL -X OPTIONS "https://$AB/api/status" -H "Origin: https://$SM" \
  -H "Access-Control-Request-Method: GET" | head -n 20
