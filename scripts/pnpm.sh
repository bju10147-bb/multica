#!/usr/bin/env bash
set -euo pipefail

if command -v pnpm >/dev/null 2>&1; then
  exec pnpm "$@"
fi

exec npx -y pnpm@10.28.2 "$@"
