/// <reference types="jest" />
import {
  MEMORIZED_BOX,
  SUGGESTED_SETS,
  decodeFolder,
  dueVerses,
  encodeFolder,
  firstLetters,
  isMemorized,
  newProgress,
  nextProgress,
  setVerses,
  suggestedSet,
} from '@/lib/memory';
import type { MemoryData, MemoryFolder } from '@/lib/memory';

const fight = setVerses(suggestedSet('temptation')!);

describe('suggested sets', () => {
  it('starts the fight verses in the order Hayden chose', () => {
    expect(fight.slice(0, 4).map((v) => v.ref)).toEqual([
      '1 Timothy 4:7',
      'Hebrews 2:18',
      'Job 31:1',
      'Psalm 119:11',
    ]);
  });

  it('has all sixty Topical Memory System verses', () => {
    const tms = SUGGESTED_SETS.filter((s) => s.id.startsWith('tms'));
    expect(tms.reduce((n, s) => n + setVerses(s).length, 0)).toBe(60);
  });
});

describe('review schedule', () => {
  it('stretches the gap on each "got it" until the verse is memorized', () => {
    let p = newProgress('2026-10-01');
    const gaps: string[] = [];
    for (let i = 0; i < MEMORIZED_BOX; i++) {
      p = nextProgress(p, true, '2026-10-01', 'now');
      gaps.push(p.dueOn);
    }
    expect(gaps).toEqual(['2026-10-03', '2026-10-05', '2026-10-08', '2026-10-15', '2026-10-31']);
    expect(isMemorized(p)).toBe(true);
  });

  it('steps back one box on "not yet", never to zero, and returns tomorrow', () => {
    const p = nextProgress({ box: 3, dueOn: 'x', reviews: 4, lastReviewedAt: null }, false, '2026-10-01', 'now');
    expect(p.box).toBe(2);
    expect(p.dueOn).toBe('2026-10-02');
  });

  it('reviews a verse once even when two folders hold it', () => {
    const memory: MemoryData = {
      folders: [
        { id: 'a', name: 'A', verses: fight.slice(0, 3), createdAt: '' },
        { id: 'b', name: 'B', verses: fight.slice(1, 5), createdAt: '' },
      ],
      progress: { [fight[0]!.ref]: { box: 2, dueOn: '2026-10-09', reviews: 2, lastReviewedAt: null } },
    };
    expect(dueVerses(memory, '2026-10-01')).toHaveLength(4);
    expect(dueVerses(memory, '2026-10-01', 'a')).toHaveLength(2);
  });

  it('hints with first letters, punctuation kept', () => {
    expect(firstLetters('I have made a covenant with my eyes;')).toBe('I h m a c w m e;');
  });
});

describe('sharing folders', () => {
  const folder: MemoryFolder = {
    id: 'f',
    name: 'Late-night “armor”',
    createdAt: '',
    verses: [...fight.slice(0, 3), { ref: 'Romans 8:1', text: 'There is therefore now no condemnation…', translation: 'custom' }],
  };

  it('round-trips through a link inside a message, accents and curly quotes intact', () => {
    const code = encodeFolder(folder, 'José');
    const decoded = decodeFolder(`Memorize this with me: rise://memory/import?code=${code}`);
    expect(decoded).toEqual({ v: 1, name: folder.name, from: 'José', verses: folder.verses });
  });

  it('rejects anything that is not a folder', () => {
    expect(decodeFolder('hello there')).toBeNull();
    expect(decodeFolder('rise://memory/import?code=bm90LWpzb24')).toBeNull();
  });
});
