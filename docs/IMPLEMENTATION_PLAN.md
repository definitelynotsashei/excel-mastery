# Excel Mastery Implementation Plan

Last updated: 2026-04-21

## Planning Assumptions
- We will not treat `single React component` as a hard architecture rule. The app can render from one root component while using extracted modules for logic, data, and helpers.
- We will not block planning on unresolved runtime details that do not fit the current structure. `window.storage` will be treated as an adapter boundary to be integrated only when the runtime contract is known.
- V1 means one production-quality vertical slice, not four half-built tracks.
- `Formulas & Functions` is the first fully implemented track.
- Other tracks should be planned now, but only lightweight placeholders should exist before the core sandbox is stable.

## Delivery Strategy
Build from the center outward:
1. content model and data contracts
2. formula engine and validation logic
3. spreadsheet sandbox interaction
4. progression and persistence
5. dashboard and track navigation
6. content expansion and secondary tracks

This order reduces rework because the curriculum, UI, and progression rules all depend on the challenge schema and evaluation engine.

## Milestones

### Milestone 0: Repository And Build Setup
Goal:
- make the project executable and establish development workflow

Deliverables:
- initialize Git in this workspace if the folder is intended to back the provided GitHub repo
- create the baseline React app structure for this repo
- add project scripts for development, test, lint, and build
- choose and document the React/Tailwind toolchain
- add a thin storage adapter interface without final runtime coupling

Acceptance criteria:
- app boots locally
- test command exists
- lint command exists
- build command exists
- repository can accept commits cleanly

Primary risks:
- premature framework selection before we confirm expected deployment/runtime
- trying to wire real persistence before the `window.storage` contract is known

### Milestone 1: Domain Modeling And Curriculum Foundations
Goal:
- define the data contracts that every other feature depends on

Deliverables:
- challenge schema for formulas track
- track metadata schema
- tier metadata schema
- star and XP rules
- unlock rules
- initial formulas curriculum map by tier
- 8-12 beginner challenge definitions drafted

Acceptance criteria:
- challenge data can be loaded and rendered without UI-specific hacks
- unlock logic can be computed from challenge metadata
- all beginner challenges map only to supported v1 formula features

Primary risks:
- designing challenge content before engine scope is constrained
- mixing validation rules into component code instead of the content model

### Milestone 2: Formula Engine Core
Goal:
- support the first complete batch of formula-based challenges

Deliverables:
- tokenizer/parser strategy
- evaluator for literals, arithmetic, references, and ranges
- function registry for launch functions
- deterministic error handling
- unit tests for supported formulas

Acceptance criteria:
- launch functions evaluate reliably for planned beginner challenges
- nested calls work for at least simple intermediate cases
- errors are typed well enough to power user-facing feedback

Primary risks:
- underestimating parsing complexity
- overreaching toward full Excel parity too early

### Milestone 3: Spreadsheet Sandbox
Goal:
- create the main interactive practice surface

Deliverables:
- 8x12 grid rendering
- row and column headers
- selected cell state
- target-cell editing model
- formula bar
- computed cell display
- challenge reset flow

Acceptance criteria:
- user can open a challenge and answer in the intended target cell
- non-editable cells stay protected
- formula bar and grid stay in sync

Primary risks:
- allowing too much spreadsheet behavior too early
- coupling grid rendering directly to formula evaluation internals

### Milestone 4: Validation, Hints, Review, And Completion Flow
Goal:
- complete the learning loop inside a challenge

Deliverables:
- validation rules by challenge mode
- attempt tracking
- progressive hint reveal
- feedback panel states
- completion state transition
- review card with concept explanation and solution summary

Acceptance criteria:
- a challenge can be failed, retried, hinted, and completed
- star rating reflects hint and attempt behavior
- user receives meaningful error feedback

Primary risks:
- shallow validation that encourages brute-force guessing
- hint logic leaking into unrelated UI state

### Milestone 5: Progression, Persistence, And Navigation
Goal:
- connect individual challenges into a product loop

Deliverables:
- home dashboard
- formulas track view
- tier lock and unlock logic
- XP totals and level framing
- persisted progress adapter
- recommended next challenge logic

Acceptance criteria:
- completion updates dashboard and track progress
- reopening the app restores the last meaningful user state
- locked tiers behave consistently

Primary risks:
- persistence shape changing after UI is already built
- unclear separation between derived state and stored state

### Milestone 6: V1 Curriculum Completion And Polish
Goal:
- finish the first release-quality formulas experience

Deliverables:
- complete beginner, intermediate, and advanced formulas challenge set for v1
- visual polish pass
- responsive behavior review
- browser-level regression coverage for the protected flow
- project docs updated to match implemented behavior

Acceptance criteria:
- formulas track feels coherent and complete
- the challenge progression is understandable and motivating
- docs and tests reflect actual shipped behavior

Primary risks:
- pushing secondary features before the first track feels finished
- content inconsistency across difficulty tiers

### Milestone 7: Secondary Tracks
Goal:
- expand after the formulas track is stable

Recommended order:
1. Keyboard Shortcuts
2. Data Analysis
3. Charts & Visualization

Reasoning:
- shortcuts have the lowest technical dependency
- data analysis needs a stronger interaction model
- charts should focus on reasoning quality before custom chart rendering

## Module Responsibilities

The exact filenames can shift with the chosen app scaffold, but responsibility boundaries should remain stable.

### App Shell
Responsibility:
- top-level routing/state flow between dashboard, track view, and challenge view

Suggested location:
- `src/app/`

Expected modules:
- `src/app/App.jsx`
- `src/app/routes.js` or equivalent view-state constants
- `src/app/app-shell.js` for high-level orchestration helpers

### Challenge Data
Responsibility:
- static track, tier, and challenge definitions

Suggested location:
- `src/features/formulas/data/`
- `src/features/shared-data/` if cross-track metadata emerges

Expected modules:
- `src/features/formulas/data/challenges.js`
- `src/features/formulas/data/tiers.js`
- `src/features/formulas/data/tracks.js`

### Formula Engine
Responsibility:
- parsing, reference resolution, range resolution, function dispatch, and evaluation

Suggested location:
- `src/lib/formula-engine/`

Expected modules:
- `src/lib/formula-engine/tokenize.js`
- `src/lib/formula-engine/parse.js`
- `src/lib/formula-engine/evaluate.js`
- `src/lib/formula-engine/functions.js`
- `src/lib/formula-engine/references.js`
- `src/lib/formula-engine/errors.js`

### Spreadsheet Model
Responsibility:
- challenge grid normalization, editable-cell handling, displayed-value derivation, active-cell state helpers

Suggested location:
- `src/features/formulas/lib/`

Expected modules:
- `src/features/formulas/lib/grid-model.js`
- `src/features/formulas/lib/grid-actions.js`
- `src/features/formulas/lib/grid-selectors.js`

### Validation And Scoring
Responsibility:
- challenge evaluation rules, attempt bookkeeping, star scoring, XP calculation

Suggested location:
- `src/lib/progression/`
- `src/features/formulas/lib/` for track-specific validation helpers

Expected modules:
- `src/lib/progression/stars.js`
- `src/lib/progression/unlocks.js`
- `src/lib/progression/xp.js`
- `src/features/formulas/lib/validate-challenge.js`

### Persistence Adapter
Responsibility:
- isolate all runtime storage calls from the rest of the app

Suggested location:
- `src/lib/storage/`

Expected modules:
- `src/lib/storage/storage-adapter.js`
- `src/lib/storage/profile-store.js`
- `src/lib/storage/schema-version.js`

Design rule:
- only the adapter layer should know about `window.storage`

### UI Components
Responsibility:
- reusable presentational surfaces without business-rule ownership

Suggested location:
- `src/components/shared/`
- `src/features/formulas/components/`

Expected modules:
- `src/components/shared/card.jsx`
- `src/components/shared/progress-bar.jsx`
- `src/features/formulas/components/spreadsheet-grid.jsx`
- `src/features/formulas/components/formula-bar.jsx`
- `src/features/formulas/components/challenge-brief.jsx`
- `src/features/formulas/components/feedback-panel.jsx`
- `src/features/formulas/components/review-card.jsx`

### Styling
Responsibility:
- theme tokens, semantic colors, global layout primitives

Suggested location:
- `src/styles/`

Expected modules:
- `src/styles/tokens.css`
- `src/styles/globals.css`

## Work Breakdown By Feature

### Feature Plan: Dashboard
Dependencies:
- track metadata
- progression state
- recommended-next logic

Implementation order:
1. render static dashboard shell
2. bind formulas-track progress
3. add XP and streak summary
4. add recommended next challenge
5. add placeholder states for unimplemented tracks

### Feature Plan: Track View
Dependencies:
- challenge metadata
- unlock logic
- completion state

Implementation order:
1. static tier layout
2. challenge listing from data
3. lock-state wiring
4. star/completion display

### Feature Plan: Challenge View
Dependencies:
- active challenge data
- grid model
- validation
- hints
- completion flow

Implementation order:
1. shell layout
2. scenario briefing card
3. spreadsheet sandbox integration
4. feedback panel
5. review state

### Feature Plan: Formula Track Content
Dependencies:
- supported function list
- validation modes

Implementation order:
1. beginner challenge bank
2. intermediate challenge bank
3. advanced challenge bank
4. copy pass for tone consistency
5. curriculum QA against supported engine behavior

### Feature Plan: Keyboard Shortcuts Track
Dependencies:
- basic navigation shell
- text-match validation
- timer logic

Implementation order:
1. data model
2. timed prompt shell
3. answer normalization
4. scoring
5. content expansion

### Feature Plan: Data Analysis Track
Dependencies:
- challenge model for multiple-choice and guided reasoning

Implementation order:
1. define interaction types clearly
2. prototype one reasoning challenge type
3. add dataset-backed questions
4. decide whether grid interaction is necessary for v2

### Feature Plan: Charts Track
Dependencies:
- multiple-choice validation
- chart prompt content model

Implementation order:
1. static business-question cards
2. answer validation
3. critique mode
4. visual refinement

## Testing Plan

### Unit Tests
Ownership:
- `tests/unit/`

Priority areas:
- formula tokenizer and parser
- evaluator and function registry
- reference and range resolution
- validation and scoring
- unlock calculations
- persistence adapter contract

### Browser Tests
Ownership:
- `tests/browser/`

Priority flows:
- load dashboard
- open formulas track
- start challenge
- enter formula
- receive validation
- complete challenge
- persist and reload progress

## Documentation Responsibilities
- Update `PROJECT_STATE.md` when implemented behavior becomes real.
- Update `CHANGELOG.md` when milestones produce notable visible changes.
- Update `ROADMAP.md` only when priorities change, not for normal execution.
- Keep this implementation plan aligned with actual module boundaries as the codebase takes shape.

## Git Workflow Expectations
- Make small, reviewable commits aligned to milestone slices.
- Do not batch unrelated planning, setup, engine, and UI work into one commit.
- Push after each meaningful checkpoint once the repository is initialized and the remote is verified.

Suggested commit rhythm:
1. planning docs
2. project scaffold
3. challenge data model
4. formula engine core
5. spreadsheet sandbox
6. completion flow and progression
7. formulas v1 polish

## Immediate Next Steps
1. Initialize this folder as the actual Git repository for `excel-mastery`, or replace it with a proper clone if that is the intended source of truth.
2. Add the project scaffold and lock the toolchain.
3. Draft the formulas track challenge set against the launch function list.
4. Implement the formula engine before building the dashboard in depth.
