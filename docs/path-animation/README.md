# Animated Drawing Path — Plan Index

A 20-step plan to build a self-contained Skia + Reanimated animated drawing path demo. Start by reading [`ARCHITECTURE.md`](./ARCHITECTURE.md). Then dispatch one task at a time from `./tasks/` to a sub-agent.

## How to use this folder

1. **Orchestrator** (the main conversation): keep the plan high-level — never load all task files into context simultaneously.
2. **Sub-agent per task**: dispatch with the prompt template below. Each sub-agent reads `ARCHITECTURE.md` + one task file only.
3. **Gate between tasks**: after each task, the orchestrator inspects the diff (`git diff`), runs `npx tsc --noEmit`, and reports to the user before dispatching the next.

## Sub-agent dispatch prompt template

```
You are executing task T0X from a multi-step plan.

Required reading (read these two files only, in order):
1. /Users/bartekmilan/Desktop/pokemony2/docs/path-animation/ARCHITECTURE.md
2. /Users/bartekmilan/Desktop/pokemony2/docs/path-animation/tasks/T0X-<slug>.md

Execute exactly that task. Do not read other files unless the task tells you to.
Do not refactor unrelated code. Do not run `npm` commands unless the task tells you to.

When done, report:
- Files touched (paths only, no contents)
- 3-line summary of what changed
- Any anomaly or deviation from the spec
```

## Tasks

| # | Title | Touches | Verify |
|---|---|---|---|
| [T00](tasks/T00-skia-research.md) | Verify Skia version for Expo SDK 54 | research only | install command identified |
| [T01](tasks/T01-install-skia.md) | Install `@shopify/react-native-skia` | `package.json` | build passes, import resolves |
| [T02](tasks/T02-scaffold-dirs.md) | Scaffold `components/path-animation/` tree | new dirs + `index.ts` | dirs exist |
| [T03](tasks/T03-smoke-test.md) | Skia smoke-test screen + new tab | `app/(tabs)/path-animation.tsx`, `_layout.tsx` | tomato rect visible on "Path" tab |
| [T04](tasks/T04-waypoints.md) | Define waypoint data | `pathDefinition.ts` | type-checks |
| [T05](tasks/T05-path-string.md) | Generate SVG path string | `pathDefinition.ts` | starts with `M`, 5× `C` |
| [T06](tasks/T06-waypoint-progress.md) | Compute arc-length progress per waypoint | `pathDefinition.ts` | monotonic, ends at 1.0 |
| [T07](tasks/T07-progress-hook.md) | `useDrawProgress` hook | `useDrawProgress.ts` | shared value loops 0→1 |
| [T08](tasks/T08-static-path.md) | Render static full path | `DrawnPath.tsx`, screen | cream line visible |
| [T09](tasks/T09-animated-path.md) | Animate via `progress` (trim) | `DrawnPath.tsx`, screen | path draws itself in 5s loop |
| [T10](tasks/T10-glow-trail.md) | Glow trail under the drawn path | `GlowTrail.tsx`, screen | halo follows the line |
| [T11](tasks/T11-comet-glow.md) | Comet glow at the leading edge | `CometGlow.tsx`, screen | bright glow at tip |
| [T12](tasks/T12-waypoint-flare.md) | `WaypointFlare` component (single) | `WaypointFlare.tsx` | flare visible at fixed progress |
| [T13](tasks/T13-render-flares.md) | Render all 6 waypoint flares | screen | each waypoint pulses in order |
| [T14](tasks/T14-leading-dot.md) | Leading dot at tip | `LeadingDot.tsx`, screen | dot rides the tip |
| [T15](tasks/T15-dot-rotation.md) | Tangent rotation (optional) | `LeadingDot.tsx` | arrow rotates along path |
| [T16](tasks/T16-background.md) | Procedural green background | `Background.tsx`, screen | green map visible underneath |
| [T17](tasks/T17-scene-extract.md) | Extract `Scene` component | `Scene.tsx`, screen, `index.ts` | tab screen is a thin wrapper |
| [T18](tasks/T18-visual-tuning.md) | Visual tuning pass | any layer files | rubric in task file |
| [T19](tasks/T19-e2e-verify.md) | End-to-end verification | none (verify only) | "all green" or anomaly list |

## Recommended dispatch order

- **Setup**: T00 → T01 → T02 → T03 (sequential, single agent each)
- **Data + hooks**: T04 → T05 → T06, and T07 in parallel
- **First visible**: T08 → T09 (sequential, visual gate after each)
- **Shine**: T10 → T11 → T12 → T13 → T14 (sequential, visual gate after each)
- **Optional polish**: T15 (skip if not desired)
- **Composition**: T16 → T17
- **Final**: T18 → T19

## Visual checkpoints (use `verify` skill or eyeball)

T03 (smoke), T08 (static path), T09 (animation), T10 (trail glow), T11 (comet), T13 (flares), T14 (dot), T16 (background), T17 (composed), T18 (polished), T19 (full E2E).
