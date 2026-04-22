# Project State

Last reviewed: 2026-04-21

## Summary
This document describes implemented behavior only.

Excel Mastery currently provides a frontend scaffold, the first formulas-track domain model, and a formula-engine foundation. The repository now includes a Vite + React application shell, Tailwind-based global styling, ESLint configuration, Vitest-based unit testing, formulas track metadata, tier metadata, challenge definitions, progression helpers for XP, stars, and unlocks, and formula-engine modules for tokenization, parsing, references, evaluation, and launch-scope beginner functions. The UI currently presents a static landing screen while the core calculation layer is built underneath it.

## Current Product Definition
There is not yet a functional learning workflow. The current app boots into a static overview screen while the formulas-track content model and formula engine are developed behind the scenes for the upcoming spreadsheet sandbox.

## Core Surfaces
- App shell: React entry point rendered through Vite
- Landing screen: static milestone, formulas track, and launch function summary layout
- Styling system: Tailwind import plus global dark-theme baseline styles
- Formulas track data model: track metadata, tier metadata, challenge bank, and curriculum phase definitions
- Progression helpers: pure XP, level, star, and unlock utilities
- Formula engine: tokenizer, parser, AST evaluator, reference/range helpers, typed engine errors, and launch-scope beginner function support
- Verification setup: ESLint and Vitest configuration with smoke tests, data-model unit coverage, and formula-engine unit coverage

## Persistence and Portability
- Persisted data:
  - none yet
- Storage mechanism:
  - none yet
- Import/export:
  - not yet implemented
- Compatibility guarantees:
  - no persistence contract exists yet
  - the future runtime storage API is expected to be isolated behind an adapter layer

## Protected Flows
- app startup
- render landing screen
- run unit tests
- run lint
- run production build

## Verification Baseline
- `npm.cmd run test`
- `npm.cmd run lint`
- `npm.cmd run build`

## Known Limits
- No challenge workflow exists yet.
- No spreadsheet sandbox UI exists yet.
- No persistence adapter exists yet.
- No interactive navigation, sandbox, or challenge completion flow exists yet.

## Current Direction
Active build-out. The immediate focus is continuing milestone 2 into the next slice: expanding the formula engine beyond beginner coverage and then connecting it to the spreadsheet sandbox.
