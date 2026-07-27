---
name: context
description: Compress the current session into a clean context snapshot and produce a resume prompt for a fresh session. Use when context rot is setting in — the session is long, the model is drifting, or you're switching to a new terminal. Trigger on "context rot", "save my place", "start a fresh session", "compress context", "too long", or any sign that the agent is losing coherence.
---

# Context

Save the current session state and produce a clean resume prompt. Prevents context rot from destroying a long session's progress.

**Announce:** "Using the context skill to compress and snapshot current session state."

---

## When to use

- Session is long and model responses are getting vague or repetitive
- You're switching to a different terminal, machine, or agent session
- You want a clean handoff to a fresh context window mid-task
- The log is large and coordinator compression in `build` isn't enough
- After parking (`wrap-up` option 4) to produce a richer resume prompt

---

## Step 1 — Read current state

Gather state from:

1. **`ambrosia.log.md`** — what phase is the session in? What's complete, in-progress, blocked?
2. **Active plan file** — `.ambrosia/plans/*.md` — which tasks are done, which remain?
3. **Recent git log** — `git log --oneline -10` — what commits exist?
4. **Open decisions** — anything asked but not answered in this session?
5. **Working tree status** — `git status --short` — any uncommitted changes?

---

## Step 2 — Write the context snapshot

Save to `.ambrosia/context.md` (overwrite if exists):

```markdown
# Context Snapshot
Created: <ISO timestamp>
Session: <conversation ID or "unknown">

## Current state
Phase: <orient | audit | plan | build | verify | debug | wrap-up | ad-hoc>
Branch: <current git branch>
Last checkpoint: <hash from ambrosia.log.md, or "none">

## What's done
<bullet list of completed tasks from log, most recent last>

## What's in progress
<the active task or phase — be specific: "Task 3 of 5: auth middleware">

## What's next
<the immediate next step — exact enough that a fresh agent can execute it>

## Open decisions
<anything unresolved that affects next steps>
  - <question> → pending user answer
  - <question> → assumed: <default>

## Key constraints
<the 3-5 project rules a fresh agent needs to know, from AGENTS.md and global constraints>

## Blockers
<anything that cannot proceed until resolved>

## Files actively being modified
<list of files with uncommitted changes or partial work>
```

---

## Step 3 — Produce the resume prompt

Write a clean, self-contained prompt that a fresh session (zero context) can use to continue:

```
## Resume prompt (copy this into a fresh session)

---
I'm resuming a session in <project name>.

**Current state:** <one sentence — what phase, what task>

**What's done:** <2-3 bullets>

**What to do next:** <exact next action>

**Key constraints:**
<3-5 bullet points from AGENTS.md>

**Context file:** `.ambrosia/context.md` — read this before doing anything.
**Plan file:** `.ambrosia/plans/<filename>` — ground truth for the task list.
**Log:** `.ambrosia/ambrosia.log.md` — full history.

Start by reading those three files, then continue from where we left off.
---
```

Post this resume prompt visibly in the chat so the user can copy it.

---

## Step 4 — Flag rot signals

After writing the snapshot, check for signs of context rot that should be addressed before resuming:

| Signal | Flag |
|---|---|
| `ambrosia.log.md` > 500 lines | [WARN] Log is large — consider archiving old entries |
| Any task re-dispatched > 2 times | [WARN] Fix loop churn — consider `debug` before resuming |
| Open decisions > 3 | [WARN] Too many unresolved questions — answer before resuming |
| Uncommitted changes on 3+ files | [WARN] Messy working tree — commit or stash before switching sessions |

Report flagged signals, but don't block — these are warnings, not errors.

---

## Completion

Append to `ambrosia.log.md`:
```
<timestamp> [<session-tag>] [context] snapshot written — .ambrosia/context.md — phase: <phase>, <N> tasks remaining
```

Post:
```
Context snapshot saved: .ambrosia/context.md
Resume prompt above is ready to paste into a fresh session.

Rot signals: <N found | none>
```
