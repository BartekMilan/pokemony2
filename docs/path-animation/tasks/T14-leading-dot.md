# T14 — `LeadingDot` at the drawing tip

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

A small cream circle that rides at the very front of the drawing tip. This is the **highest-uncertainty task** in the plan because `Skia.PathMeasure` may or may not be worklet-safe on the installed RN-Skia version.

## Depends on

[T06](./T06-waypoint-progress.md) (for `TOTAL_LENGTH`), [T07](./T07-progress-hook.md).

## Touches

- creates `components/path-animation/layers/LeadingDot.tsx`
- edits `app/(tabs)/path-animation.tsx` (compose order)

## Interface

```ts
import type { SharedValue } from 'react-native-reanimated';
export function LeadingDot(props: { progress: SharedValue<number> }): JSX.Element;
```

## Approach A — Try worklet-safe PathMeasure first

```tsx
import { BlurMask, Circle, Skia } from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import { PATH_D, TOTAL_LENGTH } from '../data/pathDefinition';

export function LeadingDot({ progress }: { progress: SharedValue<number> }) {
  const path = useMemo(() => Skia.Path.MakeFromSVGString(PATH_D)!, []);
  const pm = useMemo(() => Skia.PathMeasure(path, false, 1), [path]);

  const cx = useDerivedValue(() => {
    const [point] = pm.getPosTan(progress.value * TOTAL_LENGTH);
    return point.x;
  });
  const cy = useDerivedValue(() => {
    const [point] = pm.getPosTan(progress.value * TOTAL_LENGTH);
    return point.y;
  });

  return (
    <Circle cx={cx} cy={cy} r={6} color="#fff8dc">
      <BlurMask blur={2} style="solid" />
    </Circle>
  );
}
```

Test it. If you see runtime errors about "PathMeasure is not a worklet" or "cannot serialize across worklets," fall back to Approach B.

## Approach B — Fallback: precomputed JS-side lookup table

Build the table once at module load, then read it from a pure worklet:

```tsx
import { Circle, BlurMask } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import { PATH_D, TOTAL_LENGTH, WAYPOINTS } from '../data/pathDefinition';

// Pre-sampled (t, x, y) table at module load — N points along the same Catmull-Rom path.
// You can either: (a) re-derive control points and sample (mirrors T05/T06 math); or
// (b) use Skia at module load (NOT in a worklet) to call getPosTan once per sample.
// Pick (a) to keep this file independent of Skia at load time.
const N = 1000;
const SAMPLES: { x: number; y: number }[] = (() => {
  // Build the same Catmull-Rom segments as T05, sample at evenly-spaced arc length.
  // ... (re-use the same helpers; consider extracting to a small util in T05 and importing here)
  return /* array of N points along the path */;
})();

export function LeadingDot({ progress }: { progress: SharedValue<number> }) {
  const cx = useDerivedValue(() => {
    'worklet';
    const i = Math.min(N - 1, Math.max(0, Math.floor(progress.value * (N - 1))));
    return SAMPLES[i].x;
  });
  const cy = useDerivedValue(() => {
    'worklet';
    const i = Math.min(N - 1, Math.max(0, Math.floor(progress.value * (N - 1))));
    return SAMPLES[i].y;
  });
  return (
    <Circle cx={cx} cy={cy} r={6} color="#fff8dc">
      <BlurMask blur={2} style="solid" />
    </Circle>
  );
}
```

**Note**: building the SAMPLES table by arc-length (so each sample is roughly equidistant along the path) gives the smoothest dot motion. If that's complex, sampling by parameter `t` (just evenly spaced t values per segment) is acceptable for v1 — the dot will move slightly faster on shorter segments.

## Compose

Render `<LeadingDot progress={progress} />` LAST inside the Canvas (top of all layers).

## Verify

- A cream dot rides the very front of the drawn line throughout the loop.
- The dot's position visually matches the tip — no lag, no drift.
- `npx tsc --noEmit` passes.

## Report

In your final report, state explicitly which approach was used (A or B). If A, mention any warnings or quirks seen.

## Anti-goals

- Do NOT add tangent rotation here. That's optional T15.
- Do NOT try to share the `pm` instance with other components — keep it local.
