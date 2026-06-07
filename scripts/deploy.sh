#!/usr/bin/env bash
set -euo pipefail

# Always operate from the project root, regardless of where this is invoked
# from, so `.env` and `./dist/` resolve consistently.
cd "$(dirname "$0")/.."

# Local runs read config from .env; CI provides it via the environment (secrets).
if [[ -f .env ]]; then
  source .env
fi

# The static build output is what we deploy; refuse to mirror if it's missing
# (with --delete a missing/empty source is dangerous). Run `pnpm build` first.
if [[ ! -d ./dist ]]; then
  echo "Error: ./dist not found — run 'pnpm build' before deploying." >&2
  exit 1
fi

# Optional: pass --dry-run to see what would be uploaded without actually uploading
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
