# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

---

# Project Context for Sub-Agents

## Stack (exact versions — do not guess)

- **Expo** `54` — file-based routing via `expo-router`, screens live in `app/(tabs)/`
- **React Native** `0.79`
- **TypeScript** — strict mode, run `npx tsc --noEmit` to verify after every change
- **react-native-svg** `^15.12.1` — SVG primitives: `Svg`, `Circle`, `Ellipse`, `RadialGradient`, `Stop`, `Defs`
- **react-native-reanimated** `~4.1.1` — animation engine; UI-thread worklets via `useAnimatedStyle` or `useAnimatedProps`

---

## File Structure

```
app/(tabs)/         ← Expo Router screens (index.tsx, line.tsx, playground.tsx)
components/
  solar-system/     ← Solar system UI fragments (no standalone Svg roots in fragments)
data/               ← Static data arrays (planets.ts, stars.ts) — no logic, no imports from components
hooks/              ← Custom React hooks (useSolarSystemClock.ts)
types/              ← Shared TypeScript types (planet.ts)
docs/               ← Implementation plans and design docs
```

**Rules:**
- New components go in `components/solar-system/` (or a new feature subfolder if unrelated)
- New data arrays go in `data/`
- New hooks go in `hooks/` and must start with `use`
- Types shared across files go in `types/`

---

## Hard Constraints — Read Before Writing Any Code

### 1. Reanimated worklets cannot import module-scope constants

Functions marked `'worklet'` (inside `useAnimatedProps`, `useAnimatedStyle`, `useFrameCallback`, etc.) run on the UI thread. They **cannot** reference variables imported from other modules. Always inline numeric literals:

```ts
// WRONG — will crash at runtime
import { ORBIT_RADIUS } from '../constants';
const animatedProps = useAnimatedProps(() => {
  'worklet';
  return { r: ORBIT_RADIUS }; // ← ReferenceError on UI thread
});

// CORRECT — literal in scope
const ORBIT_RADIUS = 150; // plain literal at file top
const animatedProps = useAnimatedProps(() => {
  'worklet';
  return { r: ORBIT_RADIUS }; // ✓
});
```

### 2. SVG occlusion uses painter's algorithm — not z-index

React Native `zIndex` does not work inside an `<Svg>` canvas. Layering is controlled by **document order**: elements drawn later appear on top. To make object A appear behind object B, render A before B in JSX.

### 3. Animating SVG elements requires `useAnimatedProps`, not `useAnimatedStyle`

`useAnimatedStyle` drives React Native View style props. SVG elements (Circle, Ellipse, etc.) use **`useAnimatedProps`** to drive their SVG attributes (`cx`, `cy`, `r`, `opacity`, etc.).

```ts
// WRONG for SVG
const style = useAnimatedStyle(() => ({ width: x.value }));
<AnimatedCircle style={style} />

// CORRECT for SVG
const props = useAnimatedProps(() => ({ cx: x.value }));
<AnimatedCircle animatedProps={props} />
```

To animate an SVG element, wrap it: `const AnimatedCircle = Animated.createAnimatedComponent(Circle)`.

### 4. SVG fragment components must NOT have their own `<Svg>` root

Components inside a shared `<Svg>` canvas export bare SVG elements (`<Circle>`, `<RadialGradient>`, etc.), not a full `<Svg>`. Wrapping in a second `<Svg>` breaks rendering.

### 5. `useSolarSystemClock` returns a `SharedValue<number>` (seconds elapsed)

Located at `hooks/useSolarSystemClock.ts`. Returns `time: SharedValue<number>` that increments each frame on the UI thread. Pass it as a prop to animated components — do not call the hook more than once.

---

## Common Mistakes to Avoid

| Mistake | Correct approach |
|---|---|
| `import { X } from '../data'` inside a worklet | Inline `X` as a plain literal in the file |
| Adding `<Svg>` wrapper inside a fragment component | Export bare elements; the parent owns the `<Svg>` |
| Using `useAnimatedStyle` on an SVG element | Use `useAnimatedProps` instead |
| Putting z-index on SVG elements | Control order via JSX document order |
| Creating a default export from a fragment component | Use named exports; default exports only on screen/page components |
