import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius } from '@/constants/theme';
import { LOCAL_MESSAGE, alertAllies, cleanPhone, formatPhone } from '@/lib/allyAlert';
import type { AlertOutcome } from '@/lib/allyAlert';
import { useStore } from '@/lib/store';

const MAX_ALLIES = 5;

const OUTCOME_NOTE: Record<Exclude<AlertOutcome, 'unavailable'>, string> = {
  sent: 'Sent. You’re not fighting this alone.',
  opened: 'Your message is ready. Tap Send.',
  cancelled: 'Not sent, and that’s okay. It’s here whenever you need it.',
};

/**
 * "Tell my allies" on the SOS tab. Only one thing is ever said: he's being
 * tempted right now. Allies live on this phone alone, added right here.
 */
export function SosAllies() {
  const { data, addAlly, removeAlly } = useStore();
  const { allies } = data;
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState<AlertOutcome | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  // With no allies yet, the button still shows; tapping it opens the form.
  const [settingUp, setSettingUp] = useState(false);

  const firstName = data.profile?.name?.trim().split(/\s+/)[0] ?? '';
  const showForm = editing || (allies.length === 0 && settingUp);

  const tell = async () => {
    if (allies.length === 0) {
      setSettingUp(true);
      return;
    }
    setSending(true);
    try {
      setOutcome(await alertAllies(allies, firstName));
    } finally {
      setSending(false);
    }
  };

  const add = () => {
    const cleaned = cleanPhone(phone);
    if (!name.trim() || !cleaned) {
      setPhoneError(!cleaned);
      return;
    }
    addAlly(name, cleaned);
    setName('');
    setPhone('');
    setPhoneError(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>your allies</Text>
        {allies.length > 0 && (
          <Pressable onPress={() => setEditing((e) => !e)} hitSlop={10}>
            <Text style={styles.editLink}>{editing ? 'done' : 'edit'}</Text>
          </Pressable>
        )}
      </View>

      {!editing && (
        <>
          <SpringPress style={styles.tellButton} disabled={sending} onPress={tell}>
            <Ionicons name="people" size={18} color={colors.night} />
            <Text style={styles.tellText}>tell my allies I’m tempted</Text>
          </SpringPress>
          {outcome !== 'unavailable' && (
            <Text style={styles.note}>
              {allies.length === 0
                ? settingUp
                  ? 'Add someone who’ll pray when you text. Then this button reaches them in one tap.'
                  : 'No allies yet. Tap to add someone who’ll pray when you text.'
                : outcome
                  ? OUTCOME_NOTE[outcome]
                  : `${allies.map((a) => a.name).join(', ')}. They’ll hear only that you’re being tempted, never why.`}
            </Text>
          )}
          {outcome === 'unavailable' && (
            <View style={styles.manual}>
              <Text style={styles.note}>
                Texting isn’t available on this device. Send this to{' '}
                {allies.map((a) => `${a.name} at ${formatPhone(a.phone)}`).join(', ')}:
              </Text>
              <Text selectable style={styles.manualText}>
                {LOCAL_MESSAGE}
              </Text>
            </View>
          )}
        </>
      )}

      {editing &&
        allies.map((ally) => (
          <View key={ally.id} style={styles.allyRow}>
            <Text style={styles.allyText}>
              {ally.name}  <Text style={styles.allyPhone}>{formatPhone(ally.phone)}</Text>
            </Text>
            <Pressable
              hitSlop={10}
              accessibilityLabel={`remove ${ally.name}`}
              onPress={() => removeAlly(ally.id)}>
              <Ionicons name="close" size={18} color={colors.starlightSoft} />
            </Pressable>
          </View>
        ))}

      {showForm && allies.length < MAX_ALLIES && (
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="name"
            placeholderTextColor={colors.starlightSoft}
            maxLength={30}
          />
          <TextInput
            style={[styles.input, phoneError && styles.inputError]}
            value={phone}
            onChangeText={(v) => {
              setPhone(v);
              setPhoneError(false);
            }}
            placeholder="phone number"
            placeholderTextColor={colors.starlightSoft}
            keyboardType="phone-pad"
            maxLength={20}
          />
          {phoneError && (
            <Text style={styles.errorText}>
              That number doesn’t look complete. Outside the US, start with + and the
              country code.
            </Text>
          )}
          <SpringPress style={styles.addButton} onPress={add}>
            <Ionicons name="add" size={17} color={colors.starlight} />
            <Text style={styles.addText}>add ally</Text>
          </SpringPress>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.nightSoft,
    borderRadius: radius.card,
    padding: 20,
    marginTop: 28,
    alignSelf: 'stretch',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.starlightSoft,
  },
  editLink: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.starlightSoft,
  },
  tellButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.starlight,
    borderRadius: radius.button,
    paddingVertical: 14,
    marginTop: 14,
  },
  tellText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15.5,
    color: colors.night,
  },
  note: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.starlightSoft,
    marginTop: 10,
  },
  manual: { marginTop: 4 },
  manualText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: colors.starlight,
    marginTop: 8,
  },
  allyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  allyText: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.starlight,
  },
  allyPhone: {
    fontSize: 13,
    color: colors.starlightSoft,
  },
  form: { marginTop: 4 },
  input: {
    backgroundColor: colors.night,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.starlight,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: { borderColor: colors.ember },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 17,
    color: colors.ember,
    marginTop: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.starlightSoft,
    paddingVertical: 11,
    marginTop: 12,
  },
  addText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.starlight,
  },
});
