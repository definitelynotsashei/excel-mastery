# Excel Mastery

Excel Mastery is a scenario-based Excel training app focused on practical workplace spreadsheet skills. The product teaches users through guided challenges, a spreadsheet sandbox, progression systems, and track-based practice.

## Current Status

The repository is in active build-out. The current milestone establishes the frontend scaffold and module boundaries for the first release-quality vertical slice:
- `Formulas & Functions` as the first full track
- Vite + React app shell
- Tailwind-based styling baseline
- ESLint and Vitest verification

## Project Docs

- `AGENTS.md`: repo workflow and session guide
- `PROJECT_STATE.md`: implemented behavior only
- `ROADMAP.md`: current priorities
- `CHANGELOG.md`: notable visible changes
- `docs/V1_PRODUCT_SPEC.md`: concrete v1 product scope
- `docs/IMPLEMENTATION_PLAN.md`: milestones and module responsibilities

## Commands

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

## Open As An App

For a double-click launch on Windows, use:

- `Open Excel Mastery.vbs`

This will:
- build the current app
- start a hidden local server
- open Excel Mastery in your default browser automatically on a project-specific local port
- let you install it from Edge or Chrome as an app window once it opens

To stop the hidden app server, use:

- `Close Excel Mastery.vbs`

## Recommended Runtime

The supported path for active use right now is:
- browser or installed PWA

Recommended flow:
1. Double-click `Open Excel Mastery.vbs`
2. Let the app open in Edge or Chrome
3. Use the browser's `Install app` / `Install this site as an app` option

This is the most reliable way to run Excel Mastery while the product is still in active build-out.

## Open As A Desktop App

For a true desktop window instead of a browser tab, use:

- `Open Excel Mastery Desktop.vbs`

This will:
- build the current app
- launch Excel Mastery inside an Electron desktop window through an internal local app server
- avoid the browser for normal use
