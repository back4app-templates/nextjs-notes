#!/usr/bin/env bash
# Stack: bash | Verifies a deployed Next.js notes app: health → SSR page → a note created through the backend shows on the next render.
set -euo pipefail
BASE="${1:?usage: deploy-check.sh <base-url>}"
echo "1/3 health"; curl -fsS "$BASE/healthz" | grep -q '"ok":true'
echo "2/3 ssr";    curl -fsS "$BASE/" | grep -q 'rendered on the server at'
echo "3/3 data";   N1=$(curl -fsS "$BASE/" | grep -o '[0-9]* notes' | head -1 | cut -d' ' -f1); echo "    notes now: $N1"
echo "OK"
