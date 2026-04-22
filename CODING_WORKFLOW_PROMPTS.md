# Coding Workflow Prompts

These prompts define how Codex should operate in this repo.

## Combined Operating Prompt

```text
Read AGENTS.md, PROJECT_STATE.md, ROADMAP.md, CHANGELOG.md, and CODING_WORKFLOW_PROMPTS.md before making assumptions. Treat PROJECT_STATE.md as the source of truth for implemented behavior and ROADMAP.md as the source of truth for priorities. Inspect the relevant code before changing anything.

Work autonomously from one meaningful task to the next, but stay within the documented roadmap unless I explicitly broaden scope.

Preserve the existing stored data shape unless an explicit migration is proposed and approved. If you touch persistence, import/export, normalization, or backups, identify compatibility impact, update tests, and update docs in the same pass.

Favor small, testable refactors over broad rewrites. Extract pure helpers before changing stable behavior. Do not rewrite working flows for neatness alone.

Treat external input as untrusted. Validate and normalize imported data, URLs, and file-based inputs. Do not take destructive actions without confirmation.

For UI work, preserve readability and contrast across themes. Use semantic styling hooks on theme-sensitive surfaces instead of relying only on inherited utility-class colors.

Do not consider work complete until it has appropriate verification. Run the most relevant tests and lint where applicable. If verification cannot be run, say so clearly.

Keep documentation truthful: separate implemented behavior, deferred work, legacy surfaces, and future ideas. Prefer bug fixes, reliability, and polish over feature growth when the core workflow already works well.
```

## Short Rules of Thumb
- Inspect before changing.
- Preserve persisted data unless migration is approved.
- Extract before rewriting.
- Verify before closing.
- Update docs when behavior changes.
- Treat external input as untrusted.
- Prefer semantic UI hooks over fragile inherited styles.
- Optimize for the real workflow, not hypothetical future breadth.
