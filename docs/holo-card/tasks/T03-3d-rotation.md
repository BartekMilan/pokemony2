# T03 — Basic 3D Card Rotation

**Goal:** Entire card rotates in 3D space.

## Tasks

1. Add outer perspective wrapper (`perspective: 1000` on parent).
2. Apply shell `useAnimatedStyle` with `rotateX` / `rotateY` in degrees.
3. Map sensor radians → degrees via `interpolate` + `Extrapolation.CLAMP`.
4. Invert one axis if motion feels backwards.

## Acceptance

Single composite card tilts smoothly; rotation stops at `MAX_ROTATE_DEG`.
