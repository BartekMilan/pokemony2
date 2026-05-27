# T13 — Render all waypoint flares in the scene

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Instantiate one `WaypointFlare` per waypoint, wired to the correct trigger progress.

## Depends on

[T04](./T04-waypoints.md), [T06](./T06-waypoint-progress.md), [T12](./T12-waypoint-flare.md).

## Touches

Edits `app/(tabs)/path-animation.tsx`.

## Implementation

Add the following inside the `<Canvas>`, AFTER `<DrawnPath />` (flares should be on top of the line):

```tsx
import { WAYPOINTS, WAYPOINT_PROGRESS } from '@/components/path-animation/data/pathDefinition';
import { WaypointFlare } from '@/components/path-animation/layers/WaypointFlare';

// ...

{WAYPOINTS.map((wp, i) => (
  <WaypointFlare
    key={wp.label}
    progress={progress}
    position={{ x: wp.x, y: wp.y }}
    triggerAt={WAYPOINT_PROGRESS[i]}
  />
))}
```

Final render order in the Canvas after this task:

```
<GlowTrail />
<CometGlow />
<DrawnPath />
{flares}
```

## Verify

- During the 5-second loop, each of the 6 waypoints lights up in sequence: Harbor → Forest → River bend → Watchtower → Ruins → Treasure.
- Each flare blooms, peaks roughly at the moment the leading edge crosses that waypoint, then fades.
- Adjacent flares may briefly overlap during the handoff — that's correct.
- `npx tsc --noEmit` passes.

## Anti-goals

- Do NOT modify `WaypointFlare`. If the visual feel is off, T18 (visual tuning) handles that.
- Do NOT add a flare at progress=0 special case — the Harbor flare at `triggerAt=0` will naturally only ramp down, which is fine.
