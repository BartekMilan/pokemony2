import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = CENTER;
const LINE_Y = 0;
const SEGMENTS = 64;

const HALF_SEGMENTS = SEGMENTS / 2;

function appendPoint(
  d: string,
  isFirst: boolean,
  lineX: number,
  lineY: number,
  angle: number,
  progress: number,
): { d: string; isFirst: boolean } {
  'worklet';
  const circleX = CENTER + RADIUS * Math.cos(angle);
  const circleY = CENTER + RADIUS * Math.sin(angle);
  const x = lineX + progress * (circleX - lineX);
  const y = lineY + progress * (circleY - lineY);
  const next = isFirst ? `M ${x} ${y}` : `${d} L ${x} ${y}`;

  return { d: next, isFirst: false };
}

function buildLineToCirclePath(progress: number): string {
  'worklet';
  let d = '';
  let isFirst = true;

  // SVG y-axis points down: π/2 = bottom, 3π/2 = top
  for (let i = 0; i <= HALF_SEGMENTS; i++) {
    const u = i / HALF_SEGMENTS;
    const result = appendPoint(
      d,
      isFirst,
      CENTER * u,
      LINE_Y,
      Math.PI / 2 + u * Math.PI,
      progress,
    );
    d = result.d;
    isFirst = result.isFirst;
  }

  // Right half: mirror of the left side
  for (let i = 1; i <= HALF_SEGMENTS; i++) {
    const v = i / HALF_SEGMENTS;
    const result = appendPoint(
      d,
      isFirst,
      CENTER + CENTER * v,
      LINE_Y,
      v * Math.PI - Math.PI / 2,
      progress,
    );
    d = result.d;
    isFirst = result.isFirst;
  }

  if (progress > 0.99) {
    d += ' Z';
  }

  return d;
}

export default function LineScreen() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 2000,
        easing: Easing.inOut(Easing.cubic),
      }),
      -1,
      true,
    );
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    d: buildLineToCirclePath(progress.value),
  }));

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <AnimatedPath
          animatedProps={animatedProps}
          fill="none"
          stroke="red"
          strokeWidth={2}
        />
      </Svg>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
