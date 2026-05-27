# T08 — Render the static full path

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Before animating, prove the path data renders correctly as a static line. This task does NOT use `progress` yet.

## Depends on

[T03](./T03-smoke-test.md), [T05](./T05-path-string.md).

## Touches

- creates `components/path-animation/layers/DrawnPath.tsx`
- edits `app/(tabs)/path-animation.tsx`

## Interface (temporary for this task)

```ts
export function DrawnPath();   // no props yet — T09 adds progress
```

## Implementation

`DrawnPath.tsx`:

```tsx
import { Path } from '@shopify/react-native-skia';
import { PATH_D } from '../data/pathDefinition';

export function DrawnPath() {
  return (
    <Path
      path={PATH_D}
      style="stroke"
      strokeWidth={4}
      color="#fff8dc"
      strokeCap="round"
      strokeJoin="round"
    />
  );
}
```

`app/(tabs)/path-animation.tsx`: replace the tomato `<Rect>` with `<DrawnPath />` inside the existing `<Canvas>`.

## Verify

- "Path" tab now shows a cream-colored smooth curve passing through all 6 waypoints (Harbor in lower-left → Treasure in upper-right).
- No errors in Metro logs.
- `npx tsc --noEmit` passes.

## Anti-goals

- Do NOT add `progress`, `useDerivedValue`, or `trim` here. T09 owns that.
- Do NOT add any glow, blur, or other layers.
