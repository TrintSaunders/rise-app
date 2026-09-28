import { Redirect } from 'expo-router';
import type { ReactNode } from 'react';

import { flags } from '@/lib/flags';

/** Verse memory ships dark: until the flag flips, every memory route lands back on the Armory. */
export function MemoryGate({ children }: { children: ReactNode }) {
  if (!flags.armoryMemory) return <Redirect href="/armory" />;
  return <>{children}</>;
}
