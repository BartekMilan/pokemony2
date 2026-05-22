import { Circle, Group, RadialGradient, vec } from '@shopify/react-native-skia';
import { useDerivedValue, type DerivedValue } from 'react-native-reanimated';

import type { WorldTransform } from '../../lib/solar/worldTransform';

const DEFAULT_SUN_SIZE = 92;

type SunNodeProps = {
  cx: number;
  cy: number;
  size?: number;
  worldTransform: DerivedValue<WorldTransform>;
};

export function SunNode({ cx, cy, size = DEFAULT_SUN_SIZE, worldTransform }: SunNodeProps) {
  const sunCx = useDerivedValue(() => {
    'worklet';
    const { worldScale, panX } = worldTransform.value;
    return cx + panX * worldScale;
  });

  const sunCy = useDerivedValue(() => {
    'worklet';
    const { worldScale, panY } = worldTransform.value;
    return cy + panY * worldScale;
  });

  const radius = useDerivedValue(() => {
    'worklet';
    return (size / 2) * worldTransform.value.worldScale;
  });

  const coronaOuterR = useDerivedValue(() => radius.value * 2.6);
  const coronaMidR = useDerivedValue(() => radius.value * 1.75);

  const coronaOuterGradientC = useDerivedValue(() => vec(sunCx.value, sunCy.value));
  const coronaMidGradientC = useDerivedValue(() => vec(sunCx.value, sunCy.value));
  const coreGradientC = useDerivedValue(() => vec(sunCx.value, sunCy.value));

  return (
    <Group>
      <Circle cx={sunCx} cy={sunCy} r={coronaOuterR} opacity={0.1}>
        <RadialGradient
          c={coronaOuterGradientC}
          r={coronaOuterR}
          colors={['rgba(255,180,60,0.35)', 'rgba(255,120,30,0.08)', 'rgba(255,80,0,0)']}
          positions={[0, 0.45, 1]}
        />
      </Circle>

      <Circle cx={sunCx} cy={sunCy} r={coronaMidR} opacity={0.22}>
        <RadialGradient
          c={coronaMidGradientC}
          r={coronaMidR}
          colors={['rgba(255,210,90,0.55)', 'rgba(255,150,40,0.18)', 'rgba(255,100,0,0)']}
          positions={[0, 0.5, 1]}
        />
      </Circle>

      <Circle cx={sunCx} cy={sunCy} r={radius}>
        <RadialGradient
          c={coreGradientC}
          r={radius}
          colors={['#FFF8DC', '#FDB813', '#E85D04', '#CC5500']}
        />
      </Circle>
    </Group>
  );
}
