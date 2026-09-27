import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
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
import { colors, fonts, radius, shadow } from '@/constants/theme';
import { hapticTap } from '@/lib/haptics';
import { useStore } from '@/lib/store';

/**
 * The evening check-in — 30 seconds of honesty, that's all (DESIGN.md).
 * Whatever the answers, finishing it makes the day count as honest and
 * sets the sun: the dawn arc on Today fills with gold.
 */
const RATINGS = [
  { value: 1, label: 'rough' },
  { value: 2, label: 'heavy' },
  { value: 3, label: 'steady' },
  { value: 4, label: 'good' },
  { value: 5, label: 'strong' },
] as const;

const TEMPTED_OPTIONS = [
  { value: 'no', label: 'No — it never came knocking' },
  { value: 'fled', label: 'Yes — and I fled' },
  { value: 'fell', label: 'Yes — and I fell' },
] as const;

type Step = 0 | 1 | 2 | 3;

export default function CheckInScreen() {
  const { saveCheckIn } = useStore();
  const [step, setStep] = useState<Step>(0);
  const [rating, setRating] = useState<number | null>(null);
  const [tempted, setTempted] = useState<(typeof TEMPTED_OPTIONS)[number]['value'] | null>(null);
  const [gratitude, setGratitude] = useState('');

  // A quiet fade between questions — calm, not clever.
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, [step, fade]);

  const completeDay = () => {
    if (rating === null || tempted === null) return;
    saveCheckIn({ rating, tempted, gratitude });
    hapticTap();
    setStep(3);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            {step > 0 && step < 3 ? (
              <Pressable onPress={() => setStep((step - 1) as Step)} hitSlop={12}>
                <Ionicons name="chevron-back" size={22} color={colors.starlightSoft} />
              </Pressable>
            ) : (
              <View />
            )}
            <Text style={styles.title}>evening check-in</Text>
            {step < 3 ? (
              <Pressable onPress={() => router.back()} hitSlop={12}>
                <Ionicons name="close" size={22} color={colors.starlightSoft} />
              </Pressable>
            ) : (
              <View />
            )}
          </View>

          {step < 3 && (
            <Animated.View style={{ opacity: fade, alignSelf: 'stretch' }}>
              {step === 0 && (
                <View>
                  <Text style={styles.question}>How was today, honestly?</Text>
                  <View style={styles.scale}>
                    {RATINGS.map((r) => {
                      const on = rating === r.value;
                      return (
                        <SpringPress
                          key={r.value}
                          style={[styles.scaleDot, on && styles.scaleDotOn]}
                          onPress={() => {
                            setRating(r.value);
                            setStep(1);
                          }}>
                          <Text style={[styles.scaleNum, on && styles.scaleNumOn]}>
                            {r.value}
                          </Text>
                          <Text style={[styles.scaleLabel, on && styles.scaleLabelOn]}>
                            {r.label}
                          </Text>
                        </SpringPress>
                      );
                    })}
                  </View>
                  <Text style={styles.hint}>no wrong answer — this is just the truth</Text>
                </View>
              )}

              {step === 1 && (
                <View>
                  <Text style={styles.question}>Were you tempted today?</Text>
                  {TEMPTED_OPTIONS.map((option) => {
                    const on = tempted === option.value;
                    return (
                      <SpringPress
                        key={option.value}
                        style={[styles.option, on && styles.optionOn]}
                        onPress={() => {
                          setTempted(option.value);
                          setStep(2);
                        }}>
                        <Text style={[styles.optionText, on && styles.optionTextOn]}>
                          {option.label}
                        </Text>
                      </SpringPress>
                    );
                  })}
                  <Text style={styles.hint}>
                    “yes, and I fled” counts as a win in this house
                  </Text>
                </View>
              )}

              {step === 2 && (
                <View>
                  <Text style={styles.question}>One line of gratitude</Text>
                  <TextInput
                    style={styles.gratitudeInput}
                    value={gratitude}
                    onChangeText={setGratitude}
                    placeholder="one good thing, however small"
                    placeholderTextColor={colors.starlightSoft}
                    multiline
                  />
                  <SpringPress style={styles.done} onPress={completeDay}>
                    <Text style={styles.doneText}>complete the day</Text>
                  </SpringPress>
                  <Text style={styles.hint}>optional — but it changes how you sleep</Text>
                </View>
              )}
            </Animated.View>
          )}

          {step === 3 && tempted !== null && (
            <Animated.View style={{ opacity: fade, alignSelf: 'stretch', alignItems: 'center' }}>
              <Ionicons
                name={tempted === 'fell' ? 'sunny-outline' : 'checkmark-circle'}
                size={34}
                color={tempted === 'fell' ? colors.dawn : colors.sage}
                style={styles.doneIcon}
              />
              {tempted === 'fell' ? (
                <View style={styles.doneBody}>
                  <Text style={styles.doneHeadline}>You told the truth.</Text>
                  <Text style={styles.doneNote}>
                    That’s the hardest part, and it’s done. The day counts — now
                    let the sun come up.
                  </Text>
                  <SpringPress
                    style={styles.riseButton}
                    onPress={() => router.replace('/rise-again')}>
                    <Text style={styles.riseButtonText}>Rise Again</Text>
                  </SpringPress>
                </View>
              ) : tempted === 'fled' ? (
                <View style={styles.doneBody}>
                  <Text style={styles.doneHeadline}>You fled. That’s a real win.</Text>
                  <Text style={styles.doneNote}>
                    Temptation came and you got out. The day is complete and the arc is
                    gold — rest well.
                  </Text>
                  <SpringPress
                    style={styles.nightButton}
                    onPress={() => router.back()}>
                    <Text style={styles.nightButtonText}>back to today</Text>
                  </SpringPress>
                </View>
              ) : (
                <View style={styles.doneBody}>
                  <Text style={styles.doneHeadline}>A whole day, honestly given.</Text>
                  <Text style={styles.doneNote}>
                    No temptation to report tonight. The day is complete and the arc is
                    gold — rest well.
                  </Text>
                  <SpringPress
                    style={styles.nightButton}
                    onPress={() => router.back()}>
                    <Text style={styles.nightButtonText}>back to today</Text>
                  </SpringPress>
                </View>
              )}
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.night },
  flex: { flex: 1 },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    minHeight: 32,
    marginBottom: 26,
  },
  title: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.starlightSoft,
  },
  question: {
    fontFamily: fonts.serif,
    fontSize: 25,
    lineHeight: 33,
    color: colors.starlight,
    textAlign: 'center',
    marginBottom: 26,
  },
  scale: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignSelf: 'stretch',
  },
  scaleDot: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.nightSoft,
    borderRadius: 18,
    paddingVertical: 16,
  },
  scaleDotOn: { backgroundColor: colors.dawn },
  scaleNum: {
    fontFamily: fonts.serif,
    fontSize: 20,
    color: colors.starlight,
  },
  scaleNumOn: { color: colors.night },
  scaleLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.starlightSoft,
  },
  scaleLabelOn: { color: colors.night },
  hint: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.starlightSoft,
    textAlign: 'center',
    marginTop: 22,
    paddingHorizontal: 12,
  },
  option: {
    backgroundColor: colors.nightSoft,
    borderRadius: 18,
    paddingVertical: 17,
    paddingHorizontal: 18,
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionOn: { borderColor: colors.dawn },
  optionText: {
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.starlight,
    textAlign: 'center',
  },
  optionTextOn: { fontFamily: fonts.sansMedium },
  gratitudeInput: {
    backgroundColor: colors.nightSoft,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 15,
    minHeight: 96,
    fontFamily: fonts.sans,
    fontSize: 15.5,
    lineHeight: 22,
    color: colors.starlight,
    textAlignVertical: 'top',
  },
  done: {
    backgroundColor: colors.dawn,
    borderRadius: radius.button,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 22,
    ...shadow,
  },
  doneText: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: colors.night,
  },
  doneIcon: { marginTop: 8 },
  doneBody: { alignItems: 'center', alignSelf: 'stretch', marginTop: 14 },
  doneHeadline: {
    fontFamily: fonts.serif,
    fontSize: 26,
    color: colors.starlight,
    textAlign: 'center',
  },
  doneNote: {
    fontFamily: fonts.sans,
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.starlightSoft,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  riseButton: {
    backgroundColor: colors.dawn,
    borderRadius: radius.button,
    paddingVertical: 16,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 26,
    ...shadow,
  },
  riseButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.night,
  },
  nightButton: {
    backgroundColor: colors.nightSoft,
    borderRadius: radius.button,
    paddingVertical: 15,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 26,
  },
  nightButtonText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.starlight,
  },
});
