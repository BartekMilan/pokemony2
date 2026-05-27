# T02 — Scaffold the new feature directory tree

**Read first**: [`../ARCHITECTURE.md`](../ARCHITECTURE.md)

## Goal

Create the empty directory structure for the new feature so every later task has a place to write its file.

## Depends on

[T01](./T01-install-skia.md).

## Touches

Creates:
- directory `components/path-animation/`
- directory `components/path-animation/data/`
- directory `components/path-animation/hooks/`
- directory `components/path-animation/layers/`
- file `components/path-animation/index.ts` with body `export {};` (placeholder — filled in T17)

## Steps

1. `mkdir -p components/path-animation/{data,hooks,layers}` (from project root).
2. Write `components/path-animation/index.ts` containing the single line `export {};`.

## Verify

- `ls components/path-animation/{data,hooks,layers}/` succeeds.
- `cat components/path-animation/index.ts` outputs `export {};`.
- `npx tsc --noEmit` still passes.

## Anti-goals

- Do NOT create any other files in these directories. Later tasks own each file.
