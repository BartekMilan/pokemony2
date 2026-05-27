# T10 — `GlowTrail` layer (soft glow under the drawn path)

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

A wider, blurred, lower-opacity copy of the trimmed path rendered *underneath* `DrawnPath` to create a soft halo along the entire drawn portion.

## Depends on

[T09](./T09-animated-path.md).

## Touches

- creates `components/path-animation/layers/GlowTrail.tsx`
- edits `app/(tabs)/path-animation.tsx` (compose order)

## Interface

```ts
import type { SharedValue } from 'react-native-reanimated';
export function GlowTrail(props: { progress: SharedValue<number> }): JSX.Element;
```

## Implementation

```tsx
import { BlurMask, Group, Path, Skia } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import { PATH_D } from '../data/pathDefinition';

export function GlowTrail({ progress }: { progress: SharedValue<number> }) {
  const trimmedPath = useDerivedValue(() => {
    const p = Skia.Path.MakeFromSVGString(PATH_D)!.copy();
    p.trim(0, progress.value, false);
    return p;
  });

  return (
    <Group>
      <Path
        path={trimmedPath}
        style="stroke"
        strokeWidth={14}
        color="#fff8dc"
        opacity={0.35}
        strokeCap="round"
        strokeJoin="round"
      >
        <BlurMask blur={12} style="solid" />
      </Path>
    </Group>
  );
}
```

## Compose

In `app/(tabs)/path-animation.tsx`, render `<GlowTrail progress={progress} />` **before** `<DrawnPath progress={progress} />` so the glow appears underneath the crisp line.

```tsx
<Canvas style={{ flex: 1 }}>
  <GlowTrail progress={progress} />
  <DrawnPath progress={progress} />
</Canvas>
```

## Verify

- The cream line now has a visible soft halo behind/around it.
- Halo length matches the drawn-line length: short halo when the line is just starting, full halo at the end of the loop.
- Halo is noticeable but not overwhelming — the crisp cream line still reads cleanly on top.
- `npx tsc --noEmit` passes.

## Anti-goals

- Do NOT touch `DrawnPath` — it's a sibling, not modified.
- Do NOT introduce new colors or palette values beyond what's in `ARCHITECTURE.md`.
