# T07 — `useDrawProgress` hook

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Encapsulate the looping animated `progress` value so the `Scene` doesn't have to know about it.

## Depends on

[T02](./T02-scaffold-dirs.md). Independent of T04–T06 — can run in parallel.

## Touches

Creates `components/path-animation/hooks/useDrawProgress.ts`.

## Interface

```ts
import type { SharedValue } from 'react-native-reanimated';
export function useDrawProgress(durationMs?: number): SharedValue<number>;
```

## Implementation

```ts
import { useEffect } from 'react';
import {
  cancelAnimation,
  Easing,
  SharedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export function useDrawProgress(durationMs: number = 5000): SharedValue<number> {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: durationMs, easing: Easing.inOut(Easing.cubic) }),
      -1,    // infinite
      false  // restart from 0 each loop (true would yo-yo)
    );
    return () => cancelAnimation(progress);
  }, [durationMs]);
  return progress;
}
```

## Verify

- `npx tsc --noEmit` passes.
- Optional smoke test in any screen: render `<Text>{progress.value.toFixed(2)}</Text>` inside a `useAnimatedReaction` log — should tick from 0.00 to 1.00 and reset.

## Anti-goals

- Do NOT add any other animation logic, callbacks, or knobs. Just the loop.
- Do NOT export the easing or other internals.
