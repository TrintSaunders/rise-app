# Rise — setup & house guide for AI assistants (and humans)

Rise is a grace-forward companion app for men fighting for sexual purity —
built on mercy, not shame. Before writing any code, read `README.md`,
`docs/DESIGN.md`, and `docs/ROADMAP.md`. The design doc is the source of
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
- Before every commit, BOTH gates must pass:

  ```bash
  npx tsc --noEmit
  npx expo export --platform ios --platform web
  ```

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

## Map of the code

- `app/_layout.tsx` — root: StoreProvider, first-launch onboarding gate,
  modal stack (`sos` + `rise-again` are fullScreenModal; `checkin` +
  `log-struggle` are card modals).
- `app/(tabs)/` — `today` (dawn arc, streak counters, SOS entry),
  `patterns` (honest-data readback), `armory` (placeholder until v1.0).
  A fourth tab, Brothers, was deliberately removed — do not re-add it
  without asking the owner.
- `lib/store.tsx` — the store. Append-only history: check-ins, struggles,
  victories, rises. Mutate only through its actions; read through its
  selectors (`honestStreakDays`, `cleanStreakDays`, `isCheckedInToday`).
  Days are local calendar days (`todayStr`/`shiftDay`), never UTC slices.
  History is never erased; the clean counter resets only through
  `completeRise`.
- `lib/theme.ts` — Night Watch: a semantic Day/Night palette via
  `useAppTheme()`. Night follows the clock (19:00–06:00) unless the user
  pins a mode (toggle on Today, persisted in the store).
- `lib/verses.ts` — verse of the day; `lib/sample.ts` — flagged demo data
  behind the Patterns "sample history" button (removable before release);
  `lib/haptics.ts` — `hapticTap()` for completions only, never for falls.
- `components/` — `Breathing` (the calm loop), `SpringPress` (use for
  every tappable), `Reveal` (staggered entrances), `StarField` (night
  backdrop), `Onboarding`, `ComingSoon` (placeholder scaffold).

## House rules (from docs/DESIGN.md)

1. Colors, fonts, radii come **only** from `constants/theme.ts` — no new
   raw hex. Alpha variants of existing tokens are acceptable for layering.
2. Scripture is always serif italic (`fonts.serifItalic`) with its
   reference, in the centered reading style.
3. Copy sounds like a warm older brother: honest, hopeful, never a scold.
   No alarms, countdowns, or shame framing. Examples live in DESIGN.md's
   copy-tone section.
4. One glowing element per screen, maximum. Gold and ember are spices.
5. Reuse the motion components instead of inventing new animations.
6. Sacred privacy: no analytics, no network calls, no data off-device.

## First-push checklist for a new collaborator

1. Accept the repository invite email from the owner.
2. Authenticate to GitHub: `gh auth login` (or add an SSH key).
3. `git clone https://github.com/TrintSaunders/rise-app.git`
4. `npm install`, then work through the gates above.
5. `git pull --rebase origin main && git push origin main`.
