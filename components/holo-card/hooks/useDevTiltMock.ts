import { useMemo } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

import { CARD_W, MOCK_TILT_RANGE } from '../constants/cardLayout';

/**
 * Pan-driven pitch/roll mock for simulators where ROTATION sensor is unavailable.
 * Writes to the same SharedValue shape the real sensor path uses.
 */
export function useDevTiltMock(enabled: boolean) {
  const mockPitch = useSharedValue(0);
  const mockRoll = useSharedValue(0);
  const startPitch = useSharedValue(0);
  const startRoll = useSharedValue(0);

  const panGesture = useMemo(() => {
    if (!enabled) return null;

    return Gesture.Pan()
      .onBegin(() => {
        startPitch.value = mockPitch.value;
        startRoll.value = mockRoll.value;
      })
      .onUpdate((event) => {
        mockRoll.value = Math.max(
          -MOCK_TILT_RANGE,
          Math.min(MOCK_TILT_RANGE, startRoll.value + event.translationX / (CARD_W * 0.5)),
        );
        mockPitch.value = Math.max(
          -MOCK_TILT_RANGE,
          Math.min(MOCK_TILT_RANGE, startPitch.value - event.translationY / (CARD_W * 0.5)),
        );
      });
  }, [enabled, mockPitch, mockRoll, startPitch, startRoll]);

  return { mockPitch, mockRoll, panGesture };
}
