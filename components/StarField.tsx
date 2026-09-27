import { StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

// Fixed positions — the same sky every night, calm, no shimmer.
// top/left are percentages of the screen, typed as numbers and turned into
// `${number}%` strings so they satisfy ViewStyle's DimensionValue.
const STARS: Array<{ top: number; left: number; size: number; bright: boolean }> = [
  { top: 4, left: 12, size: 1.5, bright: false },
  { top: 9, left: 78, size: 2, bright: true },
  { top: 13, left: 33, size: 1.5, bright: false },
  { top: 18, left: 58, size: 1.5, bright: false },
  { top: 24, left: 8, size: 2, bright: true },
  { top: 29, left: 88, size: 1.5, bright: false },
  { top: 33, left: 45, size: 1.5, bright: false },
  { top: 38, left: 22, size: 1.5, bright: false },
  { top: 44, left: 68, size: 2, bright: true },
  { top: 49, left: 6, size: 1.5, bright: false },
  { top: 54, left: 92, size: 1.5, bright: false },
  { top: 58, left: 38, size: 1.5, bright: false },
  { top: 63, left: 74, size: 1.5, bright: false },
  { top: 68, left: 16, size: 2, bright: true },
  { top: 73, left: 52, size: 1.5, bright: false },
  { top: 78, left: 84, size: 1.5, bright: false },
  { top: 82, left: 28, size: 1.5, bright: false },
  { top: 88, left: 62, size: 1.5, bright: false },
];

/**
 * Night Watch's "tiny star points" — a quiet scatter of stars behind the
 * content. Render only when the theme is night; never intercepts touches.
 */
export function StarField() {
  return (
    <View style={styles.sky} pointerEvents="none">
      {STARS.map((star, i) => (
        <View
          key={i}
          style={[
            styles.star,
            {
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: star.size,
              height: star.size,
              backgroundColor: star.bright ? colors.starlight : colors.starlightSoft,
              opacity: star.bright ? 0.75 : 0.45,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  star: {
    position: 'absolute',
    borderRadius: 1,
  },
});
