import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MemoryGate } from '@/components/MemoryGate';
import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius, shadow } from '@/constants/theme';
import { hapticTap } from '@/lib/haptics';
import { dueVerses, firstLetters } from '@/lib/memory';
import type { MemoryVerse } from '@/lib/memory';
import { todayStr, useStore } from '@/lib/store';
import { useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

export default function ReviewScreen() {
  return (
    <MemoryGate>
      <Review />
    </MemoryGate>
  );
}

/**
 * Today's review: say it from the reference, peek at first letters if you
 * need to, then check yourself. "Not yet" isn't failure — the verse just
 * comes round again tomorrow.
 */
function Review() {
  const { folder: folderId } = useLocalSearchParams<{ folder?: string }>();
  const { data, reviewVerse } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);

  // The queue is fixed when the session opens; answering reschedules each
  // verse, and it shouldn't vanish from under his thumb.
  const [{ queue, practiceOnly }] = useState<{ queue: MemoryVerse[]; practiceOnly: boolean }>(
    () => {
      const due = dueVerses(data.memory, todayStr(), folderId);
      if (due.length > 0 || !folderId) return { queue: due, practiceOnly: false };
      // Practicing a folder with nothing due: run the whole folder, but leave
      // the schedule alone — an extra lap shouldn't push the next review out.
      const all = data.memory.folders.find((f) => f.id === folderId)?.verses ?? [];
      return { queue: all, practiceOnly: true };
    }
  );
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<'ref' | 'hint' | 'full'>('ref');
  const [held, setHeld] = useState(0);

  const hasVerses = data.memory.folders.some((f) => f.verses.length > 0);
  const verse = queue[index];
  const finished = index >= queue.length;

  const answer = (remembered: boolean) => {
    if (!verse) return;
    if (!practiceOnly) reviewVerse(verse.ref, remembered);
    if (remembered) setHeld((n) => n + 1);
    if (index + 1 >= queue.length) hapticTap();
    setIndex((i) => i + 1);
    setStage('ref');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerLabel}>
            {finished ? 'review' : `${index + 1} of ${queue.length}`}
          </Text>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="close" size={22} color={t.textSoft} />
          </Pressable>
        </View>

        {finished ? (
          <View style={styles.doneBody}>
            <Ionicons
              name={queue.length === 0 && !hasVerses ? 'book-outline' : 'checkmark-circle'}
              size={36}
              color={t.sageText}
            />
            <Text style={styles.doneTitle}>
              {queue.length > 0 ? 'Stored up.' : hasVerses ? 'Nothing due today.' : 'No verses yet.'}
            </Text>
            <Text style={styles.doneNote}>
              {queue.length === 0
                ? hasVerses
                  ? 'Every verse is resting on schedule. Come back tomorrow.'
                  : 'Add a suggested set or a folder of your own in the Armory, and your first review starts right away.'
                : practiceOnly
                  ? `${held} of ${queue.length} came back to you. A free lap, so your review schedule hasn’t changed.`
                  : `${held} of ${queue.length} came back to you. The rest come back tomorrow. That’s how it takes root.`}
            </Text>
            <Text style={styles.doneVerse}>
              “I have stored up your word in my heart, that I might not sin against you.”
            </Text>
            <Text style={styles.doneRef}>Psalm 119:11</Text>
            <SpringPress style={styles.primary} onPress={() => router.back()}>
              <Text style={styles.primaryText}>{hasVerses ? 'done' : 'back to the Armory'}</Text>
            </SpringPress>
          </View>
        ) : (
          verse && (
            <View>
              <View style={styles.card}>
                <Text style={styles.ref}>{verse.ref}</Text>
                {stage === 'ref' && (
                  <Text style={styles.prompt}>say it to yourself, then check</Text>
                )}
                {stage === 'hint' && (
                  <Text style={styles.hint}>{firstLetters(verse.text)}</Text>
                )}
                {stage === 'full' && (
                  <>
                    <Text style={styles.full}>“{verse.text}”</Text>
                    <Text style={styles.translation}>{verse.translation}</Text>
                  </>
                )}
              </View>

              {stage === 'full' ? (
                <View style={styles.answerRow}>
                  <SpringPress style={styles.notYet} onPress={() => answer(false)}>
                    <Text style={styles.notYetText}>not yet</Text>
                  </SpringPress>
                  <SpringPress style={styles.gotIt} onPress={() => answer(true)}>
                    <Text style={styles.gotItText}>got it</Text>
                  </SpringPress>
                </View>
              ) : (
                <View style={styles.answerRow}>
                  {stage === 'ref' && (
                    <SpringPress style={styles.notYet} onPress={() => setStage('hint')}>
                      <Text style={styles.notYetText}>first letters</Text>
                    </SpringPress>
                  )}
                  <SpringPress style={styles.gotIt} onPress={() => setStage('full')}>
                    <Text style={styles.gotItText}>show the verse</Text>
                  </SpringPress>
                </View>
              )}
            </View>
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.bg },
    content: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 32 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 32,
      marginBottom: 22,
    },
    headerLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: t.textSoft,
    },
    headerSpacer: { width: 22 },
    card: {
      backgroundColor: t.card,
      borderRadius: radius.card,
      padding: 26,
      minHeight: 240,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ref: {
      fontFamily: fonts.serif,
      fontSize: 26,
      color: t.text,
      textAlign: 'center',
    },
    prompt: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: t.textSoft,
      marginTop: 12,
    },
    hint: {
      fontFamily: fonts.serif,
      fontSize: 19,
      lineHeight: 30,
      letterSpacing: 1,
      color: t.textSoft,
      textAlign: 'center',
      marginTop: 18,
    },
    full: {
      fontFamily: fonts.serifItalic,
      fontSize: 19,
      lineHeight: 29,
      color: t.text,
      textAlign: 'center',
      marginTop: 16,
    },
    translation: {
      fontFamily: fonts.sans,
      fontSize: 11.5,
      color: t.textSoft,
      marginTop: 10,
    },
    answerRow: { flexDirection: 'row', gap: 12, marginTop: 22 },
    notYet: {
      flex: 1,
      backgroundColor: t.card,
      borderRadius: radius.button,
      paddingVertical: 15,
      alignItems: 'center',
    },
    notYetText: {
      fontFamily: fonts.sansMedium,
      fontSize: 15,
      color: t.text,
    },
    gotIt: {
      flex: 1,
      backgroundColor: colors.dawn,
      borderRadius: radius.button,
      paddingVertical: 15,
      alignItems: 'center',
      ...shadow,
    },
    gotItText: {
      fontFamily: fonts.sansMedium,
      fontSize: 15,
      color: colors.night,
    },
    doneBody: { alignItems: 'center', marginTop: 20 },
    doneTitle: {
      fontFamily: fonts.serif,
      fontSize: 27,
      color: t.text,
      marginTop: 14,
    },
    doneNote: {
      fontFamily: fonts.sans,
      fontSize: 14.5,
      lineHeight: 21,
      color: t.textSoft,
      textAlign: 'center',
      marginTop: 10,
      paddingHorizontal: 8,
    },
    doneVerse: {
      fontFamily: fonts.serifItalic,
      fontSize: 17,
      lineHeight: 25,
      color: t.text,
      textAlign: 'center',
      marginTop: 28,
    },
    doneRef: {
      fontFamily: fonts.sans,
      fontSize: 12.5,
      color: t.textSoft,
      marginTop: 8,
    },
    primary: {
      backgroundColor: colors.dawn,
      borderRadius: radius.button,
      paddingVertical: 15,
      alignItems: 'center',
      alignSelf: 'stretch',
      marginTop: 28,
    },
    primaryText: {
      fontFamily: fonts.sansMedium,
      fontSize: 15.5,
      color: colors.night,
    },
  });
