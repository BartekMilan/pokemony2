import type { Level } from '../types/level';

export const levels: Level[] = [
  // Level 1 — open L-shaped corridor, wide passages
  {
    walls: [
      { x: 100, y: 0, w: 24, h: 320 },
      { x: 0, y: 180, w: 180, h: 24 },
    ],
    start: { x: 50, y: 80 },
    goal: { x: 250, y: 460, r: 22 },
  },
  // Level 2 — S-curve with internal walls
  {
    walls: [
      { x: 160, y: 0, w: 24, h: 220 },
      { x: 0, y: 200, w: 160, h: 24 },
      { x: 116, y: 320, w: 24, h: 200 },
    ],
    start: { x: 50, y: 50 },
    goal: { x: 240, y: 480, r: 20 },
  },
  // Level 3 — narrow choke points + dead-end branch
  {
    walls: [
      { x: 0, y: 130, w: 88, h: 20 },
      { x: 148, y: 130, w: 152, h: 20 },
      { x: 196, y: 130, w: 20, h: 180 },
      { x: 108, y: 270, w: 108, h: 20 },
      { x: 56, y: 350, w: 20, h: 130 },
    ],
    start: { x: 40, y: 60 },
    goal: { x: 250, y: 450, r: 18 },
  },
];
