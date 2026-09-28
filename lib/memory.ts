// Armory verse memory — the verse library, the review rhythm, and sharing.
// Phil 4:8 filling, not just fencing: Scripture hidden in the heart
// (Ps 119:11) is what's there when the phone isn't.
//
// Wordings follow the ESV unless `translation` says otherwise. Texts were
// checked 2026-09-28; the ESV and NASB notices sit at the foot of the Armory.

import { shiftDay } from './store';

export type MemoryVerse = {
  /** Also the verse's identity: progress is kept per reference, across folders. */
  ref: string;
  text: string;
  translation: string;
};

export type MemoryFolder = {
  id: string;
  name: string;
  verses: MemoryVerse[];
  createdAt: string;
  /** Who shared it, when it arrived from a friend. */
  sharedBy?: string;
};

/** Leitner-style: each "got it" moves a verse to a longer gap; "not yet" steps back one. */
export type VerseProgress = {
  box: number;
  dueOn: string;
  reviews: number;
  lastReviewedAt: string | null;
};

export type MemoryData = {
  folders: MemoryFolder[];
  progress: Record<string, VerseProgress>;
};

// ─── Suggested sets ──────────────────────────────────────────────────────────

export type SuggestedSet = {
  id: string;
  title: string;
  subtitle: string;
  /** Grouped for display; a folder made from the set takes every verse, in order. */
  sections: { heading: string | null; verses: MemoryVerse[] }[];
};

const esv = (ref: string, text: string): MemoryVerse => ({ ref, text, translation: 'ESV' });

/** The verses for the fight itself — start here. */
const TEMPTATION: SuggestedSet = {
  id: 'temptation',
  title: 'Verses for the fight',
  subtitle: 'key temptation verses, in the order to learn them',
  sections: [
    {
      heading: null,
      verses: [
        {
          ref: '1 Timothy 4:7',
          text: 'Discipline yourself for the purpose of godliness.',
          translation: 'NASB',
        },
        esv('Hebrews 2:18', 'For because he himself has suffered when tempted, he is able to help those who are being tempted.'),
        esv('Job 31:1', 'I have made a covenant with my eyes; how then could I gaze at a virgin?'),
        esv('Psalm 119:11', 'I have stored up your word in my heart, that I might not sin against you.'),
        esv('1 Corinthians 10:13', 'No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability, but with the temptation he will also provide the way of escape, that you may be able to endure it.'),
        esv('2 Timothy 2:22', 'So flee youthful passions and pursue righteousness, faith, love, and peace, along with those who call on the Lord from a pure heart.'),
        esv('Psalm 119:9', 'How can a young man keep his way pure? By guarding it according to your word.'),
        esv('Romans 13:14', 'But put on the Lord Jesus Christ, and make no provision for the flesh, to gratify its desires.'),
        esv('Galatians 5:16', 'But I say, walk by the Spirit, and you will not gratify the desires of the flesh.'),
        esv('1 Corinthians 6:18', 'Flee from sexual immorality. Every other sin a person commits is outside the body, but the sexually immoral person sins against his own body.'),
        esv('1 Thessalonians 4:3–4', 'For this is the will of God, your sanctification: that you abstain from sexual immorality; that each one of you know how to control his own body in holiness and honor.'),
        esv('Psalm 101:3', 'I will not set before my eyes anything that is worthless.'),
        esv('Proverbs 4:23', 'Keep your heart with all vigilance, for from it flow the springs of life.'),
        esv('Matthew 5:8', 'Blessed are the pure in heart, for they shall see God.'),
        esv('James 1:14–15', 'But each person is tempted when he is lured and enticed by his own desire. Then desire when it has conceived gives birth to sin, and sin when it is fully grown brings forth death.'),
        esv('Titus 2:11–12', 'For the grace of God has appeared, bringing salvation for all people, training us to renounce ungodliness and worldly passions, and to live self-controlled, upright, and godly lives in the present age.'),
        esv('Philippians 4:8', 'Finally, brothers, whatever is true, whatever is honorable, whatever is just, whatever is pure, whatever is lovely, whatever is commendable, if there is any excellence, if there is anything worthy of praise, think about these things.'),
        esv('1 John 1:9', 'If we confess our sins, he is faithful and just to forgive us our sins and to cleanse us from all unrighteousness.'),
      ],
    },
  ],
};

// The Navigators' Topical Memory System: five series of twelve topics, two
// verses each. Use of the name was checked 2026-09-28.
const tms = (
  id: string,
  title: string,
  topics: [heading: string, first: MemoryVerse, second: MemoryVerse][]
): SuggestedSet => ({
  id,
  title,
  subtitle: 'Topical Memory System',
  sections: topics.map(([heading, first, second]) => ({ heading, verses: [first, second] })),
});

const TMS_A = tms('tms-a', 'A · Live the new life', [
  ['Christ the center',
    esv('2 Corinthians 5:17', 'Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.'),
    esv('Galatians 2:20', 'I have been crucified with Christ. It is no longer I who live, but Christ who lives in me. And the life I now live in the flesh I live by faith in the Son of God, who loved me and gave himself for me.')],
  ['Obedience to Christ',
    esv('Romans 12:1', 'I appeal to you therefore, brothers, by the mercies of God, to present your bodies as a living sacrifice, holy and acceptable to God, which is your spiritual worship.'),
    esv('John 14:21', 'Whoever has my commandments and keeps them, he it is who loves me. And he who loves me will be loved by my Father, and I will love him and manifest myself to him.')],
  ['The Word',
    esv('2 Timothy 3:16', 'All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness.'),
    esv('Joshua 1:8', 'This Book of the Law shall not depart from your mouth, but you shall meditate on it day and night, so that you may be careful to do according to all that is written in it. For then you will make your way prosperous, and then you will have good success.')],
  ['Prayer',
    esv('John 15:7', 'If you abide in me, and my words abide in you, ask whatever you wish, and it will be done for you.'),
    esv('Philippians 4:6–7', 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.')],
  ['Fellowship',
    esv('Matthew 18:20', 'For where two or three are gathered in my name, there am I among them.'),
    esv('Hebrews 10:24–25', 'And let us consider how to stir up one another to love and good works, not neglecting to meet together, as is the habit of some, but encouraging one another, and all the more as you see the Day drawing near.')],
  ['Witnessing',
    esv('Matthew 4:19', 'Follow me, and I will make you fishers of men.'),
    esv('Romans 1:16', 'For I am not ashamed of the gospel, for it is the power of God for salvation to everyone who believes, to the Jew first and also to the Greek.')],
]);

const TMS_B = tms('tms-b', 'B · Proclaim Christ', [
  ['All have sinned',
    esv('Romans 3:23', 'For all have sinned and fall short of the glory of God.'),
    esv('Isaiah 53:6', 'All we like sheep have gone astray; we have turned—every one—to his own way; and the LORD has laid on him the iniquity of us all.')],
  ['Sin’s penalty',
    esv('Romans 6:23', 'For the wages of sin is death, but the free gift of God is eternal life in Christ Jesus our Lord.'),
    esv('Hebrews 9:27', 'And just as it is appointed for man to die once, and after that comes judgment.')],
  ['Christ paid the penalty',
    esv('Romans 5:8', 'But God shows his love for us in that while we were still sinners, Christ died for us.'),
    esv('1 Peter 3:18', 'For Christ also suffered once for sins, the righteous for the unrighteous, that he might bring us to God, being put to death in the flesh but made alive in the spirit.')],
  ['Salvation not by works',
    esv('Ephesians 2:8–9', 'For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.'),
    esv('Titus 3:5', 'He saved us, not because of works done by us in righteousness, but according to his own mercy, by the washing of regeneration and renewal of the Holy Spirit.')],
  ['Must receive Christ',
    esv('John 1:12', 'But to all who did receive him, who believed in his name, he gave the right to become children of God.'),
    esv('Revelation 3:20', 'Behold, I stand at the door and knock. If anyone hears my voice and opens the door, I will come in to him and eat with him, and he with me.')],
  ['Assurance of salvation',
    esv('1 John 5:13', 'I write these things to you who believe in the name of the Son of God that you may know that you have eternal life.'),
    esv('John 5:24', 'Truly, truly, I say to you, whoever hears my word and believes him who sent me has eternal life. He does not come into judgment, but has passed from death to life.')],
]);

const TMS_C = tms('tms-c', 'C · Rely on God’s resources', [
  ['His Spirit',
    esv('1 Corinthians 3:16', 'Do you not know that you are God’s temple and that God’s Spirit dwells in you?'),
    esv('1 Corinthians 2:12', 'Now we have received not the spirit of the world, but the Spirit who is from God, that we might understand the things freely given us by God.')],
  ['His strength',
    esv('Isaiah 41:10', 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.'),
    esv('Philippians 4:13', 'I can do all things through him who strengthens me.')],
  ['His faithfulness',
    esv('Lamentations 3:22–23', 'The steadfast love of the LORD never ceases; his mercies never come to an end; they are new every morning; great is your faithfulness.'),
    esv('Numbers 23:19', 'God is not man, that he should lie, or a son of man, that he should change his mind. Has he said, and will he not do it? Or has he spoken, and will he not fulfill it?')],
  ['His peace',
    esv('Isaiah 26:3', 'You keep him in perfect peace whose mind is stayed on you, because he trusts in you.'),
    esv('1 Peter 5:7', 'Casting all your anxieties on him, because he cares for you.')],
  ['His provision',
    esv('Romans 8:32', 'He who did not spare his own Son but gave him up for us all, how will he not also with him graciously give us all things?'),
    esv('Philippians 4:19', 'And my God will supply every need of yours according to his riches in glory in Christ Jesus.')],
  ['His help in temptation',
    esv('Hebrews 2:18', 'For because he himself has suffered when tempted, he is able to help those who are being tempted.'),
    esv('Psalm 119:9, 11', 'How can a young man keep his way pure? By guarding it according to your word. I have stored up your word in my heart, that I might not sin against you.')],
]);

const TMS_D = tms('tms-d', 'D · Be Christ’s disciple', [
  ['Put Christ first',
    esv('Matthew 6:33', 'But seek first the kingdom of God and his righteousness, and all these things will be added to you.'),
    esv('Luke 9:23', 'If anyone would come after me, let him deny himself and take up his cross daily and follow me.')],
  ['Separate from the world',
    esv('1 John 2:15–16', 'Do not love the world or the things in the world. If anyone loves the world, the love of the Father is not in him. For all that is in the world—the desires of the flesh and the desires of the eyes and pride of life—is not from the Father but is from the world.'),
    esv('Romans 12:2', 'Do not be conformed to this world, but be transformed by the renewal of your mind, that by testing you may discern what is the will of God, what is good and acceptable and perfect.')],
  ['Be steadfast',
    esv('1 Corinthians 15:58', 'Therefore, my beloved brothers, be steadfast, immovable, always abounding in the work of the Lord, knowing that in the Lord your labor is not in vain.'),
    esv('Hebrews 12:3', 'Consider him who endured from sinners such hostility against himself, so that you may not grow weary or fainthearted.')],
  ['Serve others',
    esv('Mark 10:45', 'For even the Son of Man came not to be served but to serve, and to give his life as a ransom for many.'),
    esv('2 Corinthians 4:5', 'For what we proclaim is not ourselves, but Jesus Christ as Lord, with ourselves as your servants for Jesus’ sake.')],
  ['Give generously',
    esv('Proverbs 3:9–10', 'Honor the LORD with your wealth and with the firstfruits of all your produce; then your barns will be filled with plenty, and your vats will be bursting with wine.'),
    esv('2 Corinthians 9:6–7', 'The point is this: whoever sows sparingly will also reap sparingly, and whoever sows bountifully will also reap bountifully. Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful giver.')],
  ['Develop world vision',
    esv('Acts 1:8', 'But you will receive power when the Holy Spirit has come upon you, and you will be my witnesses in Jerusalem and in all Judea and Samaria, and to the end of the earth.'),
    esv('Matthew 28:19–20', 'Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age.')],
]);

const TMS_E = tms('tms-e', 'E · Grow in Christlikeness', [
  ['Love',
    esv('John 13:34–35', 'A new commandment I give to you, that you love one another: just as I have loved you, you also are to love one another. By this all people will know that you are my disciples, if you have love for one another.'),
    esv('1 John 3:18', 'Little children, let us not love in word or talk but in deed and in truth.')],
  ['Humility',
    esv('Philippians 2:3–4', 'Do nothing from selfish ambition or conceit, but in humility count others more significant than yourselves. Let each of you look not only to his own interests, but also to the interests of others.'),
    esv('1 Peter 5:5–6', 'Clothe yourselves, all of you, with humility toward one another, for “God opposes the proud but gives grace to the humble.” Humble yourselves, therefore, under the mighty hand of God so that at the proper time he may exalt you.')],
  ['Purity',
    esv('Ephesians 5:3', 'But sexual immorality and all impurity or covetousness must not even be named among you, as is proper among saints.'),
    esv('1 Peter 2:11', 'Beloved, I urge you as sojourners and exiles to abstain from the passions of the flesh, which wage war against your soul.')],
  ['Honesty',
    esv('Leviticus 19:11', 'You shall not steal; you shall not deal falsely; you shall not lie to one another.'),
    esv('Acts 24:16', 'So I always take pains to have a clear conscience toward both God and man.')],
  ['Faith',
    esv('Hebrews 11:6', 'And without faith it is impossible to please him, for whoever would draw near to God must believe that he exists and that he rewards those who seek him.'),
    esv('Romans 4:20–21', 'No unbelief made him waver concerning the promise of God, but he grew strong in his faith as he gave glory to God, fully convinced that God was able to do what he had promised.')],
  ['Good works',
    esv('Galatians 6:9–10', 'And let us not grow weary of doing good, for in due season we will reap, if we do not give up. So then, as we have opportunity, let us do good to everyone, and especially to those who are of the household of faith.'),
    esv('Matthew 5:16', 'In the same way, let your light shine before others, so that they may see your good works and give glory to your Father who is in heaven.')],
]);

/** Shown in the Armory in this order — the fight first, then the long road. */
export const SUGGESTED_SETS: SuggestedSet[] = [TEMPTATION, TMS_A, TMS_B, TMS_C, TMS_D, TMS_E];

export function suggestedSet(id: string): SuggestedSet | undefined {
  return SUGGESTED_SETS.find((set) => set.id === id);
}

export function setVerses(set: SuggestedSet): MemoryVerse[] {
  return set.sections.flatMap((section) => section.verses);
}

// ─── Review rhythm ───────────────────────────────────────────────────────────

/** Days until the next review, by box. Box 6 means it's held — a monthly touch keeps it. */
const BOX_GAPS = [1, 2, 4, 7, 14, 30, 30];
export const MEMORIZED_BOX = 5;

export function newProgress(today: string): VerseProgress {
  return { box: 0, dueOn: today, reviews: 0, lastReviewedAt: null };
}

/** "Not yet" is never a reset to zero — one step back, and it comes round tomorrow. */
export function nextProgress(
  prev: VerseProgress,
  remembered: boolean,
  today: string,
  now: string
): VerseProgress {
  const box = remembered ? Math.min(prev.box + 1, BOX_GAPS.length - 1) : Math.max(prev.box - 1, 0);
  const gap = remembered ? BOX_GAPS[box]! : 1;
  return { box, dueOn: shiftDay(today, gap), reviews: prev.reviews + 1, lastReviewedAt: now };
}

export function isDue(progress: VerseProgress | undefined, today: string): boolean {
  return !progress || progress.dueOn <= today;
}

export function isMemorized(progress: VerseProgress | undefined): boolean {
  return (progress?.box ?? 0) >= MEMORIZED_BOX;
}

/** A verse in several folders is still one verse to review. */
export function dueVerses(memory: MemoryData, today: string, folderId?: string): MemoryVerse[] {
  const folders = folderId
    ? memory.folders.filter((f) => f.id === folderId)
    : memory.folders;
  const seen = new Set<string>();
  const due: MemoryVerse[] = [];
  for (const folder of folders) {
    for (const verse of folder.verses) {
      if (seen.has(verse.ref)) continue;
      seen.add(verse.ref);
      if (isDue(memory.progress[verse.ref], today)) due.push(verse);
    }
  }
  return due;
}

/** First letter of every word, punctuation kept — the classic memorizer's crutch. */
export function firstLetters(text: string): string {
  return text.replace(/([A-Za-z])[A-Za-z’']*/g, '$1');
}

// ─── Sharing with friends ────────────────────────────────────────────────────
// No server, no account: a folder travels as a code inside a message he sends
// himself, and his friend adds a copy. Each keeps his own progress on his own
// phone (sacred privacy); memorizing together means the same verses, the same
// week, and telling each other how it's going.

export type SharedFolder = {
  v: 1;
  name: string;
  from: string | null;
  verses: MemoryVerse[];
};

/** On the wire a verse from the suggested sets travels as its reference alone. */
type WireFolder = Omit<SharedFolder, 'verses'> & { verses: (string | MemoryVerse)[] };

const LIBRARY = new Map(
  SUGGESTED_SETS.flatMap((set) => setVerses(set)).map((verse) => [verse.ref, verse])
);

const isLibraryVerse = (verse: MemoryVerse) => {
  const known = LIBRARY.get(verse.ref);
  return !!known && known.text === verse.text && known.translation === verse.translation;
};

// UTF-8 bytes → base64url, without leaning on TextEncoder or unescape.
const toBase64Url = (s: string) =>
  btoa(
    encodeURIComponent(s).replace(/%([0-9A-F]{2})/g, (_, hex: string) =>
      String.fromCharCode(parseInt(hex, 16))
    )
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const fromBase64Url = (s: string) =>
  decodeURIComponent(
    Array.from(
      atob(s.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`
    ).join('')
  );

export function encodeFolder(folder: MemoryFolder, from: string | null): string {
  const payload: WireFolder = {
    v: 1,
    name: folder.name,
    from,
    verses: folder.verses.map((verse) => (isLibraryVerse(verse) ? verse.ref : verse)),
  };
  return toBase64Url(JSON.stringify(payload));
}

const isVerse = (v: unknown): v is MemoryVerse =>
  !!v &&
  typeof v === 'object' &&
  typeof (v as MemoryVerse).ref === 'string' &&
  typeof (v as MemoryVerse).text === 'string' &&
  typeof (v as MemoryVerse).translation === 'string';

/** Accepts a bare code or any message/link that contains one. Null if it isn't a folder. */
export function decodeFolder(input: string): SharedFolder | null {
  const trimmed = input.trim();
  const fromLink = trimmed.match(/[?&]code=([A-Za-z0-9_-]+)/);
  const candidates = fromLink ? [fromLink[1]!] : (trimmed.match(/[A-Za-z0-9_-]{24,}/g) ?? []);
  for (const code of candidates) {
    try {
      const parsed = JSON.parse(fromBase64Url(code)) as Partial<WireFolder>;
      if (parsed.v !== 1 || typeof parsed.name !== 'string' || !Array.isArray(parsed.verses)) {
        continue;
      }
      const verses = parsed.verses.map((v) => (typeof v === 'string' ? LIBRARY.get(v) : v));
      // All or nothing: a folder with a verse we can't read isn't the folder they sent.
      if (!verses.every(isVerse)) continue;
      return {
        v: 1,
        name: parsed.name.slice(0, 60),
        from: typeof parsed.from === 'string' ? parsed.from.slice(0, 40) : null,
        verses: verses.slice(0, 200),
      };
    } catch {
      // Not this one — try the next candidate.
    }
  }
  return null;
}

/** The message he sends: a warm line, the verse list, and the link that opens Rise. */
export function shareMessage(folder: MemoryFolder, from: string | null, link: string): string {
  const refs = folder.verses.map((v) => v.ref).join(', ');
  const who = from ? `${from} wants` : 'I want';
  return (
    `${who} to memorize “${folder.name}” with you in Rise. ${folder.verses.length} ` +
    `verse${folder.verses.length === 1 ? '' : 's'}: ${refs}.\n\n` +
    `Open this on your phone to add it:\n${link}`
  );
}

/** A progress note to text a friend — facts, never a scoreboard. */
export function progressMessage(folder: MemoryFolder, memory: MemoryData): string {
  const held = folder.verses.filter((v) => isMemorized(memory.progress[v.ref])).length;
  const started = folder.verses.filter((v) => (memory.progress[v.ref]?.reviews ?? 0) > 0).length;
  return (
    `“${folder.name}”: ${held} of ${folder.verses.length} memorized, ` +
    `${started} started. How are you doing with yours?`
  );
}
