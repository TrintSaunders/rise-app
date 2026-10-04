#!/bin/bash
# Publish an OTA update to testers or store users.
# Usage: ./scripts/ota.sh preview|production "what changed"
#
# Runs the gates, stamps BUILD in app/you.tsx, commits, pushes, and
# publishes with eas update. The rules around this script (preview before
# production, human sign-off for production) live in docs/PIPELINE.md.
set -e
cd "$(dirname "$0")/.."

BRANCH="$1"
MSG="$2"
if [ "$BRANCH" != "preview" ] && [ "$BRANCH" != "production" ]; then
  echo "branch must be 'preview' or 'production' (PIPELINE.md: preview first, always)"
  exit 1
fi
if [ -z "$MSG" ]; then
  echo "usage: ./scripts/ota.sh preview|production \"what changed\""
  exit 1
fi
if [ "$BRANCH" = "production" ] && [ "$RA_OVERRIDE" != "yes" ]; then
  echo "production updates need a human go-ahead (PIPELINE.md)."
  echo "If a human said go in your session, rerun with RA_OVERRIDE=yes."
  exit 1
fi

./scripts/gates.sh

STAMP="$(date '+%b %-d %H:%M')"
sed -i '' "s|^const BUILD = .*|const BUILD = '$BRANCH $STAMP'|" app/you.tsx
git add app/you.tsx
git commit -m "OTA $BRANCH: $MSG"
git push origin main
npx --yes eas-cli update --branch "$BRANCH" --message "$MSG" \
  --environment production --non-interactive
echo "PUBLISHED to $BRANCH — BUILD stamp: $BRANCH $STAMP"
