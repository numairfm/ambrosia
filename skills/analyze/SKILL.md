---
name: analyze
description: First stage of the Ambrosia v2 Core Lifecycle. Parses intent, audits AGENTS.md, scans codebase context, formulates sensible defaults, defines success criteria, classifies complexity/risk, and produces a structured handoff into Plan. Trigger on any new task, feature request, open question, or when "analyze" is invoked.
---

# Analyze

`Analyze` is the entry point for all Ambrosia workflows. Its job is to decide **what needs to happen** and **how much process is required**. 

`Analyze` evaluates the goal, gathers context, resolves ambiguity, defines success, and sets up downstream stages. It never writes source code or modifies project files.

---

## Operational Workflow

Execute `Analyze` through five sequential steps:

### 1. Understand Intent, Orient & Audit AGENTS.md
- Identify core engineering goal beneath prompt.
- **AGENTS.md Audit Sub-Step:**
  1. Check `.ambrosia/logs/ambrosia.log.md` for `agents.md audited` tag. If present, skip audit.
  2. Read `AGENTS.md` if present. If missing or lacking `test_command`:
     - Probe root manifests (`package.json`, `Cargo.toml`, `pyproject.toml`, `Makefile`, etc.).
     - Formulate default `test_command` and `build_command`.
     - Present 1-turn setup summary: `"AGENTS.md missing test_command. Append defaults? [Y/n]"`
     - On confirmation (or auto-default on proceed): Append `## Ambrosia Execution Commands` section to bottom (100% preserving existing text).
  3. Log audit status (`agents.md audited`) to `.ambrosia/logs/ambrosia.log.md`.
- If the repository or subsystem is unfamiliar, perform a lightweight structural scan to locate entry points, conventions, and relevant files.
- If the request bundles multiple independent objectives, separate them and recommend handling the primary goal first.

### 2. Identify Gaps & Formulate Defaults
- Evaluate prompt clarity and scope completeness.
- For minor or moderate gaps, **formulate sensible default assumptions** rather than asking open questions.
- If critical ambiguity makes execution unsafe, present assumed defaults or ask concise, batched questions in a single pass. Wait for confirmation before handing off.

### 3. Define Success Criteria
- Explicitly answer: **"What does success look like?"**
- State the concrete, verifiable target outcome that downstream stages (`Verify`, `Finish`) will test and validate against.

### 4. Assess Complexity, Risk & Process Depth
Classify the task to determine the required process depth:

- **Tiny (Low Risk):** Micro-fixes, simple adjustments, single-component tweaks. Use minimal `Plan`, direct worker execution, `Verify`, and `Finish`.
- **Medium (Moderate Risk):** Multi-file features, interface updates, non-trivial logic changes. Use standard `Plan`, worker execution, optional `Review`, `Verify`, and `Finish`.
- **Large (High Risk):** Multi-subsystem changes, structural refactors, open architectural choices. Require phased `Plan` (>10 task split), worker execution, mandatory `Review`, `Verify`, and `Finish`. Recommend `Diverge` if architecture is open-ended.

### 5. Recommend Capability Routing
Identify event-driven capabilities needed downstream:
- **`Diverge`:** If open-ended architectural ideation or design choices exist before planning.
- **`Review`:** If task is Medium/Large, security-critical, or requires runtime-correctness validation.
- **`Debug`:** If the prompt describes a reproduced bug or failing test suite.
- **`Checkpoint`:** If execution is expected to span long-running loops or multiple sessions.

---

## Standing Rules & Invariants

1. **Orchestrator Executed:** Runs in the main orchestrator context. Never edits project source files.
2. **Always Visible:** Always output `Analyze` findings (even a fast-path summary) before handing off.
3. **Turn-Based Approval:** If critical gaps exist or defaults need validation, present assumed defaults and wait for user reply.
4. **Log State:** Log stage completion and complexity classification in project log file (`.ambrosia/logs/ambrosia.log.md`).

---

## Output Contract & Handoff

Produce a clear, conversational summary covering:

1. **Objective & Orientation:** The engineering goal and key relevant components.
2. **Stated Defaults:** Any assumed defaults used to resolve minor gaps.
3. **Definition of Success:** The verifiable outcome required for completion.
4. **Complexity & Process Recommendation:** Task tier (`Tiny`/`Medium`/`Large`), risk level, and recommended capability routing.

End with:
> **Next Stage:** `Plan` — proceed to create implementation strategy.
