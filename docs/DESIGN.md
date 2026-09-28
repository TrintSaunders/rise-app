# Rise — Design & Product (v0.1 draft)

## The one-line concept

**A grace-forward daily companion for men fighting for purity — designed like a sunrise, not a surveillance system.**

Two verses carry the whole product:

- The *feel*: "His mercies are new every morning." — Lamentations 3:22–23
- The *mission*: "Though the righteous fall seven times, they rise again." — Proverbs 24:16

## Tone: how it should feel in the hand

Warm, calm, quietly strong. Like a sunrise after a hard night. The app never raises its voice — even its most urgent screen (SOS) is calm: an exit door held open, not an alarm.

## Five design principles

1. **Life-giving, not crime-fighting.** Every screen should feel like it's *for* the man, not *watching* him.
2. **Grace-forward.** The most designed, most beautiful screen in the app is the one shown after a fall.
3. **Minimal with moments of wonder.** ~90% quiet cream and ink; 2–3 moments that glow (breathing circle, rising sun, dawn arc). **Rule: one glowing element per screen, max.**
4. **Honesty over streaks.** Numbers never become idols. "Days honest" is shown beside "days clean," always.
5. **Sacred privacy.** Local-first. Confessions stay on the device unless he chooses to share.

## Visual identity

### The metaphor: dawn

The entire visual system is one metaphor — morning.

- The day's progress is a small sun climbing an arc across the Today screen.
- Completing the evening check-in gently "sets" the sun; the arc fills with gold.
- After a fall, the *Rise Again* animation is literally the sun coming back over the horizon.
- Every day, without words, the design preaches Lamentations 3:23.

### Palette — "First Light"

| Token        | Hex       | Use                                                  |
| ------------ | --------- | ---------------------------------------------------- |
| cream        | `#FBF7EF` | background (light mode)                              |
| mist         | `#F1E9DB` | cards, soft surfaces                                 |
| ink          | `#2C2A26` | text — warm charcoal, never pure black               |
| dawn gold    | `#E9B44C` | the "pop": highlights, the sun, progress fills       |
| ember        | `#E07A5F` | SOS + warm actions (never alarm-red)                 |
| sage         | `#81B29A` | growth, formation, victories                         |
| night        | `#232946` | dark mode surfaces ("Night Watch")                   |
| starlight    | `#F5F1E8` | dark mode text                                       |

Gold and ember are **spices, not sauces**. If everything glows, nothing does.

### Typography

- **Display / headings:** Fraunces — a warm, humanist serif (scriptural warmth)
- **UI / body:** Inter — calm and neutral
- **Scripture is always in the serif, always italic, always with its reference.** The Word is the best-designed thing in the app.

### Shape & depth

- Card radii 20–24; buttons full-round
- One soft warm shadow only: `rgba(44,42,38,0.08)`, y=8, blur=24
- No harsh borders — surfaces separate by tone

### Motion — "calm physics"

- **Breathing circle:** 4s expand / 4s contract, looping forever (SOS)
- **Sun transitions:** check-in completes → the dawn arc fills with gold, left to right
- **Rise Again:** the sun clears the horizon over ~2s, then the whole screen brightens
- **Haptics:** one soft tap on completion; *never* buzzes on failure

### Dark mode — "Night Watch"

Evening check-ins happen at night, often in bed. Night Watch is deep indigo (`#232946`) with warm gold accents and tiny star points — cozy and watchful, never gloomy. Triggers automatically after sunset; manual toggle.

## App structure (5 tabs + modals)

1. **Today** — the daily rhythm: verse, dawn arc, actions, and the SOS button
2. **SOS** — the Way of Escape, its own tab so it's one tap from anywhere (its tab bar turns night with it)
3. **Allies** — the people who stand with you, weekly digest, "check on me" *(v0.3)*
4. **Patterns** — honest data, gently read back
5. **Armory** — verse memory, reading plans, the battle plan editor

Modal stack (never more than one tap away): evening check-in, log a struggle, **Rise Again**.

---

## Screens

### Today (home)

Purpose: a 10-second orientation — who I am, whose I am, what today holds.

```
┌──────────────────────────────────┐
│                                  │
│  Good morning, David             │
│  Tuesday, September 30           │
│                                  │
│  ╭────────────────────────────╮  │
│  │  “His mercies are new      │  │
│  │   every morning.”          │  │
│  │               — Lam 3:23   │  │
│  ╰────────────────────────────╯  │
│                                  │
│         ﹏ sun climbing ﹏        │
│   day 14 honest · day 6 clean    │
│                                  │
│  ┌─────────────┐ ┌────────────┐  │
│  │ log a       │ │ evening    │  │
│  │ struggle    │ │ check-in ✓ │  │
│  └─────────────┘ └────────────┘  │
│                                  │
│   ╭──────────────────────────╮   │
│   │   I'M STRUGGLING NOW     │   │
│   ╰──────────────────────────╯   │
│                                  │
│ Today SOS Allies Patterns Armory  │
└──────────────────────────────────┘
```

- Greeting by time of day; real date
- Verse card: his life verse, or verse of the day
- The dawn arc (`components/DawnArc.tsx`, SVG): a soft gold dome with the sun riding the arc at the real time of day (6am to 8pm) and a gold trail behind it. The evening check-in fills the rest of the arc and warms the dome
- The two counters as numbers with small labels: days honest first, days clean second
- The content scrolls; the SOS button is pinned below it, always visible
- On the web at laptop width, the whole app sits in a centered phone-width column (`app/+html.tsx`)
- Two quiet actions; the check-in button begins glowing gold after 8pm if unlogged
- The SOS button — ember colored, and it *breathes* subtly even at rest

### SOS — "The Way of Escape" (1 Cor 10:13)

Purpose: the 90 seconds between temptation and decision. Calm the body, point the eyes, open the exit.

Lives in its own tab (and the Today button jumps there). Every visit starts fresh — the victory card from last time never lingers.

```
┌──────────────────────────────────┐
│                                  │
│                                  │
│           ( ( ( ● ) ) )          │
│            breathe               │
│                                  │
│    “Flee youthful passions;      │
│     pursue righteousness.”       │
│               — 2 Tim 2:22       │
│                                  │
│   ┌──────────────────────────┐   │
│   │  ✆  Text Marcus          │   │
│   │  ✆  Call Marcus          │   │
│   │  →  Leave the room       │   │
│   │  →  Cold water on face   │   │
│   └──────────────────────────┘   │
│                                  │
│     ☀  I made it through        │
│                                  │
└──────────────────────────────────┘
```

- Full-screen; this screen is *always* in Night Watch colors, even in light mode
- The breathing circle: 4s in, 4s out, with the word "breathe" fading with it
- His memorized verse beneath
- Exits in HIS order (the battle plan he set in the Armory): text an ally, call an ally, physical move
- **Your allies** card, right under the verse (reaching out comes before the list): the "tell my allies I'm tempted" button always shows — with no allies yet it opens the add form. Up to five people, added right on this screen and kept only on the phone. One button — "tell them I'm tempted" — and a single fixed sentence goes out; nothing about when, where, or why
- "I made it through" logs a **victory**, not a mere non-event
- Nothing on this screen condemns. It exists to get him out.

### Evening check-in

Purpose: 30 seconds of honesty, every night. Three questions, that's all.

1. How was today? — a 1–5 honest scale (faces that get *calmer*, not sadder)
2. Were you tempted? — no / yes, and I fled / yes, and I fell → routes to the victory note or Rise Again
3. One line of gratitude (optional)

Completing it "sets" the sun; the dawn arc fills with gold.

### Rise Again — the fall flow (the most important screen in the app)

Purpose: make getting back up easier and faster than falling.

```
┌──────────────────────────────────┐
│                                  │
│              🌅                  │
│                                  │
│      The sun rose again.         │
│      So will you.                │
│                                  │
│   “If we confess our sins,       │
│    he is faithful and just       │
│    to forgive us our sins.”      │
│               — 1 John 1:9       │
│                                  │
│   ☑ Confess to God (guided)      │
│   ☐ Tell Marcus                  │
│                                  │
│      ┌────────────────┐          │
│      │   RISE AGAIN   │          │
│      └────────────────┘          │
│                                  │
└──────────────────────────────────┘
```

- Opens on the sunrise animation: "The sun rose again. So will you."
- 1 John 1:9, then two honest checkboxes: confess to God (a short guided prayer), tell an ally (optional, pre-set)
- Counters reset **without erasing history** — the pattern graph keeps every rise, because a man who falls and keeps rising is the whole story (Prov 24:16)
- The button at the end is warm gold, and the sun clears the horizon

### Allies

- Ally cards: name, relationship, digest frequency
- Weekly digest preview — facts, never shame framing: *"Marcus logged 3 struggles this week and reached out once. That's what winning looks like."*
- **"Check on me tonight"** — sends a real ping to an ally
- SOS alerts — **built on the SOS tab**: "tell them I'm tempted" says exactly that, never when or why. Local path: a ready-to-send group text from his own phone. Server path (built, off): one tap, sent from a Rise number. Choice pending — see `server/README.md`

### Patterns

- Fortnight heat map by hour — where the dark hours live
- Trigger tags ranked: lonely / bored / tired / in bed / stressed / procrastinating
- Gentle insight copy: *"Most of your struggles happen after 11pm, alone, in bed. What if the phone slept in the kitchen?"* — suggestions, never verdicts
- The rise line: every fall **and** every get-back-up plotted; the trend is the story

### Armory

- **Verse memory** (Phil 4:8 filling, not just fencing; Ps 119:11) — built, behind `flags.armoryMemory`:
  - **Folders** he makes and names; a verse can live in several, and its progress is kept once, per verse
  - **Suggested sets**: *Verses for the fight* first, in learning order — 1 Tim 4:7, Heb 2:18, Job 31:1, Ps 119:11, then 1 Cor 10:13, 2 Tim 2:22 and on — then the Navigators' Topical Memory System, series A–E (60 verses)
  - **Review**: reference first, first-letter hint if needed, then the full verse; "got it" stretches the gap (1 → 2 → 4 → 7 → 14 → 30 days), "not yet" steps back one and returns tomorrow — never a reset to zero. A verse at five steps counts as memorized
  - **Memorize together**: share a folder with a friend as a link in a message he sends himself; the friend previews it and adds a copy. No server and no account — progress stays on each phone, and "send how it's going" texts a plain progress line. Live shared progress would need a server and is a separate decision (see the privacy house rule)
- Reading plans and short teaching: theology of the body, the brain science of porn
- **Battle plan editor**: his personal escape sequence, in his order, shown on the SOS screen

---

## Copy tone

Write like a faithful older friend: warm, direct, hopeful. Never cringe, never preachy, never a scold.

- ✅ "You made it through. That's a real win."
- ✅ "It's been 40 days since you last told the truth about a hard day. That's the muscle."
- ❌ "Relapse detected."
- ❌ "Don't fail God again."
- ❌ Alarms, countdowns, red, shame.
- ❌ Em dashes in on-screen copy. Use a period, comma, or colon instead. Scripture quotes keep their translation's punctuation, and a reference sits alone under its verse with no leading dash.
