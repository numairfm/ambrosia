---
name: reflect
description: Post-delivery reflection skill. Event-driven or on-demand after verify and deliver complete. Distills durable knowledge into 3 crisp pillars (Lessons, Patterns, Debt) without bloat. Trigger on "reflect", "lessons", "distill", "reflect on this", or automatically when ship/deliver encounters significant pivots, debug iterations, or architectural shifts.
---

# Reflect

Extract durable, reusable knowledge from completed work.

**Announce:** "Using the reflect skill to distill lessons from this session."

**This skill does not modify source files.** It reads session history and produces a concise knowledge snapshot.

---

## When to use

- **Event-driven (Automatic trigger):**
  - Major feature completed or multi-task pipeline execution
  - Session required >1 debug triage cycle
  - Scope shifted or unexpected architectural pivot occurred
- **On-demand:**
  - User asks "what did we learn", "reflect on this", or "distill session"

---

## Step 1 — Gather session evidence

Read the following session artifacts:

1. **`ambrosia.log.md`** — skill sequence, fix-loop rounds, and checkpoints
2. **Active plan / git diff** — planned tasks vs. actual implementation diff
3. **Debug logs & review findings** — root cause tracebacks and reviewer flags

---

## Step 2 — Synthesize into 3 Pillars

Focus strictly on extracting durable insights into three sections:

### 1. Lessons
- What surprised us during implementation or debugging?
- What initial assumptions in `audit` or `plan` turned out to be wrong?

### 2. Patterns
- What reusable pattern, utility structure, or convention should become standard practice?
- Are there documentation or `AGENTS.md` updates recommended?

### 3. Debt
- What deliberate simplifications, ponytail markers, or deferred items still deserve attention?

---

## Step 3 — Write reflection snapshot

Save to `.ambrosia/reflect-<YYYY-MM-DD>-<slug>.md`:

```markdown
# Reflection: <feature or branch name>
Date: <ISO timestamp>
Branch: <branch>
Duration / Rounds: <log summary>

## Lessons
- <Surprises, wrong assumptions, or unexpected friction>

## Patterns
- <Reusable code/prompt conventions or doc updates needed>

## Debt
- <Tracked ponytail markers or deferred items>
```

---

## Completion

Append to `ambrosia.log.md`:
```
<timestamp> [<session-tag>] [reflect] complete — .ambrosia/reflect-<slug>.md — <N> lessons, <M> patterns
```

Post summary:
```
Reflection complete.
  Lessons: <N>
  Patterns: <N>
  Debt items: <N>
  File: .ambrosia/reflect-<slug>.md
```

---

## Output Contract

**Produces:** `.ambrosia/reflect-<YYYY-MM-DD>-<slug>.md` with structured 3-pillar reflection. `ambrosia.log.md` entry appended. No source file edits.  
**Next skill:** None — terminal post-delivery stage. Optionally update repo `AGENTS.md` or docs if patterns emerged.  
**Failure conditions:** `ambrosia.log.md` absent (proceeds with lightweight diff-only reflection).
