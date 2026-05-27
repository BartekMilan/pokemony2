# T02 — Sensor Binding

**Goal:** Read live device rotation and prove the pipeline works.

## Tasks

1. Implement `hooks/useCardTilt.ts` with `useAnimatedSensor(SensorType.ROTATION)`.
2. Handle `isAvailable === false`: show banner *"Tilt requires a physical device"*.
3. Wire `useDevTiltMock` — Pan gesture → mock pitch/roll SharedValues.

## Reanimated concepts

- Sensor lifecycle (register on mount, unregister on unmount)
- Never read `.value` in JSX render

## Acceptance

Physical device: sensor registers. Simulator: banner + drag mock works in `__DEV__`.
