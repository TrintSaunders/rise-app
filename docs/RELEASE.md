# Release prep — the road to the App Store

Working checklist toward Rise 1.0 on iPhone. Mark things off here;
PROGRESS.md stays the log, this stays the map.

## Done

- [x] Real icon in every slot (dawn-gold blueprint; `assets/images/`,
      sources in `design/asset-derivatives/`).
- [x] Loading page under the splash (`components/Loading.tsx`).
- [x] Sample-history tool removed; demo entries retire themselves on
      load, so testers' phones clean up on next open.
- [x] Keyboard-safe forms (Today, Armory, SOS).
- [x] Local reminders + battle plan shipped.

## Org — done, and it was never a migration

`rise-again` turned out to already be an organization (created that way
at first login), and the project was born under it (`@rise-again/rise`).
Adding Hayden as a member completed the picture: both owners can
`eas-cli login` with their own accounts and publish updates or run
builds. `app.json`, the project ID, the update URLs, and everyone's
channel links are all unchanged. Publishing steps now live in AGENTS.md.

## The paid step

- [x] Apple Developer Program, $99/yr (Trint, paid 2026-09-29;
      enrollment verified 2026-10-02).
- [x] ASC app record created as **Rise-Again** (2026-10-02) — "Rise"
      and "Rise Again" were both taken.
- [ ] `eas build --profile production --platform ios` (not run yet);
      internal distribution → TestFlight for the two of them first.
- Sharing App Store Connect with Hayden: an individual membership
      can't add users. It would take an Organization enrollment
      (D-U-N-S number, same $99/yr) — decide before the first
      submission, while the record is still cheap to move.

## Store submission

- [x] Privacy policy live at the GitHub Pages URL
      (https://trintsaunders.github.io/rise-app/privacy; contact:
      support@riseagainapp.com).
- [ ] App Store privacy answers: collects no data. Everything is
      on-device; ally texts go through his own Messages app.
- [x] Version 1.0.0 (bumped 2026-10-02; runtimeVersion is appVersion —
      the store build gets its own OTA track).
- [x] Listing drafted in `docs/STORE_LISTING.md` (Trint's copy, plus
      URLs, content rights, and App Review notes). Waiting on Trint's read
      and the two open points at its end (age rating, em dashes).
- [ ] Screenshots: iPhone 6.7"/6.9", from the TestFlight build.
- [x] Support page (`docs/support.md`, with support@riseagainapp.com)
      and a landing page (`docs/index.md`) for the Support and Marketing
      URLs.
- [x] iPhone-only (`supportsTablet: false`, so no iPad screenshots or
      iPad review) and `ITSAppUsesNonExemptEncryption: false` in
      `app.json`.
- [ ] Age rating questionnaire (answer honestly; no gambling, no
      user-generated content).

## Domain and email (bought 2026-09-30, Hayden)

| Address | Purpose | Status |
|---|---|---|
| riseagainapp.com | marketing website | domain owned; site not built |
| app.riseagainapp.com | the web app | domain owned; not deployed |
| support@riseagainapp.com | support | live; on the support page and privacy policy |
| hello@riseagainapp.com | general contact | live |

To move the store URLs onto the domain later: point riseagainapp.com at
GitHub Pages (DNS records at the registrar, then set the custom domain in
the repo's Pages settings), and only then add a `docs/CNAME`. Adding the
CNAME first would send the live privacy page to a domain that doesn't
resolve yet.

## Later / optional

- Google Play ($25, and their 12-tester/14-day closed-test rule).
- The built-but-off server path for ally alerts stays off until there's
  a reason and a privacy review.
