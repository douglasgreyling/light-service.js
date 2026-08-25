#!/usr/bin/env bash
#
# Keeps the `node_modules` volume honest.
#
# `node_modules` lives in a named volume so the host's (possibly macOS) copy
# never leaks into the Linux container. The trade-off is that the volume happily
# outlives the image, so a rebuilt image alone won't refresh it. We stamp the
# volume with the checksum of the lockfile it was installed from and reinstall
# whenever the two drift apart.

set -euo pipefail

lockfile="/app/package-lock.json"
stamp="/app/node_modules/.install-checksum"

if [ -f "$lockfile" ]; then
  checksum="$(sha256sum "$lockfile" | cut -d' ' -f1)"

  if [ ! -f "$stamp" ] || [ "$(cat "$stamp")" != "$checksum" ]; then
    echo "==> Dependencies are out of date, running npm ci..." >&2
    npm ci
    printf '%s' "$checksum" > "$stamp"
  fi
fi

exec "$@"
