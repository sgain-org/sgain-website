#!/usr/bin/env bash
set -euo pipefail

source .env

# Optional: pass a subdirectory to inspect, defaults to REMOTE_PATH
TARGET="${1:-${REMOTE_PATH}}"

lftp <<EOF
set ftp:ssl-allow true
set ftp:ssl-force false
set ssl:verify-certificate no
set net:max-retries 2
set net:timeout 15
open -u "${REMOTE_USERNAME},${REMOTE_PASSWORD}" -p "${REMOTE_PORT}" "${REMOTE_HOST}"
find "${TARGET}"
bye
EOF
