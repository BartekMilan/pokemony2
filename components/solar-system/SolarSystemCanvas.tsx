import { Canvas } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import type { SharedValue } from 'react-native-reanimated';

import { SOLAR_SYSTEM_PLANETS } from '../../data/planets';
import { useEffectiveWorldTransform } from '../../hooks/useEffectiveWorldTransform';
import { usePlanetTextures } from '../../hooks/usePlanetTextures';
import { OrbitEllipse } from './OrbitEllipse';
import { PlanetRenderSlot } from './PlanetRenderSlot';
import { Starfield } from './Starfield';
import { SunNode } from './SunNode';

type SolarSystemCanvasProps = {
  width: number;
  height: number;
  time: SharedValue<number>;
  worldScale: SharedValue<number>;
  worldOffsetX: SharedValue<number>;
  worldOffsetY: SharedValue<number>;
  focusPlanetIndex: SharedValue<number>;
  focusProgress: SharedValue<number>;
};

const PLANET_SLOTS = SOLAR_SYSTEM_PLANETS.map((_, index) => index);

export function SolarSystemCanvas({
  width,
  height,
  time,
  worldScale,
  worldOffsetX,
  worldOffsetY,
  focusPlanetIndex,
  focusProgress,
}: SolarSystemCanvasProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const textures = usePlanetTextures();
  const worldTransform = useEffectiveWorldTransform({
    worldScale,
    worldOffsetX,
    worldOffsetY,
    focusPlanetIndex,
    focusProgress,
    time,
    centerX,
    centerY,
  });

  const drawOrder = useMemo(
    () => [...SOLAR_SYSTEM_PLANETS].sort((a, b) => b.orbitRadius - a.orbitRadius),
    [],
  );

  return (
    <Canvas style={{ flex: 1, width, height }}>
      <Starfield width={width} height={height} />

      {drawOrder.map((planet) => (
        <OrbitEllipse
          key={`orbit-${planet.id}`}
          config={planet}
          centerX={centerX}
          centerY={centerY}
          worldTransform={worldTransform}
        />
      ))}

      {PLANET_SLOTS.map((slotIndex) => (
        <PlanetRenderSlot
          key={`behind-${slotIndex}`}
          slotIndex={slotIndex}
          layer="behind"
          time={time}
          centerX={centerX}
          centerY={centerY}
          worldTransform={worldTransform}
          textures={textures}
        />
      ))}

      <SunNode cx={centerX} cy={centerY} worldTransform={worldTransform} />

      {PLANET_SLOTS.map((slotIndex) => (
        <PlanetRenderSlot
          key={`front-${slotIndex}`}
          slotIndex={slotIndex}
          layer="front"
          time={time}
          centerX={centerX}
          centerY={centerY}
          worldTransform={worldTransform}
          textures={textures}
        />
      ))}
    </Canvas>
  );
}
