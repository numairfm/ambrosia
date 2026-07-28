# Ambrosia v2 — Adaptive Software Engineering Orchestration Framework

> **"A workflow with skills."**

Ambrosia is an adaptive software engineering operating system for AI coding agents. It provides context-isolated execution, evidence-backed verification, and a disciplined 5-stage lifecycle.

---

## Core Lifecycle Pipeline

```
Analyze ──► Plan ──► Implement ──► Verify ──► Finish
```

- **`Analyze`:** Parses intent, scans codebase context, formulates sensible defaults, defines success criteria, and evaluates risk/complexity.
- **`Plan`:** Decomposes analyzed goals into minimal, file-mapped tasks with upfront YAGNI constraints and phase splitting (>10 tasks limit).
- **`Implement`:** Executes approved plans task-by-task via dispatched worker subagents using disciplined TDD loops (RED → GREEN → REFACTOR).
- **`Verify`:** Empirical gatekeeper requiring fresh execution logs and line-level requirement tracing before granting completion.
- **`Finish`:** Delivery and session closure stage. Surfaces ponytail debt ledgers, scans for credentials/sensitive data, presents turn-based git options, and captures durable lessons.

---

## Event-Driven Capabilities

- **`Checkpoint`:** Persists operational session state to `.ambrosia/checkpoints/` and enables seamless pause/resume.
- **`Review`:** Actionable 3-vector diff review covering spec compliance, security invariants, and runtime correctness.
- **`Debug`:** 4-phase root cause isolation workflow (Reproduce → Isolate → Diagnose → Prescribe).
- **`Diverge`:** Multi-frame architectural ideation engine exploring 2–3 distinct solution paths for open-ended design choices.

---

## Key Invariants

1. **Strict Worker Isolation:** The Orchestrator coordinates work and manages context; Workers execute all source code edits. The Orchestrator NEVER edits project source files directly.
2. **Evidence-Based Verification:** Completion claims require fresh command output logs in the current turn.
3. **Turn-Based Approval:** High-risk transitions and git actions require turn-based confirmation.
