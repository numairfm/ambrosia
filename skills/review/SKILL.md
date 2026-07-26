---
name: review
description: Standalone code review. Reads a diff or the current working changes, dispatches a reviewer subagent, returns findings with severity ratings. Usable any time — not just inside the build pipeline. Use when you want a second opinion on code, before a PR, after a big refactor, or when build's built-in review isn't enough.
---

# Review

Get a rigorous code review on any diff. Not just "does this look right" — spec compliance, quality, correctness, and a concrete list of findings you can act on.

**Announce:** "Using the review skill."

---

## Pre-flight

**What to review?** If not specified, default to the current branch diff: `git diff main...HEAD`

Options (natural language matching from `$ARGUMENTS`):
- Target: branch diff (default), staged changes (if mentioned), specific file (`review path/to/file`), or commit range (`review main..HEAD`)
- Focus: any specific attention area mentioned (e.g. "focus on auth", "check security", "performance") is passed directly to the reviewer subagent contract.

**Read AGENTS.md** for project constraints, patterns to follow, things to avoid. These are the reviewer's attention lens.

---

## Step 1 — Build the review package

```bash
# Default: full branch diff
git log --oneline main..HEAD
git diff --stat main...HEAD
git diff -U10 main...HEAD
```

Write the output to `.ambrosia/review-<timestamp>.diff`. This file is what the reviewer reads — it never enters the coordinator's context.

---

## Step 2 — Dispatch reviewer subagent

Give the reviewer:
- The diff file path
- AGENTS.md constraints verbatim (the exact values and patterns the project requires)
- The specific review goal or focus area from `$ARGUMENTS` (if any — "focus on auth logic", "security audit", "performance", etc.)
- This review contract:

**Review contract the subagent follows:**
1. Read the diff completely before forming any opinion
2. Check each change for: correctness, spec compliance, security, performance, maintainability
3. Rate each finding: **Critical** (blocks merge), **Important** (should fix), **Minor** (worth noting)
4. For each finding: file, line, severity, what's wrong, what to do instead
5. End with overall verdict: APPROVE / REQUEST_CHANGES / NEEDS_DISCUSSION

**Do not pre-judge findings.** Never tell the reviewer to ignore something or not flag it. If you think something is a false positive, let the reviewer raise it — you adjudicate afterward.

---

## Step 3 — Handle findings

**No findings / APPROVE:**
```
Review: APPROVE
No issues found. Clean diff.
```

**Findings present:**

List all findings:
```
Review: REQUEST_CHANGES

Critical:
  L42 auth/middleware.js — JWT secret hardcoded. Use env var.

Important:
  L91 api/users.js — N+1 query in user listing. Add eager load.

Minor:
  L7 utils/format.js — unused import. Remove.
```

For **Critical/Important findings**: ask "Fix these now? (y/n)"
- If yes: dispatch fix subagent with the complete findings list. One subagent, all findings together. Then run a scoped re-review on the fix diff.
- If no: save findings to `.ambrosia/review-<timestamp>-findings.md` for later.

For **Minor findings**: log them, don't block.

---

## Step 4 — Re-review (if fixes were made)

Dispatch a scoped re-reviewer on the fix diff only:
- Confirm each Critical/Important finding: ADDRESSED or NOT ADDRESSED
- Flag any new breakage introduced by the fix
- Do not re-raise findings from the original diff on unchanged code

---

## Completion

Append to `ambrosia.log.md`:
```
<timestamp> [review] <verdict> — <N> critical, <M> important, <K> minor — <commit range>
```
