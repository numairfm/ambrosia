# Codebase Orientation — Ambrosia v2
Generated: 2026-07-28T16:28:10+08:00

## What this is
Ambrosia v2 is an adaptive software engineering orchestration framework for AI coding agents. It provides a context-isolated execution environment, evidence-backed verification gates, and a disciplined 5-stage core lifecycle with 4 event-driven capabilities.

## Tech stack
- **Framework Type:** Agent Skill & Workflow OS (Markdown Skill Specifications)
- **Manifest:** `plugin.json` (defines 9 skills)
- **Rules:** `AGENTS.md` (standing instructions & orchestrator invariants)
- **State Persistence:** `.ambrosia/` (`plans/`, `logs/ambrosia.log.md`, `context.md`, `lessons.md`)

## Directory map
```text
ambrosia-v2/
├── .ambrosia/                 # State Machine & Logs
│   ├── plans/                 # Saved implementation plans
│   ├── logs/
│   │   └── ambrosia.log.md    # Session log
│   ├── context.md             # Active context pointer
│   ├── orient.md              # Codebase orientation report
│   └── architecture.md        # Architectural health audit
├── skills/                    # Authoritative Skill Files
│   ├── analyze/SKILL.md       # Lifecycle Stage 1: Intent & Process
│   ├── plan/SKILL.md          # Lifecycle Stage 2: Decomposition & YAGNI
│   ├── implement/SKILL.md     # Lifecycle Stage 3: Worker TDD Execution
│   ├── verify/SKILL.md        # Lifecycle Stage 4: Empirical Gatekeeper
│   ├── finish/SKILL.md        # Lifecycle Stage 5: Debt, Safety & Delivery
│   ├── checkpoint/SKILL.md    # Capability: State Persistence & Resume
│   ├── review/SKILL.md        # Capability: 3-Vector Diff Review
│   ├── debug/SKILL.md         # Capability: 4-Phase Root Cause Diagnosis
│   └── diverge/SKILL.md       # Capability: Multi-Frame Ideation Engine
├── plugin.json                # Plugin metadata manifest
├── AGENTS.md                  # System invariants
└── README.md                  # Overview documentation
```

## Entry points
- **Primary Entry Point:** `skills/analyze/SKILL.md` — All workflows begin here.
- **Worker Execution:** `skills/implement/SKILL.md` — Internal subagent dispatch (`dispatch_worker`).

## Key patterns
1. **Strict Worker Isolation:** Orchestrator maintains state & context; Workers execute all source code edits via `dispatch_worker`.
2. **Core Question Anchoring:** Every skill file begins with a single load-bearing core question.
3. **5-Step Operational Workflows:** Every skill is structured into 5 operational steps for deterministic LLM execution.
4. **Iron Law Verification:** Verification requires fresh execution logs in the current turn.

## Before you touch anything
1. All skills are concise (64–69 lines) markdown files in `skills/<name>/SKILL.md`.
2. Never add Python or host-specific engine code to the repo — skills *are* the runtime specification.
