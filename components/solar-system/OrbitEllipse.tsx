import { Oval, rect } from '@shopify/react-native-skia';
import { useDerivedValue, type DerivedValue } from 'react-native-reanimated';

import type { PlanetConfig } from '../../types/planet';
import type { WorldTransform } from '../../lib/solar/worldTransform';

type OrbitEllipseProps = {
  config: PlanetConfig;
  centerX: number;
  centerY: number;
  worldTransform: DerivedValue<WorldTransform>;
};

export function OrbitEllipse({ config, centerX, centerY, worldTransform }: OrbitEllipseProps) {
  const orbitRect = useDerivedValue(() => {
    'worklet';
    const { worldScale, panX, panY } = worldTransform.value;
    const radiusX = config.orbitRadius * worldScale;
    const radiusY = config.orbitRadius * Math.cos(config.orbitInclination) * worldScale;
    const cx = centerX + panX * worldScale;
    const cy = centerY + panY * worldScale;
    return rect(cx - radiusX, cy - radiusY, radiusX * 2, radiusY * 2);
  });

  return (
    <Oval
      rect={orbitRect}
      color="rgba(255, 255, 255, 0.14)"
      style="stroke"
      strokeWidth={1}
    />
  );
}
