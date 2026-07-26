---
name: debug
description: "Systematic root cause debugging. Four-phase process: reproduce, isolate, hypothesize, fix. Never proposes fixes without root cause. Dispatches handoff on unrelated bugs. Escalates to diverge on architectural failures. Use when something is broken, a test fails, or behavior is unexpected."
---

# Debug

**Iron law:** Find the root cause before proposing any fix. Symptom fixes are failure.

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

---

## Pre-flight

**1. Triage incoming bugs.** If multiple bugs or failures are reported, classify them:
- Same root cause → handle together
- Related (one causes another) → handle sequentially, root first
- **Unrelated (disjoint files, disjoint subsystems)** → invoke `handoff` to dispatch in parallel, then resume

**2. Read AGENTS.md** for project-specific debugging context, test commands, known environment issues.

---

## Phase 1 — Root Cause Investigation

**BEFORE attempting any fix:**

**1. Read error messages completely.**
- Don't skip past errors or warnings
- Read stack traces fully — note line numbers, file paths, error codes
- They often contain the exact answer

**2. Reproduce consistently.**
- Can you trigger it reliably? What are the exact steps?
- If not reliably reproducible → gather more data, do not guess

**3. Check recent changes.**
- `git log --oneline -20` and `git diff HEAD~5..HEAD` on relevant files
- What changed that could cause this?

**4. Gather evidence in multi-component systems.**
Before proposing fixes, add diagnostic instrumentation at each component boundary:
- What data enters the component?
- What data exits?
- Where does the bad value first appear?

Run once to gather evidence. Analyze. Then investigate the specific failing component.

**5. Trace data flow.**
- Where does the bad value originate?
- What called this with the bad value?
- Trace backward up the call stack until you find the source
- Fix at the source, not at the symptom

---

## Phase 2 — Pattern Analysis

**1. Find working examples.** Locate similar working code in the same codebase.

**2. Compare against references.** If implementing a pattern, read the reference implementation completely — not a skim.

**3. Identify differences.** List every difference between working and broken, however small.

**4. Understand dependencies.** What environment, config, or state does this assume?

---

## Phase 3 — Hypothesis and Testing

**1. Form a single hypothesis.** State clearly: "I think X is the root cause because Y." Write it down.

**2. Test minimally.** Make the smallest possible change to test the hypothesis. One variable at a time.

**3. Verify before continuing.**
- Worked → Phase 4
- Didn't work → form NEW hypothesis. Do NOT add more fixes on top.

**4. When uncertain:** say "I don't understand X" and research before hypothesizing.

---

## Phase 4 — Implementation

**1. Write a failing test first.** Simplest possible reproduction. Automated if possible.

**2. Implement single fix.** Address the root cause only. No "while I'm here" improvements.

**3. Verify the fix.** Test passes. No other tests broken. Issue actually resolved.

**4. If fix doesn't work:**
- Count how many fixes have been attempted
- Fewer than 3: return to Phase 1 with new information
- **3 or more: STOP — question the architecture**

**5. If 3+ fixes failed:** This is an architectural problem, not a symptom. Invoke `diverge` (lite mode) on the question "what is wrong with the architecture here?" before attempting more fixes. Discuss findings with the user before proceeding.

---

## Red flags — stop and return to Phase 1

- "Quick fix for now, investigate later"
- "Just try changing X and see"
- Adding multiple changes at once
- Skipping the test
- "I don't fully understand but this might work"
- Proposing solutions before tracing data flow
- "One more fix attempt" when already tried 2+
- Each fix reveals a new problem in a different place

---

## Completion

After root cause found and fix verified:

Append to `ambrosia.log.md`:
```
<timestamp> [debug] root cause: <one-line description> — fixed in: <file:line> — test: <test name>
```

Then recommend running `verify` to confirm no regressions.
