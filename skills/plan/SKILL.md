---
name: plan
description: Second stage of the Ambrosia v2 Core Lifecycle. Decomposes the analyzed objective into a minimal, file-mapped implementation strategy. Applies aggressive YAGNI, detects phase splits, and produces a structured plan file in .ambrosia/plans/. Trigger after Analyze completes or when "plan" is invoked.
---

# Plan

`Plan` is the second stage of the Ambrosia v2 Core Lifecycle. Its job is to answer one question:

> **"What is the smallest coherent implementation strategy that achieves the defined success criteria?"**

`Plan` transforms the `Analyze` brief into a concrete, ordered set of tasks for `Implement`. It locks file boundaries, enforces YAGNI constraints, and structures dependencies. It never writes code or modifies project source files.

---

## Operational Workflow

Execute `Plan` through five sequential steps:

### 1. Ingest Brief & Preserve Success Criteria
- Read the `Analyze` brief, stated defaults, and complexity tier.
- Carry forward the exact **Definition of Success** established by `Analyze` — this is the non-negotiable target that downstream stages (`Verify`, `Finish`) will validate.

### 2. Lock File Boundaries & Apply Upfront YAGNI
- Map the exact files that must be created, modified, or tested.
- Lock file structure before writing task steps.
- Apply YAGNI aggressively: remove unrequested abstractions, extra helpers, or speculative features.
- If a simplification is deliberately made to keep the plan lean, tag it inline as a YAGNI constraint: `// ponytail: <what was simplified> | ceiling: <limit> | upgrade: <trigger>`.

### 3. Decompose into Minimal Coherent Tasks
- Break the work into small, focused tasks with clear file responsibilities and implementation order.
- Specify exact interfaces for each task (what it consumes from prior tasks, what it produces for later tasks).
- Structure tasks so worker context switching is minimized (group changes by logical responsibility, not arbitrary layers).
- Define TDD verification steps for each task (failing test -> minimal implementation -> pass assertion).

### 4. Detect Phase Splits (> 10 Tasks Limit)
- Count total tasks required.
- **Hard Limit:** If decomposition requires > 10 tasks, stop immediately. Split into **Phase 1** and **Phase 2**.
- Plan only **Phase 1** to maintain context hygiene. State: *"Plan split into phases. Phase 1 covers [X]. Phase 2 will cover [Y]."*

### 5. Validate & Save Plan
- Perform self-review: Confirm every requirement maps to a task, signatures align across tasks, and zero placeholders (`TBD`, `TODO`, `similar to Task N`) exist.
- Save plan file to `.ambrosia/plans/<YYYY-MM-DD>-<slug>.md`.

---

## Standing Rules & Invariants

1. **Orchestrator Executed:** Runs in the main orchestrator context. Never edits project source files.
2. **Zero Placeholders:** Every task must contain exact file paths, interfaces, and step assertions. "TBD" or "implement later" are plan failures.
3. **Turn-Based Approval Gate:**
   - Plans with ≤ 5 tasks: Post plan summary, state `"Proceeding — say 'stop' to cancel"`, end turn.
   - Plans with > 5 tasks: Post plan summary, state `"Review plan. Reply 'go' to build"`, wait for user approval.
4. **Log State:** Log stage completion in `.ambrosia/logs/ambrosia.log.md`.

---

## Output Contract & Handoff

Produce a clear, structured summary covering:

1. **Plan Metadata:** Goal, branch, test command, build command.
2. **Task Overview:** Task count, dependency order, files touched, and YAGNI constraints.
3. **Definition of Success:** Carried directly from `Analyze`.
4. **Saved Plan Location:** `.ambrosia/plans/<YYYY-MM-DD>-<slug>.md`.

End with:
> **Next Stage:** `Implement` — dispatch worker subagents to execute tasks via TDD loops.
