import { useImage, type SkImage } from '@shopify/react-native-skia';

import { SOLAR_SYSTEM_PLANETS } from '../data/planets';

export type PlanetTextureMap = Record<string, SkImage | null>;

export function usePlanetTextures(): PlanetTextureMap {
  const mercury = useImage(require('../assets/textures/mercury.png'));
  const venus = useImage(require('../assets/textures/venus.png'));
  const earth = useImage(require('../assets/textures/earth.png'));
  const mars = useImage(require('../assets/textures/mars.png'));
  const jupiter = useImage(require('../assets/textures/jupiter.png'));
  const saturn = useImage(require('../assets/textures/saturn.png'));
  const uranus = useImage(require('../assets/textures/uranus.png'));
  const neptune = useImage(require('../assets/textures/neptune.png'));

  return {
    mercury,
    venus,
    earth,
    mars,
    jupiter,
    saturn,
    uranus,
    neptune,
  };
}

export function getPlanetTexture(textures: PlanetTextureMap, planetId: string): SkImage | null {
  return textures[planetId] ?? null;
}

export const PLANET_TEXTURE_IDS = SOLAR_SYSTEM_PLANETS.map((planet) => planet.id);
