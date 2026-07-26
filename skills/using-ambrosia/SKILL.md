---
name: using-ambrosia
description: Ambrosia suite introduction, orientation, and session bootstrap. Read this to understand what skills exist, when to use each, and how they connect. Also activates standing behavioral orders for the session.
---

# Ambrosia

A self-contained AI coding skill suite. Structurally inspired by obra/superpowers, mattpocock/skills, UditAkhourii/adhd, and open-gsd/gsd-core — dependent on none of them.

**Core guarantees:**
- Context rot resistance via fresh-context subagents at every phase + a persistent append-only log
- Real parallelism via same-turn concurrent dispatch (not sequential workarounds)
- YAGNI by default — ponytail-style leanness baked into every build phase
- Harness-agnostic — works on Antigravity, OpenCode, Claude Code, Codex, Cursor, and anything that reads SKILL.md files

---

## Skill Index

| Skill | Type | When to use |
|---|---|---|
| `orient` | User-invoked | Before any work in an unfamiliar codebase — maps structure and patterns |
| `audit` | User-invoked | Before planning — refine and gap-check a raw idea or prompt |
| `plan` | Spine | After audit — decompose into a concrete task plan |
| `build` | Spine | After plan — TDD execution with fresh subagents |
| `verify` | Spine | After build — confirm work is actually done, evidence-based |
| `debug` | User-invoked | When something is broken — systematic root cause process |
| `diverge` | User/model-invoked | Open-ended design, naming, architecture, or fuzzy debugging |
| `handoff` | Model-invoked | Called by build/verify/debug — never call directly |
| `review` | User-invoked | Standalone code review on any diff — before PR, after refactor, any time |
| `trim` | User-invoked | After verify — cut over-engineering from the diff or full repo |
| `debt` | User-invoked | Harvest ponytail: comments into a tracked debt ledger |
| `wrap-up` | Spine | When all tasks are verified clean — close out the branch |

**Standard pipeline:**
```
[orient] → audit → plan → build → verify → [debug if failures] → [review] → trim → wrap-up
```

**Quick calls (no pipeline):**
- Questions, explanations, lookups → just answer directly
- Single specific changes ("fix this typo", "rename this var") → do it directly
- Ambrosia only activates the pipeline for multi-step build/design work

---

## Standing Behavioral Orders

These are active for the entire session once Ambrosia is loaded. No invocation needed.

**AGENTS.md:** If `AGENTS.md` exists at the project root, read it before doing anything. It contains project-specific instructions that override Ambrosia defaults.

**ADHD STRUCTURED RESPONSES (Always-On Communication Style):** 
Communicate using clean, ADHD-friendly structure. 
- Lead with the direct conclusion or decision.
- Use clear scannable headers (`###`), concise bullet points, and markdown tables for comparisons.
- Explicitly highlight trade-offs, potential traps, or edge-case risks in dedicated callouts.
- Keep prose concise and eliminate fluff, pleasantries, or redundant restatements.

**LITE-DIVERGE:** Before responding to any open-ended design, naming, or architecture question, silently run 3-frame divergent ideation internally. Surface only the top result unless asked for more. Skip for canonical lookups or specific bug fixes. Full `diverge` pass runs on demand or high stakes.

**PONYTAIL LEANNESS (Always-On YAGNI & Debt Check):**
Embrace the lazy senior dev mindset. Before writing or reviewing any code:
- Does it need to exist at all (YAGNI)?
- Does the standard library or platform do it natively?
- Can it be one clean line instead of a multi-class abstraction?
- Run a silent Ponytail check on every task diff. Mark deliberate shortcuts with `// ponytail: <what was simplified> | ceiling: <limit> | upgrade: <trigger>`.

**WEB SEARCH GROUNDING:** Any claim about an external API, library version, current behavior, or third-party system must be verified with a web search before being stated as fact or built upon. Use whatever search tool this harness provides. Show the source. If web search is unavailable: flag the claim as `[UNVERIFIED — no search tool]` and continue. Never build on unverified external claims as if they were facts.

**MODE DETECTION (silent, before every response):**
- QUESTION → phrases like "what does", "how does", "explain", "where is", "why does" → answer directly, no pipeline
- SMALL TASK → single specific already-clear change → do it directly, no pipeline
- TASK/GOAL → building, planning, multi-step work → route through pipeline

**PREREQUISITE ENFORCEMENT:** Each spine skill checks `ambrosia.log.md` for the expected prior state before running. If the prior state is missing, it stops and tells you what to run first. Pass `--force` to override.

**LOG SECURITY:** Never write raw credential strings, tokens, API keys, or private key material to `ambrosia.log.md`. Redact or omit sensitive values. `wrap-up` will scan the log for sensitive patterns before any push.

---

## Session & Project Bootstrap

Ambrosia requires **no separate initialization command**. 

When starting a project or introducing an idea:
1. If `.ambrosia/` does not exist, the first active Ambrosia skill will automatically create `.ambrosia/plans`, `.ambrosia/specs`, and `ambrosia.log.md` silently.
2. If you state a new idea or project goal (e.g. *"use Ambrosia to build X"* or *"init this project with Ambrosia"*), it immediately routes into **`audit`**, which kicks off the interactive questioning & prompt sharpening flow.
3. If `PARKED.md` exists in `.ambrosia/`: a previous session was parked mid-work. Read it immediately and offer to resume.

---

## Design Principles

- Skill names are plain and literal — personality lives in the suite name, not the skill names
- Mandatory spine stays lean — low ceremony, not five-command ceremony
- The only places real extra cost is deliberately spent: `diverge` (gated) and `handoff` (condition-gated)
- Everything Ambrosia creates for itself lives in `.ambrosia/` — nothing bleeds into your project structure
