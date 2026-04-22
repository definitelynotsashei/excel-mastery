# Project State

Last reviewed: 2026-04-21

## Summary
This document describes implemented behavior only.

Excel Mastery currently provides a frontend scaffold, the formulas-track domain model, a growing formula-engine core, and the first spreadsheet sandbox slice. The repository now includes a Vite + React application shell, Tailwind-based global styling, ESLint configuration, Vitest-based unit testing, formulas track metadata, tier metadata, challenge definitions, progression helpers for XP, stars, and unlocks, formula-engine modules for tokenization, parsing, references, evaluation, and supported beginner-plus-intermediate functions such as `IF`, `AND`, `OR`, `SUMIF`, `COUNTIF`, `VLOOKUP`, `IFERROR`, and `MONTH`, plus grid-state helpers and UI components for a single challenge preview with an editable target cell and formula bar.

## Current Product Definition
There is not yet a full learning workflow, but the app now boots into a working sandbox preview for one formulas challenge. The user can select cells, edit the target answer cell through the formula bar, see computed output rendered back into the grid, and reset the challenge preview state.

## Core Surfaces
- App shell: React entry point rendered through Vite
- Sandbox preview: one formulas challenge rendered with scenario details, reset action, formula bar, and spreadsheet grid
- Styling system: Tailwind import plus global dark-theme baseline styles
- Formulas track data model: track metadata, tier metadata, challenge bank, and curriculum phase definitions
- Progression helpers: pure XP, level, star, and unlock utilities
- Formula engine: tokenizer, parser, AST evaluator, reference/range helpers, typed engine errors, range-shape support for lookup tables, and supported beginner plus key intermediate functions
- Grid model: active-cell state, target-cell formula drafts, evaluation mapping, and display selectors for the sandbox
- Verification setup: ESLint and Vitest configuration with smoke tests, data-model unit coverage, formula-engine unit coverage, and sandbox grid-state coverage

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
- No persistence adapter exists yet.
- No full track navigation or challenge completion flow exists yet.
- Only one sandbox preview challenge is wired into the UI so far.
- Advanced modern-array functions such as `FILTER` and `XLOOKUP` are still unsupported.

## Current Direction
Active build-out. The immediate focus is expanding the sandbox from a single preview into a fuller challenge-view workflow and then layering validation, hints, and completion behavior on top of it.
