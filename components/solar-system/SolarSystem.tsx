import { useCallback, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, withDecay, withSpring } from 'react-native-reanimated';

import { SOLAR_SYSTEM_PLANETS } from '../../data/planets';
import { useSolarSystemClock } from '../../hooks/useSolarSystemClock';
import { hitTestPlanetAtPoint } from '../../lib/solar/hitTest';
import { clampPan, clampWorldScale, computeWorldPanExtent, DEFAULT_WORLD_SCALE } from '../../lib/solar/worldTransform';
import type { PlanetConfig } from '../../types/planet';
import { PlanetFocusOverlay } from './PlanetFocusOverlay';
import { SolarSystemCanvas } from './SolarSystemCanvas';
import { TimeWarpControls } from './TimeWarpControls';

const FOCUS_SPRING = { damping: 22, stiffness: 180 };

export function SolarSystem() {
  const { width, height } = useWindowDimensions();
  const centerX = width / 2;
  const centerY = height / 2;

  const speedMultiplier = useSharedValue(1);
  const [activeSpeed, setActiveSpeed] = useState(1);
  const time = useSolarSystemClock(speedMultiplier);

  const worldScale = useSharedValue(DEFAULT_WORLD_SCALE);
  const worldOffsetX = useSharedValue(0);
  const worldOffsetY = useSharedValue(0);
  const savedScale = useSharedValue(DEFAULT_WORLD_SCALE);
  const savedOffsetX = useSharedValue(0);
  const savedOffsetY = useSharedValue(0);

  const focusPlanetIndex = useSharedValue(-1);
  const focusProgress = useSharedValue(0);
  const [focusedPlanet, setFocusedPlanet] = useState<PlanetConfig | null>(null);

  const clearFocus = useCallback(() => {
    setFocusedPlanet(null);
  }, []);

  const focusPlanetById = useCallback((planetId: string) => {
    const index = SOLAR_SYSTEM_PLANETS.findIndex((planet) => planet.id === planetId);
    if (index < 0) {
      return;
    }
    focusPlanetIndex.value = index;
    focusProgress.value = withSpring(1, FOCUS_SPRING);
    setFocusedPlanet(SOLAR_SYSTEM_PLANETS[index]);
  }, [focusPlanetIndex, focusProgress]);

  const handleBack = useCallback(() => {
    focusProgress.value = withSpring(0, FOCUS_SPRING, (finished) => {
      if (finished) {
        focusPlanetIndex.value = -1;
        runOnJS(clearFocus)();
      }
    });
  }, [clearFocus, focusPlanetIndex, focusProgress]);

  const pinch = Gesture.Pinch()
    .onBegin(() => {
      savedScale.value = worldScale.value;
    })
    .onUpdate((event) => {
      if (focusProgress.value > 0.05) {
        return;
      }
      worldScale.value = clampWorldScale(savedScale.value * event.scale);
    });

  const pan = Gesture.Pan()
    .minDistance(8)
    .onBegin(() => {
      savedOffsetX.value = worldOffsetX.value;
      savedOffsetY.value = worldOffsetY.value;
    })
    .onUpdate((event) => {
      if (focusProgress.value > 0.05) {
        return;
      }
      const scale = worldScale.value;
      const next = clampPan(
        savedOffsetX.value + event.translationX / scale,
        savedOffsetY.value + event.translationY / scale,
      );
      worldOffsetX.value = next.panX;
      worldOffsetY.value = next.panY;
    })
    .onEnd((event) => {
      if (focusProgress.value > 0.05) {
        return;
      }
      const scale = worldScale.value;
      const limit = computeWorldPanExtent();
      const clampRange: [number, number] = [-limit, limit];

      worldOffsetX.value = withDecay({
        velocity: event.velocityX / scale,
        clamp: clampRange,
      });
      worldOffsetY.value = withDecay({
        velocity: event.velocityY / scale,
        clamp: clampRange,
      });
    });

  const tap = Gesture.Tap()
    .maxDistance(12)
    .onEnd((event) => {
      if (focusProgress.value > 0.05) {
        return;
      }

      const planetId = hitTestPlanetAtPoint(
        event.x,
        event.y,
        time.value,
        centerX,
        centerY,
        worldScale.value,
        worldOffsetX.value,
        worldOffsetY.value,
        focusPlanetIndex.value,
        focusProgress.value,
      );

      if (planetId) {
        runOnJS(focusPlanetById)(planetId);
      }
    });

  const gestures = Gesture.Simultaneous(pinch, Gesture.Exclusive(pan, tap));

  return (
    <View style={styles.container}>
      <SolarSystemCanvas
        width={width}
        height={height}
        time={time}
        worldScale={worldScale}
        worldOffsetX={worldOffsetX}
        worldOffsetY={worldOffsetY}
        focusPlanetIndex={focusPlanetIndex}
        focusProgress={focusProgress}
      />

      <GestureDetector gesture={gestures}>
        <Animated.View style={styles.gestureLayer} />
      </GestureDetector>

      {focusedPlanet ? <PlanetFocusOverlay planet={focusedPlanet} onBack={handleBack} /> : null}

      <TimeWarpControls
        speedMultiplier={speedMultiplier}
        activeSpeed={activeSpeed}
        onSelectSpeed={setActiveSpeed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  gestureLayer: {
    ...StyleSheet.absoluteFillObject,
  },
});
