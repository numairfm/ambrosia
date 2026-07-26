---
name: diverge
description: Parallel divergent ideation for open-ended design, naming, architecture, API surface, and fuzzy debugging. Runs isolated cognitive frames, scores, prunes traps, deepens top survivors. Use on "diverge", "ADHD mode", "look at different angles", "explore options", "brainstorm", "what are we missing", or any open-ended design/strategy question. Skip for syntax, lookups, bugs with known root cause, or closed phrasing ("quick", "standard", "canonical", "just").
---

# Diverge

Explore alternative designs, naming, architectures, or debugging hypotheses before committing to one path.

**Two Tiers:**
- **Lite-Diverge (Default/Inline):** Silently brainstorm 3 distinct options internally. Surface only the top recommended option with a 1-sentence trade-off summary.
- **Full-Diverge (`diverge full`):** Execute a complete 3-frame divergent matrix across architectural, UX, and operational axes.

---

## Process (Full-Diverge)

**Step 1 — Explicit invocation check.**

If the user typed `diverge`, "ADHD mode", "use diverge", "look at different angles", "explore options", "brainstorm this", "what are we missing", or similar: **skip the rest of this section and go straight to mode selection.** The user opted in. Do not second-guess.

**Step 2 — Self-judge (only if Step 1 did not match).**

Ask three questions. If the answer to ANY is no, ABORT and answer directly.

1. **Open-ended?** Would a senior engineer give multiple viable answers, or is there one canonical answer? If canonical, abort.
2. **High-stakes?** Is the cost of the obvious answer being wrong actually high? Architecture decisions, public API surfaces, product naming, schema design = yes. Side project config tweak = no.
3. **Open phrasing?** Did the user avoid words like "quick", "standard", "canonical", "textbook", "just", "one-line"? If any present, abort.

If all three pass: proceed to mode selection.
If any fails: answer directly. Optionally append: *"For wider exploration under parallel cognitive frames, say `diverge <your problem>`."*

**Step 3 — Intent Detection & Mode Selection.**

Analyze the user's prompt for **semantic intensity**:

- **Full Mode (5 Frames Matrix):** Trigger automatically if the request implies deep, maximum, exhaustive, or intensive exploration. Look for intensity signals like *"to the max"*, *"intensely"*, *"don't miss anything"*, *"full"*, *"thoroughly"*, *"deep dive"*, *"every angle"*, *"all options"*, or high-stakes architectural/API decisions.
- **Lite Mode (3 Frames Inline - Default Fallback):** Trigger for standard/casual design questions, quick brainstorm requests, or when auto-triggered by the self-judge gate without intense phrasing.

---

## Phase 1 — Diverge (no critic)

Two strict phases. Mixing them kills idea quality — the critic strangles the generator.

**Pick frames from the table below.** Lite: pick 3. Full: pick 5. Bias toward engineering frames for code-shaped problems. Always include at least one wild frame.

For each frame, dispatch one **parallel** Agent/Task call. Each agent receives ONLY:
- The problem
- Any context the user provided
- The frame's vantage prompt
- This system instruction:

> You are in DIVERGENT mode. You are a generator, not a critic.
> Generate 6 short distinct ideas under this frame. Each idea is one phrase or one sentence. Do not evaluate. Do not rank. Do not hedge.
> The first three obvious answers everyone would give are banned. Push past them into the awkward middle.
> Output a JSON array only. No prose before or after.
> `[{"text": "...", "rationale": "..."}, ...]`

**Critical invariant:** All agent calls MUST be issued in the same response turn. Do NOT serialize them. Do NOT pass one branch's output as context to another. Branches that see each other anchor each other — the whole method collapses.

**Protocol note:** This dispatch follows the same invariant as `handoff`. If called from within an active `build` or `verify` session, prefer routing through `handoff` rather than re-implementing dispatch inline — so any future protocol changes propagate automatically.

### Frame table

| Frame | Vantage prompt | Best for |
|---|---|---|
| **Hardware engineer** | You think in latency, memory layout, and failure modes. Everything is a tradeoff between throughput and safety. | Performance, infra, systems |
| **10-year-old** | You ask "why does this have to be so complicated?" You want the simplest thing that could possibly work. | Simplification, API design |
| **Speedrunner** | You optimize for the fastest path to a working result. You skip everything optional. | Prototyping, MVP scope |
| **Regulator** | You look for what goes wrong, what fails silently, what the spec doesn't cover. | Risk analysis, edge cases |
| **Biology/evolution** | You ask what survives in real use and what gets selected out over time. | Long-term design, adoption |
| **$0 budget** | You build with what already exists — stdlib, platform primitives, zero new deps. | Dependency reduction |
| **Domain outsider** | You know nothing about this field's conventions and question every assumption. | Naming, UX, first-principles |
| **Compiler** | You think in types, invariants, and what the machine actually does. | Type design, correctness |
| **Anthropologist** | You study how people actually use tools vs how they're supposed to. | UX, developer experience |
| **Archaeologist** | You ask what buried assumption is making this hard. | Fuzzy debugging, architecture |

---

## Phase 2 — Focus (critic on)

After all branches return:

**1. Score.** Rate each idea on three axes 0-10:
- **Novelty** (0.35 weight) — distance from the obvious default
- **Viability** (0.40 weight) — could it actually ship?
- **Fit** (0.25 weight) — does it address the stated problem?

For any idea that looks attractive but is a trap (hidden cost, false economy, won't scale, premature abstraction): flag it with a one-line reason.

**2. Cluster.** Group ideas into 3-6 clusters by underlying angle, not surface keywords. Label by angle, not topic.

**3. Deepen the top 3.** Rank by weighted score, exclude traps, take top 3. For each, dispatch one Agent call:

> You are in FOCUS mode. Take one promising idea and connect dots.
> Sketch how it would actually work in 4-8 sentences. Name the load-bearing risk. Name the first concrete step a coder would take.
> Then generate 3-5 sub-ideas that branch off (variations, combinations, things this unlocks).
> Output JSON only.

**4. Present.** Show the top 3 deepened ideas with scores, cluster labels, traps flagged. Keep it scannable — the user picks, not the model.

---

## Completion

Append to `ambrosia.log.md`:
```
<timestamp> [diverge] <mode> — <N> frames, top idea: <one-line summary>
```
