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

### 1. Select model tier for task subagent

| Task complexity | Model |
|---|---|
| 1-2 files, complete spec with exact code | Cheap tier |
| Multi-file, integration concerns | Mid tier |
| Design judgment, broad codebase understanding | Capable tier |
| Fix-loop rounds 4-5 (escalation) | One tier above stuck implementer |

Always specify the model explicitly when dispatching.

---

### 2. Dispatch implementer subagent

Construct a work ticket containing ONLY:
- Task position & full task text from plan
- Consumed/produced interfaces
- Report file path: `.ambrosia/build/task-<N>-report.md`
- Test command & build command
- Global Constraints

Record BASE (`git rev-parse HEAD`) before dispatch.

The implementer performs strict TDD (RED → GREEN → REFACTOR), commits `ambrosia(task-N): <desc>`, and writes `.ambrosia/build/task-<N>-report.md`.

---

### 3. Handle report & Mandatory Independent Task Review

Implementer self-review NEVER replaces the task reviewer. Every task gets an independent reviewer subagent.

1. **Ponytail Check:** Perform a silent 1-line over-engineering check on the diff (`git diff BASE HEAD`).
2. **Dispatch Reviewer Subagent:** Hand the reviewer the task brief, the implementer's report, the diff file (`git diff BASE HEAD`), and project global constraints.
3. **Verdicts:**
   - **Spec ✅ & Quality Approved:** Complete the task.
   - **Spec ❌ or Critical/Important Issue:** Enter fix loop (Max 5 rounds; Rounds 1-3: resume implementer; Rounds 4-5: fresh implementer + model upgrade). Scoped re-review on fix diff.



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
