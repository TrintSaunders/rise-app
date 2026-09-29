// The battle plan: his own way out, in his order, shown on SOS.
// Most steps are just words he'll read in the moment. A few are live:
// they text his allies, call one, or put a memory verse in front of him.

export type BattleStepKind = 'custom' | 'text-allies' | 'call-ally' | 'memory-verse';

export type BattleStep = {
  id: string;
  kind: BattleStepKind;
  label: string;
};

export type SuggestedStep = { kind: BattleStepKind; label: string; icon: StepIcon };

export type StepIcon =
  | 'exit-outline'
  | 'water-outline'
  | 'walk-outline'
  | 'chatbubbles-outline'
  | 'call-outline'
  | 'book-outline'
  | 'barbell-outline'
  | 'people-outline'
  | 'phone-portrait-outline'
  | 'hand-left-outline'
  | 'checkmark-circle-outline';

/** Offered in the editor; he can reorder, drop, or write his own. */
export const SUGGESTED_STEPS: SuggestedStep[] = [
  { kind: 'text-allies', label: 'Text my allies', icon: 'chatbubbles-outline' },
  { kind: 'call-ally', label: 'Call an ally', icon: 'call-outline' },
  { kind: 'memory-verse', label: 'Say my memory verse out loud', icon: 'book-outline' },
  { kind: 'custom', label: 'Leave the room', icon: 'exit-outline' },
  { kind: 'custom', label: 'Put the phone in another room', icon: 'phone-portrait-outline' },
  { kind: 'custom', label: 'Cold water on my face', icon: 'water-outline' },
  { kind: 'custom', label: 'A short walk outside', icon: 'walk-outline' },
  { kind: 'custom', label: 'Twenty push-ups', icon: 'barbell-outline' },
  { kind: 'custom', label: 'Go where people are', icon: 'people-outline' },
  { kind: 'custom', label: 'Pray out loud', icon: 'hand-left-outline' },
];

/** What a new man starts with — the three the SOS screen has always shown. */
export const DEFAULT_PLAN: BattleStep[] = [
  { id: 'default-leave', kind: 'custom', label: 'Leave the room' },
  { id: 'default-water', kind: 'custom', label: 'Cold water on my face' },
  { id: 'default-walk', kind: 'custom', label: 'A short walk. The phone stays here' },
];

export const MAX_STEPS = 8;

export function iconFor(step: Pick<BattleStep, 'kind' | 'label'>): StepIcon {
  const match = SUGGESTED_STEPS.find((s) => s.kind === step.kind && s.label === step.label);
  if (match) return match.icon;
  if (step.kind === 'text-allies') return 'chatbubbles-outline';
  if (step.kind === 'call-ally') return 'call-outline';
  if (step.kind === 'memory-verse') return 'book-outline';
  if (/leave/i.test(step.label)) return 'exit-outline';
  if (/water/i.test(step.label)) return 'water-outline';
  if (/walk/i.test(step.label)) return 'walk-outline';
  return 'checkmark-circle-outline';
}

/** Live steps only make sense once in a plan. */
export function isSingleton(kind: BattleStepKind): boolean {
  return kind !== 'custom';
}
