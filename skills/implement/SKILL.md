---
name: implement
description: Third stage of the Ambrosia v2 Core Lifecycle. Executes the approved Plan task-by-task via dispatched worker subagents using strict TDD loops and ponytail YAGNI tags. Trigger after Plan is approved or when "implement" is invoked.
---

# Implement

`Implement` is the execution engine of Ambrosia. Its job is to answer one question:

> **"How do we execute the approved plan with the smallest amount of code, the highest confidence, and without violating the plan?"**

`Implement` transforms an approved `Plan` into working software. The orchestrator coordinates, tracks progress, and maintains context hygiene, while dispatched worker subagents perform all code edits. The orchestrator never modifies project source files directly.

---

## Operational Workflow

Execute `Implement` through five sequential steps:

### 1. Ingest Plan & Lock Scope
- Read the active plan file from `.ambrosia/plans/`.
- Lock execution strictly to the task sequence, file boundaries, and interfaces defined in the plan.
- If the host environment indicates a locked LLM model session, announce session-lock visibility once before launching tasks.

### 2. Dispatch Worker Subagents
- Dispatch isolated worker subagents (`dispatch_worker`) for each planned task.
- Provide the worker with clean context: task objectives, locked file paths, consumes/produces interface contracts, and TDD requirements.

### 3. Enforce TDD & Adaptive Verification Protocol
Workers execute each task using an adaptive verification loop:
- **Test Suite Protocol:** If an automated test suite exists, enforce strict RED (failing test) -> GREEN (pass test with minimal code) -> REFACTOR loops.
- **No-Test/Non-Code Fallback:** If no test suite exists or for non-code tasks (CSS, HTML, docs, config), fall back to empirical build assertions, linters, exit codes, or terminal execution logs.
- **REFACTOR Phase:** Clean implementation while keeping pass criteria green. Tag intentional simplifications inline using: `<comment_prefix> ponytail: <what was simplified> | ceiling: <limit> | upgrade: <trigger>` (e.g. `#` Python/Bash/YAML, `--` SQL, `//` JS/TS/Go/Rust, `<!-- -->` HTML).

### 4. Process Worker Reports & Handle Blockers
- Validate worker output upon task completion.
- **Empty Report Hard Gate:** An empty or zero-byte report from a worker MUST be treated as an immediate `BLOCKED` failure status.
- If a worker encounters missing requirements, contradictory plans, or failing assumptions, **stop execution immediately**. Surface the blocker to the orchestrator rather than inventing unapproved solutions or expanding scope.

### 5. Report Task Progress
- After each task, post a visible task completion ping to the orchestrator log.
- Track completed tasks against the plan checklist. Proceed to the next task until all tasks in the plan phase are finished.

---

## Standing Rules & Invariants

1. **Strict Worker Dispatch:** The orchestrator NEVER edits project source files. Every source file edit MUST be performed by a dispatched worker subagent.
2. **Zero Scope Creep:** Execute only the approved plan. Do not alter architecture, add speculative helpers, or refactor unmentioned files.
3. **Ponytail YAGNI Tags:** Tag all deliberate shortcuts inline using language-native comment prefixes (`<comment_prefix> ponytail:`).
4. **BLOCKED Escalation:** Never silently improvise around broken dependencies or unexpected errors. Stop, report, and escalate to the orchestrator.
5. **Log State:** Append task progress and stage completion to `.ambrosia/logs/ambrosia.log.md`.

---

## Output Contract & Handoff

Produce a clear, scannable summary covering:

1. **Tasks Completed:** List of executed tasks and modified files.
2. **Implementation Evidence:** Test pass reports, build logs, or worker completion statuses.
3. **Surfaced Ponytail Tags:** Summary of any inline YAGNI tags created during execution.
4. **Target Success Criteria:** Re-affirm the target criteria carried from `Analyze`/`Plan`.

End with:
> **Next Stage:** `Verify` — perform empirical evidence verification and line-level requirement tracing.
