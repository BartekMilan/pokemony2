# T09 — Animate `DrawnPath` via `progress`

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md) — pay special attention to the **reanimated + Skia bridge pattern** section.

## Goal

Convert `DrawnPath` to draw progressively as `progress` ticks 0→1. This is the core teaching moment for `useDerivedValue` + Skia `path.trim`.

## Depends on

[T07](./T07-progress-hook.md), [T08](./T08-static-path.md).

## Touches

- edits `components/path-animation/layers/DrawnPath.tsx`
- edits `app/(tabs)/path-animation.tsx`

## Interface (final for this component)

```ts
import type { SharedValue } from 'react-native-reanimated';
export function DrawnPath(props: { progress: SharedValue<number> }): JSX.Element;
```

## Implementation

`DrawnPath.tsx`:

```tsx
import { Path, Skia } from '@shopify/react-native-skia';
import { type SharedValue, useDerivedValue } from 'react-native-reanimated';
import { PATH_D } from '../data/pathDefinition';

export function DrawnPath({ progress }: { progress: SharedValue<number> }) {
  const trimmedPath = useDerivedValue(() => {
    const p = Skia.Path.MakeFromSVGString(PATH_D)!.copy();
    p.trim(0, progress.value, false);
    return p;
  });

  return (
    <Path
      path={trimmedPath}
      style="stroke"
      strokeWidth={4}
      color="#fff8dc"
      strokeCap="round"
      strokeJoin="round"
    />
  );
}
```

`app/(tabs)/path-animation.tsx`: import `useDrawProgress`, instantiate `const progress = useDrawProgress();`, pass to `<DrawnPath progress={progress} />`.

## Verify

- Open the "Path" tab.
- The cream line draws itself from Harbor to Treasure over ~5 seconds, then jumps back to empty and re-draws. Repeats indefinitely.
- No flicker, no kinks, no missing segments.
- `npx tsc --noEmit` passes.

## Notes for the agent

- The `trim` call is *geometric*, not visual — it returns a sub-path. Unlike SVG's stroke-dasharray, no leftover invisible portion.
- `MakeFromSVGString` can technically return `null` if the string is malformed; in our case `PATH_D` is generated from T05 so the `!` non-null assertion is fine. If you'd rather be safe, add an early-return `if (!p) return Skia.Path.Make();`.

## Anti-goals

- Do NOT add glow, blur, comet, or flares here. Those are T10+.
- Do NOT move `progress` ownership out of the tab screen yet — `Scene` is extracted in T17.
