import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius } from '@/constants/theme';
import { cleanPhone } from '@/lib/allyAlert';
import { useStore } from '@/lib/store';
import type { Theme } from '@/lib/theme';

/**
 * The add-an-ally form, shared by the Today card (management) and the SOS
 * card's no-allies-yet fallback. One source for validation and copy.
 */
export function AlliesForm({ t }: { t: Theme }) {
  const { addAlly } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(false);

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
    <View style={styles.form}>
      <TextInput
        style={[styles.input, { backgroundColor: t.track, color: t.text }, phoneError && styles.inputError]}
        value={name}
        onChangeText={setName}
        placeholder="name"
        placeholderTextColor={t.textSoft}
        maxLength={30}
      />
      <TextInput
        style={[styles.input, { backgroundColor: t.track, color: t.text }, phoneError && styles.inputError]}
        value={phone}
        onChangeText={(v) => {
          setPhone(v);
          setPhoneError(false);
        }}
        placeholder="phone number"
        placeholderTextColor={t.textSoft}
        keyboardType="phone-pad"
        maxLength={20}
      />
      {phoneError && (
        <Text style={styles.errorText}>
          That number doesn’t look complete. Outside the US, start with + and the
          country code.
        </Text>
      )}
      <SpringPress style={[styles.addButton, { borderColor: t.textSoft }]} onPress={add}>
        <Ionicons name="add" size={17} color={t.text} />
        <Text style={[styles.addText, { color: t.text }]}>Add ally</Text>
      </SpringPress>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginTop: 4 },
  input: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 15,
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
    paddingVertical: 11,
    marginTop: 12,
  },
  addText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
  },
});
