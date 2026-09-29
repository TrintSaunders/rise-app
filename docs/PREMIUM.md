# Rise+ — the premium tier, thought through

Working ideas for what comes after 1.0. Nothing here is promised to
anyone yet; this is the thinking-out document Trint and Hayden pick
from. Two things are decided in spirit already:

1. **The vow: nothing in 1.0 ever goes behind the paywall.** The whole
   daily rhythm — check-ins, SOS, Patterns, Armory, local ally texts —
   stays free forever. Rescue is never a subscription.
2. **Guardrails are mercy, not a cage.** Every blocking feature below
   is something the man *chose*, for a night or a season. The framing
   is Hebrews 12:1 — throw off everything that hinders — not a prison.

## What iOS actually allows (the honest technical ground)

- **Apple's Screen Time API (iOS 15+)** lets a third-party app — with
  the user's explicit permission in Settings — *shield* chosen apps
  and categories, on schedules, with daily time budgets. Opal and
  Jomo are built on exactly this. This is the foundation: it runs on
  his phone, locally, no server needed.
- **Apple offers no way for another person to directly control an
  adult's phone.** "An ally turns it on and off for you" is really:
  the ally's request travels through a small server, and *his own
  app* — which he authorized once — honors it. He can revoke it in
  iOS Settings; we don't fight that, we design for it. The lock is a
  promise his phone keeps, which is the strongest honest lock iOS
  gives. (True enforcement — VPN filtering, screenshots, MDM — is the
  Covenant Eyes route: heavy, scrutinized, surveillance-shaped. Off
  mission for now, maybe forever.)
- Server bits needed later are small: push, ally signals,
  subscriptions. The seed already exists — `server/ally-alert` is
  built and waiting.

## Pillar 1 — Guardrails (the headline; Trint's ask)

- **App shields.** He picks the apps that cost him (the browser, that
  one app at midnight); they vanish behind Rise's shield during hours
  he chose.
- **Dark hours, automatic.** Shields on 10pm–6am by default — the same
  hours Patterns says are dangerous for most men. Night Watch isn't
  just a color scheme; it's when the guardrails rise.
- **Time budgets — "you have access for so long."** A daily allowance
  per app: 20 minutes of X, then it shields until tomorrow. The
  budget answer arrives as a gentle Screen Time notification before
  it drops, never a dead end.
- **Ally-held locks.** An ally can tighten a shield or extend it; to
  get out early, he *asks* — a release request pings the ally, and
  meanwhile the app offers SOS. The friction is the feature: it moves
  the decision out of the weak moment and into daylight.
- **The check-in gate.** Chosen apps return when the evening check-in
  is done. The rhythm and the guardrail become one thing.
- **Two carve-outs, non-negotiable:** Rise itself can never be
  shielded, and ally contact is always reachable. The way out is
  never behind the wall.

## Pillar 2 — Allies, live (turn on what's already built)

- **Real-time tempted alerts.** The Twilio path in `server/ally-alert`
  ships: SOS taps become texts that arrive while he's still in it,
  not a group-text he has to send himself.
- **"Check on me tonight."** He schedules the ping when he knows the
  night is risky; the ally gets it and knows to pray.
- **Weekly digest.** The roadmap's v0.3 item, landed: streaks kept,
  check-ins honest, one line of encouragement. (Candidate to be the
  *free* taste of the server era — the bridge feature.)
- Small-group mode (3–5 men, roadmap's later list) folds in here.

## Pillar 3 — Depth

- Audio: a narrated SOS (voice-guided breathing, the verse read over
  him) for when reading is too much.
- Guided walks: a 30-day plan, a "seven rises" plan built on the
  Proverbs 24:16 story, each day pairing the word with the rhythm.
- Armory pro: audio memory, more packs, print-ready verse cards.

## Pillar 4 — Continuity

- **Encrypted sync.** Opt-in, end-to-end: the story is encrypted on
  the phone, the server stores ciphertext it cannot read. The privacy
  promise survives — identity lives on the server, his story never
  does.
- Keepsake export: the story-so-far as a printable testimony.

## Pillar 5 — The other big reasons (the post-Opal reality check)

Opal blocks one app for free; guardrails alone make us a paid copy of
a free tool. The moat has to be what a secular screen-time utility
*structurally cannot have*: allies, Scripture, the shepherd shape.
These are the features that make someone pay for Rise knowing Opal
exists.

- **Watch SOS — help that lives outside the trap.** The real insight
  of the whole category: opening the iPhone to get help means entering
  the room where the temptation lives. An Apple Watch app flips that —
  breathing on the wrist, one tap to signal allies, the day's verse as
  a complication, never a phone unlock. No secular blocker will build
  this because no secular blocker has anyone to signal. Probably the
  single strongest reason to own Rise+.
- **Sit with me — live co-presence.** When he taps SOS at 1am, the
  ally's phone lights up *now*: "he's in it — two taps to let him know
  you're praying." And an opt-in shared breathing session: both
  screens breathe in the same rhythm, an ocean apart. Technically a
  websocket and a shared timer; emotionally the loneliness-killer the
  category has never built. Covenant Eyes ships cold weekly reports;
  nobody ships warmth in real time.
- **Ally voice notes.** An ally records 30 seconds — "you're going to
  make it, I've been there" — and it plays the next time SOS opens.
  Cheapest feature in this document; the one nobody would ever leave.
- **The Mentor Portal.** The ally experience as its own surface: a
  pastor walking with twelve men sees exactly what each chose to share
  (streaks kept, "he asked for prayer last night"), nothing else, ever.
  Churches buy blocks of subscriptions — the ministry sales channel
  Covenant Eyes proved, without the surveillance aftertaste.
- **Pattern-aware shepherding.** Patterns already knows his dark hours
  and triggers; premium reads them pastorally — "your late nights
  moved an hour earlier this month; tonight's word is picked for
  exactly that." On-device, no cloud AI, just the app knowing his
  story well enough to hand him Psalm 4:8 at 11pm instead of a random
  verse.
- **Spouse mode.** The category's most-requested pairing — walking
  together, opt-in from both sides, visibility he *chooses* moment to
  moment. Needs the most pastoral care in the copy; do it last and do
  it right.

Of these, Watch SOS and Sit-with-me are the headline pair: one moves
rescue outside the phone, the other makes it human in real time.

## The line between free and paid

| | Free forever | Rise+ |
|---|---|---|
| Daily rhythm, SOS, Patterns, Armory | ✓ | ✓ |
| Local ally texts | ✓ | ✓ |
| Guardrails (shields, budgets, dark hours) | | ✓ |
| Ally-held locks + release requests | | ✓ |
| Live alerts, check-on-me, weekly digest | | ✓ |
| **Watch SOS + Sit with me + voice notes** | | ✓ |
| Mentor Portal, spouse mode | | ✓ |
| Audio, guided walks, sync | | ✓ |

## Money (comps, not decisions)

The accountability category runs ~$10–20/month (Covenant Eyes,
Fortify, Ever Accountable) — most of it charging for surveillance,
which we deliberately don't do. Room to be the merciful, cheap one:
**$4.99/mo, $39.99/yr** (annual pitch: "less than a coffee a month to
keep the walls up"), 7-day trial, and **gift a year** — pastors and
fathers buying it for men is the ministry angle. StoreKit 2 native or
RevenueCat; decide at build time. Requires an Apple push/subscription
setup either way, and the first real *account* in Rise — identity on
the server, story still on the phone.

## Sequencing (each phase shippable on its own)

1. **1.1 — Local guardrails.** Shields, dark hours, budgets, check-in
   gate. No server, no accounts — Family Controls entitlement (Apple
   wants a short form explaining the use) and premium unlocks via a
   simple one-time "Rise+ early" purchase if we don't want StoreKit
   subscriptions yet. This alone is worth the price.
2. **1.2 — The server era.** Accounts + subscriptions + push; weekly
   digest (maybe free), live alerts.
3. **1.3 — The headline pair.** Watch SOS and Sit with me (plus ally
   voice notes — small once push exists). This is the marketing beat:
   after this, Rise+ has reasons Opal can't copy at any price.
4. **1.4 — Ally-held locks** with release requests.
5. **Then** — Mentor Portal, audio, walks, sync, small groups, spouse
   mode (last, and carefully). VPN/DNS filtering stays parked: heavy,
   scrutinized, and the roadmap already called it scaffolding.

## Open questions for Trint and Hayden

- Subscriptions vs one-time for 1.1's simple unlock?
- Is the weekly digest free (the bridge) or paid (the hook)?
- Name: **Rise+**? "Rise Together"? Something with more gospel in it?
- When accounts arrive, the privacy policy needs its second chapter —
  write it *before* the first login screen, not after.
- App Review note: Screen Time apps get a careful read from Apple.
  Purpose strings and the Family Controls entitlement request should
  quote this document's mercy-not-cage framing.
