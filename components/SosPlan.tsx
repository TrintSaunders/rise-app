import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius } from '@/constants/theme';
import { alertAllies } from '@/lib/allyAlert';
import type { AlertOutcome } from '@/lib/allyAlert';
import { iconFor } from '@/lib/battlePlan';
import type { MemoryVerse } from '@/lib/memory';
import { useStore } from '@/lib/store';
import type { StoreData } from '@/lib/store';

const SENT_NOTE: Record<AlertOutcome, string> = {
  sent: 'sent',
  opened: 'ready, tap Send',
  cancelled: 'not sent',
  unavailable: 'texting isn’t available here',
};

/** The verse he knows best, else his first memory verse, else his life verse. */
function verseInHand(data: StoreData): { text: string; ref: string } | null {
  const verses: MemoryVerse[] = data.memory.folders.flatMap((f) => f.verses);
  if (verses.length > 0) {
    const best = [...verses].sort(
      (a, b) => (data.memory.progress[b.ref]?.box ?? 0) - (data.memory.progress[a.ref]?.box ?? 0)
    )[0]!;
    return { text: best.text, ref: best.ref };
  }
  return data.profile?.lifeVerse ?? null;
}

/**
 * "The way out, in order": his battle plan on SOS. Plain steps are words to
 * read; live steps are buttons that text his allies, call one, or put a
 * verse he's memorized in front of him.
 */
export function SosPlan() {
  const { data } = useStore();
  const [textStatus, setTextStatus] = useState<AlertOutcome | null>(null);
  const firstName = data.profile?.name?.trim().split(/\s+/)[0] ?? '';
  const verse = verseInHand(data);

  const textAllies = async () => {
    try {
      setTextStatus(await alertAllies(data.allies, firstName));
    } catch {
      setTextStatus('unavailable');
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>the way out, in order</Text>
      {data.battlePlan.map((step, i) => (
        <View key={step.id} style={styles.step}>
          <View style={styles.stepRow}>
            <Text style={styles.number}>{i + 1}</Text>
            <Ionicons name={iconFor(step)} size={18} color={colors.starlightSoft} />
            <Text style={styles.label}>{step.label}</Text>
          </View>

          {step.kind === 'text-allies' &&
            (data.allies.length > 0 ? (
              <View style={styles.actions}>
                <SpringPress style={styles.pill} onPress={textAllies}>
                  <Ionicons name="chatbubbles" size={14} color={colors.night} />
                  <Text style={styles.pillText}>text them</Text>
                </SpringPress>
                {textStatus && <Text style={styles.status}>{SENT_NOTE[textStatus]}</Text>}
              </View>
            ) : (
              <Text style={styles.hint}>Add allies on Today and this becomes a button.</Text>
            ))}

          {step.kind === 'call-ally' &&
            (data.allies.length > 0 ? (
              <View style={styles.actions}>
                {data.allies.map((ally) => (
                  <SpringPress
                    key={ally.id}
                    style={styles.pill}
                    onPress={() => Linking.openURL(`tel:${ally.phone}`).catch(() => {})}>
                    <Ionicons name="call" size={14} color={colors.night} />
                    <Text style={styles.pillText}>{ally.name}</Text>
                  </SpringPress>
                ))}
              </View>
            ) : (
              <Text style={styles.hint}>Add allies on Today and they’ll be one tap away here.</Text>
            ))}

          {step.kind === 'memory-verse' &&
            (verse ? (
              <View style={styles.verseBox}>
                <Text style={styles.verse}>“{verse.text}”</Text>
                <Text style={styles.verseRef}>{verse.ref}</Text>
              </View>
            ) : (
              <Text style={styles.hint}>Start a memory folder in the Armory and a verse appears here.</Text>
            ))}
        </View>
      ))}
      <Text style={styles.note}>do the first one before you decide anything</Text>
      <Pressable style={styles.edit} hitSlop={8} onPress={() => router.push('/battle-plan')}>
        <Ionicons name="create-outline" size={15} color={colors.starlightSoft} />
        <Text style={styles.editText}>edit your plan</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.nightSoft,
    borderRadius: radius.card,
    padding: 20,
    marginTop: 16,
    alignSelf: 'stretch',
  },
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.starlightSoft,
    marginBottom: 4,
  },
  step: { paddingVertical: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  number: {
    fontFamily: fonts.serif,
    fontSize: 16,
    color: colors.starlightSoft,
    width: 12,
  },
  label: {
    flex: 1,
    fontFamily: fonts.sans,
    fontSize: 15.5,
    color: colors.starlight,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    marginLeft: 54,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.starlight,
    borderRadius: radius.button,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13.5,
    color: colors.night,
  },
  status: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    color: colors.starlightSoft,
  },
  hint: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.starlightSoft,
    marginTop: 6,
    marginLeft: 54,
  },
  verseBox: { marginTop: 8, marginLeft: 54 },
  verse: {
    fontFamily: fonts.serifItalic,
    fontSize: 16,
    lineHeight: 24,
    color: colors.starlight,
  },
  verseRef: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.starlightSoft,
    marginTop: 6,
  },
  note: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.starlightSoft,
    marginTop: 10,
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 14,
  },
  editText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.starlightSoft,
  },
});
