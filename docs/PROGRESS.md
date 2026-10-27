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

- **Store build:** iOS 1.0.0 build 10 was **rejected 2026-10-27 —
  Guideline 2.3.8 (Accurate Metadata): "app icons appear to be
  placeholder icons"** (the blueprint construction guides in the icon
  art read as scaffolding; a fair read). The 2.1.0 items were satisfied
  and the review moved after the expedite request. **Decided and done
  same day (Trint): keep the logo, strip every guide** — mist, ground
  line, dawn-gold rise; all six asset PNGs re-rendered from new SVGs.
  **Build 11** (with the finalized icon, BUILD stamp "store build 11
  (Oct 27)") is building/submitting to ASC. Remaining human steps: the
  1024 marketing icon upload in ASC, the Resolution Center reply (draft
  ready in REVIEW_REPLY.md), resubmit, Release on approval (manual).
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

## Next for Trint: finish the 2.3.8 fix and back into review

1. **Upload the finalized 1024 marketing icon** in ASC: Rise-Again →
   version 1.0 → App Store tab → App Store Icon. Use the new
   `assets/images/icon.png` (mist, ground line, rise — no guides).
2. **Confirm build 11 is attached** to version 1.0 (the ASC API key
   401s, so check the UI; if the EAS submit failed, attach build 11
   from the version page's build picker).
3. **Reply in Resolution Center** with the paste-ready draft in
   `docs/REVIEW_REPLY.md` → 2026-10-27 section.
4. **Submit for review.** On approval: press **Release** (manual).
5. **Mint a new ASC API key** (Users and Access → Integrations) and
   drop it at `~/.rise/asc/` — the current one returns
   NOT_AUTHORIZED on everything (see the Oct 27 log). Update the key
   ID in `eas.json` if it changes.
6. **Request the Family Controls entitlement** if not already sent
   (Apple Developer → Request entitlement → Family Controls,
   distribution). 1.1's guardrails depend on it and approval takes
   weeks — it can run in parallel with the review.

## Waiting on a decision

- **DNS for riseagainapp.com** (Hayden): point it at GitHub Pages, then
- **DNS for riseagainapp.com** (Hayden): point it at GitHub Pages, then
  add `docs/CNAME` (order matters; see RELEASE.md). The new marketing page
  is already live at the Pages URL.

## Decided

- **2026-10-27 — Trint — The icon keeps its mark, loses the guides:**
  answering the 2.3.8 rejection, the finalized icon is the shipped
  composition with every construction guide removed — mist background,
  the ground line, and the dawn-gold rise; no circles, dashed lines,
  or crosshair (sources refreshed in `design/asset-derivatives/`). The
  sunrise concepts stay in `design/icon-review/` as the fallback if
  Apple objects again.
- **2026-10-02 — Trint — Store name is "Rise-Again":** "Rise" and
  "Rise Again" were already taken on the App Store; the ASC record was
  created as **Rise-Again** (exact-string uniqueness makes the hyphen a
  distinct listing). The domain, support email, EAS org, and in-app
  wordmark keep their names.
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

### 2026-10-27 — Trint (with ZCode) — "2.3.8: the icon read as a placeholder; guides stripped, build 11"
- The review moved at last (expedite worked): verdict on build 10 is
  **Guideline 2.3.8 — "app icons appear to be placeholder icons"**
  (reviewed Oct 27, iPhone 17 Pro Max + iPad Air 11 M3; submission
  0f09f27e). The 2.1.0 answers held — completeness was not re-raised.
  Full analysis + reply draft: REVIEW_REPLY.md → 2026-10-27.
- The read was fair: the icon art literally carried blueprint guides
  (concentric circles, dashed lines, a crosshair). Trint decided: keep
  the logo, remove every guide. New SVGs + all six PNGs re-rendered
  (`icon.png` now RGB/no-alpha); BUILD stamp → "store build 11
  (Oct 27)"; sunrise concepts kept as fallback only.
- **ASC API key is dead:** every endpoint returns 401 NOT_AUTHORIZED
  (worked Oct 20; JWT verified well-formed locally, clock checked).
  Key likely revoked on Apple's side — Trint checks Integrations and
  mints a new one (Next-for-Trint step 5). The JWT helper now lives at
  `~/.rise/asc/asc.sh` (not /tmp) with the DER→raw-signature fix, so
  the next key works immediately. Browser ASC needs his login, so
  state checks until then are UI-side.
- Build 11 (production profile, new icon) submitted to ASC after the
  gates; remaining steps are Trint's in the ASC UI (marketing icon,
  reply, resubmit, Release).

### 2026-10-21 — Trint (with ZCode) — "Expedite request is the channel"
- The App Review contact form's topics: appeal a rejection, expedited
  review, technical question, reinstate program — no plain status
  inquiry. Pick: **Request an expedited app review** (an appeal would
  contest a rejection we already answered and resubmitted). The reason
  text — reframed from status to urgency-plus-status — is in
  REVIEW_REPLY.md → "Escalation" (2026-10-21 update).
- Fallback if denied and still stuck: Developer Support phone/chat
  with the plain status note.

### 2026-10-20 — Trint (with ZCode) — "Four business days in WAITING; escalation triggered"
- API check (after recreating the JWT helper — /tmp had been cleaned):
  state WAITING_FOR_REVIEW, submission record present. It is queued
  and not moving. Also assessed Apple's mass guidelines-revision
  email: nothing in it touches Rise (the dormant server path is a
  static off flag with no server; screenshots are real screens).
- The 3-business-day trigger fired: the Contact Apple note is
  finalized with real dates in REVIEW_REPLY.md → "Escalation". Trint
  sends it via developer.apple.com/contact/app-store/, topic App
  Review. Levers behind it: Developer Support phone/chat, expedited
  review request.
- Housekeeping: removed a duplicated Family Controls bullet that an
  earlier edit left in "Next for Trint".

### 2026-10-16 — Hayden (with Claude) — "Website: About reimagined, /give page"
- About page rewritten around the real point: help a man through
  temptation in the body, and point him back to God ("Help in the
  body. Hope in God."). Dropped "the most loving screen in the app"
  framing. New beliefs list (God is the point, your body matters, a fall
  is a turning point, no one fights alone, the Word renews the mind,
  sacred privacy) and 1 Cor 10:13.
- "Our stories": a testimony card for Trint and one for Hayden, both
  showing "story is coming soon" until written. Prompts and photo
  instructions are in an HTML comment in `website/about.html`.
- New `/give` page: why Rise is free (no ads, no data sold, no paywall),
  a one-time/monthly + amount picker, and a disabled "Giving opens soon"
  button. Not connected to anything yet; "not tax-deductible" per
  WEBSITE.md. Other ways to give: pray, tell your church, share.
- "Give" added to the header and footer of every page and to
  `sitemap.xml`; on phones, Support moves to the footer to make room.
- Open: Stripe link (TODO 🅗4) to switch the button on; both founders'
  testimonies and photos.

### 2026-10-14 — Trint (with ZCode) — "Back in the queue"
- Trint resubmitted version 1.0; the ASC API confirms the submission
  record now exists and the state is WAITING_FOR_REVIEW — properly
  queued for the first time since the Oct 3 rejection. All 2.1.0
  answers, the recording, and the Notes carry over.
- Waiting on Apple (IN_REVIEW ~24h, verdict 24–48h after). On
  approval: Trint presses Release (manual). Escalation text stands by
  in REVIEW_REPLY.md if it stalls.

### 2026-10-14 — Trint (with ZCode) — "The 10-day silence explained: never requeued"
- Trint's timeline: he answered Apple's six items with the video
  attached on ~Oct 4 and heard nothing for 10 days. API check settled
  why: version state REJECTED and **no appStoreVersionSubmission
  record** — the replies never put the app back in the queue, so no
  reviewer was ever assigned. The Resolution Center reply does not
  resume a hard-rejected version on its own.
- Fix (Trint's one click): Submit for Review on version 1.0, same
  build 10. Thread, video, and Notes all carry over. Escalation text
  for Contact Apple added to `docs/REVIEW_REPLY.md` in case it stalls
  again.
- Correction logged: earlier today's advice ("replies resume review,
  don't resubmit") was wrong for this reject type — the submission
  record is the ground truth for whether anything is queued.

### 2026-10-14 — Trint (with ZCode) — "Notes field pushed to ASC"
- With Trint's go-ahead in-session, the App Review Information Notes
  were set through the ASC API (PATCH on `appStoreReviewDetails`,
  verified by read-back). Correct relationship name for the future:
  `appStoreReviewDetail` on the version — `appReviewDetail` 404s.
- While pushing: the field held 3,981 characters (likely Trint's
  paste from reply day), now replaced by the drafted 1,750-char
  version. The prior entry's "Notes field is empty" was my bad check,
  not reality. Trint should eyeball the field; his Resolution Center
  replies are untouched.
- Fixed before pushing: the Notes draft said 78 ESV wordings; the
  true count is 88 (77 memory + 11 daily) + 1 NASB = 89.

### 2026-10-14 — Trint (with ZCode) — "Replies sent; watching the state"
- Trint replied in Resolution Center twice (full information, then a
  follow-up). ASC API check after: version state still REJECTED —
  expected until a reviewer resumes; no API view of Resolution Center
  messages, so Apple's answer will land in the UI/email.
- Found open: the App Review Information **Notes field is empty**
  (Apple asked for the info there too). Drafted text waits in
  docs/REVIEW_REPLY.md; can be pushed via the API with a go-ahead.
- Plan: give Apple 2–3 business days; escalate via Contact Apple →
  App Review only if the state hasn't moved.

### 2026-10-14 — Trint (with ZCode) — "2.1.0 response drafted"
- Trint sent screenshots of the rejection: **Guideline 2.1.0 - App
  Completeness - Information Needed**, messaged 2026-10-03 7:21 PM
  (the account's limited review history — routine for a first app, not
  a defect). Apple asks for: a physical-device screen recording, the
  app's purpose and audience, setup instructions, external services,
  regional differences, and protected third-party material.
- `docs/REVIEW_REPLY.md`: the full response, paste-ready — Resolution
  Center reply (with the Scripture answer resting on the publishers'
  published 500-verse quotation policies; actual counts are 11 verses
  of the day + 77 ESV + 1 NASB = 89 total), a fuller Notes-field
  replacement, Trint's steps, and a recording shot list. STORE_LISTING
  now points there for the Notes.
- Open: Trint records and pastes (the one human pass); Notes can be
  pushed via the ASC API with his go-ahead. Replying should resume
  review on build 10 as-is.
- No app code touched.

### 2026-10-14 — Trint (with ZCode) — "App Review verdict: REJECTED"
- Trint reported no visible change in the review; a direct ASC API check
  says otherwise: version 1.0 / build 10 moved from WAITING_FOR_REVIEW
  to **REJECTED** (the app-level appInfo state too; the build itself
  stays VALID, so a resubmit needs no rebuild). When Apple's email or
  the dashboard stopped surfacing it is Apple's mystery; the API is the
  source of truth.
- The rejection reason isn't readable through the API with our key —
  it's in ASC's Resolution Center and Apple's email to the account
  holder. **Open:** Trint reads it, then we fix or reply, then
  resubmit on build 10.
- Docs only; no app code touched. PROGRESS "Current state" and "Next
  for Trint" rewritten around the rejection. Also removed a stray "D"
  that had drifted into the log above the Oct 3 entry.

### 2026-10-04 — Trint (with ZCode) — "Pipeline + agent working agreement"
- `docs/PIPELINE.md`: the runbook for shipping — which rail a change
  takes (OTA vs store build, and the version-bump rule that keeps
  runtime tracks intact), preview-before-production ordering, rollback
  by republish, and the sign-off matrix for what agents may do alone
  (preview publishes) vs what needs a human go-ahead (production,
  store, ASC, money).
- `scripts/gates.sh` (three gates, one command) and `scripts/ota.sh`
  (gates → BUILD stamp → commit → push → `eas update`), so a publish is
  one command with the rules built in. AGENTS.md's publish section now
  points at them, plus a new "How agents work here" agreement: pickup
  order, gates, claims, copy, secrets.
- RELEASE.md store boxes ticked to match reality (build 10, privacy
  answers, age rating, Hayden as ASC App Manager).
- Shakeout: published a preview OTA through the new script (testers
  see the BUILD stamp "preview Oct 4"). Open: production branch gets
  its first publish only after the store review resolves.

### 2026-10-03 — Hayden (with Claude) — "To-do: Christian podcast outreach"
- TODO.md gains "Outreach: Christian podcasts": Bryce Crawford and JP
  Pokluda (Becoming Something) first, steps per show, ground rules, and
  AI tasks for a /press page and tailored pitch drafts. Starts after
  approval and the domain going live.
- riseagainapp.com still waits on the two CNAME records (TODO 🅗2); the
  site itself is up at https://rise-site-4wf.pages.dev.

### 2026-10-03 — Hayden (with Claude) — "Website deployed to Cloudflare Pages"
- Hayden approved Cloudflare and signed in (wrangler OAuth). Created the
  Pages project `rise-site` (classic Pages; the new Workers path wanted a
  workers.dev name that was taken) and deployed `website/`: every page,
  headers, fonts, and stats.json verified at
  https://rise-site-4wf.pages.dev.
- riseagainapp.com and www attached; they go live once the two CNAME
  records exist (TODO 🅗2; the sign-in can read but not write DNS). Email
  routing (MX) untouched.
- A first wrangler attempt auto-wrote a Workers config and edited
  package.json/.gitignore; all reverted before anything was committed.
  New `npm run deploy:site` uploads only `website/`.

### 2026-10-03 — Hayden (with Claude) — "Website: one journey count"
- The three privacy cards are now one: "[number] people have started their
  journey with Rise", from `website/stats.json` (App Store Connect
  downloads, set by hand). Before launch: "Day 1: The first people start
  their journey at launch." Tested with a sample number, reset to null.
- Option to automate it nightly from the App Store Connect API noted in
  WEBSITE.md.


### 2026-10-03 — Trint (with ZCode) — "1.0.0 is in App Review"
- Build 10 (Hayden's day: encrypted backup, accessibility pass, SOS
  breathing fix, midnight label) built, submitted, and attached to the
  1.0.0 version. Pipeline fully unattended now: build + submit, no
  prompts.
- The whole listing went in through the ASC API: description, keywords,
  promo text, subtitle, URLs, copyright, the 22-question age rating
  (everything NONE but mature themes Infrequent/Mild → 13+), and the
  six 6.9" screenshots from `design/app-store/` (the API's 6.7" bucket).
- Content rights declared via API (third-party content, permission
  held: ESV/NASB). Trint finished the UI-only items in ASC: review
  contact with sign-in not required, medical-device No, App Privacy
  "data not collected".
- **Submitted for review 2026-10-03 (~2 AM ET): WAITING_FOR_REVIEW.**
  Release is manual — nothing goes live until Trint presses it.
- Open: Apple's verdict (24–48h typical). On approval, press Release.

### 2026-10-03 — Hayden (with Claude) — "Website review: self-hosted fonts, real download count, 100s"
- Full review (details in WEBSITE.md "Review"): Lighthouse now 98–100 on
  every page, accessibility 100. Fonts self-hosted (Google Fonts leaked
  visitor IPs), right-sized images, contrast, meta tags, structured data,
  cache rules.
- "Scroll" cue removed. First privacy card is now "men rising with Rise"
  from `website/stats.json` (App Store Connect downloads, updated by hand
  monthly; shows "Be among the first" until set). Tested with a sample
  value, then reset to null.

### 2026-10-03 — Hayden (with Claude) — "Website: About page, design review, Opal-style home"
- `/about`: why Rise exists, the five beliefs, Trint and Hayden as
  co-founders (monograms until photos; founder sentences are drafts to
  replace in their own words).
- Review fixes: stretched phone screenshots (real proportions now),
  cropped middle screen, sticky nav with About and Get the app, no seam
  under the header, balanced headings, icons, keyboard focus.
- Home reimagined after opal.so (WEBSITE.md "Design direction"): night
  sky hero, scroll-lit statement, six feature chapters, drifting verses,
  privacy zeros, FAQ with the 988 line, sunrise finale. Whole site is now
  Night Watch. No invented testimonials or numbers.
- Preview: `npm run preview:site` → http://localhost:8081.

### 2026-10-03 — Hayden (with Claude) — "Website phase 1 in website/"
- Hayden's decisions (WEBSITE.md): Cloudflare Pages from `website/`,
  discreet home title, Cloudflare cookieless analytics, founders by name
  with a photo.
- Built `website/`: home, support (backup steps, 988 crisis line),
  privacy (backups, the site's analytics), draft terms (attorney review
  with the LLC), 404, robots, sitemap, security headers, link-preview
  image. Founders section built but hidden until their story and photo.
- Live GitHub Pages copies of support and privacy updated to match.
- Next: Trint approves Cloudflare's GitHub access (TODO 🅣2), Hayden
  connects the Pages project and the domain (🅗2).

### 2026-10-03 — Hayden (with Claude) — "Founders' to-do list, website plan, in-app support links"
- `docs/TODO.md`: the shared checklist with step-by-step instructions,
  split 🤝 together (the LLC), 🅣 Trint (build 10, Cloudflare approval and
  Hayden's GitHub admin, App Store Connect URLs, Family Controls, D-U-N-S
  and the Apple company account, Bible licensing emails, a GitHub org),
  🅗 Hayden (website decisions and domain, social handles, Stripe, the
  social design agent), and 🤖 AI tasks.
- `docs/WEBSITE.md`: direction for riseagainapp.com. The domain and email
  are already on Cloudflare, so the site goes on Cloudflare Pages from a
  `website/` folder; phases from launch pages to an allies guide and the
  web app; five decisions open for Hayden.
- App: "help & support" card on "you & settings" (questions page, email
  with the build pre-filled, privacy policy). All outside links now live
  in `lib/links.ts`, pointing at the GitHub Pages site until the domain
  is live.

### 2026-10-03 — Hayden (with Claude) — "Plan: Support Rise giving page"
- `docs/UPDATES.md` entry 2: a Bible-App-style giving page. Because Rise
  is published by an individual account, not an approved nonprofit, the
  in-app path is an Apple in-app-purchase tip jar (one-time, unlocks
  nothing), plus a giving page on riseagainapp.com. Never asks during SOS,
  Rise Again, the check-in, or after a fall; at most one gentle card after
  a milestone. Needs Trint for App Store Connect agreements and banking.
- Plan only, nothing built.


### 2026-10-03 — Hayden (with Claude) — "Plan: welcome read-through and guided tour"
- New `docs/UPDATES.md` for planned changes, ready to build. First entry:
  a four-page welcome before onboarding (why Rise exists, how it works,
  privacy) and a guided tour after it (dimmed screen, one spotlighted
  button at a time, ten steps across Today, SOS, Patterns, Armory, and
  settings; never creates records; skip and replay; existing users get a
  one-time card).
- Plan only, nothing built. Open: page 2 needs Trint and Hayden's own
  words on why they made Rise.

### 2026-10-03 — Hayden (with Claude) — "1.0 polish: tests, encrypted backup, accessibility, store assets, site"
- **Tests:** Jest via jest-expo, 36 tests in `__tests__/` (days and
  streaks, falls, memory, reminders, backup, phone numbers, hour labels).
  `npm test` is now the third gate in AGENTS.md.
- **Encrypted backup** on "you & settings": AES-256-GCM, key from his
  passphrase via PBKDF2-SHA256 (150k rounds, @noble). Saved through the
  share sheet, restored through the document picker; restoring merges and
  never erases. Adds four native modules, so it needs build 10 (see above).
- **Bug found by the screenshots:** Patterns said "between 10pm and 12pm"
  for the last window; now "12am" (`lib/time.ts`, tested).
- **Accessibility:** every tappable announces as a button, icon-only
  back/close buttons are labeled, disabled state is announced, the dawn
  arc describes itself; text inside fixed shapes caps its scaling.
- **Store listing:** em dashes out of the pasteable copy; age rating
  settled at 13+ (Hayden); six framed 6.9" screenshots in
  `design/app-store/` with the scripts that make them.
- **Marketing page:** `docs/index.html` (light and Night Watch, phone and
  laptop), live on the Pages site now and on riseagainapp.com after DNS.
- Breathing-circle fix from earlier today rides along.

### 2026-10-03 — Hayden (with Claude) — "SOS: the breathing circle no longer covers its label"
- On the SOS help page the circle swells 35% (150 to ~203px), but a scale
  transform doesn't move layout, so at full breath it spilled over
  "breathe with it". It now sits in a stage sized for the full breath
  (`BREATH_STAGE` in `app/(tabs)/sos.tsx`). Measured in headless Chrome:
  widest 202px, never closer than 20px to the label.
- Not yet published: reaches testers with the next preview update, and
  store users with the next build or OTA update on the 1.0.0 track.

### 2026-10-02 — Trint (with ZCode) — "iOS store build 9: built, submitted, VALID in ASC"
- First `eas build -p ios --profile production` run unattended, riding
  the ASC API key at `~/.rise/asc/`: Apple team **6TF9F7YLUY**
  (Individual) confirmed, distribution certificate + provisioning
  profile stored on EAS — future builds need no Apple prompts.
  PUSH_NOTIFICATIONS was enabled on the bundle ID via the ASC API
  directly (an eas-cli capability-sync bug sent Apple an invalid
  request); the build ran with `EXPO_NO_CAPABILITY_SYNC=1`. No APNs key
  was created: the app only uses local notifications.
- Build **9 of 1.0.0** (commit f60aef4) finished on EAS and was
  submitted to the Rise-Again record (ascAppId 6818577524). ASC reports
  the build **VALID** — ready for TestFlight internal testing. The
  failed first attempts burned build numbers 6–8; harmless.
- `eas.json` submit profile now pins `ascAppId` plus the ASC key
  path/id/issuer, so `eas submit --latest` runs unattended. The key path
  is Trint-machine-specific: elsewhere it warns and falls back to
  prompting (graceful).
- Left open (human steps in ASC): TestFlight sanity pass on a real
  phone, listing completion (screenshots, age rating, privacy label,
  pricing), then Submit for Review.

### 2026-10-02 — Trint (with ZCode) — "The store name: Rise-Again"
- "Rise" and "Rise Again" were both taken; the App Store Connect app
  record was created as **Rise-Again**. STORE_LISTING's identity field
  updated, the decision recorded under "Decided", and RELEASE's map
  caught up (enrollment verified, 1.0.0 bump, ASC record done).
- Hayden-as-owner pass: EAS already has him as owner. GitHub's API
  refused the admin grant for Makohroni (422 validation; likely the
  account being new) — flip it in Settings → Collaborators on the web,
  where the real reason will show if it refuses too. Apple can't share
  an individual membership; that path is noted in RELEASE.
- Next: `eas build --profile production --platform ios`, then submit to
  the Rise-Again record for TestFlight. No iOS build exists yet;
  preview-channel testers got "1.0.0 prep" today.

### 2026-10-02 — Trint — "1.0.0: the store build"
- Apple Developer enrollment verified; App Store Connect API key
  secured (never in the repo — lives at `~/.rise/asc/`).
- `app.json` version → 1.0.0 (runtimeVersion appVersion: the store
  build gets its own OTA track; Expo Go ignores runtime policy, so
  the preview channel testers are unaffected). BUILD stamp →
  "first store build (Oct 2)".
- Next: ASC app record, EAS production build, TestFlight.

### 2026-10-02 — Trint — "Privacy policy contact: the company email"
- Contact swapped to support@riseagainapp.com — same intent and line
  as Hayden's Sep-30 change, so the two landed as one. STORE_LISTING
  and RELEASE updated to match; the privacy-policy box is ticked.

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
