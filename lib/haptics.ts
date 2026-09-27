import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * One soft tap for completions — a check-in finished, a victory saved,
 * a rise completed. Never on falls, never on failure (DESIGN.md).
 * No-op on web, where there is no taptic engine.
 */
export function hapticTap(): void {
  if (Platform.OS === 'web') return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
    // A missed vibration is not worth interrupting anyone's morning over.
  });
}
