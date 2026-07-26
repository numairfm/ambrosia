---
name: using-ambrosia
description: Ambrosia suite introduction, orientation, and session bootstrap. Read this to understand what skills exist, when to use each, and how they connect. Also activates standing behavioral orders for the session.
---

# Ambrosia

A self-contained, high-performance AI coding skill suite. Built for context-rot resistance, maximum execution speed, and token efficiency.

**Core Guarantees:**
- Context rot resistance (fresh-context subagents + append-only `ambrosia.log.md`)
- Real parallelism (same-turn concurrent subagent dispatch)
- YAGNI by default (ponytail-style leanness built into every phase)
- Harness-agnostic (Antigravity, Claude Code, OpenCode, Codex, Cursor, etc.)

---

## Skill Index

| Skill | Type | Trigger / Purpose |
|---|---|---|
| `orient` | Tool | Map codebase architecture, conventions, and entry points |
| `audit` | Tool | Refine and gap-check raw task prompts before planning |
| `plan` | Spine | Decompose audited tasks into concrete, file-mapped implementation plans |
| `build` | Spine | Execute plans via TDD using fresh, isolated subagents |
| `verify` | Spine | Confirm work completion with empirical evidence (tests + diff) |
| `debug` | Tool | Systematic, hypothesis-driven bug fixing |
| `diverge` | Tool | Multi-frame design, naming, and architectural ideation |
| `review` | Tool | Standalone code review on diffs |
| `trim` | Tool | Audit & strip over-engineering from diffs or whole repo |
| `debt` | Tool | Harvest and track `// ponytail:` technical debt markers |
| `wrap-up` | Spine | Close out branch cleanly (merge, PR, park, or rollback) |
| `handoff` | System | Concurrent subagent dispatch mechanism (model-invoked) |

**Standard Pipeline:** `[orient] → audit → plan → build → verify → [debug] → [trim] → wrap-up`

**Direct Execution:** Questions, single-file bugfixes, or small edits bypass the pipeline and run directly.

---

## Standing Behavioral Orders

Active for all sessions once Ambrosia is loaded:

1. **AGENTS.md First:** Read `AGENTS.md` at root if present. Project rules override defaults.
2. **ADHD Structure:** Direct decisions first. Use header anchors (`###`), scannable bullet points, and trade-off tables. Zero fluff.
3. **Lite-Diverge:** Silently evaluate 3 alternatives internally before answering open-ended design/architecture questions. Surface only the top choice unless asked.
4. **Ponytail Leanness (YAGNI):** Prefer native stdlib/platform solutions over new abstractions. Tag deliberate shortcuts with `// ponytail: <what was simplified> | ceiling: <limit> | upgrade: <trigger>`.
5. **Web Search Grounding:** Verify external API/library assumptions before building. Mark unverified claims as `[UNVERIFIED]`.
6. **Fast-Path Routing:** Mode check before executing:
   - **Question/Lookup** → Answer directly
   - **Small Single-File Task** → Fix directly + test
   - **Multi-Step Goal/Feature** → Pipeline (`audit` → `plan` → `build` → `verify`)
7. **Prerequisite Enforcement:** Spine skills check `ambrosia.log.md` state. Pass `--force` to bypass.
8. **Log Security:** Omit/redact credentials, tokens, or keys in `ambrosia.log.md`.

---

## Bootstrap & State

- `.ambrosia/` (`plans/`, `specs/`, `ambrosia.log.md`) auto-initializes on first skill run.
- Stating a new project goal automatically triggers `audit`.
- If `.ambrosia/PARKED.md` exists, prompt to resume the parked session immediately.

