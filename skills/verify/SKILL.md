---
name: verify
description: Fourth stage of the Ambrosia v2 Core Lifecycle. Acts as the empirical gatekeeper, confirming implementation correctness against the original Definition of Success using concrete execution evidence. Trigger after Implement completes or when "verify" is invoked.
---

# Verify

`Verify` is the empirical gatekeeper of Ambrosia v2. Its job is to answer one question:

> **"Does the implementation satisfy the original Definition of Success with concrete evidence, zero regressions, and full boundary adherence?"**

`Verify` inspects implementation outputs against the target requirements established in `Analyze` and `Plan`. It demands empirical runtime evidence before allowing work to complete. It never modifies source files or accepts unverified verbal assertions.

---

## Operational Workflow

Execute `Verify` through five sequential steps:

### 1. Ingest Definition of Success & Plan Criteria
- Retrieve the original **Definition of Success** carried forward from `Analyze` and `Plan`.
- Load the file modification boundaries, test commands, and interface contracts specified in the plan.

### 2. Execute Fresh Empirical Verification
- Run the full project test suite and build verification commands fresh.
- Do NOT rely on prior worker assertions — verification MUST execute fresh commands in the current turn.
- Collect explicit command output logs (test pass counts, build exit codes, runtime assertions).

### 3. Trace Requirements & Check Boundaries
- Perform file:line requirement tracing: map every item in the **Definition of Success** to specific passing tests or verified code locations.
- Verify boundary adherence: confirm file changes strictly matched locked plan paths without unapproved side effects or regressions in adjacent files.

### 4. Evaluate Review Findings (If Applicable)
- If `Review` was run during or after `Implement`, verify that all critical review findings (spec compliance, security, runtime correctness) have been addressed and validated.

### 5. Gate & Route Downstream
- **100% Verification Pass:** Gate transition to `Finish`.
- **Verification Failure (Bugs/Errors):** Route directly to `Debug` with full failure log evidence for 4-phase root cause isolation.
- **Architectural Failure (Design Flaw):** Route to `Diverge` if verification exposes fundamental architectural flaws requiring redesign.

---

## Standing Rules & Invariants

1. **Iron Law of Verification:** Never claim completion without fresh, empirical evidence (command output/logs) in the current message.
2. **Zero File Modifications:** `Verify` MUST NOT create, edit, or delete project source files.
3. **No Unverified Verbal Assertions:** "Tests pass" without output logs is a verification failure.
4. **Strict Boundary Checking:** Any unapproved file edits outside plan boundaries fail verification.
5. **Log State:** Append verification status and evidence summary to `.ambrosia/logs/ambrosia.log.md`.

---

## Output Contract & Handoff

Produce a clear, evidence-backed summary covering:

1. **Empirical Evidence Summary:** Command execution outputs, test pass/fail counts, build status.
2. **Requirement Traceability:** Map of original Definition of Success items to verified code/test locations.
3. **Boundary Verification:** Confirmation of zero unapproved file edits or regressions.
4. **Gate Result:** `PASSED` (Proceed to `Finish`) OR `FAILED` (Route to `Debug`/`Diverge`).

End with:
- On Pass: > **Next Stage:** `Finish` — surface ponytail debt ledger, perform sensitive-data scan, present git integration options, and capture lessons.
- On Fail: > **Route to:** `Debug` — perform 4-phase root cause diagnosis on verification failures.
