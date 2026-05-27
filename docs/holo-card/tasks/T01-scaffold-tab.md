# T01 — Tab Scaffold & Static Card

**Goal:** Runnable empty card on a new tab.

## Tasks

1. Add `app/(tabs)/holo-card.tsx` and register **Holo Card** tab in `_layout.tsx`.
2. Create `components/holo-card/` with `HoloPokemonCard`, `index.ts`.
3. Define `CARD_W = 280`, `CARD_H = 390` in `constants/cardLayout.ts`.
4. Render four absolutely positioned layers inside a clipped container (`overflow: 'hidden'`, `borderRadius`).

## Acceptance

New tab shows a static layered Charizard card centered on a dark background.
