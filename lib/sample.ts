import { shiftDay, todayStr } from './store';
import type { Feeling, RiseEntry, TemptationEntry, VictoryEntry } from './store';

// Demo history for the "fill with sample history" control on Patterns.
// Entries are flagged `demo: true` so they can be cleared without ever
// touching a man's real records.

const FEELING_POOL: Array<[Feeling, number]> = [
  ['in bed', 5],
  ['tired', 4],
  ['lonely', 3],
  ['bored', 2],
  ['stressed', 2],
  ['procrastinating', 1],
];

function pick<T>(rng: () => number, items: Array<[T, number]>): T {
  const total = items.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = rng() * total;
  for (const [item, weight] of items) {
    roll -= weight;
    if (roll <= 0) return item;
  }
  return items[items.length - 1]![0];
}

/** Mostly late night — where the dark hours actually live. */
function sampleHour(rng: () => number): number {
  const roll = rng();
  if (roll < 0.7) return 21 + Math.floor(rng() * 4); // 9pm–1am
  if (roll < 0.9) return 13 + Math.floor(rng() * 4); // 1pm–5pm
  return 7 + Math.floor(rng() * 4); // 7am–11am
}

function sampleFeelings(rng: () => number): Feeling[] {
  const first = pick(rng, FEELING_POOL);
  if (rng() < 0.55) return [first];
  let second = pick(rng, FEELING_POOL);
  if (second === first) second = FEELING_POOL.find(([f]) => f !== first)![0];
  return [first, second];
}

function at(date: string, hour: number, minute: number): string {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1, hour, minute).toISOString();
}

function demoId(prefix: string): string {
  return `demo-${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function sampleHistory(now: Date = new Date()) {
  const temptations: TemptationEntry[] = [];
  const victories: VictoryEntry[] = [];
  const rises: RiseEntry[] = [];
  const rng = Math.random;
  const today = todayStr(now);

  for (let back = 13; back >= 0; back--) {
    const date = shiftDay(today, -back);
    const isToday = back === 0;
    const count = isToday ? 1 : rng() < 0.25 ? 0 : rng() < 0.7 ? 1 : 2;
    let fell = false;

    for (let i = 0; i < count; i++) {
      const hour = sampleHour(rng);
      const outcome = rng() < 0.3 ? 'fell' : 'fled';
      if (outcome === 'fell') fell = true;
      temptations.push({
        id: demoId(`t${back}-${i}`),
        at: at(date, hour, Math.floor(rng() * 60)),
        feelings: sampleFeelings(rng),
        outcome,
        demo: true,
      });
      if (outcome === 'fled' && rng() < 0.6) {
        victories.push({
          id: demoId(`v${back}-${i}`),
          at: at(date, Math.min(hour + 1, 23), Math.floor(rng() * 60)),
          demo: true,
        });
      }
    }

    if (fell) {
      // Rise again — same night if it's late, otherwise a couple of hours on.
      rises.push({
        id: demoId(`r${back}`),
        at: isToday ? now.toISOString() : at(date, 23, 45),
        demo: true,
      });
    }
  }

  return { temptations, victories, rises };
}
