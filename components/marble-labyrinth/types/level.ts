export type Wall = { x: number; y: number; w: number; h: number };

export type Goal = { x: number; y: number; r: number };

export type Level = {
  walls: Wall[];
  start: { x: number; y: number };
  goal: Goal;
};
