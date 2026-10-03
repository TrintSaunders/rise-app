/// <reference types="jest" />
/// <reference types="node" />
import { randomBytes } from 'crypto';

import { BackupError, decryptBackup, encryptBackup, mergeBackup } from '@/lib/backup';
import { cleanPhone, formatPhone } from '@/lib/allyAlert';
import { EMPTY_STORE } from '@/lib/store';
import type { StoreData } from '@/lib/store';

jest.mock('expo-crypto', () => ({
  getRandomBytes: (n: number) => new Uint8Array(require('crypto').randomBytes(n)),
}));

const random = (n: number) => new Uint8Array(randomBytes(n));
const store = (over: Partial<StoreData> = {}): StoreData => ({ ...EMPTY_STORE, ...over });
const dayRecord = (date: string, tempted: 'no' | 'fled' | 'fell' = 'no') => ({
  date,
  rating: 3,
  tempted,
  gratitude: null,
  checkedInAt: `${date}T21:30:00`,
});

const story = store({
  profile: { name: 'Daniel', lifeVerse: null, startedOn: '2026-09-01' },
  days: [dayRecord('2026-09-29'), dayRecord('2026-09-30', 'fell')],
  temptations: [{ id: 't1', at: '2026-09-30T23:00:00.000Z', feelings: ['tired'], outcome: 'fell' }],
  rises: [{ id: 'r1', at: '2026-09-30T23:30:00.000Z' }],
  cleanSince: '2026-09-30',
  allies: [{ id: 'a1', name: 'Marcus', phone: '5551234567' }],
});

describe('encrypted backup', () => {
  jest.setTimeout(30_000);

  it('round-trips his whole story with the right passphrase', async () => {
    const file = await encryptBackup(story, 'mercies new every morning', random);
    expect(file).not.toContain('Daniel');
    expect(file).not.toContain('Marcus');
    await expect(decryptBackup(file, 'mercies new every morning')).resolves.toEqual(story);
  });

  it('refuses a wrong passphrase', async () => {
    const file = await encryptBackup(story, 'correct horse battery', random);
    await expect(decryptBackup(file, 'wrong horse battery')).rejects.toMatchObject({
      reason: 'wrong-passphrase',
    });
  });

  it('refuses a file that is not a backup', async () => {
    await expect(decryptBackup('{"hello":1}', 'anything')).rejects.toBeInstanceOf(BackupError);
    await expect(decryptBackup('not json', 'anything')).rejects.toMatchObject({ reason: 'not-a-backup' });
  });
});

describe('restoring never erases', () => {
  it('brings the story back whole onto a fresh phone', () => {
    const fresh = store({ profile: { name: 'Daniel', lifeVerse: null, startedOn: '2026-10-03' } });
    const merged = mergeBackup(fresh, story);
    expect(merged.days).toHaveLength(2);
    expect(merged.cleanSince).toBe('2026-09-30');
    expect(merged.allies).toHaveLength(1);
    expect(merged.profile?.startedOn).toBe('2026-10-03');
  });

  it('adds history to a phone in use and keeps what is already there', () => {
    const inUse = store({
      profile: { name: 'Dan', lifeVerse: null, startedOn: '2026-09-15' },
      days: [dayRecord('2026-09-30', 'no'), dayRecord('2026-10-01')],
      temptations: [{ id: 't2', at: '2026-10-01T22:00:00.000Z', feelings: [], outcome: 'fled' }],
      cleanSince: '2026-09-15',
      allies: [{ id: 'a9', name: 'Marc', phone: '5551234567' }],
    });
    const merged = mergeBackup(inUse, story);
    expect(merged.profile?.name).toBe('Dan');
    expect(merged.days.map((d) => [d.date, d.tempted])).toEqual([
      ['2026-09-29', 'no'],
      ['2026-09-30', 'no'], // this phone's check-in wins the shared day
      ['2026-10-01', 'no'],
    ]);
    expect(merged.temptations.map((t) => t.id)).toEqual(['t1', 't2']);
    expect(merged.cleanSince).toBe('2026-09-15');
    expect(merged.allies).toHaveLength(1); // same phone number, not duplicated
  });

  it('keeps the better memory progress for each verse', () => {
    const p = (box: number) => ({ box, dueOn: '2026-10-10', reviews: box, lastReviewedAt: null });
    const merged = mergeBackup(
      store({ memory: { folders: [], progress: { 'Job 31:1': p(2), 'Psalm 119:11': p(5) } } }),
      store({ memory: { folders: [], progress: { 'Job 31:1': p(4), 'Psalm 119:11': p(1) } } })
    );
    expect(merged.memory.progress['Job 31:1']!.box).toBe(4);
    expect(merged.memory.progress['Psalm 119:11']!.box).toBe(5);
  });
});

describe('phone numbers', () => {
  it('cleans what he types and rejects what cannot be a number', () => {
    expect(cleanPhone('(555) 123-4567')).toBe('5551234567');
    expect(cleanPhone('+44 20 7946 0958')).toBe('+442079460958');
    expect(cleanPhone('12345')).toBeNull();
  });

  it('shows US numbers the familiar way', () => {
    expect(formatPhone('5551234567')).toBe('(555) 123-4567');
    expect(formatPhone('15551234567')).toBe('(555) 123-4567');
    expect(formatPhone('+442079460958')).toBe('+442079460958');
  });
});
