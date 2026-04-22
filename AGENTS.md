# AGENTS

This file is the working guide for future agent sessions in this project.

## Current Reality
- This project is under active development.
- Treat `PROJECT_STATE.md` as the source of truth for implemented behavior.
- Treat `ROADMAP.md` as the source of truth for priorities.
- Treat `CHANGELOG.md` as the record of notable user-visible changes.
- Treat `CODING_WORKFLOW_PROMPTS.md` as the workflow, safety, and verification guide.

## Project Goal
Excel Mastery is an interactive Excel training app that helps users build real spreadsheet skills through workplace-style scenarios, a simulated spreadsheet sandbox, guided progression, and track-based practice. The product goal is to make users meaningfully better at practical Excel tasks by combining hands-on formula solving, analysis reasoning, shortcut drills, and chart literacy in a premium learning experience.

## Primary Rule
Do not make assumptions that are contradicted by the docs or the code.

## Working Priorities
1. Build the primary user workflow first.
2. Protect persisted data and compatibility.
3. Prefer small, testable changes over broad rewrites.
4. Keep docs aligned with reality.

## Documentation Rules
- Update `PROJECT_STATE.md` when implemented behavior changes.
- Update `ROADMAP.md` when priorities change.
- Update `CHANGELOG.md` for notable user-visible changes.
- If persistence, import/export, schema, or compatibility behavior changes, update all relevant docs in the same pass.

## Engineering Rules
- Inspect the relevant code before changing behavior.
- Prefer extracting pure helpers from mixed UI/orchestration files.
- Add or update regression coverage for meaningful fixes.
- Treat external input as untrusted.
- Do not take destructive actions without confirmation.

## Session Checklist
1. Read `PROJECT_STATE.md`.
2. Read `ROADMAP.md`.
3. Read `CHANGELOG.md`.
4. Read `CODING_WORKFLOW_PROMPTS.md`.
5. Inspect the relevant code before making assumptions.
6. Verify changes before closing the task.

## Session Startup Prompt
Copy and paste this into a new session:

```text
Read AGENTS.md, PROJECT_STATE.md, ROADMAP.md, CHANGELOG.md, and CODING_WORKFLOW_PROMPTS.md before making assumptions. Treat PROJECT_STATE.md as the source of truth for implemented behavior, ROADMAP.md as the source of truth for priorities, AGENTS.md as the workflow guide, and CHANGELOG.md as the record of notable changes. Inspect the relevant code before changing anything.

Work autonomously from one meaningful task to the next without waiting for repeated proceed prompts, but stay within the documented roadmap unless I explicitly broaden scope.

Follow the workflow, safety, verification, and documentation rules in CODING_WORKFLOW_PROMPTS.md.

Only pause if:
- you hit a real blocker
- a product decision is required
- a destructive or risky action needs confirmation
```
