# T05 — Generate the SVG path string from waypoints

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Convert the `WAYPOINTS` array into an SVG `d` string using Catmull-Rom-to-cubic-Bezier interpolation.

## Depends on

[T04](./T04-waypoints.md).

## Touches

Edits `components/path-animation/data/pathDefinition.ts` (adds to the file).

## Interface

```ts
export const PATH_D: string;   // starts with "M", contains exactly 5 "C" commands
```

## Algorithm (Catmull-Rom → cubic Bezier, tension τ = 0.5)

For each segment from waypoint `p1` to waypoint `p2`, with neighbors `p0` (previous) and `p3` (next):

```
c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 }
c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 }
segment = ` C ${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`
```

Edge cases:
- For the first segment (`i = 0`): use `p0 = p1` (duplicate the start).
- For the last segment (`i = WAYPOINTS.length - 2`): use `p3 = p2` (duplicate the end).

Prefix the whole thing with `M ${WAYPOINTS[0].x},${WAYPOINTS[0].y}`.

## Implementation sketch

```ts
function buildPathD(points: Waypoint[]): string {
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
  }
  return d;
}

export const PATH_D = buildPathD(WAYPOINTS);
```

## Verify

- `PATH_D.startsWith('M')` is true.
- `PATH_D.match(/C/g)?.length === 5` (6 points → 5 segments).
- `npx tsc --noEmit` passes.
- Log `PATH_D` once and eyeball the numbers look sane (no NaN, no Infinity).

## Anti-goals

- Do NOT compute arc length here. That's T06.
- Do NOT import Skia in this task.
