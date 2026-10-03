import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

import { colors } from '@/constants/theme';

const WIDTH = 260;
const RADIUS = 112;
const STROKE = 4;
const PAD = 16;
const CX = WIDTH / 2;
const HORIZON = RADIUS + PAD;
const HEIGHT = HORIZON + 14;
const ARC_LENGTH = Math.PI * RADIUS;

/** Daylight runs 6am to 8pm; the sun waits on the horizon outside it. */
const DAWN_HOUR = 6;
const DUSK_HOUR = 20;

export function daylightProgress(now: Date = new Date()): number {
  const hours = now.getHours() + now.getMinutes() / 60;
  return Math.min(1, Math.max(0, (hours - DAWN_HOUR) / (DUSK_HOUR - DAWN_HOUR)));
}

function pointOnArc(p: number) {
  const angle = Math.PI * (1 - p);
  return { x: CX + RADIUS * Math.cos(angle), y: HORIZON - RADIUS * Math.sin(angle) };
}

/** A gentle ease toward `target` — JS-driven so it behaves the same on iOS, Android, and web. */
function useTween(target: number, duration = 1400): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = Date.now();
    const origin = from.current;
    let frame = 0;
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = origin + (target - origin) * eased;
      from.current = next;
      setValue(next);
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
}

type DawnArcProps = {
  /** Checked in: the whole arc fills with gold and the dome glows. */
  complete: boolean;
  /** Night Watch softens the horizon and dims the unfilled track. */
  isNight: boolean;
};

/**
 * The dawn arc on Today. The sun rides the arc with the real time of day and
 * leaves a gold trail; finishing the evening check-in fills the rest of the
 * arc and warms the whole dome.
 */
export function DawnArc({ complete, isNight }: DawnArcProps) {
  const daylight = daylightProgress();
  const trail = useTween(complete ? 1 : daylight);
  const glow = useTween(complete ? 1 : 0);
  const sun = pointOnArc(daylight);
  const dome = `M ${CX - RADIUS} ${HORIZON} A ${RADIUS} ${RADIUS} 0 0 1 ${CX + RADIUS} ${HORIZON}`;
  const trackColor = isNight ? colors.starlightSoft : colors.dawn;
  const lineColor = isNight ? colors.starlightSoft : colors.inkSoft;
  const sunUp = daylight > 0 && daylight < 1;

  return (
    <View
      style={{ width: WIDTH, height: HEIGHT }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={
        complete ? 'The dawn arc is full: today is complete.' : 'The dawn arc: today’s check-in is still to come.'
      }>
      <Svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <Defs>
          <LinearGradient id="domeFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.dawn} stopOpacity={0.1 + 0.32 * glow} />
            <Stop offset="1" stopColor={colors.dawn} stopOpacity={0.02 + 0.1 * glow} />
          </LinearGradient>
          <RadialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={colors.dawn} stopOpacity={0.55} />
            <Stop offset="1" stopColor={colors.dawn} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* the sky under the arc */}
        <Path d={`${dome} Z`} fill="url(#domeFill)" />

        {/* the unfilled track, then the gold trail over it */}
        <Path
          d={dome}
          stroke={trackColor}
          strokeOpacity={isNight ? 0.35 : 0.28}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={dome}
          stroke={colors.dawn}
          strokeWidth={STROKE}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${ARC_LENGTH} ${ARC_LENGTH}`}
          strokeDashoffset={ARC_LENGTH * (1 - trail)}
        />

        <Line
          x1={PAD / 2}
          y1={HORIZON}
          x2={WIDTH - PAD / 2}
          y2={HORIZON}
          stroke={lineColor}
          strokeOpacity={0.25}
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* the sun: on the arc by day, resting on the horizon by night */}
        <Circle cx={sun.x} cy={sun.y} r={22} fill="url(#sunGlow)" opacity={sunUp ? 1 : 0.5} />
        <Circle
          cx={sun.x}
          cy={sun.y}
          r={9}
          fill={colors.dawn}
          opacity={sunUp ? 1 : 0.7}
        />
      </Svg>
    </View>
  );
}
