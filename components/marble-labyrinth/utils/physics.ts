import { runOnJS } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import type { Goal, Wall } from '../types/level';

export const FRICTION = 0.985;
export const SENSITIVITY = 0.35;
export const WALL_BOUNCE_DAMPING = 0.6;

const BOUNCE_DEBOUNCE_MS = 100;

export function clampAndBounce(
  pos: SharedValue<number>,
  vel: SharedValue<number>,
  min: number,
  max: number,
): void {
  'worklet';
  if (pos.value < min) {
    pos.value = min;
    vel.value *= -WALL_BOUNCE_DAMPING;
  } else if (pos.value > max) {
    pos.value = max;
    vel.value *= -WALL_BOUNCE_DAMPING;
  }
}

export function isInGoal(x: number, y: number, goal: Goal): boolean {
  'worklet';
  const dx = x - goal.x;
  const dy = y - goal.y;
  return dx * dx + dy * dy <= goal.r * goal.r;
}

export function checkCollisions(
  walls: Wall[],
  radius: number,
  posX: SharedValue<number>,
  posY: SharedValue<number>,
  velX: SharedValue<number>,
  velY: SharedValue<number>,
  lastBounceTime: SharedValue<number>,
  onWallHit?: () => void,
): void {
  'worklet';

  for (let i = 0; i < walls.length; i++) {
    const wall = walls[i];
    const closestX = Math.max(wall.x, Math.min(posX.value, wall.x + wall.w));
    const closestY = Math.max(wall.y, Math.min(posY.value, wall.y + wall.h));

    const dx = posX.value - closestX;
    const dy = posY.value - closestY;
    const distSq = dx * dx + dy * dy;
    const radiusSq = radius * radius;

    if (distSq >= radiusSq) {
      continue;
    }

    const penLeft = posX.value - wall.x;
    const penRight = wall.x + wall.w - posX.value;
    const penTop = posY.value - wall.y;
    const penBottom = wall.y + wall.h - posY.value;

    if (distSq === 0) {
      const minPen = Math.min(penLeft, penRight, penTop, penBottom);
      if (minPen === penLeft) {
        posX.value = wall.x - radius;
        velX.value *= -WALL_BOUNCE_DAMPING;
      } else if (minPen === penRight) {
        posX.value = wall.x + wall.w + radius;
        velX.value *= -WALL_BOUNCE_DAMPING;
      } else if (minPen === penTop) {
        posY.value = wall.y - radius;
        velY.value *= -WALL_BOUNCE_DAMPING;
      } else {
        posY.value = wall.y + wall.h + radius;
        velY.value *= -WALL_BOUNCE_DAMPING;
      }
    } else {
      const onVerticalFace =
        (closestX === wall.x || closestX === wall.x + wall.w) &&
        closestY > wall.y &&
        closestY < wall.y + wall.h;
      const onHorizontalFace =
        (closestY === wall.y || closestY === wall.y + wall.h) &&
        closestX > wall.x &&
        closestX < wall.x + wall.w;

      if (onVerticalFace) {
        posX.value =
          closestX === wall.x ? wall.x - radius : wall.x + wall.w + radius;
        velX.value *= -WALL_BOUNCE_DAMPING;
      } else if (onHorizontalFace) {
        posY.value =
          closestY === wall.y ? wall.y - radius : wall.y + wall.h + radius;
        velY.value *= -WALL_BOUNCE_DAMPING;
      } else {
        const penX = Math.min(penLeft, penRight);
        const penY = Math.min(penTop, penBottom);
        if (penX < penY) {
          posX.value = penLeft < penRight ? wall.x - radius : wall.x + wall.w + radius;
          velX.value *= -WALL_BOUNCE_DAMPING;
        } else {
          posY.value = penTop < penBottom ? wall.y - radius : wall.y + wall.h + radius;
          velY.value *= -WALL_BOUNCE_DAMPING;
        }
      }
    }

    if (onWallHit) {
      const now = Date.now();
      if (now - lastBounceTime.value > BOUNCE_DEBOUNCE_MS) {
        lastBounceTime.value = now;
        runOnJS(onWallHit)();
      }
    }
  }
}
