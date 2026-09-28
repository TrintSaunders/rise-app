# Server — ally alert (not deployed)

The only server code in Rise, and it's optional. It exists so Trint can
compare two ways for SOS to tell a man's allies "I'm being tempted" and
pick one. The choice is `flags.allyAlerts` in `lib/flags.ts`.

## The two paths

| | Local (`'local'`, current) | Server (`'server'`) |
|---|---|---|
| What he does | Taps "tell them I'm tempted", his Messages app opens with the text ready, he taps Send | Taps once; the text goes out |
| Who it's from | His own number — allies can reply straight to him | A Rise number — replies don't reach him |
| What leaves the phone | Only the text he sends himself | His first name and allies' numbers pass through this function and Twilio (not stored) |
| Privacy rule | Fits as written | Needs the exception below |
| Cost / setup | None | Twilio number + per-text fees; US carriers require A2P 10DLC registration; Supabase project |
| Failure | — | Falls back to the local path automatically |

The alert text is fixed in both paths and says only that he's being
tempted — never when, where, or why.

## Turning the server path on

1. Twilio: buy a number, register it for A2P 10DLC (US), note the account
   SID and auth token.
2. Supabase: create or pick a project, then deploy `server/ally-alert` as
   an Edge Function and set its secrets `TWILIO_ACCOUNT_SID`,
   `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` (the number, E.164).
3. App: set `EXPO_PUBLIC_ALLY_ALERT_URL` to the function URL and
   `flags.allyAlerts` to `'server'`.
4. Amend house rule 6 in AGENTS.md to name this one exception.

## Guard rails in the function

- Fixed message; the app can't send free text through it.
- First names only (24 chars), 1–5 recipients, E.164 numbers, no repeats.
- Three alerts per caller per ten minutes, held in memory only.
- No database and no logging of names or numbers.
- Twilio handles STOP/opt-out replies on the number.

`server/` is excluded from the app's `tsconfig.json` because it's Deno
code, so the app's typecheck doesn't check it.
