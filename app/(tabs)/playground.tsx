import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDecay,
  cancelAnimation,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const PLAYGROUND_W = 300;
const PLAYGROUND_H = 520;
const BALL_RADIUS = 28;

const DECELERATION = 0.996;
const BOUNCE_COEFF = 0.6;
const MIN_VELOCITY = 50;
const VELOCITY_THRESHOLD = 200;

const L_BOUND = BALL_RADIUS;
const R_BOUND = PLAYGROUND_W - BALL_RADIUS;
const T_BOUND = BALL_RADIUS;
const B_BOUND = PLAYGROUND_H - BALL_RADIUS;

function throwAxis(
  value: SharedValue<number>,
  velocity: number,
  min: number,
  max: number,
) {
  'worklet';
  if (Math.abs(velocity) < MIN_VELOCITY) return;

  value.value = withDecay(
    {
      velocity,
      clamp: [min, max],
      deceleration: DECELERATION,
    },
    (finished) => {
      if (!finished) return;
      const atWall = value.value <= min + 1 || value.value >= max - 1;
      if (atWall) throwAxis(value, -velocity * BOUNCE_COEFF, min, max);
    },
  );
}

export default function PlaygroundScreen() {
  const ballX = useSharedValue(PLAYGROUND_W / 2);
  const ballY = useSharedValue(PLAYGROUND_H / 2);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      cancelAnimation(ballX);
      cancelAnimation(ballY);
      startX.value = ballX.value;
      startY.value = ballY.value;
    })
    .onUpdate((e) => {
      ballX.value = Math.min(Math.max(startX.value + e.translationX, L_BOUND), R_BOUND);
      ballY.value = Math.min(Math.max(startY.value + e.translationY, T_BOUND), B_BOUND);
    })
    .onEnd((e) => {
      const speed = Math.sqrt(e.velocityX ** 2 + e.velocityY ** 2);
      if (speed >= VELOCITY_THRESHOLD) {
        throwAxis(ballX, e.velocityX, L_BOUND, R_BOUND);
        throwAxis(ballY, e.velocityY, T_BOUND, B_BOUND);
      }
    });

  const ballStyle = useAnimatedStyle(() => ({
    left: ballX.value - BALL_RADIUS,
    top: ballY.value - BALL_RADIUS,
  }));

  return (
    <View style={styles.screen}>
      <View style={styles.playground}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.ball, ballStyle]} />
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playground: {
    width: PLAYGROUND_W,
    height: PLAYGROUND_H,
    backgroundColor: '#888',
    position: 'relative',
  },
  ball: {
    width: BALL_RADIUS * 2,
    height: BALL_RADIUS * 2,
    borderRadius: BALL_RADIUS,
    backgroundColor: '#2ecc40',
    position: 'absolute',
  },
});
