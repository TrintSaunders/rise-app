# App Store listing — draft copy

Everything submission day needs, in the app's voice. Field limits are
Apple's; drafts below fit them. Nothing here ships until Trint reads it
and calls it his.

## Identity

- **App name (30):** `Rise`
  — Check availability in App Store Connect; if taken, fall back to
  `Rise — daily strength` (19).
- **Subtitle (30):** `honest help for the fight` (25)
- **Primary category:** Lifestyle · **Secondary:** Health & Fitness
- **Bundle ID:** com.trintsaunders.rise (already set)

## Keywords (100 max)

```
purity,accountability,scripture,bible,prayer,temptation,honesty,faith,devotional,daily,streak
```

(93 characters. No words duplicated from name/subtitle — Apple ignores
repeats.)

## Description (first 3 lines carry the fold)

```
The daily fight for purity — without shame.

Rise walks with you through the day and the night: Scripture close at
hand, the truth told honestly, and a way out when it gets hard.

"The righteous fall seven times and rise again." — Proverbs 24:16

THIS DAY
A verse to carry, a gentle arc of daylight, and two honest numbers:
how many days you've told the truth, and how many you've stood. A fall
never erases the record — it starts a rise.

EVENING CHECK-IN
Thirty seconds: how the day went, whether you were tempted, one thing
worth thanking God for. Past midnight still counts for the day before.

WHEN IT'S HARD
One tap opens SOS: a breathing rhythm to steady you, the word ready
to hand, your plan for the moment, and a text to the friends you
chose — it tells them you're tempted, never why.

THE PATTERN, TOLD GENTLY
Two weeks of honest data — when the dark hours land, what usually
goes on — read back like a friend who wants to help, not a judge.

HIDE THE WORD
An Armory of verses in spaced-repetition memory, your own folders,
and sets to share with the people walking with you.

PRIVATE BY DESIGN
No account. No servers. Everything — every check-in, every victory,
every fall you were honest about — lives on your phone and nowhere
else. Delete the app and it's gone.
```

## Promotional text (170, editable without review)

```
Built for the week you're in: honest check-ins, a rhythm to breathe
by when it's hardest, and friends one tap away. Everything stays on
your phone.
```

## What's New (1.0)

```
First release. The whole rhythm is here: mornings with the word,
evenings of truth, SOS with your people, and a record that never
shames — it just remembers you rose.
```

## Privacy (App Store Connect answers)

- Collects data: **No**. Track you: **No**. No analytics, no ads, no
  accounts, no third-party SDKs doing either.
- Privacy policy URL: https://trintsaunders.github.io/rise-app/privacy
  — contact is support@riseagainapp.com.

## Age rating questionnaire (answer honestly, it self-computes)

- Unrestricted web access: No · Gambling: No · User-generated content
  shared publicly: No
- The app discusses lust and temptation in pastoral language. If the
  questionnaire asks about sexual content, answer "None" — it's
  support and Scripture, not depiction. Expect a 4+ or 9+ result.

## Screenshots (needed before submission)

6.7" (iPhone) required; 6.5" auto-fills. Take them from the TestFlight
build: Today (day), Evening check-in, SOS help view, Patterns with a
week of real use, Armory review card, "you & settings". Real use beats
staged data — and the sample tool is gone on purpose.

---

## Added by Hayden (with Claude), 2026-09-30

Fills in what submission day also asks for. Trint's copy above stays the
draft of record.

### URLs and contact

| Field | Value |
|---|---|
| Support URL | https://trintsaunders.github.io/rise-app/support (move to riseagainapp.com once the site is up) |
| Marketing URL (optional) | https://trintsaunders.github.io/rise-app/ (later: https://riseagainapp.com) |
| Privacy policy URL | https://trintsaunders.github.io/rise-app/privacy |
| Support email | support@riseagainapp.com (now on the support page and in the privacy policy) |
| Copyright | 2026 Trint Saunders (must match the developer account name) |

### Content rights

"Does your app contain, show, or access third-party content?" **Yes**, and
you have the rights: the ESV® and NASB® quotations are used under each
publisher's quotation permission, with their notices in the Armory.

### iPhone only, no export question

`app.json` now has `supportsTablet: false` (no iPad screenshots or iPad
review) and `ITSAppUsesNonExemptEncryption: false` (no encryption question
on every build). Both apply from the next native build.

### Notes for App Review

Paste into App Review Information → Notes. No demo account needed.

```
Rise needs no account. On first launch, enter any name (the life verse is optional).

Main flows:
1. SOS tab: press the large button to open the help page and the user's battle plan.
2. Allies: on Today, add an ally with any phone number. On SOS, "tell my allies I'm tempted" opens the Messages composer with a short pre-written text. Nothing is sent unless the user taps Send.
3. Evening check-in and "Log a struggle" on Today. Answering "I fell" opens Rise Again, a grace-focused recovery screen.
4. Reminders: the person icon on Today opens "you & settings". Notifications are scheduled locally.
5. Armory: Scripture memory with spaced repetition. Copyright notices are at the bottom.

All data stays on the device. The app collects no data, has no analytics, and makes no network requests of its own. It addresses sexual temptation from a Christian perspective and contains no explicit content.
```

### Two things to settle before submitting

1. **Age rating.** Apple's questionnaire asks about "Mature or suggestive
   themes" separately from sexual content. Rise names lust and porn
   plainly (onboarding, Patterns, the Armory), so "Infrequent/Mild" on
   that one question is the safer honest answer (likely 13+). A rating
   Apple thinks is too low is a common rejection; one that's slightly
   high costs nothing for this audience.
2. **Em dashes.** The in-app copy rule (AGENTS.md house rule 3) keeps em
   dashes out of on-screen text; the store copy above still has several
   ("The daily fight for purity — without shame."). Worth matching the
   app's voice before pasting.
