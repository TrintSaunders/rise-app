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

- [ ] Apple Developer Program, $99/yr (Trint, individual membership).
      This is the only required money for iPhone.
- [ ] `eas build --profile production --platform ios` once enrolled;
      internal distribution → TestFlight for the two of them first.

## Store submission

- [ ] Privacy policy live at the GitHub Pages URL (see
      `docs/privacy.md`; set the contact email before submitting).
- [ ] App Store privacy answers: collects no data. Everything is
      on-device; ally texts go through his own Messages app.
- [ ] Version: bump `app.json` to 1.0.0 at build time (runtimeVersion
      is appVersion — each bump starts a fresh OTA track).
- [ ] Listing: name, subtitle, keywords, description, screenshots
      (an AI with the repo can draft these from the web build).
- [ ] Age rating questionnaire (answer honestly; no gambling, no
      user-generated content).

## Later / optional

- Google Play ($25, and their 12-tester/14-day closed-test rule).
- The built-but-off server path for ally alerts stays off until there's
  a reason and a privacy review.
