import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Breathing } from '@/components/Breathing';
import { colors, fonts, radius, shadow } from '@/constants/theme';
import { verseForToday } from '@/lib/verses';

const ARC_WIDTH = 220;

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning, brother';
  if (hour < 17) return 'Good afternoon, brother';
  return 'Good evening, brother';
}

// The sun's position along the arc tracks the real day, dawn to dusk.
function sunPosition(): number {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return (minutes / (24 * 60)) * (ARC_WIDTH - 24);
}

export default function TodayScreen() {
  const verse = verseForToday();
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.screen}>
        <Text style={styles.greeting}>{greeting()}</Text>
        <Text style={styles.date}>{dateLabel}</Text>

        <View style={styles.verseCard}>
          <Text style={styles.verseText}>“{verse.text}”</Text>
          <Text style={styles.verseRef}>— {verse.ref}</Text>
        </View>

        <View style={styles.arcSection}>
          <View style={styles.arcWrap}>
            <View style={styles.arcTrack} />
            <View style={[styles.sunDot, { left: sunPosition() }]}>
              <Ionicons name="sunny" size={18} color={colors.dawn} />
            </View>
          </View>
          <Text style={styles.arcTitle}>Day one, brother</Text>
          <Text style={styles.arcNote}>
            honest is the streak that matters — counters go live with storage (v0.2)
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.quietAction}>
            <Text style={styles.quietTitle}>log a struggle</Text>
            <Text style={styles.quietNote}>honesty, not shame · v0.2</Text>
          </View>
          <View style={[styles.quietAction, { flex: 1.15 }]}>
            <Text style={styles.quietTitle}>evening check-in</Text>
            <Text style={styles.quietNote}>30 seconds of truth · v0.2</Text>
          </View>
        </View>

        <View style={styles.spacer} />

        <Breathing period={5} depth={0.03}>
          <Pressable style={styles.sosButton} onPress={() => router.push('/sos')}>
            <Text style={styles.sosText}>I’m struggling right now</Text>
          </Pressable>
        </Breathing>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  screen: { flex: 1, paddingHorizontal: 24, paddingBottom: 12 },
  greeting: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: colors.ink,
    marginTop: 18,
  },
  date: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.inkSoft,
    marginTop: 2,
  },
  verseCard: {
    backgroundColor: colors.mist,
    borderRadius: radius.card,
    padding: 20,
    marginTop: 22,
  },
  verseText: {
    fontFamily: fonts.serifItalic,
    fontSize: 19,
    lineHeight: 28,
    color: colors.ink,
  },
  verseRef: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 10,
    textAlign: 'right',
  },
  arcSection: { alignItems: 'center', marginTop: 26 },
  arcWrap: { width: ARC_WIDTH, height: 112 },
  arcTrack: {
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
  sunDot: {
    position: 'absolute',
    bottom: -9,
  },
  arcTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.ink,
    marginTop: 6,
  },
  arcNote: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.inkSoft,
    marginTop: 4,
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
    backgroundColor: colors.mist,
    borderRadius: 18,
    padding: 16,
  },
  quietTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.ink,
  },
  quietNote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 17,
    color: colors.inkSoft,
    marginTop: 4,
  },
  spacer: { flex: 1 },
  sosButton: {
    backgroundColor: colors.ember,
    borderRadius: radius.button,
    paddingVertical: 18,
    alignItems: 'center',
    ...shadow,
  },
  sosText: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#FFF8F2',
  },
});
