---
name: plan
description: Decompose an audited task into a concrete, file-mapped, parallel-safety-tagged implementation plan. Runs research in a fresh subagent. Writes plan to .ambrosia/plans/. Use after audit, or directly when prompt is already complete. Trigger on "plan this", "create a plan", "break this down", or after audit completes.
---

# Plan

Decompose the task into a concrete implementation plan. Research happens in a fresh subagent. The result is a file-mapped, parallel-safety-tagged plan that `build` can execute without ambiguity.

**Announce:** "Using the plan skill to create the implementation plan."

---

## Pre-flight

**1. Prerequisite check.** Read `ambrosia.log.md`. If no `[audit]` entry exists for this task AND `--force` was not passed:
```
No audit found for this task. Run `audit` first to gap-check the prompt, or pass --force to plan directly.
```

**2. Auto-init check.** If `.ambrosia/` does not exist, create it now:
  ```bash
  mkdir -p .ambrosia/{plans,specs} && touch .ambrosia/ambrosia.log.md
  ```
  Then continue.

**3. Read AGENTS.md.** If `AGENTS.md` exists, read it fully. Project constraints override Ambrosia defaults.

**4. Scope check.** If the task clearly covers multiple independent subsystems (e.g., "build a platform with auth, payments, and analytics"), flag this immediately:
```
This task covers multiple independent subsystems. Decompose into sub-projects first?
I'll plan the first one. Suggest: [list subsystems in build order].
```

---

## Step 1 — Research (Inline or Subagent)

**Inline Research (Fast-Path):**
If the task touches ≤ 3 files and the relevant code context is already loaded in the session, perform research **directly inline** in the coordinator context. Skip spawning a subagent.

**Subagent Research (Broad/Complex):**
If the task touches > 3 files or requires deep exploration of unread directories, dispatch one research subagent with a clean context window. Have it write findings to `.ambrosia/specs/<YYYY-MM-DD>-<slug>-research.md`.

Never have research modify source files.

---

## Step 1b — Architecture sketch

Before decomposing into files and tasks, write a 3-5 sentence prose sketch of the intended architecture — major components, how they connect, the load-bearing design decision. Post this as a visible ping.

- Task scored ≥ 6 in audit → continue immediately after posting
- Task scored < 6 in audit → make this a gate: wait for the user to confirm the shape before proceeding to Step 2

---

## Step 2 — File structure

Before defining tasks, map which files will be created or modified and what each is responsible for:

- Each file: one clear responsibility
- Files that change together live together — split by responsibility, not layer
- In existing codebases: follow established patterns; if a file is oversized, splitting it is reasonable if you're modifying it anyway

This structure informs task decomposition. Lock it before writing tasks.

**Hard limit:** if decomposition requires more than 10 tasks, stop. Split into Phase 1 / Phase 2. Plan only Phase 1. Ask: "This is large enough to split into phases. Phase 1 will cover [X]. Continue?"

---

## Step 3 — Write the plan

Save to `.ambrosia/plans/<YYYY-MM-DD>-<slug>.md`.

**Required header:**

```markdown
# <Feature Name> — Implementation Plan

> **Ambrosia:** Use `build` to execute this plan task-by-task.

**Goal:** [One sentence]
**Branch:** ambrosia/<slug>
**Test command:** [from AGENTS.md or detected]
**Build command:** [from AGENTS.md or detected]

## Global Constraints
[Project-wide requirements from AGENTS.md — exact values, one line each]

---
```

**Task format:**

```markdown
### Task N: <Component Name>
**Parallel-safety:** [parallel-safe | sequential: depends on Task N]
**Files:**
- Create: `exact/path/to/file`
- Modify: `exact/path/to/existing:L123-145`
- Test: `tests/exact/path/to/test`

**Interfaces:**
- Consumes: [exact signatures from prior tasks]
- Produces: [exact function names, types, parameters — what later tasks rely on]

- [ ] Step 1: Write the failing test
  ```<lang>
  // exact test code
  ```
- [ ] Step 2: Run it — expect FAIL with "<specific error>"
- [ ] Step 3: Write minimal implementation
  ```<lang>
  // exact implementation
  ```
- [ ] Step 4: Run — expect PASS
- [ ] Step 5: Commit: `ambrosia(task-N): <description>`
```

**No placeholders.** Every step contains the actual content. "TBD", "implement later", "add validation" are plan failures.

---

## Step 4 — Plan self-review

After writing the complete plan:
1. **Coverage:** can every requirement be traced to a task?
2. **Placeholder scan:** any TBD, TODO, "similar to Task N"?
3. **Type consistency:** do signatures defined in early tasks match how later tasks use them?
4. **Parallel-safety correctness:** do all `parallel-safe` tasks truly have disjoint file sets?

Fix issues inline. No need to re-review.

---

## Step 5 — Approval

**For all plans:** Post the full plan summary as a visible ping before proceeding:

```
Plan summary:
  Tasks: <N> (<M> parallel-safe, <K> sequential)
  Files touched: <list>
  Estimated subagent calls: ~<N + parallel-safe batches>
  Branch: ambrosia/<slug>

Assumed defaults (from audit):
  - <default carried from audit step>
  (none — all constraints were explicit)
```

**For plans with ≤ 5 tasks:** After posting the summary, say "Proceeding — say 'stop' to cancel." Then **end the response**. Do not continue in the same reply. Wait for the next user message before invoking `build`.

**For plans with > 5 tasks:** After posting the summary, say "Review this plan. Type `go` to build, or give feedback." Wait for explicit approval before proceeding.

---

## Completion

Append to `ambrosia.log.md`:
```
<timestamp> [plan] complete — <N> tasks, <M> parallel-safe — .ambrosia/plans/<filename>
```
