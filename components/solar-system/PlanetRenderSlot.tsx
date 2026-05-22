import { useDerivedValue, type DerivedValue, type SharedValue } from 'react-native-reanimated';

import { SOLAR_SYSTEM_PLANETS } from '../../data/planets';
import type { PlanetTextureMap } from '../../hooks/usePlanetTextures';
import {
  computeAllPlanetScreenStates,
  type PlanetScreenState,
} from '../../lib/solar/orbitalMath';
import type { WorldTransform } from '../../lib/solar/worldTransform';
import { PlanetNode } from './PlanetNode';

export type PlanetSlotState = {
  cx: number;
  cy: number;
  r: number;
  spinAngle: number;
  planetIndex: number;
  color: string;
  opacity: number;
  hasRings: boolean;
  hasAtmosphere: boolean;
};

type PlanetRenderSlotProps = {
  slotIndex: number;
  layer: 'behind' | 'front';
  time: SharedValue<number>;
  centerX: number;
  centerY: number;
  worldTransform: DerivedValue<WorldTransform>;
  textures: PlanetTextureMap;
};

function pickLayerStates(
  states: PlanetScreenState[],
  layer: 'behind' | 'front',
): PlanetScreenState[] {
  'worklet';
  const filtered = states.filter((state) =>
    layer === 'behind' ? state.z < 0 : state.z >= 0,
  );
  return filtered.sort((a, b) => a.z - b.z);
}

export function PlanetRenderSlot({
  slotIndex,
  layer,
  time,
  centerX,
  centerY,
  worldTransform,
  textures,
}: PlanetRenderSlotProps) {
  const slot = useDerivedValue<PlanetSlotState>(() => {
    'worklet';
    const { worldScale, panX, panY } = worldTransform.value;
    const states = computeAllPlanetScreenStates(
      SOLAR_SYSTEM_PLANETS,
      time.value,
      centerX,
      centerY,
      worldScale,
      panX,
      panY,
    );
    const layerStates = pickLayerStates(states, layer);
    const state = layerStates[slotIndex];

    return {
      cx: state?.screenX ?? centerX,
      cy: state?.screenY ?? centerY,
      r: state?.drawRadius ?? 0,
      spinAngle: state?.spinAngle ?? 0,
      planetIndex: state?.planetIndex ?? -1,
      color: state?.color ?? 'transparent',
      opacity: state ? 1 : 0,
      hasRings: state?.hasRings ?? false,
      hasAtmosphere: state?.hasAtmosphere ?? false,
    };
  });

  return (
    <>
      {SOLAR_SYSTEM_PLANETS.map((planet, planetIndex) => (
        <PlanetNode
          key={planet.id}
          planetIndex={planetIndex}
          texture={textures[planet.id] ?? null}
          fallbackColor={planet.color}
          hasRings={planet.rings ?? false}
          hasAtmosphere={planet.atmosphere ?? false}
          slot={slot}
        />
      ))}
    </>
  );
}
