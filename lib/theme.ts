import { useEffect, useState } from 'react';

import { colors } from '@/constants/theme';
import { useStore } from '@/lib/store';
import type { ThemeMode } from '@/lib/store';

// Night Watch (DESIGN.md): deep indigo, warm gold, tiny star points —
// cozy and watchful, never gloomy. Follows the sun; he can hold it.

/** Sunset-to-dawn approximation: 7pm through 5:59am. */
const NIGHT_START_HOUR = 19;
const NIGHT_END_HOUR = 6;

export function isNightHour(now: Date = new Date()): boolean {
  const hour = now.getHours();
  return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
}

export type Theme = {
  /** Screen background. */
  bg: string;
  /** Cards and soft surfaces. */
  card: string;
  /** Primary text. */
  text: string;
  /** Quiet text. */
  textSoft: string;
  /** Recessed tracks inside cards (bars, chips, inner buttons). */
  track: string;
  /** Soft growth surface (sage in daylight; a dim panel at night). */
  softSage: string;
  /** Growth text/icon color that reads on `softSage`. */
  sageText: string;
  /** The dark-hours bars. */
  bars: string;
  isNight: boolean;
};

const DAY: Theme = {
  bg: colors.cream,
  card: colors.mist,
  text: colors.ink,
  textSoft: colors.inkSoft,
  track: colors.cream,
  softSage: colors.sageSoft,
  sageText: colors.sageDeep,
  bars: colors.night,
  isNight: false,
};

const NIGHT: Theme = {
  bg: colors.night,
  card: colors.nightSoft,
  text: colors.starlight,
  textSoft: colors.starlightSoft,
  track: colors.night,
  softSage: colors.nightSoft,
  sageText: colors.sage,
  bars: colors.starlightSoft,
  isNight: true,
};

/**
 * The whole palette a screen needs, resolved from his saved mode and the
 * clock. Re-evaluates every minute so an app left open still crosses dusk.
 */
export function useAppTheme(): Theme {
  const { data } = useStore();
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  return resolveTheme(data.themeMode);
}

export function resolveTheme(mode: ThemeMode, now: Date = new Date()): Theme {
  if (mode === 'night') return NIGHT;
  if (mode === 'day') return DAY;
  return isNightHour(now) ? NIGHT : DAY;
}

/** auto → night → day → auto. The toggle cycles; auto follows the sun. */
export function nextThemeMode(mode: ThemeMode): ThemeMode {
  if (mode === 'auto') return 'night';
  if (mode === 'night') return 'day';
  return 'auto';
}
