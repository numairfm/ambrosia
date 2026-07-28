---
name: review
description: Event-driven capability of Ambrosia v2. Performs an actionable diff review across spec compliance, security, and runtime correctness. Trigger when requested during Implement, for Medium/Large tasks, or when "review" is invoked.
---

# Review

`Review` is an event-driven capability of Ambrosia v2. Its job is to answer one question:

> **"Does the implementation comply with specification requirements, security invariants, performance standards, and runtime correctness without introducing regressions?"**

`Review` evaluates code diffs against planned specifications before or during verification. It focuses strictly on actionable functional flaws, security risks, and runtime edge cases, deferring formatting and style to automated tools. The orchestrator conducts the review; workers execute code fixes.

---

## Operational Workflow

Execute `Review` through five sequential steps:

### 1. Ingest Diffs & Scope
- Ingest the git diff, modified file list, and target specification from `Plan` and `Analyze`.
- Limit review strictly to modified lines and immediate interface boundaries.

### 2. Audit Vector 1: Spec Compliance
- Verify that every code addition directly traces to an approved plan task.
- Check for unapproved scope expansion, missing requirements, or partial interface implementations.

### 3. Audit Vector 2: Security & Safety
- Check for security vulnerabilities: injection risks, credential exposure, unsafe file/system calls, unvalidated user input, and insecure defaults.
- Confirm secret management compliance (zero hardcoded keys or tokens).

### 4. Audit Vector 3: Runtime Correctness
- Check for runtime edge cases: unhandled exceptions, race conditions, resource leaks, null/undefined dereferences, and logic boundaries.
- Inspect physical/UI/interaction logic for behavioral correctness (preventing silent logic bugs that pass static compilation).

### 5. Categorize Findings & Route
Categorize all findings into explicit severity tiers:
- **`CRITICAL` (Blocking):** Security vulnerability, data corruption, or severe runtime crash. Route back to `Implement` for immediate worker repair.
- **`MAJOR` (Actionable):** Spec deviation or unhandled error state. Route to `Implement` for worker repair.
- **`MINOR` (Non-blocking):** Minor leanness or optimization opportunity. Tag inline as `// ponytail:` debt candidate or pass cleanly.

---

## Standing Rules & Invariants

1. **No Style Nitpicking:** Do not block reviews on code formatting, variable naming preferences, or cosmetic style. Defer to automated linters.
2. **Zero Code Edits:** `Review` MUST NOT modify project source files. Fixes are executed by dispatched workers via `Implement`.
3. **Actionable Findings Only:** Every `CRITICAL` or `MAJOR` finding MUST specify the exact file, line, and concrete defect.
4. **Log State:** Log review outcome and finding counts in `.ambrosia/logs/ambrosia.log.md`.

---

## Output Contract & Handoff

Produce a structured review report covering:

1. **Diff Scope:** Files inspected and line count.
2. **Actionable Findings:** Categorized list of `CRITICAL`, `MAJOR`, and `MINOR` items with exact file:line references and recommended fixes.
3. **Review Decision:** `APPROVED` (Pass to `Verify`) OR `REJECTED` (Route to `Implement` with fix list).

End with:
- On Approval: > **Route to:** `Verify` — proceed to empirical test verification and final requirement gating.
- On Rejection: > **Route to:** `Implement` — dispatch worker subagents to execute required fixes under TDD loop.
