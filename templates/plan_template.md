# <Feature Name> — Implementation Plan

> **Ambrosia:** Use `implement` to execute this plan task-by-task via worker subagents.

**Goal:** [One sentence description of the actual engineering outcome]
**Branch:** ambrosia/<slug>
**Test Command:** [Detected or specified test command]
**Build Command:** [Detected or specified build command]

## Definition of Success (from Analyze)
- [ ] Requirement 1: [Verifiable outcome]
- [ ] Requirement 2: [Verifiable outcome]

## Global Constraints & YAGNI Tags
- [Project constraints from AGENTS.md]
- Upfront YAGNI simplifications: `// ponytail: <what> | ceiling: <limit> | upgrade: <trigger>`

---

### Task 1: <Component / Subsystem Name>
**Parallel-safety:** [parallel-safe | sequential: depends on Task N]
**Files:**
- Create: `exact/path/to/file`
- Modify: `exact/path/to/existing:L123-145`
- Test: `tests/exact/path/to/test`

**Interfaces:**
- Consumes: [exact signatures / types from prior tasks or system]
- Produces: [exact function names, types, parameters — what later tasks rely on]

- [ ] Step 1: Write failing test assertion (RED)
- [ ] Step 2: Run test — confirm FAIL with expected error
- [ ] Step 3: Write minimal implementation (GREEN) & tag ponytail shortcuts if any
- [ ] Step 4: Run test — confirm PASS
- [ ] Step 5: Log task completion ping
