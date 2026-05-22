import { useFrameCallback, useSharedValue } from 'react-native-reanimated';

export function useSolarSystemClock() {
  const time = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    'worklet';
    time.value += (frameInfo.timeSincePreviousFrame ?? 16) / 1000;
  });

  return time;
}
