# T06 — Compute arc-length progress per waypoint

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

For each waypoint, compute the fractional progress (0..1) at which the drawing tip reaches it. Needed by `WaypointFlare` (T12) to know "when do I fire."

## Depends on

[T05](./T05-path-string.md).

## Touches

Edits `components/path-animation/data/pathDefinition.ts` (adds to the file).

## Interface

```ts
export const TOTAL_LENGTH: number;
export const WAYPOINT_PROGRESS: number[];
// length === WAYPOINTS.length, monotonically increasing
// WAYPOINT_PROGRESS[0] === 0
// WAYPOINT_PROGRESS[last] within 0.001 of 1.0
```

## Algorithm

Each waypoint sits on a segment boundary in the Catmull-Rom-derived path. Computing the cumulative arc-length up to each waypoint requires numerically integrating each cubic Bezier segment.

**Two acceptable approaches — pick the simpler one that works for you:**

### Approach A — Pure JS numeric integration (preferred, no Skia dependency)

For each segment, recompute the same control points `c1, c2, p2` you used in T05 (refactor T05 to expose a helper if needed). Sample N=100 points along the cubic Bezier using the standard parametric formula:

```ts
function cubicBezierPoint(p0: Pt, c1: Pt, c2: Pt, p1: Pt, t: number): Pt {
  const u = 1 - t;
  const x = u*u*u*p0.x + 3*u*u*t*c1.x + 3*u*t*t*c2.x + t*t*t*p1.x;
  const y = u*u*u*p0.y + 3*u*u*t*c1.y + 3*u*t*t*c2.y + t*t*t*p1.y;
  return { x, y };
}
```

Sum chord lengths between consecutive sampled points → segment length. Accumulate across segments → cumulative length at each waypoint. Divide each by the final total → `WAYPOINT_PROGRESS`.

### Approach B — Use Skia's PathMeasure at module load

```ts
import { Skia } from '@shopify/react-native-skia';
const path = Skia.Path.MakeFromSVGString(PATH_D)!;
const pm = Skia.PathMeasure(path, false, 1);
const TOTAL_LENGTH = pm.getLength();
// then walk the path with getPosTan() at increments, find closest sample to each waypoint
```

This couples module-load time to Skia being initialized, which is usually fine but can cause issues in test environments. Prefer A.

## Implementation sketch (Approach A)

```ts
const SAMPLES_PER_SEGMENT = 100;
let cumulative = 0;
const cumulativeAtWaypoint: number[] = [0];

for (let i = 0; i < WAYPOINTS.length - 1; i++) {
  const p0 = WAYPOINTS[i - 1] ?? WAYPOINTS[i];
  const p1 = WAYPOINTS[i];
  const p2 = WAYPOINTS[i + 1];
  const p3 = WAYPOINTS[i + 2] ?? WAYPOINTS[i + 1];
  const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
  const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };

  let prev = p1;
  let segLen = 0;
  for (let s = 1; s <= SAMPLES_PER_SEGMENT; s++) {
    const t = s / SAMPLES_PER_SEGMENT;
    const cur = cubicBezierPoint(p1, c1, c2, p2, t);
    segLen += Math.hypot(cur.x - prev.x, cur.y - prev.y);
    prev = cur;
  }
  cumulative += segLen;
  cumulativeAtWaypoint.push(cumulative);
}

export const TOTAL_LENGTH = cumulative;
export const WAYPOINT_PROGRESS = cumulativeAtWaypoint.map(l => l / TOTAL_LENGTH);
```

## Verify

- `WAYPOINT_PROGRESS[0] === 0`.
- `Math.abs(WAYPOINT_PROGRESS[WAYPOINT_PROGRESS.length - 1] - 1) < 0.001`.
- All entries strictly increasing.
- `TOTAL_LENGTH > 0` and looks like a reasonable pixel length (a few hundred to ~1500 for our 400×600 layout).
- `npx tsc --noEmit` passes.

## Anti-goals

- Do NOT export the helper functions (`cubicBezierPoint`, etc.) — keep them module-local.
- Do NOT include this in a worklet. Module-load JS thread is the right home.
