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

If subagent dispatch is genuinely unavailable (network failure, harness limitation), see **Inline fallback** below.

---

## Inline fallback (failure mode only)

This section documents what to do when subagent dispatch is unavailable — not an elective mode.

**Trigger:** Subagent dispatch fails due to network error, harness limitation, or model unavailability. This is NOT a shortcut for tasks that feel "too small to dispatch."

**Protocol:**
1. Coordinator executes the task inline (edits files directly)
2. Append to `ambrosia.log.md`:
   ```
   <timestamp> [build] task-<N> INLINE-FALLBACK — subagent dispatch failed: <reason>
   ```
3. **Still dispatch an independent reviewer subagent** for the coordinator's diff — the review guarantee is not waived by the fallback
4. Note the deviation in the final build completion report:
   ```
   ⚠ Tasks executed inline (fallback): task-<N>[, task-<M>] — dispatch unavailable
   ```

**What is not preserved in fallback mode:**
- Coordinator context cleanliness (it now contains implementation detail)
- Full independence of review (reviewer and writer share the same session context)

These limitations must appear in the build completion report whenever fallback was used.

---

**Continuous execution:** Do not pause between tasks to check in. Execute all tasks without stopping unless: BLOCKED, genuine ambiguity that prevents progress, or all tasks complete.

---

## Pre-flight

**1. Prerequisite check.** Read `ambrosia.log.md`. If no `[plan]` entry exists AND `force` (or `--force`) was not passed:
```
No plan found. Run `plan` first, or say `build force` to build directly with an existing plan file.
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

## Pause command

If the user types `pause` at any point during the task loop:
- Finish the **current task only** — do not start the next one
- Commit and log normally
- Append to `ambrosia.log.md`: `<timestamp> [build] paused — completed through task-<N>, <M> tasks remaining`
- Post to chat: "Build paused after Task <N>. <M> tasks remain. Say `build resume` to continue."
- Stop. Do not proceed to the next task.

This is distinct from `wrap-up`'s park option — pause is mid-build; park is end-of-branch.

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
- **Role framing:** "You are a senior engineer. Your job is correctness and test coverage. Write the minimal code that makes the tests pass. No speculative abstractions."

Record BASE (`git rev-parse HEAD`) before dispatch.

**Parallel dispatch ping:** If this task is being dispatched alongside other tasks via `handoff`, post to chat before issuing the dispatch calls:
```
Dispatching <N> agents in parallel:
  → Task <A>: <one-line description>
  → Task <B>: <one-line description>
  ...
Waiting for all to return...
```

The implementer performs strict TDD (RED → GREEN → REFACTOR), commits `ambrosia(task-N): <desc>`, and writes `.ambrosia/build/task-<N>-report.md`.

---

### 3. Handle report & Mandatory Independent Task Review

Implementer self-review NEVER replaces the task reviewer. Every task gets an independent reviewer subagent.

1. **Empty report check.** If the report file (`.ambrosia/build/task-<N>-report.md`) is missing, empty (0 bytes), or contains only whitespace: treat this as an implementer failure. Do NOT proceed to review. Re-dispatch the implementer once. If the re-dispatch also returns empty: enter the fix loop at round 2 with a fresh implementer.
2. **Ponytail Check:** Perform a silent 1-line over-engineering check on the diff (`git diff BASE HEAD`).
3. **Dispatch Reviewer Subagent:** Hand the reviewer the task brief, the implementer's report, the diff file (`git diff BASE HEAD`), and project global constraints. **Role framing for reviewer:** "You are a paranoid senior engineer. Your job is to find what's wrong: security holes, spec deviations, edge cases, over-engineering, incorrect types, missing error handling. Be specific. File and line for every finding."
4. **Verdicts:**
   - **Spec ✅ & Quality Approved:** Complete the task.
   - **Spec ❌ or Critical/Important Issue:** Enter fix loop (Max 5 rounds; Rounds 1-3: resume implementer; Rounds 4-5: fresh implementer + model upgrade). Scoped re-review on fix diff.



### 4. Fix loop (if required)

If the reviewer flagged Spec ❌ or Critical/Important Issue:
- **Rounds 1-3:** Resume the same implementer subagent with the scoped fix diff + reviewer's exact findings
- **Rounds 4-5:** Fresh implementer subagent, model upgraded one tier above the stuck implementer
- Each round: scoped re-review on the fix diff only (not the full task diff)
- After round 5 still failing → proceed to Step 5

### 5. Fix-loop exhaustion escalation

STOP the task loop. Do not proceed to the next task. Post to chat:

```
Fix loop exhausted on Task <N> after 5 rounds.

Failure history:
  Round 1: <one-line summary>
  Round 2: <one-line summary>
  Round 3: <one-line summary>
  Round 4: <one-line summary>
  Round 5: <one-line summary>

What next?
  1. Invoke `debug` — root-cause investigation before retrying
  2. Invoke `diverge` — explore alternative approaches to this task
  3. Skip this task and continue with remaining plan tasks
  4. Abort build — roll back to last clean checkpoint

Recommended: 1. Invoke `debug` — fix-loop exhaustion usually signals a misunderstood root cause.
Proceeding with option 1. Say the number to override.
```

### 6. Post-fix verification

After any fix loop round succeeds (reviewer approves):
- Run the full test suite once to confirm no regressions introduced by the fix
- If regressions found: treat as a new review failure, enter fix loop again (round counter does NOT reset)

### 7. Complete the task

Append to `ambrosia.log.md`:
```
<timestamp> [build] task-<N> complete — commits <base7>..<head7>
```

**Ping:** Post to chat:
```
✓ Task <N>/<total> — <one-line description of what was built> — commits <base7>..<head7>
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
