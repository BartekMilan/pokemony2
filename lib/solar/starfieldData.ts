export type StarPoint = {
  x: number;
  y: number;
  radius: number;
  opacity: number;
};

/** Deterministic PRNG for stable star positions across renders. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createStarfield(
  width: number,
  height: number,
  count = 180,
  seed = 0x5f3759df,
): StarPoint[] {
  const rand = mulberry32(seed);
  const stars: StarPoint[] = [];

  for (let i = 0; i < count; i++) {
    const roll = rand();
    stars.push({
      x: rand() * width,
      y: rand() * height,
      radius: roll > 0.92 ? 1.4 : roll > 0.7 ? 1 : 0.6,
      opacity: 0.25 + rand() * 0.65,
    });
  }

  return stars;
}
