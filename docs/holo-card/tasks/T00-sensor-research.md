# T00 — Research Reanimated Sensors

**Goal:** Understand `useAnimatedSensor` before writing card code.

## Tasks

1. Read [useAnimatedSensor docs](https://docs.swmansion.com/react-native-reanimated/docs/device/useAnimatedSensor).
2. Note `SensorType.ROTATION` fields: `pitch`, `roll`, `yaw`.
3. Understand `adjustToInterfaceOrientation: true` for portrait apps.
4. Confirm sensor is unavailable in iOS Simulator (expected).

## Acceptance

You can explain why sensor data must stay on the UI thread (SharedValues, not React state).
