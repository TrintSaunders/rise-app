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
import { MAX_STEPS, SUGGESTED_STEPS, iconFor, isSingleton } from '@/lib/battlePlan';
import type { BattleStep, SuggestedStep } from '@/lib/battlePlan';
import { useStore } from '@/lib/store';
import { useAppTheme } from '@/lib/theme';
import type { Theme } from '@/lib/theme';

const newStepId = () => `step-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/**
 * The battle plan editor: his way out, in his order. SOS shows these steps
 * exactly as he sets them here. Live steps (text allies, call an ally,
 * memory verse) turn into buttons on SOS.
 */
export default function BattlePlanScreen() {
  const { data, setBattlePlan } = useStore();
  const t = useAppTheme();
  const styles = useMemo(() => createStyles(t), [t]);
  const [custom, setCustom] = useState('');

  const plan = data.battlePlan;
  const full = plan.length >= MAX_STEPS;
  const needsAllies =
    data.allies.length === 0 && plan.some((s) => s.kind === 'text-allies' || s.kind === 'call-ally');

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= plan.length) return;
    const next = [...plan];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setBattlePlan(next);
  };

  const remove = (id: string) => {
    if (plan.length <= 1) return;
    setBattlePlan(plan.filter((s) => s.id !== id));
  };

  const add = (step: Omit<BattleStep, 'id'>) => {
    if (full) return;
    setBattlePlan([...plan, { ...step, id: newStepId() }]);
  };

  const addCustom = () => {
    const label = custom.trim();
    if (!label) return;
    add({ kind: 'custom', label });
    setCustom('');
  };

  const available = SUGGESTED_STEPS.filter((s: SuggestedStep) =>
    isSingleton(s.kind)
      ? !plan.some((p) => p.kind === s.kind)
      : !plan.some((p) => p.label.toLowerCase() === s.label.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style={t.isNight ? 'light' : 'dark'} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="back">
              <Ionicons name="chevron-back" size={22} color={t.textSoft} />
            </Pressable>
            <Text style={styles.headerLabel}>battle plan</Text>
            <View style={styles.headerSpacer} />
          </View>

          <Text style={styles.title}>Your way out</Text>
          <Text style={styles.subtitle}>
            In the order you’ll do them. SOS shows exactly this list when it’s hard.
          </Text>

          <View style={styles.list}>
            {plan.map((step, i) => (
              <View key={step.id} style={styles.stepCard}>
                <Text style={styles.stepNumber}>{i + 1}</Text>
                <Ionicons name={iconFor(step)} size={18} color={t.textSoft} />
                <View style={styles.stepText}>
                  <Text style={styles.stepLabel}>{step.label}</Text>
                  {step.kind !== 'custom' && (
                    <Text style={styles.stepKind}>
                      {step.kind === 'text-allies'
                        ? 'a button on SOS: texts your allies'
                        : step.kind === 'call-ally'
                          ? 'a button on SOS: calls an ally'
                          : 'SOS shows one of your memory verses'}
                    </Text>
                  )}
                </View>
                <View style={styles.stepActions}>
                  <Pressable
                    hitSlop={6}
                    disabled={i === 0}
                    accessibilityLabel={`move ${step.label} up`}
                    onPress={() => move(i, -1)}>
                    <Ionicons name="chevron-up" size={18} color={i === 0 ? t.track : t.textSoft} />
                  </Pressable>
                  <Pressable
                    hitSlop={6}
                    disabled={i === plan.length - 1}
                    accessibilityLabel={`move ${step.label} down`}
                    onPress={() => move(i, 1)}>
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color={i === plan.length - 1 ? t.track : t.textSoft}
                    />
                  </Pressable>
                  <Pressable
                    hitSlop={6}
                    disabled={plan.length <= 1}
                    accessibilityLabel={`remove ${step.label}`}
                    onPress={() => remove(step.id)}>
                    <Ionicons
                      name="close"
                      size={18}
                      color={plan.length <= 1 ? t.track : t.textSoft}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          {needsAllies && (
            <SpringPress style={styles.alliesNote} onPress={() => router.navigate('/today')}>
              <Ionicons name="people-outline" size={17} color={t.sageText} />
              <Text style={styles.alliesNoteText}>
                Add your allies on Today so the text and call steps can reach them.
              </Text>
            </SpringPress>
          )}

          <Text style={styles.sectionLabel}>
            {full ? `a plan holds up to ${MAX_STEPS} steps` : 'add a step'}
          </Text>
          {!full && (
            <>
              <View style={styles.chipRow}>
                {available.map((s) => (
                  <SpringPress
                    key={`${s.kind}-${s.label}`}
                    style={styles.chip}
                    onPress={() => add({ kind: s.kind, label: s.label })}>
                    <Ionicons name={s.icon} size={15} color={t.textSoft} />
                    <Text style={styles.chipText}>{s.label}</Text>
                  </SpringPress>
                ))}
              </View>
              <View style={styles.customRow}>
                <TextInput
                  style={styles.input}
                  value={custom}
                  onChangeText={setCustom}
                  placeholder="or write your own"
                  placeholderTextColor={t.textSoft}
                  maxLength={60}
                  returnKeyType="done"
                  onSubmitEditing={addCustom}
                />
                <SpringPress
                  style={[styles.addButton, !custom.trim() && styles.addButtonOff]}
                  disabled={!custom.trim()}
                  accessibilityLabel="add step"
                  onPress={addCustom}>
                  <Ionicons name="add" size={20} color={colors.night} />
                </SpringPress>
              </View>
            </>
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
    subtitle: {
      fontFamily: fonts.sans,
      fontSize: 14,
      lineHeight: 20,
      color: t.textSoft,
      marginTop: 4,
    },
    list: { marginTop: 20, gap: 10 },
    stepCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: t.card,
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 16,
    },
    stepNumber: {
      fontFamily: fonts.serif,
      fontSize: 17,
      color: t.textSoft,
      width: 14,
    },
    stepText: { flex: 1 },
    stepLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 15,
      color: t.text,
    },
    stepKind: {
      fontFamily: fonts.sans,
      fontSize: 12,
      color: t.textSoft,
      marginTop: 2,
    },
    stepActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    alliesNote: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: t.softSage,
      borderRadius: 16,
      padding: 14,
      marginTop: 14,
    },
    alliesNoteText: {
      flex: 1,
      fontFamily: fonts.sans,
      fontSize: 13,
      lineHeight: 18,
      color: t.sageText,
    },
    sectionLabel: {
      fontFamily: fonts.sansMedium,
      fontSize: 11.5,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: t.textSoft,
      marginTop: 30,
      marginBottom: 10,
    },
    chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
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
    customRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
    input: {
      flex: 1,
      backgroundColor: t.card,
      borderRadius: radius.button,
      paddingHorizontal: 18,
      paddingVertical: 12,
      fontFamily: fonts.sans,
      fontSize: 15,
      color: t.text,
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.dawn,
    },
    addButtonOff: { backgroundColor: t.card },
  });
