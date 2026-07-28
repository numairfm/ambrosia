---
name: checkpoint
description: Event-driven capability of Ambrosia v2. Captures, persists, and validates the complete operational state of an active session for context restoration, pause/resume, or session handoff. Trigger mid-loop, before major edits, or when "checkpoint" is invoked.
---

# Checkpoint

`Checkpoint` is an event-driven capability of Ambrosia v2. Its job is to answer one question:

> **"How do we capture, persist, and validate the complete operational state of an active session so execution can safely pause, resume, or restore without context loss?"**

`Checkpoint` freezes the active orchestrator context into a structured, self-contained state file. It enables seamless pause/resume across terminal sessions, mitigates context rot during long worker loops, and preserves working tree state. It never modifies project source code.

---

## Operational Workflow

Execute `Checkpoint` through five sequential steps:

### 1. Ingest Current Lifecycle State
- Identify active lifecycle stage (`Analyze`, `Plan`, `Implement`, `Verify`, `Finish`).
- Read active plan location from `.ambrosia/plans/`, current task ID, and completed task checklist.

### 2. Inspect Working Tree Environment
- Inspect git status, active branch name, and uncommitted modified files.
- Scan modified files for active `// ponytail:` technical debt markers created in the current session.

### 3. Generate State Snapshot Document
Assemble a structured snapshot file containing:
- **Header:** Session tag, timestamp, active stage, and branch name.
- **Task Ledger:** Finished tasks, active task, remaining tasks, and locked file boundaries.
- **Working Tree State:** Modified files and surfaced ponytail debt tags.
- **Resume Prompt:** A 2-3 sentence deterministic instruction allowing a fresh session to restore state and resume execution instantly.

### 4. Persist Checkpoint File
- Create checkpoint directory if needed (`mkdir -p .ambrosia/checkpoints`).
- Save snapshot to `.ambrosia/checkpoints/<YYYY-MM-DD>-<slug>-cp<N>.md`.
- Update `.ambrosia/context.md` pointer to reference the latest active checkpoint.

### 5. Log & Resume Execution
- Append checkpoint creation record to `.ambrosia/logs/ambrosia.log.md`.
- Return control to the originating lifecycle stage with state confirmation.

---

## Standing Rules & Invariants

1. **Zero Source Code Edits:** `Checkpoint` MUST NOT create, edit, or delete project source code files.
2. **Self-Contained Snapshots:** Checkpoints MUST contain enough context (plan path, task index, git status) that a fresh session can resume without reading full conversation history.
3. **No Unapproved Git Actions:** `Checkpoint` does NOT execute git commits or pushes unless explicitly instructed by the user.
4. **Log State:** Always log checkpoint path and session tag to `.ambrosia/logs/ambrosia.log.md`.

---

## Output Contract & Handoff

Produce a clear state persistence summary covering:

1. **Active Stage & Task:** Current lifecycle stage and task progress.
2. **Saved Checkpoint File:** Path to `.ambrosia/checkpoints/<file>.md`.
3. **Working Tree Summary:** Git branch, modified files, and ponytail tags.
4. **Deterministic Resume Prompt:** Prompt to resume work in a fresh session.

End with:
> **Status:** `CHECKPOINT SAVED` — state persisted. Resuming active lifecycle stage or ready for session pause.
