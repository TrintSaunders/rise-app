#!/bin/bash
# The three commit gates in one command. Exits non-zero on any failure.
# Agents: run this before every commit; humans: before every push.
set -e
cd "$(dirname "$0")/.."
echo "== gate 1/3: types =="
npx tsc --noEmit
echo "== gate 2/3: tests =="
npm test --silent
echo "== gate 3/3: export, both platforms in ONE command =="
npx expo export --platform ios --platform web
echo "ALL GATES PASS"
