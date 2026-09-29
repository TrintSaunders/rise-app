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

## Next — org (both of us, genuinely)

Trint does these in the Expo dashboard (they live behind his login):

1. Create an organization on expo.dev (suggest slug: `rise-again-team`
   or just `rise-ministries` — whatever reads right; free tier is fine).
2. Invite Hayden's Expo account email as a member (owner role).

Then an AI assistant with the repo open runs the migration:

3. `app.json`: `owner` → the org, `extra.eas.projectId` + `updates.url`
   → the new project under the org (`eas init` inside the org creates
   it and fills the id).
4. Republish the `preview` channel, re-share the channel link (old
   links die with the old project — that's expected, say so to testers).
5. Update AGENTS.md/TEST_WEEK.md links; Hayden can then `eas update`
   and later `eas build` without borrowing Trint's login.

## Then — the paid step

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
