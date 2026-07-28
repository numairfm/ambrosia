# Ambrosia v2 (Phase 1: Core Lifecycle Pipeline) — Implementation Plan

> **Ambrosia:** Use `build` to execute this plan task-by-task.

**Goal:** Implement the Core Lifecycle Pipeline of Ambrosia v2 (Analyze → Plan → Implement → Verify → Finish) as clean, authoritative skill specification files with zero unnecessary Python runtime code.
**Branch:** ambrosia/v2-pipeline
**Test command:** markdownlint skills/**/*.md || true
**Build command:** echo "Skills validated"

## Global Constraints
- Ambrosia v2 is a workflow with skills — the skills are the specification files (`skills/<skill-name>/SKILL.md`).
- Zero Python runtime code (`src/` removed).
- No `handoff/SKILL.md` — Handoff is an internal orchestrator dispatch mechanism (`dispatch_worker`).
- No `orient/SKILL.md` — `Analyze` owns codebase scanning and orientation.
- Strict Worker Invariant: The Orchestrator NEVER edits project source files. All code edits are delegated to Worker subagents via internal dispatch.
- Zero placeholders (`TBD`, `TODO`, `similar to Task N`) in plan tasks.
- Ponytail tagging protocol (`// ponytail: <what> | ceiling: <limit> | upgrade: <trigger>`) enforced in Plan, Implement, and Finish.

---

### Task 1: Core Lifecycle Stage 1 (`Analyze`)
**Parallel-safety:** parallel-safe
**Files:**
- Create: `skills/analyze/SKILL.md`

**Interfaces:**
- Consumes: User raw prompt / goal
- Produces: Refined prompt, quality score (0-10), defaults formulation, risk/complexity tiering, codebase orientation brief, and `Diverge` recommendation if warranted.

- [ ] Step 1: Draft `skills/analyze/SKILL.md` specifying:
  - Pre-flight quality check (0-10 scoring)
  - Codebase scanning & orientation (absorbing `orient`)
  - Hole identification & sensible default formulation
  - Complexity tiering (Tiny / Medium / Large)
  - Process selection & `Diverge` routing
- [ ] Step 2: Verify `skills/analyze/SKILL.md` contains all 6 responsibilities without placeholders.
- [ ] Step 3: Commit: `ambrosia(task-1): implement Analyze skill specification`

---

### Task 2: Core Lifecycle Stage 2 (`Plan`)
**Parallel-safety:** sequential: depends on Task 1
**Files:**
- Create: `skills/plan/SKILL.md`

**Interfaces:**
- Consumes: Refined prompt & defaults from `Analyze`
- Produces: `.ambrosia/plans/<date>-<slug>.md` with file mapping, parallel safety, TDD steps, and >10 task phase splitting.

- [ ] Step 1: Draft `skills/plan/SKILL.md` specifying:
  - Architecture sketch turn-based gate
  - Upfront YAGNI ponytail constraint application
  - Strict file-locking before task writing
  - Parallel-safety tagging per task
  - Phase splitting threshold (>10 tasks -> Phase 1 / Phase 2)
  - Approval gate (optimistic for ≤5 tasks, strict for >5 tasks)
- [ ] Step 2: Verify `skills/plan/SKILL.md` format contracts.
- [ ] Step 3: Commit: `ambrosia(task-2): implement Plan skill specification`

---

### Task 3: Core Lifecycle Stage 3 (`Implement`)
**Parallel-safety:** sequential: depends on Task 2
**Files:**
- Create: `skills/implement/SKILL.md`

**Interfaces:**
- Consumes: Approved plan from `Plan`
- Produces: Implementation evidence, TDD loop logs, ponytail debt tags (`// ponytail:`), and worker dispatch logs.

- [ ] Step 1: Draft `skills/implement/SKILL.md` specifying:
  - Strict Worker Invariant (Orchestrator never edits project files; dispatches via internal `dispatch_worker`)
  - Strict TDD loop (RED → GREEN → REFACTOR)
  - Model tier soft hint & session lock visibility notice
  - Fix-loop round limit & escalation protocol
  - Inline ponytail debt tagging
- [ ] Step 2: Verify `skills/implement/SKILL.md` TDD and worker isolation rules.
- [ ] Step 3: Commit: `ambrosia(task-3): implement Implement skill specification`

---

### Task 4: Core Lifecycle Stage 4 (`Verify`)
**Parallel-safety:** sequential: depends on Task 3
**Files:**
- Create: `skills/verify/SKILL.md`

**Interfaces:**
- Consumes: Worker implementation output & optional `Review` findings
- Produces: Verification report, file:line requirement tracing, test suite run evidence, or routing to `Debug`.

- [ ] Step 1: Draft `skills/verify/SKILL.md` specifying:
  - Iron law: No completion claims without fresh evidence in the same message
  - Full test suite run execution
  - Line-level requirement verification against plan
  - Verification of `Review` findings (final gatekeeper before Finish)
  - Debug routing on verification failure
- [ ] Step 2: Verify `skills/verify/SKILL.md` evidence rules.
- [ ] Step 3: Commit: `ambrosia(task-4): implement Verify skill specification`

---

### Task 5: Core Lifecycle Stage 5 (`Finish`)
**Parallel-safety:** sequential: depends on Task 4
**Files:**
- Create: `skills/finish/SKILL.md`

**Interfaces:**
- Consumes: Verified implementation from `Verify`
- Produces: Project summary, auto-surfaced ponytail debt ledger, sensitive-data grep scan, git/PR integration options, and durable lesson capture (`.ambrosia/lessons.md`).

- [ ] Step 1: Draft `skills/finish/SKILL.md` specifying the 4 clear phases:
  - Phase 1: Summarize & verify final clean test run
  - Phase 2: Auto-surface ponytail debt ledger & optional final diff trim sweep
  - Phase 3: Sensitive data grep scan & Git/PR integration options (merge / PR / keep / park / rollback)
  - Phase 4: Durable lesson capture into `.ambrosia/lessons.md`
- [ ] Step 2: Verify `skills/finish/SKILL.md` 4-phase closeout workflow.
- [ ] Step 3: Commit: `ambrosia(task-5): implement Finish skill specification`
