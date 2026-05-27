# T17 — Extract `Scene` component

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Move the composition out of the tab screen into a dedicated `Scene` component. The tab screen becomes a thin wrapper. Result: visual output is unchanged, code is cleaner.

## Depends on

[T10](./T10-glow-trail.md), [T11](./T11-comet-glow.md), [T13](./T13-render-flares.md), [T14](./T14-leading-dot.md), [T16](./T16-background.md).

## Touches

- creates `components/path-animation/Scene.tsx`
- edits `app/(tabs)/path-animation.tsx`
- edits `components/path-animation/index.ts`

## Interface

```ts
// Scene.tsx
export function Scene(): JSX.Element;
```

## Implementation

`components/path-animation/Scene.tsx`:

```tsx
import { Canvas } from '@shopify/react-native-skia';
import { WAYPOINTS, WAYPOINT_PROGRESS } from './data/pathDefinition';
import { useDrawProgress } from './hooks/useDrawProgress';
import { Background } from './layers/Background';
import { CometGlow } from './layers/CometGlow';
import { DrawnPath } from './layers/DrawnPath';
import { GlowTrail } from './layers/GlowTrail';
import { LeadingDot } from './layers/LeadingDot';
import { WaypointFlare } from './layers/WaypointFlare';

export function Scene() {
  const progress = useDrawProgress();
  return (
    <Canvas style={{ flex: 1 }}>
      <Background />
      <GlowTrail progress={progress} />
      <CometGlow progress={progress} />
      <DrawnPath progress={progress} />
      {WAYPOINTS.map((wp, i) => (
        <WaypointFlare
          key={wp.label}
          progress={progress}
          position={{ x: wp.x, y: wp.y }}
          triggerAt={WAYPOINT_PROGRESS[i]}
        />
      ))}
      <LeadingDot progress={progress} />
    </Canvas>
  );
}
```

`components/path-animation/index.ts`:

```ts
export { Scene } from './Scene';
```

`app/(tabs)/path-animation.tsx` becomes:

```tsx
import { View } from 'react-native';
import { Scene } from '@/components/path-animation';

export default function PathAnimationScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Scene />
    </View>
  );
}
```

## Verify

- Visual output on the "Path" tab is **identical** to what existed at the end of T16.
- The tab screen file imports `Scene` only — no direct Skia or reanimated imports.
- `npx tsc --noEmit` passes.

## Anti-goals

- Do NOT change any visual parameters during this extraction. Behavior must be preserved exactly.
- Do NOT export any layer components from `index.ts` — only `Scene` is public.
