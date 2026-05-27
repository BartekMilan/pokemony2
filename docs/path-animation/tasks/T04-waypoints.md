# T04 — Define waypoint data

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Hardcode 6 waypoints inside the 400×600 logical canvas. Pure data, no rendering.

## Depends on

[T02](./T02-scaffold-dirs.md).

## Touches

Creates `components/path-animation/data/pathDefinition.ts`.

## Interface

```ts
export type Waypoint = { x: number; y: number; label: string };
export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;
export const WAYPOINTS: Waypoint[];   // length 6
```

## Implementation

```ts
export type Waypoint = { x: number; y: number; label: string };

export const CANVAS_WIDTH = 400;
export const CANVAS_HEIGHT = 600;

export const WAYPOINTS: Waypoint[] = [
  { x:  60, y: 540, label: 'Harbor' },
  { x: 140, y: 420, label: 'Forest' },
  { x: 100, y: 280, label: 'River bend' },
  { x: 240, y: 220, label: 'Watchtower' },
  { x: 300, y: 360, label: 'Ruins' },
  { x: 340, y:  80, label: 'Treasure' },
];
```

## Verify

- `npx tsc --noEmit` passes.
- `WAYPOINTS.length === 6`.
- All `x` values in `[0, CANVAS_WIDTH]`, all `y` values in `[0, CANVAS_HEIGHT]`.

## Anti-goals

- Do NOT add `PATH_D`, `WAYPOINT_PROGRESS`, or `TOTAL_LENGTH` here. Those are T05/T06.
- Do NOT import anything from Skia. This file is pure data.
