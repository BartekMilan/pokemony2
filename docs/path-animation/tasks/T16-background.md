# T16 — `Background` layer (procedural green map)

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

A procedurally drawn "green map" background — a green base plus 12–20 darker hand-placed shapes suggesting trees/hills, drawn entirely in Skia.

## Depends on

[T01](./T01-install-skia.md), [T02](./T02-scaffold-dirs.md). Independent of the path animation work — can run in parallel with T08+.

## Touches

- creates `components/path-animation/layers/Background.tsx`
- edits `app/(tabs)/path-animation.tsx` (compose order)

## Interface

```ts
export function Background(): JSX.Element;
```

## Implementation

```tsx
import { Circle, Group, Rect } from '@shopify/react-native-skia';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../data/pathDefinition';

// Hardcoded scatter — no Math.random() at render time.
const TREES: { x: number; y: number; r: number }[] = [
  { x:  40, y:  60, r: 14 }, { x: 120, y:  30, r:  8 },
  { x: 220, y:  60, r: 18 }, { x: 320, y: 130, r: 10 },
  { x:  80, y: 170, r: 12 }, { x: 180, y: 150, r:  9 },
  { x: 260, y: 200, r: 16 }, { x:  50, y: 320, r: 11 },
  { x: 200, y: 340, r: 22 }, { x: 350, y: 250, r:  8 },
  { x: 110, y: 480, r: 13 }, { x: 280, y: 460, r: 17 },
  { x: 360, y: 500, r: 10 }, { x:  30, y: 420, r:  9 },
  { x: 170, y: 560, r: 12 }, { x: 320, y: 580, r: 14 },
];

export function Background() {
  return (
    <Group>
      <Rect x={0} y={0} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} color="#2f6b3a" />
      {TREES.map((t, i) => (
        <Circle key={i} cx={t.x} cy={t.y} r={t.r} color="#1f4a26" />
      ))}
    </Group>
  );
}
```

Feel free to add a few `<Path>` elements with light tan color for decorative trails/roads, but keep it tasteful — the animated path is the star.

## Compose

Make `<Background />` the FIRST child of the Canvas in `app/(tabs)/path-animation.tsx`:

```tsx
<Canvas style={{ flex: 1 }}>
  <Background />
  <GlowTrail progress={progress} />
  <CometGlow progress={progress} />
  <DrawnPath progress={progress} />
  {/* waypoint flares */}
  <LeadingDot progress={progress} />
</Canvas>
```

## Verify

- The "Path" tab now shows a green base with darker scattered tree/hill shapes underneath the animated path.
- All other layers still render on top — the background does not occlude anything.
- `npx tsc --noEmit` passes.

## Anti-goals

- Do NOT use `Math.random()` for positions. Hardcoded scatter only — repeatable across runs.
- Do NOT add animation to the background. It stays static.
