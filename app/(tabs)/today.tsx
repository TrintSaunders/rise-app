import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Reveal } from '@/components/Reveal';
import { SpringPress } from '@/components/SpringPress';
import { StarField } from '@/components/StarField';
import { colors, fonts, radius } from '@/constants/theme';
import {
  cleanStreakDays,
  honestStreakDays,
  isCheckedInToday,
  useStore,
  waitingToRise,
} from '@/lib/store';
import { nextThemeMode, useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';
import { verseForToday } from '@/lib/verses';

const ARC_WIDTH = 220;

function greeting(name: string | undefined): string {
  const hour = new Date().getHours();
  const salutation =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${salutation}, ${name}` : salutation;
}

// The sun's position along the arc tracks the real day, dawn to dusk.
function sunPosition(): number {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return (minutes / (24 * 60)) * (ARC_WIDTH - 24);
}

function statusNote(checkedIn: boolean, needsRise: boolean): string {
  if (needsRise) return 'the sun is waiting — rise again when you’re ready';
  if (checkedIn) return 'the day is complete — rest well';
  const hour = new Date().getHours();
  if (hour >= 20) return 'tonight’s check-in is waiting — 30 seconds of truth';
  return 'check in tonight and the day counts, whatever happened';
}

/**
 * The dawn arc. When the day is complete, it fills with gold, left to right —
 * a background-colored cover over a gold arc slides away so the gold "rises"
 * from the left. The cover must match the sky behind it, day or Night Watch.
 */
function DawnArc({ complete, skyColor }: { complete: boolean; skyColor: string }) {
  const fill = useRef(new Animated.Value(complete ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(fill, {
      toValue: complete ? 1 : 0,
      duration: 1400,
      useNativeDriver: false, // animating layout width
    }).start();
  }, [complete, fill]);

  const coverWidth = fill.interpolate({
    inputRange: [0, 1],
    outputRange: [ARC_WIDTH + 4, 0],
  });

  return (
    <View style={arcStyles.wrap}>
      <View style={arcStyles.track} />
      <View style={arcStyles.gold} />
      <Animated.View style={[arcStyles.cover, { width: coverWidth, backgroundColor: skyColor }]} />
      <View style={[arcStyles.sunDot, { left: sunPosition() }]}>
        <Ionicons name="sunny" size={18} color={colors.dawn} />
      </View>
    </View>
  );
}

const arcStyles = StyleSheet.create({
  wrap: { width: ARC_WIDTH, height: 112 },
  track: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ARC_WIDTH,
    height: 110,
    borderRadius: 110,
    borderWidth: 2,
    borderColor: colors.dawn,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  gold: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: ARC_WIDTH,
    height: 110,
    borderRadius: 110,
    borderWidth: 3,
    borderColor: colors.dawn,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    shadowColor: colors.dawn,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  cover: {
    position: 'absolute',
    top: -4,
    right: -4,
    height: 118,
  },
  sunDot: {
    position: 'absolute',
    bottom: -9,
  },
});

function themeIconName(mode: string, isNight: boolean): 'moon' | 'moon-outline' | 'sunny' | 'sunny-outline' {
  if (isNight) return mode === 'night' ? 'moon' : 'moon-outline';
  return mode === 'day' ? 'sunny' : 'sunny-outline';
}

export default function TodayScreen() {
  const { data, setThemeMode } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);

  const name = data.profile?.name?.trim();
  const lifeVerse = data.profile?.lifeVerse ?? null;
  const verse = lifeVerse ?? verseForToday();
  const checkedIn = isCheckedInToday(data);
  const needsRise = waitingToRise(data);
  const honest = honestStreakDays(data);
  const clean = cleanStreakDays(data);
  const eveningNudge = !checkedIn && new Date().getHours() >= 20;

  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      {t.isNight && <StarField />}
      <View style={styles.screen}>
        <Reveal>
          <View style={styles.headerRow}>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>{greeting(name)}</Text>
              <Text style={styles.date}>{dateLabel}</Text>
            </View>
            <SpringPress
              style={styles.themeButton}
              hitSlop={10}
              accessibilityLabel="theme mode"
              onPress={() => setThemeMode(nextThemeMode(data.themeMode))}>
              <Ionicons
                name={themeIconName(data.themeMode, t.isNight)}
                size={20}
                color={t.textSoft}
              />
            </SpringPress>
          </View>
        </Reveal>

        <Reveal delay={70} style={styles.stretch}>
          <View style={styles.verseCard}>
            <Text style={styles.verseLabel}>
              {lifeVerse ? 'your life verse' : 'verse of the day'}
            </Text>
            <Text style={styles.verseText}>“{verse.text}”</Text>
            <Text style={styles.verseRef}>— {verse.ref}</Text>
          </View>
        </Reveal>

        <Reveal delay={140} style={styles.stretch}>
          <View style={styles.arcSection}>
            <DawnArc complete={checkedIn} skyColor={t.bg} />
            <Text style={styles.counters}>
              day {honest} honest · day {clean} clean
            </Text>
            {needsRise ? (
              <SpringPress
                style={styles.riseLink}
                onPress={() => router.push('/rise-again')}>
                <Ionicons name="sunny" size={16} color={colors.dawn} />
                <Text style={styles.riseLinkText}>rise again</Text>
              </SpringPress>
            ) : (
              <Text style={styles.arcNote}>{statusNote(checkedIn, needsRise)}</Text>
            )}
          </View>
        </Reveal>

        <Reveal delay={210} style={styles.stretch}>
          <View style={styles.actionsRow}>
            <SpringPress
              style={styles.quietAction}
              onPress={() => router.push('/log-struggle')}>
              <Text style={styles.quietTitle}>log a struggle</Text>
              <Text style={styles.quietNote}>the truth, no shame</Text>
            </SpringPress>
            {checkedIn ? (
              <View style={[styles.quietAction, styles.quietDone, { flex: 1.15 }]}>
                <View style={styles.doneRow}>
                  <Ionicons name="checkmark-circle" size={17} color={t.sageText} />
                  <Text style={styles.quietTitle}>evening check-in</Text>
                </View>
                <Text style={styles.quietNote}>done — rest well</Text>
              </View>
            ) : (
              <SpringPress
                style={[
                  styles.quietAction,
                  { flex: 1.15 },
                  eveningNudge && styles.checkinGlow,
                ]}
                onPress={() => router.push('/checkin')}>
                <Text style={styles.quietTitle}>evening check-in</Text>
                <Text style={styles.quietNote}>
                  {eveningNudge ? 'it’s time — 30 seconds of truth' : '30 seconds of truth'}
                </Text>
              </SpringPress>
            )}
          </View>
        </Reveal>

        <View style={styles.spacer} />

        <Reveal delay={280} style={styles.stretch}>
          <SpringPress style={styles.sosButton} onPress={() => router.navigate('/sos')}>
            <Ionicons name="bonfire-outline" size={19} color={colors.ember} />
            <Text style={styles.sosText}>I’m struggling right now</Text>
          </SpringPress>
        </Reveal>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.bg },
    screen: { flex: 1, paddingHorizontal: 24, paddingBottom: 12 },
    stretch: { alignSelf: 'stretch' },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 18,
    },
    headerText: { flex: 1 },
    themeButton: { paddingTop: 6 },
    greeting: {
      fontFamily: fonts.serif,
      fontSize: 30,
      color: t.text,
    },
    date: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: t.textSoft,
      marginTop: 2,
    },
    verseCard: {
      backgroundColor: t.card,
      borderRadius: radius.card,
      padding: 22,
      marginTop: 22,
      alignItems: 'center',
    },
    verseLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 10.5,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
      color: t.textSoft,
      marginBottom: 10,
    },
    verseText: {
      fontFamily: fonts.serifItalic,
      fontSize: 20,
      lineHeight: 30,
      color: t.text,
      textAlign: 'center',
    },
    verseRef: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: t.textSoft,
      marginTop: 10,
    },
    arcSection: { alignItems: 'center', marginTop: 26 },
    counters: {
      fontFamily: fonts.serif,
      fontSize: 17,
      color: t.text,
      marginTop: 6,
    },
    riseLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 8,
    },
    riseLinkText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14.5,
      color: t.text,
    },
    arcNote: {
      fontFamily: fonts.sans,
      fontSize: 12.5,
      lineHeight: 18,
      color: t.textSoft,
      marginTop: 6,
      textAlign: 'center',
      paddingHorizontal: 28,
    },
    actionsRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    quietAction: {
      flex: 1,
      backgroundColor: t.card,
      borderRadius: 18,
      padding: 16,
    },
    quietDone: { backgroundColor: t.softSage },
    doneRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    checkinGlow: {
      borderWidth: 1.5,
      borderColor: colors.dawn,
      shadowColor: colors.dawn,
      shadowOpacity: 0.35,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 0 },
      elevation: 5,
    },
    quietTitle: {
      fontFamily: fonts.sansMedium,
      fontSize: 15,
      color: t.text,
    },
    quietNote: {
      fontFamily: fonts.sans,
      fontSize: 12,
      lineHeight: 17,
      color: t.textSoft,
      marginTop: 4,
    },
    spacer: { flex: 1 },
    sosButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      backgroundColor: t.bg,
      borderRadius: radius.button,
      borderWidth: 1.5,
      borderColor: colors.ember,
      paddingVertical: 21,
    },
    sosText: {
      fontFamily: fonts.sansMedium,
      fontSize: 16,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: colors.ember,
    },
  });
