import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Reveal } from '@/components/Reveal';
import { SpringPress } from '@/components/SpringPress';
import { StarField } from '@/components/StarField';
import { colors, fonts, radius } from '@/constants/theme';
import { SUGGESTED_SETS, dueVerses, isMemorized, setVerses } from '@/lib/memory';
import { todayStr, useStore } from '@/lib/store';
import { useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

const HEART_VERSE = {
  text: 'I have stored up your word in my heart, that I might not sin against you.',
  ref: 'Psalm 119:11',
};

/**
 * The Armory's verse memory (behind `flags.armoryMemory`). Fill the mind,
 * don't just fence it: today's review, his folders — some shared with
 * friends — and suggested sets to start from.
 */
export function ArmoryMemory() {
  const { data, createFolder } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);
  const [naming, setNaming] = useState(false);
  const [folderName, setFolderName] = useState('');

  const { memory } = data;
  const today = todayStr();
  const due = dueVerses(memory, today);
  const hasVerses = memory.folders.some((f) => f.verses.length > 0);

  const makeFolder = () => {
    if (!folderName.trim()) return;
    const id = createFolder(folderName);
    setFolderName('');
    setNaming(false);
    router.push({ pathname: '/memory/folder/[id]', params: { id } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      {t.isNight && <StarField />}
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.heading}>Armory</Text>
        <Text style={styles.subtitle}>hide the word where temptation can’t take it</Text>

        <Reveal delay={0} style={styles.reviewCard}>
          <Text style={styles.verse}>“{HEART_VERSE.text}”</Text>
          <Text style={styles.verseRef}>— {HEART_VERSE.ref}</Text>
          {due.length > 0 ? (
            <SpringPress style={styles.reviewButton} onPress={() => router.push('/memory/review')}>
              <Text style={styles.reviewButtonText}>
                review {due.length} verse{due.length === 1 ? '' : 's'}
              </Text>
            </SpringPress>
          ) : (
            <Text style={styles.reviewNote}>
              {hasVerses
                ? 'all caught up today — the verses are resting where they belong'
                : 'start with a set below, or make a folder of your own'}
            </Text>
          )}
        </Reveal>

        <Reveal delay={70} style={styles.section}>
          <Text style={styles.sectionLabel}>your folders</Text>
          {memory.folders.map((folder) => {
            const held = folder.verses.filter((v) => isMemorized(memory.progress[v.ref])).length;
            return (
              <SpringPress
                key={folder.id}
                style={styles.folderCard}
                onPress={() =>
                  router.push({ pathname: '/memory/folder/[id]', params: { id: folder.id } })
                }>
                <Ionicons
                  name={folder.sharedBy ? 'people-outline' : 'folder-open-outline'}
                  size={20}
                  color={t.textSoft}
                />
                <View style={styles.folderText}>
                  <Text style={styles.folderName}>{folder.name}</Text>
                  <Text style={styles.folderMeta}>
                    {held} of {folder.verses.length} memorized
                    {folder.sharedBy ? ` · with ${folder.sharedBy}` : ''}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={t.textSoft} />
              </SpringPress>
            );
          })}

          {naming ? (
            <View style={styles.nameRow}>
              <TextInput
                style={styles.nameInput}
                value={folderName}
                onChangeText={setFolderName}
                placeholder="name it — e.g. late-night verses"
                placeholderTextColor={t.textSoft}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={makeFolder}
                maxLength={60}
              />
              <SpringPress style={styles.nameButton} onPress={makeFolder}>
                <Text style={styles.nameButtonText}>make it</Text>
              </SpringPress>
            </View>
          ) : (
            <View style={styles.folderActions}>
              <SpringPress style={styles.quietButton} onPress={() => setNaming(true)}>
                <Ionicons name="add" size={17} color={t.text} />
                <Text style={styles.quietButtonText}>new folder</Text>
              </SpringPress>
              <SpringPress style={styles.quietButton} onPress={() => router.push('/memory/import')}>
                <Ionicons name="people-outline" size={16} color={t.text} />
                <Text style={styles.quietButtonText}>add a friend’s</Text>
              </SpringPress>
            </View>
          )}
        </Reveal>

        <Reveal delay={140} style={styles.section}>
          <Text style={styles.sectionLabel}>suggested</Text>
          {SUGGESTED_SETS.map((set, i) => (
            <SpringPress
              key={set.id}
              style={[styles.setCard, i === 0 && styles.setCardFirst]}
              onPress={() => router.push({ pathname: '/memory/set/[id]', params: { id: set.id } })}>
              <View style={styles.folderText}>
                <Text style={styles.setTitle}>{set.title}</Text>
                <Text style={styles.folderMeta}>
                  {set.subtitle} · {setVerses(set).length} verses
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={t.textSoft} />
            </SpringPress>
          ))}
        </Reveal>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.bg },
    content: { paddingHorizontal: 24, paddingBottom: 32 },
    heading: {
      fontFamily: fonts.serif,
      fontSize: 34,
      color: t.text,
      marginTop: 18,
    },
    subtitle: {
      fontFamily: fonts.sans,
      fontSize: 14,
      color: t.textSoft,
      marginTop: 2,
    },
    reviewCard: {
      backgroundColor: t.card,
      borderRadius: radius.card,
      padding: 22,
      marginTop: 22,
      alignItems: 'center',
    },
    verse: {
      fontFamily: fonts.serifItalic,
      fontSize: 19,
      lineHeight: 28,
      color: t.text,
      textAlign: 'center',
    },
    verseRef: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: t.textSoft,
      marginTop: 10,
    },
    reviewButton: {
      backgroundColor: colors.dawn,
      borderRadius: radius.button,
      paddingVertical: 14,
      alignItems: 'center',
      alignSelf: 'stretch',
      marginTop: 18,
    },
    reviewButtonText: {
      fontFamily: fonts.sansMedium,
      fontSize: 15.5,
      color: colors.night,
    },
    reviewNote: {
      fontFamily: fonts.sans,
      fontSize: 12.5,
      lineHeight: 18,
      color: t.textSoft,
      textAlign: 'center',
      marginTop: 14,
    },
    section: { marginTop: 28 },
    sectionLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 11.5,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: t.textSoft,
      marginBottom: 10,
    },
    folderCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: t.card,
      borderRadius: 18,
      padding: 16,
      marginBottom: 10,
    },
    folderText: { flex: 1 },
    folderName: {
      fontFamily: fonts.sansMedium,
      fontSize: 15.5,
      color: t.text,
    },
    folderMeta: {
      fontFamily: fonts.sans,
      fontSize: 12.5,
      color: t.textSoft,
      marginTop: 3,
    },
    folderActions: { flexDirection: 'row', gap: 10 },
    quietButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: radius.button,
      borderWidth: 1,
      borderColor: t.card,
      paddingVertical: 12,
    },
    quietButtonText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: t.text,
    },
    nameRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
    nameInput: {
      flex: 1,
      backgroundColor: t.card,
      borderRadius: radius.button,
      paddingHorizontal: 18,
      paddingVertical: 12,
      fontFamily: fonts.sans,
      fontSize: 15,
      color: t.text,
    },
    nameButton: {
      backgroundColor: colors.dawn,
      borderRadius: radius.button,
      paddingHorizontal: 18,
      paddingVertical: 12,
    },
    nameButtonText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14.5,
      color: colors.night,
    },
    setCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: t.card,
      borderRadius: 18,
      padding: 16,
      marginBottom: 10,
    },
    setCardFirst: { backgroundColor: t.softSage },
    setTitle: {
      fontFamily: fonts.serif,
      fontSize: 17,
      color: t.text,
    },
  });
