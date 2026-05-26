export type Star = { x: number; y: number; r: number; opacity: number };

export const STARS: Star[] = Array.from({ length: 150 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.5 + Math.random() * 1.5,
  opacity: 0.3 + Math.random() * 0.6,
}));
