import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from 'react-native';

import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius } from '@/constants/theme';
import {
  BackupError,
  MIN_PASSPHRASE,
  backupFileName,
  decryptBackup,
  encryptBackup,
} from '@/lib/backup';
import { pickBackupFile, saveBackupFile } from '@/lib/backupFile';
import { useStore } from '@/lib/store';
import type { StoreData } from '@/lib/store';
import type { Theme } from '@/lib/theme';

type Mode = 'idle' | 'make' | 'restore';

const real = (d: StoreData) => ({
  checkIns: d.days.length,
  struggles: d.temptations.filter((t) => !t.demo).length,
});

/**
 * Encrypted backup on the "you & settings" screen. One file, locked with a
 * passphrase only he knows; he saves it where he likes and restores it on a
 * new phone. Restoring adds history and never erases what's already here.
 */
export function BackupCard({ t }: { t: Theme }) {
  const { data, restoreBackup } = useStore();
  const styles = useMemo(() => createStyles(t), [t]);
  const [mode, setMode] = useState<Mode>('idle');
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [file, setFile] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<{ tone: 'ok' | 'warn'; text: string } | null>(null);

  const reset = (next: Mode) => {
    setMode(next);
    setPass('');
    setConfirm('');
    setFile(null);
    setMessage(null);
  };

  const make = async () => {
    if (pass.length < MIN_PASSPHRASE) {
      setMessage({ tone: 'warn', text: `Use at least ${MIN_PASSPHRASE} characters. A short sentence works well.` });
      return;
    }
    if (pass !== confirm) {
      setMessage({ tone: 'warn', text: 'The two passphrases don’t match.' });
      return;
    }
    setBusy('Locking your backup…');
    setMessage(null);
    try {
      await saveBackupFile(backupFileName(), await encryptBackup(data, pass));
      reset('idle');
      setMessage({
        tone: 'ok',
        text: 'Backup made. Keep the passphrase somewhere safe: without it, no one can open this file, including us.',
      });
    } catch {
      setMessage({ tone: 'warn', text: 'The backup couldn’t be saved. Try again.' });
    } finally {
      setBusy(null);
    }
  };

  const choose = async () => {
    setMessage(null);
    try {
      const contents = await pickBackupFile();
      if (contents) setFile(contents);
    } catch {
      setMessage({ tone: 'warn', text: 'That file couldn’t be opened.' });
    }
  };

  const restore = async () => {
    if (!file) return;
    setBusy('Unlocking…');
    setMessage(null);
    try {
      const incoming = await decryptBackup(file, pass);
      const before = real(data);
      restoreBackup(incoming);
      const added = real(incoming);
      reset('idle');
      setMessage({
        tone: 'ok',
        text:
          before.checkIns + before.struggles === 0
            ? `Restored: ${added.checkIns} check-ins and ${added.struggles} struggles are back.`
            : 'Restored. The backup’s history was added; nothing on this phone was erased.',
      });
    } catch (e) {
      setMessage({
        tone: 'warn',
        text: e instanceof BackupError ? e.message : 'That backup couldn’t be restored.',
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>backup</Text>
      <Text style={styles.note}>
        Your story lives only on this phone. A backup is one file locked with a passphrase only
        you know. Save it to Files or iCloud Drive, and restore it on a new phone.
      </Text>

      {mode === 'idle' && (
        <View style={styles.row}>
          <SpringPress style={styles.button} onPress={() => reset('make')}>
            <Ionicons name="lock-closed-outline" size={16} color={t.text} />
            <Text style={styles.buttonText}>Make a backup</Text>
          </SpringPress>
          <SpringPress style={styles.button} onPress={() => reset('restore')}>
            <Ionicons name="refresh-outline" size={16} color={t.text} />
            <Text style={styles.buttonText}>Restore</Text>
          </SpringPress>
        </View>
      )}

      {mode === 'make' && (
        <View>
          <TextInput
            style={styles.input}
            value={pass}
            onChangeText={setPass}
            placeholder="choose a passphrase"
            placeholderTextColor={t.textSoft}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="backup passphrase"
          />
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="type it again"
            placeholderTextColor={t.textSoft}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="confirm backup passphrase"
          />
          <Text style={styles.small}>
            There’s no way to recover a forgotten passphrase. That’s what keeps the file private.
          </Text>
          <View style={styles.row}>
            <SpringPress style={styles.primary} disabled={!!busy} onPress={make}>
              <Text style={styles.primaryText}>Lock and save</Text>
            </SpringPress>
            <SpringPress style={styles.button} disabled={!!busy} onPress={() => reset('idle')}>
              <Text style={styles.buttonText}>Cancel</Text>
            </SpringPress>
          </View>
        </View>
      )}

      {mode === 'restore' && (
        <View>
          {!file ? (
            <SpringPress style={[styles.button, styles.wide]} onPress={choose}>
              <Ionicons name="document-outline" size={16} color={t.text} />
              <Text style={styles.buttonText}>Choose the backup file</Text>
            </SpringPress>
          ) : (
            <>
              <Text style={styles.small}>Backup file chosen. Enter its passphrase.</Text>
              <TextInput
                style={styles.input}
                value={pass}
                onChangeText={setPass}
                placeholder="the backup’s passphrase"
                placeholderTextColor={t.textSoft}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                accessibilityLabel="backup passphrase"
              />
            </>
          )}
          <Text style={styles.small}>Restoring adds the backup’s history. Nothing here is erased.</Text>
          <View style={styles.row}>
            {file && (
              <SpringPress style={styles.primary} disabled={!!busy || !pass} onPress={restore}>
                <Text style={styles.primaryText}>Unlock and restore</Text>
              </SpringPress>
            )}
            <SpringPress style={styles.button} disabled={!!busy} onPress={() => reset('idle')}>
              <Text style={styles.buttonText}>Cancel</Text>
            </SpringPress>
          </View>
        </View>
      )}

      {busy && (
        <View style={styles.busy} accessibilityLiveRegion="polite">
          <ActivityIndicator color={t.textSoft} />
          <Text style={styles.small}>{busy}</Text>
        </View>
      )}
      {message && (
        <Text
          style={[styles.message, message.tone === 'warn' && styles.warn]}
          accessibilityLiveRegion="polite">
          {message.text}
        </Text>
      )}
    </View>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.card,
      borderRadius: radius.card,
      padding: 18,
      marginTop: 16,
      alignSelf: 'stretch',
    },
    label: {
      fontFamily: fonts.sansMedium,
      fontSize: 12,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: t.textSoft,
      marginBottom: 6,
    },
    note: {
      fontFamily: fonts.sans,
      fontSize: 13,
      lineHeight: 19,
      color: t.textSoft,
    },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14 },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: radius.button,
      borderWidth: 1,
      borderColor: t.track,
      backgroundColor: t.track,
      paddingVertical: 11,
      paddingHorizontal: 16,
    },
    wide: { marginTop: 14, alignSelf: 'flex-start' },
    buttonText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: t.text,
    },
    primary: {
      backgroundColor: colors.dawn,
      borderRadius: radius.button,
      paddingVertical: 11,
      paddingHorizontal: 18,
    },
    primaryText: {
      fontFamily: fonts.sansMedium,
      fontSize: 14,
      color: colors.night,
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
    small: {
      fontFamily: fonts.sans,
      fontSize: 12,
      lineHeight: 17,
      color: t.textSoft,
      marginTop: 10,
    },
    busy: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
    message: {
      fontFamily: fonts.sans,
      fontSize: 13,
      lineHeight: 19,
      color: t.sageText,
      marginTop: 12,
    },
    warn: { color: colors.ember },
  });
