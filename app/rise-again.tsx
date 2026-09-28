import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Breathing } from '@/components/Breathing';
import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius, shadow } from '@/constants/theme';
import { hapticTap } from '@/lib/haptics';
import { useStore } from '@/lib/store';

const VERSE = {
  text: 'If we confess our sins, he is faithful and just to forgive us our sins.',
  ref: '1 John 1:9',
};

const RISE_VERSE = {
  text: 'Though the righteous fall seven times, they rise again.',
  ref: 'Proverbs 24:16',
};

const CONFESSION = [
  'God, I fell. I’m not hiding it and I’m not dressing it up.',
  'You said if we confess, you are faithful and just to forgive. I’m taking you at your word.',
  'Cleanse me, teach me to walk in the light, and put me back on my feet. Amen.',
];

/**
 * Rise Again — the most important screen in the app (DESIGN.md). Make getting
 * back up easier and faster than falling: the sun clears the horizon, the
 * screen brightens, the truth gets spoken, and the clean counter starts over
 * without erasing a single page of his history.
 */
export default function RiseAgainScreen() {
  const { completeRise } = useStore();
  const [confessed, setConfessed] = useState(false);
  const [risen, setRisen] = useState(false);
  const [bright, setBright] = useState(false);

  // The sunrise: sun clears the horizon, night fades to cream, then content.
  const rise = useRef(new Animated.Value(0)).current;
  const sky = useRef(new Animated.Value(0)).current;
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rise, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sky, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(1300),
        Animated.timing(reveal, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // The status bar should go dark only once the sky has actually brightened.
    const onSky = ({ value }: { value: number }) => {
      if (value > 0.95) setBright(true);
    };
    const listenerId = sky.addListener(onSky);
    return () => sky.removeListener(listenerId);
  }, [rise, sky, reveal]);

  const skyOpacity = sky.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const sunLift = rise.interpolate({ inputRange: [0, 1], outputRange: [130, 0] });
  const glow = rise.interpolate({ inputRange: [0, 1], outputRange: [0, 0.3] });

  const finish = () => {
    completeRise();
    hapticTap();
    setRisen(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={risen || bright ? 'dark' : 'light'} />
      {/* night fading into morning */}
      <Animated.View style={[styles.night, { opacity: skyOpacity }]} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.stage}>
          <View style={styles.horizon} />
          <Animated.View
            style={[
              styles.orbRow,
              styles.glowRow,
              { opacity: glow, transform: [{ translateY: sunLift }] },
            ]}>
            <View style={styles.sunGlow} />
          </Animated.View>
          <Animated.View style={[styles.orbRow, styles.sunRow, { transform: [{ translateY: sunLift }] }]}>
            <Breathing period={6} depth={0.04}>
              <View style={styles.sun} />
            </Breathing>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.body,
            { opacity: reveal, transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] },
          ]}>
          {risen ? (
            <>
              <Text style={styles.headline}>Risen.</Text>
              <Text style={styles.subline}>Day one starts now.</Text>
              <View style={styles.card}>
                <Text style={styles.verseText}>“{RISE_VERSE.text}”</Text>
                <Text style={styles.verseRef}>{RISE_VERSE.ref}</Text>
              </View>
              <Text style={styles.risenNote}>
                Nothing was erased. Every fall and every rise stays in your story.
                That’s the whole point.
              </Text>
              <SpringPress style={styles.homeButton} onPress={() => router.dismissAll()}>
                <Text style={styles.homeButtonText}>back to today</Text>
              </SpringPress>
            </>
          ) : (
            <>
              <Text style={styles.headline}>The sun rose again.</Text>
              <Text style={styles.subline}>So will you.</Text>

              <View style={styles.card}>
                <Text style={styles.verseText}>“{VERSE.text}”</Text>
                <Text style={styles.verseRef}>{VERSE.ref}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.cardLabel}>a short confession, out loud or in your heart</Text>
                {CONFESSION.map((line) => (
                  <Text key={line.slice(0, 24)} style={styles.confessionLine}>
                    {line}
                  </Text>
                ))}
                <SpringPress
                  style={styles.checkRow}
                  onPress={() => setConfessed(!confessed)}
                  hitSlop={8}>
                  <Ionicons
                    name={confessed ? 'checkmark-circle' : 'radio-button-off'}
                    size={22}
                    color={confessed ? colors.sageDeep : colors.inkSoft}
                  />
                  <Text style={styles.checkLabel}>I confessed it to God</Text>
                </SpringPress>
              </View>

              <SpringPress
                onPress={finish}
                disabled={!confessed}
                style={[styles.riseButton, !confessed && styles.riseButtonOff]}>
                <Text style={styles.riseButtonText}>Rise Again</Text>
              </SpringPress>
            </>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const SUN_SIZE = 60;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  night: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.night,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 36,
  },
  stage: {
    height: 190,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  horizon: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: colors.inkSoft,
    opacity: 0.35,
  },
  orbRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  glowRow: { top: 35 },
  sunRow: { top: 60 },
  sunGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.dawn,
  },
  sun: {
    width: SUN_SIZE,
    height: SUN_SIZE,
    borderRadius: SUN_SIZE / 2,
    backgroundColor: colors.dawn,
  },
  body: { alignItems: 'center' },
  headline: {
    fontFamily: fonts.serif,
    fontSize: 29,
    color: colors.ink,
    textAlign: 'center',
  },
  subline: {
    fontFamily: fonts.serif,
    fontSize: 21,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.mist,
    borderRadius: radius.card,
    padding: 20,
    marginTop: 22,
    alignSelf: 'stretch',
  },
  verseText: {
    fontFamily: fonts.serifItalic,
    fontSize: 18,
    lineHeight: 26,
    color: colors.ink,
    textAlign: 'center',
  },
  verseRef: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 10,
    textAlign: 'right',
  },
  cardLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.inkSoft,
    marginBottom: 12,
  },
  confessionLine: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 23,
    color: colors.ink,
    marginBottom: 8,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
  },
  checkLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14.5,
    color: colors.ink,
  },
  riseButton: {
    backgroundColor: colors.dawn,
    borderRadius: radius.button,
    paddingVertical: 17,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 26,
    ...shadow,
  },
  riseButtonOff: { backgroundColor: colors.mist },
  riseButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.night,
  },
  risenNote: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 6,
  },
  homeButton: {
    backgroundColor: colors.mist,
    borderRadius: radius.button,
    paddingVertical: 15,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 24,
  },
  homeButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.ink,
  },
});
