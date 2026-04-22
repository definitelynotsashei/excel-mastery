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

### Changed
- Established default engineering and documentation workflow.
- Replaced placeholder roadmap content with a concrete Excel Mastery build roadmap.
- Replaced the starter-pack README and project state placeholders with actual scaffold documentation.
- Updated the application shell to surface real formulas-track planning data instead of scaffold-only placeholder content.

### Fixed
- Use this section only for real bug fixes.
