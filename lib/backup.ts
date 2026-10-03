import { gcm } from '@noble/ciphers/aes.js';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { getRandomBytes } from 'expo-crypto';

import { EMPTY_STORE } from './store';
import type { StoreData } from './store';

// Encrypted backup: his whole story in one file only his passphrase opens.
// Nothing goes to a server. He saves the file where he likes (Files, iCloud
// Drive, AirDrop to himself) and restores it on a new phone.
//
// AES-256-GCM, key from PBKDF2-SHA256. Audited pure-JS primitives
// (@noble), so it runs the same in Expo Go, a store build, and the browser.

export const BACKUP_FORMAT = 'rise-backup';
const ITERATIONS = 150_000;
export const MIN_PASSPHRASE = 8;

type BackupFile = {
  format: typeof BACKUP_FORMAT;
  v: 1;
  createdAt: string;
  kdf: { name: 'PBKDF2-SHA256'; iterations: number; salt: string };
  cipher: { name: 'AES-256-GCM'; nonce: string };
  data: string;
};

export class BackupError extends Error {
  constructor(
    public reason: 'not-a-backup' | 'wrong-passphrase' | 'damaged',
    message: string
  ) {
    super(message);
  }
}

// UTF-8 without TextEncoder/TextDecoder, which not every JS engine Rise
// runs on provides. Percent-encoding is UTF-8 by definition.
function utf8(s: string): Uint8Array {
  const escaped = encodeURIComponent(s);
  const out: number[] = [];
  for (let i = 0; i < escaped.length; i++) {
    if (escaped[i] === '%') {
      out.push(parseInt(escaped.slice(i + 1, i + 3), 16));
      i += 2;
    } else {
      out.push(escaped.charCodeAt(i));
    }
  }
  return Uint8Array.from(out);
}

function fromUtf8(bytes: Uint8Array): string {
  let escaped = '';
  for (const b of bytes) escaped += `%${b.toString(16).padStart(2, '0')}`;
  return decodeURIComponent(escaped);
}

function toBase64(bytes: Uint8Array): string {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

function fromBase64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

const deriveKey = (passphrase: string, salt: Uint8Array, iterations: number) =>
  pbkdf2Async(sha256, utf8(passphrase.normalize('NFKC')), salt, { c: iterations, dkLen: 32 });

/** The file's contents: JSON on the outside, ciphertext inside. */
export async function encryptBackup(
  data: StoreData,
  passphrase: string,
  random: (n: number) => Uint8Array = getRandomBytes
): Promise<string> {
  const salt = random(16);
  const nonce = random(12);
  const key = await deriveKey(passphrase, salt, ITERATIONS);
  const sealed = gcm(key, nonce).encrypt(utf8(JSON.stringify(data)));
  const file: BackupFile = {
    format: BACKUP_FORMAT,
    v: 1,
    createdAt: new Date().toISOString(),
    kdf: { name: 'PBKDF2-SHA256', iterations: ITERATIONS, salt: toBase64(salt) },
    cipher: { name: 'AES-256-GCM', nonce: toBase64(nonce) },
    data: toBase64(sealed),
  };
  return JSON.stringify(file);
}

export async function decryptBackup(contents: string, passphrase: string): Promise<StoreData> {
  let file: BackupFile;
  try {
    file = JSON.parse(contents);
  } catch {
    throw new BackupError('not-a-backup', 'That file isn’t a Rise backup.');
  }
  if (file?.format !== BACKUP_FORMAT || file.v !== 1 || !file.kdf || !file.cipher) {
    throw new BackupError('not-a-backup', 'That file isn’t a Rise backup.');
  }
  const key = await deriveKey(passphrase, fromBase64(file.kdf.salt), file.kdf.iterations);
  let plain: Uint8Array;
  try {
    plain = gcm(key, fromBase64(file.cipher.nonce)).decrypt(fromBase64(file.data));
  } catch {
    // GCM can't tell a wrong passphrase from tampering; the wrong passphrase is the likely one.
    throw new BackupError('wrong-passphrase', 'That passphrase doesn’t open this backup.');
  }
  try {
    const parsed = JSON.parse(fromUtf8(plain)) as Partial<StoreData>;
    if (parsed.version !== 1) throw new Error('version');
    return { ...EMPTY_STORE, ...parsed };
  } catch {
    throw new BackupError('damaged', 'This backup opened but its contents are damaged.');
  }
}

const isFresh = (d: StoreData) =>
  d.days.length + d.temptations.length + d.victories.length + d.rises.length === 0;

function unionById<T extends { id: string }>(a: readonly T[], b: readonly T[]): T[] {
  const seen = new Set(a.map((x) => x.id));
  return [...a, ...b.filter((x) => !seen.has(x.id))];
}

const byAt = <T extends { at: string }>(xs: T[]) => [...xs].sort((x, y) => x.at.localeCompare(y.at));

/**
 * Restoring never erases. Onto a fresh phone the backup comes back whole;
 * onto a phone already in use, its history is added and what's here stays
 * (this phone's check-in wins when both have one for the same day).
 */
export function mergeBackup(current: StoreData, incoming: StoreData): StoreData {
  const fresh = isFresh(current);
  const days = [...current.days];
  const dates = new Set(days.map((d) => d.date));
  for (const d of incoming.days) if (!dates.has(d.date)) days.push(d);
  days.sort((a, b) => a.date.localeCompare(b.date));

  const progress = { ...incoming.memory.progress };
  for (const [ref, p] of Object.entries(current.memory.progress)) {
    const other = progress[ref];
    if (!other || p.box >= other.box) progress[ref] = p;
  }

  const phones = new Set(current.allies.map((a) => a.phone));
  const counters = fresh ? incoming : current;

  return {
    ...current,
    profile: current.profile ?? incoming.profile,
    days,
    temptations: byAt(unionById(current.temptations, incoming.temptations)),
    victories: byAt(unionById(current.victories, incoming.victories)),
    rises: byAt(unionById(current.rises, incoming.rises)),
    cleanSince: counters.cleanSince,
    needsRise: counters.needsRise,
    lastRisenAt: counters.lastRisenAt,
    memory: {
      folders: unionById(current.memory.folders, incoming.memory.folders),
      progress,
    },
    allies: [...current.allies, ...incoming.allies.filter((a) => !phones.has(a.phone))].slice(0, 5),
    reminders: fresh ? incoming.reminders : current.reminders,
    battlePlan: fresh ? incoming.battlePlan : current.battlePlan,
  };
}

export function backupFileName(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `rise-backup-${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}.json`;
}
