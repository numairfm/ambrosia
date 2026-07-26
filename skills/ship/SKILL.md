---
name: ship
description: Run the full Ambrosia pipeline in one shot — audit → plan → build → verify → wrap-up. Single entry point for practitioners who want maximum autonomy and minimum ceremony. Trigger on "ship this", "just build it", "full pipeline", "end to end", or when the user gives a task and wants it done without stepping through each skill manually.
---

# Ship

Full pipeline, one entry point. For when you want it done, not narrated.

**Announce:** "Using the ship skill — running full pipeline: audit → plan → build → verify → wrap-up."

```
SHIP IS HIGH-AUTONOMY MODE.
It will proceed through the pipeline with minimal stops.
The only hard gates are: initial task confirmation, plan review (>5 tasks), and final integration choice.
```

---

## Pre-flight

**1. Read AGENTS.md.** Project rules take precedence over everything.

**2. Check for parked session.** If `.ambrosia/PARKED.md` exists:
```
A parked session exists (branch: <branch>, last: <task>).
Resume parked session or start fresh?
  1. Resume parked session — continue from Task <N>
  2. Start fresh — new task, new branch

Recommended: 1. Resume parked — you have unfinished work.
Proceeding with option 1. Say '2' to start fresh instead.
```

**3. Task intake.** If `$ARGUMENTS` is empty, ask once:
```
What do you want to ship? (describe the task)
```

If `$ARGUMENTS` is provided, treat it as the task. No follow-up question.

---

## Pipeline

### Stage 1 — Audit

Run `audit` on the task. If the prompt scores ≥ 8: skip confirmation, proceed to Stage 2 automatically. If score < 8: one confirmation turn, then continue.

### Stage 2 — Plan

Run `plan`. If plan has ≤ 5 tasks: post summary, say "Proceeding — say 'stop' to cancel." Then continue to Stage 3. If plan has > 5 tasks: full review gate — wait for explicit "go".

### Stage 3 — Build

Run `build`. No stops between tasks — continuous execution. The only interruptions are: fix-loop exhaustion (always stops), or the user typing "pause".

### Stage 4 — Verify

Run `verify`. If clean: proceed to Stage 5. If failing:
```
Verify failed: <N> issues.
Routing to debug automatically. (say 'skip' to go straight to wrap-up)
```
Route through `debug`. On resolution, re-run verify. Max 2 debug cycles before asking.

### Stage 5 — Wrap-up

Run `wrap-up`. Present the standard branch menu. Wait for user's integration choice.

---

## Aborts and errors

If any stage fails unrecoverably: stop immediately. Report which stage failed, what the error was, and the state of `.ambrosia/ambrosia.log.md`. Do not auto-continue past an unrecoverable failure:
```
Ship aborted at stage: <stage>
Reason: <one-line>
State saved. Resume with `build resume` or investigate with `debug`.
```

---

## Completion

Append to `ambrosia.log.md`:
```
<timestamp> [ship] complete — <N> tasks — branch: <branch>
```
