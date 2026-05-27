# Holo Pokemon Card — Training Exercise

An interactive 3D parallax holographic Pokémon card driven by the device rotation sensor (`SensorType.ROTATION`) and React Native Reanimated 4.

## Learning objectives

After completing this exercise you should be able to:

- [ ] Register and read `useAnimatedSensor(SensorType.ROTATION)` on a physical device
- [ ] Explain why sensor `.value` must never be read during React render
- [ ] Apply `perspective` + `rotateX` / `rotateY` for 3D card rotation
- [ ] Smooth noisy sensor data with `useAnimatedReaction` + `withSpring`
- [ ] Split visual depth into parallax layers with per-layer multipliers
- [ ] Derive a holo glare sweep from `Math.atan2(roll, pitch)`
- [ ] Provide a dev mock when the sensor is unavailable (simulators)

## Quick start

1. Open the **Holo Card** tab in the app.
2. On a **physical iPhone or Android device**, tilt forward/back and left/right — the card rotates and parallax layers shift at different rates.
3. In the **iOS Simulator / Android Emulator**, a yellow banner appears. Drag the card to mock tilt (`__DEV__` only).

## File map

```
components/holo-card/
  HoloPokemonCard.tsx     # orchestrator
  hooks/useCardTilt.ts    # all motion logic
  hooks/useDevTiltMock.ts # pan fallback
  layers/                 # visual layers (SharedValue props only)
  constants/cardLayout.ts # tunable physics constants
app/(tabs)/holo-card.tsx  # thin screen shell
```

## Try this

1. **Break the clamp** — In `cardLayout.ts`, change `MAX_ROTATE_DEG` to `90` and observe layout/backface issues. Restore to `12`.
2. **Compare sensors** — Duplicate `useCardTilt` using `SensorType.GRAVITY` (`x`/`y` vector) and note how rotation vs gravity feels different for parallax.
3. **Tune spring** — Lower `stiffness` to `80` and raise `damping` to `25`. Does the card feel heavier or snappier?
4. **Parallax depth** — Set `POKEMON_PARALLAX.x` to `1.2` and `BACKGROUND_PARALLAX.x` to `0.1`. Which sells depth better?
5. **Reduced motion** — Wrap spring updates in a `useReducedMotion()` check and skip animation when accessibility reduced motion is enabled.

## Physical device testing

| Check | Expected |
|-------|----------|
| Forward tilt | Top of card rotates away (rotateX positive) |
| Left tilt | Card rotates left (rotateY negative) |
| Sharp flick | Motion lags slightly then catches up (spring) |
| Frame text | Stays crisp (0× parallax) |
| Holo band | Sweeps across surface at an angle |
| Leave tab / return | No stuck animation or leak |

## Related docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — data flow and layer table
- [tasks/](./tasks/) — incremental milestones T00–T08

## References

- [Reanimated useAnimatedSensor](https://docs.swmansion.com/react-native-reanimated/docs/device/useAnimatedSensor)
- [Expo SDK 54 docs](https://docs.expo.dev/versions/v54.0.0/)
