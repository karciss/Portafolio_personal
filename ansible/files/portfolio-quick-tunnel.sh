#!/usr/bin/env bash
set -euo pipefail

url_file="/var/lib/carolina-portfolio/quick-tunnel-url"
mkdir -p "$(dirname "$url_file")"
rm -f "$url_file" "${url_file}.tmp"

/usr/bin/cloudflared tunnel --no-autoupdate --url http://127.0.0.1:80 2>&1 |
  while IFS= read -r line; do
    printf '%s\n' "$line"
    if [[ "$line" =~ (https://[[:alnum:]-]+\.trycloudflare\.com) ]]; then
      printf '%s\n' "${BASH_REMATCH[1]}" > "${url_file}.tmp"
      mv "${url_file}.tmp" "$url_file"
    fi
  done
