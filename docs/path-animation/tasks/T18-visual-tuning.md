# T18 — Visual tuning pass (judgment task)

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Adjust the visible parameters (colors, blur radii, stroke widths, glow window size, flare timing window) until the composed scene looks pleasing. This is a *judgment* task — human-eye verification.

## Depends on

[T17](./T17-scene-extract.md).

## Touches

Any of the layer files. Likely candidates:
- `GlowTrail.tsx` — blur, strokeWidth, opacity
- `CometGlow.tsx` — windowSize, blur, blendMode behavior on this device
- `WaypointFlare.tsx` — APPROACH, DECAY, MAX_R, color
- `Background.tsx` — palette, tree density
- `DrawnPath.tsx` — strokeWidth (probably leave alone)

**Optional refactor**: if many color/size constants are getting repeated, extract them to a shared `components/path-animation/theme.ts` and import where used. Only do this if it genuinely cleans things up — don't refactor for its own sake.

## Verification rubric

Run the app and check each of these:

1. **Smoothness**: path draws without visual jitter, especially at loop restart.
2. **Comet vs. trail contrast**: the comet glow at the tip is clearly brighter than the trailing glow behind it.
3. **Waypoint flares**: noticeable, but don't completely hide the path or each other. Each flare's peak roughly matches the moment the tip crosses it.
4. **Background**: visibly green-map-ish, not distracting. Scattered shapes feel placed, not random.
5. **Layer balance**: no single layer dominates. The crisp cream line should remain readable on top of all glow.
6. **Frame rate**: no stutter on at least one full 5-second loop.

## Report

Describe (in 1–2 sentences) what you changed and why. If you used a screenshot helper or `verify` skill, attach the result. If anything still feels off but you couldn't fix it cleanly, flag it for the user.

## Anti-goals

- Do NOT add new layers, new shared values, or new behavior.
- Do NOT introduce randomness or per-render noise.
- Do NOT refactor unrelated code.
