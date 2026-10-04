# Pipeline — how changes reach phones

The runbook for shipping updates. PROGRESS.md logs what happened; this
file says how it's done. If you are an AI assistant, follow this file
exactly; if it and reality disagree, fix this file in the same commit.

## The one rule that picks the rail

| The change touches… | Rail | Apple review? |
|---|---|---|
| TypeScript/TSX, copy, fonts, images, `components/`, `app/`, `lib/` | **OTA** | No |
| Native modules (`package.json` dependencies), permissions, Info.plist, icon, splash, `expo.*` config, app name | **Store build** | Yes |
| `app.json` `version` | **Store build**, and it starts a new runtime track | Yes |

When in doubt, take the store rail; it is always safe. Never take the OTA
rail across a native change (build 9's encrypted-backup lesson: four new
native modules had to wait for build 10).

**Versioning:** `runtimeVersion` is the `appVersion` policy. An OTA
update for store users of 1.0.0 must keep `app.json.version` at `1.0.0`
until a store build ships a bump. Bumping the version casually strands
every older phone on its own update track.

## Rail 1 — OTA update (minutes to arrive, no review)

Two audiences, always in this order. **Nothing reaches `production` that
has not been opened on a real phone via `preview` first.**

1. Land the change on `main` (gates + PROGRESS entry, as in AGENTS.md).
2. Publish to testers: `./scripts/ota.sh preview "what changed"`
3. A tester opens Rise on iPhone, checks "you & settings" for the new
   BUILD stamp, and walks the changed flow.
4. A human says go. Then: `./scripts/ota.sh production "what changed"`
5. Store phones get it on next app open.

What `scripts/ota.sh` does, so nobody has to guess: runs all three
gates, stamps the `BUILD` constant in `app/you.tsx` (so testers can see
which publish they are on), commits, pushes, and runs
`eas update --branch <branch>` non-interactively.

**Rollback:** there is no unpublish; the rollback is republishing the
last good tree. `git checkout <last-good-commit> -- .` then
`./scripts/ota.sh production "rollback: <why>"`, then restore `main`.

**Channels:** testers' preview builds and Expo Go ride the `preview`
branch; store build 10 and later ride `production` (EAS matches branch
to channel by name). Publishing to `preview` never touches store users.

## Rail 2 — store build (a new binary)

1. Land the change on `main` (gates).
2. `npx eas build --platform ios --profile production` — zero prompts;
   Apple credentials live on EAS (team, cert, profile). If asked for
   an Apple Team ID, it is `6TF9F7YLUY`, and something regressed.
3. `npx eas-cli submit --platform ios --profile production --latest` —
   zero prompts; `eas.json` pins the ASC app and the API key path
   (that path exists on Trint's machine only; elsewhere it prompts).
4. Both founders run the build in TestFlight (internal group
   "Team (Expo)" gets every build automatically).
5. Attach the build to the version page (ASC web UI, or the API PATCH
   on `/appStoreVersions/{id}/relationships/build`).
6. If `app.json.version` was bumped: create the matching version in ASC
   and give it a What's New entry (required from the second version on;
   the first release is not allowed one).
7. Submit for review. On approval, a human presses Release (release is
   manual on purpose: nothing goes live without it).

**Time budget:** build ~15 min, submit ~5–15 min, Apple processing
~10–60 min, review 1–2 days. Nothing in rail 2 needs a human at the
keyboard until TestFlight and the final Release press.

## Who may do what (agents included)

| Action | Who |
|---|---|
| Work locally, run gates, commit/push to `main` | Any agent, any time |
| OTA publish to `preview` | Any agent, after gates |
| OTA publish to `production` | Only after a human said go, in writing, in the session |
| Store build / submit / ASC edits / Release press | Only after a human said go |
| Pressing Release on an approved version | Trint (or Hayden with Trint's ok) |
| Spending money, publishing content, legal | Humans only |

## Definition of "tested and ready" (the pre-push checklist)

An OTA update is ready for `production` when: gates pass, it has been
opened on at least one real iPhone through `preview`, the changed flows
were walked (not just launched), the BUILD stamp matches, and a human
said go. A store build is ready when the same is true in TestFlight for
both founders.
