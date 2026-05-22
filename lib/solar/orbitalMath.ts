import type { PlanetConfig } from '../../types/planet';

/** Perspective strength for orbital Z (cinematic units). */
export const DEPTH_FACTOR = 0.0025;

export type PlanetScreenState = {
  id: string;
  planetIndex: number;
  x: number;
  y: number;
  z: number;
  screenX: number;
  screenY: number;
  drawRadius: number;
  color: string;
  spinAngle: number;
  hasRings: boolean;
  hasAtmosphere: boolean;
};

export function computeOrbitalAngle(
  time: number,
  angularVelocity: number,
  initialAngle: number,
): number {
  'worklet';
  return time * angularVelocity + initialAngle;
}

export function computeOrbitalPosition3D(
  orbitRadius: number,
  angle: number,
  inclination: number,
): { x: number; y: number; z: number } {
  'worklet';
  const x = orbitRadius * Math.cos(angle);
  const y = orbitRadius * Math.sin(angle) * Math.cos(inclination);
  const z = orbitRadius * Math.sin(angle) * Math.sin(inclination);
  return { x, y, z };
}

export function computePerspectiveScale(z: number, depthFactor = DEPTH_FACTOR): number {
  'worklet';
  return 1 / (1 + z * depthFactor);
}

export function projectToScreen(
  x: number,
  y: number,
  z: number,
  centerX: number,
  centerY: number,
  planetSize: number,
  worldScale = 1,
  panX = 0,
  panY = 0,
  depthFactor = DEPTH_FACTOR,
): { screenX: number; screenY: number; drawRadius: number; scale: number } {
  'worklet';
  const scale = computePerspectiveScale(z, depthFactor);
  const screenX = centerX + (x + panX) * worldScale;
  const screenY = centerY + (y + panY) * worldScale;
  const drawRadius = (planetSize / 2) * scale * worldScale;
  return { screenX, screenY, drawRadius, scale };
}

export function computePlanetScreenState(
  config: PlanetConfig,
  time: number,
  centerX: number,
  centerY: number,
  worldScale = 1,
  panX = 0,
  panY = 0,
): PlanetScreenState {
  'worklet';
  const angle = computeOrbitalAngle(
    time,
    config.angularVelocity,
    config.initialAngle ?? 0,
  );
  const inclination = config.orbitInclination ?? 0;
  const { x, y, z } = computeOrbitalPosition3D(config.orbitRadius, angle, inclination);
  const { screenX, screenY, drawRadius } = projectToScreen(
    x,
    y,
    z,
    centerX,
    centerY,
    config.size,
    worldScale,
    panX,
    panY,
  );

  return {
    id: config.id,
    planetIndex: -1,
    x,
    y,
    z,
    screenX,
    screenY,
    drawRadius,
    color: config.color,
    spinAngle: time * config.spinVelocity + (config.initialSpinAngle ?? 0),
    hasRings: config.rings ?? false,
    hasAtmosphere: config.atmosphere ?? false,
  };
}

export function computeAllPlanetScreenStates(
  planets: PlanetConfig[],
  time: number,
  centerX: number,
  centerY: number,
  worldScale = 1,
  panX = 0,
  panY = 0,
): PlanetScreenState[] {
  'worklet';
  const states: PlanetScreenState[] = [];
  for (let i = 0; i < planets.length; i++) {
    states.push({
      ...computePlanetScreenState(planets[i], time, centerX, centerY, worldScale, panX, panY),
      planetIndex: i,
    });
  }
  return states;
}

export function sortPlanetStatesByZ(states: PlanetScreenState[]): PlanetScreenState[] {
  'worklet';
  return states.slice().sort((a, b) => a.z - b.z);
}
