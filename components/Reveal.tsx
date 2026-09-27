import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Animated, Easing } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

type RevealProps = {
  children: ReactNode;
  /** Stagger in milliseconds — pass i * 70 for a gentle cascade. */
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

/** Screens assemble quietly: each section floats up and in, once, on mount. */
export function Reveal({ children, delay = 0, style }: RevealProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 420,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, delay]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <Animated.View style={[style, { opacity: progress, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
