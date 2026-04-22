# Project State

Last reviewed: 2026-04-21

## Summary
This document describes implemented behavior only.

Excel Mastery currently provides a frontend scaffold, the formulas-track domain model, a growing formula-engine core, the first spreadsheet sandbox slice, a navigable app shell, the first visible challenge-validation loop, and the first PWA install baseline. The repository now includes a Vite + React application shell, Tailwind-based global styling, ESLint configuration, Vitest-based unit testing, formulas track metadata, tier metadata, challenge definitions, progression helpers for XP, stars, and unlocks, formula-engine modules for tokenization, parsing, references, evaluation, and supported beginner-plus-intermediate functions such as `IF`, `AND`, `OR`, `SUMIF`, `COUNTIF`, `VLOOKUP`, `IFERROR`, and `MONTH`, plus grid-state helpers and UI components for dashboard, formulas track overview, challenge workspace surfaces, feedback, hints, review cards, challenge progress badges, next-challenge navigation, and session-only completion summaries.

## Current Product Definition
There is not yet a full learning workflow, but the app now boots into a navigable product shell with an initial challenge loop. The user can move between a dashboard, a formulas track overview, and a challenge workspace. Inside the challenge workspace, the user can select cells, edit the target answer cell through the formula bar, see computed output rendered back into the grid, check an answer, reveal progressive hints, collapse or reopen the scenario brief, see challenge position within the formulas draft set, and continue directly into the next challenge after solving the current one. During the active session, solved challenges update the dashboard recommendation, session XP, session level, star totals, per-tier completion counts, unlock badges, and solved markers in the formulas track view.

Supported runtime for active use:
- Browser or installed PWA launched through `Open Excel Mastery.vbs`

## Core Surfaces
- App shell: React entry point rendered through Vite with local view-state navigation between dashboard, track view, and challenge workspace
- Dashboard: recommended next challenge, track cards, milestone readiness, and session progress summary
- Track view: formulas-track overview plus tier-grouped challenge list with session completion markers and unlock badges
- Challenge workspace: one formulas challenge rendered with a collapsible scenario brief, progress badges, reset action, formula bar, spreadsheet grid, answer checking, hint reveal, review card, and next-challenge continuation button
- Windows launcher: double-click VBScript files for opening and stopping the app without manual command-line usage
- PWA baseline: web manifest, service worker registration, and installable browser-app path
- Electron desktop shell: built app can run in a dedicated native window instead of only through the browser
- Styling system: Tailwind import plus global dark-theme baseline styles
- Formulas track data model: track metadata, tier metadata, challenge bank, and curriculum phase definitions
- Progression helpers: pure XP, level, star, and unlock utilities
- Formula engine: tokenizer, parser, AST evaluator, reference/range helpers, typed engine errors, range-shape support for lookup tables, and supported beginner plus key intermediate functions
- Grid model: active-cell state, target-cell formula drafts, evaluation mapping, and display selectors for the sandbox
- Validation flow: challenge-result validation helper, attempt tracking, visible hints, feedback states, review-card rendering, and session-only completion capture
- App-shell helpers: recommended challenge and tier summary helpers for UI composition
- Verification setup: ESLint and Vitest configuration with smoke tests, data-model unit coverage, formula-engine unit coverage, sandbox grid-state coverage, app-shell navigation coverage, and validation-flow coverage

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
- render dashboard shell
- open formulas track
- open challenge workspace
- run unit tests
- run lint
- run production build

## Verification Baseline
- `npm.cmd run test`
- `npm.cmd run lint`
- `npm.cmd run build`

## Known Limits
- The challenge workflow is still limited to a local session and does not yet survive reloads or new app launches.
- No persistence adapter exists yet.
- No persisted challenge completion state exists yet.
- Progress and unlock state are visible only for the current session and are reset when the app restarts.
- Advanced modern-array functions such as `FILTER` and `XLOOKUP` are still unsupported.
- The current launcher still opens the app in the browser; it is not yet a packaged native desktop application.
- The launcher uses a fixed Excel-Mastery-specific local port and now fails fast instead of opening unrelated apps on occupied ports.
- The Electron shell is runnable locally but is not yet packaged into an installer or standalone `.exe`.
- The Electron shell now loads the built app through an internal local server rather than opening `dist/index.html` directly.
- The supported runtime for actual use is now the browser/PWA path, while the Electron shell remains experimental.

## Runtime Notes
- Browser/PWA is the only supported path for active testing until another runtime is explicitly revalidated.
- New launcher or desktop approaches must not be treated as the default path until the user confirms the UI renders correctly.

## Current Direction
Active build-out. The immediate focus is moving from session-only progress into real persistence-backed progression so recommendations, unlocks, and completion state survive between launches.
