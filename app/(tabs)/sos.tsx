import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Breathing } from '@/components/Breathing';
import { SosAllies } from '@/components/SosAllies';
import { SosPlan } from '@/components/SosPlan';
import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius, shadow } from '@/constants/theme';
import { hapticTap } from '@/lib/haptics';
import { useStore } from '@/lib/store';

const VERSE = {
  text: 'Flee youthful passions; pursue righteousness, faith, love, and peace.',
  ref: '2 Timothy 2:22',
};

const ESCAPE_PROMISE = {
  text: 'God is faithful… he will also provide the way of escape.',
  ref: '1 Corinthians 10:13',
};

/**
 * The Way of Escape (1 Cor 10:13). Its own tab, so it's one tap from
 * anywhere. The tab opens on a single button; pressing it opens the help
 * itself. Today's "I'm struggling right now" (`?now=1`) skips straight to
 * the help, since he already pressed a button to get here. Nothing is
 * logged by visiting or pressing; only "I made it through" saves a victory.
 * Always in Night Watch colors: calm the body, point the eyes, open the exit.
 */
export default function SosScreen() {
  const { data, logVictory } = useStore();
  // When his plan already has a "text my allies" button, one is enough.
  const planTexts = data.allies.length > 0 && data.battlePlan.some((s) => s.kind === 'text-allies');
  const { now } = useLocalSearchParams<{ now?: string }>();
  const [engaged, setEngaged] = useState(false);
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
        setEngaged(false);
      };
    }, [])
  );

  useEffect(() => {
    if (now !== '1') return;
    setEngaged(true);
    router.setParams({ now: '' });
  }, [now]);

  if (!engaged) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        {focused && <StatusBar style="light" />}
        <View style={styles.gate}>
          <Text style={styles.gateLabel}>SOS</Text>
          <View style={styles.gateCenter}>
            <Breathing period={4} depth={0.06}>
              <SpringPress
                style={styles.gateButton}
                accessibilityLabel="I’m struggling right now"
                onPress={() => setEngaged(true)}>
                <Ionicons name="bonfire-outline" size={44} color={colors.night} />
                <Text style={styles.gateButtonText}>I’m struggling{'\n'}right now</Text>
              </SpringPress>
            </Breathing>
            <Text style={styles.gateNote}>
              Press it and we’ll walk through the next few minutes together.
              Nothing gets logged.
            </Text>
          </View>
          <Text style={styles.gateVerse}>“{ESCAPE_PROMISE.text}”</Text>
          <Text style={styles.verseRef}>{ESCAPE_PROMISE.ref}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {focused && <StatusBar style="light" />}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.helpHeader}>
            <Pressable
              hitSlop={12}
              accessibilityLabel="close"
              onPress={() => setEngaged(false)}>
              <Ionicons name="close" size={22} color={colors.starlightSoft} />
            </Pressable>
          </View>
          <Breathing period={4} depth={0.35}>
            <View style={styles.breathCircle} />
          </Breathing>
          <Text style={styles.breatheLabel}>breathe with it: in as it grows, out as it settles</Text>

          <Text style={styles.verse}>“{VERSE.text}”</Text>
          <Text style={styles.verseRef}>{VERSE.ref}</Text>

          {/* Reaching out comes first, above the fold, before the list. */}
          {!planTexts && <SosAllies key={visit} />}

          <SosPlan key={visit} />

          {saved ? (
            <View style={styles.savedCard}>
              <Ionicons name="checkmark-circle" size={26} color={colors.sage} />
              <Text style={styles.savedTitle}>You made it through. That’s a real win.</Text>
              <Text style={styles.savedNote}>
                It’s written down: a victory, not a footnote.
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
  gate: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 18,
    paddingBottom: 28,
  },
  gateLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.starlightSoft,
  },
  gateCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gateButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: colors.ember,
    shadowColor: colors.ember,
    shadowOpacity: 0.55,
    shadowRadius: 36,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
  },
  gateButtonText: {
    fontFamily: fonts.serif,
    fontSize: 21,
    lineHeight: 26,
    color: colors.night,
    textAlign: 'center',
  },
  gateNote: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.starlightSoft,
    textAlign: 'center',
    marginTop: 36,
    maxWidth: 280,
  },
  gateVerse: {
    fontFamily: fonts.serifItalic,
    fontSize: 16,
    lineHeight: 23,
    color: colors.starlight,
    textAlign: 'center',
  },
  helpHeader: { alignSelf: 'stretch', alignItems: 'flex-end', marginBottom: 4 },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 12,
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
