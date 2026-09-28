# Progress log

The shared memory between everyone working on Rise — Trint, Hayden, and
their AI assistants. Read this before starting work; add an entry before
every push (see AGENTS.md → "Workflow on this repo").

**How to add an entry:** newest first, under "Log". Give the date, who did
it, and the commit subject (not the hash — you're writing the entry before
the commit exists). Say what changed and why, in a few bullets, and list
anything left open. Then update "Current state" and "Waiting on a decision"
if they changed; when a decision is made, move it to "Decided" with the
date and who made it. Keep it short: this is a map, not a changelog of every
line — `git log` has the rest.

---

## Current state

- **Tabs:** Today · SOS · Patterns · Armory. A fuller Allies tab (ally
  management, "check on me tonight", weekly digest) is still v0.3.
- **Shipped:** onboarding, Today (dawn arc, honest-first counters), SOS tab
  with victory logging and "tell my allies I'm tempted", evening check-in,
  log a struggle (every fall its own entry with its hour), Rise Again,
  Patterns (last two weeks), Night Watch, Armory verse memory (folders,
  suggested sets, spaced-repetition review, sharing folders with friends).
- **Built but not switched on:** the server path for ally alerts
  (`server/ally-alert`, not deployed; `flags.allyAlerts` is `'local'`).
- **Not started:** local notifications (last v0.1 item), the rest of Allies
  (v0.3), battle-plan editor, reading plans, encrypted backup/export.
- **Gates:** `npx tsc --noEmit` and
  `npx expo export --platform ios --platform web` both pass as of the latest
  entry. There are no unit tests or lint config yet.

## Waiting on a decision

- **Sample-data button** on Patterns must come out before release.

## Decided

- **2026-09-28 — Ally alerts stay local (Trint):** SOS keeps the manual
  path: "tell my allies I'm tempted" opens his Messages app with the
  text ready, and he taps Send. The server path stays built but off
  (`flags.allyAlerts` remains `'local'`; `server/` stays for a possible
  future switch). Revisit only if Trint reopens it.
- **2026-09-28 — Privacy (Hayden):** local-first stays. The only things
  that leave the phone are messages he sends himself (SOS alert, shared
  folders, progress notes); house rule 6 in AGENTS.md now says so. Memory
  folders never sync progress.
- **2026-09-28 — Verse memory (Hayden):** verse texts, ESV/NASB notices,
  and the Topical Memory System name are checked; `flags.armoryMemory` is on.
- **2026-09-28 — Hebrews 2:18 (Hayden):** confirmed; "2:28" was a typo.

---

## Log

### 2026-09-28 — Trint (with ZCode) — Rename a folder from inside it
- Tap the folder's name (small pencil beside it) on the folder screen to
  fix a misspelling: inline edit, saved on done. Empty reverts to the old
  name. Verse progress is keyed by reference, so renames lose nothing.
- Making your own folder was already there: Armory, "new folder".

### 2026-09-28 — Trint (with ZCode) — A small "you" screen
- New modal from Today's header (person icon, beside the theme toggle):
  edit name and life verse, saved as he types (an empty name mid-edit
  keeps the last good one; empty verse returns to the verse of the day).
- Night Watch choice lives here too: follow the sun, night, or day.
- Footer shows the start date and the lifetime story (check-ins,
  struggles, falls, rises, victories; sample entries don't count).
  Still no account; nothing leaves the phone.

### 2026-09-28 — Trint (with ZCode) — Allies manage on Today; SOS button off Today
- The "I'm struggling right now" button is gone from Today. The SOS tab
  is one tap away in the bar, so the dock was redundant.
- Allies are added and removed on the Today screen ("your allies" card
  under the two actions). SOS keeps only the alert: "tell my allies I'm
  tempted". Its add form appears only when he has no allies yet, so the
  moment of need is never a dead end.
- Shared `components/AlliesForm` (validation and copy in one place) used
  by both the Today card and the SOS fallback.
- Also fixed the review carry-over in `SosAllies.tell`: a rejection now
  lands on the "unavailable" fallback instead of going unhandled.

### 2026-09-28 — Hayden (with Claude) — "SOS tab opens on a single button"
- The SOS tab now opens on one large breathing button, "I'm struggling
  right now". Pressing it shows the help page (breathing, verse, allies,
  the way out), which has a close button back to the single button.
- Today's SOS button skips straight to the help (`/sos?now=1`).
- Nothing is logged by visiting SOS or pressing the button; only
  "I made it through" saves a victory. Hayden asked; this was already true.

### 2026-09-28 — Hayden (with Claude) — "Design pass: dawn arc, scrolling, copy, web layout"
- Dawn arc rebuilt in SVG (`components/DawnArc.tsx`, adds `react-native-svg`):
  a filled gold dome, the sun on the arc at the real time of day with a gold
  trail, and the full arc filling gold on check-in. The old version rendered
  as a blank box on web.
- Today scrolls, and its SOS button is pinned at the bottom so it is always
  visible on any screen size; counters are now numbers with labels.
- Web: at laptop width the app sits in a centered phone-width column; the
  tab bar is tall enough that labels aren't clipped.
- Every em dash removed from on-screen copy (rule added to AGENTS.md and
  DESIGN.md). Scripture keeps its punctuation; references no longer have a
  leading dash.
- Check-in: questions centered, three-dot step indicator. Log a struggle:
  section spacing, "I fled" / "I fell". Memory: clearer set header, visible
  progress dots, "already added" check on suggested sets, a real empty
  state for review. SOS: cleaner "texting unavailable" state, phone numbers
  formatted.
- `npm run preview` now serves dynamic routes (e.g. `/memory/folder/<id>`).
- Checked by screenshot in headless Chrome at 375, 390, and 1280 wide, day
  and night. Not yet on a device.

### 2026-09-28 — Hayden (with Claude) — "Put the SOS ally button where he can see it"
- Hayden couldn't find "tell my allies": it only appeared after adding an
  ally, and the card sat below the fold. The button now always shows, right
  under the verse; with no allies, tapping it opens the add form.
- Checked in headless Chrome at phone size (screenshots), not on a device.
- Spotted on web while checking: Today's dawn arc renders as a pale box, not
  an arc, and tab labels are clipped at the bottom. Not fixed yet.

### 2026-09-28 — Hayden (with Claude) — "Fix preview server serving nothing"
- `npm run preview` answered 403 to every page: it looked for files in the
  repo root instead of `dist/`. It now serves `dist/`; paths that try to
  climb out of it still get nothing.

### 2026-09-28 — Hayden (with Claude) — "SOS tells allies; verse memory on; privacy decided"
- SOS tab gains a "your allies" card: add up to five names and numbers
  (kept on the phone only), then one button — "tell them I'm tempted".
  The text says only that; nothing about when, where, or why.
- Two delivery paths behind `flags.allyAlerts`: `'local'` (default) opens
  a ready group text via `expo-sms`; `'server'` posts to
  `server/ally-alert` (Deno Edge Function + Twilio, fixed message, 1–5
  E.164 recipients, in-memory rate limit, stores nothing) and falls back to
  local on any failure. The function is not deployed; it was tested in
  Node against a fake Twilio. Trint picks — see "Waiting on a decision".
- Added `expo-sms`. `server/` is excluded from the app's tsconfig.
- Verse memory switched on, with the ESV and NASB copyright notices at the
  foot of the Armory.
- House rule 6 in AGENTS.md rewritten for the privacy decision.
- Not tried on a device yet. Texting only works on a real phone (not the
  simulator or web — there the SOS card shows the message to copy).

### 2026-09-28 — Hayden (with Claude) — "Make SOS its own tab; start the progress log"
- SOS moved from a full-screen modal to its own tab, second in the bar,
  so it's one tap from anywhere. The Today button jumps to the tab.
- The SOS tab bar turns night colors while it's open, the screen resets
  to "I made it through" each visit, and its light status bar only shows
  while the tab is focused (tabs stay mounted).
- Added this progress log and a rule in AGENTS.md to keep it current.
- Not tried on a device yet — typecheck and export only.

### 2026-09-28 — Hayden (with Claude) — "Log each fall on its own; build Armory verse memory behind a flag"
- Check-in "I fell" lists each fall logged that day with its hour and lets
  him log more, one at a time, before Rise Again. Falls are never merged —
  Hayden wants the count and the times. Rising without logging one records
  a fall flagged `hourUnknown` (counted, but off the hour chart).
- Armory verse memory built behind `flags.armoryMemory` (off): see
  "Current state" and the Armory section of DESIGN.md.
- Share codes send library verses as references only, so a 31-verse folder
  is ~900 characters. Memory logic was script-tested; no screen has been
  run on a device.

### 2026-09-27 — Hayden (with Claude) — "Protect history and fix day and window counting"
- An unreadable save is backed up under `rise.store.v1.unreadable.<time>`
  instead of being overwritten with an empty store.
- Check-ins before 4am count for the previous day (`checkInDayStr`), so
  late check-ins no longer break the honest streak.
- Patterns counts only the last two weeks, matching its label.

### 2026-09-27 — Hayden (with Claude) — docs and a route fix
- "Brotherhood" renamed to **Allies** everywhere; the copy voice is "a warm
  older friend" (DESIGN.md, AGENTS.md).
- The not-found screen linked to `/`, which doesn't exist; now `/today`.

### 2026-09-27 — Trint — "Add AGENTS.md onboarding guide and preview server script"
- AGENTS.md (setup, gates, code map, house rules) and `npm run preview`.

### 2026-09-27 — Trint — "Complete daily rhythm, honest data, and Night Watch"
- Local store, onboarding, check-in, log a struggle, Rise Again, SOS
  victories, Patterns, Night Watch, motion and haptics pass. Brothers tab
  removed.

### 2026-09-24 — Trint — "Replace Expo template with rise app"
- The Rise app scaffold, design docs, and roadmap.
