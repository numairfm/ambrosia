---
name: trim
description: Audit code for over-engineering and cut what doesn't need to exist. Two modes: diff (current changes only) and full (entire repo). Hard two-step gate — reports first, cuts only on explicit confirmation. Ponytail-based. Use after verify, or any time you want to cut dead weight.
---

# Trim

Cut what doesn't need to exist. YAGNI ruthlessly. This skill is a reporter first and a cutter second — it never modifies files without explicit confirmation.

**Two modes:**
- **Diff mode** (default): reviews current changes since branch start — `git diff main...HEAD`
- **Full mode**: scans the entire repository tree — invoke with `trim --full`

---

## Pre-flight

**Prerequisite check.** Read `ambrosia.log.md`. If no `[build]` entry exists AND `--force` was not passed:
```
No build found to trim. Run `build` first, or pass --force to trim against the current working tree.
```

**Empty diff check.** If diff mode is selected and `git diff main...HEAD` returns empty output, report:
```
No changes to trim — working tree matches main.
```
And stop.

---

## Step 1 — Scan (report only, change nothing)

Run the appropriate scan:

**Diff mode:**
```bash
git diff main...HEAD
```
Or if on `ambrosia/<branch>`: `git diff main...ambrosia/<branch>`

**Full mode:**
Scan the full repository tree. Skip: `node_modules/`, `.git/`, `build/`, `dist/`, `target/`, `.ambrosia/`.

For each finding, classify with a tag:

| Tag | Meaning |
|---|---|
| `delete` | Dead code, unreachable code, speculative feature never used |
| `stdlib` | Reinvented something the standard library provides |
| `native` | Added a dependency to do what the platform already does natively |
| `yagni` | Abstraction, interface, or base class with only one implementation |
| `shrink` | Same logic expressible in significantly fewer lines |

---

## Step 2 — Output the cut list

**REPORT ONLY. Change nothing yet.**

Format — one line per finding, ranked by estimated impact (biggest cut first):

```
<tag>  <what to cut>. <replacement or reason>. [path:line]
```

End with:
```
Net removable: ~<N> lines, <M> dependencies
```

If nothing to cut:
```
Lean already. Nothing to cut.
```

---

## Step 3 — Hard confirmation gate

**This is an iron law. Do not skip.**

After outputting the cut list, stop completely and wait.

Present:
```
Review the cut list above.

To apply all cuts:     type `confirm all`
To apply specific cuts: type `confirm 1,3,5` (by line number)
To skip:               type `skip` or just continue with something else

Making no changes until you confirm.
```

**Do NOT apply any cuts until the exact confirmation is received.**
**Do NOT interpret "yeah looks good" or "go ahead" as confirmation — require the explicit word `confirm`.**

---

## Step 4 — Apply confirmed cuts

For each confirmed cut:
1. Apply the change
2. Run the full test suite to confirm nothing broke
3. If a test breaks: stop, report which test and which cut caused it, ask whether to revert that cut or fix the test

Commit confirmed cuts together:
```bash
git commit -m "ambrosia(trim): remove over-engineering — <N> cuts"
```

---

## Completion

Append to `ambrosia.log.md`:
```
<timestamp> [trim] <mode> — <N> findings, <M> confirmed cuts, ~<K> lines removed
```

Note any findings that were reviewed but not cut — they may be worth revisiting later.
