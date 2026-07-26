---
name: debt
description: "Harvest ponytail comments into a tracked debt ledger. Finds every deliberate simplification marked with a ponytail: comment, reports what was deferred, names what has no upgrade trigger. Report only — changes nothing. Use when you want to see accumulated technical debt from deliberate shortcuts."
---

# Debt

Surface every deliberate simplification that was marked with a `ponytail:` comment. Make deferrals visible so they don't rot into "later means never."

**Report only. This skill changes nothing.**

---

## Step 1 — Harvest

Grep the full repository for ponytail comment markers:

```bash
grep -rnE '(#|//|--|<!--|;) ?ponytail:' . \
  --include="*.js" --include="*.ts" --include="*.py" \
  --include="*.rs" --include="*.go" --include="*.rb" \
  --include="*.java" --include="*.swift" --include="*.kt" \
  --include="*.css" --include="*.html" --include="*.md" \
  | grep -v node_modules | grep -v ".git" | grep -v "build/" \
  | grep -v "dist/" | grep -v "target/"
```

Also check for common variations: `ponytail:`, `// ponytail:`, `# ponytail:`.

---

## Step 2 — Format the ledger

Group by file. For each marker:

```
<file>:<line> — <what was simplified>
  ceiling: <the limit named in the comment>
  upgrade: <the trigger to revisit>
  status: [no-trigger] if no upgrade trigger is named
```

End with:
```
Total markers: <N>
No-trigger (will rot silently): <M>
```

If no markers found:
```
No ponytail: debt. Clean ledger.
```

---

## Step 3 — Flag no-trigger items

Any marker that names no upgrade path or trigger condition is tagged `no-trigger`. These are the ones that rot silently — they were deferred with no criteria for when to revisit.

Highlight no-trigger items separately:
```
⚠️ No-trigger items (need an upgrade condition added):
  <file>:<line> — <description>
```

---

## When to use

- Run explicitly any time you want to audit accumulated debt
- `wrap-up` automatically runs `debt` before presenting the branch completion menu
- Recommended: run `debt` at the start of a new feature that touches an area with known shortcuts

---

## Completion

Append to `ambrosia.log.md`:
```
<timestamp> [debt] <N> markers found, <M> no-trigger
```
