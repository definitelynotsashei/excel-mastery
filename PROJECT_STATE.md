# Project State

Last reviewed: 2026-04-21

## Summary
This document describes implemented behavior only.

Excel Mastery currently provides a frontend scaffold for the planned training app. The repository now includes a Vite + React application shell, Tailwind-based global styling, ESLint configuration, and Vitest-based unit test setup. The UI currently presents a static landing screen that summarizes the project direction and milestone focus.

## Current Product Definition
There is not yet a functional learning workflow. The current app boots into a static overview screen that confirms the initial scaffold is working and the project is ready for the first implementation milestone.

## Core Surfaces
- App shell: React entry point rendered through Vite
- Landing screen: static milestone and module summary card layout
- Styling system: Tailwind import plus global dark-theme baseline styles
- Verification setup: ESLint and Vitest configuration with one app render smoke test

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
- No persistence, navigation, or track progression exists yet.

## Current Direction
Active build-out. The immediate focus is milestone 0 and milestone 1: locking the scaffold, data contracts, and initial formulas-track content model before implementing the formula engine.
