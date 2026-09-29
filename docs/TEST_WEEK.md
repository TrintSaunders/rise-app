# Test week — Rise on real phones

Goal: run the whole app in Expo Go for a week of real use, without the
dev Mac staying on. Published updates load on the testers' phones
whenever they open the link; their data lives on their own devices.

## Trint — publish (about 5 minutes, once)

1. Create a free account at [expo.dev](https://expo.dev) if you don't
   have one.
2. In the rise-app folder:

   ```bash
   npx eas-cli login      # opens a browser to sign in
   npx eas-cli init       # registers the project (fills in the project id)
   npx eas-cli update --branch preview --message "test week"
   ```

3. The update command prints a link and QR code (also on the project
   page at expo.dev under Updates). Send that to Hayden.
4. Mid-week fixes: commit, re-run the same update command; he just
   closes and reopens the app to get the new version.

No Mac needs to stay on. The update lives on Expo's servers.

## Testers — Hayden (and Trint)

1. Install **Expo Go** from the App Store / Play Store.
2. Open the link on the phone; it opens Rise inside Expo Go.
3. Use it for real for the week: check in each night, log struggles as
   they happen, let SOS breathe when it's hard.

### What to check this week

- Onboarding: name and life verse stick after closing the app.
- Evening check-in: the arc fills gold; counters read day N honest,
  day N clean the next morning. A check-in after midnight still counts
  for the day before (until 4am).
- SOS: the ally text really sends on this phone (it opens Messages;
  you tap Send). Allies are added on the Today screen.
- Log a struggle: feeling chips, "when did it happen", both outcomes;
  a fall routes through Rise Again.
- Night Watch: the app goes dark by itself after 7pm; the moon button
  on Today can force it.
- Armory memory: make a folder, review verses, share one phone to
  phone. **Import by pasting the whole message** into "join a friend" —
  the tap-the-link shortcut behaves differently inside Expo Go.
- The "you & settings" screen: rename yourself, change the life verse,
  read the story so far.
- Reminders: turn on the morning verse and evening check-in in "you &
  settings", set times a few minutes ahead, and lock the phone. Tapping the
  evening one should open the check-in; after checking in, tonight's
  shouldn't come.
- Battle plan: edit it from the Armory (add "Text my allies", "Call an
  ally", your own step, reorder), then open SOS and press the button:
  the steps show in your order, and the ally buttons work.
- Patterns fills in as the week goes on.

### Known limits for this week (expected, not bugs)

- The app icon in Expo Go is Expo Go's, not Rise's own.
- Folder-share links don't deep-open in Expo Go; paste instead.
- Reminders are local notifications. If they never arrive on an Android
  phone inside Expo Go, that's an Expo Go limit, not the app; iPhone is the
  reliable test.
- The Patterns "sample history" button is gone as of release prep (any
  sample entries already on a phone retire themselves on next launch).

## After the week

Collect what broke or felt wrong (screenshots help). Anything broken
goes to GitHub issues or straight to either AI with the repo open.
