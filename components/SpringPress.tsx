import { useRef } from 'react';
import type { ReactNode } from 'react';
import { Animated, Pressable } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

// One node, not a wrapper-in-a-wrapper: the caller's style lands on the same
// element that animates, so flex/alignSelf layout behaves exactly like a
// plain Pressable. (An unstyled wrapper Pressable would swallow stretch/flex
// sizing — the bug that shrank every full-width button.)
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SpringPressProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  hitSlop?: number;
  accessibilityLabel?: string;
  /** Static styles only — the pressed state is the spring, not a style function. */
  style?: StyleProp<ViewStyle>;
};

/**
 * "Calm physics" for every tappable thing: it eases down ~3% under the
 * finger and springs back on release. Replaces dim-on-press everywhere.
 */
export function SpringPress({
  children,
  onPress,
  disabled,
  hitSlop,
  accessibilityLabel,
  style,
}: SpringPressProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      speed: 50,
      bounciness: 3,
      useNativeDriver: true,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      speed: 24,
      bounciness: 7,
      useNativeDriver: true,
    }).start();

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[style, { transform: [{ scale }] }]}>
      {children}
    </AnimatedPressable>
  );
}
