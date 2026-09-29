import { Link, router, Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/constants/theme';

/**
 * The unmatched-route screen. Opening Rise through an Expo Go update link
 * hands the app a loader URL (u.expo.dev/...) that matches no route, so the
 * very first thing a tester saw was "This screen does not exist." The update
 * itself loaded fine — so on the app's first landing here we just go home.
 * A genuinely bad link tapped later in a session still sees this screen.
 */
export default function NotFoundScreen() {
  const firstLanding = useRef(true);

  useEffect(() => {
    if (firstLanding.current) {
      firstLanding.current = false;
      router.replace('/today');
    }
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn’t exist.</Text>
        <Link href="/today" style={styles.link}>
          <Text style={styles.linkText}>Back to Today</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.cream,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.ink,
  },
  link: { marginTop: 15, paddingVertical: 15 },
  linkText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ember,
  },
});
