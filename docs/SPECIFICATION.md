# Ambrosia v2 — System Specification

## 1. Overview
Ambrosia v2 is an adaptive software engineering orchestration framework for AI coding agents.

## 2. Core Principles
1. **Orchestrator Invariant:** Main chat coordinates work, manages context, and tracks state. Orchestrator NEVER edits project source files.
2. **Worker Dispatch:** All source code edits are executed by dispatched worker subagents.
3. **Core Lifecycle:** Analyze → Plan → Implement → Verify → Finish.
4. **Event-Driven Capabilities:** Checkpoint, Review, Debug, Diverge.
5. **Iron Law of Verification:** Completion claims require fresh empirical execution evidence in the current turn.
6. **Ponytail YAGNI Culture:** Deliberate simplifications are tagged inline (`// ponytail: <what> | ceiling: <limit> | upgrade: <trigger>`).

## 3. Lifecycle Stages
- `skills/analyze/SKILL.md`: Entry point for intent parsing, orientation scan, prompt scoring, defaults formulation, complexity tiering, and success definition.
- `skills/plan/SKILL.md`: Task decomposition, file boundary locking, upfront YAGNI, phase splitting (>10 tasks limit).
- `skills/implement/SKILL.md`: Task execution via worker subagents using strict TDD loops (RED → GREEN → REFACTOR).
- `skills/verify/SKILL.md`: Empirical gatekeeper requiring fresh execution logs and line-level requirement tracing.
- `skills/finish/SKILL.md`: Closeout stage. Surfaces technical debt ledgers, security credential scans, turn-based git options, and durable lesson persistence.

## 4. Event-Driven Capabilities
- `skills/checkpoint/SKILL.md`: State persistence, context snapshot, and pause/resume management.
- `skills/review/SKILL.md`: Actionable 3-vector diff review (Spec compliance, Security, Runtime correctness).
- `skills/debug/SKILL.md`: 4-phase root cause isolation workflow (Reproduce → Isolate → Diagnose → Prescribe).
- `skills/diverge/SKILL.md`: Multi-frame architectural ideation engine (2–3 solution paths).
