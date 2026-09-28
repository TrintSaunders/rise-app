import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius } from '@/constants/theme';
import { useStore } from '@/lib/store';
import type { ThemeMode } from '@/lib/store';
import { useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

const THEME_OPTIONS: Array<{ mode: ThemeMode; label: string; note: string; icon: string }> = [
  { mode: 'auto', label: 'Follow the sun', note: 'night comes at 7pm', icon: 'partly-sunny-outline' },
  { mode: 'night', label: 'Night', note: 'held until you change it', icon: 'moon' },
  { mode: 'day', label: 'Day', note: 'held until you change it', icon: 'sunny' },
];

/**
 * The "you" screen: name, life verse, and Night Watch, edited in place and
 * saved as he types. Still no account, still nothing off this phone. The
 * footer is the whole story so far, never erased.
 */
export default function YouScreen() {
  const { data, setThemeMode, updateProfile } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);

  const [name, setName] = useState(data.profile?.name ?? '');
  const [verseText, setVerseText] = useState(data.profile?.lifeVerse?.text ?? '');
  const [verseRef, setVerseRef] = useState(data.profile?.lifeVerse?.ref ?? '');

  // Saved as he types; an empty name mid-edit keeps the last good one.
  const persist = (nextName: string, nextText: string, nextRef: string) => {
    const trimmedName = nextName.trim();
    if (!trimmedName) return;
    const lifeVerse = nextText.trim()
      ? { text: nextText.trim(), ref: nextRef.trim() || 'my life verse' }
      : null;
    updateProfile(trimmedName, lifeVerse);
  };

  const started = data.profile
    ? new Date(`${data.profile.startedOn}T12:00:00`).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;
  const story = {
    checkIns: data.days.length,
    struggles: data.temptations.filter((e) => !e.demo).length,
    falls: data.temptations.filter((e) => !e.demo && e.outcome === 'fell').length,
    rises: data.rises.filter((e) => !e.demo).length,
    victories: data.victories.filter((e) => !e.demo).length,
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>you</Text>
            <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="close">
              <Ionicons name="close" size={22} color={t.textSoft} />
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>your name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(v) => {
                setName(v);
                persist(v, verseText, verseRef);
              }}
              placeholder="your name"
              placeholderTextColor={t.textSoft}
              maxLength={40}
              returnKeyType="done"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>your life verse</Text>
            <Text style={styles.cardNote}>leave it empty and the verse of the day carries you</Text>
            <TextInput
              style={[styles.input, styles.inputTall]}
              value={verseText}
              onChangeText={(v) => {
                setVerseText(v);
                persist(name, v, verseRef);
              }}
              placeholder="e.g. His mercies are new every morning"
              placeholderTextColor={t.textSoft}
              multiline
            />
            <TextInput
              style={styles.input}
              value={verseRef}
              onChangeText={(v) => {
                setVerseRef(v);
                persist(name, verseText, v);
              }}
              placeholder="its reference, e.g. Lamentations 3:22-23"
              placeholderTextColor={t.textSoft}
              maxLength={60}
              autoCorrect={false}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>night watch</Text>
            {THEME_OPTIONS.map((option) => {
              const on = data.themeMode === option.mode;
              return (
                <SpringPress
                  key={option.mode}
                  style={[styles.themeRow, on && styles.themeRowOn]}
                  onPress={() => setThemeMode(option.mode)}>
                  <Ionicons
                    name={option.icon as 'partly-sunny-outline'}
                    size={19}
                    color={on ? t.sageText : t.textSoft}
                  />
                  <View style={styles.themeText}>
                    <Text style={[styles.themeLabel, on && { color: t.text }]}>{option.label}</Text>
                    <Text style={styles.themeNote}>{option.note}</Text>
                  </View>
                  {on && <Ionicons name="checkmark" size={18} color={t.sageText} />}
                </SpringPress>
              );
            })}
          </View>

          {started && (
            <View style={styles.storyCard}>
              <Text style={styles.cardLabel}>the story so far</Text>
              <Text style={styles.storyText}>
                You started {started}. Since then: {story.checkIns}{' '}
                {story.checkIns === 1 ? 'check-in' : 'check-ins'}, {story.struggles}{' '}
                {story.struggles === 1 ? 'struggle' : 'struggles'}, {story.falls}{' '}
                {story.falls === 1 ? 'fall' : 'falls'}, {story.rises}{' '}
                {story.rises === 1 ? 'rise' : 'rises'}, and {story.victories}{' '}
                {story.victories === 1 ? 'victory' : 'victories'}.
              </Text>
              <Text style={styles.storyNote}>Nothing is ever erased.</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.bg },
    flex: { flex: 1 },
    content: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 36 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
      minHeight: 32,
      marginBottom: 20,
    },
    title: {
      fontFamily: fonts.sansMedium,
      fontSize: 13,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: t.textSoft,
    },
    card: {
      backgroundColor: t.card,
      borderRadius: radius.card,
      padding: 18,
      marginTop: 16,
      alignSelf: 'stretch',
    },
    cardLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: t.textSoft,
      marginBottom: 6,
    },
    cardNote: {
      fontFamily: fonts.sans,
      fontSize: 12,
      lineHeight: 17,
      color: t.textSoft,
      marginBottom: 6,
    },
    input: {
      backgroundColor: t.track,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginTop: 10,
      fontFamily: fonts.sans,
      fontSize: 15.5,
      color: t.text,
    },
    inputTall: { minHeight: 84, textAlignVertical: 'top' },
    themeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 12,
      marginTop: 8,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    themeRowOn: {
      borderColor: colors.sage,
      backgroundColor: t.softSage,
    },
    themeText: { flex: 1 },
    themeLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 15,
      color: t.textSoft,
    },
    themeNote: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: t.textSoft,
      marginTop: 1,
    },
    storyCard: {
      backgroundColor: t.card,
      borderRadius: radius.card,
      padding: 18,
      marginTop: 16,
      alignSelf: 'stretch',
    },
    storyText: {
      fontFamily: fonts.sans,
      fontSize: 14,
      lineHeight: 21,
      color: t.text,
    },
    storyNote: {
      fontFamily: fonts.serifItalic,
      fontSize: 13.5,
      color: t.textSoft,
      marginTop: 10,
    },
  });
