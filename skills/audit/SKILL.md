---
name: audit
description: Audit a raw task prompt or idea for gaps before planning. Formulates concrete defaults, identifies parallel-safety, and produces clean ready-to-run prompts. Ambrosia-aware — hands off to plan when done. Trigger on "audit this", "check my prompt", "improve my idea", or when a raw task is given before planning.
---

# Audit

Interrogate and refine a raw prompt or idea before it reaches `plan`. Produce a clean, complete, ready-to-plan prompt.

**To skip audit:** say "prompt is ready", "skip audit", or pass `--no-audit`.

`$ARGUMENTS` — the raw prompt or idea to audit.

---

## Pre-flight: Quality Check

Score the prompt silently (0-2 each, max 10):
1. **Scope clear** (files/systems specified)
2. **Deliverable concrete** (shippable outcome)
3. **Success verifiable** (checkable test/checklist)
4. **No bundling** (single coherent task)
5. **No ungrounded claims** (verified external assumptions)

- **Score ≥ 8:** Announce "Prompt is clear (score <N>/10) — proceeding to plan or execution." Then write final prompt (Step 3).
- **Score < 8:** Proceed to Step 1.

---

## Step 1 — Audit for Holes & Formulate Defaults

Identify ambiguity: scope, vague deliverables, missing repro, unverifiable language, bundled tasks, or ungrounded claims.

For minor/moderate holes, **formulate sensible default assumptions** rather than asking open questions.

---

## Step 2 — Single-Pass Confirmation

If critical holes exist that change what gets built, ask concise, batched questions.
If defaults cover the gaps, present the prompt along with assumed defaults for 1-turn approval:

```
Assumed defaults (carry this list to the plan summary or inspection brief):
- [Default 1]
- [Default 2]

Reply 'go' to accept and proceed, or specify changes.
```

---

## Step 3 — Final Prompt Output

Write the prompt in a fenced code block with concrete constraints, verified external claims, and zero fluff.

---

## Step 4 — Task Splitting & Parallel Safety

If bundled, split into `Prompt 1 of N`, `Prompt 2 of N`. Tag parallel-safe items.

---

## Step 5 — Handoff (Plan or Direct Execution)

Append to `ambrosia.log.md`:
```
<timestamp> [<session-tag>] [audit] complete — <N> prompt(s) produced (score: <N>/10), parallel-safe: <yes/no>
```
On confirmation:
- **Feature / Code Change:** Invoke `plan` with the refined prompt.
- **Code Review / Inspection / Research:** Proceed directly to execute the task using the refined prompt and stated default assumptions.

