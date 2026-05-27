# T03 — Skia smoke-test screen + new tab

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Add a new tab "Path" that renders a minimal Skia `Canvas` with one colored `Rect`. Proves the Skia install works end-to-end.

## Depends on

[T01](./T01-install-skia.md), [T02](./T02-scaffold-dirs.md).

## Touches

- creates `app/(tabs)/path-animation.tsx`
- edits `app/(tabs)/_layout.tsx` to add a new tab entry

## Pre-step

Read `app/(tabs)/_layout.tsx` first. Match its existing pattern exactly — it may use explicit `<Tabs.Screen>` entries OR rely on file-based discovery. Add the new tab in whichever style is already present. Preserve every existing entry verbatim.

## Implementation

`app/(tabs)/path-animation.tsx`:

```tsx
import { View } from 'react-native';
import { Canvas, Rect } from '@shopify/react-native-skia';

export default function PathAnimationScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 1 }}>
        <Rect x={50} y={50} width={100} height={100} color="tomato" />
      </Canvas>
    </View>
  );
}
```

Tab entry in `_layout.tsx`: `name="path-animation"`, `title="Path"`. If the layout uses an `icon` prop for other tabs, use a placeholder icon consistent with their style.

## Verify

- App launches with `npx expo start`.
- "Path" tab is visible in the tab bar.
- Tapping it shows a tomato-colored square in the upper-left.
- No errors in Metro logs.

## Anti-goals

- Do NOT add any animations, shared values, or extra Skia primitives. Just the rect.
