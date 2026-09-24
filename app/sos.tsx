import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Breathing } from '@/components/Breathing';
import { colors, fonts, radius, shadow } from '@/constants/theme';

const VERSE = {
  text: 'Flee youthful passions; pursue righteousness, faith, love, and peace.',
  ref: '2 Timothy 2:22',
};

// v0.3 (Brotherhood) replaces this list with the man's own battle plan
// and his brother's real name and number.
const MOVES = [
  { icon: 'exit-outline', label: 'Leave the room' },
  { icon: 'water-outline', label: 'Cold water on your face' },
  { icon: 'walk-outline', label: 'A short walk — the phone stays here' },
] as const;

/**
 * The Way of Escape (1 Cor 10:13). This screen is always in Night Watch
 * colors, even in light mode — calm the body, point the eyes, open the exit.
 * Nothing here condemns; it exists to get him out.
 */
export default function SosScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Breathing period={4} depth={0.35}>
          <View style={styles.breathCircle} />
        </Breathing>
        <Text style={styles.breatheLabel}>breathe with it — in as it grows, out as it settles</Text>

        <Text style={styles.verse}>“{VERSE.text}”</Text>
        <Text style={styles.verseRef}>— {VERSE.ref}</Text>

        <View style={styles.movesCard}>
          <Text style={styles.movesTitle}>the way out, in order</Text>
          {MOVES.map((move) => (
            <View key={move.label} style={styles.moveRow}>
              <Ionicons name={move.icon} size={18} color={colors.starlightSoft} />
              <Text style={styles.moveLabel}>{move.label}</Text>
            </View>
          ))}
          <Text style={styles.movesNote}>
            your brother’s name and number appear here in v0.3
          </Text>
        </View>

        <Pressable style={styles.madeItButton} onPress={() => router.back()}>
          <Ionicons name="sunny" size={18} color={colors.night} />
          <Text style={styles.madeItText}>I made it through</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.night },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  breathCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(224, 122, 95, 0.9)',
    shadowColor: colors.ember,
    shadowOpacity: 0.6,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  breatheLabel: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.starlightSoft,
    marginTop: 20,
    textAlign: 'center',
  },
  verse: {
    fontFamily: fonts.serifItalic,
    fontSize: 20,
    lineHeight: 29,
    color: colors.starlight,
    marginTop: 28,
    textAlign: 'center',
  },
  verseRef: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.starlightSoft,
    marginTop: 8,
  },
  movesCard: {
    backgroundColor: colors.nightSoft,
    borderRadius: radius.card,
    padding: 20,
    marginTop: 30,
    alignSelf: 'stretch',
  },
  movesTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.starlightSoft,
    marginBottom: 6,
  },
  moveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  moveLabel: {
    fontFamily: fonts.sans,
    fontSize: 15.5,
    color: colors.starlight,
  },
  movesNote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.starlightSoft,
    marginTop: 10,
  },
  madeItButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.dawn,
    borderRadius: radius.button,
    paddingVertical: 16,
    paddingHorizontal: 28,
    marginTop: 30,
    ...shadow,
  },
  madeItText: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.night,
  },
});
