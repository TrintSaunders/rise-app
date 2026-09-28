import * as SMS from 'expo-sms';

import { flags } from './flags';
import type { Ally } from './store';

// SOS → "tell my allies". The alert says he's being tempted, and nothing
// else: no time, place, feelings, or history. Allies don't need the app.

/** What his allies read when he sends it himself (the local path). */
export const LOCAL_MESSAGE =
  'I’m being tempted right now. No need to ask what’s going on — a quick prayer or a text back would mean a lot.';

export type AlertOutcome =
  /** Delivered by the server, or he tapped Send (iOS tells us). */
  | 'sent'
  /** The composer opened; Android can't say whether he sent it. */
  | 'opened'
  | 'cancelled'
  /** No SMS on this device (web, simulator) — show the message to copy instead. */
  | 'unavailable';

const SERVER_URL = process.env.EXPO_PUBLIC_ALLY_ALERT_URL;

/** Digits with an optional leading +. Seven digits is the shortest real number. */
export function cleanPhone(input: string): string | null {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) return null;
  return trimmed.startsWith('+') ? `+${digits}` : digits;
}

/**
 * E.164 for the server path. A bare 10-digit number is read as US/Canada;
 * anyone else should enter the number with its + country code.
 */
function toE164(phone: string): string | null {
  if (phone.startsWith('+')) return phone;
  if (phone.length === 10) return `+1${phone}`;
  if (phone.length === 11 && phone.startsWith('1')) return `+${phone}`;
  return null;
}

async function sendViaServer(allies: readonly Ally[], firstName: string): Promise<boolean> {
  if (!SERVER_URL) return false;
  const to = allies.map((a) => toE164(a.phone));
  if (to.some((n) => n === null)) return false;
  try {
    const res = await fetch(SERVER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: firstName, to }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function sendViaPhone(allies: readonly Ally[]): Promise<AlertOutcome> {
  if (!(await SMS.isAvailableAsync())) return 'unavailable';
  const { result } = await SMS.sendSMSAsync(
    allies.map((a) => a.phone),
    LOCAL_MESSAGE
  );
  if (result === 'sent') return 'sent';
  if (result === 'cancelled') return 'cancelled';
  return 'opened';
}

/** Never a dead end: if the server path fails for any reason, his own Messages app takes over. */
export async function alertAllies(
  allies: readonly Ally[],
  firstName: string
): Promise<AlertOutcome> {
  if (allies.length === 0) return 'unavailable';
  if (flags.allyAlerts === 'server' && (await sendViaServer(allies, firstName))) {
    return 'sent';
  }
  return sendViaPhone(allies);
}
