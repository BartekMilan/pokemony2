# T06 — Holographic Glare

**Goal:** Rainbow foil band sweeps across the card.

## Tasks

1. Derive `glareAngle = atan2(roll, pitch)` and `glareTranslate` in `useCardTilt`.
2. Implement `HoloGlareLayer` with `react-native-svg` `LinearGradient` + `Rect`.
3. Animate overlay with `translateX` + `rotate`; `mixBlendMode: 'screen'` on iOS.
4. `pointerEvents="none"` on overlay.

## Acceptance

Visible holo band slides across card as device angle changes.
