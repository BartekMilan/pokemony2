# T04 — Spring Physics

**Goal:** Replace raw sensor jitter with weighted motion.

## Tasks

1. Pipe sensor → `useAnimatedReaction` → `withSpring` on output SharedValues.
2. Centralize `CARD_SPRING_CONFIG` in `cardLayout.ts`.
3. All downstream styles read spring-smoothed values, not raw sensor.

## Acceptance

Card motion feels fluid and slightly lags behind sharp device flicks.
