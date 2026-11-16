#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/../Fahd_Hassan_Ajaia_Docs_Submission.zip"

cd "$ROOT/.."
rm -f "$OUT"
zip -r "$OUT" ajaia-collab-docs \
  -x "ajaia-collab-docs/node_modules/*" \
  -x "ajaia-collab-docs/.next/*" \
  -x "ajaia-collab-docs/prisma/*.db" \
  -x "ajaia-collab-docs/prisma/*.db-journal" \
  -x "ajaia-collab-docs/uploads/*" \
  -x "ajaia-collab-docs/.git/*" \
  -x "ajaia-collab-docs/.env"

echo "Created: $OUT"
echo "Upload this zip + fill LIVE_URL.txt / VIDEO_URL.txt into your Google Drive folder."
