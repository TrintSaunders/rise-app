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

- Guided walks: a 30-day plan, a "seven rises" plan built on the
  Proverbs 24:16 story, each day pairing the word with the rhythm.
- Armory pro: more packs, print-ready verse cards. (No narration —
  in this app, a voice is a person or it's silence.)

## Pillar 4 — Continuity

- **Encrypted sync.** Opt-in, end-to-end: the story is encrypted on
  the phone, the server stores ciphertext it cannot read. The privacy
  promise survives — identity lives on the server, his story never
  does.
- Keepsake export: the story-so-far as a printable testimony.

## Pillar 5 — Lamp: the intelligence that never leaves the phone

The big catch. Opal's free tier makes blocking a commodity, and their
AI coaching lives in the cloud — so Rise's AI inverts that: **it runs
on his phone, on Apple's on-device model, and the story still never
leaves the device.** The privacy vow that has been the app's spine
becomes the AI's headline instead of its casualty. Name it **Lamp**
(Psalm 119:105 — a lamp to his feet: it lights the data, the Word and
the brothers do the walking; alternative, "The Scribe").

Three jobs, one discipline:

- **Pattern analysis, said out plain.** "Your falls cluster 10pm to
  midnight, mostly on days without a check-in, and this month it's
  boredom more than loneliness." Lamp reads the same honest data
  Patterns charts, but narrates it — cross-referencing hours, feelings,
  check-in gaps, and rises — and proposes one next step, never a
  verdict.
- **The restriction walkthrough.** Instead of a settings form, a
  conversation: Lamp asks about the habits ("what does 11pm usually
  look like?"), drafts a Guardrails plan — shield these apps, dark
  hours 10–6, a 20-minute budget there — and applies it only when he
  approves each line. Conversational setup is genuinely better UX
  than Opal's forms, and it's setup for guardrails he'll actually
  keep, because he chose them out loud.
- **The scribe.** "Make me a folder for late-night fear." Lamp selects
  and arranges verses from the app's own verse database into a folder,
  ready for the Armory's spaced repetition. It solves Armory's
  cold-start problem in one sentence.

**The discipline — three hard rules, because an AI loose in a Bible
app is a liability:**

1. **Lamp never quotes Scripture from memory.** It can only select
   and arrange from the human-typed verse database. A misquoted verse
   in this app would be unforgivable; this makes it impossible.
2. **Lamp doesn't free-form pastor.** It works in structured outputs —
   summaries, plan drafts, folder drafts — rendered in the app's own
   vetted, shame-free voice. The worst moments route to humans: SOS,
   allies, crisis lines. The lamp doesn't talk you through the night;
   it shows you where you put the phone down.
3. **On-device first, cloud never unless he asks.** Apple's Foundation
   Models framework (iOS 26+, iPhone 15 Pro and newer) is free at
   runtime and reads nothing off the phone. Older iPhones get the
   deterministic insight engine (today's `buildInsight`, extended) —
   same truths, template prose. If a cloud boost is ever added, it's
   opt-in, disclosed, aggregate-only, and the privacy policy's second
   chapter ships first.

Expo note: Lamp needs a dev build with a small Swift module bridging
Foundation Models; the app itself stays React Native.

## Pillar 6 — Presence (the human moat)

What a secular utility structurally cannot have: allies, Scripture,
the shepherd shape.

- **Watch SOS — help that lives outside the trap.** Opening the iPhone
  to get help means entering the room where the temptation lives. An
  Apple Watch app flips that — breathing on the wrist, one tap to
  signal allies, the day's verse as a complication, never a phone
  unlock. No secular blocker will build this because no secular
  blocker has anyone to signal.
- **Sit with me — live co-presence.** When he taps SOS at 1am, the
  ally's phone lights up *now*: "he's in it — two taps to let him know
  you're praying." An opt-in shared breathing session: both screens
  breathe in the same rhythm, an ocean apart. Covenant Eyes ships cold
  weekly reports; nobody ships warmth in real time.
- **Ally voice notes.** An ally records 30 seconds — "you're going to
  make it, I've been there" — and it plays the next time SOS opens.
  (A friend's voice, not narration — audio only ever human.) Cheapest
  feature in this document; the one nobody would ever leave.

Lamp is the headline; Presence is why nobody copies Rise at any
price.

## The line between free and paid

| | Free forever | Rise+ |
|---|---|---|
| Daily rhythm, SOS, Patterns, Armory | ✓ | ✓ |
| Local ally texts | ✓ | ✓ |
| Guardrails (shields, budgets, dark hours) | | ✓ |
| **Lamp** (pattern analysis, restriction walkthrough, verse folders) | | ✓ |
| Ally-held locks + release requests | | ✓ |
| Live alerts, check-on-me, weekly digest | | ✓ |
| Watch SOS + Sit with me + voice notes | | ✓ |
| Guided walks, sync | | ✓ |

## Money (comps, not decisions)

The accountability category runs ~$10–20/month (Covenant Eyes,
Fortify, Ever Accountable) — most of it charging for surveillance,
which we deliberately don't do. Room to be the merciful, cheap one:
**$4.99/mo, $39.99/yr** (annual pitch: "less than a coffee a month to
keep the walls up"), 7-day trial, and **gift a year** — pastors and
fathers buying it for men is the ministry angle. The listing headline
writes itself: **the AI that reads your patterns — on your phone,
nowhere else.** StoreKit 2 native or RevenueCat; decide at build time.
Requires an Apple push/subscription setup either way, and the first
real *account* in Rise — identity on the server, story still on the
phone.

## Sequencing (each phase shippable on its own)

1. **1.1 — Local guardrails.** Shields, dark hours, budgets, check-in
   gate. No server, no accounts — Family Controls entitlement (Apple
   wants a short form explaining the use) and premium unlocks via a
   simple one-time "Rise+ early" purchase if we don't want StoreKit
   subscriptions yet. Form-based setup for now; Lamp takes over the
   walkthrough in 1.2.
2. **1.2 — Lamp.** Pattern analysis, the restriction walkthrough, the
   scribe's verse folders — on-device, no server (the App Store bills
   the subscription; nothing of his goes anywhere). Needs a dev build
   with the Foundation Models bridge. **This is the marketing beat.**
3. **1.3 — The server era.** Accounts + push; weekly digest (maybe
   free), live alerts, check-on-me.
4. **1.4 — Presence.** Watch SOS, Sit with me, ally voice notes.
5. **1.5 — Ally-held locks** with release requests.
6. **Then** — walks, sync, small groups. VPN/DNS filtering stays
   parked: heavy, scrutinized, and the roadmap already called it
   scaffolding.

## Open questions for Trint and Hayden

- Lamp or The Scribe — and Rise+ vs "Rise Together" for the tier?
- Device floor: Lamp needs iOS 26 on iPhone 15 Pro or newer. Older
  phones get template-prose insights — is that an honest tier, or do
  we discount for them?
- Does a cloud boost *ever* happen (opt-in, aggregate-only), or is
  "never leaves the phone" the forever line we market?
- Subscriptions vs one-time for 1.1's simple unlock?
- Is the weekly digest free (the bridge) or paid (the hook)?
- When accounts arrive, the privacy policy needs its second chapter —
  write it *before* the first login screen, not after.
- App Review notes: Screen Time apps get a careful read from Apple —
  purpose strings and the Family Controls entitlement request should
  quote this document's mercy-not-cage framing. And Apple's AI rules
  forbid overclaiming; Lamp is an analyst and a scribe, never a
  counselor, in every line of copy.
