import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Breathing } from '@/components/Breathing';
import { SosAllies } from '@/components/SosAllies';
import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius, shadow } from '@/constants/theme';
import { hapticTap } from '@/lib/haptics';
import { useStore } from '@/lib/store';

const VERSE = {
  text: 'Flee youthful passions; pursue righteousness, faith, love, and peace.',
  ref: '2 Timothy 2:22',
};

// A later release replaces this list with the man's own battle plan.
const MOVES = [
  { icon: 'exit-outline', label: 'Leave the room' },
  { icon: 'water-outline', label: 'Cold water on your face' },
  { icon: 'walk-outline', label: 'A short walk — the phone stays here' },
] as const;

/**
 * The Way of Escape (1 Cor 10:13). Its own tab, so it's one tap from
 * anywhere. This screen is always in Night Watch colors, even in light
 * mode — calm the body, point the eyes, open the exit. Nothing here
 * condemns; it exists to get him out.
 */
export default function SosScreen() {
  const { logVictory } = useStore();
  const [saved, setSaved] = useState(false);
  const [focused, setFocused] = useState(false);
  // Bumped on every visit so the allies card remounts fresh too.
  const [visit, setVisit] = useState(0);

  // Tabs stay mounted: once he leaves, the next visit starts fresh with the
  // "I made it through" button, never last time's victory card — and the
  // light status bar goes with him instead of lingering over cream screens.
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      setVisit((v) => v + 1);
      return () => {
        setFocused(false);
        setSaved(false);
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {focused && <StatusBar style="light" />}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Breathing period={4} depth={0.35}>
            <View style={styles.breathCircle} />
          </Breathing>
          <Text style={styles.breatheLabel}>breathe with it — in as it grows, out as it settles</Text>

          <Text style={styles.verse}>“{VERSE.text}”</Text>
          <Text style={styles.verseRef}>— {VERSE.ref}</Text>

          {/* Reaching out comes first — above the fold, before the list. */}
          <SosAllies key={visit} />

          <View style={styles.movesCard}>
            <Text style={styles.movesTitle}>the way out, in order</Text>
            {MOVES.map((move) => (
              <View key={move.label} style={styles.moveRow}>
                <Ionicons name={move.icon} size={18} color={colors.starlightSoft} />
                <Text style={styles.moveLabel}>{move.label}</Text>
              </View>
            ))}
            <Text style={styles.movesNote}>
              do one of these before you decide anything
            </Text>
          </View>

          {saved ? (
            <View style={styles.savedCard}>
              <Ionicons name="checkmark-circle" size={26} color={colors.sage} />
              <Text style={styles.savedTitle}>You made it through. That’s a real win.</Text>
              <Text style={styles.savedNote}>
                It’s written down — a victory, not a footnote.
              </Text>
              <SpringPress
                style={styles.backButton}
                onPress={() => router.navigate('/today')}>
                <Text style={styles.backButtonText}>back to today</Text>
              </SpringPress>
            </View>
          ) : (
            <SpringPress
              style={styles.madeItButton}
              onPress={() => {
                logVictory();
                hapticTap();
                setSaved(true);
              }}>
              <Ionicons name="sunny" size={18} color={colors.night} />
              <Text style={styles.madeItText}>I made it through</Text>
            </SpringPress>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.night },
  flex: { flex: 1 },
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
  savedCard: {
    alignItems: 'center',
    backgroundColor: colors.nightSoft,
    borderRadius: radius.card,
    padding: 24,
    marginTop: 30,
    alignSelf: 'stretch',
  },
  savedTitle: {
    fontFamily: fonts.serif,
    fontSize: 21,
    lineHeight: 29,
    color: colors.starlight,
    textAlign: 'center',
    marginTop: 12,
  },
  savedNote: {
    fontFamily: fonts.sans,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.starlightSoft,
    textAlign: 'center',
    marginTop: 8,
  },
  backButton: {
    backgroundColor: colors.dawn,
    borderRadius: radius.button,
    paddingVertical: 14,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 20,
  },
  backButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.night,
  },
});
