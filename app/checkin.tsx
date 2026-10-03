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
import { fallsOnCheckInDay, useStore } from '@/lib/store';

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
  { value: 'no', label: 'No, it never came knocking' },
  { value: 'fled', label: 'Yes, and I fled' },
  { value: 'fell', label: 'Yes, and I fell' },
] as const;

type Step = 0 | 1 | 2 | 3;

/** Log-a-struggle times are window estimates, so name the hour, not the minute. */
function aroundHour(iso: string): string {
  const hour = new Date(iso).getHours();
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `around ${twelve}${hour < 12 ? 'am' : 'pm'}`;
}

export default function CheckInScreen() {
  const { data, saveCheckIn, logTemptation } = useStore();
  const falls = fallsOnCheckInDay(data);
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

  // Every fall stays its own entry — how many and when is what Patterns reads.
  // If he rises without logging one, it still counts, just without an hour.
  const riseAgain = () => {
    if (falls.length === 0) {
      logTemptation([], 'fell', new Date().toISOString(), { hourUnknown: true });
    }
    router.replace('/rise-again');
  };

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
              <Pressable onPress={() => setStep((step - 1) as Step)} hitSlop={12} accessibilityRole="button" accessibilityLabel="previous question">
                <Ionicons name="chevron-back" size={22} color={colors.starlightSoft} />
              </Pressable>
            ) : (
              <View />
            )}
            <Text style={styles.title}>evening check-in</Text>
            {step < 3 ? (
              <Pressable onPress={() => router.back()} hitSlop={12} accessibilityRole="button" accessibilityLabel="close">
                <Ionicons name="close" size={22} color={colors.starlightSoft} />
              </Pressable>
            ) : (
              <View />
            )}
          </View>

          {step < 3 && (
            <View style={styles.dots} accessibilityLabel={`question ${step + 1} of 3`}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={[styles.dot, i <= step && styles.dotOn]} />
              ))}
            </View>
          )}

          <View style={styles.body}>
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
                            <Text style={[styles.scaleNum, on && styles.scaleNumOn]} maxFontSizeMultiplier={1.3}>
                              {r.value}
                            </Text>
                            <Text style={[styles.scaleLabel, on && styles.scaleLabelOn]} maxFontSizeMultiplier={1.3}>
                              {r.label}
                            </Text>
                          </SpringPress>
                        );
                      })}
                    </View>
                    <Text style={styles.hint}>no wrong answer, just the truth</Text>
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
                    <Text style={styles.hint}>optional, but it changes how you sleep</Text>
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
                      That’s the hardest part, and it’s done. The day counts. Now
                      let the sun come up.
                    </Text>
                    <View style={styles.fallsCard}>
                      <Text style={styles.fallsLabel}>
                        {falls.length === 0
                          ? 'each fall, on its own'
                          : `${falls.length} logged today`}
                      </Text>
                      {falls.map((fall) => (
                        <View key={fall.id} style={styles.fallRow}>
                          <Ionicons name="ellipse" size={7} color={colors.starlightSoft} />
                          <Text style={styles.fallText}>
                            {fall.hourUnknown ? 'time not given' : aroundHour(fall.at)}
                            {fall.feelings.length > 0 ? ` · ${fall.feelings.join(', ')}` : ''}
                          </Text>
                        </View>
                      ))}
                      <Text style={styles.fallsNote}>
                        {falls.length === 0
                          ? 'Log each one with its hour so Patterns learns when the dark hours really are. Not sure when? Rise Again still counts it.'
                          : 'Another one today? Log it too. The count and the hours are the honest story.'}
                      </Text>
                      <SpringPress
                        style={styles.logFallButton}
                        onPress={() =>
                          router.push({
                            pathname: '/log-struggle',
                            params: { outcome: 'fell', then: 'back' },
                          })
                        }>
                        <Ionicons name="add" size={17} color={colors.starlight} />
                        <Text style={styles.logFallText}>
                          {falls.length === 0 ? 'log it with its time' : 'log another'}
                        </Text>
                      </SpringPress>
                    </View>
                    <SpringPress
                      style={styles.riseButton}
                      onPress={riseAgain}>
                      <Text style={styles.riseButtonText}>Rise Again</Text>
                    </SpringPress>
                  </View>
                ) : tempted === 'fled' ? (
                  <View style={styles.doneBody}>
                    <Text style={styles.doneHeadline}>You fled. That’s a real win.</Text>
                    <Text style={styles.doneNote}>
                      Temptation came and you got out. The day is complete and the arc is
                      gold. Rest well.
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
                      gold. Rest well.
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.night },
  flex: { flex: 1 },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 32,
  },
  // Questions sit a little above center: the eye's resting line, not the top edge.
  body: {
    flexGrow: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingBottom: 72,
  },
  dots: { flexDirection: 'row', gap: 6, marginTop: -10 },
  dot: {
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.nightSoft,
  },
  dotOn: { backgroundColor: colors.dawn },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    minHeight: 32,
    marginBottom: 16,
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
  fallsCard: {
    alignSelf: 'stretch',
    backgroundColor: colors.nightSoft,
    borderRadius: 18,
    padding: 18,
    marginTop: 22,
  },
  fallsLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11.5,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.starlightSoft,
    marginBottom: 6,
  },
  fallRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  fallText: {
    fontFamily: fonts.sans,
    fontSize: 14.5,
    color: colors.starlight,
  },
  fallsNote: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    lineHeight: 18,
    color: colors.starlightSoft,
    marginTop: 8,
  },
  logFallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.starlightSoft,
    paddingVertical: 11,
    marginTop: 14,
  },
  logFallText: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.starlight,
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
