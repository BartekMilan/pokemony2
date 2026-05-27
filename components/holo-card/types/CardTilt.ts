import type { SharedValue } from 'react-native-reanimated';
import type { GestureType } from 'react-native-gesture-handler';

export type CardTiltValues = {
  /** Shell rotation in degrees (pitch → X axis). */
  rotateX: SharedValue<number>;
  /** Shell rotation in degrees (roll → Y axis). */
  rotateY: SharedValue<number>;
  /** Normalized parallax driver from smoothed roll (-1..1). */
  parallaxX: SharedValue<number>;
  /** Normalized parallax driver from smoothed pitch (-1..1). */
  parallaxY: SharedValue<number>;
  /** Horizontal sweep offset for holo glare band (pixels). */
  glareTranslate: SharedValue<number>;
  /** Combined tilt angle in radians for holo gradient rotation. */
  glareAngle: SharedValue<number>;
};

export type CardTiltResult = CardTiltValues & {
  isAvailable: boolean;
  /** Dev-only pan gesture when sensor is unavailable. */
  devPanGesture: GestureType | null;
};
