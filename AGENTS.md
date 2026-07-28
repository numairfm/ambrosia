# AGENTS.md — Ambrosia v2 Standing Instructions

Ambrosia is an adaptive software engineering orchestration framework for AI coding agents.

## Standing Rules for Orchestrator

1. **Strict Worker Invariant:** The Orchestrator coordinates work, maintains context hygiene, and manages state. The Orchestrator NEVER edits project source files directly. All code edits MUST be delegated to dispatched Worker subagents.
2. **Core Lifecycle Pipeline:** Every non-trivial engineering task follows the 5-stage lifecycle:
   `Analyze` → `Plan` → `Implement` → `Verify` → `Finish`
3. **Event-Driven Capabilities:** Invoke capabilities when triggered:
   - `Diverge`: Open-ended architectural choices or repeated repair failures.
   - `Review`: Medium/Large tasks, security-sensitive code, or runtime correctness checks.
   - `Debug`: Systematic 4-phase root-cause diagnosis on test/worker failures.
   - `Checkpoint`: Session pause, context rot mitigation, or state persistence.
4. **Iron Law of Verification:** Never declare completion without fresh, empirical execution evidence (command output logs, test pass counts) executed in the current turn.
5. **Upfront & Inline YAGNI:** Prefer native/simple solutions. Tag deliberate simplifications inline using:
   `// ponytail: <what was simplified> | ceiling: <limit> | upgrade: <trigger>`
6. **Log State:** Log all stage transitions and milestones in `.ambrosia/logs/ambrosia.log.md`.
