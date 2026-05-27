import {
  Extrapolation,
  interpolate,
  SensorType,
  useAnimatedReaction,
  useAnimatedSensor,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  CARD_SPRING_CONFIG,
  GLARE_SWEEP_RANGE,
  ROTATE_X_OUT,
  ROTATE_Y_OUT,
  SENSOR_PITCH_IN,
  SENSOR_ROLL_IN,
} from '../constants/cardLayout';
import type { CardTiltResult } from '../types/CardTilt';
import { useDevTiltMock } from './useDevTiltMock';

/**
 * Single source of motion truth: sensor → spring → clamped SharedValues.
 * Layers read outputs only — never call useAnimatedSensor themselves.
 */
export function useCardTilt(): CardTiltResult {
  const rotation = useAnimatedSensor(SensorType.ROTATION, {
    adjustToInterfaceOrientation: true,
  });

  const useMock = !rotation.isAvailable;
  const { mockPitch, mockRoll, panGesture } = useDevTiltMock(useMock);

  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const parallaxX = useSharedValue(0);
  const parallaxY = useSharedValue(0);
  const glareTranslate = useSharedValue(0);
  const glareAngle = useSharedValue(0);

  useAnimatedReaction(
    () => {
      if (rotation.isAvailable) {
        const { pitch, roll } = rotation.sensor.value;
        return { pitch, roll };
      }
      return { pitch: mockPitch.value, roll: mockRoll.value };
    },
    (data) => {
      const targetPitch = interpolate(
        data.pitch,
        SENSOR_PITCH_IN,
        ROTATE_X_OUT,
        Extrapolation.CLAMP,
      );
      const targetRoll = interpolate(
        data.roll,
        SENSOR_ROLL_IN,
        ROTATE_Y_OUT,
        Extrapolation.CLAMP,
      );

      rotateX.value = withSpring(targetPitch, CARD_SPRING_CONFIG);
      rotateY.value = withSpring(targetRoll, CARD_SPRING_CONFIG);

      parallaxX.value = withSpring(
        interpolate(data.roll, SENSOR_ROLL_IN, [-1, 1], Extrapolation.CLAMP),
        CARD_SPRING_CONFIG,
      );
      parallaxY.value = withSpring(
        interpolate(data.pitch, SENSOR_PITCH_IN, [-1, 1], Extrapolation.CLAMP),
        CARD_SPRING_CONFIG,
      );

      const angle = Math.atan2(data.roll, data.pitch);
      glareAngle.value = withSpring(angle, CARD_SPRING_CONFIG);
      glareTranslate.value = withSpring(
        interpolate(angle, [-Math.PI, Math.PI], [-GLARE_SWEEP_RANGE, GLARE_SWEEP_RANGE], Extrapolation.CLAMP),
        CARD_SPRING_CONFIG,
      );
    },
  );

  return {
    rotateX,
    rotateY,
    parallaxX,
    parallaxY,
    glareTranslate,
    glareAngle,
    isAvailable: rotation.isAvailable,
    devPanGesture: panGesture,
  };
}
