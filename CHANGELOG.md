# Changelog

All notable changes to this project are documented in this file.

## [2026-04-21]

### Added
- Initial project scaffolding.
- Initial source-of-truth docs.
- Initial workflow prompt guide.
- Initial Excel Mastery product goal definition.
- V1 product specification for the Excel Mastery training app.
- Implementation plan with milestones, module responsibilities, and delivery sequencing.
- Frontend project scaffold using Vite, React, Tailwind, ESLint, and Vitest.
- Initial static application shell and smoke test coverage.
- Formulas track metadata, tier metadata, curriculum scope, and a drafted challenge bank for Milestone 1.
- Progression helper modules for XP totals, star ratings, and tier unlock logic.
- Unit coverage for formulas-track data integrity and progression rules.
- Detailed execution plan for Milestones 2 through 7, including commit slices, acceptance criteria, and feature sequencing.
- Formula-engine foundation with tokenizer, parser, reference helpers, evaluator, typed errors, and beginner-function support.
- Unit coverage for formula parsing, reference handling, unsupported-function errors, and beginner challenge evaluation.
- Intermediate engine support for `IF`, `AND`, `OR`, `SUMIF`, `COUNTIF`, `VLOOKUP`, `IFERROR`, and `MONTH`.
- Range-shape support for lookup-table evaluation plus expanded unit coverage for intermediate challenge formulas.
- Spreadsheet sandbox preview with active-cell state, formula bar input, computed cell display, and challenge reset behavior.
- Grid-state helper modules and unit coverage for editable target cells, formula drafts, and error display states.
- Navigable product shell with dashboard, formulas track overview, and challenge workspace views.
- App-shell helpers and tests covering UI navigation into the formulas workspace.
- Windows double-click launcher and stop scripts so the app can be opened without manually using the command prompt.
- Launcher fix so Excel Mastery uses its own local port instead of opening an unrelated app already running on a shared preview port.
- Electron desktop shell and desktop-launch VBScript so Excel Mastery can run as its own application window instead of only in the browser.
- Desktop-shell load-path fix so Electron serves the built app internally over HTTP instead of relying on direct `file://` asset loading.
- PWA baseline with manifest, service worker, installable browser-app path, and a fix for the missing React import in the app entry point that could cause a blank page at startup.
- Workflow guardrails for future sessions: validated browser/PWA path as the supported runtime, explicit UI-access confirmation before deeper feature work, and stronger startup rules in repo docs.
- Challenge validation flow with answer checking, progressive hints, visible feedback states, and a review card for solved formulas challenges.
- Challenge progress badges, a collapsible scenario briefing, and next-challenge navigation inside the formulas workspace.
- Session-only progress tracking that updates dashboard recommendations, session XP and level, tier completion counts, unlock badges, and solved challenge markers.
- Persistence-backed progress using a storage adapter with IndexedDB fallback, plus autosave and hydration so formulas completion survives reloads and relaunches.
- Resume-state persistence so the app restores the last active view and formulas challenge instead of always reopening at the default dashboard state.
- Service-worker cache strategy fix so browser/PWA launches stop preferring stale cached app shells for navigations after updates.

### Changed
- Established default engineering and documentation workflow.
- Replaced placeholder roadmap content with a concrete Excel Mastery build roadmap.
- Replaced the starter-pack README and project state placeholders with actual scaffold documentation.
- Updated the application shell to surface real formulas-track planning data instead of scaffold-only placeholder content.

### Fixed
- Fixed the desktop shell blank-window issue by changing the Vite build output to use relative asset paths, so Electron can load bundled JS and CSS from `dist` correctly.
