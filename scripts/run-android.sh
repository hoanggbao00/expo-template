#!/bin/bash
# Run the Android app for a variant. The Gradle flavor and applicationId come from
# app.config.ts, so package names are never duplicated in package.json or .env.
#
#   ./scripts/run-android.sh            # dev flavor, debug build (Metro)
#   ./scripts/run-android.sh --prod     # prod flavor, release build
#   Extra args are passed to `expo run:android` (e.g. --device, --no-bundler).

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

export APP_VARIANT="development"
VARIANT="devDebug"
EXPO_ARGS=()

for arg in "$@"; do
  case "$arg" in
    --prod|--production) APP_VARIANT="production"; VARIANT="prodRelease" ;;
    --dev|--development) APP_VARIANT="development"; VARIANT="devDebug" ;;
    *) EXPO_ARGS+=("$arg") ;;
  esac
done

APP_ID="$(bun -e "import { ANDROID_APPLICATION_ID } from './app.config.ts'; process.stdout.write(ANDROID_APPLICATION_ID);")"

exec bun expo run:android --variant "$VARIANT" --app-id "$APP_ID" "${EXPO_ARGS[@]+"${EXPO_ARGS[@]}"}"
