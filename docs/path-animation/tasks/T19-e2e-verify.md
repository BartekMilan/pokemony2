# T19 — End-to-end verification

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

A final pass confirming the demo works end-to-end on a running device or simulator. No code changes.

## Depends on

[T18](./T18-visual-tuning.md).

## Touches

Nothing — verification only.

## Steps

1. From project root: `npx expo start` (or use the project's preferred run script).
2. Open the app on simulator or device.
3. Navigate to the "Path" tab.
4. Confirm the looping animation runs end-to-end:
   - Green map background is visible.
   - Soft halo trail follows the drawn line.
   - Bright comet glow brightens the leading edge.
   - All 6 waypoints (Harbor → Forest → River bend → Watchtower → Ruins → Treasure) flare in sequence as the tip passes them.
   - Leading dot rides the tip throughout.
5. Watch at least 3 full loops. Verify no:
   - Memory leak warnings in Metro logs.
   - Frame jank or dropped frames at loop restart.
   - Visual artifacts (flicker, kinks, ghosting).
6. Switch to another tab and back. Confirm the animation picks up cleanly (the `cancelAnimation` cleanup in `useDrawProgress` should make this seamless).

## Report

- "All green" if every check passes.
- Otherwise, list the specific anomalies (which step, what was wrong, screenshot if available).

## Anti-goals

- Do NOT modify any files. If something is broken, report it and escalate — fixes happen in a follow-up task, not here.
