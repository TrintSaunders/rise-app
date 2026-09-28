// Feature flags — built, reviewed, and shipped dark until the owner says go.

export const flags = {
  /**
   * Armory verse memory: folders, suggested sets, spaced-repetition review,
   * and sharing folders with friends. Off: the Armory tab shows its
   * "arriving in v1.0" card and every memory route bounces back to it.
   * On since 2026-09-28 (verse texts and naming checked).
   */
  armoryMemory: true,

  /**
   * How SOS tells his allies "I'm being tempted" — nothing more, never why.
   *  - 'local':  opens a ready-to-send group text in his own Messages app;
   *              he taps Send. Nothing leaves the phone that he doesn't send.
   *  - 'server': one tap sends it for him through `server/ally-alert`
   *              (needs EXPO_PUBLIC_ALLY_ALERT_URL); falls back to 'local'
   *              if the server can't be reached.
   * Waiting on Trint's call — see docs/PROGRESS.md.
   */
  allyAlerts: 'local' as 'local' | 'server',
} as const;
