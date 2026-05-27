# T11 — `CometGlow` layer (bright windowed glow at the leading tip)

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

A short, bright, heavily-blurred segment riding at the leading edge of the drawing — the "comet head." Uses a *windowed* `trim` (a sliding range of the path) rather than the full drawn portion.

## Depends on

[T09](./T09-animated-path.md). Can be done after T10 or in parallel — they're independent layers.

## Touches

- creates `components/path-animation/layers/CometGlow.tsx`
- edits `app/(tabs)/path-animation.tsx` (compose order)

## Interface

```ts
import type { SharedValue } from 'react-native-reanimated';
export function CometGlow(props: {
  progress: SharedValue<number>;
  windowSize?: number;   // 0..1 fraction of total path. Default 0.08.
}): JSX.Element;
```

## Implementation

```tsx
import { BlurMask, Group, Path, Skia } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import { PATH_D } from '../data/pathDefinition';

export function CometGlow({
  progress,
  windowSize = 0.08,
}: { progress: SharedValue<number>; windowSize?: number }) {
  const cometPath = useDerivedValue(() => {
    const p = Skia.Path.MakeFromSVGString(PATH_D)!.copy();
    const end = progress.value;
    const start = Math.max(0, end - windowSize);
    // Edge case: when progress is exactly 0, start === end and trim would be empty.
    if (end <= 0) return Skia.Path.Make();
    p.trim(start, end, false);
    return p;
  });

  return (
    <Group blendMode="plus">
      <Path
        path={cometPath}
        style="stroke"
        strokeWidth={18}
        color="#ffd66b"
        opacity={0.9}
        strokeCap="round"
        strokeJoin="round"
      >
        <BlurMask blur={22} style="solid" />
      </Path>
    </Group>
  );
}
```

## Compose

Render order in `app/(tabs)/path-animation.tsx`:

```tsx
<Canvas style={{ flex: 1 }}>
  <GlowTrail progress={progress} />
  <CometGlow progress={progress} />
  <DrawnPath progress={progress} />
</Canvas>
```

(So: trail underneath, comet above trail, crisp line on top.)

## Verify

- A bright warm-yellow glow follows the leading tip of the cream line throughout the loop.
- The glow is clearly brighter than the `GlowTrail` halo behind it (the `blendMode="plus"` adds to the trail's brightness).
- Glow window appears to be roughly 8% of the path length (~30–50 logical units along the line).
- `npx tsc --noEmit` passes.

## Anti-goals

- Do NOT remove the trail or path. Three layers should be visible simultaneously.
- Do NOT change the `blendMode` — `plus` is the additive light effect that makes overlapping glows brighter.
