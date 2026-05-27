# Holo Card Architecture

## Overview

Motion flows from a single hook (`useCardTilt`) into a 3D-rotated card shell and four absolutely positioned layers. Layers never register sensors themselves.

```mermaid
flowchart TB
  subgraph hook [useCardTilt]
    Sensor["useAnimatedSensor(ROTATION)"]
    Mock["useDevTiltMock (if unavailable)"]
    Reaction["useAnimatedReaction"]
    Spring["withSpring SharedValues"]
    Sensor --> Reaction
    Mock --> Reaction
    Reaction --> Spring
  end

  subgraph card [HoloPokemonCard]
    PW["perspective wrapper"]
    Shell["Animated shell rotateX/Y"]
    L0["BackgroundLayer 0.3×"]
    L1["PokemonLayer 0.8×"]
    L2["FrameLayer 0×"]
    L3["HoloGlareLayer angle"]
    PW --> Shell --> L0 --> L1 --> L2 --> L3
  end

  Spring --> Shell
  Spring --> L0
  Spring --> L1
  Spring --> L2
  Spring --> L3
```

## SharedValue contract

| Output | Type | Consumer |
|--------|------|----------|
| `rotateX` | degrees | Card shell `rotateX` |
| `rotateY` | degrees | Card shell `rotateY` |
| `parallaxX` | -1..1 | Layer `translateX` × multiplier |
| `parallaxY` | -1..1 | Layer `translateY` × multiplier |
| `glareTranslate` | pixels | Holo band horizontal sweep |
| `glareAngle` | radians | Holo band rotation |

## Layer parallax table

| Layer | Component | Multiplier | Notes |
|-------|-----------|------------|-------|
| 0 | BackgroundLayer | 0.3× | Slowest — feels far |
| 1 | PokemonLayer | 0.8× | Fastest — pops forward |
| 2 | FrameLayer | 0× | Stats stay readable |
| 3 | HoloGlareLayer | 0× translate | Uses angle + sweep |

## Sequence (one sensor frame)

```mermaid
sequenceDiagram
  participant Device
  participant Sensor as useAnimatedSensor
  participant Reaction as useAnimatedReaction
  participant Spring as withSpring
  participant Shell as CardShell
  participant Layers as ParallaxLayers

  Device->>Sensor: pitch, roll, yaw
  Sensor->>Reaction: sensor.value update
  Reaction->>Spring: interpolate + CLAMP
  Spring->>Shell: rotateX, rotateY
  Spring->>Layers: parallaxX/Y, glareTranslate
```

## Constants (`cardLayout.ts`)

All magic numbers live in one file with comments explaining *why*:

- `MAX_ROTATE_DEG = 12` — prevents backface / layout breakage
- `CARD_SPRING_CONFIG` — `{ damping: 15, stiffness: 150 }`
- `PARALLAX_X/Y_RANGE = 18` — max pixel shift at full tilt
- `GLARE_OPACITY = 0.35` — foil intensity (higher on Android fallback)

## Dev ergonomics

When `rotation.isAvailable === false`:

1. Yellow banner: *"Tilt requires a physical device"*
2. In `__DEV__`, `useDevTiltMock` wires a Pan gesture to the same SharedValue pipeline — layers need zero conditional logic.

## Sensor lifecycle

`useAnimatedSensor` registers on mount and unregisters on unmount (tab navigation away cleans up automatically via the hook's `useEffect` cleanup).
