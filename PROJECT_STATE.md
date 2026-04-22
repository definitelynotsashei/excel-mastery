# Project State

Last reviewed: 2026-04-22

## Summary
This document describes implemented behavior only.

Excel Mastery currently provides a frontend scaffold, the formulas-track domain model, a growing formula-engine core, the first spreadsheet sandbox slice, a navigable app shell, the first visible challenge-validation loop, and the first PWA install baseline. The repository now includes a Vite + React application shell, Tailwind-based global styling, ESLint configuration, Vitest-based unit testing, formulas track metadata, tier metadata, challenge definitions, progression helpers for XP, stars, and unlocks, formula-engine modules for tokenization, parsing, references, evaluation, and supported beginner-plus-intermediate functions such as `IF`, `AND`, `OR`, `SUMIF`, `COUNTIF`, `VLOOKUP`, `IFERROR`, and `MONTH`, plus grid-state helpers and UI components for dashboard, formulas track overview, challenge workspace surfaces, feedback, hints, review cards, challenge progress badges, next-challenge navigation, and persistence-backed completion, best-run, and resume summaries.

## Current Product Definition
There is not yet a full learning workflow, but the app now boots into a navigable product shell with an initial challenge loop. The user can move between a dashboard, a formulas track overview, and a challenge workspace. Inside the challenge workspace, the user can select cells, edit the target answer cell through the formula bar, see computed output rendered back into the grid, check an answer, reveal progressive hints, collapse or reopen the scenario brief, see challenge position within the formulas draft set, and continue directly into the next challenge after solving the current one. Solved challenges now persist between launches and update the dashboard recommendation, saved XP, saved level, star totals, per-tier completion counts, unlock badges, and solved markers in the formulas track view. The app also restores the last active view and the last selected formulas challenge on startup so the user resumes closer to where they left off.

Supported runtime for active use:
- Browser or installed PWA launched through `Open Excel Mastery.vbs`

## Core Surfaces
- App shell: React entry point rendered through Vite with local view-state navigation between dashboard, track view, and challenge workspace
- Dashboard: recommended next challenge, track cards, milestone readiness, and saved progress summary
- Track view: formulas-track overview plus tier-grouped challenge list with persisted completion markers, unlock badges, and best-run summaries
- Challenge workspace: one formulas challenge rendered with a collapsible scenario brief, progress badges, reset action, formula bar, spreadsheet grid, answer checking, hint reveal, review card, and next-challenge continuation button
- Windows launcher: double-click VBScript files for opening and stopping the app without manual command-line usage
- PWA baseline: web manifest, service worker registration, and installable browser-app path
- PWA baseline: web manifest, service worker registration, installable browser-app path, and network-first navigation caching to reduce stale shell issues after updates
- Electron desktop shell: built app can run in a dedicated native window instead of only through the browser
- Styling system: Tailwind import plus global dark-theme baseline styles
- Formulas track data model: track metadata, tier metadata, challenge bank, and curriculum phase definitions
- Progression helpers: pure XP, level, star, and unlock utilities
- Formula engine: tokenizer, parser, AST evaluator, reference/range helpers, typed engine errors, range-shape support for lookup tables, and supported beginner plus key intermediate functions
- Grid model: active-cell state, target-cell formula drafts, evaluation mapping, and display selectors for the sandbox
- Validation flow: challenge-result validation helper, attempt tracking, visible hints, feedback states, review-card rendering, and persisted completion capture
- Storage adapter: normalized progress payloads, optional `window.storage` support when available, IndexedDB fallback for browser/PWA persistence, and resume-state restoration for the last active view and challenge
- App-shell helpers: recommended challenge and tier summary helpers for UI composition
- Verification setup: ESLint and Vitest configuration with smoke tests, data-model unit coverage, formula-engine unit coverage, sandbox grid-state coverage, app-shell navigation coverage, and validation-flow coverage

## Persistence and Portability
- Persisted data:
  - formulas challenge completion state
  - best earned stars per completed formulas challenge
  - best solved-run summary per formulas challenge:
    submission count and hints used for the best saved run
  - last active app view
  - last active formulas challenge
- Storage mechanism:
  - `window.storage` when present and compatible
  - otherwise IndexedDB via the app storage adapter
- Import/export:
  - not yet implemented
- Compatibility guarantees:
  - progress is stored behind a versioned adapter payload
  - invalid or unknown challenge records are ignored during hydration
  - challenge progress currently stores completion, best stars, and the best saved solved-run summary

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
- Persistence currently covers formulas challenge completion, best stars, best solved-run summary, last active view, and last active formulas challenge only; full attempt history and in-progress formula drafts are not persisted.
- Progress and unlock state persist on the current device, but there is no import/export or sync layer yet.
- Advanced modern-array functions such as `FILTER` and `XLOOKUP` are still unsupported.
- The current launcher still opens the app in the browser; it is not yet a packaged native desktop application.
- The launcher uses a fixed Excel-Mastery-specific local port and now fails fast instead of opening unrelated apps on occupied ports.
- The Electron shell is runnable locally but is not yet packaged into an installer or standalone `.exe`.
- The Electron shell now loads the built app through an internal local server rather than opening `dist/index.html` directly.
- The supported runtime for actual use is now the browser/PWA path, while the Electron shell remains experimental.

## Runtime Notes
- Browser/PWA is the only supported path for active testing until another runtime is explicitly revalidated.
- New launcher or desktop approaches must not be treated as the default path until the user confirms the UI renders correctly.
- The service worker now uses network-first handling for page navigations so browser launches pick up newer app shells more reliably after updates.

## Current Direction
Active build-out. The immediate focus is expanding the persisted learning state beyond basic completion so XP, stars, recommendations, and eventually unlock thresholds have a clearer long-term progression model.

## Next Session Handoff
- Supported runtime remains the browser/PWA path launched through `Open Excel Mastery.vbs`.
- Resume behavior is now user-confirmed working after the service-worker cache fix and a hard refresh.
- Formulas progress now persists:
  - completion
  - best stars
  - best solved-run summary
  - last active view
  - last active formulas challenge
- The next highest-value build target is progression quality, not more storage plumbing:
  - improve recommendation logic beyond "first unsolved"
  - make unlock progression clearly driven by persisted completion data
  - decide whether in-progress draft state should be persisted or intentionally left ephemeral
- If work continues on persistence, preserve backward compatibility with the existing saved payload shape and keep the storage adapter as the only persistence boundary.
