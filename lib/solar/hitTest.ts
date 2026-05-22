import { SOLAR_SYSTEM_PLANETS } from '../../data/planets';
import { computeAllPlanetScreenStates } from './orbitalMath';
import { computeEffectiveWorldTransform } from './worldTransform';

export function hitTestPlanetAtPoint(
  tapX: number,
  tapY: number,
  time: number,
  centerX: number,
  centerY: number,
  worldScale: number,
  panX: number,
  panY: number,
  focusPlanetIndex: number,
  focusProgress: number,
): string | null {
  'worklet';
  const transform = computeEffectiveWorldTransform(
    worldScale,
    panX,
    panY,
    focusPlanetIndex,
    focusProgress,
    time,
    centerX,
    centerY,
  );

  const states = computeAllPlanetScreenStates(
    SOLAR_SYSTEM_PLANETS,
    time,
    centerX,
    centerY,
    transform.worldScale,
    transform.panX,
    transform.panY,
  );

  const sorted = states.slice().sort((a, b) => b.z - a.z);

  for (let i = 0; i < sorted.length; i++) {
    const state = sorted[i];
    const dx = tapX - state.screenX;
    const dy = tapY - state.screenY;
    const hitRadius = state.drawRadius * 1.15;
    if (dx * dx + dy * dy <= hitRadius * hitRadius) {
      return state.id;
    }
  }

  return null;
}
