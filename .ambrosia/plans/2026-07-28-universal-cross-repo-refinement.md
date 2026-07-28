# Universal Cross-Repo Refinement — Implementation Plan

> **Ambrosia:** Use `implement` to execute this plan task-by-task via worker subagents.

**Goal:** Refine 5 Ambrosia v2 skill files to support language-agnostic ponytail comment syntax, adaptive TDD fallback for legacy/no-test repos, and clean git footprint via `.git/info/exclude`.
**Branch:** main
**Test Command:** wc -l skills/analyze/SKILL.md skills/plan/SKILL.md skills/implement/SKILL.md skills/verify/SKILL.md skills/finish/SKILL.md
**Build Command:** n/a (markdown specifications)

## Definition of Success (from Analyze)
- [ ] Requirement 1: `skills/plan/SKILL.md`, `skills/implement/SKILL.md`, and `skills/finish/SKILL.md` use language-native comment prefixes for ponytail tags (`<comment_prefix> ponytail: <what> | ceiling: <limit> | upgrade: <trigger>`) with polyglot comment examples (`#`, `--`, `//`, `<!-- -->`).
- [ ] Requirement 2: `skills/implement/SKILL.md` and `skills/verify/SKILL.md` define an adaptive TDD protocol (strict TDD when test suite exists; empirical build/linter/terminal log assertions when no test suite exists or for non-code tasks).
- [ ] Requirement 3: `skills/analyze/SKILL.md` and `skills/finish/SKILL.md` enforce clean git hygiene by checking if `.ambrosia/` is in `.gitignore` or appending `.ambrosia/` to `.git/info/exclude`.
- [ ] Requirement 4: Every updated `SKILL.md` file is strictly ≤ 70 lines in length.

## Global Constraints & YAGNI Tags
- Strictly maintain all 5-step operational structures and frontmatter formats.
- Keep line counts ≤ 70 lines per skill file.

---

### Task 1: Refine skills/analyze/SKILL.md for Clean Git Footprint & Line Count (≤ 70 lines)
**Parallel-safety:** parallel-safe
**Files:**
- Modify: `skills/analyze/SKILL.md`

**Interfaces:**
- Consumes: User request & repository orientation rules.
- Produces: Updated `skills/analyze/SKILL.md` specifying `.git/info/exclude` check for `.ambrosia/`.

- [ ] Step 1: Add `.ambrosia/` git hygiene check (append `.ambrosia/` to `.git/info/exclude` if not gitignored) in Step 1.
- [ ] Step 2: Trim redundant blank lines or verbose phrasing to ensure total line count is strictly ≤ 70 lines.
- [ ] Step 3: Confirm file line count ≤ 70 lines.

---

### Task 2: Refine skills/plan/SKILL.md for Language-Agnostic Ponytail Comment Syntax
**Parallel-safety:** parallel-safe
**Files:**
- Modify: `skills/plan/SKILL.md`

**Interfaces:**
- Consumes: Task decomposition rules.
- Produces: Updated `skills/plan/SKILL.md` specifying language-native comment prefixes for ponytail tags.

- [ ] Step 1: Update Step 2 ponytail tag format to `<comment_prefix> ponytail: <what was simplified> | ceiling: <limit> | upgrade: <trigger>`.
- [ ] Step 2: Include multi-language comment examples (`#` Python/Bash/YAML, `--` SQL, `//` JS/TS/Go/Rust, `<!-- -->` HTML).
- [ ] Step 3: Confirm file line count ≤ 70 lines.

---

### Task 3: Refine skills/implement/SKILL.md for Language-Agnostic Ponytail Syntax & Adaptive TDD Fallback
**Parallel-safety:** parallel-safe
**Files:**
- Modify: `skills/implement/SKILL.md`

**Interfaces:**
- Consumes: Worker execution rules & ponytail specs from Task 2.
- Produces: Updated `skills/implement/SKILL.md` with adaptive TDD fallback and polyglot ponytail tags.

- [ ] Step 1: Update Step 3 (TDD) to specify: strict RED -> GREEN -> REFACTOR if automated test suite exists; fall back to empirical build assertions, linters, or log outputs if no test suite exists or for non-code tasks (CSS/HTML/docs/config).
- [ ] Step 2: Update Step 3 REFACTOR phase ponytail tag syntax to `<comment_prefix> ponytail: ...` with multi-language comment examples.
- [ ] Step 3: Confirm file line count ≤ 70 lines.

---

### Task 4: Refine skills/verify/SKILL.md for Adaptive Verification Protocol
**Parallel-safety:** parallel-safe
**Files:**
- Modify: `skills/verify/SKILL.md`

**Interfaces:**
- Consumes: Execution outputs from Task 3.
- Produces: Updated `skills/verify/SKILL.md` defining verification for both test-suite and no-test-suite environments.

- [ ] Step 1: Update Step 2 & Standing Rules to handle both test-suite projects (running test suite) and non-test-suite / non-code projects (running build commands, linters, or terminal exit codes).
- [ ] Step 2: Preserve Iron Law of Verification (fresh empirical execution evidence in current turn).
- [ ] Step 3: Confirm file line count ≤ 70 lines.

---

### Task 5: Refine skills/finish/SKILL.md for Polyglot Ponytail Scanning & Git Safety
**Parallel-safety:** parallel-safe
**Files:**
- Modify: `skills/finish/SKILL.md`

**Interfaces:**
- Consumes: Ponytail ledger & git status.
- Produces: Updated `skills/finish/SKILL.md` scanning language-agnostic ponytail tags and verifying `.ambrosia/` git exclude safety.

- [ ] Step 1: Update Step 2 to scan all modified files for `<comment_prefix> ponytail:` tags regardless of programming language.
- [ ] Step 2: Add check in Step 4 verifying `.ambrosia/` is excluded from git tracking before git status presentation.
- [ ] Step 3: Confirm file line count ≤ 70 lines.
