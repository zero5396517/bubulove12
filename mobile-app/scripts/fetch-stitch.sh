#!/usr/bin/env bash
# High-reliability fetch for Stitch HTML (handles redirects and TLS).
# From stitch-uviewpro-components skill. Use htmlCode.downloadUrl from get_screen.
# Usage: bash scripts/fetch-stitch.sh "<htmlCode.downloadUrl>" "design/stitch/screens/home.html"
set -e
URL=$1
OUTPUT=$2
if [ -z "$URL" ] || [ -z "$OUTPUT" ]; then
  echo "Usage: $0 <url> <output_path>" >&2
  exit 1
fi
mkdir -p "$(dirname "$OUTPUT")"
echo "Fetching Stitch HTML..." >&2
curl -L -f -sS --connect-timeout 10 --compressed "$URL" -o "$OUTPUT"
echo "Saved to: $OUTPUT" >&2
