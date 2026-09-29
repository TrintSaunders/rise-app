import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

import { initNotifications, remindersSupported, syncReminders } from '@/lib/reminders';
import { useStore } from '@/lib/store';

/**
 * Keeps the phone's scheduled reminders in step with his settings and his
 * check-ins, and opens the right screen when he taps one. Renders nothing.
 * Mounted only on phones: web has no local notifications.
 */
export function ReminderSync() {
  if (!remindersSupported) return null;
  return <PhoneReminders />;
}

function PhoneReminders() {
  const { ready, data } = useStore();
  const response = Notifications.useLastNotificationResponse();

  // Re-plan on launch, when settings change, and after each check-in.
  const plan = JSON.stringify(data.reminders);
  const checkedIn = data.days.map((d) => d.date).join(',');
  useEffect(() => {
    if (!ready || !data.profile) return;
    initNotifications();
    syncReminders(data.reminders, new Set(checkedIn.split(',').filter(Boolean))).catch(() => {
      // A missed reschedule isn't worth an error screen; the next launch retries.
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, !!data.profile, plan, checkedIn]);

  useEffect(() => {
    if (!response || response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
    const url = response.notification.request.content.data?.url;
    if (url === '/checkin' || url === '/today') {
      router.push(url);
      Notifications.clearLastNotificationResponse();
    }
  }, [response]);

  return null;
}
