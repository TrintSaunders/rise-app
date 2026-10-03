import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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

import { MemoryGate } from '@/components/MemoryGate';
import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius } from '@/constants/theme';
import { decodeFolder } from '@/lib/memory';
import { useStore } from '@/lib/store';
import { useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

export default function ImportScreen() {
  return (
    <MemoryGate>
      <Import />
    </MemoryGate>
  );
}

/**
 * A friend's folder arrives: from the link in their message (`?code=`), or
 * pasted by hand. He sees exactly what's in it before it's added — nothing
 * lands in his Armory unasked.
 */
function Import() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const { createFolder } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);
  const [pasted, setPasted] = useState('');

  const input = code ? `?code=${code}` : pasted;
  const shared = input.trim() ? decodeFolder(input) : null;
  const unreadable = input.trim().length > 0 && !shared;

  const add = () => {
    if (!shared) return;
    const id = createFolder(shared.name, shared.verses, shared.from);
    router.replace({ pathname: '/memory/folder/[id]', params: { id } });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/armory'))}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="back">
              <Ionicons name="chevron-back" size={22} color={t.textSoft} />
            </Pressable>
            <Text style={styles.headerLabel}>a friend’s folder</Text>
            <View style={styles.headerSpacer} />
          </View>

          {!code && (
            <>
              <Text style={styles.title}>Memorize together</Text>
              <Text style={styles.body}>
                When a friend shares a folder, the link opens here. If it didn’t, paste
                their whole message below.
              </Text>
              <TextInput
                style={styles.input}
                value={pasted}
                onChangeText={setPasted}
                placeholder="paste the message or link"
                placeholderTextColor={t.textSoft}
                multiline
                autoCorrect={false}
                autoCapitalize="none"
              />
            </>
          )}

          {unreadable && (
            <Text style={styles.body}>
              That doesn’t look like a Rise folder. Ask them to share it again: the
              whole message, link included.
            </Text>
          )}

          {shared && (
            <View>
              <Text style={styles.title}>{shared.name}</Text>
              <Text style={styles.from}>
                {shared.from ? `from ${shared.from}` : 'shared with you'} ·{' '}
                {shared.verses.length} verse{shared.verses.length === 1 ? '' : 's'}
              </Text>
              {shared.verses.map((verse) => (
                <View key={verse.ref} style={styles.verseCard}>
                  <Text style={styles.verseRef}>{verse.ref}</Text>
                  <Text style={styles.verseText} numberOfLines={3}>
                    “{verse.text}”
                  </Text>
                </View>
              ))}
              <SpringPress style={styles.primary} onPress={add}>
                <Text style={styles.primaryText}>add to my folders</Text>
              </SpringPress>
              <Text style={styles.note}>
                Your progress stays on your phone. Tell each other how it’s going.
              </Text>
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
    body: {
      fontFamily: fonts.sans,
      fontSize: 14.5,
      lineHeight: 21,
      color: t.textSoft,
      marginTop: 10,
    },
    input: {
      backgroundColor: t.card,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 110,
      fontFamily: fonts.sans,
      fontSize: 14,
      color: t.text,
      textAlignVertical: 'top',
      marginTop: 18,
      marginBottom: 20,
    },
    from: {
      fontFamily: fonts.sans,
      fontSize: 13.5,
      color: t.sageText,
      marginTop: 4,
      marginBottom: 16,
    },
    verseCard: {
      backgroundColor: t.card,
      borderRadius: 18,
      padding: 16,
      marginBottom: 10,
    },
    verseRef: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: t.text,
    },
    verseText: {
      fontFamily: fonts.serifItalic,
      fontSize: 15,
      lineHeight: 22,
      color: t.text,
      marginTop: 6,
    },
    primary: {
      backgroundColor: colors.dawn,
      borderRadius: radius.button,
      paddingVertical: 15,
      alignItems: 'center',
      marginTop: 14,
    },
    primaryText: {
      fontFamily: fonts.sansMedium,
      fontSize: 15.5,
      color: colors.night,
    },
    note: {
      fontFamily: fonts.sans,
      fontSize: 12,
      lineHeight: 17,
      color: t.textSoft,
      textAlign: 'center',
      marginTop: 12,
    },
  });
