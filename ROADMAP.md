# Roadmap

Last updated: 2026-04-21

## Now
1. Define the v1 product contract for Excel Mastery:
   confirm the learning loop, track structure, persistence model, challenge schema, and success criteria before implementation.
2. Build the spreadsheet sandbox foundation:
   8x12 grid, active cell state, formula bar, protected prefilled cells, editable target cells, and challenge-driven cell highlighting.
3. Implement a scoped formula engine for beginner-first scenarios:
   arithmetic, cell references, ranges, and an initial function set such as `SUM`, `AVERAGE`, `COUNT`, `MIN`, `MAX`, `IF`, `SUMIF`, `COUNTIF`, `LEN`, `LEFT`, `RIGHT`, `TRIM`, `UPPER`, `LOWER`, and basic date support if required by launch challenges.
4. Ship one complete end-to-end learning track first:
   prioritize `Formulas & Functions` with a representative challenge set, hints, validation feedback, review cards, XP, stars, unlock logic, and persisted progress through the app storage adapter.

## Next
1. Expand the formula engine to intermediate and advanced coverage:
   add nested evaluation, lookup functions, array-aware modern Excel functions where feasible, and clear unsupported-function behavior.
2. Add the remaining tracks with track-specific interaction models:
   `Keyboard Shortcuts` timed drills, `Data Analysis` mixed sandbox and reasoning challenges, and `Charts & Visualization` selection and critique challenges.
3. Improve curriculum depth and polish:
   richer fictional workplace scenarios, recommended-next logic, streak systems, lesson review quality, theming refinement, and broader challenge coverage across departments.
4. Expand persisted progression:
   save more than completion state, clarify the long-term XP and unlock model, and decide whether future runtimes should prefer `window.storage`, IndexedDB, or a shared abstraction across both.

## Immediate Next Session
1. Upgrade recommendation logic:
   stop using a simple first-unsolved rule and instead rank challenges using persisted completion data, current tier readiness, and likely next best lesson value.
2. Tighten unlock behavior in the UI:
   make persisted completion clearly drive tier progression and explain unlock thresholds more explicitly on the track screen.
3. Decide on draft persistence:
   either persist in-progress formula drafts and partially revealed hints for the active challenge, or explicitly document that unsolved work is intentionally transient.

## Deferred
- Full parity with modern Excel behavior, including every edge case, volatility rule, spill behavior, and exact error semantics.
- Large-scale content expansion to 30-40+ challenges until the core sandbox, challenge schema, and persistence model prove stable.
- Advanced analytics surfaces such as pivot-table builders, chart rendering engines, leaderboards, or social/classroom features.

## Not Planned
- Depending on external APIs or cloud backends for the core learning loop in v1.
- Building the entire app as a single oversized component if that harms maintainability; the prompt can be honored conceptually while implementation should still use extracted helpers and data modules.
- Recreating Excel in full; the goal is guided skill-building through realistic scenarios, not a general spreadsheet product.

## Decision Notes
- The right v1 is a tight vertical slice: one polished sandbox-based track proves the core product faster than spreading effort across four partially finished modes.
- The formula engine is the highest-risk technical dependency. Challenge content, validation rules, and progression should be designed around what the engine can reliably support.
- The prompt should be tightened before build:
  define whether "single React component" is a delivery constraint or just a demo preference, replace `window.storage` with the exact runtime contract if one exists, and explicitly name the initial v1 function list and challenge count.
- Avoid overcommitting to all ~65 functions, all four tracks, and full premium UI polish in the first pass. That combination is likely to produce a shallow prototype rather than a durable foundation.
