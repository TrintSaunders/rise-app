// A believable month for App Store screenshots. Local dates, like the app.
const pad = (n) => String(n).padStart(2, '0');
const day = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const at = (back, h, m = 10) => { const d = new Date(); d.setDate(d.getDate() - back); d.setHours(h, m, 0, 0); return d; };
const id = (s) => `seed-${s}`;
const today = new Date();
const riseBack = 9;

const days = [];
for (let b = 30; b >= 1; b--) {
  if (b === 24) continue; // one missed night, long ago
  const tempted = b === riseBack ? 'fell' : [3, 6, 12, 15, 20].includes(b) ? 'fled' : 'no';
  days.push({ date: day(at(b, 12)), rating: tempted === 'fell' ? 2 : [3, 4, 4, 3, 5][b % 5], tempted, gratitude: b % 3 === 0 ? 'Dinner with the guys' : null, checkedInAt: at(b, 21, 40).toISOString() });
}
days.push({ date: day(today), rating: 4, tempted: 'fled', gratitude: 'A long walk after work', checkedInAt: at(0, 9).toISOString() });

const T = [
  [1, 23, ['tired', 'in bed'], 'fled'], [2, 22, ['lonely'], 'fled'], [3, 23, ['tired', 'in bed'], 'fled'],
  [4, 15, ['bored', 'procrastinating'], 'fled'], [5, 23, ['in bed', 'tired'], 'fled'], [6, 22, ['stressed'], 'fled'],
  [7, 0, ['in bed', 'lonely'], 'fled'], [8, 23, ['tired'], 'fled'], [9, 23, ['tired', 'in bed'], 'fell'],
  [10, 14, ['bored'], 'fled'], [11, 22, ['lonely', 'in bed'], 'fled'], [12, 23, ['stressed', 'tired'], 'fled'],
  [13, 21, ['bored'], 'fled'], [0, 8, ['stressed'], 'fled'],
];
const temptations = T.map(([b, h, feelings, outcome], i) => ({ id: id('t' + i), at: at(b, h, 20).toISOString(), feelings, outcome }));
const victories = [1, 2, 3, 5, 6, 8, 11, 12, 0].map((b, i) => ({ id: id('v' + i), at: at(b, 23, 5).toISOString() }));
const rises = [{ id: id('r1'), at: at(riseBack, 23, 50).toISOString() }, { id: id('r0'), at: at(27, 22, 30).toISOString() }];

const esv = (ref, text) => ({ ref, text, translation: 'ESV' });
const fight = [
  { ref: '1 Timothy 4:7', text: 'Discipline yourself for the purpose of godliness.', translation: 'NASB' },
  esv('Hebrews 2:18', 'For because he himself has suffered when tempted, he is able to help those who are being tempted.'),
  esv('Job 31:1', 'I have made a covenant with my eyes; how then could I gaze at a virgin?'),
  esv('Psalm 119:11', 'I have stored up your word in my heart, that I might not sin against you.'),
  esv('1 Corinthians 10:13', 'No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation he will also provide the way of escape, that you may be able to endure it.'),
  esv('2 Timothy 2:22', 'So flee youthful passions and pursue righteousness, faith, love, and peace, along with those who call on the Lord from a pure heart.'),
];
const progress = {};
[[0, 5], [1, 5], [2, 4], [3, 3], [4, 2], [5, 1]].forEach(([i, box]) => {
  progress[fight[i].ref] = { box, dueOn: day(at(-3, 12)), reviews: box + 2, lastReviewedAt: at(1, 7).toISOString() };
});
progress[fight[4].ref].dueOn = day(today);
progress[fight[5].ref].dueOn = day(today);

export const store = {
  version: 1,
  profile: {
    name: 'Daniel',
    lifeVerse: { text: 'His mercies never come to an end; they are new every morning; great is your faithfulness.', ref: 'Lamentations 3:22–23' },
    startedOn: day(at(30, 9)),
  },
  days, temptations, victories, rises,
  cleanSince: day(at(riseBack, 12)), needsRise: false, lastRisenAt: rises[0].at, themeMode: 'day',
  memory: {
    folders: [
      { id: id('f1'), name: 'Verses for the fight', verses: fight, createdAt: at(26, 8).toISOString() },
      { id: id('f2'), name: 'Late-night verses', verses: [fight[3], fight[1]], createdAt: at(10, 8).toISOString(), sharedBy: 'Marcus' },
    ],
    progress,
  },
  allies: [
    { id: id('a1'), name: 'Marcus', phone: '5551234567' },
    { id: id('a2'), name: 'Sam', phone: '5559876543' },
  ],
  reminders: { morning: { enabled: true, hour: 6, minute: 45 }, evening: { enabled: true, hour: 21, minute: 30 } },
  battlePlan: [
    { id: id('b1'), kind: 'text-allies', label: 'Text my allies' },
    { id: id('b2'), kind: 'custom', label: 'Put the phone in another room' },
    { id: id('b3'), kind: 'memory-verse', label: 'Say my memory verse out loud' },
    { id: id('b4'), kind: 'custom', label: 'A short walk outside' },
    { id: id('b5'), kind: 'call-ally', label: 'Call an ally' },
  ],
};
