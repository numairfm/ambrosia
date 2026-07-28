---
name: debug
description: Event-driven capability of Ambrosia v2. Systematically reproduces, isolates, and diagnoses the root cause of implementation or verification failures before attempting repairs. Trigger when tests fail, workers block, or "debug" is invoked.
---

# Debug

`Debug` is an event-driven capability of Ambrosia v2. Its job is to answer one question:

> **"How do we systematically reproduce, isolate, and diagnose the root cause of an error before attempting any fix, avoiding trial-and-error code edits?"**

`Debug` is invoked when `Implement` or `Verify` encounters a failure. It replaces speculative trial-and-error editing with a disciplined 4-phase diagnosis workflow. The orchestrator coordinates diagnosis and worker dispatch, never modifying code directly.

---

## Operational Workflow

Execute `Debug` through four sequential phases:

### Phase 1: Reproduce
- Ingest error traces, stack traces, and failure logs from `Implement` or `Verify`.
- Establish a minimal, deterministic reproduction command or test case.
- Confirm the failure reproducibly triggers before attempting any analysis.

### Phase 2: Isolate
- Trace execution flow upstream from the failure point.
- Narrow the failure surface to the exact file, function, signature, or state boundary where actual behavior diverges from expected behavior.
- Differentiate between logic bugs, type/interface mismatches, state corruption, or missing dependencies.

### Phase 3: Diagnose (Root Cause)
- Formulate a single, evidence-backed hypothesis for the exact root cause.
- Reject superficial symptom patching (e.g., swallowing exceptions, adding dummy fallbacks, commenting out broken assertions).
- Verify the hypothesis against log evidence before prescribing a repair.

### Phase 4: Prescribe Fix & Route
- Write a precise, minimal repair prescription defining the exact target file and logic change needed.
- **Single/Minor Bug:** Route diagnosis back to `Implement` for worker TDD repair.
- **Recurring Failure (3+ Failed Attempts):** Escalate to `Diverge` for architectural re-evaluation if root cause indicates a fundamental design flaw.

---

## Standing Rules & Invariants

1. **No Trial-and-Error Fixes:** Never attempt code modifications without a proven root-cause hypothesis.
2. **Zero Code Edits:** `Debug` MUST NOT modify project source files directly. Repairs are executed by dispatched workers via `Implement`.
3. **No Symptom Masking:** Swallowing exceptions, adding dummy returns, or deleting failing unit tests is strictly prohibited.
4. **Escalation Gate:** If a bug resists 3 repair attempts, halt execution and escalate to `Diverge` or prompt the user.
5. **Log State:** Log diagnosis details and root cause summary in `.ambrosia/logs/ambrosia.log.md`.

---

## Output Contract & Handoff

Produce a clear, evidence-backed diagnostic report covering:

1. **Reproduction Case:** The exact command or test demonstrating the failure.
2. **Isolated Location:** The exact file, function, and line range of the root cause.
3. **Root Cause Analysis:** Explanation of why the contract broke (backed by log evidence).
4. **Prescribed Repair:** Minimal, targeted fix instructions for worker implementation.

End with:
- Standard Repair: > **Route to:** `Implement` — dispatch worker subagent to execute prescribed repair under TDD loop.
- Structural Failure: > **Route to:** `Diverge` — architectural redesign required after repeated fix failures.
