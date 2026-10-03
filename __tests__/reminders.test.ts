/// <reference types="jest" />
import * as Notifications from 'expo-notifications';

import { formatTime, shiftTime, syncReminders } from '@/lib/reminders';
import { todayStr } from '@/lib/store';
import type { Reminders } from '@/lib/store';

type Scheduled = { identifier: string; content: { data: { tag: string; url: string } }; trigger: { date: Date } };
let mockScheduled: Scheduled[] = [];

jest.mock('expo-notifications', () => ({
  SchedulableTriggerInputTypes: { DATE: 'date' },
  AndroidImportance: { DEFAULT: 3 },
  getAllScheduledNotificationsAsync: jest.fn(async () => mockScheduled),
  cancelScheduledNotificationAsync: jest.fn(async (id: string) => {
    mockScheduled = mockScheduled.filter((n) => n.identifier !== id);
  }),
  getPermissionsAsync: jest.fn(async () => ({ granted: true })),
  setNotificationChannelAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  scheduleNotificationAsync: jest.fn(async (req: Omit<Scheduled, 'identifier'>) => {
    const identifier = String(Math.random());
    mockScheduled.push({ ...req, identifier });
    return identifier;
  }),
}));

const on: Reminders = {
  morning: { enabled: true, hour: 7, minute: 0 },
  evening: { enabled: true, hour: 21, minute: 30 },
};

describe('reminder times', () => {
  it('formats a 12-hour clock', () => {
    expect(formatTime({ hour: 21, minute: 30 })).toBe('9:30 PM');
    expect(formatTime({ hour: 0, minute: 5 })).toBe('12:05 AM');
  });

  it('steps in 15 minutes and wraps around midnight', () => {
    expect(shiftTime({ hour: 23, minute: 50 }, 15)).toEqual({ hour: 0, minute: 5 });
    expect(shiftTime({ hour: 0, minute: 0 }, -15)).toEqual({ hour: 23, minute: 45 });
  });
});

describe('scheduling', () => {
  beforeEach(() => {
    mockScheduled = [];
    jest.useFakeTimers({ now: new Date('2026-10-03T10:00:00') });
  });
  afterEach(() => jest.useRealTimers());

  const evenings = () => mockScheduled.filter((n) => n.content.data.url === '/checkin');
  const mornings = () => mockScheduled.filter((n) => n.content.data.url === '/today');

  it('plans two weeks ahead and skips a morning that already passed', async () => {
    await syncReminders(on, new Set());
    expect(mornings()).toHaveLength(13);
    expect(evenings()).toHaveLength(14);
  });

  it('leaves out tonight once he has checked in', async () => {
    await syncReminders(on, new Set(['2026-10-03']));
    expect(evenings()).toHaveLength(13);
    expect(evenings().some((n) => todayStr(new Date(n.trigger.date)) === '2026-10-03')).toBe(false);
  });

  it('replaces rather than duplicates, and clears everything when both are off', async () => {
    await syncReminders(on, new Set());
    await syncReminders(on, new Set());
    expect(mockScheduled).toHaveLength(27);
    await syncReminders(
      { morning: { ...on.morning, enabled: false }, evening: { ...on.evening, enabled: false } },
      new Set()
    );
    expect(mockScheduled).toHaveLength(0);
  });

  it('schedules nothing without notification permission', async () => {
    (Notifications.getPermissionsAsync as jest.Mock).mockResolvedValueOnce({ granted: false });
    await syncReminders(on, new Set());
    expect(mockScheduled).toHaveLength(0);
  });
});
