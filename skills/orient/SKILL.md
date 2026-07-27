---
name: orient
description: Orient yourself in an unfamiliar codebase before doing any work. Maps the structure, identifies key files, surfaces patterns and conventions, and flags fragile areas. Useful when joining an existing project, picking up an old repo, or before planning a major change. Run before audit or plan when the codebase is unfamiliar.
---

# Orient

Map the codebase before touching it. One read-through, persistent output. Saves hours of wrong assumptions.

**Three modes:**
- `orient` (default) — full repo scan, writes `.ambrosia/orient.md`
- `orient <path>` — scoped scan of one directory or module only (e.g. `orient src/auth`), appends to `.ambrosia/orient.md`
- `orient audit` (or `orient architecture`) — high-bar architectural health scan using multi-frame ideation (`diverge` cognitive lenses). Writes actionable findings to `.ambrosia/architecture.md` for direct intake by `plan`.

**Announce:** "Using the orient skill to map this codebase."

**When to use:**
- New project you've never seen
- Old repo you haven't touched in months
- Someone else's codebase
- Before a major refactor that touches many files
- After cloning without context

**When NOT to use:** if you're already deeply familiar with the codebase and just need to make a change.

---

## Pre-flight

**Read AGENTS.md first.** If it exists and is filled in well, much of orient's work is already done. Note what it covers and focus the scan on what it doesn't.

**Check for existing orientation.** If `.ambrosia/orient.md` already exists and is less than 7 days old, offer: "Orientation from <date> exists. Re-orient? (y/n)"

---

## Step 1 — Mode & Intent Check

Analyze `$ARGUMENTS` and user prompt intent:

### Option A: Architectural Audit (`orient audit`, `audit architecture`, or natural intent like *"check codebase architecture"*, *"find architectural flaws"*, *"audit this repo"*)
1. **Multi-Frame Scan (`diverge` Lenses):** Inspect the codebase across 4 cognitive frames:
   - **Regulator:** Unhandled failure modes, missing auth/input validation boundaries.
   - **Compiler:** Hidden state mutations, circular module coupling, unsafe type boundaries.
   - **Archaeologist:** Buried assumptions, legacy technical debt, brittle dependencies.
   - **Hardware/Scale:** Memory leaks, un-indexed queries, missing concurrency safeguards.
2. **High-Bar Quality Gate:** Ignore minor formatting, style, naming, or subjective nitpicks. Flag **only** high-stakes structural issues that threaten maintainability, security, or stability.
3. **Clean Pass Rule:** If zero critical/important issues are found, print:
   `Architecture Audit: PASSED (Zero structural risks found)` and **do NOT invent minor complaints**.
4. **Output:** If issues exist, write actionable finding blocks to `.ambrosia/architecture.md`.
5. **Handoff:** Report findings and prompt: *"Run `plan .ambrosia/architecture.md` to decompose these findings into executable TDD tasks."*

---

### Option B: Scoped Directory Scan (`orient <path>`, e.g. `orient src/auth`)
Set scope to that directory only. Run structural scan within the scoped directory and append a `## <path> subsystem` section to `.ambrosia/orient.md`.

---

### Option C: Full Orientation (`orient` or default)
Proceed with full structural scan below (Steps 2-4).

---

## Step 2 — Structural scan

Read the following in order, building a mental model as you go:

1. **Root level files** — `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `Makefile`, `docker-compose.yml`, `README.md`. These reveal: tech stack, entry points, build system, key scripts.

2. **Directory structure** — one level deep, then two levels for the largest directories. What are the major zones?

3. **Entry points** — `main.*`, `index.*`, `app.*`, `server.*`. How does the app start? What does it wire up?

4. **Key patterns** — pick 3-5 representative files from different parts of the codebase and read them. What patterns repeat? How is state managed? How do modules communicate?

5. **Test structure** — where are tests? What framework? What is the test coverage story?

6. **Config and environment** — `.env.example`, `config/`, environment variable usage. What does this app need to run?

---

## Step 3 — Surface findings

Write a structured orientation document to `.ambrosia/orient.md`:

```markdown
# Codebase Orientation
Generated: <ISO timestamp>

## What this is
<One paragraph: what does this application/library do?>

## Tech stack
<Language, framework, key dependencies, why each exists>

## Directory map
<tree-style layout of major zones with one-line description each>

## Entry points
<How the app starts, what gets wired up, in what order>

## Key patterns
<2-4 patterns that repeat throughout the codebase — with examples>

## State management
<How state flows through the app>

## Data layer
<Database, ORM, migrations, query patterns>

## Test setup
<Framework, test locations, how to run, approximate coverage>

## Fragile areas
<Files or subsystems that look complex, poorly tested, or frequently changed>

## What AGENTS.md doesn't cover
<Anything important missing from the existing documentation>

## Before you touch anything
<The 3-5 things a developer needs to know that aren't obvious from reading the code>
```

---

## Step 4 — Surface gaps in AGENTS.md

After writing `orient.md`, compare findings against `AGENTS.md`. If AGENTS.md exists but is missing important context:

```
AGENTS.md is missing:
  - Test command (found: npm test)
  - Key convention: all API handlers follow middleware/handler/validator pattern
  - Fragile: src/auth/session.ts has no test coverage

Add these to AGENTS.md? (y/n)
```

If AGENTS.md doesn't exist: create a minimal stub now —
  ```bash
  echo "# AGENTS.md\n# Add your test command, build command, and project constraints here." > AGENTS.md
  ```
  Then prompt: "AGENTS.md created. Fill in test/build commands before continuing."

---

## Completion

Append to `ambrosia.log.md`:
```
<timestamp> [<session-tag>] [orient] complete — orientation written to .ambrosia/orient.md
```

Report:
```
Orientation complete. Key findings:
  Stack: <stack>
  Entry: <entry point>
  Fragile: <top concern>
  Map: .ambrosia/orient.md

Ready to start work? Run `audit` with your task.
```

---

## Output Contract

**Produces:** `.ambrosia/orient.md` (full) or `.ambrosia/architecture.md` (audit mode). `ambrosia.log.md` entry appended.
**Next skill:** `audit` — pass the task description to gap-check before planning.
**Failure conditions:** No readable source files found (report and stop). AGENTS.md missing (create stub and prompt to fill).
