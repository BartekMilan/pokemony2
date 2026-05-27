# T12 — `WaypointFlare` component (single waypoint)

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

A pulsing circle that flares as the drawing tip approaches and crosses a specific waypoint, then fades. One instance per waypoint will be rendered in T13.

## Depends on

[T06](./T06-waypoint-progress.md), [T07](./T07-progress-hook.md).

## Touches

Creates `components/path-animation/layers/WaypointFlare.tsx`.

## Interface

```ts
import type { SharedValue } from 'react-native-reanimated';
export function WaypointFlare(props: {
  progress: SharedValue<number>;
  position: { x: number; y: number };
  triggerAt: number;   // 0..1 — typically a value from WAYPOINT_PROGRESS[i]
}): JSX.Element;
```

## Implementation

```tsx
import { BlurMask, Circle, Group } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';

const APPROACH = 0.06;  // window before triggerAt where flare ramps up
const DECAY    = 0.10;  // window after triggerAt where flare fades out
const MAX_R    = 22;
const BASE_R   = 4;

export function WaypointFlare({
  progress,
  position,
  triggerAt,
}: {
  progress: SharedValue<number>;
  position: { x: number; y: number };
  triggerAt: number;
}) {
  // phase ∈ [0, 1]: 0 = invisible, 1 = full bloom at triggerAt
  const phase = useDerivedValue(() => {
    const d = progress.value - triggerAt;
    if (d < -APPROACH || d > DECAY) return 0;
    if (d <= 0) return (d + APPROACH) / APPROACH;   // approach ramp
    return 1 - d / DECAY;                            // decay ramp
  });

  const radius  = useDerivedValue(() => BASE_R + phase.value * (MAX_R - BASE_R));
  const opacity = useDerivedValue(() => phase.value);

  return (
    <Group>
      <Circle cx={position.x} cy={position.y} r={radius} opacity={opacity} color="#ffe28a">
        <BlurMask blur={8} style="solid" />
      </Circle>
    </Group>
  );
}
```

**Optional polish** (only if quick): add a `<RadialGradient>` as a child of the Circle for a softer corona. If unsure, skip — the BlurMask alone reads well.

## Verify

- Render `<WaypointFlare progress={progress} position={{x: 200, y: 300}} triggerAt={0.5} />` in isolation (or temporarily in the screen).
- During the loop: nothing visible until progress nears 0.44, then a bright yellow circle blooms at (200, 300), peaks at progress = 0.5, fades by progress = 0.6.
- `npx tsc --noEmit` passes.

## Anti-goals

- Do NOT render multiple flares from this file. T13 owns the `WAYPOINTS.map(...)` loop.
- Do NOT hardcode any waypoint coordinates here — the component is generic.
