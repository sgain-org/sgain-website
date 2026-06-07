#!/usr/bin/env bash
set -euo pipefail

# Run from the project root so `.env` and `./dist/` resolve consistently.
cd "$(dirname "$0")/.."

# Local runs read config from .env; CI provides it via the environment.
if [[ -f .env ]]; then
  source .env
fi

# Mirroring with --delete from a missing source would wipe the remote.
if [[ ! -d ./dist ]]; then
  echo "Error: ./dist not found — run 'pnpm build' before deploying." >&2
  exit 1
fi

# Optional: --dry-run to list what would be uploaded
DRY_RUN=""
[[ "${1:-}" == "--dry-run" ]] && DRY_RUN="--dry-run"

lftp <<EOF
set ftp:ssl-allow true
set ftp:ssl-force false
set ssl:verify-certificate no
set net:max-retries 2
set net:timeout 15
open -u "${REMOTE_USERNAME},${REMOTE_PASSWORD}" -p "${REMOTE_PORT}" "${REMOTE_HOST}"
mirror --reverse --delete --verbose --parallel=4 ${DRY_RUN} \
  --exclude-glob .DS_Store \
  ./dist/ "${REMOTE_PATH}"
bye
EOF
