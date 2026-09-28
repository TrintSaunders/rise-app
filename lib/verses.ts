// The verse of the day. Wordings are lightly trimmed to fit a card —
// swap for your preferred translation any time.

export type Verse = { text: string; ref: string };

export const verses: Verse[] = [
  { text: 'His mercies are new every morning; great is your faithfulness.', ref: 'Lamentations 3:22–23' },
  { text: 'Though the righteous fall seven times, they rise again.', ref: 'Proverbs 24:16' },
  { text: 'No temptation has overtaken you except what is common to mankind. God is faithful; he will provide a way out.', ref: '1 Corinthians 10:13' },
  { text: 'Flee youthful passions; pursue righteousness, faith, love, and peace.', ref: '2 Timothy 2:22' },
  { text: 'Whatever is true, whatever is noble, whatever is right… think about such things.', ref: 'Philippians 4:8' },
  { text: 'If we confess our sins, he is faithful and just to forgive us our sins.', ref: '1 John 1:9' },
  { text: 'I made a covenant with my eyes.', ref: 'Job 31:1' },
  { text: 'Create in me a clean heart, O God, and renew a right spirit within me.', ref: 'Psalm 51:10' },
  { text: 'Walk by the Spirit, and you will not gratify the desires of the flesh.', ref: 'Galatians 5:16' },
  { text: 'The light shines in the darkness, and the darkness has not overcome it.', ref: 'John 1:5' },
];

export function verseForToday(date = new Date()): Verse {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return verses[dayOfYear % verses.length];
}
