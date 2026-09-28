import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { ReactNode } from 'react';

import type { Verse } from './verses';
import { sampleHistory } from './sample';

// ─── The record ──────────────────────────────────────────────────────────────
// Everything lives on this device alone (sacred privacy, DESIGN.md).
// History is append-only: counters may reset, records are never erased.

export const FEELINGS = [
  'lonely',
  'bored',
  'tired',
  'in bed',
  'stressed',
  'procrastinating',
] as const;
export type Feeling = (typeof FEELINGS)[number];

export type TemptedAnswer = 'no' | 'fled' | 'fell';
export type TemptationOutcome = 'fled' | 'fell';

export type Profile = {
  name: string;
  /** His life verse, if he gave one; otherwise the verse of the day carries him. */
  lifeVerse: Verse | null;
  /** The day he started walking with the app. */
  startedOn: string;
};

export type DayRecord = {
  /** The check-in day, 'YYYY-MM-DD' — local, and a late check-in before 4am closes yesterday. */
  date: string;
  /** 1–5 — his honest read on the day, whatever it was. */
  rating: number;
  tempted: TemptedAnswer;
  gratitude: string | null;
  checkedInAt: string;
};

export type TemptationEntry = {
  id: string;
  at: string;
  feelings: Feeling[];
  outcome: TemptationOutcome;
  /** Present only on entries from the Patterns "sample history" demo tool. */
  demo?: true;
};

export type VictoryEntry = {
  id: string;
  at: string;
  demo?: true;
};

/** Every completed Rise Again — kept forever, like the falls it answers. */
export type RiseEntry = {
  id: string;
  at: string;
  demo?: true;
};

export type ThemeMode = 'auto' | 'night' | 'day';

export type StoreData = {
  version: 1;
  profile: Profile | null;
  days: DayRecord[];
  temptations: TemptationEntry[];
  victories: VictoryEntry[];
  rises: RiseEntry[];
  /** The day the current clean streak began (onboarding day, or the day he last rose again). */
  cleanSince: string;
  /** A fall is on the books and the sun hasn't come back up yet. */
  needsRise: boolean;
  lastRisenAt: string | null;
  /** Night Watch: follow the sun automatically, or hold a mode he chose. */
  themeMode: ThemeMode;
};

// ─── Local-day helpers ───────────────────────────────────────────────────────
// A "day" is the man's local calendar day, never a UTC slice.

export function todayStr(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDay(day: string): Date {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function shiftDay(day: string, delta: number): string {
  const d = parseDay(day);
  d.setDate(d.getDate() + delta);
  return todayStr(d);
}

export function daysBetween(from: string, to: string): number {
  return Math.round((parseDay(to).getTime() - parseDay(from).getTime()) / 86_400_000);
}

/** Evening check-ins often run past midnight; until 4am they still close yesterday. */
const CHECK_IN_DAY_ROLLOVER_HOUR = 4;

/** The day an evening check-in made right now belongs to. */
export function checkInDayStr(now: Date = new Date()): string {
  const day = todayStr(now);
  return now.getHours() < CHECK_IN_DAY_ROLLOVER_HOUR ? shiftDay(day, -1) : day;
}

// ─── Selectors ───────────────────────────────────────────────────────────────

export function isCheckedInToday(data: StoreData, today: string = checkInDayStr()): boolean {
  return data.days.some((d) => d.date === today);
}

/**
 * A day counts as honest when he checked in — whatever the answers were.
 * Today still pending doesn't break the streak; a missed day does.
 */
export function honestStreakDays(data: StoreData, today: string = checkInDayStr()): number {
  const checked = new Set(data.days.map((d) => d.date));
  let cursor = checked.has(today) ? today : shiftDay(today, -1);
  let streak = 0;
  while (checked.has(cursor)) {
    streak += 1;
    cursor = shiftDay(cursor, -1);
  }
  return streak;
}

/** Resets only through Rise Again — the records behind it stay forever. */
export function cleanStreakDays(data: StoreData, today: string = todayStr()): number {
  if (data.needsRise) return 0;
  return Math.max(1, daysBetween(data.cleanSince, today) + 1);
}

export function waitingToRise(data: StoreData): boolean {
  return data.needsRise;
}

// ─── The store ───────────────────────────────────────────────────────────────

const KEY = 'rise.store.v1';

const EMPTY: StoreData = {
  version: 1,
  profile: null,
  days: [],
  temptations: [],
  victories: [],
  rises: [],
  cleanSince: todayStr(),
  needsRise: false,
  lastRisenAt: null,
  themeMode: 'auto',
};

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

type StoreApi = {
  ready: boolean;
  data: StoreData;
  completeOnboarding: (name: string, lifeVerse: Verse | null) => void;
  saveCheckIn: (answers: {
    rating: number;
    tempted: TemptedAnswer;
    gratitude: string | null;
  }) => void;
  logTemptation: (
    feelings: readonly Feeling[],
    outcome: TemptationOutcome,
    /** When it actually happened — defaults to right now. */
    at?: string
  ) => void;
  logVictory: () => void;
  completeRise: () => void;
  /** Demo tool on Patterns: two weeks of flagged entries, real history untouched. */
  seedSampleData: () => void;
  clearSampleData: () => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(EMPTY);
  const [ready, setReady] = useState(false);
  // Off only when storage itself failed to read: his history may still be on
  // disk, and writing now would bury it under an empty store.
  const [canPersist, setCanPersist] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      let raw: string | null = null;
      try {
        raw = await AsyncStorage.getItem(KEY);
      } catch {
        // Storage wouldn't answer — run this session in memory, touch nothing.
        if (alive) {
          setCanPersist(false);
          setReady(true);
        }
        return;
      }
      if (raw) {
        try {
          const saved = JSON.parse(raw) as Partial<StoreData> | null;
          // Merge over defaults so an older save survives new fields.
          if (alive) setData({ ...EMPTY, ...saved });
        } catch {
          // Unreadable store — set the damaged copy aside, never erase it,
          // then start fresh rather than crash his morning.
          try {
            await AsyncStorage.setItem(`${KEY}.unreadable.${Date.now()}`, raw);
          } catch {
            if (alive) setCanPersist(false);
          }
        }
      }
      if (alive) setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready || !canPersist) return;
    AsyncStorage.setItem(KEY, JSON.stringify(data)).catch(() => {
      // A missed write hurts, but the next change writes again.
    });
  }, [data, ready, canPersist]);

  const api = useMemo<StoreApi>(() => {
    const update = (change: (prev: StoreData) => StoreData) => {
      setData((prev) => change(prev));
    };

    return {
      ready,
      data,
      completeOnboarding: (name, lifeVerse) =>
        update((prev) => ({
          ...prev,
          profile: { name, lifeVerse, startedOn: todayStr() },
          cleanSince: todayStr(),
        })),
      saveCheckIn: ({ rating, tempted, gratitude }) =>
        update((prev) => {
          const date = checkInDayStr();
          const record: DayRecord = {
            date,
            rating,
            tempted,
            gratitude: gratitude && gratitude.trim() ? gratitude.trim() : null,
            checkedInAt: new Date().toISOString(),
          };
          return {
            ...prev,
            days: [...prev.days.filter((d) => d.date !== date), record].sort((a, b) =>
              a.date.localeCompare(b.date)
            ),
            needsRise: prev.needsRise || tempted === 'fell',
          };
        }),
      logTemptation: (feelings, outcome, at = new Date().toISOString()) =>
        update((prev) => ({
          ...prev,
          temptations: [
            ...prev.temptations,
            { id: newId(), at, feelings: [...feelings], outcome },
          ],
          needsRise: prev.needsRise || outcome === 'fell',
        })),
      logVictory: () =>
        update((prev) => ({
          ...prev,
          victories: [...prev.victories, { id: newId(), at: new Date().toISOString() }],
        })),
      completeRise: () =>
        update((prev) => ({
          ...prev,
          cleanSince: todayStr(),
          needsRise: false,
          lastRisenAt: new Date().toISOString(),
          rises: [...prev.rises, { id: newId(), at: new Date().toISOString() }],
        })),
      seedSampleData: () =>
        update((prev) => {
          if (prev.temptations.some((t) => t.demo)) return prev; // already filled
          const sample = sampleHistory();
          return {
            ...prev,
            temptations: [...prev.temptations, ...sample.temptations],
            victories: [...prev.victories, ...sample.victories],
            rises: [...prev.rises, ...sample.rises],
          };
        }),
      clearSampleData: () =>
        update((prev) => ({
          ...prev,
          temptations: prev.temptations.filter((t) => !t.demo),
          victories: prev.victories.filter((v) => !v.demo),
          rises: prev.rises.filter((r) => !r.demo),
        })),
      setThemeMode: (mode) => update((prev) => ({ ...prev, themeMode: mode })),
    };
  }, [ready, data]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore needs StoreProvider (see app/_layout.tsx)');
  return store;
}
