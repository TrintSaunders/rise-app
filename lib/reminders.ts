import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { checkInDayStr } from './store';
import type { Reminder, Reminders } from './store';

// Local reminders only: scheduled on this phone, never through a server.
// Lock-screen words stay discreet: nothing a glance over his shoulder
// could read as what the app is for.

export const remindersSupported = Platform.OS !== 'web';

const TAG = 'rise-reminder';
const CHANNEL = 'reminders';
/** Scheduled a week ahead as one-off dates, so tonight's can be skipped once he's checked in. */
const DAYS_AHEAD = 7;

const CONTENT = {
  morning: {
    title: 'Good morning',
    body: 'Today’s verse is waiting for you.',
    url: '/today',
  },
  evening: {
    title: 'Before you sleep',
    body: 'Thirty seconds of truth: your evening check-in.',
    url: '/checkin',
  },
} as const;

let handlerSet = false;

/** Show reminders even while the app is open, quietly. */
export function initNotifications() {
  if (!remindersSupported || handlerSet) return;
  handlerSet = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

/** Asks once; afterwards reports what he chose (Settings on the phone can change it). */
export async function ensurePermission(): Promise<boolean> {
  if (!remindersSupported) return false;
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export function formatTime({ hour, minute }: Pick<Reminder, 'hour' | 'minute'>): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
}

/** 15-minute steps, wrapping around midnight. */
export function shiftTime(r: Pick<Reminder, 'hour' | 'minute'>, minutes: number) {
  const total = (((r.hour * 60 + r.minute + minutes) % 1440) + 1440) % 1440;
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

/**
 * Replaces every Rise reminder with the next week's, from his settings.
 * An evening reminder is left out when that day's check-in is already done.
 */
export async function syncReminders(reminders: Reminders, checkedInDays: ReadonlySet<string>) {
  if (!remindersSupported) return;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => n.content.data?.tag === TAG)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );

  if (!reminders.morning.enabled && !reminders.evening.enabled) return;
  const permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const now = new Date();
  const jobs: Promise<string>[] = [];
  for (let day = 0; day < DAYS_AHEAD; day++) {
    for (const which of ['morning', 'evening'] as const) {
      const r = reminders[which];
      if (!r.enabled) continue;
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + day, r.hour, r.minute);
      if (at <= now) continue;
      if (which === 'evening' && checkedInDays.has(checkInDayStr(at))) continue;
      const { title, body, url } = CONTENT[which];
      jobs.push(
        Notifications.scheduleNotificationAsync({
          content: { title, body, data: { tag: TAG, url } },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: at,
            channelId: CHANNEL,
          },
        })
      );
    }
  }
  await Promise.all(jobs);
}
