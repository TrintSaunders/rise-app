# App Review — rejection log & responses (Rise-Again 1.0)

## 2026-10-27 — Guideline 2.3.8 "Accurate Metadata": the icon reads as a placeholder

**The verdict** (Resolution Center, pasted by Trint 2026-10-27): the app
icons "appear to be placeholder icons." Submission
`0f09f27e-6506-4aac-994d-66411c1631d9`, reviewed 2026-10-27 on iPhone 17
Pro Max and iPad Air 11-inch (M3), version 1.0 build 10. The 2.1.0
"Information Needed" items were **not re-raised** — the Oct 4 answers and
recording satisfied completeness. The review also finally moved after the
expedite request (submitted Oct 14, reviewed Oct 27). This rejection is
about one thing only: the icon.

**Why Apple read it that way — a fair read.** The shipped icon is the
blueprint chevron (`e-gold-dawn-on-mist`): a construction-guide motif
whose art literally includes blueprint guides — concentric circles, a
dashed guideline, an angle marker. That is the visual language of a
design-in-progress sheet. Hayden's 2026-09-29 note already flagged that
blueprint guides "vanish at home-screen size," and the sunrise concepts
(`f-sunrise-rise-on-night`, `g-sunrise-rise-on-cream` in
`design/icon-review/`) were built for exactly this. The icon pick has
been the open decision in PROGRESS.md since September; Apple just
weighted it.

**The fix path (an icon swap, not a metadata edit):**

**Decided 2026-10-27 (Trint): keep the current logo, remove every
construction guide.** The finalized icon is the shipped composition
minus the drafting scaffolding: mist background, the ground line, and
the dawn-gold rise — no circles, dashed lines, or crosshair. Done the
same day in `design/asset-derivatives/` (fresh `icon.svg`/`splash.svg`/
`fg.svg`/`mono.svg`, all six PNGs re-rendered; `icon.png` is now RGB,
no alpha). The sunrise concepts stay in `design/icon-review/` as the
next step if Apple still objects.

1. ~~Pick the icon~~ — decided (above).
2. ~~Derive every slot~~ — done.
3. **New binary build (11)** — the home-screen icon is baked into the
   IPA; an OTA update cannot change it. Trint gave the go-ahead
   in-session 2026-10-27; `eas build -p ios --profile production`,
   then submit.
4. Upload the matching 1024 marketing icon in ASC (version 1.0 → App
   Store tab → App Store Icon) — UI step for Trint; note the ASC API key
   currently 401s (see PROGRESS 2026-10-27).
5. Reply in Resolution Center (draft below), **after** build 11 is
   attached to the version.
6. Resubmit for review. On approval: press Release (still manual).

**Reply once build 11 is attached:**

```text
Hello,

Thank you for the review and the clear note. The construction-guide
styling in the previous icon was an intentional motif, but we
understand how it reads as unfinished at icon size. We have finalized
the app icon: the rise mark now stands alone on its mist background,
with every construction-guide line removed, used consistently in the
App Store listing and the app itself. The new build (11) with the
finalized icon is attached to this version, and we are resubmitting
for review.

Thank you,
Trint Saunders
```

---

## 2026-10-03 — Guideline 2.1.0 "Information Needed" (answered; not re-raised)

Apple's verdict on 1.0 / build 10 (message dated 2026-10-03, 7:21 PM;
read 2026-10-14): **Guideline 2.1.0 - Performance: App Completeness -
Information Needed.** Not a defect finding — the reviewer says the
account has a limited App Review history and asks for details about
what the app is and does. Answering is expected to return the same
submission to the review queue; no rebuild, no new version, build 10
stays attached.

Everything Trint needs to paste is below. Items 2 through 6 are drawn
from the app as built and the listing already on file; item 6 counts
the actual verses shipped (11 verses of the day, 77 ESV + 1 NASB in
the memory library = 89 total).

## Trint's steps, in order

1. **Record the screen capture** (item 1 below) on a physical iPhone
   running the TestFlight build. Shot list at the bottom of this file.
2. **Reply in Resolution Center** (App Store Connect → Rise-Again →
   version 1.0 → App Review → Resolution Center) with the reply text
   below, **attaching the recording** to the reply.
3. **Replace the Notes field** (App Review Information section) with
   the Notes text below, so future submissions carry it. Either paste
   it in the UI, or ask and it can be pushed through the ASC API from
   here — that's an App Store Connect change, so it waits for a
   go-ahead.
4. After replying, watch the version state (or ask; it can be checked
   through the API). "Information Needed" replies normally resume
   review without resubmitting.

## Reply for Resolution Center

```text
Hello,

Thank you for the clear notes. Answers below, in the order you asked.

1. Screen recording
Attached to this reply: a recording captured on a physical iPhone
showing the typical user flow: first launch and setup, the Today
screen, the evening check-in, logging a struggle and the Rise Again
screen that follows, the SOS tab (breathing, the battle plan, and the
allies text composer opening the Messages app with a short pre-written
text; nothing is sent unless the user taps Send), the Patterns screen,
the Armory Scripture memory screen including its copyright notices, and
settings (reminders and encrypted backup).

Rise has no account system, so there are no registration, login, or
account deletion flows to record. There is no paid content and no
purchase anywhere in the app.

2. Purpose, audience, problem solved, value
Rise is a free companion app for men who want to stop using
pornography and live honestly, built around Christian encouragement
rather than shame. The audience is adult men fighting sexual
temptation, particularly those with a faith community. The problem:
accountability and purity apps tend to track and shame users, and men
abandon them. Rise instead offers a simple daily rhythm (a verse in
the morning, an honest check-in at night), immediate help in the
moment of temptation (a breathing rhythm, Scripture, and a pre-written
text to friends of his choosing), a gentle readback of two weeks of
his own honest data, and Scripture memorization. It is private by
design: no account, no analytics, no data collected, and nothing
leaves the phone except messages he chooses to send through his own
Messages app.

3. Setup and access to main features
No credentials, accounts, or sample files are needed. On first launch
the app asks for a first name (any name works; the life verse is
optional). Every feature is available immediately after that; there is
nothing to unlock or sign into.

4. External services
None for the app's functionality. All data is stored locally on the
device; reminders are local notifications; backups are encrypted on
the device with a passphrase and leave the phone only as a file the
user himself saves through the iOS share sheet. The app makes no
network requests of its own for its features; the only network
activity is the standard Expo framework check that delivers app
updates (app code only, no user data).

5. Regional differences
None. The app functions the same in all regions and storefronts. It
uses the device's local time and calendar (for example, a check-in
just after midnight counts for the day before), so behavior follows
the device clock, not the region.

6. Regulated industries and protected third-party material
The app does not operate in a regulated industry. The only third-party
content is Scripture: 89 verses in total, all short quotations. 77
memory verses and 11 verses of the day follow the ESV wording (the
daily ones lightly trimmed to fit a card); 1 memory verse is NASB.
This is within each publisher's published quotation policy (gratis
use of up to 500 verses with attribution). The required notices are
displayed in the app at the foot of the Armory (Scripture memory)
screen:

"Scripture quotations are from the ESV® Bible (The Holy Bible, English
Standard Version®), © 2001 by Crossway, a publishing ministry of Good
News Publishers. Used by permission. All rights reserved. Scripture
marked NASB is taken from the New American Standard Bible®, © 1960,
1971, 1977, 1995 by The Lockman Foundation. Used by permission. All
rights reserved. lockman.org"

The app is entirely free with no purchases. Before any future paid
features make use of the texts, we will obtain written permission from
both publishers.

Please let us know if anything else would help the review. Thank you.
```

## Notes for the App Review Information field

Replaces the current Notes (which cover the same ground more briefly).
Fits Apple's field limit with room to spare.

```text
Rise is a free companion app for men fighting sexual temptation and
pornography use, from a Christian, grace-forward perspective. No
accounts, no purchases, no data collected; everything stays on the
device.

Setup: no credentials needed. First launch asks for any first name;
all features are available immediately after. There is no login and
nothing to unlock.

Flows for review:
1. Today: verse of the day, streak counters, evening check-in.
   Answering "I fell" opens Rise Again, a grace-focused recovery
   screen.
2. SOS tab: the large button opens breathing, the user's battle plan,
   and "tell my allies I'm tempted", which opens the Messages composer
   with a short pre-written text. Nothing is sent unless the user taps
   Send.
3. Patterns: two weeks of the user's own check-in data, read back
   plainly.
4. Armory: Scripture memory with spaced repetition, folders, and
   sharing by reference codes.
5. Settings (person icon on Today): reminders (local notifications),
   encrypted backup (AES-256-GCM, passphrase-derived), Night Watch
   theme.

External services: none for functionality. Local storage and local
notifications; backups are encrypted on the device and exported by the
user through the share sheet. The only network activity is the
standard Expo update check (app code only, no user data).

Regional: identical in all regions; uses the device's local clock and
calendar.

Third-party content: Scripture only. 89 verses total (88 ESV wordings,
77 in the memory library and 11 verses of the day; 1 NASB), within each
publisher's published 500-verse quotation policy. Copyright notices
are displayed at the foot of the Armory screen. The app is free;
written permission will be obtained before any paid use of the texts.
```

## Escalation (added 2026-10-14, after 10 days of silence)

**What the API showed:** version state REJECTED, **no
appStoreVersionSubmission record** (nothing queued), build 10 attached
and VALID. The Oct 4 replies + video sit in the Resolution Center
thread, but no review was ever resumed. A reply on a hard-rejected
version did not requeue it.

**The fix:** resubmit version 1.0 from ASC — the rejected state allows
edits and Submit for Review; build 10 stays attached (no rebuild), and
the Resolution Center thread, attached video, and the Notes field all
carry over. Expect WAITING_FOR_REVIEW within minutes, review in
24–48h.

**If it stalls again** (3+ days in WAITING, or quiet after IN_REVIEW),
contact Apple — developer.apple.com/contact/app-store/, topic App
Review. **Trigger fired 2026-10-20** (four business days in
WAITING_FOR_REVIEW since the Oct 14 resubmit; queue record confirmed
present via the API). Final text:

```text
Subject: Review status — Rise-Again 1.0 (build 10)

Hello,

App "Rise-Again" (Apple ID 6818577524), version 1.0 build 10, received
a 2.1.0 "Information Needed" rejection on October 3. We replied in
Resolution Center on October 4 with all six items requested, including
a screen recording captured on a physical device attached to the
reply, and added the same information to the App Review Information
notes.

The version has been in "Waiting for Review" since we resubmitted on
October 14 — six days, four of them business days, with no status
change. Could you confirm the submission is progressing through the
review queue and let us know if anything further is needed from us?

Thank you,
Trint Saunders
```

**2026-10-21 update:** the App Review contact form's topics turned out
to be appeal-a-rejection / expedited review / technical question /
reinstate program — no plain status inquiry. **Use "Request an
expedited app review"** (appeal is for contesting a rejection; ours
was answered and resubmitted). Reason text for the form:

```text
App: Rise-Again (Apple ID 6818577524), version 1.0, build 10 — our
first release.

Our submission received a 2.1.0 "Information Needed" rejection on
October 3. We replied in Resolution Center on October 4 with all six
requested items, including a screen recording captured on a physical
device, and added the same information to the App Review notes. After
resubmitting on October 14, the version has remained in "Waiting for
Review" for four business days.

We are requesting an expedited review, or simply confirmation that
the submission is progressing and nothing is stuck. Everything on our
side has been ready for over two weeks — the listing, the answers,
and the recording — and we have been unable to launch our first
release since October 3.

Thank you,
Trint Saunders
```

If the expedite is denied with a form letter and the state still
hasn't moved after a few more days, the remaining lever is Developer
Support phone/chat (developer.apple.com/contact/), who can open a
ticket and check with App Review directly; the plain status note
above works for that channel.

Levers if the first reply is slow or unhelpful: Apple Developer Support
phone/chat (developer.apple.com/contact/ — they can check with App
Review directly), and an expedited review request from the same contact
page (granted at Apple's discretion; strongest when a launch date is
genuinely time-sensitive).

## Screen recording shot list (physical iPhone, TestFlight build)

Use Control Center's Screen Recording; one take of about 2 to 3
minutes is plenty. A fresh install (delete and reinstall first) shows
onboarding; a phone with a week or two of history shows a livelier
Patterns screen. Either is fine; do show a fall and Rise Again, since
that flow is the heart of the app.

1. Cold launch → onboarding (enter any name) → arrive on Today.
2. Today: let the verse and counters show, scroll to the allies card.
3. Open the evening check-in; answer honestly once (choosing "I fell"
   opens Rise Again; complete it).
4. SOS tab: press the large button → help page: breathing, battle
   plan → open the allies text composer, then cancel → tap "I made it
   through".
5. Patterns: the two week readback.
6. Armory: open a set or folder, review one verse, then scroll to the
   bottom so the copyright notices are on camera.
7. Person icon on Today → you & settings: reminders toggle, backup
   card. Stop recording.

Recording on a scratch install keeps test falls out of your real
history; if you record on your daily phone, the fall logged on camera
stays in your Patterns until the next rise.
