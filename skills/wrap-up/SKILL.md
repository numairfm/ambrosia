---
name: wrap-up
description: "Close out a development branch. Verifies tests, auto-runs debt audit, prompts for trim, then presents options: merge locally, push and create PR, keep branch as-is, or park for later. Also supports rollback to last clean checkpoint. Use when verify is clean and work is ready to integrate."
---

# Wrap-up

Close out this unit of work cleanly.

**Announce:** "Using the wrap-up skill to close out this branch."

---

## Pre-flight

**1. Prerequisite check.** Read `ambrosia.log.md`. If no `[verify] clean` entry exists AND `force` (or `--force`) was not passed:
```
No clean verify found. Run `verify` first to confirm work is complete, or say `wrap-up force` to skip.
```

**2. Read checkpoint.** Find the last `checkpoint: <hash>` entry in `ambrosia.log.md`. This is the rollback target if needed.

---

## Step 1 — Run tests (fresh)

Run the full test suite now, on the tree you are about to integrate. A green run from earlier only proves the tree it ran on.

If tests fail:
```
Tests failing (<N> failures). Fix before wrapping up:
[failures]
```

Stop until clean. Only a green suite proceeds.

---

## Step 2 — Auto-run debt

Run the `debt` skill automatically. Show the debt ledger output. Ask:
```
<N> ponytail: markers found (<M> with no upgrade trigger).
Review above. Continue to wrap-up? (y/n)
```

The user decides whether to address debt items now or defer. This is not a blocker — just visibility.

---

## Step 3 — Prompt for trim

```
Run `trim` before closing? (recommended — catches over-engineering in the final diff)
(y/n)
```

If yes: run `trim` (diff mode). After confirmation and cuts: re-run tests to confirm clean.
If no: proceed.

---

## Step 4 — Log security scan

Before any push operation, scan `ambrosia.log.md` and the diff for sensitive patterns:

```bash
grep -iE '(sk-[a-z0-9]{20,}|bearer [a-z0-9]{10,}|password\s*=\s*["\x27][^"]+|private.?key|api.?key\s*=)' .ambrosia/ambrosia.log.md
```

If matches found:
```
[WARN] Possible sensitive data in ambrosia.log.md:
  [show matches with context]

Review before pushing. The log is gitignored by default. If you've removed .ambrosia/ from .gitignore, address this first.
```

This is a warning, not a blocker — the user decides.

---

## Step 5 — Detect environment

```bash
GIT_DIR=$(cd "$(git rev-parse --git-dir)" 2>/dev/null && pwd -P)
GIT_COMMON=$(cd "$(git rev-parse --git-common-dir)" 2>/dev/null && pwd -P)
WORKTREE_PATH=$(git rev-parse --show-toplevel)
CURRENT_BRANCH=$(git branch --show-current)
```

---

## Step 6 — Determine base branch

The base branch is wherever this work forked from. Check the plan file for `**Branch:**` entry or ask: "This branch split from `<best guess>` — correct? (y/n)"

Confirm before merging. Merging into the wrong base is expensive to undo.

---

## Step 7 — Present options

Work is ready. What would you like to do?

- **[1] Merge to `<base-branch>` locally**
- **[2] Push and create a Pull Request**
- **[3] Keep the branch as-is (handle later)**
- **[4] Park (save state summary for next session)**
- **[5] Rollback to last clean checkpoint (`<short-hash>`)**

*Reply with option number (1-5).*

---

## Options

### Option 1 — Merge locally

Before switching branches, ensure working tree is clean (`git status --short`). Then:

```bash
git checkout <base-branch>
git pull
git merge ambrosia/<slug>
```

Run tests on the merged result. If they fail: stop, leave branch in place, investigate.

Once merged and green: delete the branch.
```bash
git branch -d ambrosia/<slug>
```

Clean up `.ambrosia/` if you're done with this feature:
```bash
# Optional — keep if you want the log for reference
rm -rf .ambrosia/build/
```

### Option 2 — Push and create PR

```bash
git push -u origin ambrosia/<slug>
```

Create the pull/merge request against `<base-branch>`. Use the forge's CLI if available, or the URL printed by git push. Follow the repo's PR template.

Keep the branch — PR feedback gets iterated there.

### Option 3 — Keep as-is

Report: "Keeping branch `ambrosia/<slug>`. Nothing changed."

### Option 4 — Park

Write `.ambrosia/PARKED.md`:

```markdown
# Parked Session
Parked: <ISO timestamp>
Branch: ambrosia/<slug>
Last checkpoint: <hash>

## Completed
<list completed tasks from ambrosia.log.md>

## Next
<first uncompleted task>

## Open items
<any blockers, concerns, or decisions deferred>

## To resume
Run `using-ambrosia` — this file will be detected and surfaced automatically.
```

Report: "Session parked. Run `using-ambrosia` in your next session to resume."

### Option 5 — Rollback

```
This will reset the branch to checkpoint <hash>.
All commits after that point will be lost.

Type 'rollback' to confirm.
```

Wait for the exact word `rollback`. Then:
```bash
git reset --hard <checkpoint-hash>
```

Re-run tests to confirm the reset state is clean.

---

## Completion

Append to `ambrosia.log.md` (for merge/PR):
```
<timestamp> [<session-tag>] [wrap-up] <option> — branch: ambrosia/<slug>, base: <base-branch>
```

For park: `<timestamp> [<session-tag>] [wrap-up] parked — resume via PARKED.md`
For rollback: `<timestamp> [<session-tag>] [wrap-up] rolled back to checkpoint <hash>`

---

## Common rationalizations

| Excuse | Reality |
|---|---|
| "Tests passed earlier this session" | Run on the tree you're integrating. Earlier green proves nothing about now. |
| "They obviously want it merged" | Present the menu. Integration is the user's decision. |
| "The PR is up, worktree is clutter now" | PR feedback gets fixed there. Keep it until the work lands. |
| "The base branch is obviously main" | Confirm the fork point or ask. Wrong base is expensive. |
