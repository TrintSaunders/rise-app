import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Reveal } from '@/components/Reveal';
import { SpringPress } from '@/components/SpringPress';
import { StarField } from '@/components/StarField';
import { colors, fonts, radius } from '@/constants/theme';
import { useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';
import { shiftDay, todayStr, useStore } from '@/lib/store';
import type { Feeling, StoreData } from '@/lib/store';

const WINDOW_DAYS = 14;
// Two-hour buckets across the day, midnight-first: 0 = 12a–2a … 11 = 10p–12a.
const HOUR_TICKS = ['12a', '', '4a', '', '8a', '', '12p', '', '4p', '', '8p', ''];

const RISE_VERSE = {
  text: 'Though the righteous fall seven times, they rise again.',
  ref: 'Proverbs 24:16',
};

// Suggestions, never verdicts (DESIGN.md).
const SUGGESTIONS: Record<Feeling, string> = {
  'in bed': 'What if the phone slept outside the bedroom tonight?',
  tired: 'Tired is when it usually wins. What would an earlier lights-out change?',
  lonely: 'Who could you reach out to before it gets heavy — not after?',
  bored: 'What’s one thing you’ve been putting off? Ten messy minutes of it, tonight.',
  stressed: 'What’s the one thing actually weighing on you? Name it before it becomes everything.',
  procrastinating: 'The task you’re avoiding is smaller than the fog around it. Start with ten minutes.',
};

type DayAgg = { struggles: number; falls: number; rises: number; victories: number };

function dayKey(iso: string): string {
  return todayStr(new Date(iso));
}

function hourLabel(hour: number): string {
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}${hour < 12 ? 'am' : 'pm'}`;
}

function fortnight(data: StoreData) {
  const today = todayStr();
  const dates = Array.from(
    { length: WINDOW_DAYS },
    (_, i) => shiftDay(today, i - (WINDOW_DAYS - 1)),
  );
  const byDate = new Map<string, DayAgg>(
    dates.map((d) => [d, { struggles: 0, falls: 0, rises: 0, victories: 0 }]),
  );
  const feelings = new Map<Feeling, number>();
  const buckets = new Array<number>(12).fill(0);
  const totals = { struggles: 0, falls: 0, rises: 0, victories: 0 };

  for (const t of data.temptations) {
    buckets[Math.floor(new Date(t.at).getHours() / 2)] += 1;
    for (const f of t.feelings) feelings.set(f, (feelings.get(f) ?? 0) + 1);
    const agg = byDate.get(dayKey(t.at));
    if (agg) {
      agg.struggles += 1;
      if (t.outcome === 'fell') agg.falls += 1;
    }
    totals.struggles += 1;
    if (t.outcome === 'fell') totals.falls += 1;
  }
  for (const r of data.rises) {
    const agg = byDate.get(dayKey(r.at));
    if (agg) agg.rises += 1;
    totals.rises += 1;
  }
  for (const v of data.victories) {
    const agg = byDate.get(dayKey(v.at));
    if (agg) agg.victories += 1;
    totals.victories += 1;
  }

  return { dates, byDate, feelings, buckets, totals };
}

function buildInsight(f: ReturnType<typeof fortnight>) {
  if (f.totals.struggles < 3) return null;
  let peak = 0;
  for (let i = 1; i < f.buckets.length; i++) {
    if (f.buckets[i]! > f.buckets[peak]!) peak = i;
  }
  if (f.buckets[peak]! < 2) return null;
  const ranked = [...f.feelings.entries()].sort((a, b) => b[1] - a[1]);
  const top = ranked.slice(0, 2).map(([feeling]) => feeling);
  const feelingPhrase = top.length
    ? ` — usually when you’re ${top.join(' and ')}`
    : '';
  const suggestion = top.length ? SUGGESTIONS[top[0]!] : SUGGESTIONS.tired;
  // Buckets are two hours wide, so the honest claim is a range, not an hour.
  const window = `${hourLabel(peak * 2)} and ${hourLabel(peak * 2 + 2)}`;
  return {
    when: window,
    feelingPhrase,
    suggestion,
  };
}

/**
 * Patterns — honest data, gently read back (DESIGN.md). Facts and suggestions,
 * never verdicts. Everything here is read-only; history is never erased.
 */
export default function PatternsScreen() {
  const { data, seedSampleData, clearSampleData } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);
  const f = fortnight(data);
  const insight = buildInsight(f);
  const maxBucket = Math.max(...f.buckets, 1);
  const peakBucket = f.buckets.indexOf(maxBucket);
  const rankedFeelings = [...f.feelings.entries()].sort((a, b) => b[1] - a[1]);
  const maxFeelingCount = rankedFeelings[0]?.[1] ?? 1;
  const hasSample =
    data.temptations.some((t) => t.demo) ||
    data.victories.some((v) => v.demo) ||
    data.rises.some((r) => r.demo);

  const Stat = ({ value, label }: { value: number; label: string }) => (
    <View style={styles.stat}>
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      {t.isNight && <StarField />}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Patterns</Text>
        <Text style={styles.subtitle}>honest data, gently read back</Text>

        <Reveal delay={0} style={styles.card}>
          <Text style={styles.cardLabel}>the last two weeks</Text>
          <View style={styles.statsRow}>
            <Stat value={f.totals.struggles} label="struggles" />
            <Stat value={f.totals.falls} label="falls" />
            <Stat value={f.totals.rises} label="rises" />
            <Stat value={f.totals.victories} label="victories" />
          </View>
        </Reveal>

        <Reveal delay={70} style={styles.insightCard}>
          <View style={styles.insightHead}>
              <Ionicons name="bulb-outline" size={15} color={t.sageText} />
            <Text style={styles.insightTitle}>one thing worth trying</Text>
          </View>
          <Text style={styles.insightText}>
            {insight
              ? `Most of your struggles come between ${insight.when}${insight.feelingPhrase}. ${insight.suggestion}`
              : 'Keep logging when it’s hard — after a few honest days, the quiet patterns start to surface here. No verdicts, just facts.'}
          </Text>
        </Reveal>

        <Reveal delay={140} style={styles.card}>
          <Text style={styles.cardLabel}>where the dark hours live</Text>
          <View style={styles.hourBars}>
            {f.buckets.map((count, i) => {
              const height = Math.max(5, Math.round((count / maxBucket) * 60));
              return (
                <View key={i} style={styles.hourBarWrap}>
                  <View
                    style={[
                      styles.hourBar,
                      i === peakBucket && count > 0 && styles.hourBarPeak,
                      { height },
                    ]}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.hourTicks}>
            {HOUR_TICKS.map((tick, i) => (
              <Text key={i} style={styles.hourTick}>
                {tick}
              </Text>
            ))}
          </View>
        </Reveal>

        <Reveal delay={210} style={styles.card}>
          <Text style={styles.cardLabel}>what’s usually going on</Text>
          {rankedFeelings.length === 0 ? (
            <Text style={styles.emptyNote}>
              No feeling tags yet — they show up here when you log a struggle.
            </Text>
          ) : (
            rankedFeelings.map(([feeling, count]) => (
              <View key={feeling} style={styles.triggerRow}>
                <Text style={styles.triggerName}>{feeling}</Text>
                <View style={styles.triggerTrack}>
                  <View
                    style={[
                      styles.triggerFill,
                      { width: `${Math.round((count / maxFeelingCount) * 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.triggerCount}>{count}</Text>
              </View>
            ))
          )}
        </Reveal>

        <Reveal delay={280} style={styles.card}>
          <Text style={styles.cardLabel}>the rise line</Text>
          <View style={styles.riseColumns}>
            {f.dates.map((date) => {
              const agg = f.byDate.get(date)!;
              return (
                <View key={date} style={styles.riseColumn}>
                  <View style={styles.fallSlot}>
                    {Array.from({ length: Math.min(agg.falls, 3) }).map((_, i) => (
                      <View key={i} style={styles.fallDot} />
                    ))}
                  </View>
                  <View style={styles.riseLineRule} />
                  <View style={styles.riseSlot}>
                    {Array.from({ length: Math.min(agg.rises, 3) }).map((_, i) => (
                      <View key={i} style={styles.riseDot} />
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.rangeRow}>
            <Text style={styles.rangeText}>two weeks ago</Text>
            <Text style={styles.rangeText}>today</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.fallDot} />
              <Text style={styles.legendText}>a fall</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.riseDot} />
              <Text style={styles.legendText}>a rise</Text>
            </View>
          </View>
          <Text style={styles.riseVerse}>“{RISE_VERSE.text}”</Text>
          <Text style={styles.riseVerseRef}>— {RISE_VERSE.ref}</Text>
        </Reveal>

        <Reveal delay={350} style={styles.card}>
          <Text style={styles.cardLabel}>trying the app?</Text>
          <Text style={styles.tryNote}>
            This screen fills in as you live — ‘log a struggle’ on Today, evening
            check-ins, SOS victories. To see it full right now, add two weeks of
            sample entries. They only touch this screen; your real history,
            counters, and profile stay exactly as they are.
          </Text>
          <SpringPress
            style={styles.tryButton}
            onPress={hasSample ? clearSampleData : seedSampleData}>
            <Text style={styles.tryButtonText}>
              {hasSample ? 'clear sample history' : 'fill with sample history'}
            </Text>
          </SpringPress>
        </Reveal>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.bg },
    content: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 36 },
    heading: {
      fontFamily: fonts.serif,
      fontSize: 30,
      color: t.text,
    },
    subtitle: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: t.textSoft,
      marginTop: 2,
    },
    card: {
      backgroundColor: t.card,
      borderRadius: radius.card,
      padding: 18,
      marginTop: 18,
    },
    cardLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: t.textSoft,
      marginBottom: 14,
    },
    statsRow: { flexDirection: 'row' },
    stat: { flex: 1, alignItems: 'center' },
    statNumber: {
      fontFamily: fonts.serif,
      fontSize: 25,
      color: t.text,
    },
    statLabel: {
      fontFamily: fonts.sans,
      fontSize: 11.5,
      color: t.textSoft,
      marginTop: 3,
    },
    insightCard: {
      backgroundColor: t.softSage,
      borderRadius: radius.card,
      padding: 18,
      marginTop: 18,
    },
    insightHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
      marginBottom: 10,
    },
    insightTitle: {
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: t.sageText,
    },
    insightText: {
      fontFamily: fonts.sans,
      fontSize: 14.5,
      lineHeight: 21,
      color: t.text,
    },
    hourBars: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 68,
      gap: 5,
    },
    hourBarWrap: { flex: 1, height: '100%', justifyContent: 'flex-end' },
    hourBar: {
      backgroundColor: t.bars,
      borderRadius: 4,
      opacity: 0.75,
    },
    hourBarPeak: { backgroundColor: colors.ember, opacity: 1 },
    hourTicks: {
      flexDirection: 'row',
      gap: 5,
      marginTop: 7,
    },
    hourTick: {
      flex: 1,
      fontFamily: fonts.sans,
      fontSize: 9.5,
      color: t.textSoft,
      textAlign: 'center',
    },
    triggerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginVertical: 6,
    },
    triggerName: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: t.text,
      width: 108,
    },
    triggerTrack: {
      flex: 1,
      height: 8,
      borderRadius: 4,
      backgroundColor: t.track,
      overflow: 'hidden',
    },
    triggerFill: {
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.ember,
    },
    triggerCount: {
      fontFamily: fonts.sans,
      fontSize: 12.5,
      color: t.textSoft,
      width: 18,
      textAlign: 'right',
    },
    emptyNote: {
      fontFamily: fonts.sans,
      fontSize: 13.5,
      lineHeight: 19,
      color: t.textSoft,
    },
    riseColumns: {
      flexDirection: 'row',
      gap: 4,
      alignItems: 'stretch',
    },
    riseColumn: { flex: 1, alignItems: 'center' },
    fallSlot: {
      height: 34,
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 3,
    },
    riseSlot: {
      height: 34,
      justifyContent: 'flex-start',
      alignItems: 'center',
      gap: 3,
    },
    riseLineRule: {
      height: 1.5,
      alignSelf: 'stretch',
      backgroundColor: t.track,
    },
    fallDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.ember,
    },
    riseDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.dawn,
    },
    rangeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    rangeText: {
      fontFamily: fonts.sans,
      fontSize: 10.5,
      color: t.textSoft,
    },
    legendRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 18,
      marginTop: 14,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendText: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: t.textSoft,
    },
    riseVerse: {
      fontFamily: fonts.serifItalic,
      fontSize: 15,
      lineHeight: 22,
      color: t.text,
      textAlign: 'center',
      marginTop: 16,
    },
    riseVerseRef: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: t.textSoft,
      textAlign: 'center',
      marginTop: 6,
    },
    tryNote: {
      fontFamily: fonts.sans,
      fontSize: 13,
      lineHeight: 19,
      color: t.textSoft,
    },
    tryButton: {
      backgroundColor: t.track,
      borderRadius: radius.button,
      paddingVertical: 12,
      alignItems: 'center',
      marginTop: 14,
    },
    tryButtonText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: t.text,
    },
  });
