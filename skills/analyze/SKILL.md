---
name: analyze
description: First stage of the Ambrosia v2 Core Lifecycle. Parses intent, audits AGENTS.md, scans codebase context, formulates sensible defaults, defines success criteria, classifies complexity/risk, and produces a structured handoff into Plan. Trigger on any new task, feature request, open question, or when "analyze" is invoked.
---

# Analyze

`Analyze` is the entry point for all Ambrosia workflows. Its job is to decide **what needs to happen** and **how much process is required**. `Analyze` evaluates the goal, gathers context, resolves ambiguity, defines success, and sets up downstream stages. It never writes source code or modifies project files.

---

## Operational Workflow

Execute `Analyze` through five sequential steps:

### 1. Understand Intent, Orient & Audit AGENTS.md
- Identify core engineering goal beneath prompt.
- **Git Hygiene Sub-Step:** Check if `.ambrosia/` is ignored in `.gitignore` or `.git/info/exclude`; if not, append `.ambrosia/` to `.git/info/exclude` to ensure clean git status on external repos.
- **AGENTS.md Audit Sub-Step:**
  1. Check `.ambrosia/logs/ambrosia.log.md` for `agents.md audited` tag. If present, skip audit.
  2. Read `AGENTS.md` if present. If missing or lacking `test_command`: probe root manifests (`package.json`, `Cargo.toml`, `pyproject.toml`, `Makefile`, etc.), formulate default `test_command` and `build_command`, and present 1-turn setup summary. On confirmation, append `## Ambrosia Execution Commands` section (100% preserving existing text).
  3. Log audit status (`agents.md audited`) to `.ambrosia/logs/ambrosia.log.md`.
- If repository is unfamiliar, perform structural scan to locate entry points and key files.
- If prompt bundles multiple independent objectives, separate them and handle primary goal first.

### 2. Identify Gaps & Formulate Defaults
- Evaluate prompt clarity and scope completeness.
- For minor or moderate gaps, **formulate sensible default assumptions** rather than asking open questions.
- If critical ambiguity makes execution unsafe, present assumed defaults or ask concise, batched questions in a single pass. Wait for confirmation before handing off.

### 3. Define Success Criteria
- Explicitly answer: **"What does success look like?"**
- State concrete, verifiable target outcomes that downstream stages (`Verify`, `Finish`) will validate against.

### 4. Assess Complexity, Risk & Process Depth
Classify task complexity to determine process depth:
- **Tiny (Low Risk):** Micro-fixes, single-component tweaks. Minimal `Plan`, direct worker execution, `Verify`, `Finish`.
- **Medium (Moderate Risk):** Multi-file features, interface updates. Standard `Plan`, worker execution, optional `Review`, `Verify`, `Finish`.
- **Large (High Risk):** Multi-subsystem changes, structural refactors. Phased `Plan` (>10 task split), worker execution, mandatory `Review`, `Verify`, `Finish`. Recommend `Diverge` if architecture is open-ended.

### 5. Recommend Capability Routing
Identify event-driven capabilities needed downstream:
- **`Diverge`:** Open-ended architectural ideation or design choices exist before planning.
- **`Review`:** Medium/Large tasks, security-critical code, or runtime-correctness validation.
- **`Debug`:** Reproduced bugs or failing test suites.
- **`Checkpoint`:** Execution expected to span long-running loops or multiple sessions.

---

## Standing Rules & Invariants

1. **Orchestrator Executed:** Runs in main orchestrator context. Never edits project source files.
2. **Always Visible:** Always output `Analyze` findings before handing off.
3. **Turn-Based Approval:** If critical gaps exist, present assumed defaults and wait for user reply.
4. **Log State:** Log stage completion and complexity classification in `.ambrosia/logs/ambrosia.log.md`.

---

## Output Contract & Handoff

Produce a clear summary covering:
1. **Objective & Orientation:** Engineering goal and key relevant components.
2. **Stated Defaults:** Assumed defaults used to resolve minor gaps.
3. **Definition of Success:** Verifiable outcome required for completion.
4. **Complexity & Process Recommendation:** Task tier (`Tiny`/`Medium`/`Large`), risk level, and capability routing.

End with:
> **Next Stage:** `Plan` — proceed to create implementation strategy.
