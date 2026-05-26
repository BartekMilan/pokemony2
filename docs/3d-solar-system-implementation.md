# 3D Solar System — Step-by-Step Implementation Plan

Each step is **self-contained**: exact files, exact values, pass/fail test. Steps are ordered so no step depends on a later one. Steps 1–2 are independent and can run in parallel.

---

## Step 1 — Create `data/stars.ts`

**File to create:** `data/stars.ts`

```ts
export type Star = { x: number; y: number; r: number; opacity: number };

export const STARS: Star[] = Array.from({ length: 150 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: 0.5 + Math.random() * 1.5,
  opacity: 0.3 + Math.random() * 0.6,
}));
```

**Test:** `npx tsc --noEmit` passes. File exports `STARS` as `Star[]`.

---

## Step 2 — Create `components/solar-system/StarBackground.tsx`

**File to create:** `components/solar-system/StarBackground.tsx`

- Import `STARS` from `../../data/stars`
- Import `Svg`, `Circle` from `react-native-svg`
- Import `View`, `StyleSheet`, `useWindowDimensions` from `react-native`
- Render a `<View style={[StyleSheet.absoluteFillObject, { backgroundColor: '#050510' }]} pointerEvents="none">` wrapping `<Svg width={width} height={height}>`
- Map `STARS` to `<Circle key={i} cx={s.x * width} cy={s.y * height} r={s.r} fill="white" opacity={s.opacity} />`
- Default export the component

**Test:** `npx tsc --noEmit` passes. No animation, no props.

---

## Step 3 — Remove `spinVelocity` and `color` from `types/planet.ts`

**File to edit:** `types/planet.ts`

Delete `spinVelocity: number` and `color: string` from `PlanetConfig`. Keep: `id`, `name?`, `orbitRadius`, `angularVelocity`, `size`, `initialAngle?`, `initialSpinAngle?`.

**Test:** `npx tsc --noEmit` — errors expected in `data/planets.ts` and old `Planet.tsx` (fixed in Steps 4 and 6). No errors inside `types/planet.ts` itself.

---

## Step 4 — Update `data/planets.ts` Earth entry

**File to edit:** `data/planets.ts`

Replace the Earth object with:
```ts
{
  id: 'earth',
  name: 'Earth',
  orbitRadius: 150,
  angularVelocity: 0.8,
  size: 70,
  initialAngle: 0,
}
```
Remove `color`, `spinVelocity`, `initialSpinAngle`.

**Test:** `npx tsc --noEmit` passes for this file (no remaining type errors here after Step 3).

---

## Step 5 — Rewrite `Sun.tsx` as composable SVG fragments

**File to rewrite:** `components/solar-system/Sun.tsx`

Replace the entire file with:

```tsx
import { Circle, RadialGradient, Stop } from 'react-native-svg';

export function SunGradientDef() {
  return (
    <RadialGradient id="sunGradient" cx="35%" cy="32%" fx="30%" fy="28%" r="50%">
      <Stop offset="0%"   stopColor="#fffde7" />
      <Stop offset="20%"  stopColor="#fff176" />
      <Stop offset="55%"  stopColor="#FDB813" />
      <Stop offset="80%"  stopColor="#e67e22" />
      <Stop offset="100%" stopColor="#a04000" />
    </RadialGradient>
  );
}

export function SunCircle() {
  return <Circle cx={210} cy={110} r={50} fill="url(#sunGradient)" />;
}
```

No `View`, no `Svg` root, no `StyleSheet`, no default export.

**Test:** `npx tsc --noEmit` passes.

---

## Step 6 — Rewrite `Planet.tsx` as composable SVG fragments

**File to rewrite:** `components/solar-system/Planet.tsx`

Replace the entire file with:

```tsx
import Animated, { useAnimatedProps } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { Circle, RadialGradient, Stop } from 'react-native-svg';
import type { PlanetConfig } from '../../types/planet';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Plain literals required — Reanimated worklets cannot import module-scope constants
const SIN_TILT = 0.34202;
const COS_TILT = 0.93969;
const ORBIT_RADIUS = 150;
const SVG_CENTER_X = 210;
const SVG_CENTER_Y = 110;
const EARTH_BASE_RADIUS = 35;

interface Props {
  config: PlanetConfig;
  time: SharedValue<number>;
}

export function EarthGradientDef() {
  return (
    <RadialGradient id="earthGradient" cx="35%" cy="30%" fx="25%" fy="22%" r="50%">
      <Stop offset="0%"   stopColor="#e8f4ff" />
      <Stop offset="18%"  stopColor="#6ab4f5" />
      <Stop offset="45%"  stopColor="#2979c8" />
      <Stop offset="72%"  stopColor="#1a5fa0" />
      <Stop offset="100%" stopColor="#060e1c" />
    </RadialGradient>
  );
}

export function EarthBehindCircle({ config, time }: Props) {
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const angle = time.value * config.angularVelocity + (config.initialAngle ?? 0);
    const x3d = ORBIT_RADIUS * Math.cos(angle);
    const z3d = ORBIT_RADIUS * Math.sin(angle);
    const depth = z3d * COS_TILT;
    const scale = 1 + (depth / ORBIT_RADIUS) * 0.18;
    return {
      cx: SVG_CENTER_X + x3d,
      cy: SVG_CENTER_Y + (-z3d * SIN_TILT),
      r: EARTH_BASE_RADIUS * scale,
      opacity: depth <= 0 ? 1 : 0,
    };
  });
  return <AnimatedCircle animatedProps={animatedProps} fill="url(#earthGradient)" />;
}

export function EarthFrontCircle({ config, time }: Props) {
  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const angle = time.value * config.angularVelocity + (config.initialAngle ?? 0);
    const x3d = ORBIT_RADIUS * Math.cos(angle);
    const z3d = ORBIT_RADIUS * Math.sin(angle);
    const depth = z3d * COS_TILT;
    const scale = 1 + (depth / ORBIT_RADIUS) * 0.18;
    return {
      cx: SVG_CENTER_X + x3d,
      cy: SVG_CENTER_Y + (-z3d * SIN_TILT),
      r: EARTH_BASE_RADIUS * scale,
      opacity: depth > 0 ? 1 : 0,
    };
  });
  return <AnimatedCircle animatedProps={animatedProps} fill="url(#earthGradient)" />;
}
```

**Test:** `npx tsc --noEmit` passes. Three named exports. No `View`, no `StyleSheet`, no default export.

---

## Step 7 — Rewrite `SolarSystem.tsx` to compose everything into one `<Svg>` canvas

**File to rewrite:** `components/solar-system/SolarSystem.tsx`

Replace the entire file with:

```tsx
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, Ellipse } from 'react-native-svg';
import { useSolarSystemClock } from '../../hooks/useSolarSystemClock';
import { SOLAR_SYSTEM_PLANETS } from '../../data/planets';
import { SunGradientDef, SunCircle } from './Sun';
import { EarthGradientDef, EarthBehindCircle, EarthFrontCircle } from './Planet';
import StarBackground from './StarBackground';

const SIN_TILT = 0.34202;

export default function SolarSystem() {
  const time = useSolarSystemClock();
  const earth = SOLAR_SYSTEM_PLANETS[0];

  return (
    <View style={styles.container}>
      <StarBackground />
      <Svg width={420} height={220}>
        <Defs>
          <SunGradientDef />
          <EarthGradientDef />
        </Defs>
        <Ellipse
          cx={210} cy={110}
          rx={150} ry={150 * SIN_TILT}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth={1}
          fill="none"
        />
        <EarthBehindCircle config={earth} time={time} />
        <SunCircle />
        <EarthFrontCircle config={earth} time={time} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#050510',
  },
});
```

**Test:** `npx tsc --noEmit` passes. App renders. Earth orbits and disappears behind sun.

---

## Step 8 — Delete `OrbitRings.tsx`

**File to delete:** `components/solar-system/OrbitRings.tsx`

Verify no other file imports from it before deleting (`SolarSystem.tsx` no longer does after Step 7).

**Test:** `npx tsc --noEmit` passes. `grep -r "OrbitRings" src components` returns nothing.

---

## Summary

| Step | File | Action | Test |
|------|------|--------|------|
| 1 | `data/stars.ts` | Create | tsc |
| 2 | `components/solar-system/StarBackground.tsx` | Create | tsc |
| 3 | `types/planet.ts` | Remove 2 fields | tsc (downstream errors expected) |
| 4 | `data/planets.ts` | Update Earth entry | tsc |
| 5 | `components/solar-system/Sun.tsx` | Rewrite → 2 exports | tsc |
| 6 | `components/solar-system/Planet.tsx` | Rewrite → 3 exports | tsc |
| 7 | `components/solar-system/SolarSystem.tsx` | Rewrite composer | tsc + app run |
| 8 | `components/solar-system/OrbitRings.tsx` | Delete | tsc + grep |
