import { useDerivedValue, type SharedValue } from 'react-native-reanimated';

import { computeEffectiveWorldTransform } from '../lib/solar/worldTransform';

type UseEffectiveWorldTransformArgs = {
  worldScale: SharedValue<number>;
  worldOffsetX: SharedValue<number>;
  worldOffsetY: SharedValue<number>;
  focusPlanetIndex: SharedValue<number>;
  focusProgress: SharedValue<number>;
  time: SharedValue<number>;
  centerX: number;
  centerY: number;
};

export function useEffectiveWorldTransform({
  worldScale,
  worldOffsetX,
  worldOffsetY,
  focusPlanetIndex,
  focusProgress,
  time,
  centerX,
  centerY,
}: UseEffectiveWorldTransformArgs) {
  return useDerivedValue(() => {
    'worklet';
    return computeEffectiveWorldTransform(
      worldScale.value,
      worldOffsetX.value,
      worldOffsetY.value,
      focusPlanetIndex.value,
      focusProgress.value,
      time.value,
      centerX,
      centerY,
    );
  });
}
