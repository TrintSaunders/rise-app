import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '@/constants/theme';

type ComingSoonProps = {
  title: string;
  verseText: string;
  verseRef: string;
  body: string;
  arrives: string;
};

/** Temporary scaffold for tabs whose full flows land in later versions. */
export function ComingSoon({ title, verseText, verseRef, body, arrives }: ComingSoonProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.screen}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.verseCard}>
          <Text style={styles.verse}>“{verseText}”</Text>
          <Text style={styles.ref}>— {verseRef}</Text>
        </View>

        <Text style={styles.body}>{body}</Text>

        <View style={styles.chip}>
          <Text style={styles.chipText}>arriving in {arrives}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  screen: { flex: 1, paddingHorizontal: 24 },
  title: {
    fontFamily: fonts.serif,
    fontSize: 34,
    color: colors.ink,
    marginTop: 18,
  },
  verseCard: {
    backgroundColor: colors.mist,
    borderRadius: radius.card,
    padding: 20,
    marginTop: 24,
  },
  verse: {
    fontFamily: fonts.serifItalic,
    fontSize: 19,
    lineHeight: 28,
    color: colors.ink,
  },
  ref: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.inkSoft,
    marginTop: 10,
    textAlign: 'right',
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 23,
    color: colors.inkSoft,
    marginTop: 20,
  },
  chip: {
    backgroundColor: colors.sageSoft,
    borderRadius: radius.button,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.5,
    color: colors.sageDeep,
  },
});
