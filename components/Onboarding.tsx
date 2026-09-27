import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Breathing } from '@/components/Breathing';
import { SpringPress } from '@/components/SpringPress';
import { StarField } from '@/components/StarField';
import { colors, fonts, radius, shadow } from '@/constants/theme';
import { useStore } from '@/lib/store';
import { useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

/**
 * First launch only — a name and (maybe) a life verse. Shown by the root
 * layout until a profile exists; from then on the Today greeting is his.
 */
export function Onboarding() {
  const { completeOnboarding } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);
  const [name, setName] = useState('');
  const [verseText, setVerseText] = useState('');
  const [verseRef, setVerseRef] = useState('');

  const begin = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const lifeVerse = verseText.trim()
      ? { text: verseText.trim(), ref: verseRef.trim() || 'my life verse' }
      : null;
    completeOnboarding(trimmed, lifeVerse);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      {t.isNight && <StarField />}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Breathing period={6} depth={0.05} style={styles.sunWrap}>
            <Ionicons name="sunny" size={42} color={colors.dawn} />
          </Breathing>
          <Text style={styles.wordmark}>Rise</Text>
          <Text style={styles.keystone}>
            “Though the righteous fall seven times, they rise again.”
          </Text>
          <Text style={styles.keystoneRef}>— Proverbs 24:16</Text>

          <View style={styles.card}>
            <Text style={styles.label}>what should we call you?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="your name"
              placeholderTextColor={t.textSoft}
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>a life verse to carry?</Text>
            <Text style={styles.labelNote}>optional — leave it blank and we’ll walk with the verse of the day</Text>
            <TextInput
              style={styles.input}
              value={verseText}
              onChangeText={setVerseText}
              placeholder="e.g. His mercies are new every morning"
              placeholderTextColor={t.textSoft}
              multiline
            />
            <TextInput
              style={[styles.input, styles.inputRef]}
              value={verseRef}
              onChangeText={setVerseRef}
              placeholder="its reference — e.g. Lamentations 3:22–23"
              placeholderTextColor={t.textSoft}
              autoCorrect={false}
            />
          </View>

          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed-outline" size={13} color={t.textSoft} />
            <Text style={styles.privacy}>
              everything stays on this device — your words never leave the phone
            </Text>
          </View>

          <SpringPress
            onPress={begin}
            disabled={!name.trim()}
            style={[styles.begin, !name.trim() && styles.beginOff]}>
            <Text style={styles.beginText}>I’m in</Text>
          </SpringPress>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.bg },
    flex: { flex: 1 },
    content: {
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 32,
    },
    sunWrap: { marginTop: 12 },
    wordmark: {
      fontFamily: fonts.serif,
      fontSize: 40,
      color: t.text,
      marginTop: 10,
    },
    keystone: {
      fontFamily: fonts.serifItalic,
      fontSize: 15,
      lineHeight: 22,
      color: t.textSoft,
      marginTop: 10,
      textAlign: 'center',
    },
    keystoneRef: {
      fontFamily: fonts.sans,
      fontSize: 12.5,
      color: t.textSoft,
      marginTop: 4,
    },
    card: {
      backgroundColor: t.card,
      borderRadius: radius.card,
      padding: 18,
      marginTop: 22,
      alignSelf: 'stretch',
    },
    label: {
      fontFamily: fonts.sansMedium,
      fontSize: 13.5,
      color: t.text,
    },
    labelNote: {
      fontFamily: fonts.sans,
      fontSize: 12,
      lineHeight: 17,
      color: t.textSoft,
      marginTop: 3,
      marginBottom: 12,
    },
    input: {
      backgroundColor: t.track,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginTop: 12,
      fontFamily: fonts.sans,
      fontSize: 15.5,
      color: t.text,
    },
    inputRef: { marginTop: 10 },
    privacyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 22,
      paddingHorizontal: 12,
    },
    privacy: {
      fontFamily: fonts.sans,
      fontSize: 11.5,
      lineHeight: 16,
      color: t.textSoft,
      flex: 1,
    },
    begin: {
      backgroundColor: colors.dawn,
      borderRadius: radius.button,
      paddingVertical: 16,
      alignItems: 'center',
      alignSelf: 'stretch',
      marginTop: 26,
      ...shadow,
    },
    beginOff: { backgroundColor: t.card },
    beginText: {
      fontFamily: fonts.sansMedium,
      fontSize: 16,
      color: colors.night,
    },
  });
