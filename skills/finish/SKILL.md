---
name: finish
description: Fifth and final stage of the Ambrosia v2 Core Lifecycle. Surfaces technical debt, scans for sensitive data, presents git/integration options, captures durable lessons, and persists session completion. Trigger after Verify passes or when "finish" is invoked.
---

# Finish

`Finish` is the delivery and session closure stage of Ambrosia v2. Its job is to answer one question:

> **"How do we cleanly finalize work, surface debt, ensure security and git hygiene, capture lessons, and persist session context?"**

`Finish` takes a 100% verified implementation and executes a clean, structured closeout. It audits technical debt tags, performs pre-commit security scans, offers turn-based git options, records durable lessons, and updates project logs. It never modifies source code or performs unapproved git actions.

---

## Operational Workflow

Execute `Finish` through five sequential steps:

### 1. Ingest Verification Report
- Confirm that `Verify` has granted a 100% `PASSED` status for the active implementation.
- Load the list of modified files, completed plan tasks, and original Definition of Success.

### 2. Surface Ponytail Debt Ledger
- Scan all modified files for `<comment_prefix> ponytail:` tags across touched files regardless of programming language.
- Aggregate all discovered tags into a visible **Technical Debt Ledger** so shortcuts are explicit, tracked, and never concealed.

### 3. Sensitive Data & Credentials Safety Scan
- Perform a mandatory security scan across all touched files for hardcoded credentials, API keys, private tokens, or unignored secret files.
- If sensitive data is detected, halt immediately and alert the user. Do NOT proceed to git options until credentials are removed.

### 4. Present Git Options & Turn-Based Approval
- Verify `.ambrosia/` is excluded from git tracking (`.git/info/exclude` or `.gitignore`) to ensure clean repository footprint.
- Present git status, modified file counts, and a proposed conventional commit message (e.g., `ambrosia(slug): description`).
- Offer turn-based integration choices (e.g., Commit locally / Push & PR / Keep uncommitted / Park session / Rollback).
- Wait for explicit user confirmation before executing any git actions.

### 5. Capture Durable Lessons & Persist State
- Extract reusable engineering patterns, architectural insights, or friction points discovered during the turn.
- Append distilled lessons to `.ambrosia/lessons.md`.
- Append session completion entry to `.ambrosia/logs/ambrosia.log.md`.

---

## Standing Rules & Invariants

1. **User Control Over Git:** Never commit, push, or open a PR without explicit user confirmation.
2. **Zero Code Edits:** `Finish` MUST NOT modify project source files.
3. **Mandatory Security Scan:** Always execute the sensitive data scan before presenting commit options.
4. **No Hidden Debt:** All discovered `<comment_prefix> ponytail:` tags MUST be surfaced in the final report.
5. **Log Completion:** Always persist session tag and lifecycle completion metrics to `.ambrosia/logs/ambrosia.log.md`.

---

## Output Contract & Handoff

Produce a clean, scannable delivery report covering:

1. **Verification Confirmation:** Re-affirm 100% pass from `Verify`.
2. **Technical Debt Ledger:** List of all surfaced `<comment_prefix> ponytail:` tags (or `"None — no shortcuts tagged"`).
3. **Security Scan Result:** Confirmation of zero sensitive data / credential exposure.
4. **Git Status & Options:** Proposed commit message and menu of integration choices.
5. **Lessons Learned:** Summary of distilled engineering patterns appended to `.ambrosia/lessons.md`.

End with:
> **Status:** `COMPLETE` — Ambrosia v2 lifecycle execution finished.
