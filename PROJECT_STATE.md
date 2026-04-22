# Project State

Last reviewed: 2026-04-21

## Summary
This document describes implemented behavior only.

Excel Mastery currently provides a frontend scaffold plus the first real formulas-track domain model. The repository now includes a Vite + React application shell, Tailwind-based global styling, ESLint configuration, Vitest-based unit testing, formulas track metadata, tier metadata, challenge definitions, and progression helpers for XP, stars, and unlocks. The UI currently presents a static landing screen that summarizes the formulas-track scope and milestone focus.

## Current Product Definition
There is not yet a functional learning workflow. The current app boots into a static overview screen that confirms the formulas-track content model is loaded and the project is ready for formula-engine implementation.

## Core Surfaces
- App shell: React entry point rendered through Vite
- Landing screen: static milestone, formulas track, and launch function summary layout
- Styling system: Tailwind import plus global dark-theme baseline styles
- Formulas track data model: track metadata, tier metadata, challenge bank, and curriculum phase definitions
- Progression helpers: pure XP, level, star, and unlock utilities
- Verification setup: ESLint and Vitest configuration with smoke tests and data-model unit coverage

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
- No formula engine exists yet.
- No persistence adapter exists yet.
- No interactive navigation, sandbox, or challenge completion flow exists yet.

## Current Direction
Active build-out. The immediate focus is milestone 2: implementing the formula engine against the drafted formulas-track content model.
