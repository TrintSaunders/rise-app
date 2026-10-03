import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { useAppTheme } from '@/lib/theme';
import { colors, fonts } from '@/constants/theme';

// On web the bar has no safe-area inset to grow into, and its default 49px
// squeezes each label to a sliver. Native sizes itself around the home indicator.
const WEB_BAR = Platform.OS === 'web' ? { height: 64, paddingTop: 6, paddingBottom: 8 } : null;

export default function TabLayout() {
  const t = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        // Tab labels live in a fixed-height bar; iOS's large-content viewer
        // (long-press a tab) serves larger text sizes instead.
        tabBarAllowFontScaling: false,
        tabBarActiveTintColor: t.text,
        tabBarInactiveTintColor: t.textSoft,
        tabBarStyle: {
          backgroundColor: t.bg,
          borderTopColor: t.card,
          ...WEB_BAR,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 11,
          lineHeight: 15,
          // The icon slot flexes to fill the bar and squeezes the label;
          // pin the label's height and keep it from shrinking.
          height: 16,
          flexShrink: 0,
        },
      }}>
      <Tabs.Screen
        name="today"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sunny-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: 'SOS',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bonfire-outline" size={size} color={color} />
          ),
          // The SOS screen is always night; its tab bar follows it.
          tabBarActiveTintColor: colors.starlight,
          tabBarInactiveTintColor: colors.starlightSoft,
          tabBarStyle: {
            backgroundColor: colors.night,
            borderTopColor: colors.nightSoft,
            ...WEB_BAR,
          },
        }}
      />
      <Tabs.Screen
        name="patterns"
        options={{
          title: 'Patterns',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="armory"
        options={{
          title: 'Armory',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
