import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DawnArc } from '@/components/DawnArc';
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

function greeting(name: string | undefined): string {
  const hour = new Date().getHours();
  const salutation =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${salutation}, ${name}` : salutation;
}

function statusNote(checkedIn: boolean): string {
  if (checkedIn) return 'The day is complete. Rest well.';
  if (new Date().getHours() >= 20) return 'Tonight’s check-in is waiting: 30 seconds of truth.';
  return 'Check in tonight and the day counts, whatever happened.';
}

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
      <ScrollView contentContainerStyle={styles.screen} showsVerticalScrollIndicator={false}>
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
            <Text style={styles.verseRef}>{verse.ref}</Text>
          </View>
        </Reveal>

        <Reveal delay={140} style={styles.stretch}>
          <View style={styles.arcSection}>
            <DawnArc complete={checkedIn} isNight={t.isNight} />
            <View style={styles.counters}>
              <View style={styles.counter}>
                <Text style={styles.counterNumber}>{honest}</Text>
                <Text style={styles.counterLabel}>
                  {honest === 1 ? 'day honest' : 'days honest'}
                </Text>
              </View>
              <View style={styles.counterDivider} />
              <View style={styles.counter}>
                <Text style={styles.counterNumber}>{clean}</Text>
                <Text style={styles.counterLabel}>
                  {clean === 1 ? 'day clean' : 'days clean'}
                </Text>
              </View>
            </View>
            {needsRise ? (
              <SpringPress style={styles.riseLink} onPress={() => router.push('/rise-again')}>
                <Ionicons name="sunny" size={16} color={colors.dawn} />
                <Text style={styles.riseLinkText}>The sun is waiting. Rise again</Text>
              </SpringPress>
            ) : (
              <Text style={styles.arcNote}>{statusNote(checkedIn)}</Text>
            )}
          </View>
        </Reveal>

        <Reveal delay={210} style={styles.stretch}>
          <View style={styles.actionsRow}>
            <SpringPress
              style={styles.quietAction}
              onPress={() => router.push('/log-struggle')}>
              <Ionicons name="create-outline" size={18} color={t.textSoft} />
              <Text style={styles.quietTitle}>Log a struggle</Text>
              <Text style={styles.quietNote}>the truth, no shame</Text>
            </SpringPress>
            {checkedIn ? (
              <View style={[styles.quietAction, styles.quietDone]}>
                <Ionicons name="checkmark-circle" size={18} color={t.sageText} />
                <Text style={styles.quietTitle}>Evening check-in</Text>
                <Text style={styles.quietNote}>done, rest well</Text>
              </View>
            ) : (
              <SpringPress
                style={[styles.quietAction, eveningNudge && styles.checkinGlow]}
                onPress={() => router.push('/checkin')}>
                <Ionicons name="moon-outline" size={18} color={t.textSoft} />
                <Text style={styles.quietTitle}>Evening check-in</Text>
                <Text style={styles.quietNote}>
                  {eveningNudge ? 'it’s time, 30 seconds' : '30 seconds of truth'}
                </Text>
              </SpringPress>
            )}
          </View>
        </Reveal>

      </ScrollView>

      {/* Pinned, never scrolled away: help is always one tap from Today. */}
      <Reveal delay={280} style={styles.sosDock}>
        <SpringPress style={styles.sosButton} onPress={() => router.navigate({ pathname: '/sos', params: { now: '1' } })}>
          <Ionicons name="bonfire-outline" size={19} color={colors.ember} />
          <Text style={styles.sosText}>I’m struggling right now</Text>
        </SpringPress>
      </Reveal>
    </SafeAreaView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.bg },
    screen: { paddingHorizontal: 24, paddingBottom: 16 },
    stretch: { alignSelf: 'stretch' },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginTop: 18,
    },
    headerText: { flex: 1 },
    themeButton: { padding: 6, marginRight: -6 },
    greeting: {
      fontFamily: fonts.serif,
      fontSize: 30,
      lineHeight: 36,
      color: t.text,
    },
    date: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: t.textSoft,
      marginTop: 4,
    },
    verseCard: {
      backgroundColor: t.card,
      borderRadius: radius.card,
      paddingVertical: 22,
      paddingHorizontal: 24,
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
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      letterSpacing: 0.4,
      color: t.textSoft,
      marginTop: 12,
    },
    arcSection: { alignItems: 'center', marginTop: 26 },
    counters: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },
    counter: { alignItems: 'center', minWidth: 104 },
    counterNumber: {
      fontFamily: fonts.serif,
      fontSize: 30,
      lineHeight: 34,
      color: t.text,
    },
    counterLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 11,
      letterSpacing: 1.1,
      textTransform: 'uppercase',
      color: t.textSoft,
      marginTop: 2,
    },
    counterDivider: {
      width: 1,
      height: 34,
      backgroundColor: t.card,
    },
    riseLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
      paddingVertical: 6,
    },
    riseLinkText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14.5,
      color: t.text,
    },
    arcNote: {
      fontFamily: fonts.sans,
      fontSize: 13,
      lineHeight: 19,
      color: t.textSoft,
      marginTop: 12,
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
      gap: 4,
    },
    quietDone: { backgroundColor: t.softSage },
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
      marginTop: 6,
    },
    quietNote: {
      fontFamily: fonts.sans,
      fontSize: 12.5,
      lineHeight: 17,
      color: t.textSoft,
    },
    sosDock: {
      paddingHorizontal: 24,
      paddingTop: 10,
      paddingBottom: 14,
      backgroundColor: t.bg,
    },
    sosButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 9,
      backgroundColor: t.bg,
      borderRadius: radius.button,
      borderWidth: 1.5,
      borderColor: colors.ember,
      paddingVertical: 19,
    },
    sosText: {
      fontFamily: fonts.sansMedium,
      fontSize: 15,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: colors.ember,
    },
  });
