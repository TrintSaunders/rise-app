import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { StatusBar } from 'expo-status-bar';

import { Breathing } from '@/components/Breathing';
import { colors, fonts } from '@/constants/theme';
import { resolveTheme } from '@/lib/theme';

type LoadingProps = {
  /**
   * The wordmark and its line. Off while fonts are still loading, so text
   * never flashes in a fallback face — just the mark, breathing.
   */
  wordmark?: boolean;
};

/**
 * The screen under the splash: what Expo Go and the web show while the day
 * is read off the disk. Cream or night by the clock, the rise itself
 * breathing in dawn gold. Fades in slowly enough that a fast load never
 * flicker-flashes it.
 */
export function Loading({ wordmark = true }: LoadingProps) {
  const t = resolveTheme('auto');
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.sin),
      useNativeDriver: true,
    }).start();
  }, [fade]);

  return (
    <View style={[styles.screen, { backgroundColor: t.bg }]}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
        <Breathing period={4} depth={0.06}>
          <Svg width={72} height={60} viewBox="0 0 100 84">
            <Defs>
              <LinearGradient id="dawn" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.dawn} />
                <Stop offset="1" stopColor={colors.ember} />
              </LinearGradient>
            </Defs>
            <Path
              d="M 14 70 L 50 16 L 86 70"
              fill="none"
              stroke="url(#dawn)"
              strokeWidth={17}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Breathing>

        {wordmark && (
          <View style={styles.textBlock}>
            <Text style={[styles.wordmark, { color: t.text }]}>Rise</Text>
            <Text style={[styles.line, { color: t.textSoft }]}>the day is waking</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  textBlock: { alignItems: 'center', marginTop: 18 },
  wordmark: { fontFamily: fonts.serif, fontSize: 34, lineHeight: 40 },
  line: { fontFamily: fonts.sans, fontSize: 13, letterSpacing: 0.4, marginTop: 6 },
});
