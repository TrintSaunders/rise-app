# Planned updates

Changes we've decided to make, written up well enough that any of us (or
our AIs) can pick one up and build it. ROADMAP.md is the big picture,
PREMIUM.md is the paid tier, PROGRESS.md logs what's done. When an update
here ships, move it to PROGRESS.md's log and delete it from this file.

Each plan says what it is, how it should feel, how to build it, and what
"done" means. Copy follows the house rules: warm, never shame, no em
dashes, Scripture with its reference.

---

## 1. Welcome read-through and guided tour

*Asked for by Hayden, 2026-10-03. Not started. Target: 1.1, or a 1.0.x
update if it's ready first.*

Two parts that work together on first install: a short read-through that
says why Rise exists and how it works, then a guided tour that walks him
through each button on the real screens, the way most apps do.

### Part A: the welcome read-through (before onboarding)

**What he sees.** The first time Rise opens, before "what should we call
you?", four calm pages he swipes through (or taps "next"). A row of dots
shows where he is; "skip" is always top right. Night Watch colors if it's
evening, cream if it's day, the same as the rest of the app.

| Page | Headline | Body (draft) |
|---|---|---|
| 1 | Though the righteous fall seven times, they rise again. | Proverbs 24:16, set large, with the sunrise from Rise Again behind it. |
| 2 | Why we made Rise | *Trint and Hayden to write this in their own words: who you are, why this fight matters to you, why mercy and not shame.* Two or three short sentences. |
| 3 | How it works | Morning: a verse to carry. Night: thirty seconds of honest check-in. When it's hard: SOS, one tap away, with your own way out and your allies. After a fall: Rise Again. Your history is never erased. |
| 4 | Yours alone | No account, no tracking. Everything stays on this phone, and the only things that leave it are messages you send yourself. Then the button: "Let's set you up", which opens today's onboarding. |

**Rules.**
- Shown once, on first launch only. Existing users never see it forced on
  them.
- Always re-readable: "About Rise" on the "you & settings" screen opens the
  same pages.
- Pages 2 and 3 should take under a minute to read. If it needs a scroll,
  it's too long.

**How to build it.**
- `components/Welcome.tsx`: a horizontal `ScrollView` with `pagingEnabled`
  (no new library), page dots, skip, and next. Reuse `Reveal` for the text
  coming in and the Rise Again sun for page 1.
- `app/_layout.tsx` already gates on `data.profile` to show `Onboarding`.
  Add one step in front: if `!data.tutorial.welcomeSeen`, show `Welcome`;
  its last button sets `welcomeSeen` and falls through to `Onboarding`.
- `app/about.tsx`: the same component as a modal, opened from "you &
  settings".

### Part B: the guided tour (right after onboarding)

**What he sees.** After he enters his name, a card asks: "Want a one-minute
tour? You can skip it and find it later in settings." If he says yes:

- The screen dims (night indigo at about 75%) except for a soft rounded
  "spotlight" around one button.
- Next to the spotlight, a small card says what that button is for, with
  "3 of 9", **back**, and **skip tour**.
- Only the spotlighted button can be tapped. Tapping it moves the tour on.
  Everything else under the dim is blocked.
- The spotlight glides to the next button (respecting Reduce Motion: it
  fades instead).

**The steps** (in this order, on the real screens):

| # | Spotlight | Card says (draft) | Tapping it |
|---|---|---|---|
| 1 | Verse card on Today | Your life verse, or the verse of the day. Read it in the morning; it's the first thing you see. | next step |
| 2 | Dawn arc and counters | The arc fills gold when you check in. Days honest come first: telling the truth is the muscle. A fall resets days clean, never your history. | next step |
| 3 | Log a struggle | When temptation comes, log it in seconds: what you felt, when, how it ended. Fleeing counts as a win. | next step, without opening it |
| 4 | Evening check-in | Thirty seconds before bed. A check-in after midnight still counts for the day before. | next step, without opening it |
| 5 | Your allies card | Add up to five people who'll pray when you text. They only ever hear that you're tempted, never why. | next step |
| 6 | SOS tab | When it's hard, come here. One button: breathe, read, follow your plan, tell your allies. | moves to the SOS tab |
| 7 | The big SOS button | Press it when you need it. Nothing is logged; you'll see your way out, in your order. | next step, without opening help |
| 8 | Patterns tab | Two weeks of honest data, read back gently: when it's hardest and one thing worth trying. | moves to Patterns |
| 9 | Armory tab | Hide the Word in your heart: verse memory, alone or with a friend, and your battle plan. | moves to the Armory |
| 10 | Person icon on Today | Reminders, backup, your verse, and this tour again. | back to Today, tour ends |

The last card: "That's it. You can find this again in settings. Rise is
here when it's hard." with a single **done** button.

**Rules.**
- Tapping a step that would open a real flow (log a struggle, check-in,
  SOS help) only advances the tour. The tour must never create a record.
- Skip ends it immediately and says where to find it again.
- Replay from "you & settings" → "Show me around again".
- Existing users (testers on build 9 or 10) see a one-time card on Today,
  "New: a one-minute tour", which they can dismiss for good.
- VoiceOver: each step is announced (title, body, "step 3 of 10"), and the
  spotlighted control plus back/skip are the only focusable elements.
- Larger Text: the card grows and repositions above or below the target so
  it never covers it.

**How to build it.**
- **No tour library.** The common React Native ones are old, don't know
  about tab bars, and fight Night Watch. A small custom one is less code
  than adapting them, and the pieces are already in the app:
  `react-native-svg` for the dim layer with a cut-out, and
  `react-native-reanimated` for the glide.
- `lib/tour.ts`: the step list above as data (id, target id, title, body,
  route, what a tap does), so copy changes never touch layout code.
- `components/Tour.tsx`: a `TourProvider` mounted in `app/_layout.tsx`
  *above* the tab navigator, so the dim layer covers the tab bar too.
  - Targets register with a hook: `const ref = useTourTarget('today.checkin')`
    on the button's `View`. The provider measures it with
    `measureInWindow`, re-measuring after scrolls and route changes.
  - The overlay is an SVG `Mask`: a full-screen dim rect with a rounded
    rect cut out at the target's frame (plus 8px padding).
  - Touches: a full-screen blocker, with a transparent `Pressable` sized
    to the cut-out that runs the step's action (advance, or navigate then
    advance).
  - Steps on other tabs call `router.navigate(route)` and wait for the
    target to register before showing.
  - Today scrolls; before a step, scroll its target into view.
- Store: add `tutorial: { welcomeSeen: boolean; tourDoneAt: string | null;
  tourVersion: number }` to `StoreData` with defaults. `tourVersion` lets a
  future update show a short tour of just what's new ("what's new" tours)
  without replaying the whole thing.
- Tests: step order, skip and replay state, and that no step action calls a
  store write other than the tutorial flags.

**Done means.**
- Fresh install: welcome pages, then onboarding, then the tour offer; the
  tour runs on the real screens and creates no records.
- Skip and replay both work; existing users get the one-time card, not a
  forced tour.
- Checked in day and Night Watch, at Larger Text, with VoiceOver, on an
  iPhone SE-size screen and a Pro Max-size screen.
- All three gates pass; screenshots of each step in the progress log.

**Open questions.**
- Pages 2's words: Trint and Hayden's own story.
- Should the tour also offer to set up reminders and the first ally at the
  end ("Want a nudge each night?"), or keep it purely a tour? Recommend: one
  optional "set up reminders" button on the last card; allies stay on Today.
