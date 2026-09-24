import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Animated, Easing } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

type BreathingProps = {
  children: ReactNode;
  /** Seconds for one half-breath (in, then out). The SOS screen uses 4. */
  period?: number;
  /** How much it swells at the top of the breath: 0.35 = +35%. */
  depth?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * "Calm physics" — the app's signature motion. Anything wrapped in this
 * breathes: slowly in, slowly out, forever.
 */
export function Breathing({ children, period = 4, depth = 0.1, style }: BreathingProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1 + depth,
          duration: period * 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: period * 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scale, period, depth]);

  return (
    <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
  );
}
