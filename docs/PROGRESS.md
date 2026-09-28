# Progress log

The shared memory between everyone working on Rise — Trint, Hayden, and
their AI assistants. Read this before starting work; add an entry before
every push (see AGENTS.md → "Workflow on this repo").

**How to add an entry:** newest first, under "Log". Give the date, who did
it, and the commit subject (not the hash — you're writing the entry before
the commit exists). Say what changed and why, in a few bullets, and list
anything left open. Then update "Current state" and "Waiting on a decision"
if they changed. Keep it short: this is a map, not a changelog of every
line — `git log` has the rest.

---

## Current state

- **Tabs:** Today · SOS · Patterns · Armory. Allies (formerly Brothers) is
  planned as a fifth tab for v0.3 and is not built.
- **Shipped:** onboarding, Today (dawn arc, honest-first counters), SOS tab
  with victory logging, evening check-in, log a struggle (every fall its own
  entry with its hour), Rise Again, Patterns (last two weeks), Night Watch.
- **Built but hidden:** Armory verse memory — folders, suggested sets
  (fight verses + Topical Memory System), spaced-repetition review, sharing
  folders with friends. Behind `flags.armoryMemory` in `lib/flags.ts`.
- **Not started:** local notifications (last v0.1 item), Allies (v0.3),
  battle-plan editor, reading plans, encrypted backup/export.
- **Gates:** `npx tsc --noEmit` and
  `npx expo export --platform ios --platform web` both pass as of the latest
  entry. There are no unit tests or lint config yet.

## Waiting on a decision

- **Allies vs. the privacy rule.** House rule 6 says no network calls, but
  the v0.3 ping, SOS alerts, and weekly digest need one. Options: share
  through his own Messages app (no network), a tiny store-nothing server,
  or real push alerts. Owner: Trint.
- **Turning on verse memory.** Before `flags.armoryMemory` goes on: check
  every verse text against a licensed ESV and add its copyright notice
  (1 Tim 4:7 uses NASB wording on purpose); confirm with The Navigators
  that the "Topical Memory System" name can be used; decide whether
  memorizing together should ever sync progress (needs a server — same
  question as Allies).
- **Hebrews 2:28** was requested for the fight-verse list but doesn't exist;
  Hebrews 2:18 is in its place. Confirm with Hayden.
- **Sample-data button** on Patterns must come out before release.

---

## Log

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
