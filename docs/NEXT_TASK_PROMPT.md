# Next task — copy this prompt into a fresh session opened at `~/Desktop/rise-app`

> **Done** in "Complete daily rhythm, honest data, and Night Watch" (2026-09-27).
> Kept for reference; paths below have since moved (SOS is now `app/(tabs)/sos.tsx`).
> For what's current, read `docs/PROGRESS.md`.

---

You're working on **Rise** — a grace-forward app helping men fight lust through Scripture, honesty, and allies (mercy, not shame). It's an Expo app: React Native, TypeScript, expo-router. Before writing any code, read `README.md`, `docs/DESIGN.md`, and `docs/ROADMAP.md`, then look at `app/(tabs)/today.tsx`, `app/sos.tsx`, `lib/verses.ts`, and `constants/theme.ts` to absorb the existing patterns.

**This task: complete the daily rhythm** (finishes v0.1 and the storage heart of v0.2).

1. **Persistence** — a small typed local store (`lib/store.ts`, AsyncStorage is fine for now). All data stays on-device. Records: `day` (date, check-in answers, gratitude), `temptation` entries (timestamp, feeling tags, outcome: fled/fell), `victory` entries ("I made it through" moments).
2. **Onboarding (first launch only)** — ask his name and life verse; the Today greeting uses his name thereafter.
3. **Evening check-in** — the 3-question flow from DESIGN.md: how was today (1–5); tempted? (no / yes, I fled / yes, I fell); one line of gratitude. Completing it marks the day complete and fills the dawn arc with gold.
4. **Real counters on Today** — "day N honest · day N clean," honest streak first. A day counts as honest when a check-in happens, whatever the answers. History is never erased.
5. **Log a struggle** — wire the quiet card on Today: feeling chips (lonely, bored, tired, in bed, stressed, procrastinating) + outcome, saves a temptation entry.
6. **Rise Again** — when a check-in or log says "I fell," open the grace flow from DESIGN.md: sunrise, 1 John 1:9, a short guided confession, then reset the clean counter *without* deleting any history.
7. **"I made it through"** on the SOS screen saves a victory entry.

**Constraints:** use only `constants/theme.ts` tokens (no new raw hex); Scripture always in the serif italic with its reference; copy like a warm older friend, never shame (see the copy-tone section of DESIGN.md); reuse `components/Breathing.tsx` for motion. Don't build Allies (v0.3) or the Patterns charts yet — their placeholder screens stay.

**Definition of done:** a full day works — onboard, see the arc and counters, hit SOS and log a victory, check in honestly, fall and rise again, and everything is still there after closing the app. Verify with `npx tsc --noEmit` and `npx expo export --platform ios`.
