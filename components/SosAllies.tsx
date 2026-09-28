import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AlliesForm } from '@/components/AlliesForm';
import { SpringPress } from '@/components/SpringPress';
import { colors, fonts, radius } from '@/constants/theme';
import { LOCAL_MESSAGE, alertAllies, formatPhone } from '@/lib/allyAlert';
import type { AlertOutcome } from '@/lib/allyAlert';
import { useStore } from '@/lib/store';
import { resolveTheme } from '@/lib/theme';

const OUTCOME_NOTE: Record<Exclude<AlertOutcome, 'unavailable'>, string> = {
  sent: 'Sent. You’re not fighting this alone.',
  opened: 'Your message is ready. Tap Send.',
  cancelled: 'Not sent, and that’s okay. It’s here whenever you need it.',
};

/**
 * "Tell my allies" on the SOS tab. Only one thing is ever said: he's
 * tempted right now. Allies are added and removed on the Today screen;
 * the add form appears here only when he has none yet, so the moment of
 * need is never a dead end.
 */
export function SosAllies() {
  const { data } = useStore();
  const { allies } = data;
  const [sending, setSending] = useState(false);
  const [outcome, setOutcome] = useState<AlertOutcome | null>(null);
  const t = resolveTheme('night');

  const firstName = data.profile?.name?.trim().split(/\s+/)[0] ?? '';

  const tell = async () => {
    if (allies.length === 0) return; // the form below is the way forward
    setSending(true);
    try {
      setOutcome(await alertAllies(allies, firstName));
    } catch {
      setOutcome('unavailable');
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>your allies</Text>

      <SpringPress style={styles.tellButton} disabled={sending || allies.length === 0} onPress={tell}>
        <Ionicons name="people" size={18} color={colors.night} />
        <Text style={styles.tellText}>tell my allies I’m tempted</Text>
      </SpringPress>

      {outcome !== 'unavailable' && (
        <Text style={styles.note}>
          {allies.length === 0
            ? 'No allies yet. Add someone below, or set them up on the Today screen.'
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

      {allies.length === 0 && <AlliesForm t={t} />}
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
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
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
});
