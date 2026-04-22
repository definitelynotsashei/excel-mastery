# Excel Mastery V1 Product Spec

Last updated: 2026-04-21

## Product Positioning
Excel Mastery is a scenario-based Excel training app that teaches practical spreadsheet skills through hands-on challenges in a simulated spreadsheet sandbox. The intended feel is premium, professional, and workplace-oriented rather than academic or game-like for children.

The product promise is:
- users practice realistic Excel tasks instead of only reading explanations
- progression is structured, rewarding, and persistent
- challenges map to common office workflows across departments

## V1 Goal
Ship a polished vertical slice that proves the core learning loop:
1. choose a track
2. open a challenge
3. read a workplace scenario
4. solve the task inside the app
5. get validation, hints, XP, stars, and a short lesson review
6. save progress and continue later

## V1 Scope
V1 should prioritize one complete track first:
- `Formulas & Functions`

V1 may include lightweight placeholder shells for the other tracks if needed for navigation, but they should not dilute the core build effort.

### V1 Challenge Count
Start with:
- 8-12 beginner formula challenges
- 6-8 intermediate formula challenges
- 4-6 advanced formula challenges

This is enough to validate progression, persistence, and content structure without overbuilding curriculum too early.

## Non-Goals For V1
- Full Excel compatibility across all edge cases
- Full implementation of all 4 tracks at production depth
- True spreadsheet authoring beyond guided learning scenarios
- Multi-user accounts, backend syncing, leaderboards, or social features
- Pixel-perfect parity with Excel UI

## Primary UX Principles
- The spreadsheet sandbox is the centerpiece, not a side widget.
- Each challenge should feel like a workplace request with a clear practical outcome.
- Feedback should teach, not only mark correct or incorrect.
- Progression should feel motivating without becoming noisy or childish.
- The visual system should feel deliberate and premium: dark theme, restrained glow, strong typography, distinct accent colors per track.

## Core Information Architecture

### 1. Home Dashboard
Purpose:
- orient the user
- show progress
- recommend the next useful action

Contents:
- app header and branding
- overall XP and current level
- streak summary
- recommended next challenge card
- four track cards with progress summaries

V1 requirement:
- the dashboard must work fully for the formulas track
- other track cards can show `coming soon` or `planned` if not yet implemented

### 2. Track View
Purpose:
- show a track's tier structure and available challenges

Contents:
- track overview
- tier sections: Beginner, Intermediate, Advanced
- locked and unlocked states
- per-challenge status, stars, and completion state

### 3. Challenge View
Purpose:
- deliver the actual learning interaction

Contents:
- top bar with title, progress, and hint access
- collapsible scenario briefing
- track-specific interaction area
- feedback panel
- completion review card

## Feature Plans

### Feature: Challenge Content Model
Purpose:
- define each challenge declaratively so the UI and validation logic stay consistent

V1 data required per challenge:
- `id`
- `track`
- `tier`
- `title`
- `scenario`
- `department`
- `accentColor`
- `learningObjective`
- `grid`
- `targetCells`
- `expectedAnswer`
- `validationMode`
- `hints`
- `review`
- `xp`
- `unlockRequirements`

Suggested challenge shape:
```js
{
  id: "formulas-beginner-sum-west-q1",
  track: "formulas",
  tier: "beginner",
  title: "Q1 West Revenue Total",
  department: "Sales/CRM",
  scenario: "Slack-style manager brief...",
  learningObjective: "Use SUM across a contiguous range.",
  grid: {
    columns: ["A","B","C","D","E","F","G","H"],
    rows: 12,
    cells: {
      A1: { value: "Region", editable: false },
      B1: { value: "Revenue", editable: false },
      A2: { value: "West", editable: false }
    }
  },
  targetCells: ["D8"],
  validationMode: "formula_result",
  expectedAnswer: {
    D8: {
      formulaPattern: "=SUM(B2:B5)",
      result: 42000
    }
  },
  hints: [
    "Think about the function used to total a range.",
    "You need a single function over the revenue cells.",
    "Use SUM with the revenue range."
  ],
  review: {
    concept: "SUM adds all numeric values in a range.",
    optimalSolution: "=SUM(B2:B5)",
    alternativeApproach: "=B2+B3+B4+B5"
  },
  xp: 25
}
```

Decision:
- keep challenge data separate from UI code even if the app renders from one root component

### Feature: Spreadsheet Sandbox
Purpose:
- create the hands-on practice surface for formula-based learning

V1 requirements:
- 8 columns by 12 rows
- visible column headers and row numbers
- selected cell state
- formula bar reflecting active cell
- prefilled locked cells
- editable target cells
- computed display values after formula entry
- clear target highlighting

Behavior rules:
- users may only edit designated answer cells in v1
- prefilled data cells must remain protected
- target cells should show formula input and evaluated result
- challenge reset should restore original challenge state

Out of scope for v1:
- drag fill
- multi-cell selection
- copy and paste behaviors
- column resizing
- arbitrary worksheet editing

### Feature: Formula Engine
Purpose:
- parse and evaluate user-entered formulas against challenge data

V1 strategy:
- do not start with all listed functions
- start with a challenge-driven subset

Recommended launch function set:
- arithmetic operators: `+`, `-`, `*`, `/`
- references and ranges
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
- `IF`
- `AND`
- `OR`
- `SUMIF`
- `COUNTIF`
- `ROUND`
- `ABS`

Phase 2 function set:
- `SUMIFS`
- `COUNTIFS`
- `AVERAGEIF`
- `VLOOKUP`
- `IFERROR`
- `TEXT`
- `VALUE`
- `DATE`
- `YEAR`
- `MONTH`
- `DAY`
- `TODAY`
- `ROUNDUP`
- `ROUNDDOWN`

Phase 3 function set:
- `INDEX`
- `MATCH`
- `XLOOKUP`
- `IFS`
- `SWITCH`
- `LARGE`
- `SMALL`
- `RANK`
- `UNIQUE`
- `SORT`
- `FILTER`
- `TEXTJOIN`
- `SUBSTITUTE`
- `FIND`
- `SEARCH`
- `SUMPRODUCT`

Engine requirements:
- support nested function calls
- resolve cell references and simple ranges
- distinguish parse errors from wrong answers
- return deterministic results for validation
- show user-friendly error feedback

Important constraint:
- exact Excel parity is not required in v1
- behavior only needs to be consistent, documented, and sufficient for supported challenges

### Feature: Validation And Feedback
Purpose:
- determine whether the user solved the challenge and explain what happened

V1 validation modes:
- `formula_result`: answer is correct if the computed result matches
- `formula_shape`: answer is correct only if the intended function or pattern is used
- `choice`: multiple-choice correctness for non-sandbox tracks
- `text_match`: shortcut input correctness

Feedback states:
- empty answer
- parse error
- valid formula but wrong result
- correct answer
- completed with hint penalty

Design rule:
- feedback should explain why an answer is wrong when possible, not only reject it

### Feature: Hint System
Purpose:
- support learning without turning the challenge into trial-and-error guessing

V1 requirements:
- three hints per challenge
- reveal one hint at a time
- each revealed hint lowers max star rating by one step
- hint usage persists per challenge completion state

Hint progression:
- hint 1: directional
- hint 2: method-specific
- hint 3: near-solution approach

Decision:
- the final hint should reveal the method but avoid pasting the exact final formula unless a future `show answer` feature is added

### Feature: Progression And Unlocks
Purpose:
- create pacing across tiers and tracks

V1 requirements:
- XP per completed challenge
- 1 to 3 stars based on attempts and hint usage
- tier unlock gates
- overall progress persistence

Recommended unlock rules:
- Intermediate unlocks after completing 70 percent of Beginner challenges in that track
- Advanced unlocks after completing 70 percent of Intermediate challenges in that track

Recommended star rules:
- 3 stars: first attempt, no hints
- 2 stars: completed with either one failed attempt or one hint tier used
- 1 star: completed with heavier help or repeated attempts

### Feature: Persistence
Purpose:
- save user progress, challenge outcomes, and preferences across sessions

V1 persisted data:
- completed challenge ids
- stars earned
- XP total
- current streak metadata
- last opened track and challenge
- unlock state if derived values are not recalculated

Constraint:
- use `window.storage`

Open question to resolve before implementation:
- define the exact `window.storage` API contract:
  `get`, `set`, `list`, and `delete` signatures, async behavior, failure behavior, and namespace strategy

Design rule:
- persistence schema should be versioned from the start

### Feature: Formulas & Functions Track
Purpose:
- prove the core product with spreadsheet-based problem solving

V1 plan:
- this is the launch-quality track
- all dashboard, progression, hint, and review flows must work here

Tier focus:
- Beginner:
  totals, averages, counts, min/max, text cleanup, basic extraction
- Intermediate:
  conditions, simple logic, conditional totals, basic lookups
- Advanced:
  nested logic, lookup reasoning, dynamic-analysis style tasks based on supported engine depth

Scenario themes:
- Sales pipeline totals
- Expense rollups
- Headcount summaries
- Inventory thresholds
- Campaign performance summaries

### Feature: Data Analysis Track
Purpose:
- teach business reasoning around sorting, filtering, summary logic, and data interpretation

V1 plan:
- plan the content model now
- implementation can wait until the formulas track is stable

Challenge types:
- identify correct filter or sort action
- choose the right summary approach
- spot data quality issues
- reason about pivot table setup

Interaction models:
- multiple choice
- grid-based analysis with guided answers

Risk:
- without a dedicated interaction model, this track can become vague trivia rather than skill-building

### Feature: Keyboard Shortcuts Track
Purpose:
- build speed and fluency for common Excel actions

V1 plan:
- can be the second implemented track because it has lower technical risk than charts or advanced analysis

Core loop:
- timed prompt
- user enters or selects shortcut
- immediate correctness check
- streak and speed scoring

V1 content categories:
- Navigation
- Selection
- Editing
- Formatting

Constraints:
- decide whether answers must exactly match one canonical Windows shortcut string or allow aliases such as `Ctrl+Space` vs `CTRL + SPACE`

### Feature: Charts & Visualization Track
Purpose:
- teach chart choice and chart critique in business reporting contexts

V1 plan:
- defer full implementation until after formulas and shortcuts

Challenge types:
- choose the best chart for a business question
- identify what is misleading in a chart
- choose how to improve a bad chart

Design rule:
- prioritize reasoning quality over decorative chart rendering

## Technical Plan

### App Architecture
The original prompt asks for a single React component. For maintainability, the recommended interpretation is:
- one app entry component for rendering
- extracted pure helpers for formula evaluation, challenge data, validation, progression, and persistence adapters
- track-specific render helpers where needed

This preserves the spirit of a self-contained app without forcing all logic into one file.

### State Domains
Recommended state slices:
- navigation state
- active track and active challenge
- spreadsheet interaction state
- challenge attempt state
- hint state
- progression state
- persisted profile state

### Testing Priorities
V1 tests should cover:
- formula parsing and evaluation for supported functions
- challenge validation outcomes
- unlock logic and star calculation
- persistence adapter behavior
- at least one browser-level protected flow:
  open challenge, enter answer, complete challenge, persist completion

## Prompt Revision Recommendations
Before implementation, the build prompt should be tightened to:
- define v1 as a vertical slice, not the full long-term vision
- explicitly list launch functions instead of `all ~65`
- explicitly state whether only the formulas track must be complete in v1
- clarify the `window.storage` runtime
- allow extracted helpers and modules even if the UI originates from one root component

## Open Decisions
- Is `single React component` a hard technical requirement or only a preference for delivery format?
- What exact environment provides `window.storage`?
- Should v1 include placeholder track cards for the non-implemented tracks or hide them until ready?
- Is formula correctness based on output only, or do some challenges require enforcing a specific formula family?
- What level of Excel compatibility matters most: learning realism or formula-engine breadth?
