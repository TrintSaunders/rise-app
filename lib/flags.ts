// Feature flags — built, reviewed, and shipped dark until the owner says go.

export const flags = {
  /**
   * Armory verse memory: folders, suggested sets, spaced-repetition review,
   * and sharing folders with friends. Off: the Armory tab shows its
   * "arriving in v1.0" card and every memory route bounces back to it.
   * Flip to `true` to preview it.
   */
  armoryMemory: false,
} as const;
