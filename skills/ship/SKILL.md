---
name: ship
description: Run the full Ambrosia pipeline in one shot — audit → plan → build → review → verify → deliver. Single entry point for practitioners who want maximum autonomy and minimum ceremony. Trigger on "ship this", "just build it", "full pipeline", "end to end", or when the user gives a task and wants it done without stepping through each skill manually.
---

# Ship

Full pipeline, one entry point. For when you want it done, not narrated.

**Announce:** "Using the ship skill — running full pipeline: audit → plan → build → review → verify → deliver."

```
SHIP IS HIGH-AUTONOMY MODE.
It will proceed through the pipeline with minimal stops.
The only hard gates are: initial task confirmation, plan review (>5 tasks), and final integration choice.
```

---

## Pre-flight

**1. Read AGENTS.md.** Project rules take precedence over everything.

**2. Check for parked session.** If `.ambrosia/PARKED.md` exists:

A parked session exists (branch: `<branch>`, last: `<task>`).
- **[1] Resume parked session (Recommended)** — Pick up at Stage `<N>`.
- **[2] Discard parked session** — Start fresh.

*Recommendation: Option 1 — pick up where previous session left off.*  
*Reply with option number (or press Enter for recommended).*

**3. Task intake.** If `$ARGUMENTS` is empty, ask once:
```
What do you want to ship? (describe the task)
```

If `$ARGUMENTS` is provided, treat it as the task. No follow-up question.

---

## Pipeline

### Stage 1 — Audit

Run `audit` on the task. If the prompt scores >= 8: skip confirmation, proceed to Stage 2 automatically. If score < 8: one confirmation turn, then continue.

### Stage 2 — Plan

Run `plan`. If plan has <= 5 tasks: post summary, say "Proceeding — say 'stop' to cancel." Then continue to Stage 3. If plan has > 5 tasks: full review gate — wait for explicit "go".

### Stage 3 — Build

Run `build`. No stops between tasks — continuous execution. The only interruptions are: fix-loop exhaustion (always stops), or the user typing "pause".

### Stage 4 — Review

Run `review` on the full branch diff. If no Critical or Important findings: proceed to Stage 5. If findings exist:
```
Review flagged <N> issues.
Routing to fix automatically. (say 'skip' to proceed to verify anyway)
```
Dispatch fix subagent with all Critical/Important findings. Re-review fix diff. Then continue.

### Stage 5 — Verify

Run `verify`. If clean: proceed to Stage 6. If failing:
```
Verify failed: <N> issues.
Routing to debug automatically. (say 'skip' to go straight to deliver)
```
Route through `debug`. On resolution, re-run verify. Max 2 debug cycles before asking.

### Stage 6 — Deliver

Run `deliver`. Present the standard branch menu. Wait for user's integration choice.

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
<timestamp> [<session-tag>] [ship] complete — <N> tasks — branch: <branch>
```

## Output Contract

**Produces:** Fully delivered branch (merged, PR open, or parked). `ambrosia.log.md` entry appended.
**Next skill:** `reflect` (optional / event-driven) — distill lessons and patterns from what was shipped.
**Failure conditions:** Any stage fails unrecoverably — stop and report with exact stage, error, and log state.
