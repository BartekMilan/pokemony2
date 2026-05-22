import { SOLAR_SYSTEM_PLANETS } from '../../data/planets';
import type { PlanetConfig } from '../../types/planet';
import { computePlanetScreenState } from './orbitalMath';

/** Default zoom — inner system (sun + Mercury–Mars) fits; outer planets require pan. */
export const DEFAULT_WORLD_SCALE = 0.58;
export const MIN_WORLD_SCALE = 0.25;
export const MAX_WORLD_SCALE = 8;

const FOCUS_BASE_SCALE = 2.85;
const REFERENCE_PLANET_SIZE = 28;
const PAN_PADDING = 80;

export type WorldTransform = {
  worldScale: number;
  panX: number;
  panY: number;
};

export function clampWorldScale(scale: number): number {
  'worklet';
  return Math.min(MAX_WORLD_SCALE, Math.max(MIN_WORLD_SCALE, scale));
}

export function computeWorldPanExtent(): number {
  'worklet';
  let maxExtent = 0;
  for (let i = 0; i < SOLAR_SYSTEM_PLANETS.length; i++) {
    const planet = SOLAR_SYSTEM_PLANETS[i];
    const extent = planet.orbitRadius + planet.size / 2;
    if (extent > maxExtent) {
      maxExtent = extent;
    }
  }
  return maxExtent + PAN_PADDING;
}

export function clampPan(panX: number, panY: number): { panX: number; panY: number } {
  'worklet';
  const limit = computeWorldPanExtent();
  return {
    panX: Math.min(limit, Math.max(-limit, panX)),
    panY: Math.min(limit, Math.max(-limit, panY)),
  };
}

function focusTargetScale(planet: PlanetConfig): number {
  'worklet';
  return clampWorldScale(FOCUS_BASE_SCALE * (REFERENCE_PLANET_SIZE / planet.size));
}

export function computeEffectiveWorldTransform(
  worldScale: number,
  panX: number,
  panY: number,
  focusPlanetIndex: number,
  focusProgress: number,
  time: number,
  centerX: number,
  centerY: number,
): WorldTransform {
  'worklet';
  if (focusPlanetIndex < 0 || focusProgress <= 0) {
    return { worldScale, panX, panY };
  }

  const planet = SOLAR_SYSTEM_PLANETS[focusPlanetIndex];
  if (!planet) {
    return { worldScale, panX, panY };
  }

  const orbital = computePlanetScreenState(planet, time, centerX, centerY, 1, 0, 0);
  const targetPanX = -orbital.x;
  const targetPanY = -orbital.y;
  const targetScale = focusTargetScale(planet);
  const t = focusProgress;

  return {
    worldScale: worldScale + (targetScale - worldScale) * t,
    panX: panX + (targetPanX - panX) * t,
    panY: panY + (targetPanY - panY) * t,
  };
}
