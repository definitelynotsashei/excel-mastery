# Project State

Last reviewed: 2026-04-21

## Summary
This document describes implemented behavior only.

Excel Mastery currently provides a frontend scaffold, the formulas-track domain model, a growing formula-engine core, the first spreadsheet sandbox slice, and a navigable app shell. The repository now includes a Vite + React application shell, Tailwind-based global styling, ESLint configuration, Vitest-based unit testing, formulas track metadata, tier metadata, challenge definitions, progression helpers for XP, stars, and unlocks, formula-engine modules for tokenization, parsing, references, evaluation, and supported beginner-plus-intermediate functions such as `IF`, `AND`, `OR`, `SUMIF`, `COUNTIF`, `VLOOKUP`, `IFERROR`, and `MONTH`, plus grid-state helpers and UI components for dashboard, formulas track overview, and challenge workspace surfaces.

## Current Product Definition
There is not yet a full learning workflow, but the app now boots into a navigable product shell. The user can move between a dashboard, a formulas track overview, and a challenge workspace. Inside the challenge workspace, the user can select cells, edit the target answer cell through the formula bar, see computed output rendered back into the grid, and reset the challenge preview state.

## Core Surfaces
- App shell: React entry point rendered through Vite with local view-state navigation between dashboard, track view, and challenge workspace
- Dashboard: recommended next challenge, track cards, milestone readiness, and launch-scope summary
- Track view: formulas-track overview plus tier-grouped challenge list
- Challenge workspace: one formulas challenge rendered with scenario details, reset action, formula bar, and spreadsheet grid
- Windows launcher: double-click VBScript files for opening and stopping the app without manual command-line usage
- Electron desktop shell: built app can run in a dedicated native window instead of only through the browser
- Styling system: Tailwind import plus global dark-theme baseline styles
- Formulas track data model: track metadata, tier metadata, challenge bank, and curriculum phase definitions
- Progression helpers: pure XP, level, star, and unlock utilities
- Formula engine: tokenizer, parser, AST evaluator, reference/range helpers, typed engine errors, range-shape support for lookup tables, and supported beginner plus key intermediate functions
- Grid model: active-cell state, target-cell formula drafts, evaluation mapping, and display selectors for the sandbox
- App-shell helpers: recommended challenge and tier summary helpers for UI composition
- Verification setup: ESLint and Vitest configuration with smoke tests, data-model unit coverage, formula-engine unit coverage, sandbox grid-state coverage, and app-shell navigation coverage

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
- No completion, validation-feedback, or hint UI exists yet.
- Progress and unlock state are not yet reflected in the visible UI.
- Only one challenge workspace is deeply wired into the sandbox state at a time.
- Advanced modern-array functions such as `FILTER` and `XLOOKUP` are still unsupported.
- The current launcher still opens the app in the browser; it is not yet a packaged native desktop application.
- The launcher uses a fixed Excel-Mastery-specific local port and now fails fast instead of opening unrelated apps on occupied ports.
- The Electron shell is runnable locally but is not yet packaged into an installer or standalone `.exe`.

## Current Direction
Active build-out. The immediate focus is layering validation, hints, and completion behavior on top of the new dashboard, track, and challenge shell so the UI can start behaving like the actual learning product.
