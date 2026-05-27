# T15 — Tangent-based rotation for the leading dot (OPTIONAL)

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Make the leading "dot" actually an arrow/triangle that rotates to point along the direction of motion. Purely cosmetic — skip if you'd rather move on to T16.

## Depends on

[T14](./T14-leading-dot.md).

## Touches

Edits `components/path-animation/layers/LeadingDot.tsx`.

## Implementation sketch

Replace the `<Circle>` with a small triangular `<Path>` (an arrowhead pointing in +x by default), wrapped in a `<Group transform={...}>` whose rotation is derived from the tangent vector returned by `pm.getPosTan(...)` (Approach A from T14) or precomputed in the SAMPLES table (Approach B).

```tsx
import { Group, Path, Skia, BlurMask } from '@shopify/react-native-skia';
import { useDerivedValue } from 'react-native-reanimated';

// A small arrowhead shape, tip at (8,0), base at (-4, -5) and (-4, 5). Renders +x facing.
const ARROW = Skia.Path.Make();
ARROW.moveTo(8, 0); ARROW.lineTo(-4, -5); ARROW.lineTo(-4, 5); ARROW.close();

// Inside the component:
const transform = useDerivedValue(() => {
  // get position and tangent at progress
  // const [{x, y}, {x: tx, y: ty}] = pm.getPosTan(progress.value * TOTAL_LENGTH);
  // const angle = Math.atan2(ty, tx);
  return [
    { translateX: pos.x },
    { translateY: pos.y },
    { rotate: angle },
  ];
});

return (
  <Group transform={transform}>
    <Path path={ARROW} color="#fff8dc">
      <BlurMask blur={2} style="solid" />
    </Path>
  </Group>
);
```

(Adapt to whichever T14 approach is in place — pull the tangent from `getPosTan` if A, from a precomputed table if B.)

## Verify

- The arrow tip points along the path direction. On curves, rotation is smooth (no jitter, no snapping).

## Skip criteria

Skip this task entirely if T14 used Approach B without storing tangents, or if the user prefers the simple dot.

## Anti-goals

- Do NOT change the dot's color, size, or composition position. This task is rotation only.
