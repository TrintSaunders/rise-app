# Roadmap

## v0.1 — The Daily Rhythm *(first build)*

- Onboarding: name, life verse, (optionally) first ally
- Today screen: greeting, verse card, dawn arc + counters
- SOS tab: breathing circle, verse, ally contact links, "I made it through"
- Evening check-in: 3 questions + gratitude
- Local notifications: morning arm (user-set time), evening check-in reminder
- All data local

## v0.2 — Honest Data

- Temptation log with auto-captured tags (time, place, device) + feeling tags
- Patterns screen: hour heat map, trigger ranking, rise line
- Victory log ("I made it through" moments)

## v0.3 — Allies

- Ally management + "check on me tonight" ping
- Weekly digest email (tiny serverless function — the only server, stores nothing)
- Rise Again → "tell an ally" flow

## v1.0 — Life

- Night Watch dark mode (auto after sunset)
- Verse memory: folders, suggested sets (fight verses + Topical Memory System), spaced-repetition review, share folders with friends — *built behind `flags.armoryMemory`, not yet switched on*
- First reading plan
- Encrypted local export/backup
- Typography, motion, and haptics polish pass

## Later (post-1.0)

- DNS-level filtering profile; Screen Time / Family Controls integration
- Small-group mode (3–5 men)
- Home-screen widget: today's verse + SOS shortcut

## Tech notes

- React Native (Expo), TypeScript, local-first storage (SQLite or AsyncStorage to start)
- Design tokens live in one `theme.ts` — single source of truth for the palette, type, and motion values in [DESIGN.md](DESIGN.md)
- Weekly digest: serverless email service; no data stored server-side, ever
- Blocking/filtering deliberately deferred: it's scaffolding, not the cure
