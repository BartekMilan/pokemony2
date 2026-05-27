# T05 — Parallax Layers

**Goal:** Layers shift at different rates for depth.

## Tasks

1. Keep 3D rotation on card shell only.
2. Split into `BackgroundLayer` (0.3×), `PokemonLayer` (0.8×), `FrameLayer` (0×).
3. Each layer: `useAnimatedStyle` with `translateX/Y` from `parallaxX/Y`.
4. Scale Pokemon layer slightly (`POKEMON_SCALE = 1.02`).

## Acceptance

Background drifts subtly, Pokémon shifts more, frame/stats stay crisp.
