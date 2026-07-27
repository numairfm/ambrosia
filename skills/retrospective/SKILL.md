---
name: retrospective
description: Post-verify reflection skill. After verify passes or deliver completes, surfaces what surprised the agent, what assumptions were wrong, whether patterns should be codified, and whether future tasks can be made cheaper. Produces a structured reflection document. Trigger on "retrospective", "retro", "what did we learn", "reflect on this", or automatically after verify or deliver when the session produced significant work.
---

# Retrospective

Reflect on what actually happened. Surface surprises, wrong assumptions, and reusable patterns before they disappear into commit history.

**Announce:** "Using the retrospective skill to reflect on this session."

**This skill does not modify source files.** It reads what was built and produces a structured reflection.

---

## When to use

- After `verify` passes on a significant feature or refactor
- After `deliver` closes out a branch
- After a difficult `debug` session (what root cause pattern keeps appearing?)
- After a long `ship` pipeline (what would have been faster?)
- Any time the agent or user wants to capture learning before starting the next task

---

## Step 1 — Gather session evidence

Read the following to reconstruct what actually happened:

1. **`ambrosia.log.md`** — what skills ran, in what order, how many fix-loop rounds occurred
2. **`git log --oneline` for the branch** — what was actually committed vs. what was planned
3. **Active plan file** — what was planned vs. what was built (did scope drift?)
4. **Any `[debug]` entries** — what broke, what was the root cause
5. **Any `[review]` findings** — what the independent reviewer flagged

---

## Step 2 — Reflection questions

Answer each question with evidence from Step 1. Do not speculate without grounding in the session data.

**1. What surprised us?**
Anything that took longer than expected, broke unexpectedly, or turned out to be simpler than assumed. Be specific: what was the assumption, what was the reality?

**2. What assumptions were wrong?**
From the `audit` defaults or `plan` design decisions — which ones turned out to be incorrect or incomplete?

**3. Did scope drift? How much?**
Compare the original plan task list with what was actually committed. Note any tasks added mid-build, deferred, or quietly expanded.

**4. Could this pattern be reused?**
Is there a code pattern, prompt structure, or implementation approach from this session worth codifying for future use? If so, describe it in one paragraph.

**5. What would have been faster?**
Knowing what you know now — what would you have done differently in `audit`, `plan`, or `build` to reduce fix-loop rounds or rework?

**6. Should documentation change?**
Did the build surface anything that should update `AGENTS.md`, an existing README section, or an inline code comment?

---

## Step 3 — Write the reflection document

Save to `.ambrosia/retrospective-<YYYY-MM-DD>-<slug>.md`:

```markdown
# Retrospective: <feature or branch name>
Date: <ISO timestamp>
Branch: <branch>
Duration: <log start to deliver complete>
Fix-loop rounds: <N>

## Surprises
<bullet list with evidence>

## Wrong assumptions
<bullet list with original assumption and what was actually true>

## Scope drift
<planned tasks vs. actual commits — diff summary>

## Reusable patterns
<description, or "None identified">

## What would have been faster
<specific changes to audit, plan, or build approach>

## Documentation changes needed
<list of files and what to update, or "None">
```

---

## Step 4 — Debt check

If Step 2 surfaces wrong assumptions that were turned into working shortcuts (not marked with `ponytail:`), recommend:

```
<N> assumptions became untracked shortcuts during this session.
Add ponytail: markers to:
  <file:line> — <what was simplified>

Run `debt` to see the full picture.
```

---

## Completion

Append to `ambrosia.log.md`:
```
<timestamp> [<session-tag>] [retrospective] complete — .ambrosia/retrospective-<slug>.md — <N> reusable patterns, <M> doc changes needed
```

Post summary:
```
Retrospective complete.
  Surprises: <N>
  Wrong assumptions: <N>
  Reusable patterns: <yes / none>
  Doc changes needed: <yes / none>
  File: .ambrosia/retrospective-<slug>.md
```

---

## Output Contract

**Produces:** `.ambrosia/retrospective-<YYYY-MM-DD>-<slug>.md` with structured reflection. `ambrosia.log.md` entry appended. No source file modifications.
**Next skill:** None — this is a terminal reflection skill. Optionally feed findings back into `audit` for the next task.
**Failure conditions:** `ambrosia.log.md` is absent or empty (report that the session log is missing — retrospective will be shallow). No plan file found (note that scope drift analysis will be incomplete).
