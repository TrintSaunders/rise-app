import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius, shadow } from '@/constants/theme';
import { hapticTap } from '@/lib/haptics';
import { FEELINGS, useStore } from '@/lib/store';
import type { Feeling, TemptationOutcome } from '@/lib/store';
import { useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

const ESCAPE_VERSE = {
  text: 'No temptation has overtaken you except what is common to mankind. God is faithful; he will provide a way out.',
  ref: '1 Corinthians 10:13',
};

const WHEN_OPTIONS = [
  { key: 'now', label: 'just now' },
  { key: 'morning', label: 'this morning' },
  { key: 'afternoon', label: 'this afternoon' },
  { key: 'evening', label: 'this evening' },
  { key: 'lateNight', label: 'late last night' },
] as const;

type WhenKey = (typeof WHEN_OPTIONS)[number]['key'];

/**
 * The dark-hours chart is only as honest as this stamp. "Just now" is exact;
 * the others place the struggle in its true window of the day (clamped so
 * nothing is ever stamped in the future).
 */
function timestampFor(key: WhenKey, now: Date = new Date()): string {
  const d = new Date(now);
  switch (key) {
    case 'now':
      return now.toISOString();
    case 'morning':
      d.setHours(9, 15, 0, 0);
      break;
    case 'afternoon':
      d.setHours(15, 15, 0, 0);
      break;
    case 'evening':
      d.setHours(19, 15, 0, 0);
      break;
    case 'lateNight':
      d.setDate(d.getDate() - 1);
      d.setHours(23, 15, 0, 0);
      break;
  }
  return new Date(Math.min(d.getTime(), now.getTime())).toISOString();
}

/**
 * Log a struggle — the quiet card on Today. Feeling chips + how it ended.
 * “I fled” gets a quiet high-five; “I fell” goes straight to grace (Rise Again).
 * Nothing here condemns; honesty is the whole point.
 */
export default function LogStruggleScreen() {
  const { logTemptation } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);
  const [feelings, setFeelings] = useState<Feeling[]>([]);
  const [outcome, setOutcome] = useState<TemptationOutcome | null>(null);
  const [when, setWhen] = useState<WhenKey>('now');
  const [fledSaved, setFledSaved] = useState(false);

  const toggleFeeling = (feeling: Feeling) => {
    setFeelings((prev) =>
      prev.includes(feeling) ? prev.filter((f) => f !== feeling) : [...prev, feeling]
    );
  };

  const save = () => {
    if (!outcome) return;
    logTemptation(feelings, outcome, timestampFor(when));
    if (outcome === 'fled') {
      hapticTap();
      setFledSaved(true);
    } else {
      router.replace('/rise-again');
    }
  };

  if (fledSaved) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar style={t.isNight ? 'light' : 'dark'} />
        <ScrollView contentContainerStyle={styles.content}>
          <Ionicons name="checkmark-circle" size={40} color={colors.sageDeep} />
          <Text style={styles.savedTitle}>You fled. That’s the win.</Text>
          <Text style={styles.savedNote}>
            Logged and left behind — it doesn’t get to follow you into tonight.
          </Text>
          <View style={styles.verseCard}>
            <Text style={styles.verseText}>“{ESCAPE_VERSE.text}”</Text>
            <Text style={styles.verseRef}>— {ESCAPE_VERSE.ref}</Text>
          </View>
          <SpringPress style={styles.quietButton} onPress={() => router.back()}>
            <Text style={styles.quietButtonText}>back to today</Text>
          </SpringPress>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>log a struggle</Text>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={22} color={colors.inkSoft} />
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>what’s going on?</Text>
        <View style={styles.chipRow}>
          {FEELINGS.map((feeling) => {
            const on = feelings.includes(feeling);
            return (
              <SpringPress
                key={feeling}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => toggleFeeling(feeling)}>
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{feeling}</Text>
              </SpringPress>
            );
          })}
        </View>
        <Text style={styles.sectionNote}>tap all that apply — or none, that’s fine too</Text>

        <Text style={styles.sectionLabel}>when did it happen?</Text>
        <View style={styles.chipRow}>
          {WHEN_OPTIONS.map((option) => {
            const on = when === option.key;
            return (
              <SpringPress
                key={option.key}
                style={[styles.chip, on && styles.chipOn]}
                onPress={() => setWhen(option.key)}>
                <Text style={[styles.chipText, on && styles.chipTextOn]}>{option.label}</Text>
              </SpringPress>
            );
          })}
        </View>
        <Text style={styles.sectionNote}>
          the honest hour matters more than the exact minute
        </Text>

        <Text style={styles.sectionLabel}>how did it end?</Text>
        <SpringPress
          style={[styles.outcome, outcome === 'fled' && styles.outcomeFled]}
          onPress={() => setOutcome('fled')}>
          <Text style={styles.outcomeTitle}>I got away — I fled</Text>
          <Text style={styles.outcomeNote}>it came, and I walked. Count it.</Text>
        </SpringPress>
        <SpringPress
          style={[styles.outcome, outcome === 'fell' && styles.outcomeFell]}
          onPress={() => setOutcome('fell')}>
          <Text style={styles.outcomeTitle}>I gave in — I fell</Text>
          <Text style={styles.outcomeNote}>no shame here. Mercy isn’t finished with you.</Text>
        </SpringPress>

        <SpringPress
          onPress={save}
          disabled={!outcome}
          style={[styles.saveButton, !outcome && styles.saveButtonOff]}>
          <Text style={styles.saveButtonText}>save it and keep moving</Text>
        </SpringPress>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.bg },
    content: {
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 10,
      paddingBottom: 32,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
      minHeight: 32,
      marginBottom: 22,
    },
    title: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: t.textSoft,
    },
    sectionLabel: {
      fontFamily: fonts.serif,
      fontSize: 21,
      color: t.text,
      alignSelf: 'flex-start',
    },
    sectionNote: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: t.textSoft,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    chipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      alignSelf: 'flex-start',
      marginTop: 14,
    },
    chip: {
      backgroundColor: t.card,
      borderRadius: radius.button,
      paddingHorizontal: 16,
      paddingVertical: 9,
    },
    chipOn: { backgroundColor: t.softSage },
    chipText: {
      fontFamily: fonts.sans,
      fontSize: 14.5,
      color: t.textSoft,
    },
    chipTextOn: { fontFamily: fonts.sansMedium, color: t.sageText },
    outcome: {
      alignSelf: 'stretch',
      backgroundColor: t.card,
      borderRadius: 18,
      padding: 16,
      marginTop: 10,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    outcomeFled: { borderColor: colors.sage, backgroundColor: t.softSage },
    outcomeFell: { borderColor: t.text },
    outcomeTitle: {
      fontFamily: fonts.sansMedium,
      fontSize: 15.5,
      color: t.text,
    },
    outcomeNote: {
      fontFamily: fonts.sans,
      fontSize: 12.5,
      lineHeight: 18,
      color: t.textSoft,
      marginTop: 3,
    },
    saveButton: {
      backgroundColor: colors.dawn,
      borderRadius: radius.button,
      paddingVertical: 16,
      alignItems: 'center',
      alignSelf: 'stretch',
      marginTop: 26,
      ...shadow,
    },
    saveButtonOff: { backgroundColor: t.card },
    saveButtonText: {
      fontFamily: fonts.sansMedium,
      fontSize: 16,
      color: colors.night,
    },
    savedTitle: {
      fontFamily: fonts.serif,
      fontSize: 25,
      lineHeight: 33,
      color: t.text,
      textAlign: 'center',
      marginTop: 14,
    },
    savedNote: {
      fontFamily: fonts.sans,
      fontSize: 14,
      lineHeight: 20,
      color: t.textSoft,
      textAlign: 'center',
      marginTop: 10,
      paddingHorizontal: 8,
    },
    verseCard: {
      backgroundColor: t.card,
      borderRadius: radius.card,
      padding: 20,
      marginTop: 24,
      alignSelf: 'stretch',
    },
    verseText: {
      fontFamily: fonts.serifItalic,
      fontSize: 17,
      lineHeight: 25,
      color: t.text,
      textAlign: 'center',
    },
    verseRef: {
      fontFamily: fonts.sans,
      fontSize: 12.5,
      color: t.textSoft,
      marginTop: 10,
      textAlign: 'center',
    },
    quietButton: {
      backgroundColor: t.card,
      borderRadius: radius.button,
      paddingVertical: 15,
      alignItems: 'center',
      alignSelf: 'stretch',
      marginTop: 24,
    },
    quietButtonText: {
      fontFamily: fonts.sansMedium,
      fontSize: 15,
      color: t.text,
    },
  });
