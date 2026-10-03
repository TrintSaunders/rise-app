/// <reference types="jest" />
import {
  EMPTY_STORE,
  checkInDayStr,
  cleanStreakDays,
  fallsOnCheckInDay,
  honestStreakDays,
  isCheckedInToday,
  shiftDay,
  todayStr,
} from '@/lib/store';
import type { DayRecord, StoreData, TemptationEntry } from '@/lib/store';

const at = (iso: string) => new Date(iso);
const dayRecord = (date: string): DayRecord => ({
  date,
  rating: 3,
  tempted: 'no',
  gratitude: null,
  checkedInAt: `${date}T21:30:00`,
});
const store = (over: Partial<StoreData> = {}): StoreData => ({ ...EMPTY_STORE, ...over });

describe('local calendar days', () => {
  it('formats the local day, never a UTC slice', () => {
    expect(todayStr(at('2026-03-08T23:59:00'))).toBe('2026-03-08');
  });

  it('shifts across month and year ends', () => {
    expect(shiftDay('2026-12-31', 1)).toBe('2027-01-01');
    expect(shiftDay('2026-03-01', -1)).toBe('2026-02-28');
  });
});

describe('check-in day', () => {
  it('counts a check-in before 4am for the day before', () => {
    expect(checkInDayStr(at('2026-10-03T00:30:00'))).toBe('2026-10-02');
    expect(checkInDayStr(at('2026-10-03T03:59:00'))).toBe('2026-10-02');
  });

  it('rolls over at 4am', () => {
    expect(checkInDayStr(at('2026-10-03T04:00:00'))).toBe('2026-10-03');
  });
});

describe('honest streak', () => {
  const data = store({ days: ['2026-09-29', '2026-09-30', '2026-10-01'].map(dayRecord) });

  it('counts consecutive checked-in days ending yesterday while today is pending', () => {
    expect(honestStreakDays(data, '2026-10-02')).toBe(3);
  });

  it('includes today once today is checked in', () => {
    const withToday = store({ days: [...data.days, dayRecord('2026-10-02')] });
    expect(honestStreakDays(withToday, '2026-10-02')).toBe(4);
    expect(isCheckedInToday(withToday, '2026-10-02')).toBe(true);
  });

  it('breaks on a missed day', () => {
    expect(honestStreakDays(data, '2026-10-03')).toBe(0);
  });

  it('survives a past-midnight check-in', () => {
    // 12:30am on the 3rd closes the 2nd, so the streak holds.
    const late = store({ days: [...data.days, dayRecord(checkInDayStr(at('2026-10-03T00:30:00')))] });
    expect(honestStreakDays(late, checkInDayStr(at('2026-10-03T00:31:00')))).toBe(4);
  });
});

describe('clean streak', () => {
  it('counts the day he started as day 1', () => {
    expect(cleanStreakDays(store({ cleanSince: '2026-10-01' }), '2026-10-01')).toBe(1);
    expect(cleanStreakDays(store({ cleanSince: '2026-10-01' }), '2026-10-03')).toBe(3);
  });

  it('reads zero while a fall waits for Rise Again', () => {
    expect(cleanStreakDays(store({ cleanSince: '2026-09-01', needsRise: true }), '2026-10-03')).toBe(0);
  });
});

describe('falls on a check-in day', () => {
  const fall = (id: string, iso: string, demo = false): TemptationEntry => ({
    id,
    at: at(iso).toISOString(),
    feelings: [],
    outcome: 'fell',
    ...(demo ? { demo: true as const } : {}),
  });

  it('keeps every fall as its own entry, oldest first', () => {
    const data = store({
      temptations: [
        fall('b', '2026-10-02T23:10:00'),
        fall('a', '2026-10-02T14:00:00'),
        { ...fall('fled', '2026-10-02T16:00:00'), outcome: 'fled' },
      ],
    });
    expect(fallsOnCheckInDay(data, '2026-10-02').map((f) => f.id)).toEqual(['a', 'b']);
  });

  it('counts a 1am fall toward the day before, and ignores demo entries', () => {
    const data = store({ temptations: [fall('late', '2026-10-03T01:00:00'), fall('demo', '2026-10-02T12:00:00', true)] });
    expect(fallsOnCheckInDay(data, '2026-10-02').map((f) => f.id)).toEqual(['late']);
  });
});
