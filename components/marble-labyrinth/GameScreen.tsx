import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  runOnJS,
  SensorType,
  useAnimatedReaction,
  useAnimatedSensor,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { Marble, MARBLE_RADIUS } from './components/Marble';
import { MazeRenderer } from './components/MazeRenderer';
import { SensorDebugOverlay } from './components/SensorDebugOverlay';
import { levels } from './data/levels';
import { triggerGoalHaptic, triggerWallHaptic } from './utils/haptics';
import {
  checkCollisions,
  clampAndBounce,
  FRICTION,
  isInGoal,
  SENSITIVITY,
} from './utils/physics';

export const BOARD_W = 300;
export const BOARD_H = 520;

const LEVEL_SPRING = { damping: 14, stiffness: 120 };
const GOAL_PULSE_SPRING = { damping: 10, stiffness: 200 };

export function GameScreen() {
  const levelCount = levels.length;
  const [levelIndex, setLevelIndex] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const level = levels[levelIndex];
  const walls = level.walls;
  const goal = level.goal;

  // REANIMATED: useAnimatedSensor — gravity input
  const gravity = useAnimatedSensor(SensorType.GRAVITY);
  // REANIMATED: useSharedValue — pos, vel, scale, goalLocked
  const posX = useSharedValue(level.start.x);
  const posY = useSharedValue(level.start.y);
  const velX = useSharedValue(0);
  const velY = useSharedValue(0);
  const scale = useSharedValue(1);
  const goalLocked = useSharedValue(0);
  const lastBounceTime = useSharedValue(0);
  const [sensorsAvailable, setSensorsAvailable] = useState(false);

  const resetLevel = useCallback(
    (start: { x: number; y: number }) => {
      velX.value = 0;
      velY.value = 0;
      goalLocked.value = 0;
      scale.value = 1;
      // REANIMATED: withSpring — marble drops from above into start position
      posX.value = start.x;
      posY.value = start.y - 80;
      posX.value = withSpring(start.x, LEVEL_SPRING);
      posY.value = withSpring(start.y, LEVEL_SPRING);
    },
    [goalLocked, posX, posY, scale, velX, velY],
  );

  const advanceLevel = useCallback(() => {
    if (levelIndex >= levelCount - 1) {
      setGameWon(true);
      return;
    }
    const nextIndex = levelIndex + 1;
    setLevelIndex(nextIndex);
    resetLevel(levels[nextIndex].start);
  }, [levelCount, levelIndex, resetLevel]);

  const onGoalReached = useCallback(() => {
    // REANIMATED: runOnJS — goal haptic + pulse, then advance level
    triggerGoalHaptic();
    // REANIMATED: withSequence — win pulse before advancing
    scale.value = withSequence(
      withSpring(1.3, GOAL_PULSE_SPRING),
      withSpring(1, LEVEL_SPRING, (finished) => {
        if (finished) {
          runOnJS(advanceLevel)();
        }
      }),
    );
  }, [advanceLevel, scale]);

  const onWallHit = useCallback(() => {
    // REANIMATED: runOnJS — debounced wall bounce haptic
    triggerWallHaptic();
  }, []);

  useEffect(() => {
    setSensorsAvailable(gravity.isAvailable);
  }, [gravity]);

  useEffect(() => {
    resetLevel(levels[0].start);
  }, [resetLevel]);

  /*
   * Worklet safety (useAnimatedReaction):
   * - No React state or refs inside the reaction callback
   * - walls / goal are plain objects in the dependency array — reaction re-registers on level change
   * - JS callbacks are defined with useCallback and invoked via runOnJS(...)
   */
  // REANIMATED: useAnimatedReaction — physics loop
  useAnimatedReaction(
    () => gravity.sensor.value,
    () => {
      'worklet';
      if (goalLocked.value) {
        return;
      }

      const { x, y } = gravity.sensor.value;
      velX.value += x * SENSITIVITY;
      velY.value -= y * SENSITIVITY;
      velX.value *= FRICTION;
      velY.value *= FRICTION;

      posX.value += velX.value;
      posY.value += velY.value;

      clampAndBounce(posX, velX, MARBLE_RADIUS, BOARD_W - MARBLE_RADIUS);
      clampAndBounce(posY, velY, MARBLE_RADIUS, BOARD_H - MARBLE_RADIUS);

      checkCollisions(
        walls,
        MARBLE_RADIUS,
        posX,
        posY,
        velX,
        velY,
        lastBounceTime,
        onWallHit,
      );

      if (isInGoal(posX.value, posY.value, goal)) {
        goalLocked.value = 1;
        runOnJS(onGoalReached)();
      }
    },
    [walls, goal],
  );

  return (
    <View style={styles.screen}>
      {!sensorsAvailable && (
        <View style={styles.banner}>
          <Text style={styles.bannerText}>
            Sensors unavailable — use a physical device
          </Text>
        </View>
      )}

      <Text style={styles.hud}>
        {gameWon ? 'You win!' : `Level ${levelIndex + 1} / ${levelCount}`}
      </Text>

      <View style={styles.board}>
        <MazeRenderer walls={walls} goal={goal} />
        <Marble posX={posX} posY={posY} scale={scale} />
      </View>

      <SensorDebugOverlay sensor={gravity.sensor} />
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
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#c0392b',
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  bannerText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
  },
  hud: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  board: {
    width: BOARD_W,
    height: BOARD_H,
    backgroundColor: '#888',
    position: 'relative',
    overflow: 'hidden',
  },
});
