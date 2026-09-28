import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AlliesForm } from '@/components/AlliesForm';
import { colors, fonts, radius } from '@/constants/theme';
import { formatPhone } from '@/lib/allyAlert';
import { useStore } from '@/lib/store';
import { useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

const MAX_ALLIES = 5;

/**
 * Allies live on the Today screen: this is where they're added and removed.
 * SOS keeps only the alert itself (plus the add form when he has no allies
 * yet, so the moment of need is never a dead end).
 */
export function AlliesCard() {
  const { data, removeAlly } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);
  const { allies } = data;

  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>your allies</Text>

      {allies.length > 0 ? (
        <>
          {allies.map((ally) => (
            <View key={ally.id} style={styles.allyRow}>
              <Ionicons name="person-outline" size={16} color={t.sageText} />
              <Text style={styles.allyText}>
                {ally.name}  <Text style={styles.allyPhone}>{formatPhone(ally.phone)}</Text>
              </Text>
              <Pressable
                hitSlop={10}
                accessibilityLabel={`remove ${ally.name}`}
                onPress={() => removeAlly(ally.id)}>
                <Ionicons name="close" size={18} color={t.textSoft} />
              </Pressable>
            </View>
          ))}
          <Text style={styles.note}>
            One tap on the SOS screen tells them you’re tempted. Nothing more,
            never why.
          </Text>
        </>
      ) : (
        <Text style={styles.note}>
          Add someone who’ll pray when you text. If it ever gets hard, one tap
          on the SOS screen tells them you’re tempted, never why.
        </Text>
      )}

      {allies.length < MAX_ALLIES && <AlliesForm t={t} />}
    </View>
  );
}

const createStyles = (t: Theme) =>
  StyleSheet.create({
    card: {
      backgroundColor: t.card,
      borderRadius: radius.card,
      padding: 18,
      marginTop: 18,
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
    allyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 10,
    },
    allyText: {
      flex: 1,
      fontFamily: fonts.sans,
      fontSize: 15,
      color: t.text,
    },
    allyPhone: {
      fontSize: 13,
      color: t.textSoft,
    },
    note: {
      fontFamily: fonts.sans,
      fontSize: 12.5,
      lineHeight: 18,
      color: t.textSoft,
      marginTop: 8,
    },
  });
