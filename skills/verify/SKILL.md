---
name: verify
description: Confirm work is actually done — evidence-based, plan-checked. Runs the full test suite, checks output against the plan line by line, stamps a clean checkpoint. Routes failures through debug (which decides if handoff is appropriate). Use after build, before trim or wrap-up.
---

# Verify

**Iron law:** Evidence before claims, always.

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

If you haven't run the verification command in this message, you cannot claim it passes.

---

## Pre-flight

**1. Prerequisite check.** Read `ambrosia.log.md`. If no `[build]` entry exists AND `force` (or `--force`) was not passed:
```
No build found. Run `build` first, or say `verify force` to verify against existing code.
```

**2. Read the plan.** Load the plan file from `.ambrosia/plans/`. This is the ground truth for what was supposed to be built.

**3. Read AGENTS.md.** Confirms test command and build command.

---

## Step 1 — Run the full test suite

Run the project's complete test suite (from AGENTS.md or auto-detected: `npm test`, `cargo test`, `pytest`, `go test ./...`, etc.).

**If tests fail:**
```
Tests failing: <N> failures

[show exact failures with file:line]

Do NOT claim anything is complete until failures are resolved.
```

Classify failures:
- **Related failures** (same root cause, same subsystem) → handle together via `debug`
- **Independent failures** (different subsystems, disjoint files) → invoke `debug` for each; `debug`'s own pre-flight determines whether those failures are `handoff`-eligible for parallel dispatch (relying on `handoff/SKILL.md`'s centralized parallel dispatch ping)

**If tests pass:** continue to Step 2.

---

## Step 2 — Reality check

Run the build command (if applicable):
```bash
<build command from AGENTS.md>
```

Check for: exit 0, no compilation errors, no type errors.

If the build fails but tests pass: still a failure. Report both.

---

## Step 3 — Plan compliance check

Read the plan. For each requirement, confirm it exists in the built code at a specific file and line location:

```
Plan compliance:
  [PASS] Task 1: <requirement> — verified at <file:line>
  [PASS] Task 2: <requirement> — verified at <file:line>
  [FAIL] Task 3: <requirement> — NOT FOUND
```

A requirement is verified only when you can point to the file and line that implements it. "Tests pass, phase complete" is NOT verification.

---

## Step 4 — Stamp clean checkpoint

If and only if:
- All tests pass (exit 0, zero failures)
- Build succeeds
- Every plan requirement verified at a specific file:line

Append to `ambrosia.log.md`:
```
<timestamp> [verify] clean — checkpoint: <commit-hash> — <N>/<N> requirements verified
```



This commit hash is the rollback target if anything goes wrong in later steps.

---

## Step 5 — Report

**Clean:**
```
Verify passed.
  Tests: <N>/<N> passing
  Build: clean
  Plan: <N>/<N> requirements verified
  Checkpoint: <short-hash>

Ready for `trim` and `wrap-up`.
```

**Not clean:**
```
Verify failed.
  Tests: <N> failing
  [list exact failures with file:line and stack trace summary]
  Plan gaps: [list missing requirements]

Automatically hand off exact failure context to `debug` for root cause investigation.
```

---

## Common failures

| Claim | Requires | Not sufficient |
|---|---|---|
| Tests pass | Test command output: 0 failures | Previous run, "should pass" |
| Build succeeds | Build command: exit 0 | Linter passing |
| Bug fixed | Original test: passes | Code changed, assumed fixed |
| Requirements met | Line-by-line plan check | Tests passing |
| Agent completed | VCS diff shows changes | Agent reports "success" |

## Red flags — STOP

- Using "should", "probably", "seems to"
- Expressing satisfaction before running verification
- About to move forward without evidence
- Trusting agent success reports without independent check
- Partial verification ("I checked the main path")
