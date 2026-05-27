# T01 — Install @shopify/react-native-skia

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Add `@shopify/react-native-skia` as a dependency, pinned to the version Expo SDK 54 recommends. Do NOT modify babel/metro config unless T00's research said it's required.

## Depends on

[T00](./T00-skia-research.md) — the install command and version are determined there.

## Touches

- `package.json` (new dep entry)
- `package-lock.json` (or whichever lockfile the repo uses — check first)

## Steps

1. Run the install command identified in T00 — expected: `npx expo install @shopify/react-native-skia`.
2. After install, restart the Metro bundler once with cache cleared: `npx expo start --clear` and stop it after it reports a clean build.

## Verify

- `package.json` lists `@shopify/react-native-skia` under `dependencies`.
- Build succeeds with no errors.
- Manually confirm `import { Canvas } from '@shopify/react-native-skia'` would resolve (look for it in `node_modules/`).

## Anti-goals

- Do NOT add a babel plugin entry unless T00's research explicitly said it's required.
- Do NOT touch any source files. This task is dependencies only.
