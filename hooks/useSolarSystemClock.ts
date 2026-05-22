import { useFrameCallback, useSharedValue, type SharedValue } from 'react-native-reanimated';

export function useSolarSystemClock(speedMultiplier?: SharedValue<number>) {
  const time = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    'worklet';
    const multiplier = speedMultiplier?.value ?? 1;
    time.value += ((frameInfo.timeSincePreviousFrame ?? 16) / 1000) * multiplier;
  });

  return time;
}
