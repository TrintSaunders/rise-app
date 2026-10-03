# Rise — setup & house guide for AI assistants (and humans)

Rise is a grace-forward companion app for men fighting for sexual purity —
built on mercy, not shame. Before writing any code, read
`docs/PROGRESS.md` (what's been done lately, and what's waiting on a
decision), then `README.md`, `docs/DESIGN.md`, and `docs/ROADMAP.md`.
Planned changes, written up ready to build, live in `docs/UPDATES.md`;
when one ships, log it in PROGRESS.md and remove it from UPDATES.md.
The founders' shared checklist (LLC, website, socials, Stripe) is
`docs/TODO.md`; the website plan is `docs/WEBSITE.md`. Every outside
link the app opens lives in `lib/links.ts`. The design doc is the source of
truth for tone, palette, and screen behavior; when code and doc disagree,
stop and ask which should change.

## Stack

Expo (SDK 57) · React Native · TypeScript (strict) · expo-router ·
AsyncStorage. All data stays on-device — nothing leaves the phone, ever.

## Setup

```bash
npm install          # Node 18+
npx expo start       # dev server; press i (iOS sim), a (Android), w (web)
```

## Workflow on this repo

- Branch is `main`, direct pushes are allowed (no branch protection).
  Always `git pull --rebase origin main` before pushing.
- Before every push, add an entry to `docs/PROGRESS.md` — what changed,
  why, and what's left open — and update its "Current state" and "Waiting
  on a decision" sections. Two people's assistants share this repo; the
  log is how each one knows what the other did. If code and a doc now
  disagree because of your change, fix the doc in the same commit.
- Before every commit, ALL THREE gates must pass:

  ```bash
  npx tsc --noEmit
  npm test
  npx expo export --platform ios --platform web
  ```

  `npm test` runs the Jest suite in `__tests__/` (jest-expo preset):
  days and streaks, falls, memory, reminders, backup, phone numbers.
  Logic changes come with a test. Test files declare their types with
  `/// <reference types="jest" />` (TypeScript 6 no longer loads them
  automatically).

  Adding or renaming a route? Typed routes live in `.expo/types/`, which
  only the dev server regenerates — run `npx expo start` once (Ctrl-C when
  it's up) or `tsc` will reject the new paths.

  Export both platforms **in one command**. `expo export` clears `dist/`
  each run, so exporting one platform after the other silently deletes
  the other platform's files.
- Web preview of the current build:

  ```bash
  npm run preview     # serves dist/ at http://localhost:8080
  ```

  Re-run the export after code changes to refresh it. The preview server
  redirects `/` to `/today` (the app has no index route).
- Testing note (web): AsyncStorage v2 keeps its data in IndexedDB, not
  localStorage — to reset the app, clear the site's full data.
- Publishing an update to the testers' phones (the `preview` channel):

  ```bash
  npx tsc --noEmit
  npx expo export --platform ios --platform web
  git add -A && git commit && git push
  npx eas-cli update --branch preview --message "what changed" \
    --environment production --non-interactive
  ```

  Bump the `BUILD` constant in `app/you.tsx` in the same commit so a
  tester can confirm which publish the phone is on. The project lives
  under the **rise-again** organization on EAS — Trint and Hayden are
  both owners, so either can publish with their own
  `npx eas-cli login`. Phones get the update on next open of the
  channel link.

## Map of the code

- `app/_layout.tsx` — root: StoreProvider, first-launch onboarding gate,
  modal stack (`rise-again` is fullScreenModal; `checkin` +
  `log-struggle` are card modals).
- `app/(tabs)/` — `today` (dawn arc, streak counters, allies card),
  `sos` (the Way of Escape: opens on a single button, pressing it shows
  the help; `?now=1` skips the button; always night colors, its
  tab bar too; resets on blur; holds the "your allies" card), `patterns` (honest-data
  readback), `armory` (verse memory; the old placeholder shows if
  `flags.armoryMemory` is turned off).
  A fifth tab, Allies (formerly Brothers), is planned for v0.3 — see
  DESIGN.md. Do not build it without asking the owner.
- `lib/store.tsx` — the store. Append-only history: check-ins, struggles,
  victories, rises. Mutate only through its actions; read through its
  selectors (`honestStreakDays`, `cleanStreakDays`, `isCheckedInToday`).
  Days are local calendar days (`todayStr`/`shiftDay`), never UTC slices.
  History is never erased; the clean counter resets only through
  `completeRise`.
- `lib/theme.ts` — Night Watch: a semantic Day/Night palette via
  `useAppTheme()`. Night follows the clock (19:00–06:00) unless the user
  pins a mode (toggle on Today, persisted in the store).
- `lib/flags.ts` — feature switches. `armoryMemory` (on) gates the Armory
  verse memory: `lib/memory.ts` (verse library, review schedule, share
  codes), `components/ArmoryMemory.tsx`, and the `app/memory/` routes,
  each wrapped in `MemoryGate`. `allyAlerts` picks how SOS tells allies:
  `'local'` or `'server'`.
- `lib/reminders.ts` + `components/ReminderSync.tsx` — local reminders
  (expo-notifications). Settings live in `data.reminders`; ReminderSync
  (mounted in the root layout, phones only) re-plans the next week on
  launch, on settings changes, and after each check-in, and routes taps.
  Lock-screen text must stay discreet: never name what the app is for.
- `lib/battlePlan.ts` + `app/battle-plan.tsx` + `components/SosPlan.tsx` —
  the battle plan (`data.battlePlan`), its editor, and how SOS shows it.
- `app/you.tsx` — "you & settings": profile, reminders, battle plan
  preview, Night Watch, backup, the story so far.
- `lib/backup.ts` + `lib/backupFile.ts` + `components/BackupCard.tsx` —
  encrypted backup (AES-256-GCM, PBKDF2 key from his passphrase, @noble
  primitives). The file goes out through the share sheet and comes back
  through the document picker. Restoring merges and never erases
  (`mergeBackup`). No server, no recovery for a lost passphrase.
- Accessibility: every tappable has `accessibilityRole="button"` and a
  label when it's icon-only; text inside fixed shapes (SOS button,
  counters, pills, tab bar) caps `maxFontSizeMultiplier`.
- `lib/allyAlert.ts` + `components/SosAllies.tsx` — SOS "tell them I'm
  tempted". Allies live in the store (`data.allies`), on the phone only.
  The server path always falls back to the local group text.
- `server/ally-alert/` — optional Deno Edge Function for the server path;
  not deployed, excluded from the app's tsconfig. See `server/README.md`.
- `lib/verses.ts` — verse of the day; `lib/haptics.ts` — `hapticTap()`
  for completions only, never for falls.
- `components/` — `Breathing` (the calm loop), `SpringPress` (use for
  every tappable), `Reveal` (staggered entrances), `StarField` (night
  backdrop), `Onboarding`, `ComingSoon` (placeholder scaffold).

## House rules (from docs/DESIGN.md)

1. Colors, fonts, radii come **only** from `constants/theme.ts` — no new
   raw hex. Alpha variants of existing tokens are acceptable for layering.
2. Scripture is always serif italic (`fonts.serifItalic`) with its
   reference, in the centered reading style.
3. Copy sounds like a warm older friend: honest, hopeful, never a scold.
   No alarms, countdowns, or shame framing. No em dashes in on-screen
   copy (Scripture keeps its own punctuation), and verse references stand
   alone under the verse, without a leading dash. Examples live in
   DESIGN.md's copy-tone section.
4. One glowing element per screen, maximum. Gold and ember are spices.
5. Reuse the motion components instead of inventing new animations.
6. Sacred privacy: no analytics, no accounts, no data off-device. The only
   things that leave the phone are messages he chooses to send from it:
   the SOS "I'm being tempted" text to his allies, shared memory folders,
   and progress notes. They carry nothing beyond what he sees. The
   optional `server/ally-alert` path is the one exception under review —
   see `server/README.md`.

## First-push checklist for a new collaborator

1. Accept the repository invite email from the owner.
2. Authenticate to GitHub: `gh auth login` (or add an SSH key).
3. `git clone https://github.com/TrintSaunders/rise-app.git`
4. `npm install`, then work through the gates above.
5. `git pull --rebase origin main && git push origin main`.
