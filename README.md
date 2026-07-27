# Ambrosia

**Ambrosia is an opinionated software engineering operating system for AI coding agents.**

Instead of relying on increasingly long prompts, Ambrosia decomposes work into isolated worker subagents, enforces evidence-based verification, and eliminates context rot through a structured execution pipeline. It is not a prompt pack. It is not a collection of utilities. It is a mental model for how AI agents should engineer software.

Ambrosia operates natively in **Antigravity**, **Claude Code**, **OpenCode**, **Cursor**, **Gemini CLI**, **Codex**, and any environment supporting `SKILL.md` configurations.

---

## The Seven Principles

1. **Context is finite.** Treat every token as a resource. Isolate workers. Compress coordinators. Never let context rot destroy a long session.

2. **Plans outlive prompts.** A prompt disappears when the chat ends. A file-mapped plan with explicit interfaces and test contracts survives sessions, agents, and reboots.

3. **Evidence beats confidence.** No completion claim is valid without fresh test output. "It should work" is not verification.

4. **Parallelize thought, not edits.** Run cognitive frames in parallel during design. Serialize file changes to avoid conflicts. Think wide, write narrow.

5. **Small workers, strong coordinator.** The coordinator orchestrates and integrates. Workers implement and commit. The coordinator never touches source files directly.

6. **Delete aggressively.** Abstractions, dependencies, and dead code all have carrying costs. Remove anything that does not exist to serve a current, verified requirement.

7. **Leave the repository healthier than you found it.** Every session should end with cleaner code, clearer documentation, and fewer open questions than it started with.

---

## Quick Start

### Installation

```bash
# Antigravity CLI
agy plugin install https://github.com/numairfm/ambrosia

# Claude Code
/plugin install numairfm/ambrosia

# Gemini CLI
gemini extensions install https://github.com/numairfm/ambrosia

# OpenCode.ai (add to opencode.json)
{ "plugin": ["ambrosia@git+https://github.com/numairfm/ambrosia.git"] }

# Cursor / Codex / Copilot CLI
/add-plugin https://github.com/numairfm/ambrosia
```

### High-Autonomy Execution (`ship`)

To execute a feature end-to-end through the full pipeline with minimal manual intervention:

```bash
ship "Add Redis rate limiting middleware with unit tests"
```

The `ship` skill automatically executes:
1. `audit` — Gap-checks the prompt and formulates default assumptions.
2. `plan` — Decomposes the task into RED -> GREEN -> REFACTOR subtasks.
3. `build` — Dispatches worker subagents to write failing tests, pass them, and submit to an independent reviewer subagent.
4. `review` — Independent diff review before verification. Catches spec deviations, security holes, and over-engineering.
5. `verify` — Runs the complete test suite and verifies line-by-line implementation against the plan.
6. `deliver` — Presents final integration choices (merge, pull request, park, or rollback).

---

## Pipeline Architecture

The execution pipeline follows a strict, sequential flow supported by standalone tools and system primitives:

```mermaid
flowchart TD
    A["orient<br>Codebase Map & Arch Check"] --> B["audit<br>Prompt Gap-Check"]
    B --> C["plan<br>File-Mapped TDD Decomposition"]
    C --> D["build<br>Subagent TDD Execution"]
    D --> R["review<br>Independent Diff Review"]
    R --> E["verify<br>Empirical Test Verification"]
    E -->|Pass| F["deliver<br>Merge / PR / Park / Rollback"]
    E -->|Fail| G["debug<br>Auto-Triage & Isolation"]
    G --> D

    subgraph Autonomous Acceleration
        H["ship<br>Full Pipeline Execution"] -.-> A
    end

    subgraph Session & Ideation Tools
        I["context<br>Session Compression"]
        J["diverge<br>Multi-Frame Ideation"]
        K["trim<br>Over-Engineering Audit"]
        L["debt<br>Harvest ponytail: Debt"]
        N["reflect<br>Post-Delivery Reflection"]
    end

    subgraph Concurrency System
        M["handoff<br>Same-Turn Subagent Dispatch"]
    end
    D <--> M
    G <--> M
```

---

## Comparison with Existing Frameworks

| Feature / Metric | Superpowers | GSD (Get Shit Done) | GStack | Ambrosia |
|---|---|---|---|---|
| **Primary Focus** | TDD & Plan Discipline | Context Rot & Memory Files | Role-Based Persona Gearing | Unified SDLC & Parallel Execution |
| **Execution Model** | Single Agent | Sub-agent Waves | Persona Framing | Isolated Worker Subagents + Coordinator |
| **Parallel Dispatch** | No | Partial | No | Yes (Same-turn `handoff` primitive) |
| **Exploratory Ideation** | No | No | No | Yes (Multi-frame `diverge` matrix) |
| **YAGNI / Debt Audit** | No | No | No | Yes (`trim` engine & `debt` ledger) |
| **State Persistence** | Transient | Markdown Specs | Terminal State | Portable `.ambrosia/ambrosia.log.md` |
| **Natural Language Routing** | CLI Flags | Command Files | Slash Commands | Natural Intent & Semantic Matching |
| **Post-Verify Reflection** | No | No | No | Yes (`reflect` skill) |

---

## Skill Reference (16 Skills)

### Spine (Pipeline Execution)
* **`plan`**: Decomposes tasks into atomic RED -> GREEN -> REFACTOR implementation tasks with exact file locations and interface definitions.
* **`build`**: Executes plans using isolated subagents. Enforces strict TDD and dispatches an independent reviewer subagent for every task.
* **`review`**: First-class pipeline stage. Independent diff review after build, before verify. Checks spec compliance, security, correctness, and over-engineering.
* **`verify`**: Enforces the empirical verification rule. Runs the test suite and verifies each plan requirement at a specific `file:line`.
* **`deliver`**: Handles branch integration. Runs tests, checks technical debt, prompts for YAGNI trimming, scans for sensitive tokens, and presents local merge, pull request, park, or rollback options.

### Tools
* **`orient`**: Scans and maps codebases. Supports `orient` (full map to `.ambrosia/orient.md`), `orient <path>` (scoped module scan), and `orient audit` (high-bar architectural audit to `.ambrosia/architecture.md`).
* **`audit`**: Interrogates raw prompts, rates clarity, formulates default assumptions for minor gaps, and tags parallel-safe tasks.
* **`debug`**: 4-phase root-cause debugging engine (Reproduce -> Isolate -> Hypothesize -> Fix). Includes automatic failure triage when invoked without a stack trace.
* **`diverge`**: Multi-frame ideation tool. Runs isolated cognitive frames (*Regulator*, *Compiler*, *Archaeologist*, *Hardware*) in parallel to evaluate complex architectural decisions without anchoring bias.
* **`trim`**: YAGNI auditor. Identifies dead code, reinvented standard library routines, and unnecessary abstractions. Hard two-step gate: reports findings first, applies cuts only on explicit approval.
* **`debt`**: Greps repository for `// ponytail: <what> | ceiling: <limit> | upgrade: <trigger>` comments and outputs a tracked technical debt ledger.
* **`context`**: Session compression tool. Writes current status, completed tasks, and blockers to `.ambrosia/context.md` and generates a clean resume prompt for switching context windows.
* **`reflect`**: Post-delivery reflection skill. Distills durable lessons, reusable patterns, and tracked technical debt into a 3-pillar summary.

### Meta & System
* **`using-ambrosia`**: Suite introduction, orientation, and standing behavioral orders.
* **`ship`**: Full pipeline accelerator. Executes `audit -> plan -> build -> review -> verify -> deliver` in one continuous session.
* **`handoff`**: System-level concurrency primitive. Dispatches multiple subagents in the same response turn for true parallel execution.

---

## Core Invariants

1. **Coordinator Invariant:** The main coordinator session never edits source files directly during `build`. All modifications must be made by worker subagents.
2. **Verification Invariant:** No completion claims are valid without fresh test execution output showing zero failures.
3. **Root Cause Invariant:** Fixes must be preceded by an explicit hypothesis and data flow isolation in `debug`.
4. **YAGNI Invariant:** Platform primitives and standard library functions must be preferred over new abstractions or dependencies.

---

## Lineage and Conceptual Sources

Ambrosia is a synthesis of concepts from several open-source agent frameworks:

* **[obra/superpowers](https://github.com/obra/superpowers):** Provides the core methodology backbone — strict TDD discipline (RED -> GREEN -> REFACTOR), task-level subagent isolation, file-mapped implementation plans, and independent review gates.
* **[uditakhourii/adhd](https://github.com/uditakhourii/adhd):** Provides the foundation for the `diverge` skill. It uses isolated cognitive frames (*Hardware*, *Compiler*, *Regulator*, *Archaeologist*) running in parallel to prevent anchoring bias during design decisions.
* **[open-gsd/gsd-core](https://github.com/open-gsd/gsd-core):** Provides the context-rot defense model. Inspires Ambrosia's `.ambrosia/` workspace directory, coordinator context compression, append-only log spine (`ambrosia.log.md`), and session resume snapshots (`context`).
* **[mattpocock/skills](https://github.com/mattpocock/skills):** Inspires the skill configuration standard (`SKILL.md`), parameter passing conventions, and clear separation between model-invoked primitives (`handoff`) and user-facing tools.
* **[safishamsi/ponytail](https://github.com/safishamsi/ponytail):** Provides the YAGNI auditing principles used by `trim` and `debt`, introducing the structured `// ponytail:` comment format for tracking deliberate technical debt.

---

## License

[MIT License](LICENSE)
