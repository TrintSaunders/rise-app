import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MemoryGate } from '@/components/MemoryGate';
import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius } from '@/constants/theme';
import {
  MEMORIZED_BOX,
  SUGGESTED_SETS,
  dueVerses,
  encodeFolder,
  progressMessage,
  shareMessage,
} from '@/lib/memory';
import { todayStr, useStore } from '@/lib/store';
import { useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

export default function FolderScreen() {
  return (
    <MemoryGate>
      <Folder />
    </MemoryGate>
  );
}

/**
 * One memory folder: practice it, share it with a friend so you memorize
 * the same verses together, and shape what's in it.
 */
function Folder() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, addVersesToFolder, removeVerseFromFolder, deleteFolder, renameFolder } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);
  const [ref, setRef] = useState('');
  const [text, setText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Tap the folder's name to fix a misspelling; empty reverts to the old name.
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  // Where the system share sheet isn't available (some browsers), show the
  // message so it can be copied by hand.
  const [manualShare, setManualShare] = useState<string | null>(null);

  const folder = data.memory.folders.find((f) => f.id === id);
  if (!folder) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.missing}>This folder is gone.</Text>
        <SpringPress style={styles.quietButton} onPress={() => router.back()}>
          <Text style={styles.quietButtonText}>back to the Armory</Text>
        </SpringPress>
      </SafeAreaView>
    );
  }

  const name = data.profile?.name?.trim() || null;
  const due = dueVerses(data.memory, todayStr(), folder.id);

  const startRename = () => {
    setNameDraft(folder!.name);
    setEditingName(true);
  };
  const saveName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== folder!.name) renameFolder(folder!.id, trimmed);
    setEditingName(false);
  };

  const share = async (message: string) => {
    try {
      await Share.share({ message });
    } catch {
      setManualShare(message);
    }
  };

  const shareFolder = () => {
    const link = Linking.createURL('/memory/import', {
      queryParams: { code: encodeFolder(folder, name) },
    });
    share(shareMessage(folder, name, link));
  };

  const addOwn = () => {
    if (!ref.trim() || !text.trim()) return;
    addVersesToFolder(folder.id, [
      { ref: ref.trim(), text: text.trim(), translation: 'custom' },
    ]);
    setRef('');
    setText('');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Ionicons name="chevron-back" size={22} color={t.textSoft} />
            </Pressable>
            <Text style={styles.headerLabel}>memory folder</Text>
            <View style={styles.headerSpacer} />
          </View>

          {editingName ? (
            <View style={styles.renameRow}>
              <TextInput
                style={styles.titleInput}
                value={nameDraft}
                onChangeText={setNameDraft}
                autoFocus
                maxLength={60}
                returnKeyType="done"
                onSubmitEditing={saveName}
                onBlur={saveName}
                placeholder="folder name"
                placeholderTextColor={t.textSoft}
              />
              <SpringPress style={styles.renameSave} onPress={saveName} hitSlop={8}>
                <Ionicons name="checkmark" size={22} color={t.sageText} />
              </SpringPress>
            </View>
          ) : (
            <Pressable
              style={styles.titleRow}
              onPress={startRename}
              hitSlop={6}
              accessibilityLabel="rename folder">
              <Text style={styles.title}>{folder.name}</Text>
              <Ionicons name="create-outline" size={17} color={t.textSoft} />
            </Pressable>
          )}
          {folder.sharedBy && (
            <Text style={styles.sharedBy}>memorizing together with {folder.sharedBy}</Text>
          )}

          {folder.verses.length > 0 && (
            <SpringPress
              style={styles.primary}
              onPress={() =>
                router.push({ pathname: '/memory/review', params: { folder: folder.id } })
              }>
              <Text style={styles.primaryText}>
                {due.length > 0
                  ? `review ${due.length} due`
                  : 'practice anyway (nothing due)'}
              </Text>
            </SpringPress>
          )}

          <View style={styles.shareRow}>
            <SpringPress style={styles.quietButton} onPress={shareFolder}>
              <Ionicons name="share-outline" size={16} color={t.text} />
              <Text style={styles.quietButtonText}>share with a friend</Text>
            </SpringPress>
            {folder.verses.length > 0 && (
              <SpringPress
                style={styles.quietButton}
                onPress={() => share(progressMessage(folder, data.memory))}>
                <Ionicons name="chatbubble-outline" size={15} color={t.text} />
                <Text style={styles.quietButtonText}>share progress</Text>
              </SpringPress>
            )}
          </View>
          <Text style={styles.note}>
            Your friend gets their own copy. Progress stays on each phone, and you
            tell each other how it’s going.
          </Text>

          {manualShare && (
            <View style={styles.manualCard}>
              <Text style={styles.manualLabel}>copy this and send it</Text>
              <Text selectable style={styles.manualText}>
                {manualShare}
              </Text>
            </View>
          )}

          <Text style={styles.sectionLabel}>
            {folder.verses.length} verse{folder.verses.length === 1 ? '' : 's'}
          </Text>
          {folder.verses.map((verse) => {
            const box = data.memory.progress[verse.ref]?.box ?? 0;
            return (
              <View key={verse.ref} style={styles.verseCard}>
                <View style={styles.verseTop}>
                  <Text style={styles.verseRef}>{verse.ref}</Text>
                  <View style={styles.dots}>
                    {Array.from({ length: MEMORIZED_BOX }, (_, i) => (
                      <View key={i} style={[styles.dot, i < box && styles.dotOn]} />
                    ))}
                  </View>
                  <Pressable
                    hitSlop={10}
                    accessibilityLabel={`remove ${verse.ref}`}
                    onPress={() => removeVerseFromFolder(folder.id, verse.ref)}>
                    <Ionicons name="close" size={17} color={t.textSoft} />
                  </Pressable>
                </View>
                <Text style={styles.verseText} numberOfLines={3}>
                  “{verse.text}”
                </Text>
              </View>
            );
          })}

          <Text style={styles.sectionLabel}>add from a suggested set</Text>
          <View style={styles.chipRow}>
            {SUGGESTED_SETS.map((set) => (
              <SpringPress
                key={set.id}
                style={styles.chip}
                onPress={() =>
                  router.push({
                    pathname: '/memory/set/[id]',
                    params: { id: set.id, addTo: folder.id },
                  })
                }>
                <Text style={styles.chipText}>{set.title}</Text>
              </SpringPress>
            ))}
          </View>

          <Text style={styles.sectionLabel}>or write your own</Text>
          <TextInput
            style={styles.input}
            value={ref}
            onChangeText={setRef}
            placeholder="reference, like Romans 8:1"
            placeholderTextColor={t.textSoft}
            maxLength={40}
          />
          <TextInput
            style={[styles.input, styles.inputTall]}
            value={text}
            onChangeText={setText}
            placeholder="the verse, in the translation you’re learning"
            placeholderTextColor={t.textSoft}
            multiline
            maxLength={600}
          />
          <SpringPress
            style={[styles.quietButton, styles.addButton]}
            disabled={!ref.trim() || !text.trim()}
            onPress={addOwn}>
            <Ionicons name="add" size={17} color={t.text} />
            <Text style={styles.quietButtonText}>add verse</Text>
          </SpringPress>

          <Pressable
            style={styles.deleteLink}
            onPress={() => {
              if (!confirmDelete) {
                setConfirmDelete(true);
                return;
              }
              deleteFolder(folder.id);
              router.back();
            }}>
            <Text style={styles.deleteText}>
              {confirmDelete
                ? 'tap again to delete. Verses you’ve learned stay learned.'
                : 'delete this folder'}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: t.bg },
    flex: { flex: 1 },
    content: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 40 },
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
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      alignSelf: 'flex-start',
      paddingVertical: 2,
    },
    renameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      alignSelf: 'stretch',
      marginTop: 2,
      marginBottom: 2,
    },
    titleInput: {
      flex: 1,
      backgroundColor: t.track,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 8,
      fontFamily: fonts.serif,
      fontSize: 22,
      color: t.text,
    },
    renameSave: { padding: 6 },
    sharedBy: {
      fontFamily: fonts.sans,
      fontSize: 13.5,
      color: t.sageText,
      marginTop: 4,
    },
    missing: {
      fontFamily: fonts.sans,
      fontSize: 15,
      color: t.textSoft,
      textAlign: 'center',
      marginTop: 60,
      marginBottom: 20,
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
    shareRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
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
      paddingHorizontal: 10,
    },
    quietButtonText: {
      fontFamily: fonts.sansMedium,
      fontSize: 13.5,
      color: t.text,
    },
    note: {
      fontFamily: fonts.sans,
      fontSize: 12,
      lineHeight: 17,
      color: t.textSoft,
      marginTop: 10,
    },
    manualCard: {
      backgroundColor: t.card,
      borderRadius: 18,
      padding: 16,
      marginTop: 12,
    },
    manualLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 11.5,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: t.textSoft,
      marginBottom: 6,
    },
    manualText: {
      fontFamily: fonts.sans,
      fontSize: 13,
      lineHeight: 19,
      color: t.text,
    },
    sectionLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 11.5,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: t.textSoft,
      marginTop: 28,
      marginBottom: 10,
    },
    verseCard: {
      backgroundColor: t.card,
      borderRadius: 18,
      padding: 16,
      marginBottom: 10,
    },
    verseTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    verseRef: {
      flex: 1,
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: t.text,
    },
    dots: { flexDirection: 'row', gap: 4 },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: t.textSoft,
      opacity: 0.25,
    },
    dotOn: { backgroundColor: colors.dawn, opacity: 1 },
    verseText: {
      fontFamily: fonts.serifItalic,
      fontSize: 15,
      lineHeight: 22,
      color: t.text,
      marginTop: 8,
    },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      backgroundColor: t.card,
      borderRadius: radius.button,
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    chipText: {
      fontFamily: fonts.sans,
      fontSize: 13.5,
      color: t.text,
    },
    input: {
      backgroundColor: t.card,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontFamily: fonts.sans,
      fontSize: 15,
      color: t.text,
      marginBottom: 10,
    },
    inputTall: { minHeight: 90, textAlignVertical: 'top' },
    addButton: { flex: 0 },
    deleteLink: { alignItems: 'center', marginTop: 34 },
    deleteText: {
      fontFamily: fonts.sans,
      fontSize: 13,
      color: t.textSoft,
    },
  });
