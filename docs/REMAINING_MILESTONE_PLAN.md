# Excel Mastery Remaining Milestone Plan

Last updated: 2026-04-21

## Purpose
This document expands Milestones 2 through 7 into execution-level plans. It exists to remove ambiguity from the next build phases now that Milestones 0 and 1 are complete.

## Current Baseline
Completed:
- Milestone 0: scaffold and toolchain
- Milestone 1: formulas-track data model, curriculum scope, and progression helpers

Next:
- Milestone 2: formula engine core

## Milestone 2: Formula Engine Core

### Goal
Build a reliable formula engine that supports the drafted formulas-track challenge set without chasing full Excel parity.

### Design Principles
- The engine only needs to support planned challenge content.
- Parser and evaluator behavior must be deterministic.
- Error handling must be typed and user-facing, not generic exceptions.
- Array-returning modern functions should be gated until the sandbox can render them safely.

### Deliverables
- tokenizer for formula strings
- parser for literals, operators, function calls, cell references, and ranges
- evaluator for scalar results
- reference resolution helpers
- function registry with launch functions
- typed engine error objects
- unit coverage for parsing and evaluation

### Supported Scope For The First Engine Slice
- formula prefix handling: `=`
- literals:
  - numbers
  - strings in quotes
  - booleans if needed by logical functions
- arithmetic:
  - `+`
  - `-`
  - `*`
  - `/`
  - parentheses
- references:
  - single-cell references such as `B2`
  - vertical and horizontal ranges such as `B2:B6`
- functions for first pass:
  - `SUM`
  - `AVERAGE`
  - `COUNT`
  - `MIN`
  - `MAX`
  - `COUNTA`
  - `LEN`
  - `UPPER`
  - `LOWER`
  - `TRIM`
  - `LEFT`
  - `RIGHT`
  - `MID`
  - `ROUND`
  - `ABS`

### Deferred Within Milestone 2
- `IF`
- `AND`
- `OR`
- `SUMIF`
- `COUNTIF`
- `VLOOKUP`
- `IFERROR`
- date-part functions
- dynamic-array functions

These should be added only after the scalar engine is stable.

### Implementation Sequence
1. Create engine error types:
   `ParseError`, `ReferenceError`, `FunctionError`, `EvaluationError`, and an adapter that converts internal errors into UI-safe messages.
2. Create the tokenizer:
   support identifiers, numbers, strings, commas, parentheses, operators, colons, and comparison operators needed for later conditional functions.
3. Create the parser:
   produce a simple AST with node types for literals, binary expressions, function calls, references, and ranges.
4. Create reference helpers:
   normalize cell addresses, read challenge grid values, and expand ranges into ordered cell value lists.
5. Create the evaluator:
   walk the AST, evaluate nested expressions, and dispatch functions through a registry.
6. Create the initial function registry:
   implement launch-scope scalar and aggregate functions first.
7. Add conditional and lookup functions only after tests pass for the scalar subset.

### Module Boundaries
- `src/lib/formula-engine/tokenize.js`
- `src/lib/formula-engine/parse.js`
- `src/lib/formula-engine/evaluate.js`
- `src/lib/formula-engine/functions.js`
- `src/lib/formula-engine/references.js`
- `src/lib/formula-engine/errors.js`
- `src/lib/formula-engine/index.js`

### Acceptance Criteria
- Every beginner challenge formula can be parsed.
- Every beginner challenge expected result can be evaluated correctly.
- Invalid formulas return typed errors instead of crashing.
- Nested formulas such as `ROUND(AVERAGE(...),1)` work.
- Unit tests cover both valid and invalid inputs.

### Risks
- overengineering for parity before challenge coverage is proven
- mixing challenge validation rules into engine behavior
- implementing array functions before the UI can consume them

### Suggested Commit Slices
1. engine scaffolding and error types
2. tokenizer and parser
3. reference resolution and scalar evaluator
4. launch-function registry
5. conditional and lookup expansion
6. engine test coverage and integration helpers

## Milestone 3: Spreadsheet Sandbox

### Goal
Build the interactive worksheet surface for formula challenges without recreating full spreadsheet behavior.

### Design Principles
- The grid serves guided learning, not open-ended sheet editing.
- Only target cells are editable in v1.
- Formula input is controlled from one active editing model.
- Displayed values and stored formulas must stay separate.

### Deliverables
- rendered 8x12 grid
- row and column headers
- active-cell selection state
- formula bar wired to active cell
- visible locked vs editable cells
- result display in target cells
- reset-to-challenge-state action

### Required Behaviors
- clicking a target cell makes it active
- formula bar reflects the selected cell reference and current input
- editing the formula bar updates the selected target cell draft
- prefilled cells remain read-only
- computed output is shown after evaluation

### Explicit Non-Goals
- arbitrary worksheet navigation beyond the challenge footprint
- drag fill
- clipboard behavior
- multi-cell selection
- formula editing directly in every cell

### Implementation Sequence
1. Build grid normalization helpers from challenge data.
2. Build active-cell state and selection helpers.
3. Build formula draft state per active target cell.
4. Render headers and cells with semantic state classes.
5. Wire formula bar edits into draft state.
6. Render evaluated results separately from raw formula input.
7. Add challenge reset.

### Module Boundaries
- `src/features/formulas/lib/grid-model.js`
- `src/features/formulas/lib/grid-actions.js`
- `src/features/formulas/lib/grid-selectors.js`
- `src/features/formulas/components/spreadsheet-grid.jsx`
- `src/features/formulas/components/formula-bar.jsx`

### Acceptance Criteria
- User can open a challenge and edit the intended answer cell.
- Active-cell styling is obvious and stable.
- Formula bar and selected cell stay in sync.
- Reset restores original challenge data and clears drafts.

### Risks
- leaking evaluator details into UI components
- overbuilding unsupported cell interactions
- failing to separate formula text from displayed value

### Suggested Commit Slices
1. grid state helpers
2. grid rendering component
3. formula bar integration
4. computed cell display and reset flow

## Milestone 4: Validation, Hints, Review, And Completion Flow

### Goal
Turn a working sandbox into a real learning interaction with meaningful correctness, hinting, and completion states.

### Design Principles
- Validation should teach, not merely reject.
- Hints must reduce brute-force guessing.
- Review cards should reinforce method, not duplicate the challenge prompt.
- Completion state should be derived cleanly from attempt state and evaluation result.

### Deliverables
- validation helpers per challenge mode
- attempt counting
- progressive hints
- feedback panel states
- completion transition logic
- review card content rendering

### Validation Strategy
- `formula_result`:
  compare evaluated output to expected result
- `formula_shape`:
  compare against pattern or required function family
- optional hybrid mode later:
  require both correct result and allowed method

### Hint Rules
- hint 1: nudge
- hint 2: method clue
- hint 3: near-solution approach
- each hint lowers max stars by one step
- hints shown should persist during the active challenge session

### Feedback States
- no answer entered
- parse error
- unsupported function
- invalid reference
- valid formula, wrong result
- correct answer

### Implementation Sequence
1. Build validation helpers decoupled from UI.
2. Add attempt-count rules.
3. Add hint state and reveal progression.
4. Build feedback-panel component.
5. Build review-card component.
6. Add completion state transition and next-action CTA.

### Module Boundaries
- `src/features/formulas/lib/validate-challenge.js`
- `src/features/formulas/lib/attempt-state.js`
- `src/features/formulas/components/feedback-panel.jsx`
- `src/features/formulas/components/review-card.jsx`
- `src/features/formulas/components/challenge-brief.jsx`

### Acceptance Criteria
- Wrong formulas produce specific feedback states.
- Hint usage changes star outcome.
- Completing a challenge reveals the review state.
- The user can retry after failure without page refresh.

### Risks
- validation becoming too permissive
- hint state becoming entangled with persistence too early
- review content not matching supported engine behavior

### Suggested Commit Slices
1. validation helpers
2. hint state and star impact
3. feedback panel
4. review and completion flow

## Milestone 5: Progression, Persistence, And Navigation

### Goal
Connect individual challenges into a real product loop with saved progress.

### Design Principles
- Derived state should stay derived where possible.
- Persistence should be isolated behind adapters.
- Navigation can be local view state until routing needs justify more.
- Unimplemented tracks should be clearly labeled rather than half-functional.

### Deliverables
- home dashboard
- formulas track view
- challenge view routing/state flow
- recommended next challenge logic
- persisted profile store
- progress summaries
- unlock-state wiring

### Persistence Plan
- define a repository-local storage adapter contract first
- actual `window.storage` integration stays behind one module
- store only durable user state:
  - completed challenge ids
  - star ratings
  - xp total if not derived
  - last opened view context
  - streak metadata if adopted in v1

### Navigation Plan
- app-level local state can control:
  - current screen
  - active track id
  - active challenge id
- keep the state machine simple:
  - `dashboard`
  - `track`
  - `challenge`

### Implementation Sequence
1. Build app-shell view-state model.
2. Build formulas-track page from existing metadata.
3. Build challenge launch from track view.
4. Build dashboard summaries.
5. Build persistence adapter interface.
6. Wire persisted state hydration and save-on-change behavior.
7. Add recommended next challenge calculation.

### Module Boundaries
- `src/app/app-shell.js`
- `src/app/routes.js`
- `src/lib/storage/storage-adapter.js`
- `src/lib/storage/profile-store.js`
- `src/lib/storage/schema-version.js`
- `src/components/shared/progress-bar.jsx`
- `src/components/shared/card.jsx`

### Acceptance Criteria
- User can move between dashboard, track view, and challenge view.
- Challenge completion updates visible progress.
- Unlock states match stored completion history.
- Reloading restores meaningful progress state.

### Risks
- locking in a weak persistence schema too early
- storing derived data redundantly
- navigation complexity growing before the formulas track is finished

### Suggested Commit Slices
1. app shell and view-state transitions
2. track view rendering
3. dashboard summaries
4. storage adapter interface
5. persistence wiring and recommended-next logic

## Milestone 6: V1 Curriculum Completion And Polish

### Goal
Raise the formulas track from technically functional to release-quality.

### Design Principles
- polish follows working flows, not the other way around
- content quality matters as much as implementation quality
- the app should feel intentional, not template-like

### Deliverables
- final formulas challenge pass
- difficulty progression QA
- copy and hint-quality pass
- responsive design pass
- visual refinement pass
- browser-level regression tests
- documentation sync

### Content QA Checklist
- each challenge has one clear learning objective
- scenario text sounds workplace-real, not generic
- hints do not give away the answer too early
- review copy matches actual supported solutions
- tier ordering feels progressive

### UI Polish Checklist
- dashboard hierarchy is clear on desktop and mobile
- challenge view gives the grid enough room
- active cell and editable cells are visually distinct
- feedback and review states are readable and calm
- track accent color is visible but restrained

### Regression Coverage Targets
- start app
- open formulas track
- open unlocked challenge
- enter wrong formula
- reveal hint
- enter correct formula
- see completion and updated progress
- reload and confirm persisted state

### Acceptance Criteria
- formulas track feels complete at the v1 scope
- protected flows are tested
- docs reflect implemented behavior accurately

### Risks
- polishing static surfaces before the core loop is solid
- allowing unsupported advanced functions to remain in active content
- docs drifting from actual shipped behavior

### Suggested Commit Slices
1. content expansion and final challenge pass
2. responsive and visual polish
3. browser regression setup
4. documentation sync and release prep

## Milestone 7: Secondary Tracks

### Goal
Plan and implement additional tracks only after the formulas track is stable.

## Track Order
1. Keyboard Shortcuts
2. Data Analysis
3. Charts & Visualization

## Milestone 7A: Keyboard Shortcuts

### Why First
- lowest technical dependency
- no formula engine coupling
- easy to validate and ship in slices

### Deliverables
- shortcut challenge data model
- normalization helper for equivalent answer strings
- timer and streak logic
- shortcut drill UI
- scoring and persistence integration

### Suggested Modules
- `src/features/shortcuts/data/shortcuts.js`
- `src/features/shortcuts/lib/normalize-shortcut.js`
- `src/features/shortcuts/lib/score-shortcut-run.js`
- `src/features/shortcuts/components/shortcut-drill.jsx`

## Milestone 7B: Data Analysis

### Why Second
- can reuse dashboard and progression systems
- needs clearer interaction design than shortcuts

### Deliverables
- challenge schema for analysis prompts
- one stable interaction mode first:
  multiple-choice reasoning
- optional second mode later:
  grid-supported analysis

### Constraint
- do not mix trivia with analysis. Every challenge should map to a real spreadsheet judgment or business reporting choice.

### Suggested Modules
- `src/features/analysis/data/challenges.js`
- `src/features/analysis/lib/validate-analysis.js`
- `src/features/analysis/components/analysis-question.jsx`

## Milestone 7C: Charts & Visualization

### Why Last
- depends on stable content standards
- easier to overdesign visually without strengthening learning value

### Deliverables
- chart reasoning challenge schema
- choose-the-best-chart mode
- critique-the-chart mode
- chart prompt visuals that support reasoning

### Constraint
- chart rendering quality matters less than challenge clarity and explanation quality

### Suggested Modules
- `src/features/charts/data/challenges.js`
- `src/features/charts/lib/validate-chart-choice.js`
- `src/features/charts/components/chart-question.jsx`

## Cross-Milestone Test Strategy

### Unit Tests
- formula engine parsing and evaluation
- range and reference handling
- validation modes
- progression helpers
- storage adapter behavior
- feature-specific normalization logic for later tracks

### Browser Tests
- formulas protected flow is mandatory before secondary tracks
- later tracks can add one protected flow each after launch

## Cross-Milestone Commit Strategy
- Keep milestones split by behavior, not by folder.
- Prefer one user-visible or logic-complete slice per commit.
- Push after each accepted checkpoint.

Recommended next sequence after Milestone 1:
1. engine core scaffold
2. engine launch functions
3. sandbox grid
4. formula bar and editing model
5. validation and hint flow
6. app shell and formulas track navigation
7. persistence adapter
8. formulas v1 polish

## Exit Definition For V1
V1 is done when:
- formulas track has a complete, coherent challenge journey
- users can open, solve, retry, hint, complete, and revisit challenges
- progress survives reload
- the app looks intentional on desktop and mobile
- tests cover the protected formulas flow
- docs describe actual shipped behavior
