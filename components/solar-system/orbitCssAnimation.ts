import type {
  CSSAnimationKeyframes,
  CSSAnimationProperties,
} from 'react-native-reanimated';

import type { PlanetConfig } from '../../types/planet';

const ORBIT_ROTATION: CSSAnimationKeyframes = {
  from: {
    transform: [{ rotateZ: '0deg' }],
  },
  to: {
    transform: [{ rotateZ: '360deg' }],
  },
};

export function getOrbitCssAnimation(
  config: PlanetConfig
): CSSAnimationProperties {
  const periodSec = (2 * Math.PI) / config.angularVelocity;
  const initialAngle = config.initialAngle ?? 0;
  const phaseOffsetSec = (initialAngle / (2 * Math.PI)) * periodSec;

  return {
    animationName: ORBIT_ROTATION,
    animationDuration: `${periodSec}s`,
    animationIterationCount: 'infinite' as const,
    animationTimingFunction: 'linear' as const,
    animationDelay: `${-phaseOffsetSec}s`,
  };
}
