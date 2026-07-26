---
name: build
description: Execute an Ambrosia plan with strict TDD. Fresh subagent per task, handoff for parallel-safe tasks, git checkpoint after each task, coordinator context compression every 3 tasks. Use after plan is approved. Trigger on "build", "implement", "execute the plan", or after plan completes.
---

# Build

Execute the plan. Fresh subagent per task. Strict TDD. Evidence before completion claims.

**Announce:** "Using the build skill to execute the plan."

**Coordinator invariant — iron rule:**
```
THE COORDINATOR SESSION NEVER EDITS SOURCE FILES DIRECTLY.
All source file changes go through implementer subagents.
```
This is not optional. If the coordinator edits files directly it: (a) pollutes its own context with implementation detail it doesn't need, (b) bypasses the review loop, (c) breaks ledger integrity. If a fix seems "too small" to dispatch — dispatch it anyway.

**Continuous execution:** Do not pause between tasks to check in. Execute all tasks without stopping unless: BLOCKED, genuine ambiguity that prevents progress, or all tasks complete.

---

## Pre-flight

**1. Prerequisite check.** Read `ambrosia.log.md`. If no `[plan]` entry exists AND `--force` was not passed:
```
No plan found. Run `plan` first, or pass --force to build directly with an existing plan file.
```

**2. Locate the plan.** Read the most recent plan from `.ambrosia/plans/`. If multiple plans exist, ask which to use.

**3. Validate the plan file.** Check the plan exists and is readable. If the plan file is missing or malformed: stop immediately — do not attempt to reconstruct it from memory.

**4. Read AGENTS.md.** Project constraints, test command, build command.

**5. Pre-flight plan scan.** Before dispatching Task 1, scan the plan once for:
- Tasks that contradict each other or the Global Constraints
- Anything the plan mandates that is internally inconsistent
Present all conflicts as one batched question. If scan is clean, proceed without comment.

---

## Setup

**Create the branch:**
```bash
git checkout -b ambrosia/<plan-slug>
```

If the branch already exists (resuming a session), check the current position:
- Read `ambrosia.log.md` for `[build] task-N complete` entries
- Resume at the first task without a completion entry
- Never re-execute completed tasks

**Record MERGE_BASE:**
```bash
git merge-base main HEAD
```
Store this — `wrap-up` needs it for the final review package.

---

## Task Loop

Repeat for each task in the plan:

### 1. Select model tier

| Task complexity | Model |
|---|---|
| 1-2 files, complete spec with exact code | Cheapest available |
| Multi-file, integration concerns | Standard/mid tier |
| Design judgment, broad codebase understanding | Most capable |
| Fix-loop rounds 4-5 (escalation) | One tier above stuck implementer |

Always specify the model explicitly when dispatching. An omitted model inherits the session default — often the most capable and most expensive.

### 2. Dispatch implementer subagent

Construct a work ticket containing ONLY:
- One line on where this task fits in the project
- The task's full text from the plan (the only source of requirements — never summarize)
- Interfaces and decisions from earlier tasks this task consumes
- The report file path: `.ambrosia/build/task-<N>-report.md`
- The test command and build command
- Global Constraints from the plan

Record BASE (`git rev-parse HEAD`) before dispatching.

**Never paste accumulated prior-task summaries.** A fresh subagent needs its task, the interfaces it touches, and the global constraints. Nothing else.

The implementer:
1. Writes the failing test (RED)
2. Runs it — confirms it fails with the expected error
3. Writes minimal implementation (GREEN)
4. Runs — confirms it passes
5. Refactors if needed, re-runs
6. Self-reviews: no unrequested abstractions, no avoidable dependencies
7. Commits: `ambrosia(task-N): <description>`
8. Returns: status, commits, one-line test summary, concerns

**Parallel-safe tasks:** if the plan marks 2+ tasks as `parallel-safe` and they are adjacent in the queue, invoke `handoff` to dispatch them concurrently. Continue with sequential tasks after integration.

### 3. Handle the report

| Status | Action |
|---|---|
| DONE | Run per-task ponytail check, then dispatch reviewer |
| DONE_WITH_CONCERNS | Read concerns; if correctness-related, address before review |
| NEEDS_CONTEXT | Provide missing context, re-dispatch |
| BLOCKED | Assess: context problem → more context + re-dispatch; reasoning problem → more capable model; task too large → break it down; plan wrong → escalate to user |

### 4. Per-task ponytail check

Before review, silently check the task's diff for over-engineering. One line per finding maximum. Append to report: "Ponytail: [finding]". Do not block — flag only.

### 5. Review the task

Dispatch a reviewer subagent with:
- The task brief (from plan)
- The report file
- The diff: `git diff BASE HEAD` — pass as a file, never inline
- Global Constraints

The reviewer checks: spec compliance AND code quality. Both required. Implementer self-review never replaces the task reviewer.

**Review verdicts:** Spec ✅ and quality approved → complete the task. Spec ❌ or Critical/Important finding → enter the fix loop.

### 6. Fix loop (if needed)

Maximum 5 rounds per task:
- **Rounds 1-3:** resume the original implementer with the findings verbatim
- **Rounds 4-5:** fresh implementer, one tier more capable, with full findings

After each round: dispatch a scoped re-reviewer on the fix diff only.

At round 5 cap with open findings: adjudicate — park with ruling, or STOP if load-bearing.

### 7. Complete the task

Append to `ambrosia.log.md`:
```
<timestamp> [build] task-<N> complete — commits <base7>..<head7>
```

### 8. Coordinator compression (every 3 tasks)

After every 3 completed tasks, compress the coordinator's in-context summaries:
- Write a single summary entry to `ambrosia.log.md`: `[build] tasks <N-2> through <N> complete — <one-line summary of what was built>`
- Drop the accumulated in-context task summaries
- Continue with the log as the authoritative record

This prevents coordinator context rot on long plans.

---

## Final review

After all tasks complete, dispatch a final whole-branch review:
- Package: `git diff <MERGE_BASE> HEAD`
- Reviewer: most capable available model
- Point it at any deferred-minor and parked findings from the task loop

If findings: dispatch ONE fix subagent with the complete findings list. One scoped re-review. Adjudicate residuals.

---

## Completion

```
<timestamp> [build] complete — <N> tasks, branch ambrosia/<slug>, final review clean
```

Recommend: run `verify` next.
