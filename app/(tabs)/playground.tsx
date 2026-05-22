import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const PLAYGROUND_W = 300;
const PLAYGROUND_H = 520;
const BALL_RADIUS = 28;

const VELOCITY_THRESHOLD = 200;
const BOUNCE_FRICTION = 0.8;
const DRAG_FACTOR = 0.995;
const STOP_THRESHOLD = 2;

const L_BOUND = BALL_RADIUS;
const R_BOUND = PLAYGROUND_W - BALL_RADIUS;
const T_BOUND = BALL_RADIUS;
const B_BOUND = PLAYGROUND_H - BALL_RADIUS;

export default function PlaygroundScreen() {
  const ballX = useSharedValue(PLAYGROUND_W / 2);
  const ballY = useSharedValue(PLAYGROUND_H / 2);
  const velX = useSharedValue(0);
  const velY = useSharedValue(0);
  const isDragging = useSharedValue(false);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    if (isDragging.value) return;
    if (velX.value === 0 && velY.value === 0) return;

    const dt = (frameInfo.timeSincePreviousFrame ?? 16) / 1000;

    let nx = ballX.value + velX.value * dt;
    let ny = ballY.value + velY.value * dt;

    if (nx < L_BOUND) {
      nx = L_BOUND;
      velX.value = -velX.value * BOUNCE_FRICTION;
    }
    if (nx > R_BOUND) {
      nx = R_BOUND;
      velX.value = -velX.value * BOUNCE_FRICTION;
    }
    if (ny < T_BOUND) {
      ny = T_BOUND;
      velY.value = -velY.value * BOUNCE_FRICTION;
    }
    if (ny > B_BOUND) {
      ny = B_BOUND;
      velY.value = -velY.value * BOUNCE_FRICTION;
    }

    ballX.value = nx;
    ballY.value = ny;

    velX.value *= DRAG_FACTOR;
    velY.value *= DRAG_FACTOR;

    const speed = Math.sqrt(velX.value * velX.value + velY.value * velY.value);
    if (speed < STOP_THRESHOLD) {
      velX.value = 0;
      velY.value = 0;
    }
  });

  const pan = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
      velX.value = 0;
      velY.value = 0;
      startX.value = ballX.value;
      startY.value = ballY.value;
    })
    .onUpdate((e) => {
      ballX.value = Math.min(Math.max(startX.value + e.translationX, L_BOUND), R_BOUND);
      ballY.value = Math.min(Math.max(startY.value + e.translationY, T_BOUND), B_BOUND);
    })
    .onEnd((e) => {
      isDragging.value = false;
      const speed = Math.sqrt(e.velocityX * e.velocityX + e.velocityY * e.velocityY);
      if (speed < VELOCITY_THRESHOLD) {
        velX.value = 0;
        velY.value = 0;
      } else {
        velX.value = e.velocityX;
        velY.value = e.velocityY;
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
