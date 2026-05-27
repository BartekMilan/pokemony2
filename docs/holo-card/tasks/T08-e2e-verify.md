# T08 — End-to-End Verify

**Goal:** Confirm all milestones work together.

## Checklist

- [ ] **Physical device:** tilt forward/back/left/right — rotation clamped, no overflow
- [ ] **Simulator:** mock pan works; banner shown when sensor unavailable
- [ ] **Tab navigation:** leave Holo Card tab and return — no stuck animation
- [ ] **Portrait lock:** rotation sensor feels natural with `adjustToInterfaceOrientation`
- [ ] **Frame text:** remains readable (Layer 2 parallax = 0)
- [ ] **Holo glare:** band visible at tilt, subtle at rest
- [ ] **TypeScript:** `npx tsc --noEmit` passes

## Optional stretch

- Swap `SensorType.GRAVITY` and compare
- Multiple card types via `cardContent.ts`
- Haptic pulse when glare peaks (`expo-haptics`)
