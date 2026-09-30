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
- **Also shipped:** local reminders (morning verse, evening check-in) and
  the battle-plan editor, both set from "you & settings"; SOS shows his
  plan with live text/call/verse steps.
- **Not started:** the rest of Allies (v0.3), reading plans, encrypted
  backup/export, tests.
- **Gates:** `npx tsc --noEmit` and
  `npx expo export --platform ios --platform web` both pass as of the latest
  entry. There are no unit tests or lint config yet.

## Waiting on a decision

- **Store listing** (`docs/STORE_LISTING.md`): Trint's read, plus the two
  open points at its end: age rating and em dashes in the store copy.
- **Icon:** current blueprint chevron vs. the sunrise concepts in
  `design/icon-review/`.

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

### 2026-09-30 — Hayden (with Claude) — "Domain and support email; store listing additions"
- Hayden bought **riseagainapp.com**: riseagainapp.com (marketing site,
  later), app.riseagainapp.com (web app, later), support@ (live), hello@
  (live). Recorded in RELEASE.md with the safe order for moving Pages onto
  the domain (DNS first, `docs/CNAME` last).
- support@riseagainapp.com is now the contact on the privacy policy and
  a new support page (`docs/support.md`); `docs/index.md` is a small
  landing page. Both publish on the existing GitHub Pages site.
- `docs/STORE_LISTING.md` (Trint's draft) gained what submission also
  needs: URLs, content rights, App Review notes, and two points to settle
  (age rating, em dashes in store copy). Claude's parallel draft was
  dropped so there's one listing.
- `app.json`: iPhone-only and no export-encryption question (next native
  build). Reminders now plan two weeks ahead instead of one.
- Cleared stale notes: the sample-data item (Trint already retired it)
  and AGENTS.md's mention of an SOS button on Today.

### 2026-09-29 — Trint — "Lamp: the AI is the catch"
- Premium re-centered on Trint's call: an AI that narrates his
  patterns, walks him through restriction choices, and builds verse
  folders. Runs on Apple's on-device model — the privacy vow becomes
  the headline ("the AI that reads your patterns — on your phone,
  nowhere else"). Three hard disciplines written in: never quotes
  Scripture from memory (selects from the typed database only), never
  free-form counsels (structured outputs, crisis routes to humans),
  cloud never unless he asks.
- Scrapped per Trint: all narration audio (a voice is a person or
  it's silence), the Mentor Portal, spouse mode. Sequencing re-cut:
  guardrails 1.1, **Lamp 1.2 as the marketing beat**, server era 1.3,
  presence 1.4, ally locks 1.5.

### 2026-09-29 — Trint — "The post-Opal reality check: bigger reasons"
- Opal blocks an app for free, so PREMIUM.md grew Pillar 5 — the
  features a secular utility structurally can't copy: **Watch SOS**
  (rescue that lives outside the phone), **Sit with me** (live ally
  co-presence, breathing in sync), ally **voice notes**, the **Mentor
  Portal** (church blocks of subscriptions), pattern-aware shepherding,
  and spouse mode (last, carefully). Sequencing re-cut so the headline
  pair lands as 1.3.

### 2026-09-29 — Trint — "Premium tier thought through"
- `docs/PREMIUM.md`: Trint's guardrail ideas (ally-held app shields,
  time budgets) grounded in what iOS's Screen Time API really allows,
  plus allies-live, depth, and sync pillars; free/paid line holds the
  vow that everything in 1.0 stays free; pricing comps and a
  four-phase sequence starting with local-only guardrails.
- ROADMAP's "Later" now points there instead of duplicating.
- Open questions waiting on Trint + Hayden (pricing shape, digest
  free-vs-paid, the name, the privacy policy's second chapter).

### 2026-09-29 — Trint — "Store listing drafted while Apple verifies"
- `docs/STORE_LISTING.md`: name/subtitle/keywords/description in the
  app's voice (no shame, no "brother"), privacy answers, age-rating
  notes, screenshot shot-list. Trint hasn't read it yet — it's a draft
  until he edits or blesses it.
- Apple Developer payment made; enrollment verification pending. Icon
  comparison opened for the blueprint-vs-sunrise pick.

### 2026-09-29 — Hayden (with Claude) — "Icon concepts: the rise as a sunrise"
- Two concepts in `design/icon-review/` (SVG source + 1024 PNG):
  `f-sunrise-rise-on-night` (Night Watch indigo, faint stars) and
  `g-sunrise-rise-on-cream`. Trint's gold-to-ember chevron stays as the
  mark; a half sun now rises inside it from a horizon line, so it reads
  as an arrow and a sunrise. Blueprint guides dropped: they vanish at
  home-screen size. `sunrise-rise-comparison.png` shows both beside the
  current icon at 180/96/58 px.
- Not shipped: `assets/` still has the current icon until Hayden and
  Trint pick one; then derive every slot the way `design/asset-derivatives`
  does.

### 2026-09-29 — Trint — "The org was already the org"
- `rise-again` was created as an organization from the start; the
  project (`@rise-again/rise`) was born under it, so adding Hayden as
  a member finished the setup — no migration, nothing repointed,
  every channel link keeps working.
- AGENTS.md now documents the publish ritual (gates → commit →
  `eas update` → BUILD stamp) for both owners. RELEASE.md updated.

### 2026-09-29 — Trint — "Release prep: sample history retired, release map, privacy policy"
- The Patterns sample tool is gone — store actions, `lib/sample.ts`,
  the card. On load, demo entries already on a tester's phone retire
  themselves; they were never his history.
- `completeRise` keeps `todayStr` **on purpose**: a small-hours rise
  counts from the new day so the fallen day never reads clean. The old
  review P3 was wrong; the why now lives as a comment there.
- `docs/RELEASE.md` is the road to the App Store (org → Apple → store);
  `docs/privacy.md` is the policy, served from GitHub Pages.
- TEST_WEEK.md and AGENTS.md updated to match.

### 2026-09-29 — Trint — "A loading page under the splash"
- `components/Loading.tsx`: while fonts load, just the rise mark
  breathing in dawn gold (no text, so no fallback-font flash); once
  fonts are in but the store still reads the disk, the wordmark and
  "the day is waking" join it. Theme by the clock, so night gets night.
- Wired into both boot gaps in `app/_layout.tsx` (was `return null` —
  a blank frame in Expo Go and web; installed builds hid it behind the
  native splash, which still hides then reveals this).

### 2026-09-29 — Trint — "Dawn gold icon shipped"
- Picked the blueprint chevron in bold gold-dawn ombré on mist
  (`design/icon-review/e-gold-dawn-on-mist`) as the app icon. The
  construction-guide motif stays: a guideline, drawn like a plan.
- Wired into every slot: `icon.png`, `splash-icon.png` (transparent art
  over the native cream splash), `favicon.png`, and the Android adaptive
  foreground (66% safe zone) / background (mist) / monochrome layers.
  Derivation SVGs live in `design/asset-derivatives/`.
- Icon and adaptive colors only fully appear in an installed build;
  OTA-testers see the new splash and the BUILD stamp in "you & settings".

### 2026-09-28 — Hayden (with Claude) — "Reminders and the battle plan editor"
- Built on top of Trint's "you" screen (now titled "you & settings")
  rather than adding a second settings page.
- Reminders: morning verse and evening check-in, off by default, each
  with a time in 15-minute steps. Local notifications (`expo-notifications`)
  scheduled a week ahead as one-off dates; the evening one is skipped for
  any day already checked in (after-midnight check-ins count for the day
  before). Discreet lock-screen text. Tapping opens Today or the check-in.
  Permission is asked the first time one is switched on.
- Battle plan: `data.battlePlan` (defaults to the old three SOS steps),
  editor at `/battle-plan` (reorder, remove, suggestions, write your own,
  up to 8). SOS renders it; "Text my allies", "Call an ally" (per ally),
  and "Say my memory verse" are live. When the plan texts allies, SOS
  hides its separate ally card so there's one button, not two.
- Reached from the Armory (new "your battle plan" card), "you & settings",
  and "edit your plan" on SOS.
- Hayden had asked to drop Today's SOS button and to add allies on Today;
  Trint's AI had already done both, so nothing changed there.
- TEST_WEEK.md now covers reminders and the battle plan. Checked by
  screenshot in headless Chrome (day and night); notifications themselves
  need a phone.

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
