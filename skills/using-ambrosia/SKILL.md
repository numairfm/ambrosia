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
| `orient` | Tool | Map codebase architecture or run architectural health audits. Modes: `orient` (full), `orient <path>` (scoped), `orient audit` (multi-frame structural scan) |
| `audit` | Tool | Refine and gap-check raw task prompts before planning |
| `plan` | Spine | Decompose audited tasks into concrete, file-mapped implementation plans |
| `build` | Spine | Execute plans via TDD using fresh, isolated subagents |
| `review` | Spine | First-class diff review after build — spec compliance, security, correctness, over-engineering |
| `verify` | Spine | Confirm work completion with empirical evidence (tests + diff) |
| `debug` | Tool | Systematic, hypothesis-driven bug fixing with automatic failure triage |
| `diverge` | Tool | Multi-frame design, naming, and architectural ideation. Modes: lite (default), `diverge full` (5 frames) |
| `trim` | Tool | Audit & strip over-engineering. Modes: `trim` (diff), `trim full` (whole repo) |
| `debt` | Tool | Harvest and track `// ponytail:` technical debt markers |
| `context` | Tool | Compress session state and produce a clean resume prompt for a fresh session |
| `retrospective` | Tool | Post-verify reflection — surface surprises, wrong assumptions, and reusable patterns |
| `deliver` | Spine | Close out branch cleanly (merge, PR, park, or rollback) |
| `ship` | Meta | Full pipeline in one shot: audit → plan → build → review → verify → deliver |
| `handoff` | System | Concurrent subagent dispatch mechanism (model-invoked) |

**Standard Pipeline:** `[orient] → audit → plan → build → review → verify → [debug] → [trim] → deliver`

**Fast Pipeline (one command):** `ship <task>`

**Direct Execution:** Questions, single-file bugfixes, or small edits bypass the pipeline and run directly.

---

## Standing Behavioral Orders

Active for all sessions once Ambrosia is loaded:

1. **AGENTS.md First:** Read `AGENTS.md` at root if present. Project rules override defaults.
2. **ADHD Structure:** Direct decisions first. Use header anchors (`###`), scannable bullet points, and trade-off tables. Zero fluff.
3. **Lite-Diverge:** Before answering open-ended design/architecture questions, route through `diverge`'s self-judge gate (open-ended? high-stakes? open phrasing? — abort if any fails). Gate passes → run lite-diverge (3 frames internally, surface top choice). Gate fails → answer directly. Do not silently run lite-diverge on questions that `diverge.md`'s gate would reject.
4. **Ponytail Leanness (YAGNI):** Prefer native stdlib/platform solutions over new abstractions. Tag deliberate shortcuts with `// ponytail: <what was simplified> | ceiling: <limit> | upgrade: <trigger>`.
5. **Web Search Grounding:** Verify external API/library assumptions before building. Mark unverified claims as `[UNVERIFIED]`.
6. **Prompt Audit & Routing:** Mode check before executing:
   - **Direct Answer / Exact Lookup:** Precise single-answer questions → answer directly.
   - **Rough, Open-Ended, or Multi-Faceted Tasks:** Any prompt with missing parameters, unstated assumptions, or open options (including codebase reviews, refactors, and features) → run `audit` first to refine prompt clarity, score it, and state assumed defaults before executing (either passing to `plan` or executing direct inspection).
   - **Multi-Step Feature / Goal:** Full pipeline (`audit` → `plan` → `build` → `review` → `verify` → `deliver`).
7. **Prerequisite Enforcement:** Spine skills check `ambrosia.log.md` state. Say `<skill> force` (e.g. `plan force`, `build force`) to bypass.
8. **Log Security:** Omit/redact credentials, tokens, or keys in `ambrosia.log.md`.
9. **Natural Language Modes:** Skills use space-separated mode words, not CLI flags (e.g. `diverge full`, not `diverge --full`). The `--` forms are accepted as fallbacks but not preferred.
10. **Zero Emojis:** Never use emojis in chat responses, progress pings, decision menus, or generated skill specifications.

---

## Standard Decision Format

Any skill presenting a choice to the user MUST adhere to harness-aware decision rules:

- **Interactive Question Tools Available:** If the host agent environment supports interactive question tools (such as `ask_question` or OpenCode question APIs), use them to render selectable choices.
- **Fallback / Standard Text Rendering:** Otherwise, render options as clean, scannable markdown lists (do NOT use code blocks, and do NOT make false "proceeding with" claims without user input).

Apply for: execution mode, model tier overrides, fix-loop escalation choices, research mode (inline vs subagent), and any other user-facing branching decision. `deliver`'s Step 7 menu is the canonical existing example — align all others to this shape.

---

## Bootstrap & State

- `.ambrosia/` (`plans/`, `specs/`, `context.md`, `ambrosia.log.md`, `trim-decline.md`) auto-initializes on first skill run.
- **Session Tagging:** Upon bootstrap, generate a unique 4-character alphanumeric session tag (e.g. `[a1b2]`). Prefix all `ambrosia.log.md` appends with the active session tag (e.g. `<timestamp> [<session-tag>] [skill] log entry`).
- Stating a new project goal automatically triggers `audit`.
- If `.ambrosia/PARKED.md` exists, prompt to resume the parked session immediately.
- If `.ambrosia/context.md` exists from a previous session, read it before doing anything else.
- After `deliver` closes out a significant branch, consider running `retrospective` to capture learning before starting the next task.
