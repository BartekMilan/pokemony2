# Animated Drawing Path — Architecture & Shared Agent Context

**Every task in `./tasks/` begins with "Read this file first." This is the single source of truth for the mental model, file layout, color palette, and tooling conventions. Task files only add the slice that's specific to one step.**

## Why this exists

A self-contained learning exercise for `react-native-reanimated` and `@shopify/react-native-skia`. A `progress: SharedValue<number>` ticks 0→1 in a loop; everything visible is *derived* from it. The result: a path that draws itself on a green map, with three layered shine effects (soft trail glow, bright comet at the tip, per-waypoint flares) and a small leading dot.

The existing `components/map/` is **untouched** — this is a clean parallel implementation in a new directory.

## The 4-layer mental model

```
┌────────────────────────────────┐
│  4. Shine layer                 │  waypoint flares + leading dot
├────────────────────────────────┤
│  3. Glow/comet layer            │  blurred copies of the drawn path
├────────────────────────────────┤
│  2. Drawn path layer            │  crisp line, trimmed by progress
├────────────────────────────────┤
│  1. Background                  │  static topographic map PNG
└────────────────────────────────┘
```

## Single source of truth

One `SharedValue<number>` called `progress`, owned by `Scene`, ticks 0→1 with `withRepeat(withTiming(...))`. Every visual element derives its state from `progress` via `useDerivedValue`. No element holds its own animation state.

## The reanimated + Skia bridge pattern

This is the key idiom — internalize it before writing any task code:

```ts
// Skia geometry recomputed on UI thread whenever progress changes.
const trimmedPath = useDerivedValue(() => {
  const p = Skia.Path.MakeFromSVGString(PATH_D)!.copy();
  p.trim(0, progress.value, false);
  return p;
});
// Skia component reads the derived value directly — no Animated.createAnimatedComponent.
<Path path={trimmedPath} style="stroke" strokeWidth={4} color="white" />
```

**Constraint**: any Skia geometry that depends on `progress` MUST be computed inside a `useDerivedValue` worklet, not on the JS thread.

## File structure (new code only)

```
assets/path-animation/
  map-background.png           // 800×1200 portrait, Unsplash HxtvH28DSVM

components/path-animation/
  data/
    pathDefinition.ts        // WAYPOINTS, PATH_D, WAYPOINT_PROGRESS, TOTAL_LENGTH
  hooks/
    useDrawProgress.ts       // owns the looping SharedValue<number>
  layers/
    Background.tsx           // static map PNG + fallback fill
    DrawnPath.tsx            // crisp trimmed path
    GlowTrail.tsx            // wide, blurred copy under the drawn path
    CometGlow.tsx            // windowed trim with heavy blur at the tip
    WaypointFlare.tsx        // single waypoint pulse component
    LeadingDot.tsx           // dot + rotation at the tip
  Scene.tsx                  // composes all layers, owns progress
  index.ts                   // re-exports Scene

app/(tabs)/path-animation.tsx    // tab screen, renders <Scene />
app/(tabs)/_layout.tsx           // add new tab entry (existing file)
```

## Project facts

- **Root**: `/Users/bartekmilan/Desktop/pokemony2`
- **Expo SDK**: `54.0.33`. Per `AGENTS.md`, before writing any code consult `https://docs.expo.dev/versions/v54.0.0/`.
- **Reanimated**: already installed at `~4.1.1`.
- **Skia**: to be installed in T01 (see `tasks/T01-install-skia.md`).
- **No `react-native-svg`** in the new code. The existing `components/map/` uses it; do not import from there.

## Canvas conventions

- **Logical dimensions**: 400 × 600 (used everywhere in path data, background, layers).
- **Container**: `<Canvas style={{ flex: 1 }}>` fills the screen; inner shapes use absolute logical coordinates. If the device screen is larger, content effectively letterboxes — acceptable for v1.
- **Coordinate system**: top-left origin, +x right, +y down.
- **Screen fit**: `Scene` scales the 400×600 logical canvas with `Math.max(width / CANVAS_WIDTH, height / CANVAS_HEIGHT)` (cover — fills the viewport, may crop edges).

## Color palette

Tune in T18, but start with:

| Element | Color | Notes |
|---|---|---|
| Background map | `assets/path-animation/map-background.png` | 800×1200, scaled to logical canvas |
| Background fallback | `#1a3d35` | full-screen `Rect` under image (also while image loads) |
| Crisp path | `#fff8dc` (cream) | `strokeWidth: 4` |
| Glow trail | `#fff8dc` | `strokeWidth: 14`, `opacity: 0.35`, blur `12` |
| Comet glow | `#ffd66b` (warm yellow) | `strokeWidth: 18`, `opacity: 0.9`, blur `22`, `blendMode: plus` |
| Waypoint flare | `#ffe28a` | radial gradient, blur `8` |
| Leading dot | `#fff8dc` | radius `6`, blur `2` |

## Reanimated APIs in use

`useSharedValue`, `useDerivedValue`, `withTiming`, `withRepeat`, `cancelAnimation`, `Easing.inOut(Easing.cubic)`, `interpolate`. The `'worklet'` directive where helper functions are called from a derived value.

## Skia APIs in use

`Canvas`, `Path`, `Circle`, `Rect`, `Group`, `Image`, `useImage`, `BlurMask`, `RadialGradient`, `Skia.Path.MakeFromSVGString`, `Skia.PathMeasure`, `path.copy().trim(start, end, isComplement)`.

## Pre-execution checks (resolve at task time)

- **Skia + worklet compatibility for `PathMeasure`** (`tasks/T14-leading-dot.md`): some RN-Skia versions only expose `PathMeasure` as a JS object, not worklet-safe. T14 includes a fallback (precomputed lookup table) and instructions to document which path was taken.
- **Tab routing convention**: `tasks/T03-smoke-test.md` requires reading the existing `app/(tabs)/_layout.tsx` first to confirm whether tabs are auto-discovered from file names or declared explicitly. Match the existing pattern.

## Sub-agent dispatching conventions

Every task file in `./tasks/` is intended as **one agent invocation**:

1. **Read only what the task names.** No "let me explore the codebase first."
2. **No file echoing in reports.** Report diffs as "+25 lines in `DrawnPath.tsx`," never the contents.
3. **One file per task** (the plan is designed this way). If a task seems to need a second unrelated file, escalate to the orchestrator rather than guessing.
4. **Edit/Write, not Bash.** No `sed`/`cat`/`echo` to modify files.
5. **No nested exploration.** A task-executing subagent should not spawn its own Explore agent.
6. **Report shape**: (a) files touched, (b) 3-line summary, (c) any anomaly or deviation from the task spec.

## Task dependency graph (high-level)

```
T00 → T01 → T02 → T03
            │
            ├─→ T04 → T05 → T06    (data layer, T07 parallel)
            └─→ T07                (progress hook)

T03 + T05 → T08 → T09 → T10
                       └→ T11

T06 + T07 → T12 → T13
T06 + T07 → T14 → (T15 optional)

T01 + T02 → T16

T10+T11+T13+T14+T16 → T17 → T18 → T19
```

Parallel-safe groups after T03: `{T04→T05→T06}`, `{T07}`, `{T16}`. The orchestrator should batch these in one dispatch where possible.

## Index of tasks

See [`./README.md`](./README.md) for the numbered list with one-line summaries.
