import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MemoryGate } from '@/components/MemoryGate';
import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius } from '@/constants/theme';
import { setVerses, suggestedSet } from '@/lib/memory';
import { useStore } from '@/lib/store';
import { useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

/**
 * A suggested set. On its own it becomes a whole folder in one tap;
 * opened from a folder (`addTo`) each verse can be added one at a time.
 */
export default function SuggestedSetScreen() {
  return (
    <MemoryGate>
      <SuggestedSet />
    </MemoryGate>
  );
}

function SuggestedSet() {
  const { id, addTo } = useLocalSearchParams<{ id: string; addTo?: string }>();
  const { data, createFolder, addVersesToFolder, removeVerseFromFolder } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);

  const set = suggestedSet(id);
  const target = addTo ? data.memory.folders.find((f) => f.id === addTo) : undefined;

  if (!set) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.missing}>That set isn’t here anymore.</Text>
      </SafeAreaView>
    );
  }

  const inTarget = new Set(target?.verses.map((v) => v.ref) ?? []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={t.textSoft} />
          </Pressable>
          <Text style={styles.headerLabel}>
            {target ? `adding to ${target.name}` : set.subtitle}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.title}>{set.title}</Text>

        {!target && (
          <SpringPress
            style={styles.primary}
            onPress={() => {
              const folderId = createFolder(set.title, setVerses(set));
              router.replace({ pathname: '/memory/folder/[id]', params: { id: folderId } });
            }}>
            <Text style={styles.primaryText}>make it a folder</Text>
          </SpringPress>
        )}

        {set.sections.map((section, i) => (
          <View key={section.heading ?? i} style={styles.section}>
            {section.heading && <Text style={styles.sectionHeading}>{section.heading}</Text>}
            {section.verses.map((verse) => {
              const added = inTarget.has(verse.ref);
              return (
                <View key={verse.ref} style={styles.verseCard}>
                  <View style={styles.verseTop}>
                    <Text style={styles.verseRef}>
                      {verse.ref}
                      <Text style={styles.translation}> {verse.translation}</Text>
                    </Text>
                    {target && (
                      <SpringPress
                        hitSlop={8}
                        accessibilityLabel={added ? `remove ${verse.ref}` : `add ${verse.ref}`}
                        onPress={() =>
                          added
                            ? removeVerseFromFolder(target.id, verse.ref)
                            : addVersesToFolder(target.id, [verse])
                        }>
                        <Ionicons
                          name={added ? 'checkmark-circle' : 'add-circle-outline'}
                          size={24}
                          color={added ? t.sageText : t.textSoft}
                        />
                      </SpringPress>
                    )}
                  </View>
                  <Text style={styles.verseText}>“{verse.text}”</Text>
                </View>
              );
            })}
          </View>
        ))}

        {target && (
          <SpringPress style={styles.primary} onPress={() => router.back()}>
            <Text style={styles.primaryText}>done</Text>
          </SpringPress>
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
      marginBottom: 14,
    },
    headerLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: t.textSoft,
    },
    headerSpacer: { width: 22 },
    title: {
      fontFamily: fonts.serif,
      fontSize: 28,
      color: t.text,
    },
    missing: {
      fontFamily: fonts.sans,
      fontSize: 15,
      color: t.textSoft,
      textAlign: 'center',
      marginTop: 60,
    },
    primary: {
      backgroundColor: colors.dawn,
      borderRadius: radius.button,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 20,
    },
    primaryText: {
      fontFamily: fonts.sansMedium,
      fontSize: 15.5,
      color: colors.night,
    },
    section: { marginTop: 22 },
    sectionHeading: {
      fontFamily: fonts.sansMedium,
      fontSize: 11.5,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: t.textSoft,
      marginBottom: 8,
    },
    verseCard: {
      backgroundColor: t.card,
      borderRadius: 18,
      padding: 16,
      marginBottom: 10,
    },
    verseTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
    },
    verseRef: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: t.text,
    },
    translation: {
      fontFamily: fonts.sans,
      fontSize: 11,
      color: t.textSoft,
    },
    verseText: {
      fontFamily: fonts.serifItalic,
      fontSize: 16,
      lineHeight: 24,
      color: t.text,
      marginTop: 8,
    },
  });
