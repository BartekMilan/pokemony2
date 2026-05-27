import { useEffect } from 'react';
import {
  cancelAnimation,
  Easing,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export function useDrawProgress(durationMs: number = 5000): SharedValue<number> {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.cubic) }),
      -1,    // infinite
      false  // restart from 0 each loop (true would yo-yo)
    );
    return () => cancelAnimation(progress);
  }, [durationMs]);
  return progress;
}
