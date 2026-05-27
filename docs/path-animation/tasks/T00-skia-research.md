# T00 — Verify Skia version compatibility (research only)

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Confirm the correct version of `@shopify/react-native-skia` to install for Expo SDK 54.0.33. Do NOT install yet.

## Depends on

Nothing.

## Touches

Nothing. This task is read-only research.

## Steps

1. WebFetch `https://docs.expo.dev/versions/v54.0.0/sdk/skia/`. If that 404s, try `https://docs.expo.dev/versions/v54.0.0/` and follow the index to the Skia entry, or check Skia's own README at `https://github.com/Shopify/react-native-skia` for an SDK 54 compatibility table.
2. Note the canonical install command (expected: `npx expo install @shopify/react-native-skia`).
3. Note the version that command will resolve to for SDK 54.

## Report

- Install command (verbatim)
- Resolved version
- Any extra setup steps the docs mention (e.g., babel plugin, metro config) — flag for T01
