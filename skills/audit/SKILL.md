---
name: audit
description: Audit a raw task prompt or idea for gaps before anything is planned. Interviews for missing context, splits bundled tasks, produces clean ready-to-run prompts with parallel-safety analysis. Ambrosia-aware — offers to hand off to plan when done. Trigger on "audit this", "check my prompt", "improve my idea", or when a raw task is given before planning.
---

# Audit

Interrogate and refine a raw prompt or idea before it reaches `plan`. Do NOT start planning, building, or executing the task. Your only job is to produce a clean, complete, ready-to-plan prompt.

**To skip audit when your prompt is already complete:** say "prompt is ready" or "skip audit" or pass `--no-audit`. Audit will confirm the skip and hand directly to `plan`.

`$ARGUMENTS` — the raw prompt or idea to audit.

---

## Pre-flight: silent quality check

Before asking any questions, score the raw prompt silently on these 5 axes (0-2 each, max 10):

1. **Scope clear** — do we know which files/systems/parts this applies to?
2. **Deliverable concrete** — is the output a specific, shippable thing?
3. **Success verifiable** — can we write a test or checklist that proves it's done?
4. **No bundling** — is this one coherent task, not 2+ unrelated tasks stapled together?
5. **No ungrounded claims** — does it avoid asserting facts about external APIs/behavior without verification?

**Score ≥ 8:** skip the interview. Go directly to Step 3 with a note: "Prompt is specific — skipping interview."

**Score < 8:** proceed to Step 1.

---

## Step 1 — Audit for holes

Check the prompt against each category. Note real holes only — don't recite the list mechanically:

- **Scope ambiguity:** which files/sources/parts of the codebase does this apply to?
- **Undefined deliverable:** if the request uses a vague verb ("port", "integrate", "support", "improve", "handle") — what does that concretely mean as a shipped feature?
- **Missing repro/diagnostic info:** for bug fixes — is there a reproduction case, error message, or example input?
- **Unverifiable success criteria:** phrases like "make no mistakes", "robust", "versatile", "fool proof" — not checkable.
- **Bundled unrelated tasks:** does this contain 2+ substantively different pieces of work?
- **Unstated constraints:** budget, which existing code paths to reuse vs build fresh, edge-case handling.
- **Ungrounded external claims:** does the request assert facts about an external API/site/dataset without those facts being verified? If web search is available, verify them now. If not, flag as `[UNVERIFIED]`.

---

## Step 2 — Ask, don't assume

If real holes exist, ask about them directly and concisely. Rules:
- Prefer 2-4 concrete options over open-ended questions when reasonable candidates exist
- Only ask about holes that would actually change what gets built
- State assumed defaults for minor holes — don't ask
- One batched message with all questions — not one question per turn

If the prompt already answers most categories, say so briefly and skip to Step 3.

**Stop here and wait for answers before continuing.**

---

## Step 3 — Produce the final prompt

Once you have answers (or confirmed no real holes), write the final prompt. Rules:

- Output ONLY the prompt in a single fenced code block — no preamble, no explanation beyond one short intro line
- If the body contains inline code/fences, use a four-backtick outer fence
- Bake answers in as concrete constraints, not restated questions
- Replace unverifiable success language with a concrete definition of done and how to verify it
- Tell the agent explicitly what NOT to do, where useful
- Ground external claims — instruct the executing agent to verify any asserted API/dataset fact directly before building on it
- No pleasantries or padding

---

## Step 4 — If split into multiple prompts

If the audit found bundled unrelated tasks, split into separate prompts. For each:
- Prefix with **`Prompt N of M — <3-6 word title>`** and a horizontal rule
- Check each pair against: file/module overlap, sequential dependency, build stability

Add a "Run order" note outside any fence:
- Which prompts are **parallel-safe** (can run concurrently via `handoff`)
- Which must run **sequentially** and why
- Default to sequential when unsure

---

## Step 5 — Ambrosia handoff

After the final prompt(s) are produced, **always** append to `ambrosia.log.md` first:
```
<timestamp> [audit] complete — <N> prompt(s) produced, parallel-safe: <yes/no>
```

Then offer:

```
Ready to hand this to `plan`? (y/n)
If yes, I'll start planning immediately.
If no, copy the prompt above and use it when ready.
```

If yes: invoke `plan` with the cleaned prompt.
